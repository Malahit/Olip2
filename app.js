const app = {
    currentQuestionIndex: 0,
    user: {
        points: 0,
        achievements: [],
        progress: { botany: 0, zoology: 0 }
    },
    
    init() {
        this.loadProgress();
        this.renderProgress();
        this.renderQuestion();
    },
    
    loadProgress() {
        const saved = localStorage.getItem('bioProgress');
        if (saved) this.user = JSON.parse(saved);
    },
    
    saveProgress() {
        localStorage.setItem('bioProgress', JSON.stringify(this.user));
    },
    
    renderProgress() {
        document.getElementById('points').textContent = this.user.points;
        document.getElementById('achievements').innerHTML = this.user.achievements.join(', ');
        
        Object.entries(this.user.progress).forEach(([topic, value]) => {
            const bar = document.getElementById(`${topic}-bar`);
            if (bar) {
                bar.style.width = `${value}%`;
                bar.textContent = `${value}%`;
            }
        });
    },
    
    renderQuestion() {
        const question = questions[this.currentQuestionIndex];
        const container = document.getElementById('task-container');
        container.innerHTML = `
            <div class="question-card">
                <p class="question-text">${question.text}</p>
                <div class="options">
                    ${question.options.map((option, i) => `
                        <label class="option">
                            <input type="radio" name="answer" value="${i}">
                            ${option}
                        </label>
                    `).join('')}
                </div>
                <button onclick="app.checkAnswer()">Проверить</button>
            </div>
        `;
    },
    
    checkAnswer() {
        const question = questions[this.currentQuestionIndex];
        const selected = document.querySelector('input[name="answer"]:checked');
        
        if (!selected) {
            alert('Выберите вариант ответа!');
            return;
        }
        
        const selectedIndex = parseInt(selected.value);
        
        if (selectedIndex === question.correct) {
            this.user.points += 10;
            this.user.progress[question.topic] += 5;
            this.showConfetti();
            this.playSound('success.mp3');
        } else {
            alert(`Неправильно! Правильный ответ: ${question.options[question.correct]}`);
            this.playSound('error.mp3');
        }
        
        this.saveProgress();
        this.renderProgress();
        this.checkAchievements();
    },
    
    nextQuestion() {
        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % questions.length;
        this.renderQuestion();
    },
    
    checkAchievements() {
        const achievements = {
            100: "Начинающий биолог 🌱",
            500: "Эксперт по растениям 🌿",
            1000: "Профессор биологии 🧪"
        };
        
        for (const points in achievements) {
            if (this.user.points >= points && 
                !this.user.achievements.includes(achievements[points])) {
                this.user.achievements.push(achievements[points]);
                alert(`🏆 Новое достижение: ${achievements[points]}`);
            }
        }
    },
    
    playSound(file) {
        const audio = new Audio(`assets/sounds/${file}`);
        audio.play();
    },
    
    showConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 100 + '%';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
