const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path=require('path');
const app = express();

require('dotenv').config();
const routes = require('./routes/index');
const PORT = process.env.PORT || 9000;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use('/data/invoices', express.static(path.join(__dirname, 'data/invoices')));

mongoose.connect(process.env.Mongo_URI)
    .then(response => {
        console.log(`App Listening to port ${PORT}`)
        app.listen(PORT)
    })
    .catch(err => {
        console.log(err);

    });
