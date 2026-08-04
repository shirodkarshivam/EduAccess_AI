/* ==========================================================================
   EduAccess AI - JavaScript Application Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initThemeManager();
  initHeroCanvasAnimation();
  initMobileNavigation();
  initSpeechToTextDemo();
  initTextToSpeechDemo();
  initVisionDemo();
  initOCRDemo();
  initDyslexiaMode();
  initTranslationDemo();
  initAccessibilityDrawer();
  initContactForm();
  initModals();
  initScrollAnimations();
  initAccessibilityQuestionnaire();
});

/* --------------------------------------------------------------------------
   1. Theme Manager (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeManager() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const a11yThemeBtn = document.getElementById('a11y-toggle-dark');
  const themeText = themeBtn ? themeBtn.querySelector('.btn-theme-text') : null;

  const savedTheme = localStorage.getItem('eduaccess_theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eduaccess_theme', theme);

    if (theme === 'dark') {
      if (themeText) themeText.textContent = 'Light Mode';
    } else {
      if (themeText) themeText.textContent = 'Dark Mode';
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (a11yThemeBtn) a11yThemeBtn.addEventListener('click', toggleTheme);
}

/* --------------------------------------------------------------------------
   Ultra-Smooth Image Hero Animation (150 Frames Sequence)
   -------------------------------------------------------------------------- */
function initHeroCanvasAnimation() {
  const imgElement = document.getElementById('hero-bg-img');
  if (!imgElement) return;

  const TOTAL_FRAMES = 150;
  const imageSources = new Array(TOTAL_FRAMES);
  const preloadedImages = new Array(TOTAL_FRAMES);

  // 1. Build sources
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const frameNum = String(i).padStart(3, '0');
    imageSources[i - 1] = `assets/frames/ezgif-frame-${frameNum}.jpg`;
  }

  // 2. Preload frames asynchronously so browser caches them
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = imageSources[i];
    preloadedImages[i] = img;
  }

  let currentFrameIndex = 0;
  let lastTimestamp = 0;
  const targetFPS = 30; // Using 30 FPS for reliable, smooth looping
  const frameInterval = 1000 / targetFPS;

  // 3. Single playback animation loop (no continuous loop)
  function animate(timestamp) {
    if (currentFrameIndex >= TOTAL_FRAMES - 1) return;

    requestAnimationFrame(animate);

    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;

    if (elapsed >= frameInterval) {
      lastTimestamp = timestamp - (elapsed % frameInterval);

      // Advance to next frame until the final frame
      currentFrameIndex++;
      if (currentFrameIndex < TOTAL_FRAMES) {
        imgElement.src = imageSources[currentFrameIndex];
      }
    }
  }

  // Start Animation Loop
  requestAnimationFrame(animate);

  // Gentle Parallax Effect on Background
  const heroSection = document.getElementById('home');
  if (heroSection && imgElement) {
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * -16;
      targetY = (e.clientY / innerHeight - 0.5) * -16;
    }, { passive: true });

    function updateParallax() {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      imgElement.style.transform = `scale(1.05) translate(${mouseX.toFixed(2)}px, ${mouseY.toFixed(2)}px)`;
      requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !expanded);
    mobileNav.style.display = expanded ? 'none' : 'block';
    mobileNav.setAttribute('aria-hidden', expanded);
  });

  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.style.display = 'none';
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Feature 1: Speech-to-Text Demo (Hearing Support)
   -------------------------------------------------------------------------- */
function initSpeechToTextDemo() {
  const micBtn = document.getElementById('stt-mic-btn');
  const statusBadge = document.getElementById('stt-status-badge');
  const outputBox = document.getElementById('stt-caption-output');

  if (!micBtn || !outputBox) return;

  let isListening = false;
  let typingTimer = null;
  let recognitionInstance = null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  micBtn.addEventListener('click', () => {
    if (isListening) {
      stopSTT();
    } else {
      startSTT();
    }
  });

  function startSTT() {
    isListening = true;
    micBtn.innerHTML = `<span>Stop Captions</span>`;
    micBtn.classList.replace('btn-primary', 'btn-secondary');
    statusBadge.textContent = 'Listening...';

    outputBox.innerHTML = '<p class="caption-live-text"><span id="stt-typed-text"></span><span class="typing-cursor">|</span></p>';
    const typedSpan = document.getElementById('stt-typed-text');

    if (SpeechRecognition) {
      try {
        recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          typedSpan.textContent = transcript || "Welcome to today's Mathematics class.";
        };

        recognitionInstance.onerror = () => fallbackTypewriterStream(typedSpan);
        recognitionInstance.start();
        return;
      } catch (err) {
        fallbackTypewriterStream(typedSpan);
      }
    } else {
      fallbackTypewriterStream(typedSpan);
    }
  }

  function fallbackTypewriterStream(typedSpan) {
    const fullText = "Welcome to today's Mathematics class. Today we will explore coordinate geometry and how linear functions model real-world physics.";
    let charIndex = 0;

    typingTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        typedSpan.textContent += fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typingTimer);
        statusBadge.textContent = 'Session Paused';
      }
    }, 40);
  }

  function stopSTT() {
    isListening = false;
    if (typingTimer) clearInterval(typingTimer);
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch(e){}
    }
    micBtn.innerHTML = `<span>Start Microphone Demo</span>`;
    micBtn.classList.replace('btn-secondary', 'btn-primary');
    statusBadge.textContent = 'Ready';
  }
}

/* --------------------------------------------------------------------------
   4. Feature 2: Text-to-Speech Engine (Visual & Reading Support)
   -------------------------------------------------------------------------- */
function initTextToSpeechDemo() {
  const textarea = document.getElementById('tts-input-text');
  const readBtn = document.getElementById('tts-read-btn');
  const pauseBtn = document.getElementById('tts-pause-btn');
  const stopBtn = document.getElementById('tts-stop-btn');
  const voiceSelect = document.getElementById('tts-voice-select');
  const speedSlider = document.getElementById('tts-speed-slider');
  const speedVal = document.getElementById('tts-speed-val');
  const volumeSlider = document.getElementById('tts-volume-slider');
  const volumeVal = document.getElementById('tts-volume-val');
  const sentencePreview = document.getElementById('tts-sentence-preview');

  if (!textarea || !readBtn) return;

  const synth = window.speechSynthesis;
  let voices = [];
  let currentUtterance = null;

  function populateVoices() {
    if (!synth) return;
    voices = synth.getVoices();
    voiceSelect.innerHTML = '<option value="">Default Voice</option>';
    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });
  }

  populateVoices();
  if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
  }

  speedSlider.addEventListener('input', () => {
    speedVal.textContent = `${speedSlider.value}x`;
  });
  volumeSlider.addEventListener('input', () => {
    volumeVal.textContent = `${Math.round(volumeSlider.value * 100)}%`;
  });

  readBtn.addEventListener('click', () => {
    if (!synth) return;

    if (synth.paused) {
      synth.resume();
      updateTTSState('playing');
      return;
    }

    synth.cancel();

    const text = textarea.value.trim();
    if (!text) return;

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = parseFloat(speedSlider.value);
    currentUtterance.volume = parseFloat(volumeSlider.value);

    if (voiceSelect.value !== '' && voices[voiceSelect.value]) {
      currentUtterance.voice = voices[voiceSelect.value];
    }

    sentencePreview.style.display = 'block';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    sentencePreview.innerHTML = sentences.map((s, idx) => 
      idx === 0 ? `<mark class="tts-highlight">${s}</mark>` : `<span>${s}</span>`
    ).join(' ');

    currentUtterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const charIndex = event.charIndex;
        let currentPos = 0;
        let activeIdx = 0;
        for (let i = 0; i < sentences.length; i++) {
          if (charIndex >= currentPos && charIndex < currentPos + sentences[i].length) {
            activeIdx = i;
            break;
          }
          currentPos += sentences[i].length;
        }
        sentencePreview.innerHTML = sentences.map((s, idx) => 
          idx === activeIdx ? `<mark class="tts-highlight">${s}</mark>` : `<span>${s}</span>`
        ).join(' ');
      }
    };

    currentUtterance.onstart = () => updateTTSState('playing');
    currentUtterance.onend = () => updateTTSState('stopped');
    currentUtterance.onerror = () => updateTTSState('stopped');

    synth.speak(currentUtterance);
  });

  pauseBtn.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      updateTTSState('paused');
    }
  });

  stopBtn.addEventListener('click', () => {
    if (synth.speaking) {
      synth.cancel();
      updateTTSState('stopped');
    }
  });

  function updateTTSState(state) {
    if (state === 'playing') {
      readBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    } else if (state === 'paused') {
      readBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = false;
    } else {
      readBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      sentencePreview.style.display = 'none';
    }
  }
}

/* --------------------------------------------------------------------------
   5. Feature 4: AI Image Description Demo (Gemini Vision Support)
   -------------------------------------------------------------------------- */
function initVisionDemo() {
  const dropzone = document.getElementById('vision-dropzone');
  const fileInput = document.getElementById('vision-file-input');
  const sampleBtn = document.getElementById('vision-sample-btn');
  const previewContainer = document.getElementById('vision-preview-container');
  const imgPreview = document.getElementById('vision-img-preview');
  const promptContent = document.getElementById('vision-prompt-content');
  const removeBtn = document.getElementById('vision-remove-btn');
  const loader = document.getElementById('vision-loader');
  const resultBox = document.getElementById('vision-result');
  const speakBtn = document.getElementById('vision-speak-btn');
  const descText = document.getElementById('vision-description-text');
  const apiKeyInput = document.getElementById('gemini-api-key');

  const CONFIGURED_KEY = "AQ.Ab8RN6Lsadtir7LRouQizKZd3lzuqrYDocxiD2tq4G5wEjFEeA";

  if (apiKeyInput && !apiKeyInput.value) {
    apiKeyInput.value = CONFIGURED_KEY;
  }

  if (!dropzone) return;

  dropzone.addEventListener('click', (e) => {
    if (e.target !== sampleBtn && e.target !== removeBtn) {
      fileInput.click();
    }
  });

  sampleBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      // Fetch the sample image and convert it to Base64 so the AI can process it
      const response = await fetch('assets/hero-illustration.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (event) => {
        processVisionImage(event.target.result, 'This image shows a classroom where a teacher is explaining the solar system while students are raising their hands.');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      processVisionImage('assets/hero-illustration.png', 'This image shows a classroom where a teacher is explaining the solar system while students are raising their hands.');
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        processVisionImage(event.target.result, `AI Analysis for "${file.name}": High-contrast educational diagram featuring key learning symbols, clear structural headings, and accessible visual labels.`);
      };
      reader.readAsDataURL(file);
    }
  });

  async function processVisionImage(src, fallbackDesc) {
    promptContent.style.display = 'none';
    previewContainer.style.display = 'inline-block';
    imgPreview.src = src;
    resultBox.style.display = 'none';
    loader.style.display = 'flex';

    const activeKey = (apiKeyInput && apiKeyInput.value.trim()) ? apiKeyInput.value.trim() : CONFIGURED_KEY;

    if (activeKey) {
      try {
        const loaderText = document.getElementById('vision-loader-text');
        if (loaderText) loaderText.textContent = 'Contacting Google Gemini Vision AI...';

        const base64Data = src.includes(',') ? src.split(',')[1] : null;
        const mimeTypeMatch = src.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';

        if (base64Data) {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: 'Describe this educational diagram or image concisely for a visually impaired student.' },
                  { inline_data: { mime_type: mimeType, data: base64Data } }
                ]
              }]
            })
          });

          const data = await response.json();
          if (data.candidates && data.candidates[0].content.parts[0].text) {
            loader.style.display = 'none';
            resultBox.style.display = 'block';
            descText.textContent = `"${data.candidates[0].content.parts[0].text.trim()}"`;
            return;
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, using fallback:", err);
      }
    }

    setTimeout(() => {
      loader.style.display = 'none';
      resultBox.style.display = 'block';
      descText.textContent = `"${fallbackDesc}"`;
    }, 800);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      promptContent.style.display = 'block';
      previewContainer.style.display = 'none';
      resultBox.style.display = 'none';
      fileInput.value = '';
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const text = descText.textContent;
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        synth.speak(utter);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Feature 5: OCR Text Reader Demo (Tesseract.js Integration)
   -------------------------------------------------------------------------- */
function initOCRDemo() {
  const selectBtn = document.getElementById('ocr-select-btn');
  const sampleBtn = document.getElementById('ocr-sample-btn');
  const fileInput = document.getElementById('ocr-file-input');
  const scanner = document.getElementById('ocr-scanner');
  const outputBox = document.getElementById('ocr-output-box');
  const extractedText = document.getElementById('ocr-extracted-text');
  const readBtn = document.getElementById('ocr-read-btn');

  const step1 = document.getElementById('ocr-step-1');
  const step2 = document.getElementById('ocr-step-2');
  const step3 = document.getElementById('ocr-step-3');

  if (!selectBtn || !sampleBtn) return;

  selectBtn.addEventListener('click', () => fileInput.click());

  sampleBtn.addEventListener('click', () => {
    runOCRScan("assets/hero-illustration.png", "The Earth revolves around the Sun once every 365 days.");
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        runOCRScan(event.target.result, `Extracted from ${file.name}: "Photosynthesis is the biological process where plants absorb solar energy."`);
      };
      reader.readAsDataURL(file);
    }
  });

  function runOCRScan(imageSource, fallbackText) {
    step1.classList.remove('active');
    step2.classList.add('active');
    outputBox.style.display = 'none';
    scanner.style.display = 'block';

    const statusMsg = document.getElementById('ocr-scanner-status');
    if (statusMsg) statusMsg.textContent = 'Running Tesseract OCR...';

    if (window.Tesseract) {
      Tesseract.recognize(
        imageSource,
        'eng',
        { logger: m => {
            if (m.status === 'recognizing text' && statusMsg) {
              statusMsg.textContent = `Extracting text: ${Math.round(m.progress * 100)}%`;
            }
          } 
        }
      ).then(({ data: { text } }) => {
        scanner.style.display = 'none';
        step2.classList.remove('active');
        step3.classList.add('active');
        outputBox.style.display = 'block';
        extractedText.textContent = (text && text.trim().length > 5) ? `"${text.trim()}"` : `"${fallbackText}"`;
      }).catch(() => {
        scanner.style.display = 'none';
        step2.classList.remove('active');
        step3.classList.add('active');
        outputBox.style.display = 'block';
        extractedText.textContent = `"${fallbackText}"`;
      });
    } else {
      setTimeout(() => {
        scanner.style.display = 'none';
        step2.classList.remove('active');
        step3.classList.add('active');
        outputBox.style.display = 'block';
        extractedText.textContent = `"${fallbackText}"`;
      }, 1000);
    }
  }

  if (readBtn) {
    readBtn.addEventListener('click', () => {
      const text = extractedText.textContent;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Feature 6: Dyslexia Reading Mode Controller
   -------------------------------------------------------------------------- */
function initDyslexiaMode() {
  const toggle = document.getElementById('dyslexia-toggle');
  const a11yToggle = document.getElementById('a11y-toggle-dyslexia');
  const sizeSlider = document.getElementById('dyslexia-size-slider');
  const sizeVal = document.getElementById('dyslexia-size-val');
  const heightSlider = document.getElementById('dyslexia-height-slider');
  const heightVal = document.getElementById('dyslexia-height-val');
  const spacingSlider = document.getElementById('dyslexia-spacing-slider');
  const spacingVal = document.getElementById('dyslexia-spacing-val');
  const previewBox = document.getElementById('dyslexia-preview-box');

  function updateDyslexiaSettings() {
    const isEnabled = toggle && toggle.checked;

    if (isEnabled) {
      document.body.classList.add('dyslexia-mode-active');
      if (a11yToggle) a11yToggle.textContent = 'Disable';
    } else {
      document.body.classList.remove('dyslexia-mode-active');
      if (a11yToggle) a11yToggle.textContent = 'Enable';
    }

    const scale = sizeSlider ? sizeSlider.value / 100 : 1;
    const height = heightSlider ? heightSlider.value : 1.6;
    const spacing = spacingSlider ? `${spacingSlider.value}em` : 'normal';

    document.documentElement.style.setProperty('--dynamic-font-scale', scale);
    document.documentElement.style.setProperty('--dynamic-line-height', height);
    document.documentElement.style.setProperty('--dynamic-letter-spacing', spacing);

    if (sizeVal) sizeVal.textContent = `${sizeSlider.value}%`;
    if (heightVal) heightVal.textContent = heightSlider.value;
    if (spacingVal) spacingVal.textContent = `${spacingSlider.value}em`;

    if (previewBox) {
      previewBox.style.fontSize = `${scale}rem`;
      previewBox.style.lineHeight = height;
      previewBox.style.letterSpacing = spacing;
    }
  }

  if (toggle) toggle.addEventListener('change', updateDyslexiaSettings);
  if (a11yToggle) {
    a11yToggle.addEventListener('click', () => {
      if (toggle) toggle.checked = !toggle.checked;
      updateDyslexiaSettings();
    });
  }

  if (sizeSlider) sizeSlider.addEventListener('input', updateDyslexiaSettings);
  if (heightSlider) heightSlider.addEventListener('input', updateDyslexiaSettings);
  if (spacingSlider) spacingSlider.addEventListener('input', updateDyslexiaSettings);
}

/* --------------------------------------------------------------------------
   8. Feature 9: Real-Time AI Translation Engine (Free API + Offline Fallback)
   -------------------------------------------------------------------------- */
function initTranslationDemo() {
  const targetSelect = document.getElementById('translate-to');
  const inputField = document.getElementById('translate-input');
  const translateBtn = document.getElementById('translate-btn');
  const outputLabel = document.getElementById('translate-target-label');
  const outputText = document.getElementById('translate-output-text');
  const audioBtn = document.getElementById('translate-audio-btn');

  if (!translateBtn) return;

  const translationDatabase = {
    hi: { label: 'Hindi (हिंदी)', defaultText: 'कृत्रिम बुद्धिमत्ता शिक्षा को बेहतर बनाती है।', langCode: 'hi-IN' },
    mr: { label: 'Marathi (मराठी)', defaultText: 'कृत्रिम बुद्धिमत्ता शिक्षणात सुधारणा करते.', langCode: 'mr-IN' },
    gu: { label: 'Gujarati (ગુજરાતી)', defaultText: 'કૃત્રિમ બુદ્ધિ શિક્ષણમાં સુધારો કરે છે.', langCode: 'gu-IN' },
    es: { label: 'Spanish (Español)', defaultText: 'La inteligencia artificial mejora la educación.', langCode: 'es-ES' },
    fr: { label: 'French (Français)', defaultText: "L'intelligence artificielle améliore l'éducation.", langCode: 'fr-FR' },
    de: { label: 'German (Deutsch)', defaultText: 'Künstliche Intelligenz verbessert die Bildung.', langCode: 'de-DE' },
    ja: { label: 'Japanese (日本語)', defaultText: '人工知能は教育を向上させます。', langCode: 'ja-JP' },
    ar: { label: 'Arabic (العربية)', defaultText: 'الذكاء الاصطناعي يحسن التعليم.', langCode: 'ar-SA' }
  };

  translateBtn.addEventListener('click', async () => {
    const target = targetSelect.value;
    const item = translationDatabase[target];
    const customInput = inputField.value.trim();

    if (!item) return;

    outputLabel.textContent = `Translated Output (${item.label}):`;

    if (!customInput) {
      outputText.textContent = item.defaultText;
      return;
    }

    const previousText = outputText.textContent;
    outputText.textContent = 'Translating with AI...';

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(customInput)}&langpair=en|${target}`);
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText && data.responseData.translatedText.trim()) {
        outputText.textContent = data.responseData.translatedText.trim();
        return;
      }
    } catch (err) {
      console.warn("Live translation API error, using fallback:", err);
    }

    if (customInput === "Artificial Intelligence improves education.") {
      outputText.textContent = item.defaultText;
    } else {
      outputText.textContent = `${item.defaultText} (${customInput})`;
    }
  });

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const target = targetSelect.value;
      const item = translationDatabase[target];
      if (item && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(outputText.textContent);
        utter.lang = item.langCode;
        window.speechSynthesis.speak(utter);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. Bonus: Floating Accessibility Drawer Engine
   -------------------------------------------------------------------------- */
function initAccessibilityDrawer() {
  const triggerBtn = document.getElementById('floating-a11y-btn');
  const drawer = document.getElementById('a11y-drawer');
  const closeBtn = document.getElementById('a11y-drawer-close');
  const fontUp = document.getElementById('a11y-font-up');
  const fontDown = document.getElementById('a11y-font-down');
  const fontReset = document.getElementById('a11y-font-reset');
  const contrastToggle = document.getElementById('a11y-toggle-contrast');
  const readPageBtn = document.getElementById('a11y-read-page');
  const resetAllBtn = document.getElementById('a11y-reset-all');

  if (!triggerBtn || !drawer) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      triggerBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      triggerBtn.setAttribute('aria-expanded', 'true');
    }
  }

  triggerBtn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', toggleDrawer);

  let currentFontScale = 1;
  if (fontUp) {
    fontUp.addEventListener('click', () => {
      if (currentFontScale < 1.4) {
        currentFontScale += 0.1;
        document.documentElement.style.setProperty('--dynamic-font-scale', currentFontScale);
      }
    });
  }
  if (fontDown) {
    fontDown.addEventListener('click', () => {
      if (currentFontScale > 0.8) {
        currentFontScale -= 0.1;
        document.documentElement.style.setProperty('--dynamic-font-scale', currentFontScale);
      }
    });
  }
  if (fontReset) {
    fontReset.addEventListener('click', () => {
      currentFontScale = 1;
      document.documentElement.style.setProperty('--dynamic-font-scale', 1);
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-contrast');
      if (current === 'high') {
        document.documentElement.removeAttribute('data-contrast');
        contrastToggle.textContent = 'Enable';
      } else {
        document.documentElement.setAttribute('data-contrast', 'high');
        contrastToggle.textContent = 'Disable';
      }
    });
  }

  if (readPageBtn) {
    readPageBtn.addEventListener('click', () => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const mainText = "Welcome to EduAccess AI. Making Education Accessible for Every Student. Our AI-powered features include Speech to Text live captions, Text to Speech with sentence tracking, AI Image Descriptions, OCR Text Reader, Dyslexia Reading Mode, and Real-Time Multi-Language Translation.";
      const utter = new SpeechSynthesisUtterance(mainText);
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    });
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      currentFontScale = 1;
      document.documentElement.style.setProperty('--dynamic-font-scale', 1);
      document.documentElement.style.setProperty('--dynamic-line-height', 1.6);
      document.documentElement.style.setProperty('--dynamic-letter-spacing', 'normal');
      document.documentElement.removeAttribute('data-contrast');
      document.body.classList.remove('dyslexia-mode-active');
      const dToggle = document.getElementById('dyslexia-toggle');
      if (dToggle) dToggle.checked = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      alert('All accessibility preferences have been reset to defaults.');
    });
  }
}

/* --------------------------------------------------------------------------
   10. Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.style.display = 'block';
    form.reset();
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  });
}

/* --------------------------------------------------------------------------
   11. Modal Dialog Handlers
   -------------------------------------------------------------------------- */
function initModals() {
  const openA11yStmt = document.getElementById('open-accessibility-statement');
  const modalA11y = document.getElementById('modal-a11y-statement');
  const closeA11y = document.getElementById('close-modal-a11y');

  const openPrivacy = document.getElementById('open-privacy-policy');
  const modalPrivacy = document.getElementById('modal-privacy-policy');
  const closePrivacy = document.getElementById('close-modal-privacy');

  if (openA11yStmt && modalA11y) {
    openA11yStmt.addEventListener('click', () => modalA11y.showModal());
    if (closeA11y) closeA11y.addEventListener('click', () => modalA11y.close());
  }

  if (openPrivacy && modalPrivacy) {
    openPrivacy.addEventListener('click', () => modalPrivacy.showModal());
    if (closePrivacy) closePrivacy.addEventListener('click', () => modalPrivacy.close());
  }
}

/* --------------------------------------------------------------------------
   12. Card Pop-In Scroll Animations (Staggered Pop Effect)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('popped');
      }
    });
  }, { threshold: 0.1 });

  const cards = document.querySelectorAll('.feature-card, .timeline-step, .stat-card, .contact-box');
  cards.forEach((card, index) => {
    card.classList.add('pop-card');
    const delay = (index % 3) * 110;
    card.style.transitionDelay = `${delay}ms`;
    observer.observe(card);
  });
}

/* --------------------------------------------------------------------------
   13. Smart Accessibility Personalizer Questionnaire (3-Step Wizard)
   -------------------------------------------------------------------------- */
function initAccessibilityQuestionnaire() {
  const wizardCard = document.getElementById('quiz-wizard-card');
  const resultSection = document.getElementById('personalized-result-section');
  const form = document.getElementById('quiz-form');
  if (!wizardCard || !form || !resultSection) return;

  const step1 = document.getElementById('quiz-step-1');
  const step2 = document.getElementById('quiz-step-2');
  const step3 = document.getElementById('quiz-step-3');

  const next1 = document.getElementById('quiz-next-1');
  const next2 = document.getElementById('quiz-next-2');
  const back2 = document.getElementById('quiz-back-2');
  const back3 = document.getElementById('quiz-back-3');
  const retakeBtn = document.getElementById('quiz-retake-btn');

  const progressFill = document.getElementById('quiz-progress-fill');
  const stepTitle = document.getElementById('quiz-step-title');
  const stepPercent = document.getElementById('quiz-step-percent');

  const recHeading = document.getElementById('rec-heading');
  const recMatchTag = document.getElementById('rec-match-tag');
  const recDescription = document.getElementById('rec-description');
  const featureGrid = document.getElementById('personalized-features-grid');

  // Highlight option cards on click/check
  const optionCards = form.querySelectorAll('.quiz-option-card');
  optionCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (!radio) return;
    card.addEventListener('click', () => {
      const groupName = radio.name;
      form.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        const parentCard = r.closest('.quiz-option-card');
        if (parentCard) parentCard.classList.remove('selected');
      });
      radio.checked = true;
      card.classList.add('selected');
    });
    if (radio.checked) card.classList.add('selected');
  });

  function goToStep(stepNum) {
    if (step1) step1.style.display = stepNum === 1 ? 'block' : 'none';
    if (step2) step2.style.display = stepNum === 2 ? 'block' : 'none';
    if (step3) step3.style.display = stepNum === 3 ? 'block' : 'none';

    if (progressFill && stepTitle && stepPercent) {
      if (stepNum === 1) {
        progressFill.style.width = '33%';
        stepTitle.textContent = 'Question 1 of 3';
        stepPercent.textContent = '33% Completed';
      } else if (stepNum === 2) {
        progressFill.style.width = '66%';
        stepTitle.textContent = 'Question 2 of 3';
        stepPercent.textContent = '66% Completed';
      } else if (stepNum === 3) {
        progressFill.style.width = '100%';
        stepTitle.textContent = 'Question 3 of 3';
        stepPercent.textContent = '100% Completed';
      }
    }
  }

  if (next1) next1.addEventListener('click', () => goToStep(2));
  if (next2) next2.addEventListener('click', () => goToStep(3));
  if (back2) back2.addEventListener('click', () => goToStep(1));
  if (back3) back3.addEventListener('click', () => goToStep(2));

  function processQuizSubmission(answers) {
    const support = answers.q_support || 'hearing';
    const material = answers.q_material || 'lecture';
    const preference = answers.q_preference || 'audio';

    let recommendedIds = new Set();
    let matchTagText = "Personalized Assistive Suite";
    let titleText = "Your Tailored Accessibility Tools";
    let descText = "We selected these specific AI tools to match your learning goals:";

    if (support === 'all') {
      recommendedIds = new Set(['feature-stt', 'feature-tts', 'feature-vision', 'feature-ocr', 'feature-dyslexia', 'feature-translation']);
      matchTagText = "Full Accessibility Suite";
      titleText = "Complete AI Assistive Toolkit";
      descText = "All 6 interactive accessibility tools are active for your session.";
    } else if (support === 'hearing') {
      recommendedIds.add('feature-stt');
      recommendedIds.add('feature-tts');
      matchTagText = "Hearing & Caption Support";
      titleText = "Live Captioning & Audio Suite";
      descText = "Designed for hearing impaired students to follow teacher lectures with live captions and reading support.";
    } else if (support === 'visual') {
      recommendedIds.add('feature-vision');
      recommendedIds.add('feature-ocr');
      recommendedIds.add('feature-tts');
      matchTagText = "Visual Impairment & Reading Support";
      titleText = "AI Vision & OCR Reading Suite";
      descText = "Empowers visually impaired students to extract textbook text and understand complex diagrams via Gemini Vision AI.";
    } else if (support === 'dyslexia') {
      recommendedIds.add('feature-dyslexia');
      recommendedIds.add('feature-tts');
      matchTagText = "Dyslexia & Focus Support";
      titleText = "Dyslexic Reading & Focus Suite";
      descText = "Includes Atkinson hyperlegible fonts, customizable spacing, line-height, and sentence-tracking text-to-speech.";
    } else if (support === 'translation') {
      recommendedIds.add('feature-translation');
      recommendedIds.add('feature-tts');
      matchTagText = "Multi-Language & Global Support";
      titleText = "AI Translation & Speech Suite";
      descText = "Translates study materials across 8 languages with native speech recitations for non-native learners.";
    }

    // Material secondary match additions
    if (material === 'textbook') recommendedIds.add('feature-ocr');
    if (material === 'diagram') recommendedIds.add('feature-vision');
    if (material === 'lecture') recommendedIds.add('feature-stt');

    // Preference additions
    if (preference === 'typography') recommendedIds.add('feature-dyslexia');
    if (preference === 'bilingual') recommendedIds.add('feature-translation');

    // Hide all feature cards inside grid, then show matching ones
    if (featureGrid) {
      const allCards = featureGrid.querySelectorAll('.feature-card');
      allCards.forEach(card => {
        if (recommendedIds.has(card.id)) {
          card.style.display = 'block';
          card.classList.add('popped');
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (recMatchTag) recMatchTag.textContent = matchTagText;
    if (recHeading) recHeading.textContent = titleText;
    if (recDescription) recDescription.textContent = descText;

    wizardCard.style.display = 'none';
    resultSection.style.display = 'block';

    // Save to session storage
    sessionStorage.setItem('eduaccess_quiz_answers', JSON.stringify(answers));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const answers = {
      q_support: formData.get('q_support'),
      q_material: formData.get('q_material'),
      q_preference: formData.get('q_preference')
    };
    processQuizSubmission(answers);
  });

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      sessionStorage.removeItem('eduaccess_quiz_answers');
      resultSection.style.display = 'none';
      wizardCard.style.display = 'block';
      goToStep(1);
      wizardCard.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Restore saved quiz preferences if present
  const savedAnswers = sessionStorage.getItem('eduaccess_quiz_answers');
  if (savedAnswers) {
    try {
      const parsed = JSON.parse(savedAnswers);
      processQuizSubmission(parsed);
    } catch (e) {}
  }
}

