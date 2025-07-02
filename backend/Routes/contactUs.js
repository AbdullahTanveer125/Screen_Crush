const express = require("express")
const contact_us_model = require("../Model-Schema/contactUs")


//router object
const contact_us_router = express.Router();
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



// GET all contact messages
contact_us_router.get('/get_contacts', async (req, res) => {
    try {
        const contacts = await contact_us_model.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Get contact data Successfully!",
            contacts,
        });
        // res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = contact_us_router;