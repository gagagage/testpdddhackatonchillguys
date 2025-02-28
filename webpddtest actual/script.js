document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            question: "Что означает этот знак?",
            options: ["Пешеходный переход", "Остановка запрещена", "Главная дорога"],
            correctAnswer: 0,
            image: "https://thumbs.dreamstime.com/b/pedestrian-crossing-sign-moscow-12933064.jpg"
        },
        {
            question: "Какое действие необходимо выполнить при таком сигнале?",
            options: ["Остановиться", "Продолжить движение", "Уступить дорогу"],
            correctAnswer: 0,
            image: "https://avatars.mds.yandex.net/i?id=6f8455e6e7ee31e536ce60c119f1d3ed_l-5165563-images-thumbs&n=13"
        },
        {
            question: "Какое в России движение: лево- или правостороннее?",
            options: ["Правостороннее", "Левостороннее"],
            correctAnswer: 0,
            image: "https://avatars.mds.yandex.net/i?id=e21fe1b03e853c9ecfe97227069c20af_l-10870279-images-thumbs&n=13"
        },
        {
            question: "Кто отвечает за порядок на дорогах?",
            options: ["Полиция", "ОМОН", "ГИБДД"],
            correctAnswer: 2,
            image: "https://dop.68edu.ru/wp-content/uploads/2021/10/123.jpg"
        },
        {
            question: "К каким действиям побуждает желтый свет светофора?",
            options: ["Можно ехать", "Нужно ждать", "Разворот"],
            correctAnswer: 1,
            image: "https://cdnstatic.rg.ru/uploads/images/2022/09/07/istock-847334914_cea.jpg"
        },
        {
            question: "Что следует сделать прежде, чем переходить проезжую часть улицы?",
            options: ["Сразу идти", "Посмотреть направо", "Посмотреть налево и направо"],
            correctAnswer: 2,
            image: "https://cdn.culture.ru/images/770fb648-01ae-5350-a6a2-f5709b783b3d"
        },
        {
            question: "Можно ли переходить дорогу бегом?",
            options: ["Да", "Пока нет машин", "Спокойно на переходе"],
            correctAnswer: 2,
            image: "https://cdn.culture.ru/images/d650983a-f274-5564-9b52-c6906bc17b56"
        },
        {
            question: "Можно или нет играть на проезжей части?",
            options: ["Нет", "Пока нет машин", "Да"],
            correctAnswer: 0,
            image: "https://podrostok.edu.yar.ru/streetlaw/pdd/memo-pdd-2-5.png"
        },
        {
            question: "Как называется место ожидания пассажирского транспорта?",
            options: ["Дорога", "Спец. помещение", "Остановка"],
            correctAnswer: 2,
            image: "https://s13.stc.yc.kpcdn.net/share/i/12/13034188/wr-960.webp"
        },
        {
            question: "Что держит в руке инспектор ГИБДД?",
            options: ["Фонарь", "Ручку", "Жезл"],
            correctAnswer: 2,
            image: "https://a.d-cd.net/6246ec5s-960.jpg"
        }
    ];

    const levels = [
        questions.slice(0, 5), 
        questions.slice(5, 10) 
    ];

    let currentLevelIndex = 0;
    let currentQuestionIndex = 0;
    let score = 0;
    let lives = 3;
    let skipsLeft = 2;
    let startTime;
    let questionTimer;

    function startQuiz() {
        startTime = Date.now();
        document.getElementById("start-btn").style.display = "none";

        const quizContent = document.getElementById("quiz-content");
        quizContent.style.display = "block";
        quizContent.classList.add("active");

        loadQuestion();
        updateScore();
        updateLives();
        updateSkips();
        updateLevel();
    }

    function loadQuestion() {
        const level = levels[currentLevelIndex];
        if (!level || currentQuestionIndex >= level.length || lives <= 0) {
            endLevel();
            return;
        }

        const questionElement = document.getElementById("question");
        const optionsElement = document.getElementById("options");
        const submitBtn = document.getElementById("submit-btn");
        const hintBtn = document.getElementById("hint-btn");
        const imageElement = document.getElementById("question-image");

        const currentQuestion = level[currentQuestionIndex];

        questionElement.textContent = currentQuestion.question;
        imageElement.src = currentQuestion.image;

        optionsElement.innerHTML = "";
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.addEventListener("click", () => selectOption(index));
            optionsElement.appendChild(button);
        });

        submitBtn.disabled = true;
        hintBtn.disabled = score < 300;

        clearInterval(questionTimer);
        let timeLeft = 30;
        const timerElement = document.getElementById("timer");
        timerElement.textContent = `Время: ${timeLeft} сек.`;

        questionTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Время: ${timeLeft} сек.`;
            if (timeLeft <= 0) {
                clearInterval(questionTimer);
                alert("Время вышло! Вы теряете жизнь.");
                lives--;
                updateLives();
                if (lives <= 0) {
                    endGame();
                } else {
                    currentQuestionIndex++;
                    loadQuestion();
                }
            }
        }, 1000);
    }

    function selectOption(selectedIndex) {
        const optionsElement = document.getElementById("options");
        const buttons = optionsElement.querySelectorAll("button");

        buttons.forEach((button, index) => {
            if (index === selectedIndex) {
                button.classList.add("selected");
            } else {
                button.classList.remove("selected");
            }
        });

        document.getElementById("submit-btn").disabled = false;
    }

    function checkAnswer() {
        const selectedButton = document.querySelector("#options button.selected");
        if (!selectedButton) return;

        const selectedIndex = Array.from(document.getElementById("options").children).indexOf(selectedButton);
        const currentQuestion = levels[currentLevelIndex][currentQuestionIndex];

        if (selectedIndex === currentQuestion.correctAnswer) {
            score += 100;
            updateScore();
            alert("Правильный ответ! +100 очков.");
        } else {
            lives--;
            updateLives();
            alert("Неправильный ответ! Вы теряете жизнь.");
            if (lives <= 0) {
                endGame();
                return;
            }
        }

        currentQuestionIndex++;
        loadQuestion();
    }

    function skipQuestion() {
        if (skipsLeft > 0) {
            skipsLeft--;
            updateSkips();
            currentQuestionIndex++;
            loadQuestion();
        } else {
            alert("Нет доступных пропусков!");
        }
    }

    function useHint() {
        if (score < 300) {
            alert("Недостаточно очков для использования подсказки!");
            return;
        }

        score -= 300;
        updateScore();

        const optionsElement = document.getElementById("options");
        const currentQuestion = levels[currentLevelIndex][currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;

        const buttons = optionsElement.querySelectorAll("button");
        if (buttons.length > 0 && correctIndex !== undefined) {
            buttons.forEach(button => button.classList.remove("hint-highlight"));
            buttons[correctIndex].classList.add("hint-highlight");
        } else {
            console.warn("Правильный ответ не найден.");
        }

        document.getElementById("hint-btn").disabled = true;
    }

    function endLevel() {
        currentLevelIndex++;
        currentQuestionIndex = 0;

        if (currentLevelIndex >= levels.length) {
            endGame();
        } else {
            alert(`Вы прошли уровень ${currentLevelIndex}! Начинаем следующий уровень.`);
            updateLevel();
            loadQuestion();
        }
    }

    function endGame() {
        clearInterval(questionTimer);
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        const totalScore = score;
        let rank;

        if (totalScore >= 2000) {
            rank = "Профессионал";
        } else if (totalScore >= 1500) {
            rank = "Хороший водитель";
        } else if (totalScore >= 1000) {
            rank = "Начинающий водитель";
        } else {
            rank = "Новичок";
        }

        const ratingText = document.getElementById("rating-text");
        const stars = calculateStars(totalScore);

        ratingText.textContent = `Твой результат: ${totalScore} очков. Твой ранг: ${rank}. Время: ${elapsedTime} сек.\nОценка: ${stars}`;

        const quizContent = document.getElementById("quiz-content");
        quizContent.classList.remove("active");
        quizContent.style.display = "none";

        const ratingDiv = document.getElementById("rating");
        ratingDiv.classList.add("active");
        ratingDiv.style.display = "block";
    }

    function calculateStars(score) {
        if (score >= 2000) return "⭐️⭐️⭐️⭐️⭐️"; 
        if (score >= 1500) return "⭐️⭐️⭐️⭐️"; 
        if (score >= 1000) return "⭐️⭐️⭐️"; 
        if (score >= 500) return "⭐️⭐️"; 
        return "⭐️"; 
    }

    function restartQuiz() {
        clearInterval(questionTimer);
        const ratingDiv = document.getElementById("rating");
        ratingDiv.classList.remove("active");
        ratingDiv.style.display = "none";

        document.getElementById("quiz-content").style.display = "none";
        document.getElementById("start-btn").style.display = "block";

        currentLevelIndex = 0;
        currentQuestionIndex = 0;
        score = 0;
        lives = 3;
        skipsLeft = 2;

        updateScore();
        updateLives();
        updateSkips();
        updateLevel();
    }

    function updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Очки: ${score}`;
    }

    function updateLives() {
        const livesElement = document.getElementById("lives");
        livesElement.textContent = `Жизни: ${"❤️".repeat(lives)}`;
    }

    function updateSkips() {
        const skipsElement = document.getElementById("skips");
        skipsElement.textContent = `Пропуски: ${"⭐️".repeat(skipsLeft)}`;
    }

    function updateLevel() {
        const levelInfo = document.getElementById("level-info");
        if (levelInfo) {
            levelInfo.textContent = `Уровень ${currentLevelIndex + 1}`;
        } else {
            console.warn("Элемент с ID 'level-info' не найден.");
        }
    }

    document.getElementById("start-btn").addEventListener("click", startQuiz);
    document.getElementById("submit-btn").addEventListener("click", checkAnswer);
    document.getElementById("skip-btn").addEventListener("click", skipQuestion);
    document.getElementById("hint-btn").addEventListener("click", useHint);
    document.getElementById("restart-btn").addEventListener("click", restartQuiz);
});