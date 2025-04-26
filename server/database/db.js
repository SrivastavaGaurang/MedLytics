import mongoose from "mongoose";

const connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@cluster0.kcvfgbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // Add this for better compatibility
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting with database', error);
    }
};

export default connection;