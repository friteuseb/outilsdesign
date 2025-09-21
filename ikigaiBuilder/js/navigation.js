// Système de navigation pour l'application
class NavigationManager {
    constructor() {
        this.currentPage = '';
        this.init();
    }

    init() {
        // Marquer la page active dans la navigation
        this.setActiveNavItem();
        
        // Ajouter les event listeners pour le menu mobile
        this.initMobileMenu();
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Vérifier si le lien correspond à la page actuelle
            const linkPath = new URL(link.href).pathname;
            if (currentPath.includes(linkPath.split('/').pop().replace('.html', ''))) {
                link.classList.add('active');
            }
        });

        // Page d'accueil par défaut
        if (currentPath.includes('index.html') || currentPath === '/') {
            document.querySelector('.nav-link[href="index.html"]')?.classList.add('active');
        }
    }

    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Fermer le menu quand on clique sur un lien
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // Méthode pour naviguer par programmation
    navigateTo(page) {
        window.location.href = page;
    }
}

// Gestionnaire de données partagées entre les pages
class DataManager {
    constructor() {
        this.storageKey = 'ikigaiBuilderData';
    }

    // Sauvegarder les données
    saveData(data) {
        const existingData = this.loadData();
        const mergedData = { ...existingData, ...data };
        localStorage.setItem(this.storageKey, JSON.stringify(mergedData));
    }

    // Charger les données
    loadData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    // Récupérer une section spécifique
    getSection(sectionName) {
        const data = this.loadData();
        return data[sectionName] || [];
    }

    // Sauvegarder une section spécifique
    saveSection(sectionName, sectionData) {
        const data = this.loadData();
        data[sectionName] = sectionData;
        this.saveData(data);
    }

    // Effacer toutes les données
    clearData() {
        localStorage.removeItem(this.storageKey);
    }

    // Exporter les données
    exportData() {
        const data = this.loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type:'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'ikigai-data.json';
        link.click();
    }

    // Importer les données
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}

// Système de notifications
class NotificationManager {
    constructor() {
        this.init();
    }

    init() {
        // Créer le conteneur de notifications s'il n'existe pas
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;
        
        notification.textContent = message;
        
        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        container.appendChild(notification);
        
        // Fermer en cliquant
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        // Fermer automatiquement
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
    }

    remove(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }
}

// Initialiser les gestionnaires globaux
const navigation = new NavigationManager();
const dataManager = new DataManager();
const notifications = new NotificationManager();

// Fonctions utilitaires globales
window.navigateTo = (page) => navigation.navigateTo(page);
window.saveData = (data) => dataManager.saveData(data);
window.loadData = () => dataManager.loadData();
window.showNotification = (message, type, duration) => notifications.show(message, type, duration);