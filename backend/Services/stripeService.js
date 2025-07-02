const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create subscription plans (run this once)
const createPlans = async () => {
    const plans = [
        {
            name: 'Basic',
            price: 499, // $4.99
            interval: 'month',
            productData: { name: 'Basic Plan' },
        },
        {
            name: 'Standard',
            price: 999, // $9.99
            interval: 'month',
            productData: { name: 'Standard Plan' },
        },
        {
            name: 'Premium',
            price: 1499, // $14.99
            interval: 'month',
            productData: { name: 'Premium Plan' },
        },
    ];

    for (const plan of plans) {
        const product = await stripe.products.create({
            name: plan.productData.name,
        });

        await stripe.prices.create({
            product: product.id,
            unit_amount: plan.price,
            currency: 'usd',
            recurring: {
                interval: plan.interval,
            },
        });
    }
};

// Create checkout session
const createCheckoutSession = async (userId, priceId) => {


    console.log("in stripe user id.......", userId)
    console.log("in stripe price Id.......", priceId)
    console.log("in stripe process.env.CLIENT_URL.......", process.env.CLIENT_URL)
    

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
        metadata: {
            userId: userId.toString(),
        },
    });

    return session;
};

module.exports = { createPlans, createCheckoutSession };