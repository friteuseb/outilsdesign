// Configuration Ikigai Builder - Gestion des paramètres IA
const CONFIG = {
    // API Settings
    API: {
        OPENAI_KEY: null,
        ANTHROPIC_KEY: null,
        GOOGLE_AI_KEY: null,
        DEFAULT_MODEL: 'gpt-4-turbo-preview',
        TEMPERATURE: 0.7,
        MAX_TOKENS: 1000,
        TIMEOUT: 30000 // 30 secondes
    },

    // UI Settings
    UI: {
        THEME: 'light',
        LANGUAGE: 'fr',
        ANIMATIONS: true,
        SOUND_EFFECTS: false
    },

    // Coach Settings
    COACH: {
        MEMORY_SIZE: 10, // Nombre de messages à garder en mémoire
        EMOTIONAL_ADAPTATION: true,
        SOCRATIC_METHOD: true,
        INDUSTRY_EXPERTISE: true
    },

    // Analysis Settings
    ANALYSIS: {
        PATTERN_RECOGNITION: true,
        SENTIMENT_ANALYSIS: true,
        PREDICTION_ACCURACY: true,
        BIAS_DETECTION: true
    },

    // Career Database Settings
    CAREER: {
        MATCHING_THRESHOLD: 0.3,
        MAX_RESULTS: 10,
        INCLUDE_EMERGING_JOBS: true,
        REAL_TIME_UPDATES: false
    },

    // Privacy Settings
    PRIVACY: {
        LOCAL_STORAGE: true,
        ANALYTICS: false,
        ERROR_REPORTING: false,
        DATA_RETENTION: 'session' // 'session', 'local', 'none'
    }
};

// Validation de la configuration
function validateConfig() {
    const errors = [];

    // Vérifier les clés API
    if (!CONFIG.API.OPENAI_KEY && !CONFIG.API.ANTHROPIC_KEY && !CONFIG.API.GOOGLE_AI_KEY) {
        console.warn('⚠️ Aucune clé API configurée - Mode démo activé');
    }

    // Vérifier les paramètres critiques
    if (CONFIG.API.MAX_TOKENS < 100) {
        errors.push('MAX_TOKENS trop faible');
    }

    if (CONFIG.API.TEMPERATURE < 0 || CONFIG.API.TEMPERATURE > 2) {
        errors.push('TEMPERATURE hors limites (0-2)');
    }

    if (errors.length > 0) {
        console.error('❌ Erreurs de configuration:', errors);
        return false;
    }

    console.log('✅ Configuration validée');
    return true;
}

// Chargement de la configuration depuis localStorage
function loadUserConfig() {
    try {
        const savedConfig = localStorage.getItem('ikigaiConfig');
        if (savedConfig) {
            const userConfig = JSON.parse(savedConfig);
            // Fusionner avec la config par défaut
            Object.keys(userConfig).forEach(section => {
                if (CONFIG[section]) {
                    CONFIG[section] = { ...CONFIG[section], ...userConfig[section] };
                }
            });
            console.log('📁 Configuration utilisateur chargée');
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
    }
}

// Sauvegarde de la configuration
function saveUserConfig() {
    try {
        localStorage.setItem('ikigaiConfig', JSON.stringify(CONFIG));
        console.log('💾 Configuration sauvegardée');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
    }
}

// Réinitialisation de la configuration
function resetConfig() {
    localStorage.removeItem('ikigaiConfig');
    location.reload();
}

// Interface de configuration utilisateur
function openConfigPanel() {
    const modal = document.createElement('div');
    modal.id = 'configModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>⚙️ Configuration Ikigai Builder</h3>
                <button class="modal-close" onclick="closeConfigModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="config-tabs">
                    <button class="tab-btn active" onclick="switchConfigTab('api')">🔑 API</button>
                    <button class="tab-btn" onclick="switchConfigTab('ui')">🎨 Interface</button>
                    <button class="tab-btn" onclick="switchConfigTab('coach')">🤖 Coach</button>
                    <button class="tab-btn" onclick="switchConfigTab('privacy')">🔒 Vie privée</button>
                </div>
                <div id="configContent">
                    ${generateAPIConfig()}
                </div>
                <div class="config-actions">
                    <button class="btn" onclick="saveUserConfig()">💾 Sauvegarder</button>
                    <button class="btn btn-warning" onclick="resetConfig()">🔄 Réinitialiser</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function generateAPIConfig() {
    return `
        <div class="config-section">
            <h4>🔑 Configuration API IA</h4>
            <div class="config-group">
                <label>Clé OpenAI:</label>
                <input type="password" id="openaiKey" value="${CONFIG.API.OPENAI_KEY || ''}" placeholder="sk-...">
            </div>
            <div class="config-group">
                <label>Clé Anthropic:</label>
                <input type="password" id="anthropicKey" value="${CONFIG.API.ANTHROPIC_KEY || ''}" placeholder="sk-ant-...">
            </div>
            <div class="config-group">
                <label>Modèle par défaut:</label>
                <select id="defaultModel">
                    <option value="gpt-4-turbo-preview" ${CONFIG.API.DEFAULT_MODEL === 'gpt-4-turbo-preview' ? 'selected' : ''}>GPT-4 Turbo</option>
                    <option value="gpt-4" ${CONFIG.API.DEFAULT_MODEL === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
                    <option value="gpt-3.5-turbo" ${CONFIG.API.DEFAULT_MODEL === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
                </select>
            </div>
            <div class="config-group">
                <label>Température (créativité):</label>
                <input type="range" id="temperature" min="0" max="2" step="0.1" value="${CONFIG.API.TEMPERATURE}">
                <span id="temperatureValue">${CONFIG.API.TEMPERATURE}</span>
            </div>
        </div>
    `;
}

function switchConfigTab(tabType) {
    const content = document.getElementById('configContent');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    switch(tabType) {
        case 'api':
            content.innerHTML = generateAPIConfig();
            break;
        case 'ui':
            content.innerHTML = generateUIConfig();
            break;
        case 'coach':
            content.innerHTML = generateCoachConfig();
            break;
        case 'privacy':
            content.innerHTML = generatePrivacyConfig();
            break;
    }
}

function generateUIConfig() {
    return `
        <div class="config-section">
            <h4>🎨 Interface Utilisateur</h4>
            <div class="config-group">
                <label>Thème:</label>
                <select id="theme">
                    <option value="light" ${CONFIG.UI.THEME === 'light' ? 'selected' : ''}>Clair</option>
                    <option value="dark" ${CONFIG.UI.THEME === 'dark' ? 'selected' : ''}>Sombre</option>
                    <option value="auto" ${CONFIG.UI.THEME === 'auto' ? 'selected' : ''}>Automatique</option>
                </select>
            </div>
            <div class="config-group">
                <label>Langue:</label>
                <select id="language">
                    <option value="fr" ${CONFIG.UI.LANGUAGE === 'fr' ? 'selected' : ''}>Français</option>
                    <option value="en" ${CONFIG.UI.LANGUAGE === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="animations" ${CONFIG.UI.ANIMATIONS ? 'checked' : ''}>
                    Animations
                </label>
            </div>
        </div>
    `;
}

function generateCoachConfig() {
    return `
        <div class="config-section">
            <h4>🤖 Paramètres du Coach</h4>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="socraticMethod" ${CONFIG.COACH.SOCRATIC_METHOD ? 'checked' : ''}>
                    Méthode socratique
                </label>
            </div>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="emotionalAdaptation" ${CONFIG.COACH.EMOTIONAL_ADAPTATION ? 'checked' : ''}>
                    Adaptation émotionnelle
                </label>
            </div>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="industryExpertise" ${CONFIG.COACH.INDUSTRY_EXPERTISE ? 'checked' : ''}>
                    Expertise sectorielle
                </label>
            </div>
            <div class="config-group">
                <label>Taille mémoire:</label>
                <input type="number" id="memorySize" min="5" max="50" value="${CONFIG.COACH.MEMORY_SIZE}">
            </div>
        </div>
    `;
}

function generatePrivacyConfig() {
    return `
        <div class="config-section">
            <h4>🔒 Vie Privée & Sécurité</h4>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="localStorage" ${CONFIG.PRIVACY.LOCAL_STORAGE ? 'checked' : ''}>
                    Stockage local des données
                </label>
            </div>
            <div class="config-group">
                <label>
                    <input type="checkbox" id="analytics" ${CONFIG.PRIVACY.ANALYTICS ? 'checked' : ''}>
                    Analytics anonymes
                </label>
            </div>
            <div class="config-group">
                <label>Rétention des données:</label>
                <select id="dataRetention">
                    <option value="session" ${CONFIG.PRIVACY.DATA_RETENTION === 'session' ? 'selected' : ''}>Session uniquement</option>
                    <option value="local" ${CONFIG.PRIVACY.DATA_RETENTION === 'local' ? 'selected' : ''}>Stockage local</option>
                    <option value="none" ${CONFIG.PRIVACY.DATA_RETENTION === 'none' ? 'selected' : ''}>Aucune persistance</option>
                </select>
            </div>
        </div>
    `;
}

function closeConfigModal() {
    const modal = document.getElementById('configModal');
    if (modal) {
        modal.remove();
    }
}

// Mise à jour des valeurs de configuration depuis l'interface
function updateConfigFromUI() {
    // API
    CONFIG.API.OPENAI_KEY = document.getElementById('openaiKey')?.value || null;
    CONFIG.API.ANTHROPIC_KEY = document.getElementById('anthropicKey')?.value || null;
    CONFIG.API.DEFAULT_MODEL = document.getElementById('defaultModel')?.value || CONFIG.API.DEFAULT_MODEL;
    CONFIG.API.TEMPERATURE = parseFloat(document.getElementById('temperature')?.value) || CONFIG.API.TEMPERATURE;

    // UI
    CONFIG.UI.THEME = document.getElementById('theme')?.value || CONFIG.UI.THEME;
    CONFIG.UI.LANGUAGE = document.getElementById('language')?.value || CONFIG.UI.LANGUAGE;
    CONFIG.UI.ANIMATIONS = document.getElementById('animations')?.checked || false;

    // Coach
    CONFIG.COACH.SOCRATIC_METHOD = document.getElementById('socraticMethod')?.checked || false;
    CONFIG.COACH.EMOTIONAL_ADAPTATION = document.getElementById('emotionalAdaptation')?.checked || false;
    CONFIG.COACH.INDUSTRY_EXPERTISE = document.getElementById('industryExpertise')?.checked || false;
    CONFIG.COACH.MEMORY_SIZE = parseInt(document.getElementById('memorySize')?.value) || CONFIG.COACH.MEMORY_SIZE;

    // Privacy
    CONFIG.PRIVACY.LOCAL_STORAGE = document.getElementById('localStorage')?.checked || false;
    CONFIG.PRIVACY.ANALYTICS = document.getElementById('analytics')?.checked || false;
    CONFIG.PRIVACY.DATA_RETENTION = document.getElementById('dataRetention')?.value || CONFIG.PRIVACY.DATA_RETENTION;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserConfig();
    validateConfig();

    // Mise à jour en temps réel de la température
    document.addEventListener('input', function(e) {
        if (e.target.id === 'temperature') {
            document.getElementById('temperatureValue').textContent = e.target.value;
        }
    });
});

// Export de la configuration
window.CONFIG = CONFIG;
window.openConfigPanel = openConfigPanel;
window.closeConfigModal = closeConfigModal;
window.switchConfigTab = switchConfigTab;
window.updateConfigFromUI = updateConfigFromUI;