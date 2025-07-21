import mongoose from 'mongoose';

export const connection = () => {
    return mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('Connected to Database');
        })
        .catch((e) => {
            console.error('Database connection error:', e);
            // Exit the process with an error code if the connection fails
            process.exit(1);
        });
};