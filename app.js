//node app
//require("newrelic");

var express = require("express"),
    hbs = require("handlebars"),
    engines = require("consolidate"),
    requests = require("request"),
    fs = require("fs"),
    appController =  require('./application/controllers/app'),
    electionController = require('./application/controllers/electionController'),
    stateController = require('./application/controllers/stateController'),
    locationController = require('./application/controllers/locationController'),
    countyController = require('./application/controllers/countyController'),
    municipalityController = require('./application/controllers/municipalityController'),
    clientController = require('./application/controllers/clientController'),
    domainController = require('./application/controllers/domainController'),
    logger = require('./application/logger'),
    config = require('./application/config/'+process.env.NODE_ENV),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

var app = express();

app.configure( function() {
  app.set("views", __dirname+"/application/views");
  app.set("view engine","handlebars");
  app.set("view options",{layout:false});
  app.engine('.html', engines.handlebars);

  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/'));
  app.use(express.static(__dirname + '/static'));
  app.use(express.favicon("/favicon.png"));
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
  app.use(passport.initialize());
  app.use(passport.session());

  // Register partials
  var partials = "./application/views/partials/";
  fs.readdirSync(partials).forEach(function (file) {
      var source = fs.readFileSync(partials + file, "utf8"),
          partial = /(.+)\.html/.exec(file).pop();

      hbs.registerPartial(partial, source);
  });
  
  hbs.registerHelper("clean", function(str) {
    if (typeof str === 'string') {
      return str.replace(/\\/g,"");
    } else {
      return str;
    }
  });
  
});

app.get("/login", function(request, response){
  response.render("login.html")
});
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    var path = "/";
    if (typeof req.cookies.path !== 'undefined') {
      path = req.cookies.path;
      res.clearCookie("path");
    }
    res.redirect(path);
  }
);
app.get("/logout", function(request, response){
  request.logout();
  response.redirect("/login");
});

app.get('/clients', ensureAuthenticated, clientController.getClients);
app.get('/client/:clientId', ensureAuthenticated, clientController.getClientById);
app.post('/client/:clientId', ensureAuthenticated, clientController.updateClient);
app.get('/client', ensureAuthenticated, clientController.newClient);
app.post('/client', ensureAuthenticated, clientController.addClient);
app.get('/voters/:clientId', ensureAuthenticated, clientController.getVoterFile);

app.post('/domain/add', ensureAuthenticated, domainController.addDomain);
app.post('/domain/delete', ensureAuthenticated, domainController.deleteDomain);

app.get('/', ensureAuthenticated, stateController.getStates);
app.get('/:state', ensureAuthenticated, stateController.getStateDetails);
app.post('/:state', ensureAuthenticated, stateController.updateStateInfo);
app.get('/:state/voters', ensureAuthenticated, stateController.getVoterFile);

//app.get('/elections', electionController.getElections);
app.get('/:state/elections', ensureAuthenticated, electionController.getElectionsByState);
app.get('/:state/election', ensureAuthenticated, electionController.addNewElection);
app.post('/:state/election', ensureAuthenticated, electionController.saveNewElection);
app.get('/:state/election/:electionId', ensureAuthenticated, electionController.getElectionById);
app.post('/:state/election/:electionId', ensureAuthenticated, electionController.saveElectionById);
app.del('/:state/election/:electionId', ensureAuthenticated, electionController.deleteElectionById);

app.get('/:state/locations', ensureAuthenticated, locationController.getLocationsByState);
app.get('/:state/location', ensureAuthenticated, locationController.newLocation);
app.post('/:state/location', ensureAuthenticated, locationController.addLocation);
app.get('/:state/location/:locationId', ensureAuthenticated, locationController.getLocationById);
app.post('/:state/location/:locationId', ensureAuthenticated, locationController.updateLocation);
app.del('/:state/location/:locationId', ensureAuthenticated, locationController.deleteLocation);
app.get('/:state/locations/upload', ensureAuthenticated, locationController.bulkUploadForm);
app.post('/:state/locations/upload', ensureAuthenticated, locationController.bulkUploadProcess);

app.get('/:state/counties', ensureAuthenticated, countyController.getCountiesByState);
app.get('/:state/counties/update', ensureAuthenticated, countyController.bulkUpdateForm);
app.post('/:state/counties/update', ensureAuthenticated, countyController.bulkUpdateProcess);
app.get('/:state/county/:county', ensureAuthenticated, countyController.getCountyById); 
app.post('/:state/county/:county', ensureAuthenticated, countyController.updateCounty);

app.get('/:state/county/:county/municipality', ensureAuthenticated, municipalityController.newMunicipality);
app.post('/:state/county/:county/municipality', ensureAuthenticated, municipalityController.addMunicipality);
app.get('/:state/county/:county/municipality/:municipality', ensureAuthenticated, municipalityController.getMunicipalityById);
app.post('/:state/county/:county/municipality/:municipality', ensureAuthenticated, municipalityController.updateMunicipality);
app.get('/:state/county/:county/municipalities/upload', ensureAuthenticated, municipalityController.bulkUploadForm);
app.post('/:state/county/:county/municipalities/upload', ensureAuthenticated, municipalityController.bulkUploadProcess);


app.listen(process.env.PORT || 8888);
logger.info("<<<<<<<<<< Server started >>>>>>>>>>");
logger.debug("Environment: "+process.env.NODE_ENV);
logger.debug("API HOST: "+config.services.api.hostname);


var users = [
    { id: 1, username: 'tvgotv', password: '$3crET' }
  , { id: 2, username: 'tv_developer', password: 'dfkjkjfkj343$#4ljjk4#$#j' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.cookie("path", req.path);
  res.redirect('/login')
}