const express=require("express")
const contact_us_model = require("../Model-Schema/contactUs")


//router object
const contact_us_router=express.Router();
// const contact_us_router = express.Router();







contact_us_router.post('/contact', async (req, res) => {
    try {
        console.log("We are in contact_us")
        const result = await contact_us_model.create(req.body);
        // const newContact = new contact_us_model(req.body);
        // const result = await newContact.save();
        res.status(201).json({
            success: true,
            message: "Message receive Successfully!",
            result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Message receive in Contact_Us",
            error,
        });
    }
});


module.exports=contact_us_router;