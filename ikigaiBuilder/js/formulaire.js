// Gestionnaire du formulaire Ikigai
class IkigaiFormulaire {
    constructor() {
        this.currentSection = 0;
        this.sections = ['passion', 'mission', 'profession', 'vocation'];
        this.data = {
            passions: [],
            talents: [],
            problems: [],
            skills: []
        };
        this.init();
    }

    init() {
        this.loadSavedData();
        this.updateProgress();
        this.showCurrentSection();
    }

    // Navigation entre sections
    changeSection(direction) {
        const newSection = this.currentSection + direction;
        
        if (newSection >= 0 && newSection < this.sections.length) {
            this.saveCurrentSection();
            this.currentSection = newSection;
            this.showCurrentSection();
            this.updateProgress();
            this.updateNavigation();
        }
    }

    showCurrentSection() {
        // Masquer toutes les sections
        document.querySelectorAll('.section-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Afficher la section courante
        const currentCard = document.querySelector(`.section-card.${this.sections[this.currentSection]}`);
        if (currentCard) {
            currentCard.classList.add('active');
        }
        
        // Mettre à jour les dots de progression
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < this.currentSection) {
                dot.classList.add('completed');
            } else if (index === this.currentSection) {
                dot.classList.add('active');
            }
        });
    }

    updateProgress() {
        const progress = ((this.currentSection + 1) / this.sections.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        prevBtn.style.display = this.currentSection > 0 ? 'block' : 'none';
        nextBtn.style.display = this.currentSection < this.sections.length - 1 ? 'block' : 'none';
        analyzeBtn.style.display = this.currentSection === this.sections.length - 1 ? 'block' : 'none';
    }

    // Gestion des tags
    addTag(event, containerId, dataKey) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const input = event.target;
            const value = input.value.trim();
            
            if (value && !this.data[dataKey].includes(value)) {
                this.data[dataKey].push(value);
                this.renderTags(containerId, dataKey);
                input.value = '';
                this.saveData();
                showNotification(`"${value}" ajouté à ${this.getSectionName(dataKey)}`, 'success');
            }
        }
    }

    removeTag(containerId, dataKey, tagValue) {
        const index = this.data[dataKey].indexOf(tagValue);
        if (index > -1) {
            this.data[dataKey].splice(index, 1);
            this.renderTags(containerId, dataKey);
            this.saveData();
            showNotification(`"${tagValue}" supprimé`, 'info');
        }
    }

    renderTags(containerId, dataKey) {
        const container = document.getElementById(containerId);
        const input = container.querySelector('.tag-input-field');
        
        // Supprimer les tags existants
        container.querySelectorAll('.tag').forEach(tag => tag.remove());
        
        // Ajouter les nouveaux tags
        this.data[dataKey].forEach(tagValue => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${tagValue}
                <span class="tag-remove" onclick="formManager.removeTag('${containerId}', '${dataKey}', '${tagValue}')">×</span>
            `;
            container.insertBefore(tag, input);
        });
    }

    // Sauvegarder la section courante
    saveCurrentSection() {
        const sectionKey = this.sections[this.currentSection];
        
        switch(sectionKey) {
            case 'passion':
                this.data.passionDescription = document.getElementById('passionDescription').value;
                break;
            case 'mission':
                this.data.talentFeedback = document.getElementById('talentFeedback').value;
                break;
            case 'profession':
                this.data.worldContribution = document.getElementById('worldContribution').value;
                break;
            case 'vocation':
                this.data.economicOpportunities = document.getElementById('economicOpportunities').value;
                break;
        }
        
        this.saveData();
    }

    // Sauvegarder toutes les données
    saveData() {
        dataManager.saveData(this.data);
    }

    // Charger les données sauvegardées
    loadSavedData() {
        const savedData = dataManager.loadData();
        this.data = { ...this.data, ...savedData };
        
        // Restaurer les champs de texte
        if (this.data.passionDescription) {
            document.getElementById('passionDescription').value = this.data.passionDescription;
        }
        if (this.data.talentFeedback) {
            document.getElementById('talentFeedback').value = this.data.talentFeedback;
        }
        if (this.data.worldContribution) {
            document.getElementById('worldContribution').value = this.data.worldContribution;
        }
        if (this.data.economicOpportunities) {
            document.getElementById('economicOpportunities').value = this.data.economicOpportunities;
        }
        
        // Restaurer les tags
        this.renderTags('passionTags', 'passions');
        this.renderTags('talentTags', 'talents');
        this.renderTags('problemTags', 'problems');
        this.renderTags('skillTags', 'skills');
    }

    // Utilitaires
    getSectionName(dataKey) {
        const names = {
            passions: 'ce que vous aimez',
            talents: 'vos talents',
            problems: 'les problèmes',
            skills: 'vos compétences'
        };
        return names[dataKey] || dataKey;
    }

    // Remplir avec des données d'exemple
    fillExampleData() {
        this.data = {
            passions: ['Technologie', 'Éducation', 'Innovation sociale'],
            talents: ['Communication', 'Analyse', 'Créativité', 'Leadership'],
            problems: ['Fracture numérique', 'Accès à l\'éducation', 'Inégalités'],
            skills: ['Développement web', 'Formation', 'Conseil', 'Gestion de projet'],
            passionDescription: 'Je suis passionné par la technologie et son potentiel pour résoudre des problèmes sociaux. J\'aime créer des solutions innovantes qui facilitent la vie des gens.',
            talentFeedback: 'Les gens me reconnaissent ma capacité à expliquer des concepts complexes de manière simple et ma créativité dans la résolution de problèmes.',
            worldContribution: 'Je veux contribuer à réduire la fracture numérique en rendant la technologie accessible à tous, particulièrement dans l\'éducation.',
            economicOpportunities: 'Je vois des opportunités dans la formation numérique, le développement d\'applications éducatives et le conseil en transformation digitale.'
        };
        
        this.saveData();
        this.loadSavedData();
        showNotification('Données d\'exemple chargées !', 'success');
    }

    // Analyser l'Ikigai
    analyzeIkigai() {
        this.saveCurrentSection();
        
        if (this.isDataComplete()) {
            showNotification('Analyse en cours...', 'info');
            setTimeout(() => {
                window.location.href = 'analyse.html';
            }, 1000);
        } else {
            showNotification('Veuillez compléter toutes les sections avant l\'analyse', 'warning', 5000);
        }
    }

    isDataComplete() {
        return this.data.passions.length > 0 && 
               this.data.talents.length > 0 && 
               this.data.problems.length > 0 && 
               this.data.skills.length > 0;
    }

    // Sauvegarder le progrès
    saveProgress() {
        this.saveCurrentSection();
        const blob = new Blob([JSON.stringify(this.data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ikigai-progress.json';
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Progrès sauvegardé !', 'success');
    }

    // Charger le progrès
    loadProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                dataManager.importData(file).then(data => {
                    this.data = data;
                    this.loadSavedData();
                    showNotification('Progrès chargé !', 'success');
                }).catch(error => {
                    showNotification('Erreur lors du chargement', 'error');
                });
            }
        };
        input.click();
    }
}

// Questions guidées
const guidedQuestions = {
    passions: {
        socratic: [
            'Qu\'est-ce qui vous fait perdre la notion du temps ?',
            'De quoi parlez-vous avec le plus d\'enthousiasme ?',
            'Qu\'aimeriez-vous faire même sans être payé ?',
            'Quelles activités vous donnent de l\'énergie ?'
        ],
        analogies: [
            'Si vous étiez un super-héros, quel serait votre pouvoir ?',
            'Si vous aviez un restaurant, quel serait le plat signature ?',
            'Quel livre non-écrit aimeriez-vous lire ?'
        ],
        triggers: [
            'Qu\'avez-vous aimé faire enfant ?',
            'Quels sujets vous révoltent ou vous passionnent dans l\'actualité ?',
            'Que feriez-vous si vous aviez une fortune illimitée ?'
        ]
    },
    talents: {
        socratic: [
            'Qu\'est-ce qui vous semble facile mais difficile pour les autres ?',
            'Dans quoi êtes-vous naturellement bon sans effort ?',
            'Quels compliments recevez-vous souvent ?',
            'Que vous demande-t-on souvent de faire ?'
        ],
        analogies: [
            'Si vous étiez un outil, lequel seriez-vous ?',
            'Quel rôle jouez-vous naturellement dans une équipe ?',
            'Si votre talent était une couleur, laquelle serait-ce ?'
        ],
        triggers: [
            'Quels sont vos succès dont vous êtes le plus fier ?',
            'Dans quelles situations brillez-vous naturellement ?',
            'Qu\'est-ce que vous maîtrisez mieux que la plupart des gens ?'
        ]
    },
    problems: {
        socratic: [
            'Quels problèmes du monde vous préoccupent le plus ?',
            'Qu\'aimeriez-vous changer dans votre environnement ?',
            'Quelles injustices vous révoltent ?',
            'Où voyez-vous du gaspillage ou de l\'inefficacité ?'
        ],
        analogies: [
            'Si vous étiez maire de votre ville, que changeriez-vous ?',
            'Si vous pouviez réparer une chose dans le monde, ce serait quoi ?',
            'Quel problème voudriez-vous résoudre pour vos enfants ?'
        ],
        triggers: [
            'Qu\'est-ce qui vous frustre dans votre quotidien ?',
            'Quels besoins non satisfaits observez-vous autour de vous ?',
            'Dans quel domaine y a-t-il un manque criant de solutions ?'
        ]
    },
    skills: {
        socratic: [
            'Pour quoi les gens seraient-ils prêts à vous payer ?',
            'Quelles compétences pourriez-vous enseigner ?',
            'Qu\'avez-vous appris qui a de la valeur pour les autres ?',
            'Quels services pourriez-vous proposer dès aujourd\'hui ?'
        ],
        analogies: [
            'Si vous ouvriez une boutique, que vendriez-vous ?',
            'Si vous étiez consultant, dans quel domaine ?',
            'Quel problème résolvez-vous si bien qu\'on vous paierait pour ?'
        ],
        triggers: [
            'Quelles compétences vous ont déjà rapporté de l\'argent ?',
            'Que savez-vous faire que peu de gens savent faire ?',
            'Quels sont les besoins du marché que vous pourriez satisfaire ?'
        ]
    }
};

// Gestion des questions guidées
function showGuidedQuestions(section) {
    const modal = document.getElementById('guidedQuestionsModal');
    const title = document.getElementById('modalTitle');
    const container = document.getElementById('questionsContainer');
    
    title.textContent = `Questions guidées - ${getSectionTitle(section)}`;
    
    // Afficher l'onglet socratique par défaut
    switchQuestionTab('socratic', section);
    
    modal.style.display = 'block';
    window.currentQuestionSection = section;
}

function closeGuidedQuestions() {
    document.getElementById('guidedQuestionsModal').style.display = 'none';
}

function switchQuestionTab(type, section = window.currentQuestionSection) {
    // Mettre à jour les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Afficher les questions
    const container = document.getElementById('questionsContainer');
    const questions = guidedQuestions[section][type];
    
    container.innerHTML = `
        <div class="question-section active">
            ${questions.map(question => `
                <div class="question-item">
                    <div class="question-text">${question}</div>
                    <div class="question-buttons">
                        <button class="btn-small btn-primary" onclick="addInsightFromQuestion('${section}', '${question}')">💡 Répondre</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addInsightFromQuestion(section, question) {
    const response = prompt(`${question}\n\nVotre réponse :`);
    if (response && response.trim()) {
        // Ajouter la réponse aux données appropriées
        const dataKey = getDataKeyFromSection(section);
        if (!formManager.data[dataKey].includes(response.trim())) {
            formManager.data[dataKey].push(response.trim());
            formManager.saveData();
            
            // Mettre à jour l'affichage des tags
            const containerId = getContainerIdFromSection(section);
            formManager.renderTags(containerId, dataKey);
            
            showNotification('Réponse ajoutée !', 'success');
        }
        
        closeGuidedQuestions();
    }
}

function getSectionTitle(section) {
    const titles = {
        passions: 'Ce que vous aimez',
        talents: 'Ce en quoi vous excellez',
        problems: 'Ce dont le monde a besoin',
        skills: 'Ce pour quoi vous pouvez être payé'
    };
    return titles[section] || section;
}

function getDataKeyFromSection(section) {
    const mapping = {
        passions: 'passions',
        talents: 'talents',
        problems: 'problems',
        skills: 'skills'
    };
    return mapping[section];
}

function getContainerIdFromSection(section) {
    const mapping = {
        passions: 'passionTags',
        talents: 'talentTags',
        problems: 'problemTags',
        skills: 'skillTags'
    };
    return mapping[section];
}

// Fonctions globales pour compatibilité
function addTag(event, containerId, dataKey) {
    formManager.addTag(event, containerId, dataKey);
}

function changeSection(direction) {
    formManager.changeSection(direction);
}

function analyzeIkigai() {
    formManager.analyzeIkigai();
}

function fillExampleData() {
    formManager.fillExampleData();
}

function saveProgress() {
    formManager.saveProgress();
}

function loadProgress() {
    formManager.loadProgress();
}

// Initialiser le gestionnaire de formulaire
let formManager;
document.addEventListener('DOMContentLoaded', () => {
    formManager = new IkigaiFormulaire();
});

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('guidedQuestionsModal');
    if (event.target === modal) {
        closeGuidedQuestions();
    }
}