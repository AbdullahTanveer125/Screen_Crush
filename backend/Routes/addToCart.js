const express = require("express")

//router object
const addToCart_router = express.Router();

const addToCart_model = require("../Model-Schema/addToCart")
const user_model = require("../Model-Schema/user")

addToCart_router.post('/user/favorite', async (req, res) => {
    try {
        // console.log("SSSSSS")
        const { userId, movie } = req.body;

        // Find user
        const user = await user_model.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if already in cart
        const alreadyInCart = await addToCart_model.findOne({
            userId: user._id,
            'movie.id': movie.id,
        });

        if (alreadyInCart) {
            return res.status(200).json({ success: true, message: 'Already in cart' });
        }

        // Save to cart
        const newCartItem = new addToCart_model({
            userId: user._id,
            movie,
        });

        await newCartItem.save();

        res.status(200).json({ success: true, message: 'Added to cart' });
    } catch (err) {
        console.error('Error adding to cart:', err.message);
        res.status(500).json({ success: false });
    }
});

// GET: Get all cart items for a specific user
addToCart_router.get("/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const cartItems = await addToCart_model.find({ userId });

    res.status(200).json({
      success: true,
      message:"Your favourite movies",
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});






// DELETE /cart/:userId/:movieId
addToCart_router.delete("/cart/:userId/:movieId", async (req, res) => {
  try {

    console.log("in delete API.......")
    const { userId, movieId } = req.params;

    
    console.log("userId ===", userId)
    console.log("movieId===", movieId)


    const result = await addToCart_model.findOneAndDelete({
      userId: userId,
      "movie.id": movieId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting cart item:", err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});



module.exports = addToCart_router;