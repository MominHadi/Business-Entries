const express = require('express');

const Router = express.Router()

const { saveBusinessEntries ,getLatestInvoiceNo} = require('../controllers/businessController');

Router.post('/', saveBusinessEntries);

Router.get('/invoiceNo', getLatestInvoiceNo);


module.exports = Router;    