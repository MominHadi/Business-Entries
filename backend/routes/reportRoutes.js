const express = require('express');

const Router = express.Router()

const { getBusinessData} = require('../controllers/reportsController');

Router.post('/', getBusinessData);


module.exports = Router;