var express = require('express');
var app = express();
const line = require('@line/bot-sdk');
const config = require('./config.json');
var route = require('./routes/route');

app.use('/', route);

const port = config.port;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});



