// Theme
const themeToggle = document.getElementById('theme-toggle');

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

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        siteNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
            siteNav.classList.remove('open');
        }
    });
}

// Lotto Generator
const generateBtn = document.getElementById('generate-btn');
const lottoContainer = document.getElementById('lotto-container');
let setCount = 1;

// Set count selector
document.querySelectorAll('.set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setCount = parseInt(btn.dataset.count, 10);
    });
});

function getBallColor(n) {
    if (n <= 10) return 'yellow';
    if (n <= 20) return 'blue';
    if (n <= 30) return 'red';
    if (n <= 40) return 'gray';
    return 'green';
}

function generateOneSet() {
    const numbers = [];
    while (numbers.length < 7) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(n)) numbers.push(n);
    }
    return {
        main: numbers.slice(0, 6).sort((a, b) => a - b),
        bonus: numbers[6]
    };
}

function renderSet(set, index, total) {
    const row = document.createElement('div');
    row.className = 'lotto-row';

    if (total > 1) {
        const label = document.createElement('span');
        label.className = 'row-label';
        label.textContent = String.fromCharCode(65 + index);
        row.appendChild(label);
    }

    const balls = document.createElement('div');
    balls.className = 'lotto-balls';

    set.main.forEach((n, i) => {
        const ball = document.createElement('div');
        ball.className = `ball ${getBallColor(n)}`;
        ball.textContent = n;
        ball.style.animationDelay = `${index * 0.15 + i * 0.06}s`;
        balls.appendChild(ball);
    });

    const sep = document.createElement('span');
    sep.className = 'bonus-separator';
    sep.textContent = '+';
    balls.appendChild(sep);

    const bonusBall = document.createElement('div');
    bonusBall.className = `ball ${getBallColor(set.bonus)}`;
    bonusBall.textContent = set.bonus;
    bonusBall.style.animationDelay = `${index * 0.15 + 0.4}s`;
    balls.appendChild(bonusBall);

    row.appendChild(balls);
    return row;
}

function generateLotto() {
    lottoContainer.innerHTML = '';

    for (let i = 0; i < setCount; i++) {
        const set = generateOneSet();
        lottoContainer.appendChild(renderSet(set, i, setCount));
    }
}

if (generateBtn && lottoContainer) {
    generateBtn.addEventListener('click', generateLotto);
    generateLotto();
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Utterances Comments
function loadUtterances(theme) {
    const container = document.getElementById('utterances-container');
    if (!container) return;
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

if (contactForm && formStatus) {
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
}
