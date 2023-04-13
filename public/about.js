(async () => {
  let authenticated = false;
  const userName = localStorage.getItem('userName');
  if (userName) {
    const user = await getUser(userName);
    authenticated = user?.authenticated;
  }

  if (authenticated) {
    setDisplay('play', 'block');
    setDisplay('rather', 'block');
  } else {
    setDisplay('play', 'none');
    setDisplay('rather', 'none');
  }
})();

function displayQuote(data) {
  fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
      const containerEl = document.querySelector('#quote');

      const quoteEl = document.createElement('p');
      quoteEl.classList.add('quote');
      const authorEl = document.createElement('p');
      authorEl.classList.add('author');

      quoteEl.textContent = data.content;
      authorEl.textContent = data.author;

      containerEl.appendChild(quoteEl);
      containerEl.appendChild(authorEl);
    });
}

async function getUser(username) {
  let scores = [];
  // See if we have a user with the given email.
  const response = await fetch(`/api/user/${username}`);
  if (response.status === 200) {
    return response.json();
  }

  return null;
}

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}

async function email() {
  debugger;
  const suggestionEl = document.querySelector("textarea");
  console.log(suggestionEl.value);
  const response = await fetch('/api/suggest', {
    method: 'post',
    body: JSON.stringify({ text: suggestionEl.value }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const body = await response.json();
  if (response?.status === 200) {
    displayQuote();
  } else {
    const modalEl = document.querySelector('#msgModal');
    modalEl.textContent = `⚠ Error: ${body.msg}`;
  }
  
}

//displayQuote();