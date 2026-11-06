// =========================================
// 1. MENU HAMBÚRGUER (MOBILE)
// =========================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navMenu.classList.toggle('active');
});

// Fecha o menu ao clicar em um link (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        navMenu.classList.remove('active');
    });
});

// =========================================
// 2. GLOSSÁRIO PESQUISÁVEL (TEMPO REAL)
// =========================================
const searchInput = document.getElementById('glossario-search');
const glossarioItems = document.querySelectorAll('.glossario-item');
const noResults = document.getElementById('no-results');

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase().trim();
    let encontrados = 0;

    glossarioItems.forEach(item => {
        const texto = item.textContent.toLowerCase();
        if (texto.includes(termo)) {
            item.style.display = 'block';
            encontrados++;
        } else {
            item.style.display = 'none';
        }
    });

    // Mostra mensagem se nada for encontrado
    if (encontrados === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
});

// =========================================
// 3. DESTAQUE DO MENU AO ROLAR (SCROLL SPY)
// =========================================
const sections = document.querySelectorAll('section, footer');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =========================================
// 4. QUIZ GAMIFICADO
// =========================================

// Banco de Perguntas (Fácil de adicionar mais)
const allQuestions = [
    {
        question: "O que significa a filosofia Ubuntu?",
        options: ["Sou porque somos", "Cada um por si", "O mais forte vence", "Eu penso, logo existo"],
        answer: 0
    },
    {
        question: "Quem foi Dandara dos Palmares?",
        options: ["Uma rainha africana", "Uma guerreira quilombola", "Uma escritora do século XIX", "Uma líder indígena"],
        answer: 1
    },
    {
        question: "Qual é a principal característica do racismo estrutural?",
        options: ["Acontece apenas em xingamentos", "Está enraizado nas instituições e na sociedade", "É uma atitude individual", "Só existe em outros países"],
        answer: 1
    },
    {
        question: "Quem é considerada a primeira romancista negra do Brasil?",
        options: ["Sueli Carneiro", "Sonia Guajajara", "Maria Firmina dos Reis", "Dandara dos Palmares"],
        answer: 2
    },
    {
        question: "O que é equidade?",
        options: ["Tratar todos exatamente igual", "Dar as mesmas coisas para todos", "Tratar de forma justa, considerando as diferenças", "Ignorar as diferenças"],
        answer: 2
    },
    {
        question: "Qual dessas personalidades é uma liderança indígena?",
        options: ["Machado de Assis", "Sonia Guajajara", "Zumbi dos Palmares", "Maria Firmina"],
        answer: 1
    },
    {
        question: "Qual dessas é uma contribuição dos povos africanos e indígenas para a ciência?",
        options: ["Apenas invenções modernas", "Conhecimentos em astronomia e medicina tradicional", "Nenhuma contribuição", "Somente na música"],
        answer: 1
    },
    {
        question: "O que significa representatividade?",
        options: ["Presença de grupos marginalizados nos espaços de poder e mídia", "Ter muitos seguidores nas redes sociais", "Ser famoso", "Ser o mais forte"],
        answer: 0
    },
    {
        question: "Quem foi Machado de Assis?",
        options: ["Um líder quilombola", "Um dos maiores escritores da literatura brasileira", "Um político indígena", "Um cientista africano"],
        answer: 1
    },
    {
        question: "O que é antirracismo?",
        options: ["Não ter preconceito", "Apenas não falar mal de ninguém", "Uma postura ativa de combate ao racismo", "Acreditar que o racismo não existe"],
        answer: 2
    }
];

// Variáveis de Controle do Quiz
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let canAnswer = true;

// Elementos do DOM
const quizStart = document.getElementById('quiz-start');
const quizQuestion = document.getElementById('quiz-question');
const quizResult = document.getElementById('quiz-result');
const btnStartQuiz = document.getElementById('btn-start-quiz');
const btnNextQuestion = document.getElementById('btn-next-question');
const btnRestartQuiz = document.getElementById('btn-restart-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCount = document.getElementById('question-count');
const scoreDisplay = document.getElementById('score-display');
const progressBar = document.getElementById('progress-bar');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const medal = document.getElementById('medal');

// Função para Embaralhar Array (Fisher-Yates)
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Iniciar Quiz
function startQuiz() {
    // Embaralha as perguntas e pega 10 (ou todas, se houver menos)
    currentQuestions = shuffleArray([...allQuestions]).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    canAnswer = true;
    
    // Troca as telas
    quizStart.classList.remove('active');
    quizResult.classList.remove('active');
    quizQuestion.classList.add('active');
    
    loadQuestion();
}

// Carregar Pergunta
function loadQuestion() {
    canAnswer = true;
    btnNextQuestion.style.display = 'none';
    
    const q = currentQuestions[currentQuestionIndex];
    
    // Atualiza textos
    questionCount.textContent = `Pergunta ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    scoreDisplay.textContent = `🏆 Pontos: ${score}`;
    questionText.textContent = q.question;
    
    // Atualiza Barra de Progresso
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Limpa e cria opções
    optionsContainer.innerHTML = '';
    
    // Embaralha as opções também para não viciar
    const optionsWithIndex = q.options.map((opt, index) => ({ text: opt, originalIndex: index }));
    const shuffledOptions = shuffleArray([...optionsWithIndex]);
    
    shuffledOptions.forEach((option) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = option.text;
        btn.dataset.originalIndex = option.originalIndex;
        btn.addEventListener('click', () => selectAnswer(btn, option.originalIndex, q.answer));
        optionsContainer.appendChild(btn);
    });
}

// Selecionar Resposta
function selectAnswer(selectedBtn, selectedIndex, correctAnswerIndex) {
    if (!canAnswer) return;
    canAnswer = false;
    
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    
    if (selectedIndex === correctAnswerIndex) {
        // Acertou
        selectedBtn.classList.add('correct');
        score += 10;
        scoreDisplay.textContent = `🏆 Pontos: ${score}`;
    } else {
        // Errou
        selectedBtn.classList.add('wrong');
        // Mostra a correta
        allBtns.forEach(btn => {
            if (parseInt(btn.dataset.originalIndex) === correctAnswerIndex) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Desabilita todos os botões
    allBtns.forEach(btn => btn.disabled = true);
    
    // Mostra botão de próxima
    if (currentQuestionIndex < currentQuestions.length - 1) {
        btnNextQuestion.style.display = 'block';
        btnNextQuestion.textContent = 'Próxima Pergunta ➡️';
    } else {
        btnNextQuestion.style.display = 'block';
        btnNextQuestion.textContent = 'Ver Resultado 🏆';
    }
}

// Próxima Pergunta ou Resultado
btnNextQuestion.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Mostrar Resultado Final
function showResults() {
    quizQuestion.classList.remove('active');
    quizResult.classList.add('active');
    
    // Atualiza barra para 100%
    progressBar.style.width = '100%';
    
    // Calcula a medalha baseada na pontuação (máx 100 pontos)
    const maxScore = currentQuestions.length * 10;
    const percentage = (score / maxScore) * 100;
    
    if (percentage === 100) {
        medal.textContent = '🥇';
        resultTitle.textContent = 'Perfeito! Você é uma lenda!';
    } else if (percentage >= 70) {
        medal.textContent = '🥈';
        resultTitle.textContent = 'Muito bem! Quase lá!';
    } else if (percentage >= 40) {
        medal.textContent = '🥉';
        resultTitle.textContent = 'Bom trabalho! Continue estudando!';
    } else {
        medal.textContent = '📚';
        resultTitle.textContent = 'Bora revisar o conteúdo!';
    }
    
    resultText.textContent = `Você acertou ${score / 10} de ${currentQuestions.length} perguntas (${score} pontos).`;
}

// Reiniciar Quiz
btnRestartQuiz.addEventListener('click', startQuiz);

// Evento para iniciar o quiz
btnStartQuiz.addEventListener('click', startQuiz);