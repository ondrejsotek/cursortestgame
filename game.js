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
        this.flowerPositions = [];
        this.remainingFlowers = 0;
        this.isGameOver = false;
        
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

        this.lastUpdate = Date.now();
        this.loadFlowerPositions();
    }

    async loadFlowerPositions() {
        try {
            const response = await fetch('images/flower_positions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const positions = await response.json();
            if (!Array.isArray(positions)) {
                throw new Error('Invalid flower positions data format');
            }
            this.flowerPositions = positions;
            this.remainingFlowers = this.flowerPositions.length;
            console.log(`Loaded ${this.remainingFlowers} flower positions`);
            this.init();
        } catch (error) {
            console.error('Error loading flower positions:', error);
            // Initialize with default values if loading fails
            this.flowerPositions = [];
            this.remainingFlowers = 100; // Default number of flowers
            this.init();
        }
    }

    init() {
        this.setupBuildingHandlers();
        this.createShopElements();
        this.updateDisplay();
        this.createFlowerOverlay();
        
        setInterval(() => this.update(), 50);
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
        
        // Add visual indicator for remaining flowers
        const flowerCounter = document.createElement('div');
        flowerCounter.className = 'flower-counter';
        flowerCounter.textContent = `Flowers: ${this.remainingFlowers}`;
        overlay.appendChild(flowerCounter);
    }

    startUpgradeCheck() {
        const checkForUpgrade = () => {
            if (this.isGameOver) return;

            let canUpgradeAny = false;
            this.buildings.forEach((building, index) => {
                const cost = building.getCost();
                if (this.gold >= cost) {
                    canUpgradeAny = true;
                }
            });

            if (canUpgradeAny) {
                if (this.upgradeTimer === null) {
                    this.upgradeTimer = setTimeout(() => {
                        this.removeFlower();
                        this.upgradeTimer = null;
                        if (!this.isGameOver) {
                            checkForUpgrade();
                        }
                    }, 5000);

                    // Add warning animation to buildings that can be upgraded
                    this.buildings.forEach((building, index) => {
                        const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
                        if (buildingElement && this.gold >= building.getCost()) {
                            buildingElement.classList.add('warning');
                        }
                    });
                }
            } else if (this.upgradeTimer !== null) {
                clearTimeout(this.upgradeTimer);
                this.upgradeTimer = null;
                // Remove warning animation
                document.querySelectorAll('.building.warning').forEach(el => {
                    el.classList.remove('warning');
                });
            }
        };

        // Start checking
        setInterval(checkForUpgrade, 1000);
    }

    removeFlower() {
        if (this.remainingFlowers <= 0) return;

        const overlay = document.querySelector('.flower-overlay');
        if (!overlay) return;

        this.remainingFlowers--;
        
        // Update flower counter
        const counter = overlay.querySelector('.flower-counter');
        if (counter) {
            counter.textContent = `Flowers: ${this.remainingFlowers}`;
        }
        
        // Create withering flower effect
        let flowerPos;
        if (this.flowerPositions.length > 0) {
            flowerPos = this.flowerPositions[this.remainingFlowers];
        } else {
            // Generate random position if no predefined positions
            flowerPos = [
                Math.random() * overlay.offsetWidth,
                Math.random() * overlay.offsetHeight
            ];
        }
        
        const flower = document.createElement('div');
        flower.className = 'withering-flower';
        flower.style.left = `${flowerPos[0]}px`;
        flower.style.top = `${flowerPos[1]}px`;
        overlay.appendChild(flower);

        // Animate and remove
        setTimeout(() => {
            flower.remove();
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
            
            const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
            if (buildingElement) {
                buildingElement.style.animation = 'upgrade-flash 0.5s';
                buildingElement.classList.remove('warning');
                setTimeout(() => {
                    buildingElement.style.animation = '';
                }, 500);
            }

            // Reset upgrade timer
            if (this.upgradeTimer !== null) {
                clearTimeout(this.upgradeTimer);
                this.upgradeTimer = null;
            }
            
            this.updateDisplay();
        }
    }

    update() {
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