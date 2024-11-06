const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel');

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body;
        
        // Fetch the user from the database
        const user = await userModel.findOne({ _id: request.userId });

       

        // Stripe requires unit_amount in the smallest currency unit (cents for USD)
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: 'shr_1Q8xyYRopSuYdXwbf8o5ma6j'
                }
            ],
            customer_email: user.email,
            metadata:{
                userId:request.userId
            },
            line_items: cartItems.map((item) => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.productId.productName,
                            images: item.productId.productImage,
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        // Multiply by 100 to convert dollars to cents and ensure it's an integer
                        unit_amount: Math.round(item.productId.sellingPrice * 100), 
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                };
            }),
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        };

        // Create a new Stripe session
        const session = await stripe.checkout.sessions.create(params);

        // Return the session details in the response
        response.status(303).json(session);

    } catch (error) {
        response.json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = paymentController;
