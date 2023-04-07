const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// was GetScores, needs to be GetResponses
apiRouter.get('/responses', (_req, res) => {
  res.send(responses);
});

// was SubmitScore, needs to be UpdateNumAns
apiRouter.post('/player-resp', (req, res) => {
  player = updateResp(req.body, responses);
  res.send(player);
});

apiRouter.get('/questions', (_req, res) => {
  res.send(questions);
});

// todo: probs don't need this
apiRouter.post('/question', (req, res) => {
  questions = updateQuestion(req.body, questions);
  res.send(questions);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// CLASSES
class Question {
  constructor(choice1, choice2) {
    this.text = choice1.text + " or " + choice2.text;
    this.opt1 = choice1;
    this.opt2 = choice2;
  }
  
  calcPercent() {
    var total = this.opt1.numPicked + this.opt2.numPicked;
    if (total === 0) total = 1;
    this.opt1Perc = this.opt1.numPicked / total;
    this.opt2Perc = this.opt2.numPicked / total;
  }

  getPercent(choice) {
    if (choice === 0)
      return this.opt1Perc;
    else
      return this.opt2Perc;
  }
  
  // print() {
  //   console.log("Would you rather " + this.text);
  // }
  
  updatePercents(choice) {
    choice === 0 ? ++this.opt1.numPicked : ++this.opt2.numPicked;
    this.calcPercent();
    this.opt1Perc = this.roundPercent(this.opt1Perc);
    this.opt2Perc = this.roundPercent(this.opt2Perc);
  }
  
  roundPercent(num) {
    if (num === 1) return 100;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}

class Option {
  constructor(text) {
    this.text = text;
    this.numPicked = 0;
  }
}

let questions = [];
const optionPairs = [
  { first : "Sleep all day", second : "Party all night" },
  { first : "Go to the mountains", second : "Go to the ocean" },
  { first : "Be able to fly", second : "Have super strength" }
]

optionPairs.forEach((pair) => questions.push(new Question(new Option(pair.first, 0), new Option(pair.second, 0))));


let responses = [];
function updateResp(newResp, responses) {
  responses.forEach(resp => {
    if (resp.name === newResp.name)
      resp = newResp;
  }); //try filter if this don't work
  return newResp;
}

function updateQuestion(question, questions) {
  questions.filter((q, index, arr) => {
    if (q.text === question.text) {
      arr[index] = question;
    }
  });
  return questions;
}