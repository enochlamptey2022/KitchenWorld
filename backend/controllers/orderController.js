import pool from "../config/db.js";


// =====================================
// CREATE ORDER
// =====================================

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    // Get logged-in user's ID from JWT
    const userId = req.user.userId;

    // Get information sent from Checkout.jsx
    const {
      items,
      deliveryMethod,
      deliveryFee,

      fullName,
      email,
      phone,
      address,
      city,
      region,
    } = req.body;


    // =====================================
    // CHECK CART
    // =====================================

    if (!items || items.length === 0) {
      return res.status(400).json({
        message:
          "Order must contain at least one item",
      });
    }


    // =====================================
    // CHECK SHIPPING INFORMATION
    // =====================================

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !region
    ) {
      return res.status(400).json({
        message:
          "All shipping information is required",
      });
    }


    // Start database transaction
    await client.query("BEGIN");

    let totalAmount = 0;


    // =====================================
    // CHECK PRODUCTS + CALCULATE TOTAL
    // =====================================

    for (const item of items) {

      const productResult =
        await client.query(
          `SELECT
             id,
             name,
             price,
             stock
           FROM products
           WHERE id = $1`,
          [item.productId]
        );


      // Product doesn't exist
      if (
        productResult.rows.length === 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res.status(404).json({
          message:
            `Product ${item.productId} not found`,
        });
      }


      const product =
        productResult.rows[0];


      // Not enough stock
      if (
        item.quantity >
        product.stock
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}`,
        });
      }


      // Add product price to total
      totalAmount +=
        Number(product.price) *
        Number(item.quantity);
    }


    // =====================================
    // DELIVERY FEE
    // =====================================

    const finalDeliveryFee =
      Number(deliveryFee) || 0;

    totalAmount +=
      finalDeliveryFee;


    // =====================================
    // CREATE ORDER
    // =====================================

    const orderResult =
      await client.query(
        `INSERT INTO orders
        (
          user_id,
          total_amount,
          delivery_method,
          delivery_fee,
          full_name,
          email,
          phone,
          address,
          city,
          region
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )

        RETURNING *`,

        [
          userId,
          totalAmount,
          deliveryMethod || "standard",
          finalDeliveryFee,

          fullName,
          email,
          phone,
          address,
          city,
          region,
        ]
      );


    const order =
      orderResult.rows[0];


    // =====================================
    // CREATE ORDER ITEMS
    // =====================================

    for (const item of items) {

      const productResult =
        await client.query(
          `SELECT price
           FROM products
           WHERE id = $1`,
          [item.productId]
        );


      const product =
        productResult.rows[0];


      // Save individual product
      await client.query(
        `INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )

        VALUES (
          $1,
          $2,
          $3,
          $4
        )`,

        [
          order.id,
          item.productId,
          item.quantity,
          product.price,
        ]
      );


      // Reduce product stock
      await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2`,

        [
          item.quantity,
          item.productId,
        ]
      );
    }


    // Everything worked
    await client.query(
      "COMMIT"
    );


    // Send response
    res.status(201).json({
      message:
        "Order created successfully",

      order,
    });


  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });


  } finally {

    client.release();

  }
};


// =====================================
// GET LOGGED-IN USER'S ORDERS
// =====================================

const getMyOrders = async (req, res) => {

  try {

    const userId =
      req.user.userId;


    const result =
      await pool.query(
        `SELECT *
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC`,

        [userId]
      );


    res.status(200).json(
      result.rows
    );


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// =====================================
// ADMIN: GET ALL ORDERS
// =====================================

const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         orders.*,
         users.full_name AS customer_name,
         users.email AS customer_email
       FROM orders
       JOIN users
         ON orders.user_id = users.id
       ORDER BY orders.created_at DESC`
    );

    res.status(200).json(
      result.rows
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================
// ADMIN: UPDATE ORDER STATUS
// =====================================

const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid order status",
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [
        status,
        id,
      ]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    res.status(200).json({
      message:
        "Order status updated successfully",

      order:
        result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================
// EXPORTS
// =====================================

export {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};