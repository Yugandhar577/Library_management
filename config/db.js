const mongoose = require('mongoose');
const initdata = require('./data.js');
const books = require('../models/book.js');
main().then(() =>{
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

async function main(){
    await mongoose.connect('mongodb://localhost:27017/LibraryDB');
}

async function initdb() {
    await books.deleteMany({});
    await books.insertMany(initdata.data);
    console.log("Database initialized");
}

main()
  .then(() => initdb())
  .catch(err => {
    console.error("Error connecting to MongoDB", err);
});