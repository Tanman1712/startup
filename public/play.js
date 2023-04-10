
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

async function getQ() {
  let q;
  try {
    let url = `/api/responses/${localStorage.getItem('userName')}`
    const currQ = await fetch(url);
    q = await currQ.json();
    q = q.responses.length;
    
    localStorage.setItem('currentQ', q);
  } catch {
    const currentQ = localStorage.getItem('currentQ');
    if (currentQ) {
      q = parseInt(JSON.parse(currentQ));
    }
  }

  let totalQuestions;
  try {
    const totalQ = await fetch('/api/questions');
    totalQuestions = await totalQ.json();
    totalQuestions = totalQuestions.length;
    
    localStorage.setItem("numResp", JSON.stringify(totalQuestions));
  } catch {
    const totalQText = localStorage.getItem('numResp');
    if (totalQText) {
      totalQuestions = parseInt(JSON.parse(totalQText));
    }
  }
  
  if (q >= totalQuestions) {
    localStorage.setItem('allAnswered', JSON.stringify(true));
  } else {
    localStorage.setItem('allAnswered', JSON.stringify(false));
  }

  return q;
}

class Game {
  constructor() {
    this.updateCards();
  }
  
  async updateCards() {
    const nodeList = document.querySelectorAll("card > div");
    const q = await getQ();
    let allAnswered = JSON.parse(localStorage.getItem('allAnswered'));
    if (allAnswered === "true") {
      document.getElementsByClassName("spacer")[0].setAttribute("style", "display: none");
      document.getElementById("welcome").innerHTML = 'Sorry <span class="player-name"></span>, ' +
        'you\'ve already answered all our questions! Come back later for more!';
    } else {
      document.getElementsByClassName("spacer")[0].setAttribute("style", "display: grid");
      document.getElementById("welcome").innerHTML = 'Would <span class="player-name"></span> Rather:';
      let questions = [];
      try {
        const qApi = await fetch('/api/questions');
        questions = await qApi.json();
        localStorage.setItem('questions', JSON.stringify(questions));
      } catch {
        const questionsText = localStorage.getItem('questions');
        if (questionsText) {
          questions = JSON.parse(questionsText);
        }
      }
      
      const playerNameEl = document.querySelector('.player-name');
      playerNameEl.textContent = localStorage.getItem('userName') || 'you';
      nodeList[0].textContent = questions[q].opt1.text;
      nodeList[1].textContent = questions[q].opt2.text;
    }
    //if (getQ() >= this.questions.length) localStorage.currentQ = JSON.stringify(0);
  }
}

const game = new Game();

