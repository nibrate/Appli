# IA Prédiction de Nombres

Une application web de type PWA (Progressive Web App) qui utilise un système d'apprentissage progressif pour prédire des séquences de 5 nombres (de 1 à 90).

## Fonctionnalités

- **Prédictions Intelligentes :** L'application utilise un algorithme qui analyse les données historiques pour générer des prédictions.
- **Analyse Avancée :** Visualisez des statistiques détaillées sur les numéros les plus fréquents, les écarts, et plus encore.
- **Apprentissage Continu :** Le modèle s'améliore à chaque nouveau résultat que vous ajoutez.
- **PWA :** Installez l'application sur votre appareil pour un accès hors ligne.
- **Gestion des Données :** Chargez des données historiques, ajoutez de nouveaux résultats, et exportez vos données à tout moment.

## Comment utiliser l'application

1.  **Chargez des données :** Commencez par ajouter des données historiques dans la section "Gestion des Données". Vous pouvez soit les saisir manuellement (format : `1,2,3,4,5` par ligne), soit utiliser le bouton "Générer Données Test" pour commencer.
2.  **Générez une prédiction :** Cliquez sur le bouton "Nouvelle Prédiction" pour que l'IA génère une nouvelle séquence.
3.  **Ajoutez des résultats :** Après un tirage, ajoutez le résultat réel dans le champ "Nouveau Résultat" pour que le modèle apprenne et améliore sa précision.
4.  **Analysez les résultats :** Consultez le tableau de bord et la section d'analyse pour comprendre les tendances et les performances du modèle.

## Installation locale

Pour exécuter ce projet localement, vous avez seulement besoin d'un serveur web simple. Vous pouvez utiliser l'extension "Live Server" pour Visual Studio Code, ou démarrer un serveur Python simple.

1.  Clonez le dépôt :
    ```sh
    git clone <url-du-repo>
    ```
2.  Naviguez dans le dossier du projet :
    ```sh
    cd Appli
    ```
3.  Démarrez un serveur local. Par exemple, avec Python :
    ```sh
    python -m http.server
    ```
4.  Ouvrez votre navigateur et allez à l'adresse `http://localhost:8000`.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Service Workers (pour la fonctionnalité PWA)
