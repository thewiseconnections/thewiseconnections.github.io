(function () {
    const quizRoot = document.getElementById('career-quiz');
    if (!quizRoot) return;

    const contentBase = window.location.pathname.includes('/pages/') ? '../content/' : 'content/';

    let quizData = null;
    let currentQuestion = 0;
    let scores = {};

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    function initScores(careers) {
        scores = {};
        Object.keys(careers).forEach((id) => {
            scores[id] = 0;
        });
    }

    function renderIntro() {
        quizRoot.innerHTML = `
            <div class="quiz-card quiz-intro">
                <h2>${escapeHtml(quizData.title)}</h2>
                <p class="quiz-subtitle">${escapeHtml(quizData.subtitle)}</p>
                <p>${escapeHtml(quizData.intro)}</p>
                <p class="quiz-meta">${quizData.questions.length} questions · about 2 minutes</p>
                <button type="button" class="btn btn-quiz-primary" id="quiz-start">Start the quiz</button>
            </div>`;
        document.getElementById('quiz-start').addEventListener('click', () => {
            currentQuestion = 0;
            renderQuestion();
        });
    }

    function renderQuestion() {
        const q = quizData.questions[currentQuestion];
        const total = quizData.questions.length;
        const progress = Math.round(((currentQuestion) / total) * 100);

        const answersHtml = q.answers
            .map(
                (a, i) => `
            <button type="button" class="quiz-answer" data-answer-index="${i}">
                ${escapeHtml(a.text)}
            </button>`
            )
            .join('');

        quizRoot.innerHTML = `
            <div class="quiz-card">
                <div class="quiz-progress" aria-hidden="true">
                    <div class="quiz-progress-bar" style="width: ${progress}%"></div>
                </div>
                <p class="quiz-step">Question ${currentQuestion + 1} of ${total}</p>
                <h2 class="quiz-question">${escapeHtml(q.text)}</h2>
                <div class="quiz-answers" role="group" aria-label="Answer choices">
                    ${answersHtml}
                </div>
            </div>`;

        quizRoot.querySelectorAll('.quiz-answer').forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = Number(btn.dataset.answerIndex);
                applyScores(q.answers[index].scores);
                currentQuestion += 1;
                if (currentQuestion < total) {
                    renderQuestion();
                } else {
                    renderResults();
                }
            });
        });
    }

    function applyScores(answerScores) {
        if (!answerScores) return;
        Object.entries(answerScores).forEach(([careerId, points]) => {
            if (scores[careerId] != null) {
                scores[careerId] += points;
            }
        });
    }

    function getRankedCareers() {
        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([id, points]) => ({ id, points, ...quizData.careers[id] }));
    }

    function renderResults() {
        const ranked = getRankedCareers();
        const top = ranked[0];
        const runnerUp = ranked[1];

        const skillsList = top.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
        const rolesList = top.exampleRoles.map((r) => `<li>${escapeHtml(r)}</li>`).join('');

        const runnerHtml =
            runnerUp && runnerUp.points > 0
                ? `<p class="quiz-runner-up">You also showed strong fit for <strong>${escapeHtml(runnerUp.title)}</strong>. Many supply chain careers overlap—explore both!</p>`
                : '';

        quizRoot.innerHTML = `
            <div class="quiz-card quiz-results">
                <p class="quiz-step">Your result</p>
                <h2>${escapeHtml(top.title)}</h2>
                <p class="quiz-result-tagline">${escapeHtml(top.tagline)}</p>
                <p>${escapeHtml(top.description)}</p>
                ${runnerHtml}
                <div class="quiz-result-columns">
                    <div>
                        <h3>Example roles</h3>
                        <ul>${rolesList}</ul>
                    </div>
                    <div>
                        <h3>Skills to build</h3>
                        <ul>${skillsList}</ul>
                    </div>
                </div>
                <p class="quiz-wise-tip">Connect with WISE chapters, symposium sessions, and mentors to learn more about this path in practice.</p>
                <div class="quiz-result-actions">
                    <button type="button" class="btn btn-quiz-primary" id="quiz-retry">Take again</button>
                    <a href="chapters.html" class="btn btn-quiz-outline">Explore chapters</a>
                    <a href="contact.html" class="btn btn-quiz-outline">Get in touch</a>
                </div>
            </div>`;

        document.getElementById('quiz-retry').addEventListener('click', () => {
            initScores(quizData.careers);
            currentQuestion = 0;
            renderIntro();
        });
    }

    async function loadQuiz() {
        try {
            const res = await fetch(contentBase + 'career-quiz.json');
            if (!res.ok) throw new Error('Could not load quiz');
            quizData = await res.json();
            initScores(quizData.careers);
            renderIntro();
        } catch (err) {
            quizRoot.innerHTML = `
                <div class="quiz-card">
                    <p>Could not load the career quiz. Open the site via <code>http://localhost:8000</code> (see CONTENT-EDITING-GUIDE.md).</p>
                </div>`;
            console.error(err);
        }
    }

    document.addEventListener('DOMContentLoaded', loadQuiz);
})();
