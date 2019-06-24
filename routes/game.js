function gameRoutes(app) {
  let goodAnswers = 0;
  let isGameOver = false;
  let callToAFriendUsed = false;
  let halfOnHalfUsed = false;
  let questionToTheCrowdUsed = false;

  const questions = [
    {
      question: "Jaki Jest najlepszy jezyk programowania?",
      answers: ["C++", "Python", "Java", "JavaScript"],
      correctAnswer: 3
    },
    {
      question: "Jaki jest najsmaczniejszy owoc na świecie?",
      answers: ["Granat", "Jabłko", "Gruszka", "Wisnie"],
      correctAnswer: 0
    },
    {
      question: "Jaki jest najlepszy kolor?",
      answers: ["Zółty", "Czarny", "Zielony", "Niebieski"],
      correctAnswer: 2
    },
    {
      question: "Jaka jest najlepsza pora roku?",
      answers: ["Wiosna", "Lato", "Jesień", "Zima"],
      correctAnswer: 1
    }
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true
      });
    } else if (isGameOver) {
      res.json({
        loser: true
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      const { question, answers } = nextQuestion;
      res.json({
        question,
        answers
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({
        loser: true
      });
    }
    const { index } = req.params;
    const question = questions[goodAnswers];
    const isGoodAnswer = question.correctAnswer === Number(index);
    if (isGoodAnswer) {
      goodAnswers++;
    } else {
      isGameOver = true;
    }
    res.json({
      correct: isGoodAnswer,
      goodAnswers
    });
  });
  app.get("/help/friend", (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: "To koło ratunkowe było już użyte..."
      });
    }
    callToAFriendUsed = true;
    const doesFriendKnowAnswer = Math.random() < 0.75;
    const actualQuestion = questions[goodAnswers];
    res.json({
      text: doesFriendKnowAnswer
        ? `Hmm, zdecydowanie odpowiedź to ${
            actualQuestion.answers[actualQuestion.correctAnswer]
          }`
        : "Nic mi nie przychodzi do głowy..."
    });
  });

  app.get("/help/half", (req, res) => {
    if (halfOnHalfUsed) {
      return res.json({
        text: "To koło ratunkowe było już użyte..."
      });
    }
    halfOnHalfUsed = true;
    const actualQuestion = questions[goodAnswers];
    const answersCopy = actualQuestion.answers.filter(
      (s, index) => index !== actualQuestion.correctAnswer
    );
    answersCopy.splice(Math.floor(Math.random() * answersCopy.length), 1);
    res.json({
      answersCopy
    });
  });

  app.get("/help/crowd", (req, res) => {
    if (questionToTheCrowdUsed) {
      return res.json({
        text: "To koło ratunkowe było już użyte..."
      });
    }
    questionToTheCrowdUsed = true;
    const chart = [10, 20, 30, 40];

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);
      chart[i] += change;
      chart[i - 1] -= change;
    }
    const question = questions[goodAnswers];
    const { correctAnswer } = question;
    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];

    res.json({
      chart
    });
  });

  app.get("/reset", (req, res) => {
    goodAnswers = 0;
    isGameOver = false;
    callToAFriendUsed = false;
    halfOnHalfUsed = false;
    questionToTheCrowdUsed = false;
    res.redirect("/question");
  });
}

module.exports = gameRoutes;
