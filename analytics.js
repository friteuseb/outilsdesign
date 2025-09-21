/**
 * Configuration Google Analytics 4 pour Design Thinking Tools
 * À personnaliser avec votre ID de mesure GA4
 */

// Configuration - ID de mesure GA4
const GA4_MEASUREMENT_ID = 'G-YQF3S9482Q';

/**
 * Initialise Google Analytics 4
 */
function initGA4() {
    // Chargement du script Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Configuration GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    // Configuration de base avec respect de la vie privée
    gtag('config', GA4_MEASUREMENT_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    });

    // Rendre gtag disponible globalement
    window.gtag = gtag;
}

/**
 * Événements personnalisés pour le portail
 */
function trackPortalEvents() {
    // Tracking des clics vers les outils
    document.querySelectorAll('a[href*="generateur_personas"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'tool_access', {
                event_category: 'Portal',
                event_label: 'Generateur_Personas',
                value: 1
            });
        });
    });

    document.querySelectorAll('a[href*="ikigaiBuilder"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'tool_access', {
                event_category: 'Portal',
                event_label: 'Ikigai_Builder',
                value: 1
            });
        });
    });

    document.querySelectorAll('a[href*="whyBuilder"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'tool_access', {
                event_category: 'Portal',
                event_label: 'Why_Builder',
                value: 1
            });
        });
    });

    // Tracking des clics vers GitHub
    document.querySelectorAll('a[href*="github.com"]').forEach(link => {
        link.addEventListener('click', () => {
            const repoName = link.href.split('/').pop();
            gtag('event', 'github_click', {
                event_category: 'External_Link',
                event_label: repoName,
                value: 1
            });
        });
    });

    // Tracking des clics sur contact
    document.querySelectorAll('a[href*="mailto"]').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'contact_click', {
                event_category: 'Contact',
                event_label: 'Email',
                value: 1
            });
        });
    });
}

/**
 * Événements pour le Générateur de Personas
 */
function trackPersonasEvents() {
    // Ces fonctions seront appelées depuis l'outil personas
    window.trackPersonaCreated = function() {
        gtag('event', 'persona_created', {
            event_category: 'Personas_Tool',
            event_label: 'New_Persona',
            value: 1
        });
    };

    window.trackPersonaExportPDF = function() {
        gtag('event', 'export_pdf', {
            event_category: 'Personas_Tool',
            event_label: 'PDF_Export',
            value: 1
        });
    };

    window.trackMatrixPositioning = function() {
        gtag('event', 'matrix_positioning', {
            event_category: 'Personas_Tool',
            event_label: 'Position_Matrix',
            value: 1
        });
    };

    window.trackMatrixExport = function(type) {
        gtag('event', 'matrix_export', {
            event_category: 'Personas_Tool',
            event_label: `Matrix_Export_${type}`,
            value: 1
        });
    };
}

/**
 * Événements pour Ikigai Builder
 */
function trackIkigaiEvents() {
    window.trackIkigaiCoachStart = function() {
        gtag('event', 'coach_started', {
            event_category: 'Ikigai_Tool',
            event_label: 'AI_Coach_Session',
            value: 1
        });
    };

    window.trackIkigaiFormCompleted = function() {
        gtag('event', 'form_completed', {
            event_category: 'Ikigai_Tool',
            event_label: 'Ikigai_Form',
            value: 1
        });
    };

    window.trackIkigaiAnalysisGenerated = function() {
        gtag('event', 'analysis_generated', {
            event_category: 'Ikigai_Tool',
            event_label: 'Personal_Analysis',
            value: 1
        });
    };

    window.trackIkigaiRecommendations = function() {
        gtag('event', 'recommendations_viewed', {
            event_category: 'Ikigai_Tool',
            event_label: 'Career_Recommendations',
            value: 1
        });
    };
}

/**
 * Événements pour WhyBuilder
 */
function trackWhyBuilderEvents() {
    window.trackWhyPathChosen = function(path) {
        gtag('event', 'path_chosen', {
            event_category: 'Why_Builder',
            event_label: `Path_${path}`, // 'Perso' ou 'Pro'
            value: 1
        });
    };

    window.trackWhyCompleted = function(path) {
        gtag('event', 'why_completed', {
            event_category: 'Why_Builder',
            event_label: `Completed_${path}`,
            value: 1
        });
    };

    window.trackWhyAIImprovement = function(style) {
        gtag('event', 'ai_improvement', {
            event_category: 'Why_Builder',
            event_label: `AI_Style_${style}`,
            value: 1
        });
    };

    window.trackWhyPDFExport = function(path) {
        gtag('event', 'pdf_export', {
            event_category: 'Why_Builder',
            event_label: `PDF_${path}`,
            value: 1
        });
    };
}

/**
 * Fonction d'initialisation principale
 * À appeler dans chaque page
 */
function initAnalytics() {
    // Vérifier que l'ID GA4 est configuré
    if (GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️  Google Analytics non configuré. Remplacez GA4_MEASUREMENT_ID dans analytics.js');
        return;
    }

    console.log('📊 Google Analytics initialisé avec l\'ID:', GA4_MEASUREMENT_ID);

    // Initialiser GA4
    initGA4();

    // Attendre que le DOM soit chargé pour attacher les événements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachEventListeners);
    } else {
        attachEventListeners();
    }
}

/**
 * Attache les bons événements selon la page
 */
function attachEventListeners() {
    const path = window.location.pathname;

    if (path.includes('index.html') || path.endsWith('/')) {
        // Page portail
        trackPortalEvents();
    } else if (path.includes('generateur_personas')) {
        // Outil personas
        trackPersonasEvents();
    } else if (path.includes('ikigaiBuilder')) {
        // Outil ikigai
        trackIkigaiEvents();
    } else if (path.includes('whyBuilder')) {
        // Outil why builder
        trackWhyBuilderEvents();
    }
}

/**
 * Fonction utilitaire pour tracker des événements personnalisés
 */
window.trackCustomEvent = function(eventName, category, label, value = 1) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

// Auto-initialisation si le script est chargé
if (typeof window !== 'undefined') {
    initAnalytics();
}