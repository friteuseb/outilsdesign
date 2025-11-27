/**
 * Index de Souveraineté Numérique - Application
 * Auto-évaluation basée sur les 4 dimensions de la souveraineté numérique
 */

// Questions organized by dimension
const questions = [
    // Dimension 1: Contrôle des données, contenus et fonctions (5 questions)
    {
        id: 1,
        dimension: 'control',
        dimensionName: 'Contrôle des données',
        dimensionIcon: '🎮',
        text: "J'ai un accès complet à toutes mes données et je peux les exporter à tout moment dans des formats standards."
    },
    {
        id: 2,
        dimension: 'control',
        dimensionName: 'Contrôle des données',
        dimensionIcon: '🎮',
        text: "Je comprends et maîtrise les paramètres de configuration de mes outils numériques."
    },
    {
        id: 3,
        dimension: 'control',
        dimensionName: 'Contrôle des données',
        dimensionIcon: '🎮',
        text: "Je peux modifier, supprimer ou déplacer mes données sans restriction de la part des fournisseurs."
    },
    {
        id: 4,
        dimension: 'control',
        dimensionName: 'Contrôle des données',
        dimensionIcon: '🎮',
        text: "J'utilise des formats de fichiers ouverts et interopérables pour mes documents importants."
    },
    {
        id: 5,
        dimension: 'control',
        dimensionName: 'Contrôle des données',
        dimensionIcon: '🎮',
        text: "Je dispose de sauvegardes régulières de mes données sur des supports que je contrôle."
    },

    // Dimension 2: Indépendance vis-à-vis des fournisseurs externes (5 questions)
    {
        id: 6,
        dimension: 'independence',
        dimensionName: 'Indépendance',
        dimensionIcon: '🔓',
        text: "Je peux changer de fournisseur de services numériques sans perdre mes données ou fonctionnalités essentielles."
    },
    {
        id: 7,
        dimension: 'independence',
        dimensionName: 'Indépendance',
        dimensionIcon: '🔓',
        text: "J'évite de dépendre d'un seul fournisseur pour mes services numériques critiques (effet de verrouillage)."
    },
    {
        id: 8,
        dimension: 'independence',
        dimensionName: 'Indépendance',
        dimensionIcon: '🔓',
        text: "Je privilégie les logiciels open-source ou les solutions avec code source accessible."
    },
    {
        id: 9,
        dimension: 'independence',
        dimensionName: 'Indépendance',
        dimensionIcon: '🔓',
        text: "Mes outils numériques fonctionnent sans connexion internet obligatoire pour les tâches de base."
    },
    {
        id: 10,
        dimension: 'independence',
        dimensionName: 'Indépendance',
        dimensionIcon: '🔓',
        text: "Je choisis des solutions hébergées localement ou dans des juridictions qui protègent mes droits."
    },

    // Dimension 3: Vie privée et sécurité (5 questions)
    {
        id: 11,
        dimension: 'privacy',
        dimensionName: 'Vie privée & Sécurité',
        dimensionIcon: '🔐',
        text: "J'utilise des mots de passe forts et uniques, idéalement gérés par un gestionnaire de mots de passe."
    },
    {
        id: 12,
        dimension: 'privacy',
        dimensionName: 'Vie privée & Sécurité',
        dimensionIcon: '🔐',
        text: "J'active l'authentification à deux facteurs (2FA) sur mes comptes importants."
    },
    {
        id: 13,
        dimension: 'privacy',
        dimensionName: 'Vie privée & Sécurité',
        dimensionIcon: '🔐',
        text: "Je chiffre mes données sensibles (disque dur, communications, sauvegardes)."
    },
    {
        id: 14,
        dimension: 'privacy',
        dimensionName: 'Vie privée & Sécurité',
        dimensionIcon: '🔐',
        text: "Je vérifie régulièrement les autorisations accordées aux applications et services."
    },
    {
        id: 15,
        dimension: 'privacy',
        dimensionName: 'Vie privée & Sécurité',
        dimensionIcon: '🔐',
        text: "Je suis informé(e) et en contrôle des données collectées à mon sujet par les services que j'utilise."
    },

    // Dimension 4: Accessibilité et compétences (5 questions)
    {
        id: 16,
        dimension: 'accessibility',
        dimensionName: 'Accessibilité',
        dimensionIcon: '♿',
        text: "Je possède les compétences techniques nécessaires pour gérer mes outils numériques de manière autonome."
    },
    {
        id: 17,
        dimension: 'accessibility',
        dimensionName: 'Accessibilité',
        dimensionIcon: '♿',
        text: "Les outils numériques que j'utilise sont accessibles et utilisables par tous (handicap, langue, etc.)."
    },
    {
        id: 18,
        dimension: 'accessibility',
        dimensionName: 'Accessibilité',
        dimensionIcon: '♿',
        text: "Je dispose d'une documentation claire et de ressources d'aide pour mes outils numériques."
    },
    {
        id: 19,
        dimension: 'accessibility',
        dimensionName: 'Accessibilité',
        dimensionIcon: '♿',
        text: "Je continue à me former régulièrement sur les bonnes pratiques numériques."
    },
    {
        id: 20,
        dimension: 'accessibility',
        dimensionName: 'Accessibilité',
        dimensionIcon: '♿',
        text: "Je participe à une communauté ou j'ai accès à un support pour résoudre mes problèmes techniques."
    }
];

// Rating scale options
const ratingOptions = [
    { value: 1, text: "Pas du tout d'accord" },
    { value: 2, text: "Plutôt pas d'accord" },
    { value: 3, text: "Indécis / Ne sais pas" },
    { value: 4, text: "Plutôt d'accord" },
    { value: 5, text: "Tout à fait d'accord" }
];

// Grade definitions
const grades = {
    A: { min: 80, label: "Excellent", description: "Souveraineté numérique optimale" },
    B: { min: 65, label: "Bon", description: "Bonne maîtrise avec quelques améliorations possibles" },
    C: { min: 50, label: "Moyen", description: "Niveau acceptable mais des progrès sont nécessaires" },
    D: { min: 35, label: "Insuffisant", description: "Plusieurs points d'amélioration urgents" },
    E: { min: 0, label: "Critique", description: "Action immédiate requise" }
};

// Recommendations by dimension and score range
const recommendationsByDimension = {
    control: {
        low: {
            icon: '📦',
            title: 'Reprendre le contrôle de vos données',
            text: 'Commencez par identifier où sont stockées vos données importantes. Utilisez des services qui permettent l\'export de données (formats CSV, JSON, ou standards ouverts). Mettez en place des sauvegardes régulières sur un disque dur externe ou un NAS personnel.'
        },
        medium: {
            icon: '📦',
            title: 'Améliorer la portabilité des données',
            text: 'Envisagez de migrer vers des formats ouverts (LibreOffice, Markdown). Documentez vos configurations et paramètres importants. Testez régulièrement vos exports de données pour vous assurer qu\'ils sont complets.'
        },
        high: {
            icon: '📦',
            title: 'Maintenir votre excellente gestion',
            text: 'Continuez vos bonnes pratiques. Envisagez d\'automatiser vos sauvegardes. Partagez vos connaissances avec votre entourage pour les aider à progresser.'
        }
    },
    independence: {
        low: {
            icon: '🔓',
            title: 'Réduire votre dépendance',
            text: 'Identifiez vos points de dépendance critique (un seul fournisseur email, cloud, etc.). Explorez des alternatives open-source : Nextcloud, ProtonMail, Signal. Gardez toujours un plan B pour vos services essentiels.'
        },
        medium: {
            icon: '🔓',
            title: 'Diversifier vos solutions',
            text: 'Évaluez les alternatives pour vos 2-3 services les plus utilisés. Testez des solutions auto-hébergées si vous avez les compétences techniques. Privilégiez les solutions européennes pour une meilleure protection juridique.'
        },
        high: {
            icon: '🔓',
            title: 'Optimiser votre indépendance',
            text: 'Documentez votre architecture numérique pour faciliter les migrations futures. Restez informé des évolutions des services que vous utilisez. Contribuez aux projets open-source que vous utilisez.'
        }
    },
    privacy: {
        low: {
            icon: '🔐',
            title: 'Sécuriser vos accès en priorité',
            text: 'Adoptez immédiatement un gestionnaire de mots de passe (Bitwarden, KeePass). Activez la 2FA sur vos comptes email et bancaires. Faites un audit des applications ayant accès à vos données.'
        },
        medium: {
            icon: '🔐',
            title: 'Renforcer votre sécurité',
            text: 'Chiffrez votre disque dur et vos sauvegardes. Utilisez un VPN de confiance. Révisez les paramètres de confidentialité de vos réseaux sociaux et limitez le partage de données.'
        },
        high: {
            icon: '🔐',
            title: 'Perfectionner votre protection',
            text: 'Envisagez des communications chiffrées de bout en bout (Signal, ProtonMail). Faites des audits de sécurité réguliers. Restez informé des nouvelles menaces et bonnes pratiques.'
        }
    },
    accessibility: {
        low: {
            icon: '📚',
            title: 'Développer vos compétences',
            text: 'Suivez des formations en ligne gratuites sur la sécurité numérique. Rejoignez des communautés d\'entraide (forums, groupes locaux). Commencez par maîtriser un outil à la fois.'
        },
        medium: {
            icon: '📚',
            title: 'Approfondir vos connaissances',
            text: 'Explorez les aspects techniques de vos outils préférés. Testez l\'accessibilité de vos contenus numériques. Partagez vos connaissances pour les consolider.'
        },
        high: {
            icon: '📚',
            title: 'Devenir ambassadeur',
            text: 'Aidez votre entourage à progresser. Contribuez à des projets communautaires. Restez en veille sur les innovations en accessibilité numérique.'
        }
    }
};

// App State
let currentQuestion = 0;
let answers = {};

// DOM Elements
const introSection = document.getElementById('intro');
const assessmentSection = document.getElementById('assessment');
const resultsSection = document.getElementById('results');
const assessmentForm = document.getElementById('assessmentForm');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize app
function init() {
    startBtn.addEventListener('click', startAssessment);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', showResults);
    restartBtn.addEventListener('click', restartAssessment);
    exportBtn.addEventListener('click', exportResults);

    // Load saved progress if any
    loadProgress();
}

// Start assessment
function startAssessment() {
    introSection.hidden = true;
    assessmentSection.hidden = false;
    renderQuestion();
}

// Render current question
function renderQuestion() {
    const question = questions[currentQuestion];

    let html = `
        <div class="question-card">
            <div class="question-dimension" data-dimension="${question.dimension}">
                <span>${question.dimensionIcon}</span>
                ${question.dimensionName}
            </div>
            <h3 class="question-text">${question.text}</h3>
            <div class="rating-scale" role="radiogroup" aria-label="Échelle d'évaluation">
    `;

    ratingOptions.forEach(option => {
        const isChecked = answers[question.id] === option.value;
        html += `
            <div class="rating-option">
                <input
                    type="radio"
                    name="q${question.id}"
                    id="q${question.id}_${option.value}"
                    value="${option.value}"
                    ${isChecked ? 'checked' : ''}
                    aria-describedby="rating-desc-${option.value}"
                >
                <label for="q${question.id}_${option.value}" class="rating-label">
                    <span class="rating-number">${option.value}</span>
                    <span class="rating-text" id="rating-desc-${option.value}">${option.text}</span>
                </label>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    assessmentForm.innerHTML = html;

    // Add event listeners for radio buttons
    const radioButtons = assessmentForm.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[question.id] = parseInt(e.target.value);
            saveProgress();
            updateNavigationState();
        });
    });

    updateProgress();
    updateNavigationState();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
}

// Update navigation buttons state
function updateNavigationState() {
    prevBtn.disabled = currentQuestion === 0;

    const isLastQuestion = currentQuestion === questions.length - 1;
    const hasAnswer = answers[questions[currentQuestion].id] !== undefined;

    if (isLastQuestion) {
        nextBtn.hidden = true;
        submitBtn.hidden = false;
        submitBtn.disabled = !hasAnswer;
    } else {
        nextBtn.hidden = false;
        submitBtn.hidden = true;
        nextBtn.disabled = !hasAnswer;
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1 && answers[questions[currentQuestion].id] !== undefined) {
        currentQuestion++;
        renderQuestion();
    }
}

// Calculate scores
function calculateScores() {
    const dimensions = {
        control: { total: 0, count: 0, max: 0 },
        independence: { total: 0, count: 0, max: 0 },
        privacy: { total: 0, count: 0, max: 0 },
        accessibility: { total: 0, count: 0, max: 0 }
    };

    questions.forEach(q => {
        const answer = answers[q.id] || 0;
        dimensions[q.dimension].total += answer;
        dimensions[q.dimension].count++;
        dimensions[q.dimension].max += 5;
    });

    // Calculate percentage for each dimension
    const dimensionScores = {};
    let overallTotal = 0;
    let overallMax = 0;

    Object.keys(dimensions).forEach(dim => {
        const d = dimensions[dim];
        dimensionScores[dim] = Math.round((d.total / d.max) * 100);
        overallTotal += d.total;
        overallMax += d.max;
    });

    const overallScore = Math.round((overallTotal / overallMax) * 100);

    return { dimensionScores, overallScore };
}

// Get grade from score
function getGrade(score) {
    if (score >= grades.A.min) return 'A';
    if (score >= grades.B.min) return 'B';
    if (score >= grades.C.min) return 'C';
    if (score >= grades.D.min) return 'D';
    return 'E';
}

// Get score level for recommendations
function getScoreLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

// Show results
function showResults() {
    const { dimensionScores, overallScore } = calculateScores();
    const overallGrade = getGrade(overallScore);

    assessmentSection.hidden = true;
    resultsSection.hidden = false;

    // Update overall score display
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreGrade = document.getElementById('scoreGrade');
    const scoreValue = document.getElementById('scoreValue');
    const scoreLabel = document.getElementById('scoreLabel');

    scoreCircle.className = `score-circle grade-${overallGrade}`;
    scoreGrade.textContent = overallGrade;
    scoreValue.textContent = `${overallScore}/100`;
    scoreLabel.textContent = grades[overallGrade].description;

    // Render dimension breakdown
    renderDimensionBreakdown(dimensionScores);

    // Render recommendations
    renderRecommendations(dimensionScores);

    // Clear saved progress
    localStorage.removeItem('sovereigntyIndexProgress');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render dimension breakdown cards
function renderDimensionBreakdown(dimensionScores) {
    const container = document.getElementById('dimensionsBreakdown');
    const dimensionInfo = {
        control: { name: 'Contrôle des données', icon: '🎮' },
        independence: { name: 'Indépendance', icon: '🔓' },
        privacy: { name: 'Vie privée & Sécurité', icon: '🔐' },
        accessibility: { name: 'Accessibilité', icon: '♿' }
    };

    let html = '';

    Object.keys(dimensionScores).forEach(dim => {
        const score = dimensionScores[dim];
        const grade = getGrade(score);
        const info = dimensionInfo[dim];

        html += `
            <div class="dimension-card">
                <div class="dimension-header">
                    <span class="dimension-icon">${info.icon}</span>
                    <span class="dimension-title">${info.name}</span>
                </div>
                <div class="dimension-score-bar">
                    <div class="dimension-score-fill grade-${grade}" style="width: ${score}%"></div>
                </div>
                <div class="dimension-score-value grade-${grade}">${score}% - Note ${grade}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render recommendations
function renderRecommendations(dimensionScores) {
    const container = document.getElementById('recommendationsList');

    // Sort dimensions by score (lowest first for priority)
    const sortedDimensions = Object.entries(dimensionScores)
        .sort((a, b) => a[1] - b[1]);

    let html = '';

    sortedDimensions.forEach(([dim, score], index) => {
        const level = getScoreLevel(score);
        const rec = recommendationsByDimension[dim][level];
        const priority = index < 2 ? (score < 50 ? 'high' : 'medium') : 'low';

        html += `
            <div class="recommendation-item priority-${priority}">
                <span class="recommendation-icon">${rec.icon}</span>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.text}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Restart assessment
function restartAssessment() {
    currentQuestion = 0;
    answers = {};
    localStorage.removeItem('sovereigntyIndexProgress');

    resultsSection.hidden = true;
    introSection.hidden = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export results to PDF (using print)
function exportResults() {
    window.print();
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        currentQuestion,
        answers,
        timestamp: Date.now()
    };
    localStorage.setItem('sovereigntyIndexProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('sovereigntyIndexProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            // Check if progress is less than 24 hours old
            if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
                currentQuestion = progress.currentQuestion;
                answers = progress.answers;
            } else {
                localStorage.removeItem('sovereigntyIndexProgress');
            }
        } catch (e) {
            localStorage.removeItem('sovereigntyIndexProgress');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
