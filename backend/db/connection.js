const mongoose = require('mongoose');

const connection = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('connected to Database');
    })
    .catch((e)=>{
        console.log(e);
    })
}

module.exports = {connection};