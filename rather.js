function loadResponses() {
  let responses = [];
  let checkmark = "&#x2705;";
  const responseText = localStorage.getItem('responses');
  if (responseText) {
    responses = JSON.parse(responseText);
  }

  const tableBodyEl = document.querySelector('#responses');

  if (responses.length) {
    for (const [i, resp] of responses.entries()) {
      const questionTdEl = document.createElement('td');
      const choice1TdEl = document.createElement('td');
      const picked1TdEl = document.createElement('td');
      const perc1TdEl = document.createElement('td');

      const choice2TdEl = document.createElement('td');
      const picked2TdEl = document.createElement('td');
      const perc2TdEl = document.createElement('td');

      questionTdEl.rowSpan = 2;
      questionTdEl.textContent = resp.qNum + 1;
      choice1TdEl.textContent = resp.question.opt1.text;
      if (resp.pick === 0) picked1TdEl.innerHTML = checkmark;
      else picked2TdEl.innerHTML = checkmark;
      perc1TdEl.textContent = resp.question.opt1Perc;
      choice2TdEl.textContent = resp.question.opt2.text;
      perc2TdEl.textContent = resp.question.opt2Perc;

      const row1El = document.createElement('tr');
      const row2El = document.createElement('tr');
      row1El.appendChild(questionTdEl);
      row1El.appendChild(choice1TdEl);
      row1El.appendChild(picked1TdEl);
      row1El.appendChild(perc1TdEl);

      row2El.appendChild(choice2TdEl);
      row2El.appendChild(picked2TdEl);
      row2El.appendChild(perc2TdEl);

      tableBodyEl.appendChild(row1El);
      tableBodyEl.appendChild(row2El);

    }
  } else {
    tableBodyEl.innerHTML = '<tr><td colSpan=4>Go ahead and answer a question!</td></tr>';
  }
}

loadResponses();