var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var path = require('path');

var port = process.env.PORT || 1337;
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/parse';
var mountPath = process.env.PARSE_MOUNT || '/parse';
var isProduction = process.env.PRODUCTION_ENV || false;
var serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
var publicServerURL = process.env.PUBLIC_SERVER_URL || 'http://localhost:1337/parse';
var appId = process.env.APP_ID || 'myAppId';
var masterKey = process.env.MASTER_KEY || 'abc123';
var appName = process.env.PARSE_APP_NAME || 'parse-server';
var maxUploadSize = process.env.MAX_UPLOAD_SIZE || '20mb';
var javascriptKey = process.env.JAVASCRIPT_KEY || 'javascript_key';
var userJsonString = process.env.USERS_JSON || '[{"user": "test", "pass": "test"}]';

var mailServer = {
    fromAddress: process.env.FROM_ADDRESS || 'no-reply@eao.gov.bc.ca',
    user: process.env.MAIL_SERVER_USER,
    password: process.env.MAIL_SERVER_PASSWORD,
    host: process.env.MAIL_SERVER_HOST,
    port: process.env.MAIL_SERVER_PORT || 25,
    isSSL: process.env.MAIL_SERVER_SSL || false,
    isTlsRejectUnauthorized: process.env.MAIL_SERVER_TLS_REJECT_UNAUTHORIZED || true,
    emailField: process.env.EMAIL_FIELD || 'email',
}

var userArray = JSON.parse(userJsonString);
var allowInsecureHttp = true;
var useEncryptedPassword = false;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    appName: appName,
    databaseURI: databaseUri,
    appId: appId,
    masterKey: masterKey,
    maxUploadSize: maxUploadSize,
    serverURL: serverURL,
    publicServerURL: publicServerURL,
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    },
    emailAdapter: {
        module: "simple-parse-smtp-no-auth-adapter",
        options: {
            fromAddress: mailServer.fromAddress,
            host: mailServer.host,
            isSSL: mailServer.isSSL, //True or false if you are using ssl
            isTlsRejectUnauthorized: mailServer.isTlsRejectUnauthorized,
            port: mailServer.port, //SSL port or another port 
            //Somtimes the user email is not in the 'email' field, the email is search first in 
            //email field, then in username field, if you have the user email in another field 
            //You can specify here 
            emailField: mailServer.emailField,
            templates: {
                //This template is used only for reset password email 
                resetPassword: {
                    //Path to your template 
                    template: __dirname + '/templates/email/reset-password',
                    //Subject for this email 
                    subject: 'Reset your password'
                }
            },
        }
    }
});

// setup the dashboard
var dashboard = new ParseDashboard({
    "apps": [{
        "serverURL": serverURL,
        "appId": appId,
        "masterKey": masterKey,
        "appName": appName,
        "production": isProduction,
        "javascriptKey": javascriptKey
    }],
    "users": userArray,
    "useEncryptedPassword": useEncryptedPassword
}, { allowInsecureHTTP: allowInsecureHttp });

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
app.use(mountPath, api);
// Dashboard
app.use("/parse-dashboard", dashboard);

// Parse Server plays nicely with the rest of your web routes
if (!isProduction) {
    app.get('/', function(req, res) {
        res.status(200).send('Your installation of parse-server is complete!');
    });
}

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
if (!isProduction) {
    app.get('/test', function(req, res) {
        res.sendFile(path.join(__dirname, '/public/test.html'));
    });
}

var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);