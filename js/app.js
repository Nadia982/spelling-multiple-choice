const attributionLink = document.querySelector(".attribution-link");
const startBtn = document.querySelector(".start-btn");
const questionNumber = document.querySelector(".question-number");

const questionText = document.querySelector(".question-text");
const questionText2 = document.querySelector(".question-text-2");

const choicesContainer = document.querySelector(".choices-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const nextButton = document.querySelector(".next-btn");
const questionLimit = 10;
const questionsAskedContainer = document.querySelector(".questions-asked-container"
);

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableChoices = [];
let correctAnswers = 0;
let attempt = 0;
let questionsAskedList = [];
let yourAnswersList = [];

startBtn.tabIndex = 1;
attributionLink.tabIndex = 0;

// add the questions to the availableQuestions array
function setAvailableQuestions() {
  const totalQuestions = questions.length;
  for (let i = 0; i < totalQuestions; i++) {
    availableQuestions.push(questions[i]);
  }
}

//set question number, question text and answer choices
function getNewQuestion() {
  nextButton.classList.add("hide");
  //set question number
  questionNumber.innerHTML = `Question ${
    questionCounter + 1
  } of ${questionLimit}`;

  //get random question
  const questionIndex =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  currentQuestion = questionIndex;
  //set question text
  questionText.innerHTML = currentQuestion.q;
  questionsAskedList.push(currentQuestion);

  // get the position of "QuestionIndex" from the "AvailableQuestions" array

  const index1 = availableQuestions.indexOf(questionIndex);

  //remove questionIndex from the ‘AvailableQuestions’ array

  availableQuestions.splice(index1, 1);

  // show question image if "img" property exists

  if (currentQuestion.hasOwnProperty("q2")) {
    const q2 = document.createElement("p");
    q2.innerHTML = currentQuestion.q2;
    q2.setAttribute("class", "question-text-2");
    questionText.appendChild(q2);
  } else {
    const q2Div = document.getElementById("question-text-2-div");
    q2Div.classList.add("hide");
  }

  if (currentQuestion.hasOwnProperty("q3")) {
    const q3 = document.createElement("p");
    q3.innerHTML = currentQuestion.q3;
    q3.setAttribute("class", "question-text-2");
    questionText.appendChild(q3);
  }

  if (currentQuestion.hasOwnProperty("img")) {
    const img = document.createElement("img");
    img.src = currentQuestion.img;
    questionText.appendChild(img);
  }

  // set choices
  // get the length of the list of choices
  const choicesLength = currentQuestion.choices.length;

  choicesContainer.innerHTML = "";

  // push choices into availableChoices array

  for (let i = 0; i < choicesLength; i++) {
    availableChoices.push(i);
  }

  //create choices in html
  let animationDelay = 0.1;

  for (let i = 0; i < choicesLength; i++) {
    const choicesIndex =
      availableChoices[Math.floor(Math.random() * availableChoices.length)];

    //get the position of choicesIndex from availableChoices

    const index2 = availableChoices.indexOf(choicesIndex);

    //remove the “choicesIndex” from the availableChoices so that the choice does not repeat

    availableChoices.splice(index2, 1);

    const choice = document.createElement("button");
    choice.innerHTML = currentQuestion.choices[choicesIndex];
    choice.id = choicesIndex;
    choice.style.animationDelay = animationDelay + "s";

    animationDelay = animationDelay + 0.1;

    choice.className = "choice";
    choicesContainer.appendChild(choice);
    choice.setAttribute("onclick", "getResult(this)");

    // choice.addEventListener("keydown", pressEnterToGetResult);

    // function pressEnterToGetResult(e) {
    //   if (e.key == "Enter") {
    //     option.removeEventListener("keydown", pressEnterToGetResult);
    //     getResult(this);
    //     unclickableOptions();
    //   }
    // }
  }
  choicesContainer.children[0].setAttribute("autofocus", "autofocus");
  nextButton.tabIndex = 1;
  questionCounter++;
}

function getResult(element) {
  unclickableOptions();
  const id = parseInt(element.id);
  const answerText = element.innerHTML;
  yourAnswersList.push(answerText);
  console.log(yourAnswersList);
  //get the answer by comparing the id of the clicked choice
  if (id === currentQuestion.answer) {
    // add green colour if user selects correct choice
    element.classList.add("correct");
    //add a tick mark to the answer indicator
    updateAnswerIndicator("correct");
    correctAnswers++;
  } else {
    // add red colour if user selects incorrect choice
    element.classList.add("incorrect");
    //add a cross mark to the answer indicator
    updateAnswerIndicator("incorrect");

    //if answer is incorrect then show the correct answer
    const choicesLength = choicesContainer.children.length;
    for (let i = 0; i < choicesLength; i++) {
      setTimeout(() => {
        if (
          parseInt(choicesContainer.children[i].id) === currentQuestion.answer
        ) {
          choicesContainer.children[i].classList.add("correct");
        }
      }, 400);
    }
  }
  attempt++;
  nextButton.classList.remove("hide");
}

//add shortcut key for the return key to go to the next question
function pressEnterForNextQu(e) {
  if (e.key === "Enter") {
    next();
  }
}

//make other choices unclickable once user has selected a choice
function unclickableOptions() {
  const choicesLength = choicesContainer.children.length;
  for (let i = 0; i < choicesLength; i++) {
    choicesContainer.children[i].classList.add("already-answered");
    choicesContainer.children[i].setAttribute("disabled", "");
  }
}

//creating answersIndicator box, and answer indicator circles for each question
function answersIndicator() {
  answersIndicatorContainer.innerHTML = "";
  const totalQuestion = questionLimit;
  for (let i = 0; i < totalQuestion; i++) {
    const indicator = document.createElement("div");
    answersIndicatorContainer.appendChild(indicator);
  }
}

function updateAnswerIndicator(markType) {
  answersIndicatorContainer.children[questionCounter - 1].classList.add(
    markType
  );
}

function next() {
  // document.removeEventListener("keydown", pressEnterForNextQu);
  if (questionCounter >= questionLimit) {
    quizOver();
  } else {
    getNewQuestion();
  }
}

function quizOver() {
  //hide quizBox
  quizBox.classList.add("hide");
  //show resultBox
  resultBox.classList.remove("hide");
  showResult();
}

//get the quiz result
function showResult() {
  resultBox.querySelector(".total-score").innerHTML =
    correctAnswers + "/" + questionLimit;
  displayQuestions();
}

function displayQuestions() {
  for (let i = 0; i < questionsAskedList.length; i++) {
    //create table row for each question
    const questionRow = document.createElement("tr");

    //create a cell to show the question number
    const questionNoCell = document.createElement("td")
    questionNoCell.textContent = i+1;
    questionNoCell.setAttribute("data-cell", "Question no: ");

    //create a cell to show the question text
    const questionAskedCell = document.createElement("td");
    if (questionsAskedList[i].hasOwnProperty("q3")) {
      questionAskedCell.innerHTML =
        questionsAskedList[i].q +
        " " +
        questionsAskedList[i].q2 +
        " " +
        questionsAskedList[i].q3;
    } else if (questionsAskedList[i].hasOwnProperty("q2")) {
      let q2QuestionContents = questionsAskedList[i].q + " " + questionsAskedList[i].q2;
      console.log(q2QuestionContents);
      questionAskedCell.innerHTML = q2QuestionContents; 
    } else {
      questionAskedCell.innerHTML = questionsAskedList[i].q;
    }
    questionAskedCell.setAttribute("data-cell", "Question: ");

    // create a table cell to show the given answer
    const yourAnswerCell = document.createElement("td");
    yourAnswerCell.innerHTML = yourAnswersList[i];
    yourAnswerCell.setAttribute("data-cell", "You answered: ");
    
    //create a table cell to show the correct answer
    const correctAnswerCell = document.createElement("td");
    correctAnswerCell.innerHTML = questionsAskedList[i].choices[questionsAskedList[i].answer];
    correctAnswerCell.setAttribute("data-cell", "Correct answer: ");

    //create a table cell to show if the given answer was right or wrong
    const resultCell = document.createElement("td");
    // resultCell.innerHTML = "<p>Hello</p>";
    if(yourAnswerCell.innerHTML === correctAnswerCell.innerHTML) {
      resultCell.innerHTML = "<img src='./images/correct.png' alt = 'correct' width='30'/>";
      resultCell.classList.add("correct");
    } else {
      resultCell.innerHTML = "<img src='./images/incorrect.png' alt = 'incorrect' width='20'/>";
      resultCell.classList.add("incorrect");
    }
    //append the created cells to the question row
    questionRow.appendChild(questionNoCell);    
    questionRow.appendChild(questionAskedCell);
    questionRow.appendChild(yourAnswerCell);
    questionRow.appendChild(correctAnswerCell);
    questionRow.appendChild(resultCell);
    //Add the new row to questionsAskedContainer
    questionsAskedContainer.appendChild(questionRow);
  }
}

function removeQuestions() {
  questionsAskedContainer.textContent = "";
}

function resetQuiz() {
  questionCounter = 0;
  correctAnswers = 0;
  attempt = 0;
  availableQuestions = [];
  questionsAskedList = [];
  yourAnswersList = [];
  removeQuestions();
}

function tryAgainQuiz() {
  //hide the result box
  resultBox.classList.add("hide");
  //show the quiz box
  quizBox.classList.remove("hide");
    //reset Quiz
  resetQuiz();
  //start Quiz
  startQuiz();
}

function goToHome() {
  //hide result box
  resultBox.classList.add("hide");
  // show home box
  homeBox.classList.remove("hide");
  //reset Quiz
  resetQuiz();
}

function startQuiz() {
  // hide home box
  homeBox.classList.add("hide");
  //hide result box
  resultBox.classList.add("hide");
  // show quiz box
  quizBox.classList.remove("hide");

  setAvailableQuestions();
  getNewQuestion();
  // to create indicator of answers
  answersIndicator();
}

window.onload = function () {
  homeBox.querySelector(".total-questions").innerHTML = questionLimit;
};
