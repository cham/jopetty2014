var server = require('./server').listen(3025, function(){
    console.log('Worker listening on port ' + server.address().port);
});
