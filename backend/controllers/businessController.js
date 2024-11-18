const BusinessEntries = require('../models/businessEntries');
const SeriesNumber = require('../models/seriesNumber');
const mongoose = require('mongoose');
const { createInvoice } = require('../utils/generatePdf');

exports.getLatestInvoiceNo = async (req, res) => {
    try {
        const data = await SeriesNumber.findOne({ seriesName: "invoiceNumber" }).select(' seriesValue -_id')

        if (!data) {
            return res.status(404).json({ message: 'Data Not Found' })
        }

        res.status(200).json({ status: 'Success', data })
    } catch (error) {

        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}


exports.saveBusinessEntries = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let { invoiceNo, date, businessCategory, subCategory,
            customerName, companyName, contactNo,
            passportNo, nationality, notes, items, totalAmount
            , paymentStatus, paymentMethod, reference } = req.body;

        console.log(req.body, 'Request Body');

        if (!invoiceNo) {
            return res.status(404).json({ status: 'Failed', message: "Invoice no. is required" })
        }

        const isInvoiceExist = await BusinessEntries.findOne({ invoiceNo });

        if (isInvoiceExist) {
            return res.status(409).json({ status: "Failed", message: "Invoice No. already exists" });
        }

        if (businessCategory && !['Attestation', 'Visa Application', 'Travel Insurance', 'Hotel Booking'].includes(businessCategory)) {
            return res.status(400).json({ status: "Failed", message: "Enter Valid Category" });
        }

        // Create the paymentIn document
        const savedBusinessEntry = await BusinessEntries.create([{
            invoiceNo,
            date,
            category: businessCategory,
            subCategory,
            customerName,
            companyName,
            contactNo,
            passportNo,
            nationality,
            notes,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus,
            reference
        }], { session });

        //Updating Invoice No.

        const updatedSeries = await SeriesNumber.findOneAndUpdate(
            { seriesName: 'invoiceNumber' },
            { $inc: { seriesValue: + 1 } },
            { new: true, session }
        );

        if (!updatedSeries) {
            throw new Error("Failed to update series value");
        }
        const invoiceName = `Invoice-${invoiceNo}.pdf`;
        // Commit the transaction if everything is successful
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline;filename="${invoiceName}"`);
        const pdfUrl = await createInvoice(savedBusinessEntry[0], { session });
        await session.commitTransaction();
        res.status(201).json({ status: "Success", message: "Business Entry saved successfully", data: savedBusinessEntry, pdfUrl });

    } catch (error) {
        // If any operation fails, abort the transaction
        await session.abortTransaction();

        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error",
            error: error.message || error
        });
    } finally {
        session.endSession();
    }


}