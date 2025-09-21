// Gestionnaire de la page d'analyse
class AnalyseManager {
    constructor() {
        this.userData = {};
        this.analysisResults = {};
        this.init();
    }

    init() {
        this.loadUserData();
        if (this.hasData()) {
            this.generateAnalysis();
            this.showAnalysisContent();
        } else {
            this.showNoDataMessage();
        }
    }

    loadUserData() {
        this.userData = dataManager.loadData();
    }

    hasData() {
        return this.userData.passions?.length > 0 || 
               this.userData.talents?.length > 0 || 
               this.userData.problems?.length > 0 || 
               this.userData.skills?.length > 0;
    }

    showNoDataMessage() {
        document.getElementById('noDataMessage').style.display = 'block';
        document.getElementById('analyseContent').style.display = 'none';
    }

    showAnalysisContent() {
        document.getElementById('noDataMessage').style.display = 'none';
        document.getElementById('analyseContent').style.display = 'block';
    }

    generateAnalysis() {
        // Calculer les forces de chaque dimension
        const dimensionStrengths = this.calculateDimensionStrengths();
        
        // Générer la déclaration Ikigai
        const ikigaiStatement = this.generateIkigaiStatement();
        
        // Calculer les intersections
        const intersections = this.calculateIntersections();
        
        // Identifier forces et défis
        const strengthsAndChallenges = this.identifyStrengthsAndChallenges();
        
        // Générer actions recommandées
        const recommendedActions = this.generateRecommendedActions();

        // Mettre à jour l'interface
        this.updateVisualization(dimensionStrengths);
        this.updateIkigaiStatement(ikigaiStatement);
        this.updateDimensionBars(dimensionStrengths);
        this.updateStrengthsChallenges(strengthsAndChallenges);
        this.updateIntersections(intersections);
        this.updateRecommendedActions(recommendedActions);

        this.analysisResults = {
            dimensionStrengths,
            ikigaiStatement,
            intersections,
            strengthsAndChallenges,
            recommendedActions
        };
    }

    calculateDimensionStrengths() {
        return {
            passion: this.calculateScore(this.userData.passions || [], this.userData.passionDescription),
            mission: this.calculateScore(this.userData.talents || [], this.userData.talentFeedback),
            profession: this.calculateScore(this.userData.problems || [], this.userData.worldContribution),
            vocation: this.calculateScore(this.userData.skills || [], this.userData.economicOpportunities)
        };
    }

    calculateScore(items, description) {
        let score = (items.length * 15); // Base score from items
        if (description && description.trim()) {
            score += Math.min(description.length / 10, 40); // Bonus for description
        }
        return Math.min(score, 100);
    }

    generateIkigaiStatement() {
        const statements = [
            `Votre Ikigai semble se situer à l'intersection de votre passion pour ${this.getTopItems(this.userData.passions, 2).join(' et ')}, vos talents en ${this.getTopItems(this.userData.talents, 2).join(' et ')}, votre désir d'aider avec ${this.getTopItems(this.userData.problems, 1)[0]}, et vos compétences en ${this.getTopItems(this.userData.skills, 2).join(' et ')}.`,
            
            `Vous semblez être animé par ${this.getTopItems(this.userData.passions, 1)[0]}, excellez naturellement en ${this.getTopItems(this.userData.talents, 1)[0]}, et pouvez créer de la valeur en résolvant ${this.getTopItems(this.userData.problems, 1)[0]} grâce à vos compétences en ${this.getTopItems(this.userData.skills, 1)[0]}.`,
            
            `Votre raison d'être pourrait être de combiner votre amour pour ${this.getTopItems(this.userData.passions, 1)[0]} avec votre talent pour ${this.getTopItems(this.userData.talents, 1)[0]}, en servant le monde dans le domaine de ${this.getTopItems(this.userData.problems, 1)[0]}.`
        ];

        return statements[Math.floor(Math.random() * statements.length)];
    }

    getTopItems(items, count) {
        if (!items || items.length === 0) return ['vos intérêts'];
        return items.slice(0, count);
    }

    calculateIntersections() {
        const strengths = this.analysisResults?.dimensionStrengths || this.calculateDimensionStrengths();
        
        return {
            satisfaction: (strengths.passion + strengths.mission) / 2,
            profession: (strengths.mission + strengths.vocation) / 2,
            career: (strengths.vocation + strengths.profession) / 2,
            mission: (strengths.profession + strengths.passion) / 2
        };
    }

    identifyStrengthsAndChallenges() {
        const strengths = this.analysisResults?.dimensionStrengths || this.calculateDimensionStrengths();
        const result = { strengths: [], challenges: [] };

        // Identifier les forces (scores > 70)
        Object.entries(strengths).forEach(([key, value]) => {
            if (value > 70) {
                result.strengths.push({
                    title: this.getDimensionTitle(key),
                    description: `Vous avez une base solide dans cette dimension avec un score de ${Math.round(value)}%.`
                });
            } else if (value < 50) {
                result.challenges.push({
                    title: this.getDimensionTitle(key),
                    description: `Cette dimension pourrait être développée davantage (score: ${Math.round(value)}%).`
                });
            }
        });

        // Ajouter des défis génériques si aucun identifié
        if (result.challenges.length === 0) {
            result.challenges.push({
                title: "Équilibrage",
                description: "Continuez à équilibrer toutes vos dimensions pour un Ikigai optimal."
            });
        }

        return result;
    }

    getDimensionTitle(key) {
        const titles = {
            passion: "Passion",
            mission: "Mission",
            profession: "Profession", 
            vocation: "Vocation"
        };
        return titles[key] || key;
    }

    generateRecommendedActions() {
        const strengths = this.analysisResults?.dimensionStrengths || this.calculateDimensionStrengths();
        const actions = [];

        // Actions basées sur les scores
        const sortedDimensions = Object.entries(strengths)
            .sort(([,a], [,b]) => a - b);

        // Améliorer la dimension la plus faible
        const weakest = sortedDimensions[0];
        actions.push({
            icon: "🎯",
            title: `Renforcer votre ${this.getDimensionTitle(weakest[0])}`,
            description: `Cette dimension a le score le plus bas (${Math.round(weakest[1])}%). Concentrez-vous sur son développement.`,
            priority: "high"
        });

        // Exploiter la dimension la plus forte
        const strongest = sortedDimensions[sortedDimensions.length - 1];
        actions.push({
            icon: "🚀",
            title: `Capitaliser sur votre ${this.getDimensionTitle(strongest[0])}`,
            description: `Votre point fort (${Math.round(strongest[1])}%). Cherchez des opportunités qui exploitent cette force.`,
            priority: "medium"
        });

        // Action générique
        actions.push({
            icon: "🔄",
            title: "Intégrer vos dimensions",
            description: "Cherchez des opportunités qui combinent plusieurs de vos dimensions fortes.",
            priority: "low"
        });

        return actions;
    }

    updateVisualization(strengths) {
        // Mettre à jour l'opacité des cercles selon leur force
        Object.entries(strengths).forEach(([key, value]) => {
            const circle = document.getElementById(`${key}Circle`);
            if (circle) {
                const opacity = 0.6 + (value / 100) * 0.4; // Entre 0.6 et 1.0
                circle.style.opacity = opacity;
            }
        });
    }

    updateIkigaiStatement(statement) {
        const element = document.getElementById('ikigaiStatement');
        if (element) {
            element.textContent = statement;
        }
    }

    updateDimensionBars(strengths) {
        const container = document.getElementById('dimensionBars');
        if (!container) return;

        const dimensions = [
            { key: 'passion', label: 'Passion', icon: '❤️' },
            { key: 'mission', label: 'Mission', icon: '🎯' },
            { key: 'profession', label: 'Profession', icon: '🌍' },
            { key: 'vocation', label: 'Vocation', icon: '💰' }
        ];

        container.innerHTML = dimensions.map(dim => `
            <div class="dimension-bar">
                <div class="bar-label">
                    <span>${dim.icon}</span>
                    ${dim.label}
                </div>
                <div class="bar-container">
                    <div class="bar-fill ${dim.key}" style="width: ${strengths[dim.key]}%">
                        <div class="bar-value">${Math.round(strengths[dim.key])}%</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStrengthsChallenges(data) {
        const container = document.getElementById('strengthsChallenges');
        if (!container) return;

        container.innerHTML = `
            ${data.strengths.map(item => `
                <div class="strength-item">
                    <div class="item-icon">💪</div>
                    <div class="item-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('')}
            
            ${data.challenges.map(item => `
                <div class="challenge-item">
                    <div class="item-icon">🎯</div>
                    <div class="item-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('')}
        `;
    }

    updateIntersections(intersections) {
        Object.entries(intersections).forEach(([key, value]) => {
            const strengthElement = document.getElementById(`${key}Strength`);
            if (strengthElement) {
                strengthElement.innerHTML = `
                    <div class="strength-indicator">
                        <div class="strength-fill" style="width: ${value}%"></div>
                    </div>
                    <div class="strength-text">${Math.round(value)}%</div>
                `;
            }
        });
    }

    updateRecommendedActions(actions) {
        const container = document.getElementById('actionsList');
        if (!container) return;

        container.innerHTML = actions.map(action => `
            <div class="action-item">
                <div class="action-icon">${action.icon}</div>
                <div class="action-content">
                    <h4>${action.title}</h4>
                    <p>${action.description}</p>
                    <div class="action-priority priority-${action.priority}">
                        Priorité ${action.priority === 'high' ? 'haute' : action.priority === 'medium' ? 'moyenne' : 'basse'}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Fonctions globales
function refreshAnalysis() {
    analyseManager = new AnalyseManager();
    showNotification('Analyse actualisée !', 'success');
}

function showDetailedInsights() {
    const modal = document.getElementById('insightsModal');
    const content = document.getElementById('insightsContent');
    
    content.innerHTML = `
        <div class="insights-content">
            <h4>🧠 Analyse IA Approfondie</h4>
            <p><em>Fonctionnalité en développement - Sera disponible avec l'intégration IA complète.</em></p>
            
            <div class="insights-preview">
                <h5>Aperçu des fonctionnalités à venir :</h5>
                <ul>
                    <li>📊 Analyse sémantique de vos réponses</li>
                    <li>🎭 Détection de patterns comportementaux</li>
                    <li>🔮 Prédictions basées sur l'IA</li>
                    <li>💡 Recommandations hyper-personnalisées</li>
                </ul>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeInsightsModal() {
    document.getElementById('insightsModal').style.display = 'none';
}

function generatePDF() {
    showNotification('Génération du PDF en cours...', 'info');
    
    // Simuler la génération PDF
    setTimeout(() => {
        showNotification('PDF généré avec succès !', 'success');
    }, 2000);
}

// Fermer les modals en cliquant à l'extérieur
window.onclick = function(event) {
    const insightsModal = document.getElementById('insightsModal');
    if (event.target === insightsModal) {
        closeInsightsModal();
    }
}

// Initialiser le gestionnaire d'analyse
let analyseManager;
document.addEventListener('DOMContentLoaded', () => {
    analyseManager = new AnalyseManager();
});