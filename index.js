const express = require('express')
const app = express()
const port = 4200
var bodyParser = require('body-parser')
var insertdata = require('./dbUtility').createdata
var dbop = new insertdata();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
process.env.NODE_ENV = 'Development'
app.get('/', (req, res) => res.send('Hello World!')

)
app.post('/auth/login/:username/V1', (req, res) => {
    var username = req.params.username;
    dbop.checkLogin(username, function (err, responce) {
        if (err) {
            res.send(err)
        } else {
            res.send(responce);
        }
    });
}
)
app.listen(port, () => console.log(`auth-ms listening on port ${port}!`))
