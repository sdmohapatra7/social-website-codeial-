const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/codial_dvelopment');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error Connecting To Mongodb"));
db.once('open', function () {
    console.log('Connected To Database :: Mongodb');
});

module.exports = db;