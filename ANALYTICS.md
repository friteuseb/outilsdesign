# 📊 Documentation Analytics - Design Thinking Tools

## Configuration initiale

1. **Créer un compte Google Analytics 4**
   - Allez sur [https://analytics.google.com](https://analytics.google.com)
   - Créez une nouvelle propriété GA4
   - Récupérez votre ID de mesure (format : `G-XXXXXXXXXX`)

2. **Configurer l'ID Analytics**
   - Ouvrez le fichier `analytics.js`
   - Remplacez `G-XXXXXXXXXX` par votre vrai ID de mesure :
   ```javascript
   const GA4_MEASUREMENT_ID = 'G-VOTRE-VRAI-ID';
   ```

## Événements trackés

### 🏠 Page Portail (`index.html`)

| Événement | Description | Catégorie | Label |
|-----------|-------------|-----------|--------|
| `tool_access` | Clic vers un outil | `Portal` | `Generateur_Personas`, `Ikigai_Builder`, `Why_Builder` |
| `github_click` | Clic vers GitHub | `External_Link` | Nom du repository |
| `contact_click` | Clic sur email | `Contact` | `Email` |

### 👤 Générateur de Personas

| Événement | Description | Catégorie | Label |
|-----------|-------------|-----------|--------|
| `persona_created` | Nouveau persona sauvegardé | `Personas_Tool` | `New_Persona` |
| `export_pdf` | Export PDF persona | `Personas_Tool` | `PDF_Export` |
| `matrix_positioning` | Positionnement sur matrice | `Personas_Tool` | `Position_Matrix` |
| `matrix_export` | Export matrice | `Personas_Tool` | `Matrix_Export_PNG/JSON/PDF` |

### 🧠 Ikigai Builder

| Événement | Description | Catégorie | Label |
|-----------|-------------|-----------|--------|
| `coach_started` | Démarrage coach IA | `Ikigai_Tool` | `AI_Coach_Session` |
| `form_completed` | Formulaire Ikigai terminé | `Ikigai_Tool` | `Ikigai_Form` |
| `analysis_generated` | Analyse générée | `Ikigai_Tool` | `Personal_Analysis` |
| `recommendations_viewed` | Recommandations consultées | `Ikigai_Tool` | `Career_Recommendations` |

### 💡 WhyBuilder

| Événement | Description | Catégorie | Label |
|-----------|-------------|-----------|--------|
| `path_chosen` | Choix du parcours | `Why_Builder` | `Path_Perso/Path_Pro` |
| `why_completed` | Why terminé | `Why_Builder` | `Completed_Perso/Completed_Pro` |
| `ai_improvement` | Amélioration IA | `Why_Builder` | `AI_Style_[style]` |
| `pdf_export` | Export PDF | `Why_Builder` | `PDF_Perso/PDF_Pro` |

## Ajout d'événements personnalisés

Vous pouvez facilement ajouter de nouveaux événements dans vos outils :

```javascript
// Exemple d'usage
if (typeof trackCustomEvent !== 'undefined') {
    trackCustomEvent('nom_evenement', 'Categorie', 'Label', 1);
}
```

## Métriques importantes à surveiller

### Engagement
- **Pages vues** : Popularité de chaque outil
- **Durée de session** : Temps passé sur chaque outil
- **Taux de rebond** : Qualité de l'engagement

### Conversions
- **Personas créés** : Utilité du générateur personas
- **Analyses Ikigai complétées** : Engagement coach IA
- **PDF exportés** : Finalisation des outils
- **Parcours Why terminés** : Taux de completion

### Navigation
- **Clics vers outils** : Outil le plus populaire depuis le portail
- **Clics GitHub** : Intérêt pour le code source
- **Retours portail** : Navigation entre outils

## Dashboard recommandé GA4

### Rapport personnalisé "Design Thinking Tools"
1. **Vue d'ensemble**
   - Utilisateurs actifs
   - Sessions par outil
   - Événements principaux

2. **Engagement par outil**
   - Sessions par outil
   - Durée moyenne
   - Actions principales

3. **Conversions**
   - Taux de création personas
   - Taux d'export PDF
   - Taux de completion parcours

## Respect de la vie privée

L'implémentation respecte la vie privée :
- `anonymize_ip: true` - IPs anonymisées
- `allow_google_signals: false` - Pas de signaux publicitaires
- `allow_ad_personalization_signals: false` - Pas de personnalisation publicitaire

## Fichiers modifiés

- `analytics.js` - Configuration centrale GA4
- `index.html` - Tracking portail
- `generateur_personas/index.html` - Tracking personas
- `ikigaiBuilder/*.html` - Tracking ikigai (5 pages)
- `whyBuilder/*.html` - Tracking why builder (3 pages)

## Test de l'implémentation

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet Console
3. Si GA4 n'est pas configuré, vous verrez :
   ```
   ⚠️ Google Analytics non configuré. Remplacez GA4_MEASUREMENT_ID dans analytics.js
   ```
4. Une fois configuré, les événements apparaîtront dans GA4 sous 24-48h

---

**📈 Analytics prêts à l'emploi !**

Une fois l'ID configuré, vous aurez des statistiques détaillées sur l'utilisation de vos 3 outils de design thinking.