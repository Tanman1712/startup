const GameStartEvent = 'gameStart';
const GameAnswerEvent = 'questionAnswered';
var socket;
configureWebSocket();

async function madeChoice(id) {
  document.getElementById('continue').style.display = "block";
  var resultEl = document.getElementById('results');
  resultEl.classList.forEach(c => resultEl.classList.remove(c));
  if (id === "opt1") {
    resultEl.classList.add("opt1");
    await trackResp(0);
  }
  else {
    resultEl.classList.add("opt2");
    await trackResp(1);
  }

  const nodeList = document.querySelectorAll("card > button");
  for (let i = 0; i < nodeList.length; ++i) {
    nodeList[i].disabled=true;
  }

  //localStorage.setItem("questions", JSON.stringify(questions));

}

async function trackResp(x) {
  let responses;
  let questions = JSON.parse(localStorage.getItem('questions'));
  let q = simplifiedGetQ();
  let oldQuestion;
  let question;
  
  oldQuestion = questions[q];
  const percEl = document.getElementById('percent');
  try {
    const oneQuestion = await fetch('/api/question', {
      method: 'POST',
      headers: { 
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ text: oldQuestion.text, choice: x }),
    });
    question = await oneQuestion.json();
    if (x === 0)
      percEl.textContent = question.opt1Perc;
    else 
      percEl.textContent = question.opt2Perc;
  } catch {
    question = new Question(oldQuestion);
    question.updatePercents(x);
    percEl.textContent = question.getPercent(x);
  }
  
  let userName;
  try {
    userName = localStorage.getItem('userName');
    const addResp = await fetch('/api/playerresp', {
      method: 'POST',
      headers: { 
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username: userName, response: x }),
    });
    //console.log(addResp.text());
    responses = await addResp.json();
    localStorage.setItem('responses', JSON.stringify(responses));
  } catch (ex) {
    console.log(ex);
    const responseText = localStorage.getItem('responses');
    if (responseText) {
      responses = JSON.parse(responseText);
      responses.push(x);
    }
    localStorage.setItem('responses', responses);
  }

  broadcastEvent(userName, GameAnswerEvent, {qNum: q + 1});
}

function next() {
  document.getElementById('continue').style.display = "none";
  const nodeList = document.querySelectorAll("card > button");
  for (let i = 0; i < nodeList.length; ++i) {
    nodeList[i].disabled=false;
  }
  game.updateCards();
  //window.location.href = "play.html";
}

function simplifiedGetQ() {
  const currentQ = localStorage.getItem('currentQ');
    if (currentQ) {
      return parseInt(JSON.parse(currentQ));
    }
    return undefined;
}

async function getQ() {
  let q;
  try {
    let url = `/api/responses/${localStorage.getItem('userName')}`;
    const currQ = await fetch(url);
    q = await currQ.json();
    q = q.length;
    
    localStorage.setItem('currentQ', q);
  } catch {
    q = simplifiedGetQ();
  }

  if (!q) {
    q = 0;
  }

  let totalQuestions;
  try {
    const totalQ = await fetch('/api/questions');
    totalQuestions = await totalQ.json();
    localStorage.setItem('questions', JSON.stringify(totalQuestions));
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
    if (allAnswered === true) {
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

function configureWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  this.socket.onopen = (event) => {
    let notifyOnce = localStorage.getItem('notifyOnce');
    if (!notifyOnce) {
      this.displayMsg('system', 'game', 'connected');
      localStorage.setItem('notifyOnce', true);
    }
  };
  this.socket.onclose = (event) => {
    this.displayMsg('system', 'game', 'Good answer');
  };
  this.socket.onmessage = async (event) => {
    const msg = JSON.parse(await event.data.text());
    if (msg.type === GameStartEvent) {
      this.displayMsg('player', msg.from, `started answering questions`);
    } else if (msg.type === GameAnswerEvent) {
      this.displayMsg('', '', `Go see the new stats in I'd Rather!`);
      this.displayMsg('player', msg.from, `just answered question ${msg.value.qNum}`);
    }
  };
}

function displayMsg(cls, from, msg) {
  const chatText = document.querySelector('#player-messages');
  chatText.innerHTML =
    `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
}

function broadcastEvent(from, type, value) {
  const event = {
    from: from,
    type: type,
    value: value,
  };
  delay(5000);
  this.socket.send(JSON.stringify(event));
}

const game = new Game();

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

