require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { connection } = require('./config/database');
const app = express();
const routerApi = require('./routes/api');
const port = process.env.PORT;
const hostName = process.env.HOST_NAME;

//config get input
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
// config file upload
// app.use(fileUpload());
// config cors
app.use(cors({ origin: process.env.HOS_FETCH }));
// cookieParser
app.use(cookieParser());
// router api
app.use('/api', routerApi);
// static files

app.use(express.static('./src/public/images'));
(async () => {
    try {
        await connection();
        app.listen(port, hostName, () => {
            console.log(`Backendapp listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
})();
