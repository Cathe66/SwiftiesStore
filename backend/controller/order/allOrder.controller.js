const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderProductModel");

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId;

        // Fetch the user and check if they have admin privileges
        const user = await userModel.findById(userId);

        if (!user || user.role !== 'ADMIN') {
            return response.status(500).json({
                message: "Access denied",
            });
        }

        // Fetch all orders, sorted by creation date in descending order
        const AllOrder = await orderModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            data: AllOrder,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = allOrderController;
