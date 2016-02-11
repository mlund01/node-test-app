var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, Administrator, dc-token, Identity, environment");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    //res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(express.static(__dirname + '/public'));

app.use('/test', require('./routes/index'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});



if (!process.env.PORT) {
    var server = app.listen(4451, function () {
        var port = server.address().port;
        console.log('Example app listening on port: ',  port);

    });
} else {
    var server = app.listen(process.env.PORT, function () {
        var port = server.address().port;
        console.log('Example app listening on port: ',  port);
    });
}




