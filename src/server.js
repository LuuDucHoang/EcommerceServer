require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const { connection } = require('./config/database');
const app = express();
const routerApi = require('./routes/api');
const port = process.env.PORT;
const hostName = process.env.HOST_NAME;

//config get input
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

// config file upload
app.use(fileUpload());
app.use('/api', routerApi);

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
