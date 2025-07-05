// const express = require('express');
// const payment_router = express.Router();

// const { createCheckoutSession } = require('../Services/stripeService');
// // const authMiddleware = require('../middleware/auth');

// // Get Stripe publishable key
// payment_router.get('/config', (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

// // Create checkout session
// payment_router.post('/create-checkout-session/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { priceId } = req.body;

//     console.log("in Payment API.......")
//     console.log("user id.......",userId)
//     console.log("price Id.......",priceId)

//     const session = await createCheckoutSession(userId, priceId);
//     res.send({ sessionId: session.id });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

// module.exports = payment_router;

































// Routes/payment.js
const express = require('express');
const payment_router = express.Router();
const Stripe = require('stripe');

const user_model = require("../Model-Schema/user")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
payment_router.post('/create-checkout-session/:userId', async (req, res) => {

    const { userId } = req.params;
    const { planId, email } = req.body;
    // const { priceId } = req.body;

    console.log("userId", userId)
    console.log("planId", planId)
    console.log("email", email)

    try {
        // Example: define your prices in Stripe Dashboard first.
        // Each plan should have a price ID from Stripe.
        const priceId = getPriceId(planId); // you define this helper

        console.log("priceId", priceId)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription', // recurring billing
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // customer_email: req.body.email, // optional
            metadata: {
                plan: planId, // pass 'basic', 'standard', or 'premium'
                userEmail: email, // optional but useful
            },
            success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment-cancel`,
        });

        res.json({
            success: true,
            email,
            url: session.url
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Helper: map plan name/id to Stripe Price ID
function getPriceId(planId) {
    switch (planId) {
        case 'basic':
            //     return 'price_1RewXxB3VaDYwKFkU9Wl1ah4'; // replace with real
            // case 'standard':
            //     return 'price_1RewbaB3VaDYwKFk0ycWqrRn';
            // case 'premium':
            //     return 'price_1RewhnB3VaDYwKFksqTgepDh';

            return process.env.STRIP_BASIC_PRICE; // replace with real
        case 'standard':
            return process.env.STRIP_STANDARD_PRICE;
        case 'premium':
            return process.env.STRIP_PREMIUM_PRICE;
        default:
            throw new Error('Invalid plan ID');
    }
}



// payment_router.get('/verify-session/:sessionId', async (req, res) => {
//     const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

//     if (session.payment_status === 'paid') {
//         // TODO: Update user plan in MongoDB based on email or metadata
//         return res.json({ success: true });
//     } else {
//         return res.status(400).json({ success: false });
//     }
// });


payment_router.get('/verify-session/:sessionId/:email', async (req, res) => {
    try {
        console.log("== jjjjjjjjjjjjjjjjjjj ===")

        const { email } = req.params;
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        console.log("== EMAIL ===", email)
        console.log("== metadata ===", session.metadata.plan)
        console.log("== SSS ===", session)

        if (session.payment_status === 'paid') {
            // Option 1: If you passed customer email
            const customerEmail = session.customer_email;

            // OR Option 2: If you saved metadata.userId
            // const userId = session.metadata.userId;

            // OR Option 3: Use session.customer (Stripe Customer ID)
            const stripeCustomerId = session.customer;

            // const user = await User.findOne({ stripeCustomerId }); // or find by email or _id

            const user = await user_model.findOne({ email: session.metadata.userEmail }); // or find by email or _id

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Update subscription details
            user.isSubscribed = true;
            user.subscription = {
                plan: session.metadata.plan, // you can also pass this via metadata
                status: 'active',
                currentPeriodEnd: new Date(session.expires_at * 1000), // optional
                stripeCustomerId: stripeCustomerId,
                stripeSubscriptionId: session.subscription,
            };

            const updateUser = await user.save();
            console.log("==== UUUUUUU ====", updateUser)
            // const user = await user_model.findOne({ email:session.metadata.userEmail });

            return res.json({
                success: true,
                user: updateUser
            });
        } else {
            return res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});







module.exports = payment_router;
