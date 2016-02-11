var express = require('express');
var router = express.Router();
var OrderCloud = require('ordercloud-js-sdk');


var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('index', { title: 'Express' });
});

router.get('/resources', function(req, res) {
    var fnList = [];
    for (var fn in OrderCloud) {
        fnList.push(fn)
    }
    res.status(200).json({data: fnList})
})

router.get('/resources/:resource/methods', function(req, res) {
 var methodList = [];
    for (var mt in OrderCloud[req.params.resource]) {
        methodList.push(mt);
    }
    res.status(200).json({data: methodList});
});

router.get('/resources/:resource/methods/:method', function(req, res) {
    var resource = req.params.resource;
    var method = req.params.method;

    var params = getParamNames(OrderCloud[resource][method]);
    res.status(200).json({data: params});
});

router.post('/resources/:resource/methods/:method/execute', function(req, res) {
    var resource = req.params.resource;
    var method = req.params.method;
    var paramList = [];
    for (var i in req.body.order) {
        for (var f in req.body.params) {
            if (req.body.order[i] == f) {
                paramList.push(req.body.params[f]);
            }
        }
    }
    console.log(paramList);
    OrderCloud[resource][method].apply(this, paramList)
        .then(function(data) {
            res.status(200).json({data: data});
        }, function(ex) {
            res.status(400).json(ex);
        })
});

router.get('/ocvars', function(req, res) {
    res.status(200).json({data: OrderCloud.Vars})
})

router.post('/buyerid', function(req, res) {
    OrderCloud.BuyerID.Set(req.body.id);
    var output = OrderCloud.BuyerID.Get();
    res.status(200).json({data: output});

});



router.post('/authenticate', function(req, res) {
  if ( req.body && req.body.Username && req.body.Password) {
    OrderCloud.Credentials.Get({Username: req.body.Username, Password: req.body.Password})
        .then(function(data) {
            OrderCloud.Auth.SetToken(data['access_token']);
          res.status(200).json(data);
        }, function(ex) {
          res.status(400).json(ex)
        })
  } else {
      res.status(401).json({error: 'must provide request body with "Username" and "Password"'})
  }
});








module.exports = router;
