const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
    },
    image: {
        type: String,
    },
    isSubscribed: {
        type: Boolean,
        default: false,
    },
    subscription: {
        plan: String,
        status: String,
        currentPeriodEnd: Date,
        stripeCustomerId: String,
        stripeSubscriptionId: String,
    },
});

// const User = models.User || model("User", UserSchema);

// export default User;
module.exports = mongoose.model("user", UserSchema);