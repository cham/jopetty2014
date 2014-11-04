'use strict';
var express = require('express'),
    nodemailer = require('nodemailer'),
    router = express.Router();

function sendEmail(name, email, message, callback){
    var from = name + ' <' + email + '>';
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dansformmailer',
            pass: 'supermailiobros'
        }
    });
    var mailOptions = {
        from: from,
        to: 'hello@jopetty.co.uk',
        subject: 'Internet web message.',
        text: message + '\n\nLove from: ' + from
    };

    transporter.sendMail(mailOptions, callback);
}

function endWithBadRequest(res, msg){
    res.redirect(301, 'http://jopetty.co.uk/?err=400&msg=' + msg);
    res.end();
}

function endWithSuccess(res){
    res.redirect(301, 'http://jopetty.co.uk/?success');
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
    sendEmail(req.param.myname, req.param.email, req.param.message, function(err, data){
        if(err){
            console.log(err);
            return endWithBadRequest(res, 'Sorry! Something is up with the email service');
        }
        console.log('Email sent', data.response);
        endWithSuccess(res);
    });
});

module.exports = router;
