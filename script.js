class HitAndBlowGame {
    constructor() {
        this.targetNumber = '';
        this.attempts = 0;
        this.gameHistory = [];
        this.currentLanguage = 'ja';
        this.isGameWon = false;
        
        this.translations = {
            ja: {
                title: 'Hit & Blow',
                description: '4桁の数字を当ててください！',
                attemptsLabel: '試行回数:',
                hitLabel: 'Hit: 数字と位置が正しい',
                blowLabel: 'Blow: 数字は正しいが位置が違う',
                submitBtn: '送信',
                clearBtn: 'クリア',
                newGameBtn: '新しいゲーム',
                congratulations: 'おめでとうございます！',
                winMessage: '正解です！',
                invalidInput: '4桁の異なる数字を入力してください',
                duplicateNumbers: '同じ数字は使用できません'
            },
            en: {
                title: 'Hit & Blow',
                description: 'Guess the 4-digit number!',
                attemptsLabel: 'Attempts:',
                hitLabel: 'Hit: Correct number and position',
                blowLabel: 'Blow: Correct number, wrong position',
                submitBtn: 'Submit',
                clearBtn: 'Clear',
                newGameBtn: 'New Game',
                congratulations: 'Congratulations!',
                winMessage: 'You got it right!',
                invalidInput: 'Please enter 4 different digits',
                duplicateNumbers: 'Duplicate numbers are not allowed'
            }
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateLanguage();
    }
    
    initializeGame() {
        this.generateTargetNumber();
        this.attempts = 0;
        this.gameHistory = [];
        this.isGameWon = false;
        this.updateAttemptsDisplay();
        this.clearHistory();
        this.hideCelebration();
        document.getElementById('guess-input').value = '';
        document.getElementById('submit-btn').disabled = false;
    }
    
    generateTargetNumber() {
        const digits = [];
        while (digits.length < 4) {
            const digit = Math.floor(Math.random() * 10);
            if (!digits.includes(digit)) {
                digits.push(digit);
            }
        }
        this.targetNumber = digits.join('');
        console.log('Target number (for debugging):', this.targetNumber);
    }
    
    setupEventListeners() {
        // 言語切り替え
        document.getElementById('lang-ja').addEventListener('click', () => {
            this.currentLanguage = 'ja';
            this.updateLanguage();
        });
        
        document.getElementById('lang-en').addEventListener('click', () => {
            this.currentLanguage = 'en';
            this.updateLanguage();
        });
        
        // 送信ボタン
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitGuess();
        });
        
        // 入力フィールドでのEnterキー
        document.getElementById('guess-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });
        
        // 入力フィールドの制限
        document.getElementById('guess-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        });
        
        // 数字ボタン
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addDigit(btn.dataset.num);
            });
        });
        
        // クリアボタン
        document.getElementById('clear-btn').addEventListener('click', () => {
            document.getElementById('guess-input').value = '';
        });
        
        // バックスペースボタン
        document.getElementById('backspace-btn').addEventListener('click', () => {
            const input = document.getElementById('guess-input');
            input.value = input.value.slice(0, -1);
        });
        
        // 新しいゲームボタン
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.initializeGame();
        });
        
        // お祝い画面のクリックで閉じる
        document.getElementById('celebration').addEventListener('click', () => {
            this.hideCelebration();
        });
    }
    
    addDigit(digit) {
        const input = document.getElementById('guess-input');
        if (input.value.length < 4) {
            input.value += digit;
        }
    }
    
    submitGuess() {
        if (this.isGameWon) return;
        
        const guess = document.getElementById('guess-input').value;
        
        if (!this.isValidGuess(guess)) {
            alert(this.translations[this.currentLanguage].invalidInput);
            return;
        }
        
        if (this.hasDuplicateDigits(guess)) {
            alert(this.translations[this.currentLanguage].duplicateNumbers);
            return;
        }
        
        this.attempts++;
        const result = this.calculateHitAndBlow(guess);
        
        this.gameHistory.unshift({
            guess: guess,
            hit: result.hit,
            blow: result.blow,
            attempt: this.attempts
        });
        
        this.updateAttemptsDisplay();
        this.updateHistory();
        
        if (result.hit === 4) {
            this.isGameWon = true;
            document.getElementById('submit-btn').disabled = true;
            setTimeout(() => {
                this.showCelebration();
            }, 500);
        }
        
        document.getElementById('guess-input').value = '';
    }
    
    isValidGuess(guess) {
        return guess.length === 4 && /^\d{4}$/.test(guess);
    }
    
    hasDuplicateDigits(guess) {
        const digits = guess.split('');
        return new Set(digits).size !== digits.length;
    }
    
    calculateHitAndBlow(guess) {
        let hit = 0;
        let blow = 0;
        
        const targetDigits = this.targetNumber.split('');
        const guessDigits = guess.split('');
        
        // Hit の計算
        for (let i = 0; i < 4; i++) {
            if (targetDigits[i] === guessDigits[i]) {
                hit++;
            }
        }
        
        // Blow の計算
        for (let i = 0; i < 4; i++) {
            if (targetDigits[i] !== guessDigits[i] && targetDigits.includes(guessDigits[i])) {
                blow++;
            }
        }
        
        return { hit, blow };
    }
    
    updateAttemptsDisplay() {
        document.getElementById('attempts-count').textContent = this.attempts;
    }
    
    updateHistory() {
        const historyContainer = document.getElementById('history');
        historyContainer.innerHTML = '';
        
        this.gameHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="guess-number">${item.guess}</div>
                <div class="result">
                    <div class="hit-count">
                        <span class="hit-indicator">H</span>
                        ${item.hit}
                    </div>
                    <div class="blow-count">
                        <span class="blow-indicator">B</span>
                        ${item.blow}
                    </div>
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    clearHistory() {
        document.getElementById('history').innerHTML = '';
    }
    
    showCelebration() {
        document.getElementById('celebration').classList.remove('hidden');
        
        // 追加の紙吹雪エフェクト
        this.createConfettiEffect();
    }
    
    hideCelebration() {
        document.getElementById('celebration').classList.add('hidden');
    }
    
    createConfettiEffect() {
        const colors = ['#667eea', '#48bb78', '#ed8936', '#f56565', '#9f7aea'];
        const confettiContainer = document.querySelector('.confetti');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 100);
        }
    }
    
    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        // 言語ボタンの状態更新
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${this.currentLanguage}`).classList.add('active');
        
        // テキストの更新
        document.getElementById('title').textContent = t.title;
        document.getElementById('description').textContent = t.description;
        document.getElementById('attempts-label').textContent = t.attemptsLabel;
        document.getElementById('hit-label').textContent = t.hitLabel;
        document.getElementById('blow-label').textContent = t.blowLabel;
        document.getElementById('submit-btn').textContent = t.submitBtn;
        document.getElementById('clear-btn').textContent = t.clearBtn;
        document.getElementById('new-game-btn').textContent = t.newGameBtn;
        document.getElementById('congratulations').textContent = t.congratulations;
        document.getElementById('win-message').textContent = t.winMessage;
        
        // HTML lang属性の更新
        document.documentElement.lang = this.currentLanguage;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new HitAndBlowGame();
});
