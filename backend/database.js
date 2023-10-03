const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://user1:kmit1@cluster0.ceq93x6.mongodb.net/[iNotebook]?retryWrites=true&w=majority"
const connectToMongo = () => {
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;