const line = require('@line/bot-sdk');
const config = require('../config.json');
const client = new line.Client(config);
const Scg = require('./ScgController');
const serviceAccount = require("../serviceAccountKey.json");

var admin = require('firebase-admin');
var moment = require('moment');
var cache = require('memory-cache');
const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        texts.map((text) => ({ type: 'text', text }))
    );
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://line-bot-70175.firebaseio.com'
});

class Line extends Scg {
    constructor() {
        super();
    }

    send(msg) {
        var date = '';
        if (cache.get('LINE' + msg)) {
            date = cache.get('LINE' + msg);
        } else {
            date = moment().format('MMMM Do YYYY, h:mm:ss a')
            cache.put('LINE' + msg, date, 10000);
        }
        client.pushMessage('U058d38e4063e58966f78d25c1925b2e3',
            {
                type: 'text',
                text: msg + ' Cache Start :' + date
            });
        return msg + ' Cache Start :' + date
    }

    receive(req, res) {
        if (!Array.isArray(req.body.events)) {
            return res.status(200).end();
        }
        Promise.all(req.body.events.map(event => {
            if (event.replyToken === '00000000000000000000000000000000' ||
                event.replyToken === 'ffffffffffffffffffffffffffffffff') {
                return;
            }
            return this.handleEvent(event);
        }))
            .then(() => res.end())
            .catch((err) => {
                res.status(200).end();
            });
    }

    handleEvent(event) {
        switch (event.type) {
            case 'message':
                const message = event.message;
                switch (message.type) {
                    case 'text':
                        return this.handleText(message, event.replyToken);
                    case 'image':
                        return this.handleImage(message, event.replyToken);
                    case 'sticker':
                        return this.handleSticker(message, event.replyToken);
                    default:
                        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
                }
            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
        }
    }

    async handleText(message, replyToken) {
        var msg = await this.checkNumber(message.text);
        return replyText(replyToken, msg);
    }

    handleImage(message, replyToken) {
        return replyText(replyToken, 'Got Image');
    }

    handleSticker(message, replyToken) {
        return replyText(replyToken, 'Got Sticker');
    }

    async checkNumber(msg) {
        var msg_list = await this.convertFormat(msg);
        if (msg_list.length < 4) {
            return 'less number';
        }
        let syntax = true;
        for (let v of msg_list) {
            if (Number.isNaN(v)) {
                syntax = false;
                break;
            }
        }
        if (syntax == false) {
            return 'wrong syntax';
        }
        var res = await this.save(msg, msg_list);
        return res.results ? res.results : res;
    }

    async save(msg, msg_list) {
        var result = '';
        var db = admin.database();
        var ref = db.ref("data");
        var is_newQuestion = false;
        await ref.once('value', function (snapshot) {
            if (snapshot.hasChild(msg)) {
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    if (key === msg) {
                        result = childSnapshot.val();
                    }
                });
            } else {
                is_newQuestion = true;
            }
        });
        if (is_newQuestion) {
            result = await this.cal(msg_list);

            db.ref('data/' + msg).set({
                text: msg,
                results: result.join()
            });
            result = result.join()
        }
        return result;
    }

    convertFormat(msg) {
        let msg_list = msg.split(",");
        msg_list.forEach((v, i) => {
            msg_list[i] = parseInt(v);
        });
        console.log('convert', msg_list);
        return msg_list;
    }

    get() {
        var db = admin.database();
        var ref = db.ref("data");
        ref.on('value', snapshot => {
            console.log(snapshot.val());
        })
    }
}

module.exports = Line;
