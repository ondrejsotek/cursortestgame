class Building {
    constructor(name, baseCost, baseProduction, type) {
        this.name = name;
        this.baseCost = baseCost;
        this.baseProduction = baseProduction;
        this.type = type;
        this.level = 0;
    }

    getCost() {
        return Math.floor(this.baseCost * Math.pow(1.15, this.level));
    }

    getProduction(multiplier) {
        return this.baseProduction * this.level * multiplier;
    }
}

class ShopItem {
    constructor(name, cost, multiplier, description, iconName) {
        this.name = name;
        this.cost = cost;
        this.multiplier = multiplier;
        this.description = description;
        this.iconName = iconName;
        this.owned = false;
    }
}

class Game {
    constructor() {
        this.gold = 100;
        this.clickValue = 1;
        this.incomeProgress = 0;
        this.multiplier = 1.0;
        this.upgradeTimer = null;
        this.remainingFlowers = 10;
        this.isGameOver = false;
        this.isPaused = false;
        this.updateInterval = null;
        this.checkUpgradeInterval = null;
        this.isGameStarted = false;
        this.score = 0;
        this.lastUpdate = Date.now();
        
        this.buildings = [
            new Building('House', 10, 1, 'house'),
            new Building('Farm', 50, 2, 'farm'),
            new Building('Mine', 200, 5, 'mine'),
            new Building('Factory', 1000, 10, 'factory'),
            new Building('Bank', 5000, 50, 'bank')
        ];

        this.shopItems = [
            new ShopItem('Basic Tools', 500, 1.5, 'Simple tools to improve production', 'basic_tools'),
            new ShopItem('Advanced Machinery', 2000, 2.0, 'Modern machines boost efficiency', 'advanced_machinery'),
            new ShopItem('Automation System', 5000, 3.0, 'Automated processes increase output', 'automation'),
            new ShopItem('AI Management', 10000, 4.0, 'AI-driven optimization maximizes production', 'ai_management'),
            new ShopItem('Quantum Enhancement', 50000, 10.0, 'Quantum technology revolutionizes production', 'quantum')
        ];

        this.showWelcomePopup();
    }

    showWelcomePopup() {
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'welcome-popup';
        
        // Create flower lives display
        const flowerLives = document.createElement('div');
        flowerLives.className = 'flower-lives';
        for (let i = 0; i < 10; i++) {
            const flower = document.createElement('div');
            flower.className = 'flower-icon';
            flowerLives.appendChild(flower);
        }

        popup.innerHTML = `
            <h2>Welcome to the Medieval Clicker Game!</h2>
            <div class="instructions">
                <h3>How to Play:</h3>
                <ul>
                    <li>Build and upgrade buildings to generate gold income</li>
                    <li>Each building generates different amounts of gold per second</li>
                    <li>When you have enough gold to upgrade a building, you have 7 seconds to do so</li>
                    <li>If you don't upgrade in time, you'll lose a flower</li>
                    <li>Losing all flowers will end the game</li>
                    <li>Buy items from the shop to increase your production multiplier</li>
                    <li>Use the pause button if you need a break</li>
                    <li>Your score increases with each building upgrade!</li>
                </ul>
            </div>
            <p>You have 10 flowers to protect:</p>
        `;
        
        popup.appendChild(flowerLives);
        
        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.textContent = 'Start Game';
        startButton.addEventListener('click', () => {
            overlay.remove();
            this.startGame();
        });
        
        popup.appendChild(startButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    startGame() {
        this.isGameStarted = true;
        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        this.setupBuildingHandlers();
        this.createShopElements();
        this.updateDisplay();
        this.createFlowerOverlay();
        this.createPauseButton();
        
        this.updateInterval = setInterval(() => this.update(), 50);
        this.startUpgradeCheck();
    }

    createFlowerOverlay() {
        const townScene = document.querySelector('.town-scene');
        if (!townScene) {
            console.error('Town scene element not found');
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'flower-overlay';
        townScene.appendChild(overlay);
        
        // Create flower counter with 10 flower icons
        const flowerCounter = document.createElement('div');
        flowerCounter.className = 'flower-counter';
        
        // Add 10 flower icons
        for (let i = 0; i < 10; i++) {
            const flowerIcon = document.createElement('div');
            flowerIcon.className = 'flower-icon';
            flowerCounter.appendChild(flowerIcon);
        }
        
        overlay.appendChild(flowerCounter);
    }

    createPauseButton() {
        const townScene = document.querySelector('.town-scene');
        if (!townScene) return;

        // Create pause button
        const pauseButton = document.createElement('button');
        pauseButton.className = 'pause-button';
        pauseButton.innerHTML = '<div class="icon"></div> Pause';
        pauseButton.addEventListener('click', () => this.togglePause());
        townScene.appendChild(pauseButton);

        // Create pause overlay
        const pauseOverlay = document.createElement('div');
        pauseOverlay.className = 'pause-overlay';
        
        const pauseMessage = document.createElement('div');
        pauseMessage.className = 'pause-message';
        pauseMessage.textContent = 'Game Paused';
        
        pauseOverlay.appendChild(pauseMessage);
        townScene.appendChild(pauseOverlay);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        // Update button appearance
        const pauseButton = document.querySelector('.pause-button');
        if (pauseButton) {
            pauseButton.innerHTML = `<div class="icon"></div> ${this.isPaused ? 'Resume' : 'Pause'}`;
            pauseButton.classList.toggle('paused', this.isPaused);
        }

        // Show/hide pause overlay
        const pauseOverlay = document.querySelector('.pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.classList.toggle('active', this.isPaused);
        }

        if (this.isPaused) {
            // Store the remaining time on the upgrade timer if it exists
            if (this.upgradeTimer !== null) {
                const timeLeft = this.upgradeTimer._idleTimeout - (Date.now() - this.upgradeTimer._idleStart);
                clearTimeout(this.upgradeTimer);
                this.upgradeTimer = { 
                    timeLeft: timeLeft,
                    isPaused: true
                };
            }
            // Clear intervals
            if (this.checkUpgradeInterval) {
                clearInterval(this.checkUpgradeInterval);
            }
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        } else {
            // Update the last update time to prevent gold accumulation during pause
            this.lastUpdate = Date.now();
            
            // Restore the upgrade timer if it was paused
            if (this.upgradeTimer && this.upgradeTimer.isPaused) {
                const timeLeft = this.upgradeTimer.timeLeft;
                this.upgradeTimer = setTimeout(() => {
                    this.removeFlower();
                    this.upgradeTimer = null;
                    if (!this.isGameOver && !this.isPaused) {
                        this.checkForUpgrade();
                    }
                }, timeLeft);
            }
            // Restart intervals
            this.startUpgradeCheck();
            this.updateInterval = setInterval(() => this.update(), 50);
        }
    }

    startUpgradeCheck() {
        const checkForUpgrade = () => {
            if (this.isGameOver || this.isPaused || !this.isGameStarted) return;

            let canUpgradeAny = false;
            this.buildings.forEach((building, index) => {
                const cost = building.getCost();
                if (this.gold >= cost) {
                    canUpgradeAny = true;
                }
            });

            if (canUpgradeAny) {
                if (this.upgradeTimer === null) {
                    // First create warning state after 2 seconds
                    setTimeout(() => {
                        if (this.upgradeTimer === null && !this.isPaused) {
                            this.buildings.forEach((building, index) => {
                                const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
                                if (buildingElement && this.gold >= building.getCost()) {
                                    buildingElement.classList.add('warning');
                                    this.createCountdownBar(buildingElement);
                                }
                            });
                            
                            // Then start the 5-second timer for flower removal
                            this.upgradeTimer = setTimeout(() => {
                                this.removeFlower();
                                this.upgradeTimer = null;
                                document.querySelectorAll('.countdown-container').forEach(container => {
                                    container.remove();
                                });
                                if (!this.isGameOver && !this.isPaused) {
                                    checkForUpgrade();
                                }
                            }, 5000);
                        }
                    }, 2000);
                }
            } else if (this.upgradeTimer !== null && !this.upgradeTimer.isPaused) {
                clearTimeout(this.upgradeTimer);
                this.upgradeTimer = null;
                document.querySelectorAll('.building.warning').forEach(el => {
                    el.classList.remove('warning');
                });
                document.querySelectorAll('.countdown-container').forEach(container => {
                    container.remove();
                });
            }
        };

        // Start checking
        this.checkUpgradeInterval = setInterval(checkForUpgrade, 1000);
    }

    createCountdownBar(buildingElement) {
        // Remove existing countdown bar if any
        const existingContainer = buildingElement.querySelector('.countdown-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create new countdown bar
        const container = document.createElement('div');
        container.className = 'countdown-container';
        
        const bar = document.createElement('div');
        bar.className = 'countdown-bar';
        
        container.appendChild(bar);
        buildingElement.appendChild(container);

        // Start the animation
        setTimeout(() => {
            container.classList.add('active');
        }, 10);

        // Remove the bar when animation ends
        bar.addEventListener('animationend', () => {
            container.remove();
        });
    }

    removeFlower() {
        if (this.remainingFlowers <= 0) return;

        const overlay = document.querySelector('.flower-overlay');
        if (!overlay) return;

        // Get the flower icon that will be lost
        const flowerCounter = overlay.querySelector('.flower-counter');
        const flowerIcons = flowerCounter.querySelectorAll('.flower-icon');
        const flowerToLose = flowerIcons[this.remainingFlowers - 1];
        
        // Create withering animation at the flower's position
        const flowerRect = flowerToLose.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        
        const witheringFlower = document.createElement('div');
        witheringFlower.className = 'withering-flower';
        witheringFlower.style.left = `${flowerRect.left - overlayRect.left}px`;
        witheringFlower.style.top = `${flowerRect.top - overlayRect.top}px`;
        overlay.appendChild(witheringFlower);

        // Mark the flower as lost
        flowerToLose.classList.add('lost');

        this.remainingFlowers--;

        // Animate and remove withering effect
        setTimeout(() => {
            witheringFlower.remove();
        }, 1000);

        if (this.remainingFlowers <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        clearTimeout(this.upgradeTimer);
        this.upgradeTimer = null;

        // Create game over overlay
        const gameOverlay = document.createElement('div');
        gameOverlay.className = 'game-over';
        gameOverlay.innerHTML = `
            <div class="game-over-content">
                <h2>Game Over</h2>
                <p>All flowers have withered away...</p>
                <p>Final Score: ${this.score} clicks</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
        document.body.appendChild(gameOverlay);
    }

    collectGold() {
        // Remove or comment out the unused collectGold method
    }

    setupBuildingHandlers() {
        this.buildings.forEach((building, index) => {
            const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
            if (buildingElement) {
                buildingElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!buildingElement.classList.contains('disabled')) {
                        this.upgradeBuilding(index);
                    }
                });
            }
        });
    }

    createShopElements() {
        const shopItems = document.querySelector('.shop-items');
        shopItems.innerHTML = '';
        
        this.shopItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            if (item.owned) itemElement.classList.add('owned');
            
            itemElement.innerHTML = `
                <img src="images/${item.iconName}.png" class="shop-item-icon" alt="${item.name} icon">
                <div class="shop-item-content">
                    <h3>${item.name}</h3>
                    <div class="description">${item.description}</div>
                    <div class="effect">Production Multiplier: x${item.multiplier.toFixed(1)}</div>
                    <div class="cost">${item.owned ? 'Owned' : `Cost: ${item.cost} gold`}</div>
                </div>
            `;
            
            if (!item.owned) {
                itemElement.addEventListener('click', () => this.purchaseShopItem(index));
            }
            
            shopItems.appendChild(itemElement);
        });
    }

    purchaseShopItem(index) {
        const item = this.shopItems[index];
        if (this.gold >= item.cost && !item.owned) {
            this.gold -= item.cost;
            item.owned = true;
            this.updateMultiplier();
            this.createShopElements();
            this.updateDisplay();
        }
    }

    updateMultiplier() {
        let newMultiplier = 1.0;
        this.shopItems.forEach(item => {
            if (item.owned) {
                newMultiplier = Math.max(newMultiplier, item.multiplier);
            }
        });
        this.multiplier = newMultiplier;
    }

    upgradeBuilding(index) {
        if (this.isGameOver) return;

        const building = this.buildings[index];
        const cost = building.getCost();
        
        if (this.gold >= cost) {
            this.gold -= cost;
            building.level++;
            this.score++; // Increment score for each successful upgrade
            
            const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
            if (buildingElement) {
                buildingElement.style.animation = 'upgrade-flash 0.5s';
                buildingElement.classList.remove('warning');
                
                // Remove countdown bar if exists
                const countdownContainer = buildingElement.querySelector('.countdown-container');
                if (countdownContainer) {
                    countdownContainer.remove();
                }
                
                // Create score popup
                this.showScorePopup(buildingElement, this.score);
                
                setTimeout(() => {
                    buildingElement.style.animation = '';
                }, 500);
            }

            // Reset upgrade timer and clear all warnings
            if (this.upgradeTimer !== null) {
                clearTimeout(this.upgradeTimer);
                this.upgradeTimer = null;
                document.querySelectorAll('.building.warning').forEach(el => {
                    el.classList.remove('warning');
                });
                document.querySelectorAll('.countdown-container').forEach(container => {
                    container.remove();
                });
            }
            
            this.updateDisplay();
        }
    }

    showScorePopup(buildingElement, score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+1`;
        
        // Position the popup above the building
        const rect = buildingElement.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top}px`;
        
        document.body.appendChild(popup);
        
        // Remove the popup after animation
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    update() {
        if (this.isPaused || this.isGameOver || !this.isGameStarted) return;

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdate) / 1000;
        this.lastUpdate = currentTime;

        let income = 0;
        this.buildings.forEach(building => {
            income += building.getProduction(this.multiplier);
        });

        this.gold += income * deltaTime;
        this.incomeProgress = (this.incomeProgress + (deltaTime * 100)) % 100;
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('gold').textContent = Math.floor(this.gold);
        document.getElementById('multiplier').textContent = this.multiplier.toFixed(1);
        document.getElementById('score').textContent = this.score;
        
        let totalIncome = 0;
        this.buildings.forEach(building => {
            totalIncome += building.getProduction(this.multiplier);
        });
        document.getElementById('income').textContent = totalIncome.toFixed(1);
        
        const progressBar = document.querySelector('.income-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.incomeProgress}%`;
        }

        // Update building tooltips and states
        this.buildings.forEach((building, index) => {
            const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
            if (buildingElement) {
                const cost = building.getCost();
                
                buildingElement.querySelector('.level-value').textContent = building.level;
                buildingElement.querySelector('.production-value').textContent = 
                    building.getProduction(this.multiplier).toFixed(1);
                buildingElement.querySelector('.cost-value').textContent = cost;
                
                if (this.gold < cost) {
                    buildingElement.classList.add('disabled');
                } else {
                    buildingElement.classList.remove('disabled');
                }
            }
        });

        // Update shop items disabled state
        const shopItemElements = document.querySelectorAll('.shop-item');
        this.shopItems.forEach((item, index) => {
            if (!item.owned && shopItemElements[index]) {
                if (this.gold < item.cost) {
                    shopItemElements[index].classList.add('disabled');
                } else {
                    shopItemElements[index].classList.remove('disabled');
                }
            }
        });
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 