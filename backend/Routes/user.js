
const express = require("express")
const user_model = require("../Model-Schema/user")

const JWT = require("jsonwebtoken");

//router object
const user_router = express.Router();



user_router.post("/login", async (req, res) => {
  try {
    const { email, username, image } = req.body;

    const existingUser = await user_model.findOne({ email });



    if (!existingUser) {
      const response = await user_model.create({ email, username, image });
      console.log("DDDDDDDDDDDD:", response)
      const token = await JWT.sign({ _id: response._id }, "abdullah", { expiresIn: "7d" });
      res.status(200).json({
        success: true,
        message: "Login Successfully!",
        token,
        user: response,
      });
    }

    console.log("console before token.......")
    // console.log("DDDDDDDDDDDD:", response)
    const token = await JWT.sign({ _id: existingUser._id }, "abdullah", { expiresIn: "7d" });

    console.log("EEEEEEEEEEE:", existingUser)

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      token,
      user: existingUser
    });

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

