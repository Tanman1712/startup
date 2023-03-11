function madeChoice(x, id) {
  document.getElementById('percent').textContent = x;
  document.getElementById('continue').style.display = "block";
  var resultEl = document.getElementById('results');
  resultEl.classList.forEach(x => element.classList.remove(x));
  if (id === "opt1")
    resultEl.classList.add("opt1");
  else
    resultEl.classList.add("opt2");

  const nodeList = document.querySelectorAll("card > button");
  for (let i = 0; i < nodeList.length; ++i) {
    nodeList[i].disabled="true";
  }
}

function next() {
  localStorage.setItem("currentQ", JSON.stringify(getQ() + 1));
  window.location.href = "play.html";
}
function getQ() {
  return JSON.parse(localStorage.getItem("currentQ")) || 0;
}

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
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}

class Option {
  constructor(text) {
    this.text = text;
    this.numPicked = 0;
  }
}

class Game {
  questions = [];
  constructor() {
    const optionPairs = [
      { first : "Sleep all day", second : "Party all night" },
      { first : "Go to the mountains", second : "Go to the ocean" }
    ]
    
    
    optionPairs.forEach((pair) => this.questions.push(new Question(new Option(pair.first, 0), new Option(pair.second, 0))));
    
    this.updateCards();
    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();
  }
  getPlayerName() {
    return localStorage.getItem('userName') || 'you';
  }
  updateCards() {
    const nodeList = document.querySelectorAll("card > div");
    if (getQ() >= this.questions.length) localStorage.currentQ = JSON.stringify(0);
    nodeList[0].textContent = this.questions[parseInt(getQ())].opt1.text;
    nodeList[1].textContent = this.questions[parseInt(getQ())].opt2.text;
  }
}

const game = new Game();

