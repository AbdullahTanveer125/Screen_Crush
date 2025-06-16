const express=require("express")
const user_model = require("../Model-Schema/user")


//router object
const user_router=express.Router();

user_router.post("/login", async (req, res) => {
  try {
    const { email, username, image } = req.body;

    const existingUser = await user_model.findOne({ email });
    if (!existingUser) {
      await user_model.create({ email, username, image });
    }

    res.status(200).json({
            success: true,
            message: "Login Successfully!",
            // result,
        });
  } catch (err) {
    console.error("Error storing user:", err.message);
    res.status(500).json({ success: false });
  }
});

module.exports = user_router;

