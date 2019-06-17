var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

const Place = require('../controllers/PlaceController');
const Serial = require('../controllers/SerialController');
const Line = require('../controllers/LineController');
const config = require('../config.json');
const line = require('@line/bot-sdk');

const serialObj = new Serial({});
const placeObj = new Place({});
const lineObj = new Line({});
var cache = require('memory-cache');


router.get('/', function (resp, res, req) {

    console.log(cache.get('foo'));
    cache.put('foo', 'bar');
    console.log('2' + cache.get('foo'));

    res.send({
        error: '',
        data: 'ok'
    });
});


router.get('/serial', function (resp, res, req) {
    var key = '';
    if (cache.get('SERIAL' + resp.query.data)) {
        key = cache.get('SERIAL' + resp.query.data);
    } else {
        key = serialObj.calculate('SERIAL' + resp.query.data);
        cache.put('SERIAL' + resp.query.data, key, 10000);
    }

    res.send({
        error: '',
        data: key
    });
});

router.get('/place', (resp, res, next) => {
    placeObj.mapList((resp) => {
        res.send({
            error: '',
            success: true,
            data: resp
        });
    })
})

router.get('/line', (resp, res, next) => {
    const result = lineObj.send(resp.query.text);
    res.send({
        error: '',
        data: result
    });
})

router.post('/webhook', line.middleware(config), (resp, res) => {
    lineObj.receive(resp, res);
})


router.use(bodyParser.json())
module.exports = router;