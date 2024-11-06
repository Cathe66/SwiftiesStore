const mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    orderName: String,
    number: Number,
    address: String,
    zipcode: String,
    city: String,
    country: String
},{
    timestamps : true
})


const addressModel =  mongoose.model("address",addressSchema)


module.exports = addressModel