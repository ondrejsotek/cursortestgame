class Building {
    constructor(name, baseCost, baseProduction, iconClass) {
        this.name = name;
        this.baseCost = baseCost;
        this.baseProduction = baseProduction;
        this.iconClass = iconClass;
        this.level = 0;
    }

    getCost() {
        return Math.floor(this.baseCost * Math.pow(1.15, this.level));
    }

    getProduction() {
        return this.baseProduction * this.level;
    }
}

class Game {
    constructor() {
        this.gold = 100; // Changed to start with 100 gold
        this.clickValue = 1;
        this.incomeProgress = 0; // Track progress towards next income tick
        this.buildings = [
            new Building('House', 10, 1, 'house'),
            new Building('Farm', 50, 2, 'farm'),
            new Building('Mine', 200, 3, 'mine'),
            new Building('Factory', 1000, 10, 'factory'),
            new Building('Bank', 5000, 50, 'bank')
        ];
        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        this.createBuildingElements();
        this.updateDisplay();
        
        document.querySelector('.game-container').addEventListener('click', (e) => {
            if (e.target === document.querySelector('.game-container')) {
                this.collectGold();
            }
        });
        
        setInterval(() => this.update(), 50); // Updated to 50ms for smoother progress bar
    }

    collectGold() {
        this.gold += this.clickValue;
        this.updateDisplay();
        
        const floatingNumber = document.createElement('div');
        floatingNumber.textContent = `+${this.clickValue}`;
        floatingNumber.style.position = 'absolute';
        floatingNumber.style.left = event.clientX + 'px';
        floatingNumber.style.top = event.clientY + 'px';
        floatingNumber.style.color = '#27ae60';
        floatingNumber.style.pointerEvents = 'none';
        floatingNumber.style.animation = 'float-up 1s ease-out';
        document.body.appendChild(floatingNumber);
        
        setTimeout(() => {
            document.body.removeChild(floatingNumber);
        }, 1000);
    }

    createBuildingElements() {
        const buildingsGrid = document.querySelector('.buildings-grid');
        buildingsGrid.innerHTML = '';
        
        this.buildings.forEach((building, index) => {
            const buildingElement = document.createElement('div');
            buildingElement.className = 'building';
            buildingElement.innerHTML = `
                <div class="building-icon ${building.iconClass}"></div>
                <h2>${building.name}</h2>
                <div class="level">Level: <span class="level-value">0</span></div>
                <div class="production">Production: <span class="production-value">0</span>/s</div>
                <div class="cost">Cost: <span class="cost-value">${building.getCost()}</span> gold</div>
            `;
            
            buildingElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!buildingElement.classList.contains('disabled')) {
                    this.upgradeBuilding(index);
                }
            });
            
            buildingsGrid.appendChild(buildingElement);
        });
    }

    upgradeBuilding(index) {
        const building = this.buildings[index];
        const cost = building.getCost();
        
        if (this.gold >= cost) {
            this.gold -= cost;
            building.level++;
            
            const buildingElement = document.querySelectorAll('.building')[index];
            buildingElement.style.animation = 'upgrade-flash 0.5s';
            setTimeout(() => {
                buildingElement.style.animation = '';
            }, 500);
            
            this.updateDisplay();
        } else {
            const buildingElement = document.querySelectorAll('.building')[index];
            buildingElement.style.animation = 'insufficient-funds 0.5s';
            setTimeout(() => {
                buildingElement.style.animation = '';
            }, 500);
        }
    }

    update() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdate) / 1000;
        this.lastUpdate = currentTime;

        let income = 0;
        this.buildings.forEach(building => {
            income += building.getProduction();
        });

        this.gold += income * deltaTime;
        
        // Update progress bar
        this.incomeProgress = (this.incomeProgress + (deltaTime * 100)) % 100;
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('gold').textContent = Math.floor(this.gold);
        
        let totalIncome = 0;
        this.buildings.forEach(building => {
            totalIncome += building.getProduction();
        });
        document.getElementById('income').textContent = totalIncome.toFixed(1);
        
        // Update progress bar
        const progressBar = document.querySelector('.income-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.incomeProgress}%`;
        }

        const buildingElements = document.querySelectorAll('.building');
        this.buildings.forEach((building, index) => {
            const element = buildingElements[index];
            const cost = building.getCost();
            
            // Update building information
            element.querySelector('.level-value').textContent = building.level;
            element.querySelector('.production-value').textContent = building.getProduction().toFixed(1);
            element.querySelector('.cost-value').textContent = cost;
            
            // Update disabled state
            if (this.gold < cost) {
                element.classList.add('disabled');
            } else {
                element.classList.remove('disabled');
            }
        });
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 