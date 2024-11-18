const BusinessEntries = require('../models/businessEntries');
const formatDate = require('../utils/formatDate');
const fs = require('fs');
const path = require('path');


const deleteFile = (filename) => {
    return new Promise((resolve) => {
        const filePath = path.join(__dirname, '../', 'data', 'invoices', `Invoice-${filename}.pdf`);
        console.log(filePath, 'Path ');

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);  
            } else {
                console.log(`File ${filename} deleted successfully!`);
            }
            resolve();  
        });
    });
};

exports.getBusinessData = async (req, res) => {
    try {

        let { fromDate, toDate } = req.body;

        const data = await BusinessEntries.find({
            date: {
                $gte: fromDate,
                $lte: toDate
            }
        }).select(`invoiceNo date customerName category contactNo totalAmount _id`)

        if (!data) {
            return res.status(404).json({ message: 'Data Not Found' })

        }

        let formattedData = data.map(item => {
            const formattedDate = formatDate(item.date)

            return {
                ...item._doc,

                date: formattedDate
            };
        })

        res.status(200).json({ status: 'Success', data: formattedData })

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error",
            error: error.message || error
        });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        console.log('Delete Entry Called');
        const { id } = req.params;

        const businessEntryDetails = await BusinessEntries.findById(id);

        if (!businessEntryDetails) {
            return res.status(404).json({ status: 'Failed', message: 'Entry not found' });
        }

    
        deleteFile(businessEntryDetails.invoiceNo);

        await BusinessEntries.findByIdAndDelete(id);

        console.log('Invoice Deleted Successfully ');

        res.status(200).json({ message: `Invoice No.: ${businessEntryDetails.invoiceNo} Deleted Successfully` });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error",
            error: error.message || error
        });
    }
};
