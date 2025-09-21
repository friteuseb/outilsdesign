// Démonstration des appels API IA pour Ikigai Builder
// Utilise des réponses mockées intelligentes quand les vraies API ne sont pas disponibles

class DemoAPI {
    constructor() {
        this.responses = {
            socratic: [
                "Qu'est-ce qui vous fait perdre la notion du temps lorsque vous en parlez ?",
                "Si vous pouviez éliminer une injustice dans le monde, laquelle choisiriez-vous ?",
                "Quel talent naturel les autres vous envient-ils le plus ?",
                "Si l'argent n'était pas un problème, comment contribueriez-vous au monde ?",
                "Quelle activité vous procure une satisfaction profonde et durable ?"
            ],
            emotional: {
                frustrated: "Je sens une frustration dans vos mots. Pouvez-vous me décrire précisément ce qui vous bloque dans cette exploration ?",
                enthusiastic: "Votre enthousiasme est communicatif ! Pouvez-vous me dire ce qui vous passionne le plus dans cette découverte ?",
                confused: "Il semble y avoir une confusion. Quelle partie de votre réflexion vous semble la plus floue ?",
                neutral: "C'est une réflexion intéressante. Pouvez-vous développer cette idée ?"
            },
            patterns: {
                impostor: {
                    detected: true,
                    message: "Je détecte des signes de syndrome de l'imposteur dans vos réponses.",
                    advice: "Rappelez-vous : vos accomplissements passés sont la preuve de vos capacités."
                },
                perfectionist: {
                    detected: true,
                    message: "Votre langage suggère une tendance perfectionniste.",
                    advice: "Essayez l'approche 'bon assez' plutôt que la perfection absolue."
                }
            },
            predictions: {
                high: "Vos réponses indiquent un fort potentiel d'alignement Ikigai (85% de probabilité).",
                medium: "Il y a un bon potentiel, mais certains éléments nécessitent plus de clarification (65%).",
                low: "Votre profil suggère qu'il faut explorer plus profondément certains aspects (35%)."
            }
        };
    }

    // Simulation d'appel API OpenAI
    async callOpenAI(prompt, userMessage) {
        // Simulation de latence réseau
        await this.delay(1000 + Math.random() * 2000);

        const emotionalState = this.detectEmotion(userMessage);
        const response = this.responses.emotional[emotionalState] ||
                        this.responses.socratic[Math.floor(Math.random() * this.responses.socratic.length)];

        return {
            choices: [{
                message: {
                    content: response
                }
            }],
            usage: {
                prompt_tokens: prompt.length / 4,
                completion_tokens: response.length / 4,
                total_tokens: (prompt.length + response.length) / 4
            }
        };
    }

    // Simulation d'appel API Anthropic pour analyse comportementale
    async callAnthropic(text) {
        await this.delay(1500 + Math.random() * 1000);

        const patterns = [];
        const predictions = [];

        // Analyse simple du texte
        if (text.toLowerCase().includes('pas assez') || text.toLowerCase().includes('insuffisant')) {
            patterns.push(this.responses.patterns.impostor);
        }

        if (text.toLowerCase().includes('parfait') || text.toLowerCase().includes('idéal')) {
            patterns.push(this.responses.patterns.perfectionist);
        }

        // Prédiction basée sur la complétude des données
        const completeness = this.calculateCompleteness(text);
        if (completeness > 0.7) {
            predictions.push(this.responses.predictions.high);
        } else if (completeness > 0.4) {
            predictions.push(this.responses.predictions.medium);
        } else {
            predictions.push(this.responses.predictions.low);
        }

        return {
            patterns: patterns,
            predictions: predictions,
            sentiment: this.analyzeSentiment(text),
            confidence: Math.random() * 0.3 + 0.7 // 70-100% de confiance
        };
    }

    // Analyse émotionnelle basique
    detectEmotion(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('frustré') || lowerMessage.includes('énervé') || lowerMessage.includes('difficile')) {
            return 'frustrated';
        }
        if (lowerMessage.includes('passionné') || lowerMessage.includes('enthousiaste') || lowerMessage.includes('excité')) {
            return 'enthusiastic';
        }
        if (lowerMessage.includes('confus') || lowerMessage.includes('perdu') || lowerMessage.includes('comprends pas')) {
            return 'confused';
        }

        return 'neutral';
    }

    // Analyse de sentiment basique
    analyzeSentiment(text) {
        const positiveWords = ['passion', 'amour', 'enthousiaste', 'heureux', 'satisfait', 'motivé'];
        const negativeWords = ['frustré', 'difficile', 'problème', 'stress', 'fatigué', 'découragé'];

        const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length;

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    // Calcul de complétude des données
    calculateCompleteness(text) {
        const indicators = ['passion', 'talent', 'problème', 'compétence', 'aime', 'bon', 'difficile'];
        const foundIndicators = indicators.filter(indicator => text.toLowerCase().includes(indicator));
        return foundIndicators.length / indicators.length;
    }

    // Simulation de délai réseau
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Génération de réponses de fallback
    generateFallbackResponse(userMessage) {
        const fallbacks = [
            "Pouvez-vous développer cette idée qui semble importante pour vous ?",
            "Qu'est-ce qui vous motive le plus dans cette direction ?",
            "Comment cette découverte influence-t-elle votre vision de l'avenir ?",
            "Quels obstacles voyez-vous sur ce chemin ?",
            "Quelle serait la prochaine étape logique selon vous ?"
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// Instance globale pour la démonstration
const demoAPI = new DemoAPI();

// Export pour utilisation dans le coach IA
window.DemoAPI = DemoAPI;
window.demoAPI = demoAPI;