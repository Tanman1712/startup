
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
  localStorage.setItem("numResp", getQ());
  window.location.href = "play.html";
}
function getQ() {
  let q = parseInt(JSON.parse(localStorage.getItem("currentQ"))) || 0;
  let numResp = parseInt(JSON.parse(localStorage.getItem('numResp'))) || 0;
  if (q >= optionPairs.length) {
    q = -1;
  } else if (q === -1 && numResp < optionPairs.length) {
    q = numResp;
  }
  localStorage.setItem("currentQ", q);
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
      nodeList[0].textContent = questions[q].opt1.text;
      nodeList[1].textContent = questions[q].opt2.text;
    }
    //if (getQ() >= this.questions.length) localStorage.currentQ = JSON.stringify(0);
  }
}

const game = new Game();

