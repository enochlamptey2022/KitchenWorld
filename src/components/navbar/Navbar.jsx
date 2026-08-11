import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import promoImage from "../../assets/kitchen2.png";

const MENU_ITEMS = [
  "New In",
  "Electricals",
  "Cookware & Bakeware",
  "Knives",
  "Tableware",
  "Accessories",
];

const TEMP_CARD_ITEMS = [
  "New arrivals",
  "Trending now",
  "Top rated",
  "Staff picks",
  "Best sellers",
  "Gift ideas",
];

const TEMP_COLUMNS = [
  {
    title: "New In",
    links: ["New cookware", "New bakeware", "New utensils", "Latest arrivals"],
  },
  {
    title: "Trending",
    links: ["Most viewed", "Popular this week", "Top picks", "Limited stock"],
  },
  {
    title: "Collections",
    links: ["Family favourites", "Everyday essentials", "Pro range", "Gift bundles"],
  },
  {
    title: "Shop By Need",
    links: ["Quick meals", "Meal prep", "Weekend baking", "Hosting at home"],
  },
  {
    title: "Price Bands",
    links: ["Under GHc100", "Under GHc200", "Premium picks", "Offers"],
  },
  {
    title: "Need Help",
    links: ["Buying guides", "Care tips", "Compare ranges", "Customer favourites"],
  },
];

const DROPDOWN_CONTENT = {
  "New In": {
    cards: TEMP_CARD_ITEMS,
    columns: TEMP_COLUMNS,
  },
  Electricals: {
    cards: ["Air fryers", "Blenders", "Kettles", "Toasters", "Coffee makers", "Mixers"],
    columns: [
      {
        title: "Preparation",
        links: ["Food processors", "Hand blenders", "Stand mixers", "Choppers"],
      },
      {
        title: "Breakfast",
        links: ["Toasters", "Kettles", "Coffee machines", "Slow juicers"],
      },
      {
        title: "Cooking",
        links: ["Air fryers", "Multi cookers", "Rice cookers", "Microwaves"],
      },
      {
        title: "Cleaning",
        links: ["Dish racks", "Brushes", "Cordless cleaners", "Steam cleaners"],
      },
      {
        title: "Shop By Price",
        links: ["Under GHc200", "Under GHc500", "Premium", "Top deals"],
      },
      {
        title: "Popular",
        links: ["Best sellers", "New launches", "Top rated", "Bundle offers"],
      },
    ],
  },
  "Cookware & Bakeware": {
    cards: ["Pots and pans", "Cookware sets", "Cast iron", "Baking trays", "Roasting", "Oven dishes"],
    columns: [
      {
        title: "Pots and Pans",
        links: ["Saucepans", "Frying pans", "Woks", "Saute pans"],
      },
      {
        title: "Cookware Sets",
        links: ["Family sets", "Starter sets", "Premium sets", "Induction sets"],
      },
      {
        title: "Cast Iron",
        links: ["Casseroles", "Skillets", "Griddles", "Dutch ovens"],
      },
      {
        title: "Baking",
        links: ["Baking trays", "Cake tins", "Muffin tins", "Cooling racks"],
      },
      {
        title: "Roasting",
        links: ["Roasting tins", "Roasting trays", "Rack sets", "Basters"],
      },
      {
        title: "Speciality",
        links: ["Paella pans", "Crepe pans", "Pizza stones", "Tagines"],
      },
    ],
  },
  Knives: {
    cards: ["Chef knives", "Knife sets", "Paring", "Santoku", "Sharpeners", "Boards"],
    columns: [
      {
        title: "Knife Types",
        links: ["Chef knives", "Santoku knives", "Paring knives", "Bread knives"],
      },
      {
        title: "Knife Sets",
        links: ["3-piece sets", "5-piece sets", "Block sets", "Starter sets"],
      },
      {
        title: "Storage",
        links: ["Knife blocks", "Magnetic bars", "Sheaths", "Drawer trays"],
      },
      {
        title: "Sharpening",
        links: ["Whetstones", "Sharpening rods", "Pull-through", "Care kits"],
      },
      {
        title: "Accessories",
        links: ["Chopping boards", "Scissors", "Peelers", "Kitchen shears"],
      },
      {
        title: "Collections",
        links: ["Classic", "Damascus", "Professional", "Everyday"],
      },
    ],
  },
  Tableware: {
    cards: ["Dinner sets", "Plates", "Bowls", "Mugs", "Cutlery", "Serving"],
    columns: [
      {
        title: "Dining Sets",
        links: ["4-person sets", "6-person sets", "Stoneware", "Porcelain"],
      },
      {
        title: "Plates",
        links: ["Dinner plates", "Side plates", "Pasta bowls", "Serving platters"],
      },
      {
        title: "Drinkware",
        links: ["Tumblers", "Wine glasses", "Mugs", "Carafes"],
      },
      {
        title: "Cutlery",
        links: ["Cutlery sets", "Steak knives", "Serving spoons", "Tea spoons"],
      },
      {
        title: "Hosting",
        links: ["Serving boards", "Dip bowls", "Cake stands", "Napkin holders"],
      },
      {
        title: "Shop By Colour",
        links: ["Neutral", "Black", "Pastels", "Seasonal"],
      },
    ],
  },
  Accessories: {
    cards: ["Utensils", "Storage", "Gadgets", "Textiles", "Cleaning", "Bar tools"],
    columns: [
      {
        title: "Utensils",
        links: ["Spatulas", "Tongs", "Whisks", "Ladles"],
      },
      {
        title: "Storage",
        links: ["Food containers", "Spice jars", "Pan lids", "Organisers"],
      },
      {
        title: "Kitchen Gadgets",
        links: ["Graters", "Can openers", "Timers", "Thermometers"],
      },
      {
        title: "Textiles",
        links: ["Aprons", "Oven gloves", "Tea towels", "Table mats"],
      },
      {
        title: "Cleaning",
        links: ["Dish brushes", "Drainers", "Sink caddies", "Cloths"],
      },
      {
        title: "Bar & Serve",
        links: ["Cocktail tools", "Ice trays", "Bottle stoppers", "Pourers"],
      },
    ],
  },
};

function toCategoryLink(value) {
  return `/shop?category=${encodeURIComponent(value.toLowerCase())}`;
}

function Navbar() {
  const [activeMenu, setActiveMenu] = useState("");
  const content = DROPDOWN_CONTENT[activeMenu];

  return (
    <nav className="navbar" onMouseLeave={() => setActiveMenu("") }>
      <ul className="navbar-menu">
        {MENU_ITEMS.map((item) => (
          <li
            key={item}
            className={activeMenu === item ? "menu-item active" : "menu-item"}
            onMouseEnter={() => setActiveMenu(item)}
          >
            <Link to={toCategoryLink(item)}>{item}</Link>
          </li>
        ))}
      </ul>

      {content && (
        <div className="mega-menu">
          <div className="mega-menu-inner">
            <div className="mega-top-row">
              <div className="mega-cards-grid">
                {content.cards.map((card) => (
                  <Link key={card} to={toCategoryLink(card)} className="mega-card">
                    <span className="mega-card-icon" aria-hidden="true"></span>
                    <span>{card}</span>
                  </Link>
                ))}
              </div>

              <div className="mega-promo">
                <img src={promoImage} alt="Kitchen promotion" />
              </div>
            </div>

            <div className="mega-columns">
              {content.columns.map((column) => (
                <div key={column.title} className="mega-column">
                  <h4>{column.title}</h4>

                  {column.links.map((link) => (
                    <Link key={link} to={toCategoryLink(link)} className="mega-sub-link">
                      {link}
                    </Link>
                  ))}

                  <Link to={toCategoryLink(column.title)} className="mega-shop-all">
                    Shop all
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;