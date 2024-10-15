const express = require('express');

const Router = express.Router()

const businessEntriesRoutes = require('./businessEntries');

const reportRoutes = require('./reportRoutes');

Router.use('/businessEntry', businessEntriesRoutes);

Router.use('/reports', reportRoutes);

module.exports = Router