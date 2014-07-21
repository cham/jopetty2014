'use strict';
var express = require('express'),
    nodemailer = require('nodemailer'),
    router = express.Router();

function sendEmail(name, email, message){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dansformmailer',
            pass: 'supermailiobros'
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: name + ' <' + email + '>',
        to: 'danneame@gmail.com',
        subject: 'Message from the website',
        text: message
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

function endWithBadRequest(res, msg){
    res.status(400);
    res.send({
        message: msg
    });
    res.end();
}

function requireFormParams(req, res, next){
    if(!req.body.myname){
        return endWithBadRequest(res, '\'myname\' parameter is required');
    }
    if(!req.body.email){
        return endWithBadRequest(res, '\'email\' parameter is required');
    }
    if(!req.body.message){
        return endWithBadRequest(res, '\'message\' parameter is required');
    }
    req.param.myname = req.body.myname;
    req.param.email = req.body.email;
    req.param.message = req.body.message;
    next();
}

router.post('/', requireFormParams, function(req, res){
    console.log(req.param.myname);
    console.log(req.param.email);
    console.log(req.param.message);

    sendEmail(req.param.myname, req.param.email, req.param.message);
    res.end();
});

module.exports = router;
