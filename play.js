function madeChoice(x, id) {
  console.log(x);
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

class Game {

  constructor() {
    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();
  }
  getPlayerName() {
    console.log(localStorage.getItem('userName'));
    return localStorage.getItem('userName') || 'you';
  }
}

const game = new Game();

