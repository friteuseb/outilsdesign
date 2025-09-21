// Gestionnaire du Coach IA
class CoachManager {
    constructor() {
        this.isSessionActive = false;
        this.aiCoach = null;
        this.conversationHistory = [];
        this.config = {
            mode: 'discovery',
            depth: 'medium',
            style: 'friendly'
        };
        this.init();
    }

    init() {
        this.loadConversationHistory();
        this.setupEventListeners();
        this.showInitialInterface();
    }

    setupEventListeners() {
        // Auto-resize textarea
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('input', this.autoResizeTextarea.bind(this));
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    showInitialInterface() {
        document.getElementById('coachConfig').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'none';
        document.getElementById('starterSuggestions').style.display = 'none';
    }

    startCoachSession() {
        // Récupérer la configuration
        this.config.mode = document.getElementById('coachMode').value;
        this.config.depth = document.getElementById('depthLevel').value;
        this.config.style = document.getElementById('communicationStyle').value;

        // Initialiser le coach IA
        this.initializeAICoach();

        // Afficher l'interface de chat
        document.getElementById('coachConfig').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        document.getElementById('starterSuggestions').style.display = 'block';

        this.isSessionActive = true;
        
        // Message de bienvenue
        this.addMessage('coach', this.getWelcomeMessage());
        this.updateQuickActions();

        showNotification('Session démarrée ! Le coach IA est prêt à vous accompagner.', 'success');
    }

    initializeAICoach() {
        if (window.AICoach) {
            this.aiCoach = new AICoach();
            this.aiCoach.setPersonality(this.config.style);
            this.aiCoach.setMode(this.config.mode);
        } else {
            console.log('Mode démo : Utilisation des réponses prédéfinies');
        }
    }

    getWelcomeMessage() {
        const welcomeMessages = {
            discovery: "Bonjour ! Je suis votre coach IA personnel pour découvrir votre Ikigai. Ensemble, nous allons explorer vos passions, talents, et ce qui donne du sens à votre vie. Par quoi souhaitez-vous commencer ?",
            analysis: "Parfait ! Je suis là pour analyser vos réponses et vous donner des insights personnalisés sur votre parcours vers votre Ikigai. Partagez-moi ce qui vous préoccupe ou ce que vous aimeriez comprendre sur vous-même.",
            guidance: "Excellent ! Je suis votre guide pratique pour transformer vos découvertes en actions concrètes. Dites-moi où vous en êtes dans votre réflexion et quels sont vos objectifs.",
            motivation: "Fantastique ! Je suis là pour vous encourager et vous motiver dans votre quête de sens. Racontez-moi vos rêves, vos défis, et ce qui vous anime vraiment !"
        };
        return welcomeMessages[this.config.mode] || welcomeMessages.discovery;
    }

    async sendMessage(messageText = null) {
        const input = document.getElementById('chatInput');
        const message = messageText || input.value.trim();
        
        if (!message) return;

        // Ajouter le message de l'utilisateur
        this.addMessage('user', message);
        if (!messageText) input.value = '';

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            // Obtenir la réponse du coach IA
            const response = await this.getAIResponse(message);
            
            // Masquer l'indicateur de frappe
            this.hideTypingIndicator();
            
            // Ajouter la réponse du coach
            this.addMessage('coach', response);
            
            // Mettre à jour les actions rapides
            this.updateQuickActions();
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('error', 'Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre message ?');
            console.error('Erreur coach IA:', error);
        }

        // Sauvegarder la conversation
        this.saveConversationHistory();
    }

    async getAIResponse(message) {
        // Si le coach IA est disponible, l'utiliser
        if (this.aiCoach && this.aiCoach.chat) {
            try {
                const response = await this.aiCoach.chat(message, this.getContextForAI());
                return response;
            } catch (error) {
                console.log('Fallback vers mode démo:', error.message);
            }
        }

        // Mode démo avec réponses intelligentes
        return this.getDemoResponse(message);
    }

    getDemoResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Réponses contextuelles selon le mode
        if (this.config.mode === 'discovery') {
            if (lowerMessage.includes('passion') || lowerMessage.includes('aime')) {
                return "C'est formidable que vous vouliez explorer vos passions ! Parlons de ce qui vous fait vibrer. Quand vous perdez la notion du temps, que faites-vous généralement ? Et qu'est-ce qui vous donne de l'énergie plutôt que de vous en enlever ?";
            }
            if (lowerMessage.includes('talent') || lowerMessage.includes('excel')) {
                return "Excellente question sur vos talents ! Souvent, nos plus grands talents nous semblent évidents. Que vous demande-t-on souvent de faire ? Quels compliments recevez-vous régulièrement ? Et dans quoi êtes-vous naturellement bon sans effort ?";
            }
            if (lowerMessage.includes('monde') || lowerMessage.includes('besoin')) {
                return "Magnifique ! Réfléchir à l'impact sur le monde est essentiel. Quels problèmes vous préoccupent vraiment ? Quand vous regardez autour de vous, qu'aimeriez-vous améliorer ou changer ? Quel legacy voulez-vous laisser ?";
            }
            if (lowerMessage.includes('argent') || lowerMessage.includes('payé') || lowerMessage.includes('métier')) {
                return "Très pragmatique ! L'aspect économique est important. Quelles sont vos compétences que les gens valorisent ? Pour quoi seriez-vous prêt à payer quelqu'un ? Et quels besoins du marché pourriez-vous satisfaire avec vos talents ?";
            }
        }

        // Réponses motivantes par défaut
        const defaultResponses = [
            "C'est une réflexion très intéressante ! Pouvez-vous me donner un exemple concret pour que je puisse mieux vous accompagner ?",
            "Je sens que vous touchez à quelque chose d'important. Qu'est-ce qui vous fait dire cela ?",
            "Excellente prise de conscience ! Comment cette découverte pourrait-elle changer votre quotidien ?",
            "Fascinant ! Et qu'est-ce que cela révèle sur vos valeurs profondes ?",
            "C'est exactement le genre d'insight qui peut transformer une vie ! Que ressentez-vous en réalisant cela ?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    getContextForAI() {
        // Récupérer le contexte depuis les données utilisateur
        const userData = dataManager.loadData();
        return {
            userProfile: userData,
            conversationHistory: this.conversationHistory.slice(-10), // Derniers 10 messages
            mode: this.config.mode,
            style: this.config.style,
            depth: this.config.depth
        };
    }

    addMessage(type, content, actions = null) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const time = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let messageHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${time}</div>
        `;

        if (actions) {
            messageHTML += `
                <div class="message-actions">
                    ${actions.map(action => `
                        <button class="action-btn" onclick="${action.handler}">${action.label}</button>
                    `).join('')}
                </div>
            `;
        }

        messageDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Sauvegarder dans l'historique
        this.conversationHistory.push({
            type,
            content,
            timestamp: new Date().toISOString()
        });
    }

    showTypingIndicator() {
        document.getElementById('typingIndicator').style.display = 'block';
        document.getElementById('sendButton').disabled = true;
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').style.display = 'none';
        document.getElementById('sendButton').disabled = false;
    }

    updateQuickActions() {
        const container = document.getElementById('quickActions');
        const actions = this.getContextualQuickActions();
        
        container.innerHTML = actions.map(action => `
            <button class="quick-action-btn" onclick="${action.handler}">${action.label}</button>
        `).join('');
    }

    getContextualQuickActions() {
        // Actions contextuelles selon le mode et la progression
        const baseActions = [
            { label: "💡 J'ai une idée", handler: "coachManager.sendSuggestedMessage('J\\'ai une idée intéressante à partager')" },
            { label: "❓ J'ai une question", handler: "coachManager.sendSuggestedMessage('J\\'ai une question importante')" },
            { label: "🤔 Je réfléchis", handler: "coachManager.sendSuggestedMessage('J\\'ai besoin de temps pour réfléchir')" }
        ];

        if (this.config.mode === 'discovery') {
            baseActions.unshift(
                { label: "🔍 Explore mes passions", handler: "coachManager.sendSuggestedMessage('Aide-moi à explorer mes passions')" },
                { label: "🎯 Identifie mes talents", handler: "coachManager.sendSuggestedMessage('Comment identifier mes vrais talents ?')" }
            );
        }

        return baseActions;
    }

    sendSuggestedMessage(message) {
        this.sendMessage(message);
    }

    autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }

    toggleCoachConfig() {
        const config = document.getElementById('coachConfig');
        const isVisible = config.style.display !== 'none';
        config.style.display = isVisible ? 'none' : 'block';
    }

    exportConversation() {
        const data = {
            timestamp: new Date().toISOString(),
            config: this.config,
            messages: this.conversationHistory
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-coach-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Conversation exportée !', 'success');
    }

    clearConversation() {
        if (confirm('Êtes-vous sûr de vouloir effacer cette conversation ?')) {
            document.getElementById('chatMessages').innerHTML = '';
            this.conversationHistory = [];
            this.saveConversationHistory();
            
            // Redémarrer avec un message de bienvenue
            this.addMessage('coach', this.getWelcomeMessage());
            this.updateQuickActions();
            
            showNotification('Conversation effacée', 'info');
        }
    }

    resetCoach() {
        if (confirm('Réinitialiser complètement le coach ?')) {
            this.conversationHistory = [];
            this.isSessionActive = false;
            localStorage.removeItem('coachConversationHistory');
            this.showInitialInterface();
            showNotification('Coach réinitialisé', 'info');
        }
    }

    saveConversationHistory() {
        localStorage.setItem('coachConversationHistory', JSON.stringify({
            history: this.conversationHistory,
            config: this.config,
            lastUpdate: new Date().toISOString()
        }));
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('coachConversationHistory');
        if (saved) {
            const data = JSON.parse(saved);
            this.conversationHistory = data.history || [];
            this.config = { ...this.config, ...data.config };
        }
    }
}

// Fonctions globales
function startCoachSession() {
    coachManager.startCoachSession();
}

function sendMessage() {
    coachManager.sendMessage();
}

function sendSuggestedMessage(message) {
    coachManager.sendMessage(message);
}

function toggleCoachConfig() {
    coachManager.toggleCoachConfig();
}

function exportConversation() {
    coachManager.exportConversation();
}

function clearConversation() {
    coachManager.clearConversation();
}

function resetCoach() {
    coachManager.resetCoach();
}

// Initialisation
let coachManager;
document.addEventListener('DOMContentLoaded', () => {
    coachManager = new CoachManager();
});