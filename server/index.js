import express from 'express';
import dotenv from 'dotenv';

import Connection from './database/db.js'; // Correctly import the default export
import Routes from './routes/route.js'; // Correctly import the default export

dotenv.config();

const app = express();


app.use('/', Routes); // Use the imported routes

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

// Retrieve database credentials from environment variables
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

// Call the Connection function with the credentials
Connection(USERNAME, PASSWORD);