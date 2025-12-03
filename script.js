document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dark Mode Setup (Forced Default: Dark) ---
    const themeToggle = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlElement = document.documentElement;

    // Logic: If 'light' is explicitly saved, use light. Otherwise, ALWAYS default to dark.
    if (localStorage.getItem('color-theme') === 'light') {
        htmlElement.classList.remove('dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        htmlElement.classList.add('dark');
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    }

    themeToggle.addEventListener('click', () => {
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');

        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });

    // --- 2. Typewriter Effect (Running Letters) ---
    const textElement = document.getElementById('typewriter');
    // The text you wanted
    const textToType = "Web Developer | IoT Enthusiast | Data Analyst | Content Ceator | Freelancer";
    let charIndex = 0;
    const typingSpeed = 100; // Speed in ms

    function typeText() {
        if (charIndex < textToType.length) {
            textElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        }
    }
    
    // Start typing after a short delay
    if(textElement) {
        setTimeout(typeText, 500);
    }

    // --- 3. Custom Cursor ---
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', e => {
            cursorOuter.style.top = `${e.clientY}px`;
            cursorOuter.style.left = `${e.clientX}px`;
            cursorInner.style.top = `${e.clientY}px`;
            cursorInner.style.left = `${e.clientX}px`;
        });

        const cursorLinks = document.querySelectorAll('.cursor-link');
        cursorLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursorOuter.classList.add('cursor-hover');
                cursorInner.classList.add('cursor-inner-hover');
            });
            link.addEventListener('mouseleave', () => {
                cursorOuter.classList.remove('cursor-hover');
                cursorInner.classList.remove('cursor-inner-hover');
            });
        });
    } else {
        // Hide custom cursor elements on mobile
        if(cursorOuter) cursorOuter.style.display = 'none';
        if(cursorInner) cursorInner.style.display = 'none';
    }

    // --- 4. Scroll Animations ---
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // --- 5. Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 6. Gemini AI Modal & API Logic ---
    // (Keep your existing Gemini Modal logic here)
    const modal = document.getElementById('gemini-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalTitle = document.getElementById('gemini-modal-title');
    const modalInput = document.getElementById('gemini-modal-input');
    const modalSubmitBtn = document.getElementById('gemini-modal-submit');
    const modalCloseBtn = document.getElementById('gemini-modal-close');
    const responseArea = document.getElementById('gemini-response-area');
    const loadingSpinner = document.getElementById('gemini-loading');
    const contactFormMessage = document.getElementById('message');
    const openAssistantBtn = document.getElementById('open-ai-assistant-btn');
    const openDraftHelperBtn = document.getElementById('open-draft-helper-btn');
    
    let modalMode = null; 
    let chatHistory = [];

    // --- !!! PASTE YOUR API KEY BELOW !!! ---
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const assistantSystemPrompt = `You are the professional AI assistant for Dehaleesan KR.
    Skills: Web Dev, IoT, Data Analytics (Power BI).
    Projects: City Bus Detection, Bulb Rot Disease AI, Responsive Web Design.
    Contact: dehaleesanraju@gmail.com.
    Answer concisely.`;

    function openModal(mode) {
        modalMode = mode;
        chatHistory = [];
        responseArea.innerHTML = '';
        modalInput.value = '';
        loadingSpinner.classList.add('hidden');
        responseArea.classList.remove('hidden');

        let introP = document.createElement('p');
        introP.className = 'text-gray-600 dark:text-gray-400';

        if (mode === 'assistant') {
            modalTitle.textContent = 'Ask AI Assistant';
            introP.textContent = `Hi! Ask me about Dehaleesan's projects or skills.`;
            modalSubmitBtn.textContent = 'Send';
        } else {
            modalTitle.textContent = 'Draft Message';
            introP.textContent = 'Type your reason for contacting (e.g., "Job offer"), and I will draft a message.';
            modalSubmitBtn.textContent = 'Draft';
        }
        responseArea.appendChild(introP);

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('opacity-0', 'translate-y-4');
        }, 10);
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    if (openAssistantBtn) openAssistantBtn.addEventListener('click', () => openModal('assistant'));
    if (openDraftHelperBtn) openDraftHelperBtn.addEventListener('click', () => openModal('draftHelper'));
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function addMessageToChat(text, sender = 'user') {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = sender === 'user' ? 'text-right font-medium' : 'text-left bg-gray-100 dark:bg-gray-800 p-2 rounded-md';
        responseArea.appendChild(p);
        responseArea.scrollTop = responseArea.scrollHeight;
    }

    async function callGeminiAPI(payload) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response.";
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    if (modalSubmitBtn) {
        modalSubmitBtn.addEventListener('click', async () => {
            const query = modalInput.value.trim();
            if (!query) return;

            loadingSpinner.classList.remove('hidden');
            responseArea.classList.add('hidden');
            modalInput.disabled = true;

            let text = '';
            if (modalMode === 'assistant') {
                addMessageToChat(query, 'user');
                const payload = {
                    contents: [...chatHistory.map(t => ({ role: t.role, parts: [{ text: t.text }] })), { role: "user", parts: [{ text: query }] }],
                    systemInstruction: { parts: [{ text: assistantSystemPrompt }] }
                };
                text = await callGeminiAPI(payload);
                chatHistory.push({ role: 'user', text: query }, { role: 'model', text: text });
                addMessageToChat(text, 'model');
            } else {
                const prompt = `Draft a short contact message to Dehaleesan for: "${query}". Sign off with [Name].`;
                text = await callGeminiAPI({ contents: [{ parts: [{ text: prompt }] }] });
                if (contactFormMessage) contactFormMessage.value = text.replace(/\[Name\]/g, "").trim();
                closeModal();
            }

            loadingSpinner.classList.add('hidden');
            responseArea.classList.remove('hidden');
            modalInput.disabled = false;
            modalInput.value = '';
            modalInput.focus();
        });
    }
    
    if (modalInput) {
        modalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') modalSubmitBtn.click();
        });
    }
});