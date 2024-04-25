const express = require('express');
const app = express();
const cors = require('cors');
const connectToMongoDb = require('./dbConnection/connect');

const customer = require('./routes/customerRoute');
const interest = require('./routes/interestRoute');
const club = require('./routes/clubRoute');
const post = require('./routes/postRoute');


const cookieParser = require('cookie-parser');


// middleawre
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


//set route

app.use('/api/v1/customers', customer);

app.use('/api/v1/interests',interest)

app.use('/api/v1/clubs',club)

app.use('/api/v1/posts',post)




const runServerApplication = async () => {
    try {
        await connectToMongoDb(process.env.MONGO_URL_KEY);
        app.listen(3000, () => {
            console.log('the server is running on port 3000');
        })
    } catch (error) {
        console.error(error);
    }
}

runServerApplication();