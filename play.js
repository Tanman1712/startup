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
  { first : "Go to the mountains", second : "Go to the ocean" }
]

optionPairs.forEach((pair) => questions.push(new Question(new Option(pair.first, 0), new Option(pair.second, 0))));

function madeChoice(id) {
  document.getElementById('continue').style.display = "block";
  var resultEl = document.getElementById('results');
  resultEl.classList.forEach(c => element.classList.remove(c));
  if (id === "opt1") {
    resultEl.classList.add("opt1");
    trackResp(0);
  }
  else {
    resultEl.classList.add("opt2");
    trackResp(1);
  }

  const nodeList = document.querySelectorAll("card > button");
  for (let i = 0; i < nodeList.length; ++i) {
    nodeList[i].disabled="true";
  }

  //localStorage.setItem("questions", JSON.stringify(questions));

}

function trackResp(x) {
  let responses = [];
  let question = questions[getQ()];
  question.updatePercents(x);
  document.getElementById('percent').textContent = question.getPercent(x);
  const newResp = { qNum : getQ(), question : question, pick : x };
  const responseText = localStorage.getItem('responses');
  if (responseText) {
    responses = JSON.parse(responseText);
    responses.forEach(resp => {
      if (resp.qNum === newResp.qNum) return;
    });
  }
  responses.push(newResp);
  localStorage.setItem('responses', JSON.stringify(responses));
}

function next() {
  localStorage.setItem("currentQ", JSON.stringify(getQ() + 1));
  window.location.href = "play.html";
}
function getQ() {
  let q = parseInt(JSON.parse(localStorage.getItem("currentQ"))) || 0;
  if (q >= optionPairs.length) {
    q = -1;
    JSON.parse(localStorage.setItem("currentQ", q));
  }
  return q;
}

class Game {
  constructor() {
    this.updateCards();
    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();
  }
  getPlayerName() {
    return localStorage.getItem('userName') || 'you';
  }
  updateCards() {
    const nodeList = document.querySelectorAll("card > div");
    const q = getQ();
    if (q === -1) {
      document.getElementsByClassName("spacer")[0].setAttribute("style", "display: none");
      document.getElementById("welcome").innerHTML = 'Sorry <span class="player-name"></span>, ' +
        'you\'ve already answered all our questions! Come back later for more!';
    } else {
      document.getElementsByClassName("spacer")[0].setAttribute("style", "display: grid");
      document.getElementById("welcome").innerHTML = 'Would <span class="player-name"></span> Rather:';
      nodeList[0].textContent = questions[parseInt(getQ())].opt1.text;
      nodeList[1].textContent = questions[parseInt(getQ())].opt2.text;
    }
    //if (getQ() >= this.questions.length) localStorage.currentQ = JSON.stringify(0);
  }
}

const game = new Game();

