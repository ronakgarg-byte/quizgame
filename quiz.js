import { questions } from "./data.js";

const name = document.querySelector("#name");
const startQuiz = document.querySelector("#start");
const screen1 = document.querySelector(".screen1");
const screen2 = document.querySelector(".screen2");
const screen3 = document.querySelector(".screen3");
const questionDiv = screen2.querySelector(".question");
const timerDiv = screen2.querySelector(".timer");

let answerbutton = document.querySelectorAll(".options button");
let questioninterval = 0;
let score=0;
let timerId;

// empty array is initialized on page load.
const datainLS = JSON.parse(localStorage.getItem("data")) || [];
// we can check LS if 'data' is there, we can initialize from LS, otherwise an empty array

startQuiz.addEventListener("click", startTheQuiz);
function startTheQuiz() {
  if (name.value.length <= 0) {
    alert("Enter your name");
  } else {
   
    screen1.classList.add("hidden");
    screen2.classList.remove("hidden");

    timerDiv.textContent = timeleft;
    timerId = setInterval(showTimer, 1000);
    printQuestionAndOptions();
  }
}

let timeleft = 5;


function showTimer() {
  timeleft--;
  timerDiv.textContent = timeleft;

  if (timeleft <= 0) {
    nextQuestion();
  }
}
function printQuestionAndOptions() {
  let currentquestion = questions[questioninterval];

  questionDiv.innerHTML = `<h1>${currentquestion.q}</h1>`;

  answerbutton.forEach((button, index) => {
    button.textContent = currentquestion.o[index];

    button.classList.remove("correct", "wrong");
    button.disabled = false;
    button.style.display = "inline";
  });
}




answerbutton.forEach((button) => {
  button.addEventListener("click", function () {
    clearInterval(timerId);

    let currentquestion = questions[questioninterval];

    if (button.textContent.trim() === currentquestion.a) {
      button.classList.add("correct");
      score++;
    } else {
      button.classList.add("wrong");

      answerbutton.forEach((btn) => {
        if (btn.textContent.trim() === currentquestion.a) {
          btn.classList.add("correct");
        }
      });
    }

    answerbutton.forEach((btn) => {
      btn.disabled = true;
    });

    setTimeout(nextQuestion, 1000);
  });
});

function nextQuestion() {
  clearInterval(timerId);

  questioninterval++;

  if (questioninterval < questions.length) {
    timeleft = 5;

    printQuestionAndOptions();

    timerDiv.textContent = timeleft;

    timerId = setInterval(showTimer, 1000);
  } else {
   
    addToLS(name.value, score);
    questionDiv.innerHTML = `
      <h1>Quiz Completed</h1>
      <h2>Your Score: ${score}/${questions.length}</h2>
    `;

    timerDiv.textContent = "";

    answerbutton.forEach((button) => {
      button.style.display = "none";
    });
  }
}



function addToLS(data,score) {
  const obj = {
    name: data,
    score:score,
    time: new Date().toLocaleString(),
  };

  datainLS.push(obj);

  localStorage.setItem("data", JSON.stringify(datainLS));
}
