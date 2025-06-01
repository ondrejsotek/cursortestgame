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
    constructor(name, cost, multiplier, description) {
        this.name = name;
        this.cost = cost;
        this.multiplier = multiplier;
        this.description = description;
        this.owned = false;
    }
}

class Game {
    constructor() {
        this.gold = 100;
        this.clickValue = 1;
        this.incomeProgress = 0;
        this.multiplier = 1.0;
        
        this.buildings = [
            new Building('House', 10, 1, 'house'),
            new Building('Farm', 50, 2, 'farm'),
            new Building('Mine', 200, 5, 'mine'),
            new Building('Factory', 1000, 10, 'factory'),
            new Building('Bank', 5000, 50, 'bank')
        ];

        this.shopItems = [
            new ShopItem('Basic Tools', 500, 1.5, 'Simple tools to improve production'),
            new ShopItem('Advanced Machinery', 2000, 2.0, 'Modern machines boost efficiency'),
            new ShopItem('Automation System', 5000, 3.0, 'Automated processes increase output'),
            new ShopItem('AI Management', 10000, 4.0, 'AI-driven optimization maximizes production'),
            new ShopItem('Quantum Enhancement', 50000, 10.0, 'Quantum technology revolutionizes production')
        ];

        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        this.setupBuildingHandlers();
        this.createShopElements();
        this.updateDisplay();
        
        setInterval(() => this.update(), 50);
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
                <h3>${item.name}</h3>
                <div class="description">${item.description}</div>
                <div class="effect">Production Multiplier: x${item.multiplier.toFixed(1)}</div>
                <div class="cost">${item.owned ? 'Owned' : `Cost: ${item.cost} gold`}</div>
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
        const building = this.buildings[index];
        const cost = building.getCost();
        
        if (this.gold >= cost) {
            this.gold -= cost;
            building.level++;
            
            const buildingElement = document.querySelector(`.building[data-type="${building.type}"]`);
            if (buildingElement) {
                buildingElement.style.animation = 'upgrade-flash 0.5s';
                setTimeout(() => {
                    buildingElement.style.animation = '';
                }, 500);
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