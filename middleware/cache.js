const cache = require('memory-cache');
module.exports = function (options) {
    return function (req, res, next) {
        let memCache = new cache.Cache();
        let cacheMiddleware = (duration) => {
            return (req, res, next) => {
                let key = '__express__' + req.originalUrl || req.url
                let cacheContent = memCache.get(key);
                if (cacheContent) {
                    res.send(cacheContent);
                    return
                } else {
                    res.sendResponse = res.send
                    res.send = (body) => {
                        memCache.put(key, body, duration * 1000);
                        res.sendResponse(body)
                    }
                    next()
                }
            }
        }
    }
}