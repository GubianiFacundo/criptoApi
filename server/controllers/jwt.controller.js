const crypto = require('crypto');
const moment = require('moment');

var jwt = {};

exports.setJwt = (key, token) => {
  jwt.key = key;
  jwt.token = token;
}

exports.getJwt = () => {
  return jwt;
}

exports.jwtModule = function(key) {
    this.key = key; 
    
    function encodeBase64(str) {
        return new Buffer(str).toString('base64').toString("utf-8");
    }

    function decodeBase64(str) {
        return new Buffer(str, 'base64').toString("utf-8");
    }
    
    function stringify(obj) {
        return JSON.stringify(obj);
    }

    /*Takes head and body encoded as base64 
     * and return a hash(head + "." + body,secret)  
     */
    function checkSumGen(head, body, expire) {
        var checkSumStr = head + "." + body + "." + expire; 
        var hash = crypto.createHmac('sha256',key);
        var checkSum = hash.update(checkSumStr)
                .digest('base64').toString('utf8');
        return checkSum;
    }

    var alg = {"alg": "HS256", "typ": "JWT"};

    return {
        encode:(obj) => {
            var result = "";
            var header = encodeBase64(stringify(alg));
            console.log(header);
            result += header + ".";
            var body = encodeBase64(stringify(obj));
            console.log(body);
            result += body + ".";
            var expireAt = moment().add(1, 'days').format();
            var expire = encodeBase64(stringify(expireAt));
            result += expire + ".";
            var checkSum = checkSumGen(header, body, expire);
            result += checkSum;
            return result;
        },
        decode:(str) => {
            var jwtArr = str.split("."); 
            var head = jwtArr[0];
            var body = jwtArr[1];
            var expire = jwtArr[2];
            var hash = jwtArr[3];
            var checkSum = checkSumGen(head, body, expire);

            var decodedExpire = JSON.parse(decodeBase64(expire));
            // console.log("jwt hash: " + decodedExpire);

            if(hash === checkSum && moment().isBefore(decodedExpire)) {
                // console.log("jwt hash: " + hash);
                // console.log("gen hash: " + checkSum);
                console.log('JWT was authenticated');
                return JSON.parse(decodeBase64(body));
            } else {
                console.log('JWT was not authenticated');
                // console.log("jwt hash: " + hash);
                // console.log("gen hash: " + checkSum);
                return false;
            }
        }
    };
};