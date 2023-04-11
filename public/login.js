(async () => {
  let authenticated = false;
  const userName = localStorage.getItem('userName');
  if (userName) {
    const nameEl = document.querySelector('#username');
    nameEl.value = userName;
    const user = await getUser(nameEl.value);
    authenticated = user?.authenticated;
  }

  if (authenticated) {
    document.querySelector('.player-name').textContent = userName;
    setDisplay('loginControls', 'none');
    setDisplay('playControls', 'block');
    setDisplay('play', 'block');
    setDisplay('rather', 'block');
  } else {
    setDisplay('loginControls', 'block');
    setDisplay('playControls', 'none');
    setDisplay('play', 'none');
    setDisplay('rather', 'none');
  }
})();

async function loginUser() {
  loginOrCreate(`/api/auth/login`);
}

async function createUser() {
  loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
  const userName = document.querySelector('#username')?.value;
  const password = document.querySelector('#password')?.value;
  const response = await fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({ username: userName, password: password }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const body = await response.json();

  if (response?.status === 200) {
    localStorage.setItem('userName', userName);
    window.location.href = 'play.html';
  } else {
    const modalEl = document.querySelector('#msgModal');
    modalEl.textContent = `⚠ Error: ${body.msg}`;
  }
}

function play() {
  window.location.href = 'play.html';
}

function logout() {
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
  //localStorage.removeItem('notifyOnce');
}

async function getUser(username) {
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

