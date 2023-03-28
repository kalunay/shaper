const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { router } = require('./src/routes');

// connect to db
mongoose.set('strictQuery', false);
mongoose.connect(
    'mongodb://localhost:27017/interstroi',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// init app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({}));

// routers
router.forEach(item => {
    console.log(item);
    app.use(`/api/v1/${item}`, require(`./src/routes/${item}`));
});

const PORT = 3000;
http.createServer({}, app).listen(PORT);
console.log(`Server running at ${PORT}`);