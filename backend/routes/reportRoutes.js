const express = require('express');

const Router = express.Router()

const { getBusinessData, deleteEntry } = require('../controllers/reportsController');

Router.post('/', getBusinessData);
Router.delete('/invoice/:id', deleteEntry);


module.exports = Router;