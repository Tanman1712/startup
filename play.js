let bool = false;
function madeChoice(x, id) {
  console.log(x);
  document.getElementById('percent').textContent = x;
  document.getElementById('continue').style.display = "block";
  var element = document.getElementById('results');
  element.classList.forEach(x => element.classList.remove(x));
  if (id === "opt1")
    element.classList.add("opt1");
  else
    element.classList.add("opt2");
}

function update(x) {
  try {
    var words = breakup(...x.split(" "));
    const answerRegex = /:\s([\w]+( [\w]+)+)!/i;
    var text = document.getElementById('output').innerHTML;
    if (text.includes("wrong")) {
      bool = true;
    } else {
      bool = false;
    }
    text = text.replace(answerRegex, ": " + words + "!");
    document.getElementById("output").innerHTML= text;
  } catch (err) {
    console.log("something went wrong: " + err);
    document.getElementById("output").innerHTML= "Something went wrong! Check console!";
  } finally {
    resolveError(bool, x);
    
  }
}

function breakup(first, ...last) {
  const percRegex = new RegExp('.*%');
  var text = document.getElementById('output').innerHTML;
  text = text.replace(percRegex, first + "%");
  document.getElementById("output").innerHTML= text;
  return last.join(' ');
}

const errorOccurred = (bool, x) => {
  return new Promise((resolve, reject) => {
      if (bool) {
        reject('Blank% of people chose: this answer!');
      } else {
        resolve('worked fine');
      }
  });
};

async function resolveError(bool, x) {
  await errorOccurred(bool, x)
    .then((msg) => console.log(msg))
    .catch((err) => {
    document.getElementById("output").innerHTML= err;
    update(x);
  });
  
}