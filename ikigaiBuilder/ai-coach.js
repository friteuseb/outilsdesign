// IA Coach pour Ikigai - Module de gestion des API IA
class AICoach {
    constructor() {
        this.apiKey = this.getApiKey();
        this.conversationHistory = [];
        this.userProfile = {};
        this.emotionalState = 'neutral';
        this.sessionId = this.generateSessionId();
        this.industryKnowledge = this.loadIndustryKnowledge();
    }

    getApiKey() {
        // En production, charger depuis .env
        // Pour le développement, utiliser une clé de test ou demander à l'utilisateur
        return (typeof CONFIG !== 'undefined' && CONFIG.API?.OPENAI_KEY) || 'demo-key';
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadIndustryKnowledge() {
        return {
            tech: {
                trends: ['IA générative', 'Web3', 'Cybersécurité', 'Cloud computing'],
                emergingJobs: ['Prompt Engineer', 'AI Ethics Consultant', 'Metaverse Developer'],
                salaryRanges: { entry: 35000, mid: 60000, senior: 100000 }
            },
            creative: {
                trends: ['NFT', 'Content Creation', 'Digital Art', 'Streaming'],
                emergingJobs: ['Content Strategist', 'Digital Artist', 'Social Media Architect'],
                salaryRanges: { entry: 25000, mid: 45000, senior: 80000 }
            },
            health: {
                trends: ['Télémédecine', 'IA médicale', 'Bien-être mental', 'Prévention'],
                emergingJobs: ['Digital Health Coach', 'AI Health Analyst', 'Wellness Tech Consultant'],
                salaryRanges: { entry: 30000, mid: 55000, senior: 90000 }
            },
            education: {
                trends: ['E-learning', 'IA pédagogique', 'Formation continue', 'Gamification'],
                emergingJobs: ['Learning Experience Designer', 'EdTech Entrepreneur', 'Skills Development Coach'],
                salaryRanges: { entry: 28000, mid: 50000, senior: 85000 }
            },
            environment: {
                trends: ['Énergies renouvelables', 'Économie circulaire', 'Biodiversité', 'Climat'],
                emergingJobs: ['Sustainability Consultant', 'Green Tech Innovator', 'Climate Action Coordinator'],
                salaryRanges: { entry: 32000, mid: 58000, senior: 95000 }
            }
        };
    }

    async startConversation(userData) {
        this.userProfile = userData;
        this.conversationHistory = [];

        const systemPrompt = `Tu es un coach Ikigai expert utilisant la méthode socratique.
        - Pose des questions puissantes plutôt que de donner des réponses
        - Adapte-toi à l'état émotionnel de l'utilisateur
        - Utilise ta connaissance des secteurs et tendances métier
        - Souviens-toi du contexte de la conversation
        - Détecte les blocages et biais cognitifs
        - Guide vers la découverte personnelle

        Profil utilisateur actuel :
        - Passions: ${userData.passions?.join(', ') || 'Non définies'}
        - Talents: ${userData.talents?.join(', ') || 'Non définis'}
        - Problèmes: ${userData.problems?.join(', ') || 'Non définis'}
        - Compétences: ${userData.skills?.join(', ') || 'Non définies'}

        Commence par une question socratique puissante.`;

        const firstMessage = await this.callAI(systemPrompt, "Bonjour, je suis prêt à explorer mon Ikigai avec toi.");
        return firstMessage;
    }

    async sendMessage(userMessage) {
        // Analyser l'état émotionnel
        this.emotionalState = this.analyzeEmotionalState(userMessage);

        // Ajouter au contexte
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
            emotionalState: this.emotionalState
        });

        // Construire le prompt avec contexte
        const contextPrompt = this.buildContextPrompt(userMessage);

        // Appeler l'IA
        const aiResponse = await this.callAI(contextPrompt, userMessage);

        // Stocker la réponse
        this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            emotionalState: this.emotionalState
        });

        return aiResponse;
    }

    analyzeEmotionalState(message) {
        const lowerMessage = message.toLowerCase();

        // Patterns émotionnels
        const frustrationPatterns = ['frustré', 'bloqué', 'difficile', 'énervé', 'découragé'];
        const enthusiasmPatterns = ['enthousiaste', 'passionné', 'excité', 'motivé', 'inspiré'];
        const confusionPatterns = ['confus', 'perdu', 'comprends pas', 'hésite', 'doute'];

        if (frustrationPatterns.some(pattern => lowerMessage.includes(pattern))) {
            return 'frustrated';
        }
        if (enthusiasmPatterns.some(pattern => lowerMessage.includes(pattern))) {
            return 'enthusiastic';
        }
        if (confusionPatterns.some(pattern => lowerMessage.includes(pattern))) {
            return 'confused';
        }

        return 'neutral';
    }

    buildContextPrompt(userMessage) {
        const recentHistory = this.conversationHistory.slice(-5); // Derniers 5 échanges

        let context = `Tu es un coach Ikigai expert. État émotionnel détecté : ${this.emotionalState}

Profil utilisateur :
- Passions: ${this.userProfile.passions?.join(', ') || 'Non définies'}
- Talents: ${this.userProfile.talents?.join(', ') || 'Non définis'}
- Problèmes: ${this.userProfile.problems?.join(', ') || 'Non définis'}
- Compétences: ${this.userProfile.skills?.join(', ') || 'Non définies'}

Historique récent de la conversation :
${recentHistory.map(msg => `${msg.role}: ${msg.content.substring(0, 100)}...`).join('\n')}

Instructions :
- Utilise la méthode socratique : pose des questions plutôt que de donner des réponses
- Adapte-toi à l'état émotionnel : ${this.emotionalState === 'frustrated' ? 'Sois encourageant et propose des questions simples' : this.emotionalState === 'enthusiastic' ? 'Approfondis et challenge positivement' : 'Guide avec des questions claires'}
- Intègre ta connaissance métier quand pertinent
- Détecte les biais cognitifs et patterns limitants
- Souviens-toi du contexte et fais des liens

Message utilisateur : "${userMessage}"`;

        return context;
    }

    async callAI(systemPrompt, userMessage) {
        // Simulation d'appel API (remplacer par vrai appel en production)
        if (this.apiKey === 'demo-key') {
            return this.generateDemoResponse(userMessage);
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Erreur API IA:', error);
            return this.generateDemoResponse(userMessage);
        }
    }

    generateDemoResponse(userMessage) {
        // Réponses de démonstration intelligentes
        const responses = {
            default: "C'est une excellente réflexion ! Pouvez-vous me dire ce qui vous a amené à penser cela ?",
            passion: "Cette passion semble importante pour vous. Qu'est-ce qui vous anime le plus dans cette activité ?",
            talent: "Ce talent que vous mentionnez, comment l'avez-vous découvert ?",
            problem: "Ce problème vous touche profondément. Qu'est-ce qui vous motive à vouloir le résoudre ?",
            skill: "Cette compétence, comment l'avez-vous développée ? Qu'est-ce qui vous passionne dans son utilisation ?",
            frustrated: "Je sens une frustration. Pouvez-vous me décrire précisément ce qui vous bloque ?",
            confused: "Il semble y avoir une confusion. Quelle partie vous semble la plus floue ?"
        };

        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('passion') || lowerMessage.includes('aime')) {
            return responses.passion;
        }
        if (lowerMessage.includes('talent') || lowerMessage.includes('bon')) {
            return responses.talent;
        }
        if (lowerMessage.includes('problème') || lowerMessage.includes('monde')) {
            return responses.problem;
        }
        if (lowerMessage.includes('compétence') || lowerMessage.includes('sais')) {
            return responses.skill;
        }
        if (lowerMessage.includes('frustré') || lowerMessage.includes('bloqué')) {
            return responses.frustrated;
        }
        if (lowerMessage.includes('confus') || lowerMessage.includes('perdu')) {
            return responses.confused;
        }

        return responses.default;
    }

    async analyzeBehavioralPatterns() {
        const analysis = {
            patterns: [],
            biases: [],
            predictions: [],
            recommendations: []
        };

        // Analyser les patterns dans l'historique
        const allMessages = this.conversationHistory.filter(msg => msg.role === 'user').map(msg => msg.content);

        // Pattern recognition
        if (allMessages.some(msg => msg.toLowerCase().includes('pas assez') || msg.toLowerCase().includes('insuffisant'))) {
            analysis.patterns.push({
                type: 'impostor_syndrome',
                description: 'Pattern de syndrome de l\'imposteur détecté',
                confidence: 0.8
            });
        }

        if (allMessages.some(msg => msg.toLowerCase().includes('parfait') || msg.toLowerCase().includes('idéal'))) {
            analysis.patterns.push({
                type: 'perfectionism',
                description: 'Tendance au perfectionnisme identifiée',
                confidence: 0.7
            });
        }

        // Prédictions de succès
        const passionCount = this.userProfile.passions?.length || 0;
        const talentCount = this.userProfile.talents?.length || 0;
        const skillCount = this.userProfile.skills?.length || 0;

        let successProbability = 0.3; // Base
        successProbability += passionCount * 0.1;
        successProbability += talentCount * 0.15;
        successProbability += skillCount * 0.1;

        analysis.predictions.push({
            type: 'career_success',
            probability: Math.min(successProbability, 0.95),
            factors: [`${passionCount} passions identifiées`, `${talentCount} talents reconnus`, `${skillCount} compétences validées`]
        });

        return analysis;
    }

    async getIndustryInsights(sector) {
        const sectorData = this.industryKnowledge[sector];
        if (!sectorData) {
            return {
                trends: ['Secteur en évolution'],
                jobs: ['Postes traditionnels et émergents'],
                salary: 'À déterminer selon l\'expérience'
            };
        }

        return {
            trends: sectorData.trends,
            emergingJobs: sectorData.emergingJobs,
            salaryRanges: sectorData.salaryRanges,
            marketValidation: `Secteur ${sector} en forte croissance avec ${sectorData.emergingJobs.length} nouveaux métiers identifiés`
        };
    }

    async findSimilarSuccessStories(userProfile) {
        // Simulation de recherche dans une base de success stories
        const stories = [
            {
                name: "Marie Dubois",
                profile: "Passionnée de pédagogie, talent relationnel, problème éducation",
                career: "Créatrice de plateforme d'e-learning",
                success: "200k€ de CA en 3 ans",
                match: 0.85
            },
            {
                name: "Jean Martin",
                profile: "Passion tech, talent analytique, problème environnement",
                career: "Consultant green tech",
                success: "Leader dans son domaine",
                match: 0.78
            },
            {
                name: "Sophie Leroy",
                profile: "Passion création, talent artistique, problème communication",
                career: "Directrice artistique digitale",
                success: "Récompenses internationales",
                match: 0.82
            }
        ];

        // Calculer le matching basé sur le profil
        return stories.filter(story => story.match > 0.7).slice(0, 3);
    }

    getConversationSummary() {
        const totalMessages = this.conversationHistory.length;
        const userMessages = this.conversationHistory.filter(msg => msg.role === 'user').length;
        const avgEmotionalState = this.emotionalState;

        return {
            sessionId: this.sessionId,
            totalMessages,
            userMessages,
            avgEmotionalState,
            keyTopics: this.extractKeyTopics(),
            progressIndicators: this.calculateProgress()
        };
    }

    extractKeyTopics() {
        const topics = [];
        const allText = this.conversationHistory.map(msg => msg.content).join(' ').toLowerCase();

        if (allText.includes('passion') || allText.includes('aime')) topics.push('Passions');
        if (allText.includes('talent') || allText.includes('bon')) topics.push('Talents');
        if (allText.includes('problème') || allText.includes('monde')) topics.push('Problèmes');
        if (allText.includes('compétence') || allText.includes('sais')) topics.push('Compétences');

        return topics;
    }

    calculateProgress() {
        const topics = this.extractKeyTopics();
        const progress = (topics.length / 4) * 100;

        return {
            percentage: progress,
            completedTopics: topics,
            nextSteps: this.suggestNextSteps(topics)
        };
    }

    suggestNextSteps(completedTopics) {
        const allTopics = ['Passions', 'Talents', 'Problèmes', 'Compétences'];
        const remainingTopics = allTopics.filter(topic => !completedTopics.includes(topic));

        if (remainingTopics.length > 0) {
            return [`Explorer ${remainingTopics[0]} plus en profondeur`];
        }

        return ['Analyser la cohérence entre vos découvertes', 'Explorer des pistes professionnelles concrètes'];
    }
}

// Instance globale du coach IA
const aiCoach = new AICoach();

// Intégration avec les API de démonstration
if (typeof demoAPI !== 'undefined') {
    AICoach.prototype.callAI = async function(systemPrompt, userMessage) {
        try {
            // Essayer d'abord les vraies API
            if (this.apiKey && this.apiKey !== 'demo-key') {
                return await this.callRealAI(systemPrompt, userMessage);
            } else {
                // Fallback vers les API de démonstration
                const demoResponse = await demoAPI.callOpenAI(systemPrompt, userMessage);
                return demoResponse.choices[0].message.content;
            }
        } catch (error) {
            console.warn('Erreur API, utilisation du mode démo:', error);
            return demoAPI.generateFallbackResponse(userMessage);
        }
    };

    AICoach.prototype.callRealAI = async function(systemPrompt, userMessage) {
        // Logique originale des vraies API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    };
}

// Export pour utilisation dans le HTML principal
window.AICoach = AICoach;
window.aiCoach = aiCoach;