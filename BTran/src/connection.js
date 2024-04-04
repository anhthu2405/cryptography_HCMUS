const mongoose = require('mongoose');

export async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://dbtran21:IKMTx879iqLVkFvh@cluster0.os5lzrk.mongodb.net/userauthentication", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}