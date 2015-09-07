var express = require('express')
  , FeedParser = require('feedparser')
  , request = require('request')
  , bodyParser = require('body-parser')
  , app = express()
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , _Port = 3000
  , env = process.env.NODE_ENV || 'development'
  , server = require('http').createServer(app);


var allowCrossDomain = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);

// Parsing json and urlencoded requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

/*initialize routes*/
app.get('/', function (req, res) {
  res.send('Welcome!').end();
});
app.post('/validatefeedurl', function (req, res) {
  var feedReq = request(req.body.feedUrl)
    , feedparser = new FeedParser()
    , meta = null
    , items = [];

  if (!req.body.feedUrl) {
    res.send(new Error('Error: Undefined rss feed url')).end();
  } else {
    feedReq.on('error', function (error) {
      console.error(error);
      res.send(error).end();
    });
    feedReq.on('response', function (res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });
    feedparser.on('error', function (err) {
      console.error(err);
    });
    feedparser.on('readable', function () {
      var stream = this
        , item;
      meta = stream.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      while (item = stream.read()) {
        items.push(item);
      }
    });
    feedparser.on('end', function () {
      res.send({
        meta: meta,
        items: items,
        status: 200
      }).end();
    });
  }
});

/**
 * Different setup for 'development' and 'production' modes
 * @type {string}
 */

if (env === 'development') {
  // Development-mode-specific configuration
  console.info('Node is running in development mode');
}
else {
  // Production-mode-specific configuration goes here...
  console.info('Node is running in production mode');
}


/**
 * Server init and start
 */

server.listen(_Port);

function stopWebServer() {
  server.close(function () {
    console.info('Webserver shutdown');
    process.exit();
  });
}
var gracefulShutdown = function () {
  console.info("Received kill signal, shutting down Webserver gracefully.");
  stopWebServer();
  // if after
  setTimeout(function () {
    console.error("Could not close connections in time, forcefully shutting down webserver");
    process.exit();
  }, 10 * 1000);
};


// Ctrl + C
process.on('SIGINT', gracefulShutdown);

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

process.on('uncaughtException', function (err) {
  console.error("Uncaught Exception: " + err);
  console.error("Stack: " + err.stack);
  process.exit(1);
});

console.info('Express server listening on port: %s', server.address().port);
