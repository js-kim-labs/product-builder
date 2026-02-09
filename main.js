const themeToggle = document.getElementById('theme-toggle');
const generateBtn = document.getElementById('generate-btn');
const lottoContainer = document.getElementById('lotto-container');

// Theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', theme);
    updateUtterancesTheme(theme);
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

const saved = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(saved);

// Lotto
function getBallColor(n) {
    if (n <= 10) return 'yellow';
    if (n <= 20) return 'blue';
    if (n <= 30) return 'red';
    if (n <= 40) return 'gray';
    return 'green';
}

function generateLotto() {
    const numbers = [];
    while (numbers.length < 7) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(n)) numbers.push(n);
    }

    const main = numbers.slice(0, 6).sort((a, b) => a - b);
    const bonus = numbers[6];

    lottoContainer.innerHTML = '';

    main.forEach((n, i) => {
        const ball = document.createElement('div');
        ball.className = `ball ${getBallColor(n)}`;
        ball.textContent = n;
        ball.style.animationDelay = `${i * 0.08}s`;
        lottoContainer.appendChild(ball);
    });

    const sep = document.createElement('span');
    sep.className = 'bonus-separator';
    sep.textContent = '+';
    lottoContainer.appendChild(sep);

    const bonusBall = document.createElement('div');
    bonusBall.className = `ball ${getBallColor(bonus)}`;
    bonusBall.textContent = bonus;
    bonusBall.style.animationDelay = '0.5s';
    lottoContainer.appendChild(bonusBall);
}

generateBtn.addEventListener('click', generateLotto);
generateLotto();

// Utterances Comments
function loadUtterances(theme) {
    const container = document.getElementById('utterances-container');
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'js-kim-labs/product-builder');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', theme === 'dark' ? 'github-dark' : 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);
}

function updateUtterancesTheme(theme) {
    const iframe = document.querySelector('.utterances-frame');
    if (iframe) {
        iframe.contentWindow.postMessage(
            { type: 'set-theme', theme: theme === 'dark' ? 'github-dark' : 'github-light' },
            'https://utteranc.es'
        );
    }
}

loadUtterances(document.documentElement.getAttribute('data-theme'));

// Contact Form
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '보내는 중...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            formStatus.textContent = '문의가 성공적으로 전송되었습니다!';
            formStatus.classList.add('success');
            contactForm.reset();
        } else {
            throw new Error();
        }
    } catch {
        formStatus.textContent = '전송에 실패했습니다. 다시 시도해주세요.';
        formStatus.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '문의 보내기';
    }
});
