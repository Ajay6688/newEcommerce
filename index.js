const express = require('express');
const app = express();
const { router } = require('./route_handlers/routes');
const config = require('config');
app.use(express.json());
app.use('/', router);
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,access-token,session_token,user-type,user_type,institute-id,institute_id');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.listen(config.get('server.port'), () => {
    console.log("server is listening at " + config.get('server.port'));
});