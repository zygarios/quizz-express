const question = document.querySelector("#question");
const buttonsAnswers = document.querySelectorAll('[id^="answer"]');
const goodAnswersSpan = document.querySelector("#good-answers");
const gameBoard = document.querySelector("#game-board");
const h2 = document.querySelector("h2");
const callToAFriendButton = document.querySelector("#callToAFriend");
const halfOnHalfButton = document.querySelector("#halfOnHalf");
const questionToTheCrowdButton = document.querySelector("#questionToTheCrowd");
const tip = document.querySelector("#tip");

function fillQuestionElements(data) {
  if (data.winner === true) {
    gameBoard.style.display = "none";
    h2.textContent = "Wygrałeś!!!";
    return;
  }
  if (data.loser === true) {
    gameBoard.style.display = "none";
    h2.textContent = "Przegrałeś, spróbuj ponownie...";
    h2.insertAdjacentHTML(
      "afterEnd",
      '<button class="btn-reset">Rozpocznij od nowa</button>'
    );
    const reset = document.querySelector(".btn-reset");
    function handleReset(e) {
      e.target.remove();
      gameBoard.style.display = "block";
      h2.innerHTML =
        '<h2>Poprawne odpowiedzi: <span id="good-answers">0</span></h2>';
      fetch("/reset", {
        method: "GET"
      })
        .then(res => res.json())
        .then(data => {
          fillQuestionElements(data);
        });
    }
    reset.addEventListener("click", handleReset);
  }
  question.textContent = data.question;
  buttonsAnswers.forEach((item, index) => {
    item.style.display = "inline-block";
    item.textContent = data.answers[index];
  });
}

function showNextQuestion() {
  fetch("/question", {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => {
      fillQuestionElements(data);
    });
}

buttonsAnswers.forEach(item => {
  item.addEventListener("click", e => {
    const answerIndex = e.target.dataset.answer;
    sendAnswer(answerIndex);
    tip.textContent = "";
  });
});

showNextQuestion();

function handleAnswerFeedback(data) {
  goodAnswersSpan.textContent = data.goodAnswers;
  showNextQuestion();
}

function sendAnswer(answerIndex) {
  fetch(`/answer/${answerIndex}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      handleAnswerFeedback(data);
    });
}

function callToAFriend() {
  fetch("/help/friend", {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => {
      tip.textContent = data.text;
    });
}

function handleHalfOnHalf(data) {
  if (typeof data.text === "string") {
    tip.textContent = data.text;
  } else {
    buttonsAnswers.forEach(item => {
      if (data.answersCopy.includes(item.textContent)) {
        item.style.display = "none";
      }
    });
  }
}

function halfOnHalf() {
  fetch("/help/half", {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => {
      handleHalfOnHalf(data);
    });
}

function handleQuestionToTheCrowd(data) {
  if (typeof data.text === "string") {
    tip.textContent = data.text;
  } else {
    data.chart.forEach((perc, index) => {
      buttonsAnswers[
        index
      ].innerHTML += `<span id="crowd-span"> - ${perc}%</span>`;
    });
  }
}

function questionToTheCrowd() {
  fetch("/help/crowd", {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => handleQuestionToTheCrowd(data));
}

callToAFriendButton.addEventListener("click", callToAFriend);
halfOnHalfButton.addEventListener("click", halfOnHalf);
questionToTheCrowdButton.addEventListener("click", questionToTheCrowd);
