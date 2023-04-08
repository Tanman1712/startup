const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
  console.log("made it here moo");
  const user = await DB.getUser(req.params.username);
  console.log("made it further");
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetUserResponses
secureApiRouter.get('/responses', async (req, res) => {
  // check if it's req.params or req.body
  const responses = await DB.getPlayerResponses(req.params.username);
  res.send(responses);
});

// SubmitResponse
secureApiRouter.post('/player-resp', async (req, res) => {
  await DB.addResp(req.body);
  const responses = await DB.getPlayerResponses(req.body.username);
  res.send(responses);
});

secureApiRouter.get('/questions', async (req, res) => {
  const questions = await DB.getQuestions();
  res.send(questions);
});

secureApiRouter.post('/question', async (req, res) => {
  //req needs the question and choice picked
  await DB.updateQPerc(req.body);
  const questions = await DB.getQuestions();
  res.send(questions);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Might not need anything past here

// let questions = [];
// const optionPairs = [
//   { first : "Sleep all day", second : "Party all night" },
//   { first : "Go to the mountains", second : "Go to the ocean" },
//   { first : "Be able to fly", second : "Have super strength" }
// ]

// optionPairs.forEach((pair) => questions.push(new Question(new Option(pair.first, 0), new Option(pair.second, 0))));
