var sql = require("mssql");
var request = require('request');
var config = {
    user: 'sa',
    password: 'optical',
    server: '127.0.0.1',
    database: 'TEST'
};
var varUtility = require('../Utility').CallMS
var constant = require('../Utility').commonConstant
var utility = new varUtility();

var uuid = require('uuid')

function createdata() {
    console.log("enter in constructor function create data()");
}
createdata.prototype.getUser = function (payLoad, callback) {
    console.log("enter in getUser");
    sql.connect(config, function (err) {
        if (err) callback(err);
        var request = new sql.Request();
        var query = 'select * from user_master'
        request.query(query, function (err, result) {
            if (err) {
                sql.close()
                throw err
            }
            else {
                sql.close()
                callback(null, result)
            }
        })
    })
}
createdata.prototype.checkLogin = function (username, callback) {
    console.log("enter in checkLogin");
    console.log('in method ', username)
    sql.connect(config, function (err) {
        if (err) callback(err);
        var request = new sql.Request();
        var query = `select * from user_master where loginname='${username}'`
        request.query(query, function (err, result) {
            if (err) throw err
            else {
                console.log(result)
                var count = Object.keys(result.recordset).length
                if (count == 0) {
                    callback('No User Found', result)
                }
                else {
                    var userDetails = {
                        "username": result.recordset[0]["user_name"],
                        "catagory": result.recordset[0]["catagory_code"],
                    }
                    setLoginTocashMs(userDetails, (error, response) => {
                        if (error) callback(error)
                        else {
                            var modifyResponse = {
                                token: response,
                                sessionObject: userDetails
                            }
                            callback(null, modifyResponse)
                        }
                    })
                }

            }
        })
    })
}
function setLoginTocashMs(sessionObject, callback) {
    var newtoken = uuid();
    var params = [{ "token": newtoken }]
    var Headers = [{ "calling-entity": "UI" }]
    var body = sessionObject
    console.log('Before Call')
    utility.call(constant.KEY_CASH_MS_SAVE, params, body, Headers, (error, response) => {
        if (error) {
            console.log('call ms error section', error);
            callback(error);
        }
        else if (response.statusCode == 200) {
            console.log('call ms status 200 section', error)
            callback(null, newtoken);
        }
        else {
            console.log('call ms status not 200 section', error)
            callback(response);
        }
    }
    )
}
module.exports.createdata = createdata