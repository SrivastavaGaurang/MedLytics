
import mongoose from 'mongoose';

const localUri = 'mongodb://127.0.0.1:27017/medlytics';

mongoose.connect(localUri)
    .then(() => {
        console.log('Local MongoDB connection successful');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Local MongoDB connection failed:', err.message);
        process.exit(1);
    });
