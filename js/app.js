
    
class AdvancedNumberPredictionAI {
            constructor() {
                this.history = [];
                this.predictions = [];
                this.numberFrequency = {};
                this.patterns = {
                    gaps: {},
                    sums: {},
                    evenOdd: {},
                    positions: {},
                    sequences: {}
                };
                this.neuralWeights = this.initializeWeights();
                this.totalPredictions = 0;
                this.correctPredictions = 0;
                this.confidenceScore = 0;
                
                // Sauvegarder dans localStorage
                this.loadFromStorage();
                
                // Service Worker pour PWA
                this.registerServiceWorker();
            }

            // Initialiser les poids du réseau de neurones simple
            initializeWeights() {
                const weights = {};
                for (let i = 1; i <= 90; i++) {
                    weights[i] = Math.random() * 0.1;
                }
                return weights;
            }

            // Enregistrer le Service Worker
            registerServiceWorker() {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/service-worker.js')
                        .then(registration => {
                            console.log('Service Worker registered with scope:', registration.scope);
                        })
                        .catch(error => {
                            console.error('Service Worker registration failed:', error);
                        });
                }
            }

            // Sauvegarder dans le localStorage
            saveToStorage() {
                try {
                    const data = {
                        history: this.history,
                        predictions: this.predictions.map(p => ({
                            ...p,
                            timestamp: p.timestamp.toISOString()
                        })),
                        numberFrequency: this.numberFrequency,
                        patterns: this.patterns,
                        neuralWeights: this.neuralWeights,
                        totalPredictions: this.totalPredictions,
                        correctPredictions: this.correctPredictions,
                        confidenceScore: this.confidenceScore
                    };
                    localStorage.setItem('aiPredictionData', JSON.stringify(data));
                } catch (error) {
                    console.warn('Impossible de sauvegarder les données:', error);
                }
            }

            // Charger depuis le localStorage
            loadFromStorage() {
                try {
                    const saved = localStorage.getItem('aiPredictionData');
                    if (saved) {
                        const data = JSON.parse(saved);
                        this.history = data.history || [];
                        this.predictions = (data.predictions || []).map(p => ({
                            ...p,
                            timestamp: new Date(p.timestamp)
                        }));
                        this.numberFrequency = data.numberFrequency || {};
                        this.patterns = data.patterns || {};
                        this.neuralWeights = data.neuralWeights || this.initializeWeights();
                        this.totalPredictions = data.totalPredictions || 0;
                        this.correctPredictions = data.correctPredictions || 0;
                        this.confidenceScore = data.confidenceScore || 0;
                    }
                } catch (error) {
                    console.warn('Impossible de charger les données sauvegardées:', error);
                }
            }

            // Validation avancée des séquences
            validateSequence(numbers) {
                if (!Array.isArray(numbers) || numbers.length !== 5) return false;
                const uniqueNumbers = new Set(numbers);
                if (uniqueNumbers.size !== 5) return false; // Pas de doublons
                return numbers.every(n => Number.isInteger(n) && n >= 1 && n <= 90);
            }

            // Ajouter des données historiques avec validation
            addHistoricalData(sequences) {
                let validCount = 0;
                sequences.forEach(seq => {
                    if (this.validateSequence(seq)) {
                        this.history.push([...seq].sort((a, b) => a - b));
                        this.updateAdvancedAnalysis(seq);
                        validCount++;
                    }
                });
                
                this.recalculateConfidence();
                this.saveToStorage();
                this.updateUI();
                
                return validCount;
            }

            // Mise à jour de l'analyse avancée
            updateAdvancedAnalysis(sequence) {
                const sortedSeq = [...sequence].sort((a, b) => a - b);
                
                // Fréquences des nombres
                sortedSeq.forEach(num => {
                    this.numberFrequency[num] = (this.numberFrequency[num] || 0) + 1;
                    this.neuralWeights[num] += 0.01; // Renforcement
                });

                // Analyse des écarts
                for (let i = 0; i < sortedSeq.length - 1; i++) {
                    const gap = sortedSeq[i + 1] - sortedSeq[i];
                    const gapKey = `pos${i}_gap${gap}`;
                    this.patterns.gaps[gapKey] = (this.patterns.gaps[gapKey] || 0) + 1;
                }

                // Analyse des positions
                sortedSeq.forEach((num, index) => {
                    const posKey = `pos${index}_num${num}`;
                    this.patterns.positions[posKey] = (this.patterns.positions[posKey] || 0) + 1;
                });

                // Analyse des sommes
                const sum = sortedSeq.reduce((a, b) => a + b, 0);
                const sumRange = Math.floor(sum / 25) * 25;
                this.patterns.sums[sumRange] = (this.patterns.sums[sumRange] || 0) + 1;

                // Analyse pairs/impairs
                const evenCount = sortedSeq.filter(n => n % 2 === 0).length;
                this.patterns.evenOdd[evenCount] = (this.patterns.evenOdd[evenCount] || 0) + 1;

                // Séquences récurrentes (triplets)
                if (this.history.length >= 3) {
                    const recent = this.history.slice(-3);
                    const pattern = recent.map(seq => seq.join(',')).join('|');
                    this.patterns.sequences[pattern] = (this.patterns.sequences[pattern] || 0) + 1;
                }
            }

            // Génération de prédiction avec algorithme avancé
            generateAdvancedPrediction() {
                if (this.history.length < 2) {
                    return this.generateRandomPrediction();
                }

                const prediction = [];
                const candidates = this.generateSmartCandidates();
                
                // Algorithme de sélection multi-critères
                const scoredCandidates = candidates.map(num => ({
                    number: num,
                    score: this.calculateAdvancedScore(num, prediction)
                }));

                // Tri par score décroissant
                scoredCandidates.sort((a, b) => b.score - a.score);

                // Sélection avec diversité
                for (let candidate of scoredCandidates) {
                    if (prediction.length >= 5) break;
                    if (!prediction.includes(candidate.number)) {
                        // Vérifier la diversité
                        if (this.checkDiversity(candidate.number, prediction)) {
                            prediction.push(candidate.number);
                        }
                    }
                }

                // Compléter si nécessaire
                while (prediction.length < 5) {
                    const randomNum = Math.floor(Math.random() * 90) + 1;
                    if (!prediction.includes(randomNum)) {
                        prediction.push(randomNum);
                    }
                }

                return prediction.sort((a, b) => a - b);
            }

            // Génération de candidats intelligents
            generateSmartCandidates() {
                const candidates = new Set();

                // Nombres fréquents (top 30%)
                const frequentNums = Object.entries(this.numberFrequency)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, Math.ceil(Object.keys(this.numberFrequency).length * 0.3))
                    .map(([num]) => parseInt(num));
                frequentNums.forEach(num => candidates.add(num));

                // Nombres selon patterns de position
                for (let pos = 0; pos < 5; pos++) {
                    const positionPattern = Object.keys(this.patterns.positions)
                        .filter(key => key.startsWith(`pos${pos}_`))
                        .sort((a, b) => this.patterns.positions[b] - this.patterns.positions[a])
                        .slice(0, 5);
                    
                    positionPattern.forEach(pattern => {
                        const num = parseInt(pattern.split('_num')[1]);
                        candidates.add(num);
                    });
                }

                // Nombres basés sur les poids neuraux
                const neuralTop = Object.entries(this.neuralWeights)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 20)
                    .map(([num]) => parseInt(num));
                neuralTop.forEach(num => candidates.add(num));

                // Quelques nombres aléatoires pour la diversité
                for (let i = 0; i < 15; i++) {
                    candidates.add(Math.floor(Math.random() * 90) + 1);
                }

                return Array.from(candidates);
            }

            // Calcul de score avancé
            calculateAdvancedScore(number, currentPrediction) {
                let score = 0;

                // Score basé sur la fréquence (30%)
                const frequency = this.numberFrequency[number] || 0;
                score += frequency * 0.3;

                // Score basé sur les poids neuraux (25%)
                score += this.neuralWeights[number] * 0.25;

                // Score basé sur les patterns de position (20%)
                for (let pos = 0; pos < 5 - currentPrediction.length; pos++) {
                    const posPattern = `pos${pos}_num${number}`;
                    if (this.patterns.positions[posPattern]) {
                        score += this.patterns.positions[posPattern] * 0.2;
                    }
                }

                // Score basé sur les tendances récentes (15%)
                if (this.history.length >= 3) {
                    const recentAppearances = this.history.slice(-3)
                        .flat()
                        .filter(n => n === number).length;
                    score += recentAppearances * 0.15;
                }

                // Pénalité pour répétition immédiate (10%)
                if (this.history.length > 0) {
                    const lastSequence = this.history[this.history.length - 1];
                    if (lastSequence.includes(number)) {
                        score -= 0.1;
                    }
                }

                // Bonus de diversité dans la prédiction actuelle
                const diversityBonus = this.calculateDiversityBonus(number, currentPrediction);
                score *= diversityBonus;

                // Facteur aléatoire pour éviter la prédictibilité
                score += Math.random() * 0.05;

                return Math.max(0, score);
            }

            // Vérifier la diversité des nombres
            checkDiversity(number, currentPrediction) {
                if (currentPrediction.length === 0) return true;
                
                // Éviter les nombres trop proches
                const minGap = 3;
                return currentPrediction.every(existing => 
                    Math.abs(number - existing) >= minGap
                );
            }

            // Calculer le bonus de diversité
            calculateDiversityBonus(number, currentPrediction) {
                if (currentPrediction.length === 0) return 1;

                let bonus = 1;
                currentPrediction.forEach(existing => {
                    const gap = Math.abs(number - existing);
                    if (gap < 5) bonus *= 0.7;
                    else if (gap < 10) bonus *= 0.9;
                });
                
                return bonus;
            }

            // Prédiction aléatoire améliorée
            generateRandomPrediction() {
                const prediction = [];
                const weights = Array.from({length: 90}, (_, i) => {
                    const num = i + 1;
                    return this.neuralWeights[num] || 0.1;
                });

                while (prediction.length < 5) {
                    const weightedRandom = this.weightedRandomSelect(weights);
                    if (!prediction.includes(weightedRandom)) {
                        prediction.push(weightedRandom);
                    }
                }

                return prediction.sort((a, b) => a - b);
            }

            // Sélection aléatoire pondérée
            weightedRandomSelect(weights) {
                const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
                let random = Math.random() * totalWeight;
                
                for (let i = 0; i < weights.length; i++) {
                    random -= weights[i];
                    if (random <= 0) {
                        return i + 1;
                    }
                }
                
                return Math.floor(Math.random() * 90) + 1;
            }

            // Ajouter un résultat avec apprentissage
            addResult(result) {
                if (!this.validateSequence(result)) {
                    throw new Error("Séquence invalide : 5 nombres uniques entre 1 et 90");
                }

                const sortedResult = [...result].sort((a, b) => a - b);

                // Évaluer la dernière prédiction si elle existe
                if (this.predictions.length > 0) {
                    const lastPrediction = this.predictions[this.predictions.length - 1];
                    if (!lastPrediction.actual) {
                        const accuracy = this.calculateDetailedAccuracy(lastPrediction.numbers, sortedResult);
                        lastPrediction.accuracy = accuracy.percentage;
                        lastPrediction.matches = accuracy.matches;
                        lastPrediction.actual = [...sortedResult];
                        
                        this.totalPredictions++;
                        this.correctPredictions += accuracy.percentage / 100;
                        
                        // Apprentissage par renforcement
                        this.reinforceLearning(lastPrediction.numbers, sortedResult, accuracy.matches);
                    }
                }

                this.history.push(sortedResult);
                this.updateAdvancedAnalysis(sortedResult);
                this.recalculateConfidence();
                this.saveToStorage();
                this.updateUI();

                return {
                    success: true,
                    message: "Résultat ajouté et analyse mise à jour"
                };
            }

            // Calcul d'accuracy détaillé
            calculateDetailedAccuracy(prediction, actual) {
                const matches = prediction.filter(num => actual.includes(num));
                const percentage = (matches.length / 5) * 100;
                
                return {
                    percentage: Math.round(percentage),
                    matches: matches,
                    total: 5
                };
            }

            // Apprentissage par renforcement
            reinforceLearning(prediction, actual, matches) {
                const learningRate = 0.1;
                
                // Renforcer les poids des nombres corrects
                matches.forEach(num => {
                    this.neuralWeights[num] += learningRate;
                });
                
                // Pénaliser légèrement les nombres incorrects
                prediction.forEach(num => {
                    if (!matches.includes(num)) {
                        this.neuralWeights[num] = Math.max(0.01, this.neuralWeights[num] - learningRate * 0.1);
                    }
                });
                
                // Normaliser les poids
                this.normalizeWeights();
            }

            // Normaliser les poids neuraux
            normalizeWeights() {
                const maxWeight = Math.max(...Object.values(this.neuralWeights));
                if (maxWeight > 10) {
                    Object.keys(this.neuralWeights).forEach(num => {
                        this.neuralWeights[num] /= (maxWeight / 5);
                    });
                }
            }

            // Recalculer la confiance du modèle
            recalculateConfidence() {
                let confidence = 0;
                
                // Facteur basé sur la quantité de données
                const dataFactor = Math.min(this.history.length / 50, 1) * 40;
                confidence += dataFactor;
                
                // Facteur basé sur la précision récente
                if (this.totalPredictions > 0) {
                    const recentAccuracy = (this.correctPredictions / this.totalPredictions) * 100;
                    confidence += recentAccuracy * 0.4;
                }
                
                // Facteur basé sur la consistance des patterns
                const patternConsistency = this.calculatePatternConsistency() * 20;
                confidence += patternConsistency;
                
                this.confidenceScore = Math.min(Math.max(confidence, 0), 100);
            }

            // Calculer la consistance des patterns
            calculatePatternConsistency() {
                if (Object.keys(this.patterns.gaps).length === 0) return 0;
                
                const gapValues = Object.values(this.patterns.gaps);
                const maxGap = Math.max(...gapValues);
                const avgGap = gapValues.reduce((a, b) => a + b, 0) / gapValues.length;
                
                return Math.min(avgGap / maxGap, 1);
            }

            // Faire une prédiction
            makePrediction() {
                const prediction = this.generateAdvancedPrediction();
                const predictionData = {
                    numbers: prediction,
                    timestamp: new Date(),
                    accuracy: null,
                    matches: null,
                    actual: null,
                    confidence: this.confidenceScore
                };
                
                this.predictions.push(predictionData);
                this.saveToStorage();
                this.updateUI();
                
                return predictionData;
            }

            // Générer des données de test
            generateSampleData(count = 10) {
                const sampleData = [];
                for (let i = 0; i < count; i++) {
                    const numbers = [];
                    while (numbers.length < 5) {
                        const num = Math.floor(Math.random() * 90) + 1;
                        if (!numbers.includes(num)) {
                            numbers.push(num);
                        }
                    }
                    sampleData.push(numbers.sort((a, b) => a - b));
                }
                
                this.addHistoricalData(sampleData);
                return sampleData;
            }

            // Obtenir les statistiques complètes
            getComprehensiveStats() {
                const overallAccuracy = this.totalPredictions > 0 
                    ? Math.round((this.correctPredictions / this.totalPredictions) * 100)
                    : 0;

                return {
                    totalPredictions: this.totalPredictions,
                    accuracy: overallAccuracy,
                    confidence: Math.round(this.confidenceScore),
                    dataPoints: this.history.length,
                    patterns: Object.keys(this.patterns.gaps).length,
                    topNumbers: this.getTopNumbers(5),
                    recentTrend: this.getRecentTrend()
                };
            }

            // Obtenir les nombres les plus fréquents
            getTopNumbers(count = 10) {
                return Object.entries(this.numberFrequency)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, count)
                    .map(([num, freq]) => ({ number: parseInt(num), frequency: freq }));
            }

            // Obtenir la tendance récente
            getRecentTrend() {
                if (this.history.length < 3) return "Données insuffisantes";
                
                const recent = this.history.slice(-3).flat();
                const recentFreq = {};
                recent.forEach(n => {
                    recentFreq[n] = (recentFreq[n] || 0) + 1;
                });
                
                const trending = Object.entries(recentFreq)
                    .filter(([, freq]) => freq > 1)
                    .sort(([,a], [,b]) => b - a)
                    .map(([num]) => parseInt(num));
                
                return trending.length > 0 ? trending : "Aucune tendance claire";
            }

            // Analyse complète des patterns
            getDetailedPatternAnalysis() {
                if (this.history.length < 3) {
                    return `
                        <div style="text-align: center; color: #666; padding: 20px;">
                            <h3>🔍 Analyse Insuffisante</h3>
                            <p>Au moins 3 séquences sont nécessaires pour une analyse meaningful.</p>
                            <p><strong>Données actuelles :</strong> ${this.history.length} séquence(s)</p>
                        </div>
                    `;
                }

                const stats = this.getComprehensiveStats();
                let analysis = `
                    <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                        <h3 style="color: #495057; margin-bottom: 15px;">🎯 Résumé Analytique</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                                <strong style="color: #28a745;">Précision Globale</strong><br>
                                <span style="font-size: 1.5em; color: #495057;">${stats.accuracy}%</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                                <strong style="color: #17a2b8;">Confiance du Modèle</strong><br>
                                <span style="font-size: 1.5em; color: #495057;">${stats.confidence}%</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <strong style="color: #ffc107;">Patterns Détectés</strong><br>
                                <span style="font-size: 1.5em; color: #495057;">${stats.patterns}</span>
                            </div>
                        </div>
                    </div>
                `;

                // Nombres les plus fréquents
                analysis += `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #495057; margin-bottom: 10px;">🔥 Nombres les Plus Fréquents</h4>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
                `;
                
                stats.topNumbers.forEach(item => {
                    const percentage = ((item.frequency / this.history.length) * 100).toFixed(1);
                    analysis += `
                        <span style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); 
                              color: white; padding: 5px 12px; border-radius: 20px; margin: 3px; font-size: 0.9em;">
                            ${item.number} <small>(${item.frequency}× - ${percentage}%)</small>
                        </span>
                    `;
                });
                
                analysis += `</div></div>`;

                // Analyse des écarts
                if (Object.keys(this.patterns.gaps).length > 0) {
                    const topGaps = Object.entries(this.patterns.gaps)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 6);
                    
                    analysis += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #495057; margin-bottom: 10px;">📏 Écarts les Plus Fréquents</h4>
                            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
                    `;
                    
                    topGaps.forEach(([pattern, count]) => {
                        const position = pattern.match(/pos(\d+)/)[1];
                        const gap = pattern.match(/gap(\d+)/)[1];
                        analysis += `
                            <span style="display: inline-block; background: #f8f9fa; border: 1px solid #dee2e6;
                                  padding: 8px 12px; border-radius: 6px; margin: 3px; font-size: 0.9em;">
                                Position ${parseInt(position)+1}: Gap ${gap} <small>(${count}×)</small>
                            </span>
                        `;
                    });
                    
                    analysis += `</div></div>`;
                }

                // Tendances récentes
                analysis += `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #495057; margin-bottom: 10px;">📈 Tendances Récentes</h4>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
                `;
                
                if (Array.isArray(stats.recentTrend) && stats.recentTrend.length > 0) {
                    stats.recentTrend.forEach(num => {
                        analysis += `
                            <span style="display: inline-block; background: linear-gradient(135deg, #10ac84, #00d2d3); 
                                  color: white; padding: 6px 12px; border-radius: 15px; margin: 3px; font-weight: bold;">
                                ${num}
                            </span>
                        `;
                    });
                } else {
                    analysis += `<p style="color: #6c757d; font-style: italic;">${stats.recentTrend}</p>`;
                }
                
                analysis += `</div></div>`;

                // Analyse des sommes
                if (Object.keys(this.patterns.sums).length > 0) {
                    const avgSum = this.history.reduce((acc, seq) => 
                        acc + seq.reduce((a, b) => a + b, 0), 0) / this.history.length;
                    
                    analysis += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #495057; margin-bottom: 10px;">🧮 Analyse des Sommes</h4>
                            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
                                <p><strong>Somme Moyenne :</strong> ${Math.round(avgSum)}</p>
                                <p><strong>Plage Optimale :</strong> ${Math.round(avgSum - 50)} - ${Math.round(avgSum + 50)}</p>
                            </div>
                        </div>
                    `;
                }

                return analysis;
            }

            // Mise à jour de l'interface utilisateur
            updateUI() {
                const stats = this.getComprehensiveStats();
                
                // Mettre à jour les statistiques
                document.getElementById('totalPredictions').textContent = stats.totalPredictions;
                document.getElementById('accuracy').textContent = `${stats.accuracy}%`;
                document.getElementById('confidence').textContent = `${stats.confidence}%`;
                document.getElementById('dataPoints').textContent = stats.dataPoints;

                // Afficher la dernière prédiction
                if (this.predictions.length > 0) {
                    const lastPrediction = this.predictions[this.predictions.length - 1];
                    this.displayPrediction(lastPrediction);
                }

                // Mettre à jour l'historique
                this.updateHistoryDisplay();
                
                // Mettre à jour l'analyse des patterns
                document.getElementById('patternAnalysis').innerHTML = this.getDetailedPatternAnalysis();
            }

            // Afficher une prédiction avec analyse
            displayPrediction(predictionData) {
                const container = document.getElementById('currentPrediction');
                container.innerHTML = '';
                
                predictionData.numbers.forEach(num => {
                    const ball = document.createElement('div');
                    ball.className = 'number-ball';
                    ball.textContent = num;
                    container.appendChild(ball);
                });

                // Génerer l'analyse contextuelle
                let analysis = this.generatePredictionAnalysis(predictionData);
                document.getElementById('predictionAnalysis').innerHTML = analysis;
            }

            // Générer l'analyse de prédiction
            generatePredictionAnalysis(predictionData) {
                const sum = predictionData.numbers.reduce((a, b) => a + b, 0);
                const evenCount = predictionData.numbers.filter(n => n % 2 === 0).length;
                const avgGap = this.calculateAverageGap(predictionData.numbers);
                
                let analysis = `<strong>📊 Analyse de la Prédiction :</strong><br>`;
                
                analysis += `• <strong>Somme totale :</strong> ${sum} `;
                if (this.history.length > 0) {
                    const historicalAvg = this.history.reduce((acc, seq) => 
                        acc + seq.reduce((a, b) => a + b, 0), 0) / this.history.length;
                    const deviation = Math.abs(sum - historicalAvg);
                    if (deviation < 25) {
                        analysis += `<span style="color: #28a745;">✓ Proche de la moyenne (${Math.round(historicalAvg)})</span>`;
                    } else {
                        analysis += `<span style="color: #ffc107;">⚠ Écart notable de la moyenne (${Math.round(historicalAvg)})</span>`;
                    }
                }
                
                analysis += `<br>• <strong>Nombres pairs :</strong> ${evenCount}/5 `;
                if (evenCount === 2 || evenCount === 3) {
                    analysis += `<span style="color: #28a745;">✓ Distribution équilibrée</span>`;
                } else {
                    analysis += `<span style="color: #ffc107;">⚠ Distribution déséquilibrée</span>`;
                }
                
                analysis += `<br>• <strong>Écart moyen :</strong> ${avgGap.toFixed(1)} `;
                if (avgGap > 15 && avgGap < 25) {
                    analysis += `<span style="color: #28a745;">✓ Espacement optimal</span>`;
                } else {
                    analysis += `<span style="color: #17a2b8;">ℹ Espacement ${avgGap < 15 ? 'serré' : 'large'}</span>`;
                }
                
                analysis += `<br>• <strong>Confiance du modèle :</strong> ${Math.round(predictionData.confidence)}% `;
                if (predictionData.confidence > 70) {
                    analysis += `<span style="color: #28a745;">✓ Confiance élevée</span>`;
                } else if (predictionData.confidence > 40) {
                    analysis += `<span style="color: #ffc107;">⚠ Confiance modérée</span>`;
                } else {
                    analysis += `<span style="color: #dc3545;">⚠ Confiance faible - Plus de données nécessaires</span>`;
                }
                
                return analysis;
            }

            // Calculer l'écart moyen entre les nombres
            calculateAverageGap(numbers) {
                const sortedNumbers = [...numbers].sort((a, b) => a - b);
                let totalGap = 0;
                for (let i = 0; i < sortedNumbers.length - 1; i++) {
                    totalGap += sortedNumbers[i + 1] - sortedNumbers[i];
                }
                return totalGap / (sortedNumbers.length - 1);
            }

            // Mise à jour de l'affichage de l'historique
            updateHistoryDisplay() {
                const container = document.getElementById('historyContainer');
                
                if (this.history.length === 0 && this.predictions.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; color: #666; padding: 30px;">
                            <h3>📭 Aucun Historique</h3>
                            <p>Commencez par ajouter des données historiques ou générer une prédiction</p>
                        </div>
                    `;
                    return;
                }

                let html = '';
                
                // Afficher les prédictions avec leurs résultats
                const sortedPredictions = [...this.predictions].reverse();
                sortedPredictions.forEach((pred, index) => {
                    const isLatest = index === 0;
                    const date = pred.timestamp.toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    html += `
                        <div class="history-item" style="${isLatest ? 'border-left: 4px solid #667eea; background: linear-gradient(90deg, rgba(102, 126, 234, 0.05), white);' : ''}">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <strong style="color: #495057;">🔮 Prédiction ${isLatest ? '(Dernière)' : ''}</strong>
                                <small style="color: #6c757d;">${date}</small>
                            </div>
                            
                            <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                                ${pred.numbers.map(num => `
                                    <span style="display: inline-flex; align-items: center; justify-content: center; 
                                          width: 35px; height: 35px; background: linear-gradient(135deg, #10ac84, #00d2d3); 
                                          color: white; border-radius: 50%; font-weight: bold; font-size: 14px;">
                                        ${num}
                                    </span>
                                `).join('')}
                            </div>
                    `;
                    
                    if (pred.actual) {
                        html += `
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e9ecef;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                    <strong style="color: #495057;">✅ Résultat Réel</strong>
                                </div>
                                
                                <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                                    ${pred.actual.map(num => {
                                        const isMatch = pred.numbers.includes(num);
                                        return `
                                            <span style="display: inline-flex; align-items: center; justify-content: center; 
                                                  width: 35px; height: 35px; 
                                                  background: ${isMatch ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #6c757d, #495057)'}; 
                                                  color: white; border-radius: 50%; font-weight: bold; font-size: 14px;
                                                  ${isMatch ? 'box-shadow: 0 0 10px rgba(40, 167, 69, 0.3);' : ''}">
                                                ${num}
                                            </span>
                                        `;
                                    }).join('')}
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 0.9em; color: #6c757d;">
                                        Nombres corrects: <strong>${pred.matches ? pred.matches.length : 0}/5</strong>
                                    </span>
                                    <span class="${pred.accuracy >= 60 ? 'accuracy-high' : pred.accuracy >= 20 ? 'accuracy-medium' : 'accuracy-low'}" 
                                          style="padding: 4px 12px; border-radius: 15px; font-size: 0.8em; font-weight: bold;
                                                 background: ${pred.accuracy >= 60 ? 'rgba(40, 167, 69, 0.1)' : pred.accuracy >= 20 ? 'rgba(243, 156, 18, 0.1)' : 'rgba(220, 53, 69, 0.1)'};">
                                        ${pred.accuracy}% de précision
                                    </span>
                                </div>
                            </div>
                        `;
                    } else if (isLatest) {
                        html += `
                            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 10px; margin-top: 10px;">
                                <small style="color: #856404;">
                                    ⏳ En attente du résultat réel pour évaluer cette prédiction
                                </small>
                            </div>
                        `;
                    }
                    
                    html += '</div>';
                });

                // Afficher quelques données historiques récentes
                const recentHistory = this.history.slice(-3).reverse();
                if (recentHistory.length > 0) {
                    html += `
                        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
                            <h4 style="color: #495057; margin-bottom: 15px;">📚 Données Historiques Récentes</h4>
                    `;
                    
                    recentHistory.forEach((seq, index) => {
                        html += `
                            <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px;">
                                <span style="margin-right: 15px; color: #6c757d; font-size: 0.9em; min-width: 120px;">
                                    Séquence ${this.history.length - index}
                                </span>
                                <div style="display: flex; gap: 6px;">
                                    ${seq.map(num => `
                                        <span style="display: inline-flex; align-items: center; justify-content: center; 
                                              width: 30px; height: 30px; background: linear-gradient(135deg, #6c757d, #495057); 
                                              color: white; border-radius: 50%; font-weight: bold; font-size: 12px;">
                                            ${num}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    });
                    
                    html += '</div>';
                }

                container.innerHTML = html;
            }

            // Réinitialiser le modèle
            reset() {
                this.history = [];
                this.predictions = [];
                this.numberFrequency = {};
                this.patterns = {
                    gaps: {},
                    sums: {},
                    evenOdd: {},
                    positions: {},
                    sequences: {}
                };
                this.neuralWeights = this.initializeWeights();
                this.totalPredictions = 0;
                this.correctPredictions = 0;
                this.confidenceScore = 0;
                
                localStorage.removeItem('aiPredictionData');
                this.updateUI();
            }
        }

        // Instance globale de l'IA avancée
        const ai = new AdvancedNumberPredictionAI();

        // Système de notifications toast
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>${type === 'success' ? '✅' : '❌'}</span>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Animation d'entrée
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Animation de sortie
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }

        // Fonctions pour l'interface utilisateur
        function loadHistoricalData() {
            const data = document.getElementById('historicalData').value.trim();
            if (!data) {
                showToast('Veuillez saisir des données historiques.', 'error');
                return;
            }

            try {
                const lines = data.split('\n').filter(line => line.trim());
                const sequences = [];
                
                lines.forEach((line, index) => {
                    const numbers = line.split(',').map(n => {
                        const num = parseInt(n.trim());
                        if (isNaN(num)) {
                            throw new Error(`Nombre invalide "${n.trim()}" à la ligne ${index + 1}`);
                        }
                        return num;
                    });
                    
                    if (numbers.length !== 5) {
                        throw new Error(`La ligne ${index + 1} doit contenir exactement 5 nombres`);
                    }
                    
                    sequences.push(numbers);
                });

                const validCount = ai.addHistoricalData(sequences);
                document.getElementById('historicalData').value = '';
                
                if (validCount === sequences.length) {
                    showToast(`✅ ${validCount} séquence(s) chargée(s) avec succès !`);
                } else {
                    showToast(`⚠️ ${validCount}/${sequences.length} séquence(s) valide(s) chargée(s)`, 'error');
                }
                
            } catch (error) {
                showToast(`Erreur : ${error.message}`, 'error');
            }
        }

        function addNewResult() {
            const input = document.getElementById('newResult').value.trim();
            if (!input) {
                showToast('Veuillez saisir un résultat.', 'error');
                return;
            }

            try {
                const numbers = input.split(',').map(n => {
                    const num = parseInt(n.trim());
                    if (isNaN(num)) {
                        throw new Error(`"${n.trim()}" n'est pas un nombre valide`);
                    }
                    return num;
                });
                
                const result = ai.addResult(numbers);
                document.getElementById('newResult').value = '';
                showToast('🎯 Résultat ajouté ! Le modèle a appris de cette nouvelle donnée.');
                
            } catch (error) {
                showToast(`Erreur : ${error.message}`, 'error');
            }
        }

        function makePrediction() {
            try {
                const predictionData = ai.makePrediction();
                const numbers = predictionData.numbers.join(', ');
                const confidence = Math.round(predictionData.confidence);
                
                showToast(`🔮 Nouvelle prédiction : ${numbers} (Confiance: ${confidence}%)`);
                
            } catch (error) {
                showToast(`Erreur : ${error.message}`, 'error');
            }
        }

        function generateSampleData() {
            try {
                const sampleData = ai.generateSampleData(15);
                showToast(`🎲 ${sampleData.length} séquences de test générées !`);
                
                // Afficher les données générées dans le textarea
                const dataText = sampleData.map(seq => seq.join(',')).join('\n');
                document.getElementById('historicalData').value = dataText;
                
            } catch (error) {
                showToast(`Erreur : ${error.message}`, 'error');
            }
        }

        function resetModel() {
            if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser le modèle ?\n\nToutes les données et l\'apprentissage seront perdus définitivement.')) {
                ai.reset();
                showToast('🔄 Modèle réinitialisé avec succès !');
            }
        }

        // Fonctions utilitaires pour l'interface
        function exportData() {
            try {
                const data = {
                    exported_at: new Date().toISOString(),
                    history: ai.history,
                    predictions: ai.predictions.map(p => ({
                        ...p,
                        timestamp: p.timestamp.toISOString()
                    })),
                    stats: ai.getComprehensiveStats()
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `ia-prediction-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                
                URL.revokeObjectURL(url);
                showToast('📁 Données exportées avec succès !');
                
            } catch (error) {
                showToast(`Erreur d'export : ${error.message}`, 'error');
            }
        }

        function shareResults() {
            if (ai.predictions.length === 0) {
                showToast('Aucune prédiction à partager.', 'error');
                return;
            }
            
            const lastPrediction = ai.predictions[ai.predictions.length - 1];
            const stats = ai.getComprehensiveStats();
            
            const shareText = `🧠 IA Prédiction de Nombres
            
🎯 Dernière prédiction : ${lastPrediction.numbers.join(', ')}
📊 Précision du modèle : ${stats.accuracy}%
🔬 Confiance : ${stats.confidence}%
📈 Basé sur ${stats.dataPoints} séquences d'analyse

Généré par IA Prédiction App`;

            if (navigator.share) {
                navigator.share({
                    title: 'IA Prédiction de Nombres',
                    text: shareText
                }).then(() => {
                    showToast('✅ Partagé avec succès !');
                }).catch(() => {
                    // Fallback vers le clipboard
                    copyToClipboard(shareText);
                });
            } else {
                copyToClipboard(shareText);
            }
        }

        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('📋 Copié dans le presse-papiers !');
                }).catch(() => {
                    showToast('Impossible de copier automatiquement.', 'error');
                });
            } else {
                // Fallback pour les navigateurs plus anciens
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast('📋 Copié dans le presse-papiers !');
                } catch (err) {
                    showToast('Impossible de copier.', 'error');
                }
                document.body.removeChild(textArea);
            }
        }

        // Initialisation de l'application
        window.addEventListener('load', () => {
            // Initialiser l'interface
            ai.updateUI();
            
            // Générer une première prédiction si pas de données
            if (ai.history.length === 0) {
                setTimeout(() => {
                    ai.makePrediction();
                    showToast('👋 Bienvenue ! Une première prédiction a été générée.', 'success');
                }, 1000);
            }
            
            // Ajouter des boutons supplémentaires
            addExtraButtons();
        });

        // Ajouter des boutons supplémentaires à l'interface
        function addExtraButtons() {
            const buttonContainer = document.querySelector('.input-group:last-child');
            
            // Bouton d'export
            const exportBtn = document.createElement('button');
            exportBtn.innerHTML = '📁 Exporter Données';
            exportBtn.onclick = exportData;
            exportBtn.className = 'btn-secondary';
            exportBtn.style.background = 'linear-gradient(135deg, #6c757d, #495057)';
            buttonContainer.appendChild(exportBtn);
            
            // Bouton de partage
            const shareBtn = document.createElement('button');
            shareBtn.innerHTML = '🔗 Partager Résultats';
            shareBtn.onclick = shareResults;
            shareBtn.className = 'btn-secondary';
            shareBtn.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
            buttonContainer.appendChild(shareBtn);
        }

        // Gestion des raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        makePrediction();
                        break;
                    case 's':
                        e.preventDefault();
                        exportData();
                        break;
                    case 'r':
                        e.preventDefault();
                        if (e.shiftKey) {
                            resetModel();
                        }
                        break;
                }
            }
        });

        // Gestion de l'état PWA
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            
            // Afficher une notification pour installer l'app
            const installToast = document.createElement('div');
            installToast.className = 'toast';
            installToast.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            installToast.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                    <span>📱 Installer cette app sur votre appareil ?</span>
                    <button onclick="this.parentElement.parentElement.click(); this.parentElement.parentElement.remove();" 
                            style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                                   color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Installer
                    </button>
                </div>
            `;
            
            installToast.addEventListener('click', () => {
                e.prompt();
                e.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        showToast('✅ Application installée !');
                    }
                });
                document.body.removeChild(installToast);
            });
            
            document.body.appendChild(installToast);
            setTimeout(() => installToast.classList.add('show'), 100);
            
            // Auto-hide après 10 secondes
            setTimeout(() => {
                if (document.body.contains(installToast)) {
                    installToast.classList.remove('show');
                    setTimeout(() => {
                        if (document.body.contains(installToast)) {
                            document.body.removeChild(installToast);
                        }
                    }, 300);
                }
            }, 10000);
        });

        // Gestion de la mise à jour de l'app
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                showToast('🔄 Application mise à jour ! Rechargez pour voir les nouveautés.');
            });
        }

        // Auto-sauvegarde périodique
        setInterval(() => {
            ai.saveToStorage();
        }, 30000); // Sauvegarde toutes les