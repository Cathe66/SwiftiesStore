const addressModel = require("../../models/addressModel");

async function UploadAddressController(req, res) {
    try {
        const uploadAddress = new addressModel(req.body);
        const saveAddress = await uploadAddress.save();
        res.status(201).json({
            message: "Address uploaded successfully",
            error: false,
            success: true,
            data: saveAddress
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadAddressController;
