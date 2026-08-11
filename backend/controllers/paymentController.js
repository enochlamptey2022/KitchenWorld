import pool from "../config/db.js";


// ======================================
// INITIALIZE PAYMENT
// ======================================

const initializePayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    const orderResult = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1
       AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    if (order.payment_status === "Paid") {
      return res.status(400).json({
        message: "Order has already been paid",
      });
    }

    const amount = Math.round(
      Number(order.total_amount) * 100
    );

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: order.email,
          amount,
          currency: "GHS",

          metadata: {
            orderId: order.id,
            userId,
          },

          callback_url:
            "http://localhost:5173/payment/callback",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({
        message:
          data.message ||
          "Unable to initialize payment",
      });
    }

    await pool.query(
      `UPDATE orders
       SET payment_reference = $1
       WHERE id = $2`,
      [
        data.data.reference,
        order.id,
      ]
    );

    res.status(200).json({
      message: "Payment initialized",

      authorizationUrl:
        data.data.authorization_url,

      reference:
        data.data.reference,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================
// VERIFY PAYMENT
// ======================================

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reference } = req.params;

    const orderResult = await pool.query(
      `SELECT *
       FROM orders
       WHERE payment_reference = $1
       AND user_id = $2`,
      [reference, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({
        message:
          data.message ||
          "Unable to verify payment",
      });
    }

    const payment = data.data;

    const expectedAmount = Math.round(
      Number(order.total_amount) * 100
    );

    if (
      payment.status !== "success"
    ) {
      return res.status(400).json({
        message: "Payment was not successful",
        paymentStatus: payment.status,
      });
    }

    if (
      Number(payment.amount) !==
      expectedAmount
    ) {
      return res.status(400).json({
        message: "Payment amount does not match order total",
      });
    }

    await pool.query(
      `UPDATE orders
       SET payment_status = 'Paid'
       WHERE id = $1`,
      [order.id]
    );

    res.status(200).json({
      message: "Payment verified successfully",

      orderId: order.id,

      paymentStatus: "Paid",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


export {
  initializePayment,
  verifyPayment,
};