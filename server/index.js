const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');


const app = express();
const PORT = process.env.PORT || 3000;

// Enable file upload middleware
app.use(fileUpload({
    createParentPath: true
}));
// Other middlewares
app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'));

// Routes
app.use(require('./routes/imageUpload'));
app.use(require('./routes/giveNextNumber'));
app.use(require('./routes/publishArticle'));

// Start app
app.listen(PORT, () => 
    console.log(`App is listening on port ${PORT}.`)
);