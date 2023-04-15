const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv').config();

const route = require('./routes');
const { DATABASE_URL } = require('./constants/route.constant');

const app = express();
const port = process.env.PORT || 3000;;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({
    extended: true,
}));

app.use(morgan('combined'));

mongoose.connection.on('open', () => {
    console.log('Database is ready');
});

mongoose.connection.on('error', (error) => {
    console.log(error);
});

route(app);

async function startServer() {
    await mongoose.connect(DATABASE_URL);
    app.listen(port, () => {
        console.log(`App listening on ${port}`);
    });
}

startServer();