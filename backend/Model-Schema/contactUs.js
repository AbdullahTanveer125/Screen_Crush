const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your Full Name!"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please enter your email!"],
            unique: true,
            trim: true
        },
        phone: {
            type: Number,
            required: [true, "Please enter your Phone!"],
            unique: true,
            trim: true
        },
        comment: {
            type: String,
            required: [true, "Please enter your Comment!"],
            trim: true
        }
    },
    { timestamps: true }
);

// export default mongoose.model('Contact_Us', contact_us_Schema);

module.exports = mongoose.model("contactUs", contactUsSchema);