
/* ==========================================
   QUIZEX - ONLINE EXAMINATION SYSTEM
   JavaScript Functionality
========================================== */


/* ==========================================
   1. LOCAL STORAGE
========================================== */

// Get saved quizzes from Local Storage
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

// Get saved examination results
let results = JSON.parse(localStorage.getItem("results")) || [];

// Store questions temporarily while creating a quiz
let currentQuestions = [];


// Save quizzes
function saveQuizzes() {
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
}

// Save results
function saveResults() {
    localStorage.setItem("results", JSON.stringify(results));
}


/* ==========================================
   2. ADMIN LOGIN
========================================== */

// Get Admin Login Form
const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    const adminMessage = document.getElementById("adminMessage");

    // Demo login credentials
    if (username === "admin" && password === "admin123") {

        document.getElementById("adminLogin").hidden = true;

        document.getElementById("adminDashboard").hidden = false;

        adminMessage.textContent = "";

        alert("Admin Login Successful!");

        displayQuestions();
        displayQuizzes();

    } else {

        adminMessage.textContent = "Invalid username or password!";

        adminMessage.style.color = "red";

    }

});


/* ==========================================
   3. ADMIN LOGOUT
========================================== */

document.getElementById("adminLogout").addEventListener("click", function() {

    document.getElementById("adminDashboard").hidden = true;

    document.getElementById("adminLogin").hidden = false;

    adminLoginForm.reset();

    alert("Logged out successfully!");

});


/* ==========================================
   4. ADD QUESTIONS TO QUIZ
========================================== */

const addQuestionButton = document.getElementById("addQuestion");

addQuestionButton.addEventListener("click", function() {

    // Get question details
    const questionText = document.getElementById("questionText").value.trim();

    const optionA = document.getElementById("optionA").value.trim();
    const optionB = document.getElementById("optionB").value.trim();
    const optionC = document.getElementById("optionC").value.trim();
    const optionD = document.getElementById("optionD").value.trim();

    const correctAnswer = document.getElementById("correctAnswer").value;

    // Validate question fields
    if (
        !questionText ||
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD ||
        !correctAnswer
    ) {

        alert("Please fill in all question fields!");

        return;

    }

    // Create question object
    const question = {

        text: questionText,

        options: {
            A: optionA,
            B: optionB,
            C: optionC,
            D: optionD
        },

        answer: correctAnswer

    };

    // Add question to temporary array
    currentQuestions.push(question);

    // Clear question form
    document.getElementById("questionText").value = "";

    document.getElementById("optionA").value = "";
    document.getElementById("optionB").value = "";
    document.getElementById("optionC").value = "";
    document.getElementById("optionD").value = "";

    document.getElementById("correctAnswer").value = "";

    // Display added questions
    displayQuestions();

    alert("Question added successfully!");

});


/* ==========================================
   5. DISPLAY ADDED QUESTIONS
========================================== */

function displayQuestions() {

    const questionList = document.getElementById("questionList");

    questionList.innerHTML = "";

    if (currentQuestions.length === 0) {

        questionList.textContent = "No questions added yet.";

        return;

    }

    currentQuestions.forEach(function(question, index) {

        const questionDiv = document.createElement("div");

        const heading = document.createElement("h4");

        heading.textContent = "Question " + (index + 1) + ": " + question.text;

        questionDiv.appendChild(heading);

        Object.entries(question.options).forEach(function([key, value]) {

            const option = document.createElement("p");

            option.textContent = key + ". " + value;

            questionDiv.appendChild(option);

        });

        const answer = document.createElement("p");

        answer.textContent = "Correct Answer: " + question.answer;

        questionDiv.appendChild(answer);

        const removeButton = document.createElement("button");

        removeButton.type = "button";

        removeButton.textContent = "Remove Question";

        removeButton.className = "btn";

        removeButton.addEventListener("click", function() {

            currentQuestions.splice(index, 1);

            displayQuestions();

        });

        questionDiv.appendChild(removeButton);

        questionList.appendChild(questionDiv);

    });

}


/* ==========================================
   6. CREATE AND SAVE QUIZ
========================================== */

const createQuizForm = document.getElementById("createQuizForm");

createQuizForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const quizTitle = document.getElementById("quizTitle").value.trim();

    // Check whether questions have been added
    if (currentQuestions.length === 0) {

        alert("Please add at least one question!");

        return;

    }

    // Create quiz object
    const newQuiz = {

        id: Date.now(),

        title: quizTitle,

        questions: [...currentQuestions]

    };

    // Save quiz in array
    quizzes.push(newQuiz);

    // Save to Local Storage
    saveQuizzes();

    alert("Quiz created successfully!");

    // Clear form
    createQuizForm.reset();

    currentQuestions = [];

    displayQuestions();

    displayQuizzes();

    updateQuizDropdown();

});


/* ==========================================
   7. DISPLAY EXISTING QUIZZES
========================================== */

function displayQuizzes() {

    const quizManagement = document.getElementById("quizManagement");

    quizManagement.innerHTML = "";

    if (quizzes.length === 0) {

        quizManagement.textContent = "No quizzes created yet.";

        return;

    }

    quizzes.forEach(function(quiz) {

        const quizDiv = document.createElement("div");

        const quizHeading = document.createElement("h4");

        quizHeading.textContent = quiz.title;

        const questionCount = document.createElement("p");

        questionCount.textContent =
            "Total Questions: " + quiz.questions.length;

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete Quiz";

        deleteButton.className = "btn";

        deleteButton.addEventListener("click", function() {

            const confirmDelete = confirm(
                "Are you sure you want to delete this quiz?"
            );

            if (confirmDelete) {

                quizzes = quizzes.filter(function(item) {

                    return item.id !== quiz.id;

                });

                saveQuizzes();

                displayQuizzes();

                updateQuizDropdown();

            }

        });

        quizDiv.appendChild(quizHeading);

        quizDiv.appendChild(questionCount);

        quizDiv.appendChild(deleteButton);

        quizManagement.appendChild(quizDiv);

    });

}


/* ==========================================
   8. UPDATE STUDENT QUIZ DROPDOWN
========================================== */

function updateQuizDropdown() {

    const quizSelect = document.getElementById("quizSelect");

    quizSelect.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select a quiz";

    quizSelect.appendChild(defaultOption);

    quizzes.forEach(function(quiz) {

        const option = document.createElement("option");

        option.value = quiz.id;

        option.textContent = quiz.title;

        quizSelect.appendChild(option);

    });

}


/* ==========================================
   9. STUDENT LOGIN
========================================== */

const studentLoginForm = document.getElementById("studentLoginForm");

let activeStudent = {};

let activeQuiz = null;

studentLoginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();

    const studentRoll = document.getElementById("studentRoll").value.trim();

    const selectedQuizId = Number(document.getElementById("quizSelect").value);

    const studentMessage = document.getElementById("studentMessage");

    // Find selected quiz
    activeQuiz = quizzes.find(function(quiz) {

        return quiz.id === selectedQuizId;

    });

    if (!activeQuiz) {

        studentMessage.textContent = "Please select a valid examination.";

        studentMessage.style.color = "red";

        return;

    }

    // Store student details
    activeStudent = {

        name: studentName,

        roll: studentRoll

    };

    // Hide login and show examination
    document.getElementById("studentLogin").hidden = true;

    document.getElementById("examArea").hidden = false;

    document.getElementById("studentResult").hidden = true;

    document.getElementById("examTitle").textContent = activeQuiz.title;

    // Display examination questions
    displayExamQuestions();

});


/* ==========================================
   10. DISPLAY EXAMINATION QUESTIONS
========================================== */

function displayExamQuestions() {

    const examQuestions = document.getElementById("examQuestions");

    examQuestions.innerHTML = "";

    activeQuiz.questions.forEach(function(question, index) {

        const questionDiv = document.createElement("div");

        const heading = document.createElement("h3");

        heading.textContent =
            (index + 1) + ". " + question.text;

        questionDiv.appendChild(heading);

        Object.entries(question.options).forEach(function([key, value]) {

            const label = document.createElement("label");

            const radio = document.createElement("input");

            radio.type = "radio";

            radio.name = "question" + index;

            radio.value = key;

            label.appendChild(radio);

            label.appendChild(document.createTextNode(" " + key + ". " + value));

            questionDiv.appendChild(label);

        });

        examQuestions.appendChild(questionDiv);

    });

}


/* ==========================================
   11. SUBMIT EXAMINATION AND CALCULATE MARKS
========================================== */

document.getElementById("submitExam").addEventListener("click", function() {

    const confirmSubmit = confirm(
        "Are you sure you want to submit your examination?"
    );

    if (!confirmSubmit) {

        return;

    }

    let score = 0;

    const totalQuestions = activeQuiz.questions.length;

    // Check student answers
    activeQuiz.questions.forEach(function(question, index) {

        const selectedAnswer = document.querySelector(
            'input[name="question' + index + '"]:checked'
        );

        if (selectedAnswer && selectedAnswer.value === question.answer) {

            score++;

        }

    });

    // Calculate percentage
    const percentage = (score / totalQuestions) * 100;

    // Create result object
    const studentResult = {

        name: activeStudent.name,

        roll: activeStudent.roll,

        quiz: activeQuiz.title,

        marks: score + "/" + totalQuestions,

        percentage: percentage.toFixed(2) + "%"

    };

    // Save result
    results.push(studentResult);

    saveResults();

    // Hide examination
    document.getElementById("examArea").hidden = true;

    // Display result
    document.getElementById("studentResult").hidden = false;

    document.getElementById("studentScore").textContent =
        "Your Score: " + score + " / " + totalQuestions;

    document.getElementById("studentPercentage").textContent =
        "Your Percentage: " + percentage.toFixed(2) + "%";

    // Update results table
    displayResults();

});


/* ==========================================
   12. DISPLAY STUDENT RESULTS
========================================== */

function displayResults() {

    const resultsTable = document.getElementById("resultsTable");

    resultsTable.innerHTML = "";

    if (results.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 5;

        cell.textContent = "No results available yet.";

        row.appendChild(cell);

        resultsTable.appendChild(row);

        return;

    }

    results.forEach(function(result) {

        const row = document.createElement("tr");

        const values = [

            result.name,

            result.roll,

            result.quiz,

            result.marks,

            result.percentage

        ];

        values.forEach(function(value) {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        resultsTable.appendChild(row);

    });

}


/* ==========================================
   13. INITIALIZE WEBSITE
========================================== */

// Display saved quizzes
displayQuizzes();

// Display quizzes in student dropdown
updateQuizDropdown();

// Display saved results
displayResults();

// Display empty question list
displayQuestions();

console.log("QuizEx JavaScript loaded successfully!");
