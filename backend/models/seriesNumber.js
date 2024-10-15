const mongoose = require('mongoose');

const seriesNumberSchema = new mongoose.Schema({
    seriesName: {
        type: String,
        required: true,
        unique: true
    },
    seriesValue: {
        //Date Of Business ENtry
        type: Number,
        required: true,
        default: Date.now
    },
    description: {
        //Business Category
        type: String,
       
        required: true
    },

}, { collection: "seriesNumber", timestamps: true });


module.exports = mongoose.model(`seriesNumber`, seriesNumberSchema);