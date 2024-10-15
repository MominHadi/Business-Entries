const BusinessEntries = require('../models/businessEntries');
const formatDate = require('../utils/formatDate');


exports.getBusinessData = async (req, res) => {
    try {

        let { fromDate, toDate } = req.body;

        const data = await BusinessEntries.find({
            date: {
                $gte: fromDate,
                $lte: toDate
            }
        }).select(`invoiceNo date customerName category contactNo totalAmount`)

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