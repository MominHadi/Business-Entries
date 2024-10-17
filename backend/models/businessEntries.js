const mongoose = require('mongoose');

const businessEntriesSchema = new mongoose.Schema({
    invoiceNo: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        //Date Of Business ENtry
        type: Date,
        required: true,
        default: Date.now
    },
    category: {
        //Business Category
        type: String,
        enum: ['Attestation', 'Visa Application', 'Travel Insurance', 'Hotel Booking'],
        required: true
    },
    subCategory: {
        //Business Sub-Category
        type: String,
        // enum: ['Indian Apostille', 'Dubai Embassy and Mofa', 'Others'],
        // required: true
    },
    customerName: {
        type: String,
        required: true
    },
    companyName: {
        //Customer Company Name
        type: String,
        required: false
    },
    contactNo: {
        type: String
    },
    passportNo: {
        type: String,
        // required: true
    },
    nationality: {
        type: String,
        required: true
    },

    notes: {
        type: String,
    },
    items: [
        {
            name: {
                type: String,
                required: true
            },
            units: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true
            },
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    invoiceCorrection: {
        type: String
    },
    status: {
        type: String,
        enum: ["Direct"],
        default: "Direct"
    }
}, { collection: "businessEntries", timestamps: true });


module.exports = mongoose.model(`businessEntries`, businessEntriesSchema);