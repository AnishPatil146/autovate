// ==========================================
// 1. CONFIGURATION
// ==========================================
const API_KEY = "AIzaSyB3ln7KNd-kfxeFPIcqJzbwx4-nyM1k3c8";
const CALENDAR_LINK = "https://calendly.com/anishpatil146/30min";

// ==========================================
// 2. PRELOADER & INITIALIZATION
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-progress');
    const preloader = document.getElementById('preloader');

    if (loader && preloader) {
        loader.style.width = '100%';
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initAnimations(); // Start animations

                // AUTO-POPUP LOGIN on First Visit
                if (!localStorage.getItem('hasVisited')) {
                    setTimeout(() => {
                        if (window.showLoginModal) showLoginModal();
                        localStorage.setItem('hasVisited', 'true');
                    }, 2000);
                }
            }, 500);
        }, 1000);
    }
});

// ==========================================
// 3. TYPEWRITER EFFECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const typewriterText = document.getElementById('typewriter-text');
    // IIFE to protect scope
    (function type(element) {
        if (!element) return;

        const phrases = ["Sales", "Support", "Operations", "Growth"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function animateTyping() {
            // Ensure element still exists
            const target = document.getElementById('typewriter-text');
            if (!target) return;

            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                target.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                target.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = 150;
            if (isDeleting) typingSpeed /= 2;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(animateTyping, typingSpeed);
        }
        animateTyping();

    })(typewriterText);
});

// ==========================================
// 4. STATS COUNTER ANIMATION
// ==========================================
function initStats() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const inc = target / 100;
        let count = 0;
        const updateCount = () => {
            count += inc;
            if (count < target) {
                counter.innerText = Math.ceil(count) + (target > 100 ? "+" : "%");
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + (target > 100 ? "+" : "%");
            }
        };
        updateCount();
    });
}

// ==========================================
// 5. INTERACTIVE TOGGLES (ROADMAP & FAQ)
// ==========================================

window.toggleRoadmap = function (element) {
    element.classList.toggle('active');
}

window.toggleFaq = function (element) {
    element.classList.toggle('active');
}

window.scrollToAnkita = function () {
    const ankitaSection = document.getElementById('ankita');
    if (ankitaSection) ankitaSection.scrollIntoView({ behavior: 'smooth' });
}

window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Functions
window.showLoginModal = function () {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}
window.closeLoginModal = function () {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

window.showIndustryDetails = function (industryKey) {
    const data = industryData[industryKey] || [{ title: "Custom Bot", desc: "Tailored automation." }];
    const title = industryKey.charAt(0).toUpperCase() + industryKey.slice(1) + " Automations";
    const titleEl = document.getElementById('modal-title');
    const container = document.getElementById('modal-content');

    if (titleEl && container) {
        titleEl.innerText = title;
        container.innerHTML = data.map(d => `<div class='p-4 border border-white/10 rounded bg-white/5'><h4 class='font-bold text-white'>${d.title}</h4><p class='text-muted text-xs'>${d.desc}</p></div>`).join('');
        document.getElementById('industry-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}
window.closeIndustryModal = function () {
    document.getElementById('industry-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

window.showDeployModal = function (systemName) {
    const titleEl = document.getElementById('deploy-title');
    if (titleEl) titleEl.innerText = "Deploy " + systemName;
    document.getElementById('deploy-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
window.closeDeployModal = function () {
    document.getElementById('deploy-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Data for Industries
const industryData = {
    'legal': [{ title: "Contract Review Agent", desc: "AI reviews NDAs in seconds." }, { title: "Case Research Bot", desc: "Finds legal precedents instantly." }],
    'finance': [{ title: "Invoice Processing", desc: "Auto-extracts data from PDFs." }, { title: "Expense Auditor", desc: "Flags anomalies in reports." }],
    'education': [{ title: "Student Enrollment Bot", desc: "Handles admissions FAQ 24/7." }, { title: "Grading Assistant", desc: "Pre-grades assignments." }],
    'travel': [{ title: "Itinerary Gen", desc: "Custom travel plans in seconds." }, { title: "Booking Concierge", desc: "Auto-books flights/hotels." }],
    'logistics': [{ title: "Route Optimization", desc: "Calculates fastest delivery paths." }, { title: "Inventory Forecast", desc: "Predicts stock shortages." }],
    'marketing': [{ title: "Content Repurposing", desc: "Video -> Blog -> Tweets." }, { title: "Lead Scoring", desc: "Qualifies leads based on intent." }],
    'fitness': [{ title: "Workout Generator", desc: "Custom plans based on goals." }, { title: "Nutrition Tracker", desc: "Calorie counting from photos." }],
    'saas': [{ title: "Onboarding Concierge", desc: "Guides new users." }, { title: "Churn Predictor", desc: "Identifies at-risk customers." }]
};

// ==========================================
// 7. ANKITA CHAT LOGIC (UPDATED WITH PRICING)
// ==========================================
// Default model in case fetch fails
let ACTIVE_MODEL = 'models/gemini-1.5-flash';

const SYSTEM_PROMPT = `
    ROLE: You are Ankita, Senior Automation Architect for Autovate.
    OBJECTIVE: Diagnose problems, quote prices for 'Ready-to-Deploy' tools, and book audits for 'Custom Builds'.

    PRICING LIST (One-time Setup Fee + 30 Days Support):
    1. WhatsApp Business API Bot: $500
    2. B2B Lead Scraper: $300
    3. Omni-Channel Blaster: $450
    4. AI Voice Caller: $750
    5. Social Auto-Pilot: $400
    6. CRM Data Enricher: $250
    7. AI Review Guardian: $300
    8. HR Talent Scout: $500
    9. Meeting Intel Bot: $450
    10. RAG Knowledge Agent: $1,000

    PROTOCOL:
    1. GREETING: "Hello! I'm Ankita. Are you looking for a 'Ready-to-Deploy' tool (fixed price) or a 'Custom Enterprise Build' today?"
    2. READY-TO-DEPLOY: If they ask about a specific tool from the list, quote the price immediately. Example: "The AI Voice Caller is $750 one-time setup. Shall we deploy it? [SHOW_BOOKING]"
    3. CUSTOM BUILD: If they have a complex need not on the list, say: "For custom workflows, pricing starts at $2,500 depending on complexity. We need a discovery call. [SHOW_BOOKING]"
    4. GENERAL QUERIES: Answer briefly, then pivot to booking.
    
    TONE: Professional, Transparent, High-Ticket Consultant. Concise.
`;
let conversationHistory = [{ role: "user", parts: [{ text: SYSTEM_PROMPT }] }, { role: "model", parts: [{ text: "Online and ready with pricing." }] }];

async function initializeModel() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        if (!data.error && data.models) {
            // Try to find flash or pro, otherwise stick to default
            const valid = data.models.filter(m => m.supportedGenerationMethods?.includes("generateContent"));
            const preferred = valid.find(m => m.name.includes('flash'));
            if (preferred) ACTIVE_MODEL = preferred.name;
            else if (valid.length > 0) ACTIVE_MODEL = valid[0].name;
        }
    } catch (e) { console.error("Model init failed, using default.", e); }
}
initializeModel();

window.sendMessage = async function () {
    const userInput = document.getElementById('user-input');
    const msg = userInput.value.trim();
    if (!msg) return;

    appendMessage('user', msg);
    userInput.value = '';
    showTyping(true);
    conversationHistory.push({ role: "user", parts: [{ text: msg }] });

    // Ensure model is initialized or use default
    if (!ACTIVE_MODEL) ACTIVE_MODEL = 'models/gemini-1.5-flash';

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${ACTIVE_MODEL}:generateContent?key=${API_KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: conversationHistory })
        });
        const data = await res.json();
        showTyping(false);

        if (data.candidates && data.candidates[0].content) {
            let reply = data.candidates[0].content.parts[0].text;
            if (reply.includes("[SHOW_BOOKING]")) {
                reply = reply.replace("[SHOW_BOOKING]", "");
                appendMessage('ai', reply);
                appendBooking();
            } else {
                appendMessage('ai', reply);
            }
            conversationHistory.push({ role: "model", parts: [{ text: reply }] });
        } else {
            // Handle API error case
            console.error(data);
            appendMessage('ai', "I'm having trouble connecting right now. Please try again or book a call directly.");
            appendBooking();
        }
    } catch (e) {
        showTyping(false);
        console.error(e);
        appendMessage('ai', "Connection error. Please check your internet or try again.");
    }
}

function appendMessage(sender, text) {
    const chatHistory = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `flex gap-4 ${sender === 'user' ? 'justify-end' : ''}`;
    div.innerHTML = `<div class="${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} p-4 text-sm max-w-[85%]">${text}</div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function appendBooking() {
    const chatHistory = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.innerHTML = `<div class="p-4 rounded-xl rounded-tl-none bg-gradient-to-br from-brand/20 to-purple-900/40 border border-brand/30 shadow-lg max-w-[85%] ml-0"><div class="flex items-center gap-2 mb-2"><i class="fas fa-calendar-check text-green-400"></i><span class="font-bold text-sm">Secure Your Slot</span></div><a href="${CALENDAR_LINK}" target="_blank" class="block w-full text-center bg-brand hover:bg-blue-600 text-white font-bold py-2 rounded text-xs transition-transform hover:scale-105">Book Implementation Call</a></div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTyping(show) {
    const ind = document.getElementById('typing-indicator');
    const chat = document.getElementById('chat-history');
    if (ind && chat) { ind.classList.toggle('hidden', !show); chat.scrollTop = chat.scrollHeight; }
}

window.handleKeyPress = function (e) { if (e.key === 'Enter') sendMessage(); }

// ==========================================
// 8. ANIMATIONS & CANVAS
// ==========================================
function initAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.fade-up').forEach((el, i) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 1, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
        });
        ScrollTrigger.create({ trigger: ".counter", onEnter: initStats, once: true });
    }
}

// Neural Canvas Background (Isolated Scope with Safety Semicolon)
; (function () {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, p = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const init = () => { p = Array.from({ length: 40 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 })); };
    const draw = () => {
        ctx.clearRect(0, 0, w, h); ctx.fillStyle = 'rgba(255,255,255,0.2)';
        p.forEach((a, i) => {
            a.x += a.vx; a.y += a.vy;
            if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1;
            ctx.beginPath(); ctx.arc(a.x, a.y, 1, 0, 7); ctx.fill();
            p.slice(i + 1).forEach(b => { if (Math.hypot(a.x - b.x, a.y - b.y) < 150) { ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } });
        }); requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize); resize(); init(); draw();
})();