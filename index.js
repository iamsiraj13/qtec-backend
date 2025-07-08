const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;
const MONGODB_URI =
  "mongodb+srv://iamsiraj13:iamsiraj13@cluster0.4tdkj.mongodb.net/ecommerce-task";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  price: Number,
  image: String,
  description: String,
});
const Product = mongoose.model("Product", productSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  image: String,
  quantity: Number,
});
const Cart = mongoose.model("Cart", cartSchema);

// Initialize products if collection is empty
async function initializeProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const initialProducts = [
      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        price: 9.99,
        image:
          "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
        description:
          "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
      },
      {
        id: 2,
        title: "Eyeshadow Palette with Mirror",
        price: 19.99,
        image:
          "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp",
        description:
          "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
      },
      {
        id: 3,
        title: "Powder Canister",
        price: 14.99,
        image:
          "https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp",
        description:
          "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
      },
      {
        id: 4,
        title: "Red Lipstick",
        price: 12.99,
        image:
          "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp",
        description:
          "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
      },
      {
        id: 5,
        title: "Red Nail Polish",
        price: 8.99,
        image:
          "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp",
        description:
          "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
      },
      {
        id: 6,
        title: "Calvin Klein CK One",
        price: 49.99,
        image:
          "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp",
        description:
          "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
      },
    ];
    await Product.insertMany(initialProducts);
    console.log("Initial products inserted");
  }
}

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
// Get single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});
// Get cart
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
app.post("/api/cart", async (req, res) => {
  try {
    const newItem = req.body;
    const existingItem = await Cart.findOne({ id: newItem.id });
    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
    } else {
      const cartItem = new Cart({ ...newItem, quantity: 1 });
      await cartItem.save();
    }
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Update cart item quantity
app.put("/api/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await Cart.findOne({ id: parseInt(id) });
    if (item && quantity >= 1) {
      item.quantity = quantity;
      await item.save();
    }
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});
// Remove from cart
app.delete("/api/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.deleteOne({ id: parseInt(id) });
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Clear cart (for checkout)
app.delete("/api/cart", async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// Start server
async function startServer() {
  await initializeProducts();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
