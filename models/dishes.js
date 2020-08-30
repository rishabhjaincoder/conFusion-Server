const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// here we are adding mongoose currency in this node module and then
//      adding in this file form mongoose
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Dishes = mongoose.model('dish', dishSchema);

module.exports = Dishes;    