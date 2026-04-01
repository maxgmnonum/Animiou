const I18N = {
  th: {
    appTitle: "ทายตัวละครอนิเมะ",
    loading: "กำลังโหลดข้อมูลจากฐานข้อมูล...",
    modeA: "เริ่มเกมทายตัวละคร (สุ่มจากทั้งโลก!)",
    modeB: "โหมดค้นหาข้อมูลตัวละคร (Database)",
    modeC: "ทายตัวละครเฉพาะเรื่อง (เลือกอนิเมะ!)",
    modeD: "ทายจากส่วนของภาพ (Zoom Guess!)",
    modeE: "ทายจากภาพ (Guess from Image!)",
    modeF: "ทายจากฉากในอนิเมะ (Anime Scene!)",
    guessPlaceholder: "พิมพ์ชื่อตัวละคร (ภาษาอังกฤษ/โรมาจิ)...",
    guessAnimePlaceholder: "พิมพ์ชื่ออนิเมะ (ภาษาอังกฤษ/โรมาจิ)...",
    searchPlaceholder: "ค้นหาชื่อตัวละครเพื่อดูประวัติ...",
    animePlaceholder: "พิมพ์ค้นหาชื่อเรื่องอนิเมะ (ภาษาอังกฤษ/โรมาจิ)...",
    hint1: "อนิเมะที่ปรากฏตัว",
    hint2: "ข้อมูลพื้นฐาน",
    hint3: "บุคลิกภาพ & ลักษณะเด่น",
    hint4: "ประวัติ & ความสามารถ",
    hint5: "รูปภาพ (เบลอ)",
    correct: "ถูกต้อง! แจ๋วมาก ตัวละครนี้คือ ",
    wrong: "ผิด! ลองดูคำใบ้อื่นประกอบ",
    nextHint: "ขอคำใบ้ต่อไป",
    reveal: "ยอมแพ้ (ดูเฉลย)",
    playAgain: "เล่นข้อถัดไป",
    nextQuestion: "ข้อถัดไป",
    noData: "ไม่มีข้อมูล",
    gender: "เพศ",
    age: "อายุ",
    birthday: "วันเกิด",
    backMenu: "กลับสู่เมนูหลัก",
    difficulty: "ระดับความยาก:",
    diffEasy: "ง่าย (ตัวละครยอดฮิต)",
    diffMedium: "ปานกลาง (ตัวละครรอง)",
    diffHard: "ยาก (ลึก/ตัวประกอบ)",
    ansMode: "รูปแบบการตอบ:",
    ansTyping: "พิมพ์ตอบ (ค้นหา)",
    ansChoices: "4 ตัวเลือก",
    timer: "ตัวจับเวลา:",
    timerOff: "ปิด",
    timer15s: "15 วินาที",
    timer30s: "30 วินาที",
    timer60s: "60 วินาที",
    timesUp: "หมดเวลา! ตัวละครนี้คือ ",
    startModeCBtn: "เริ่มเกมจากเรื่องนี้"
  },
  en: {
    appTitle: "Anime Guess",
    loading: "Loading from Database...",
    modeA: "Global Random Guessing",
    modeB: "Character Database",
    modeC: "Specific Anime Guessing",
    modeD: "Guess from Part (Zoom Guess!)",
    modeE: "Guess from Image (Minimal Blur!)",
    modeF: "Guess Anime Scene (Landscape!)",
    guessPlaceholder: "Type character name (Romaji/English)...",
    guessAnimePlaceholder: "Type anime title (Romaji/English)...",
    searchPlaceholder: "Search character name...",
    animePlaceholder: "Type anime title to search...",
    hint1: "Appears in (Anime)",
    hint2: "Basic Info",
    hint3: "Personality & Traits",
    hint4: "Background & Abilities",
    hint5: "Blurred Image",
    correct: "Correct! The character is ",
    wrong: "Wrong! Try another hint.",
    nextHint: "Next Hint",
    reveal: "Give Up",
    playAgain: "Next Question",
    nextQuestion: "Next Question",
    noData: "No Data",
    gender: "Gender",
    age: "Age",
    birthday: "Birthday",
    backMenu: "Back to Menu",
    difficulty: "Difficulty:",
    diffEasy: "Easy (Popular)",
    diffMedium: "Medium",
    diffHard: "Hard (Obscure)",
    ansMode: "Answer Mode:",
    ansTyping: "Typing & Search",
    ansChoices: "Multiple Choice (4)",
    timer: "Timer:",
    timerOff: "Off",
    timer15s: "15s",
    timer30s: "30s",
    timer60s: "60s",
    timesUp: "Time's Up! The character was ",
    startModeCBtn: "Start With This Anime"
  }
};

let state = {
  lang: 'th',
  mode: null,          // 'A', 'B', 'C_SETUP', 'C', 'D', 'E'
  difficulty: 'EASY',  // 'EASY', 'MEDIUM', 'HARD'
  answerMode: 'TYPING',// 'TYPING', 'CHOICES'
  timerSetting: 0,     // 0, 15, 30, 60
  timeLeft: 0,
  timerInterval: null,
  character: null,
  currentAnime: null,    // for Mode F
  choices: [],         // for multiple choice
  wrongChoices: [],    // track wrong choices in multiple choice mode
  selectedAnime: null, // for mode C
  hintsUnlocked: 1,
  statusMsg: '',
  isWon: false,
  isRevealed: false,
  isLoading: false,
  guessTimeout: null,
  nextGameTimeout: null
};

const elements = {
  appTitle: document.getElementById('app-title'),
  langSelect: document.getElementById('lang-select'),
  mainContent: document.getElementById('main-content'),
  overlay: document.getElementById('loading-overlay')
};

// --- DYNAMIC BACKGROUND MANAGER ---
const BackgroundManager = {
  banners: [],
  currentIndex: 0,
  layers: [
    document.querySelector('.bg-layer-1'),
    document.querySelector('.bg-layer-2')
  ],
  activeLayer: 0,
  interval: null,

  async init() {
    await this.fetchBanners();
    this.startCycling();
  },

  async fetchBanners() {
    try {
      // Fetch high-quality animated anime GIFs from a reliable API
      // Using 'sleep' category as it typically has peaceful, aesthetic backgrounds
      const res = await fetch("https://nekos.best/api/v2/sleep?amount=20");
      const data = await res.json();
      this.banners = data.results.map(r => r.url);
      
      // Shuffle banners to ensure a fresh experience
      this.banners = shuffleArray([...this.banners]);
    } catch (e) {
      console.error("Failed to fetch background GIFs:", e);
      // Fallback stable URLs
      this.banners = [
        "https://github.com/JoshuaThadi/Wall-E-Desk/raw/main/Live%20Wallpapers/giphy.gif",
        "https://github.com/JoshuaThadi/Wall-E-Desk/raw/main/Live%20Wallpapers/wallpaper.gif"
      ];
    }
  },

  startCycling() {
    if (this.banners.length === 0) return;
    
    // Set initial background
    this.updateBackground();
    
    // Cycle every 20 seconds
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      this.updateBackground();
      
      // Refresh banners every full cycle
      if (this.currentIndex === 0) {
        this.fetchBanners();
      }
    }, 20000);
  },

  updateBackground() {
    if (this.banners.length === 0) return;
    const url = this.banners[this.currentIndex];
    const nextLayer = 1 - this.activeLayer;
    
    // Preload image before switching
    const img = new Image();
    img.src = url;
    
    const applyUpdate = () => {
      this.layers[nextLayer].style.backgroundImage = `url(${url})`;
      this.layers[this.activeLayer].classList.remove('active');
      this.layers[nextLayer].classList.add('active');
      this.activeLayer = nextLayer;
    };

    if (img.complete) {
      applyUpdate();
    } else {
      img.onload = applyUpdate;
      // Also apply after a short timeout if onload is slow to avoid freezing
      setTimeout(applyUpdate, 2000); 
    }
  }
};

function init() {
  BackgroundManager.init();
  elements.langSelect.addEventListener('change', (e) => {
    state.lang = e.target.value;
    if (state.mode === 'B') Game.startModeB();
    else if (state.mode === 'C_SETUP') Game.startModeCSetup();
    else if (!state.mode) renderUI();
    else {
      this.stopTimer();
      Game.renderPlayArea();
    }
  });
  renderUI();
}

function t(key) { return I18N[state.lang][key] || key; }

async function translateText(text) {
  if (!text || text.length < 2) return t("noData");
  if (state.lang === 'en') return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${state.lang}&dt=t&q=${encodeURIComponent(text.substring(0, 1500))}`;
    const res = await fetch(url);
    const json = await res.json();
    let translated = json[0].map(item => item[0]).join('');
    return translated.replace(/\[ \?\?\? \]/g, "[???]");
  } catch (error) {
    return text;
  }
}

function toggleLoading(show) {
  state.isLoading = show;
  if (show) elements.overlay.classList.remove('hidden');
  else elements.overlay.classList.add('hidden');
}

async function fetchGraphql(query, variables) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  
  const data = await response.json();
  if (!response.ok || data.errors) {
    const msg = data.errors ? data.errors[0].message : `HTTP ${response.status}`;
    throw new Error(`API Error: ${msg}`);
  }
  return data;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Game = {

  updateSettings(key, value) {
    state[key] = value;
  },

  // --- MODE A: GUESSING GAME (GLOBAL) ---
  async startModeA() {
    state.mode = 'A';
    await this.initGameCommon();
  },

  // --- MODE D: GUESS FROM PART (ZOOM) ---
  async startModeD() {
    state.mode = 'D';
    await this.initGameCommon();
  },

  // --- MODE E: SILHOUETTE GUESS ---
  async startModeE() {
    state.mode = 'E';
    await this.initGameCommon();
  },

  // --- MODE F: ANIME SCENE GUESS ---
  async startModeF() {
    state.mode = 'F';
    await this.initGameCommon();
  },

  // --- MODE C: ANIME SPECIFIC GUESSING ---
  startModeCSetup() {
    state.mode = 'C_SETUP';
    state.selectedAnime = null;

    elements.mainContent.innerHTML = `
      <div class="game-container" style="animation: slideIn 0.5s ease;">
          <div style="display: flex; justify-content: space-between; align-items:center;">
            <h2 style="font-size: 1.25rem;">${t('modeC')}</h2>
            <span style="font-size:0.9rem; color:var(--text-secondary); cursor:pointer;" onclick="Game.exit()">< ${t('backMenu')}</span>
          </div>
          <p style="color:var(--text-secondary); font-size:0.9rem;">
             ${state.lang === 'th' ? 'ค้นหาชื่ออนิเมะที่คุณต้องการทายตัวละคร แล้วกดเริ่มเกมได้เลย!' : 'Search for an anime, then start guessing its characters!'}
          </p>
          <div class="input-group" style="margin-top: 15px;">
              <input type="text" id="anime-input" class="input-field" placeholder="${t('animePlaceholder')}" autocomplete="off" />
              <div id="autocomplete-results" class="autocomplete-dropdown hidden"></div>
          </div>
          <div id="selected-anime-display" class="hidden" style="margin-top: 20px; text-align:center; padding: 15px; border-radius: 12px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--primary-color);">
             <img id="sel-anime-img" style="width: 80px; border-radius: 8px; margin-bottom: 10px;" />
             <h3 id="sel-anime-title" style="color: var(--primary-color);"></h3>
             <button class="btn btn-primary" style="margin-top: 15px;" onclick="Game.startModeC()">${t('startModeCBtn')}</button>
          </div>
      </div>
    `;
    this.attachAutocomplete('selectAnime', 'ANIME', 'anime-input');
  },

  selectAnime(id, title, imgUrl) {
    document.getElementById('autocomplete-results').classList.add('hidden');
    document.getElementById('anime-input').value = title;
    state.selectedAnime = { id: parseInt(id), title, img: imgUrl };

    const disp = document.getElementById('selected-anime-display');
    disp.classList.remove('hidden');
    document.getElementById('sel-anime-img').src = imgUrl;
    document.getElementById('sel-anime-title').innerText = title;
  },

  async startModeC() {
    state.mode = 'C';
    await this.initGameCommon();
  },

  async initGameCommon() {
    if (state.nextGameTimeout) clearTimeout(state.nextGameTimeout);
    state.isWon = false;
    state.isRevealed = false;
    state.statusMsg = '';
    state.choices = [];
    state.wrongChoices = [];
    toggleLoading(true);

    try {
      let characters = [];
      let query = '';
      let variables = {};

      if (state.mode === 'F') {
        query = `
            query ($pageIndex: Int) {
              Page(page: $pageIndex, perPage: 50) {
                media(sort: POPULARITY_DESC, type: ANIME) {
                  id
                  title { romaji english userPreferred }
                  bannerImage
                  coverImage { extraLarge }
                  description
                }
              }
            }
          `;
        variables = { pageIndex: Math.floor(Math.random() * 20) + 1 };
        const resF = await fetchGraphql(query, variables);
        // Prioritize bannerImage (scenery/scenearios) over coverImage
        let mediaList = resF.data.Page.media.filter(m => m.bannerImage);
        if (mediaList.length === 0) mediaList = resF.data.Page.media.filter(m => m.coverImage.extraLarge);
        
        state.currentAnime = mediaList[Math.floor(Math.random() * mediaList.length)];
        state.character = { 
          id: state.currentAnime.id, 
          name: state.currentAnime.title.userPreferred || state.currentAnime.title.romaji, 
          image: state.currentAnime.bannerImage || state.currentAnime.coverImage.extraLarge 
        };

        if (state.answerMode === 'CHOICES') {
          let distractors = mediaList.filter(m => m.id !== state.character.id);
          distractors = shuffleArray(distractors).slice(0, 3);
          
          let allOpts = [
            { id: state.character.id, name: state.character.name, correct: true },
            ...distractors.map(d => ({ 
              id: d.id, 
              name: d.title.userPreferred || d.title.romaji, 
              correct: false 
            }))
          ];
          state.choices = shuffleArray(allOpts);
        }
      } else if (state.mode === 'A' || state.mode === 'D' || state.mode === 'E') {
        let pageMin = 1, pageMax = 20;
        if (state.difficulty === 'MEDIUM') { pageMin = 21; pageMax = 150; }
        if (state.difficulty === 'HARD') { pageMin = 151; pageMax = 200; }
        const randomPage = Math.floor(Math.random() * (pageMax - pageMin + 1)) + pageMin;

        query = `
            query ($page: Int) {
              Page(page: $page, perPage: 20) {
                characters(sort: FAVOURITES_DESC) {
                  id name { full userPreferred } image { large } description gender age
                  media(type: ANIME, perPage: 1) { nodes { title { romaji english } } }
                }
              }
            }
          `;
        variables = { page: randomPage };
        const res = await fetchGraphql(query, variables);
        characters = res.data.Page.characters.filter(c => c.description && c.media.nodes.length > 0);

      } else if (state.mode === 'C') {
        query = `
            query ($id: Int, $page: Int) {
              Media(id: $id, type: ANIME) {
                characters(page: $page, perPage: 15) {
                  nodes {
                    id name { full userPreferred } image { large } description gender age
                  }
                }
              }
            }
          `;
        variables = { id: state.selectedAnime.id, page: 1 };
        if (state.difficulty === 'MEDIUM') variables.page = 2;
        if (state.difficulty === 'HARD') variables.page = 3;

        const res = await fetchGraphql(query, variables);
        characters = res.data.Media.characters.nodes.filter(c => c.description);

        if (characters.length < 4 && variables.page > 1) {
          variables.page = 1;
          const resFB = await fetchGraphql(query, variables);
          characters = resFB.data.Media.characters.nodes.filter(c => c.description);
        }
      }

      if (state.mode !== 'F') {
        if (characters.length === 0) throw new Error("Not enough character data found.");
        const chosen = characters[Math.floor(Math.random() * characters.length)];
        state.character = chosen;
        // Keep the original name object for hints, but store the display name in a separate field
        state.character.displayName = chosen.name.userPreferred || chosen.name.full;
        state.character.image = chosen.image.large;

        if (state.answerMode === 'CHOICES') {
          let distractors = characters.filter(c => c.id !== state.character.id);
          distractors = shuffleArray(distractors).slice(0, 3);

          if (distractors.length < 3) {
            const fbQuery = `query { Page(page: ${Math.floor(Math.random() * 100) + 1}, perPage: 10) { characters(sort: FAVOURITES_DESC) { id name { full userPreferred } } } }`;
            const fbRes = await fetchGraphql(fbQuery, {});
            const extraDocs = fbRes.data.Page.characters.filter(c => c.id !== state.character.id);
            while (distractors.length < 3 && extraDocs.length > 0) {
              distractors.push(extraDocs.pop());
            }
          }

          let allOpts = [
            { id: state.character.id, name: state.character.displayName, correct: true },
            ...distractors.map(d => ({ id: d.id, name: d.name.full || d.name.userPreferred, correct: false }))
          ];
          state.choices = shuffleArray(allOpts);
        }
        await this.prepareCharacterHints(state.character);
        // After hints are prepared, we can unify the name property
        state.character.name = state.character.displayName;
      } else {
        // For Mode F, state.character.name is already set as the anime title
      }
      
      if (state.mode === 'D') {
        state.character.zoomPos = { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 };
      }

      state.hintsUnlocked = 1;
      this.renderPlayArea();
      this.startTimer();
    } catch (e) {
      alert("Error starting game: " + e.message);
      if (state.mode === 'C') this.startModeCSetup(); else renderUI();
    }
    toggleLoading(false);
  },

  async prepareCharacterHints(charData) {
    const animeEn = charData.media?.nodes?.[0]?.title?.english || charData.media?.nodes?.[0]?.title?.romaji || state.selectedAnime?.title || "Unknown";
    const gender = charData.gender ? `${t('gender')}: ${charData.gender}` : '';
    const age = charData.age ? `${t('age')}: ${charData.age}` : '';
    let basics = [gender, age].filter(Boolean).join(' | ');
    if (!basics) basics = t('noData');

    let rawDesc = charData.description || "";
    const nameFull = charData.name?.full || "";
    const nameUser = charData.name?.userPreferred || "";
    const names = [nameFull, nameUser, ...nameFull.split(' ')].filter(Boolean).filter(n => n.length > 2);
    names.forEach(n => {
      const safeN = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      rawDesc = rawDesc.replace(new RegExp(safeN, 'gi'), "[???]");
    });
    rawDesc = rawDesc.replace(/~![\s\S]*?!~/g, "[Spoilers Redacted]").replace(/__/g, "");

    const paragraphs = rawDesc.split('\n').filter(p => p.trim().length > 10);
    const hint3EN = paragraphs.length > 0 ? paragraphs[0] : "A mysterious character.";
    const hint4EN = paragraphs.length > 1 ? paragraphs.slice(1, 4).join(' ') : "No deeper background available.";

    let [hint3Text, hint4Text, basicsText] = await Promise.all([translateText(hint3EN), translateText(hint4EN), translateText(basics)]);

    let animeHint = animeEn;
    if (state.mode === 'C') animeHint = `${t('hint1')}: ${animeEn} (You already selected this!)`;

    state.character = {
      ...state.character,
      hints: [animeHint, basicsText, hint3Text, hint4Text]
    };
  },
  
  // --- TIMER LOGIC ---
  startTimer() {
    this.stopTimer();
    if (state.timerSetting <= 0) return;
    
    state.timeLeft = state.timerSetting;
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      this.updateTimerUI();
      
      if (state.timeLeft <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  },

  stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  },

  updateTimerUI() {
    const bar = document.getElementById('timer-bar');
    if (!bar) return;
    const percent = (state.timeLeft / state.timerSetting) * 100;
    bar.style.width = `${percent}%`;
    if (state.timeLeft <= 5) bar.classList.add('timer-warn');
    else bar.classList.remove('timer-warn');
  },

  handleTimeUp() {
    this.stopTimer();
    if (state.isWon || state.isRevealed) return;
    
    state.hintsUnlocked = 5;
    state.isRevealed = true;
    state.statusMsg = `<span class="status-error">${t('timesUp')}${state.character.name}</span>`;
    this.renderPlayArea();
  },

  renderPlayArea() {
    let hintsHtml = '';
    const maxHints = 4;
    for (let i = 0; i < Math.min(state.hintsUnlocked, maxHints); i++) {
      hintsHtml += `
            <div class="hint-box">
                <p style="color:var(--primary-color); font-weight: bold; font-size: 0.85rem; margin-bottom: 4px;">[ ${t('hint' + (i + 1))} ]</p>
                <p>${state.character.hints ? state.character.hints[i] : '...'}</p>
            </div>
        `;
    }

    let imageHtml = '';
    if (state.mode === 'D') {
      // Zoom Logic for Mode D
      let zoomClass = 'zoom-1x';
      let blurClass = 'blur-none';
      let showLabel = true;

      if (state.hintsUnlocked === 1) zoomClass = 'zoom-4x';
      else if (state.hintsUnlocked === 2) zoomClass = 'zoom-2x';
      else if (state.hintsUnlocked === 5 && !state.isWon && !state.isRevealed) {
        zoomClass = 'zoom-1x';
        blurClass = 'blur-max';
      }

      const style = `object-position: ${state.character.zoomPos.x}% ${state.character.zoomPos.y}%`;
      
      imageHtml = `
            <div class="zoom-container" style="margin-top: 10px;">
                <img src="${state.character.image}" class="zoom-image ${zoomClass} ${blurClass}" style="${style}" id="char-img-display" alt="Character" />
            </div>
            ${(!state.isWon && !state.isRevealed & state.hintsUnlocked <= 2) ? `<p style="text-align: center; color: var(--primary-color); margin-top: 8px; font-weight:bold;">${t('hint' + state.hintsUnlocked)}</p>` : ''}
        `;
    } else if (state.mode === 'F') {
      let blurClass = 'blur-none';
      imageHtml = `
            <div class="scene-container" style="margin-top: 10px;">
                <img src="${state.character.image}" class="char-image ${blurClass}" id="char-img-display" alt="Scene" />
            </div>
        `;
    } else {
      let isMinimalBlur = (state.mode === 'E' && !state.isWon && !state.isRevealed);
      let blurClass = (state.isWon || state.isRevealed) ? 'blur-none' : (isMinimalBlur ? 'blur-low' : 'blur-max');
      
      const isNormalCharMode = (state.mode === 'A' || state.mode === 'C');
      const canShowImg = (state.hintsUnlocked >= 5 || state.isWon || state.isRevealed);

      if (isNormalCharMode && !canShowImg) {
        imageHtml = `
              <div class="char-image-container" style="margin-top: 10px; display:flex; justify-content:center; align-items:center; background:rgba(255,255,255,0.03); border:1px dashed var(--glass-border);">
                  <div style="text-align:center; color:var(--text-secondary); padding: 20px;">
                      <div style="font-size:2rem; margin-bottom:10px; opacity:0.3;">🖼️</div>
                      <p style="font-size:0.85rem; font-weight:bold; color:var(--primary-color);">${t('hint5')}</p>
                      <p style="font-size:0.75rem; margin-top:5px; opacity:0.7;">${state.lang === 'th' ? 'จะปลดล็อกเมื่อถึงคำใบ้ที่ 5' : 'Hidden until Hint 5'}</p>
                  </div>
              </div>
          `;
      } else {
        imageHtml = `
              <div class="char-image-container" style="margin-top: 10px;">
                  <img src="${state.character.image}" class="char-image ${blurClass}" id="char-img-display" alt="Character" />
              </div>
              ${(!state.isWon && !state.isRevealed && state.mode !== 'E') ? `<p style="text-align: center; color: var(--text-secondary); margin-top: 8px;">${t('hint5')}</p>` : ''}
          `;
      }
    }

    const disableAction = state.isWon || state.isRevealed ? "disabled" : "";

    let headingTitle = state.mode === 'A' ? t('modeA') : (state.mode === 'D' ? t('modeD') : (state.mode === 'E' ? t('modeE') : (state.mode === 'F' ? t('modeF') : (t('modeC') + ': ' + state.selectedAnime?.title))));

    let timerHtml = '';
    if (state.timerSetting > 0 && !state.isWon && !state.isRevealed) {
      const percent = (state.timeLeft / state.timerSetting) * 100;
      timerHtml = `
          <div class="timer-container" style="margin-top: 10px;">
            <div id="timer-bar" class="timer-bar ${state.timeLeft <= 5 ? 'timer-warn' : ''}" style="width: ${percent}%;"></div>
          </div>
      `;
    }

    let html = `
        <div class="game-container">
            <div style="display: flex; justify-content: space-between; align-items:flex-start;">
              <h2 style="font-size: 1.15rem; max-width:80%; line-height:1.4;">${headingTitle}</h2>
              <span style="font-size:0.9rem; color:var(--text-secondary); cursor:pointer; min-width:60px; text-align:right;" onclick="Game.exit()">< ${t('backMenu')}</span>
            </div>
            
            ${timerHtml}

            ${(state.mode === 'E' || state.mode === 'F') ? '' : `
              <div id="hints-container" style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                  ${hintsHtml}
              </div>
            `}
            ${imageHtml}
    `;

    if (!state.isWon && !state.isRevealed && state.hintsUnlocked < 5 && state.mode !== 'E' && state.mode !== 'F') {
      html += `<div style="display: flex; gap: 10px; margin-top: 15px;">
                  <button class="btn btn-accent" onclick="Game.unlockNextHint()">${t('nextHint')} (${state.hintsUnlocked}/5)</button>
                 </div>`;
    }

    // Input area based on answer mode
    if (state.answerMode === 'TYPING') {
      const placeholder = state.mode === 'F' ? t('guessAnimePlaceholder') : t('guessPlaceholder');
      html += `
                <div class="input-group" style="margin-top: 15px;">
                    <input type="text" id="guess-input" class="input-field" placeholder="${placeholder}" autocomplete="off" ${disableAction} />
                    <div id="autocomplete-results" class="autocomplete-dropdown hidden"></div>
                    <div id="status-message" class="status-message">${state.statusMsg}</div>
                </div>
        `;
    } else {
      let choicesHtml = state.choices.map((c, idx) => {
        let extraClass = '';
        let isChoiceDisabled = state.isWon || state.isRevealed;
        
        if (state.wrongChoices.includes(idx)) {
          extraClass = 'choice-wrong';
          isChoiceDisabled = true;
        }
        
        if (state.isWon || state.isRevealed) {
          if (c.correct) extraClass = 'choice-correct';
        }
        
        const btnDisabled = isChoiceDisabled ? "disabled" : "";
        return `<button class="choice-btn ${extraClass}" onclick="Game.submitChoice(${idx})" ${btnDisabled}>${c.name}</button>`;
      }).join('');

      html += `
            <div class="choices-grid">
                ${choicesHtml}
            </div>
            <div id="status-message" class="status-message">${state.statusMsg}</div>
        `;
    }

    if (!state.isWon && !state.isRevealed) {
      html += `<button class="btn" style="background:transparent; border:1px solid var(--danger-color); color:var(--danger-color); margin-top:5px;" onclick="Game.revealAnswer()">${t('reveal')}</button>`;
    } else {
      let nextAction = 'startModeA';
      if (state.mode === 'D') nextAction = 'startModeD';
      else if (state.mode === 'E') nextAction = 'startModeE';
      else if (state.mode === 'F') nextAction = 'startModeF';
      else if (state.mode === 'C') nextAction = 'startModeC';
      
      html += `<button class="btn" style="background:var(--success-color); border:none; margin-top:10px;" onclick="Game.${nextAction}()">${t('nextQuestion')}</button>`;
    }
    html += `</div>`;

    elements.mainContent.innerHTML = html;

    if (!state.isWon && !state.isRevealed && state.answerMode === 'TYPING') {
      this.attachAutocomplete('submitGuess', state.mode === 'F' ? 'ANIME' : 'CHARACTER');
    }
  },

  unlockNextHint() {
    if (state.hintsUnlocked < 5) { state.hintsUnlocked++; this.renderPlayArea(); }
  },

  revealAnswer() {
    this.stopTimer();
    state.hintsUnlocked = 5; state.isRevealed = true; state.statusMsg = `<span class="status-error">${state.character.name}</span>`; this.renderPlayArea();
  },

  handleWin() {
    this.stopTimer();
    state.hintsUnlocked = 5; state.isWon = true; state.statusMsg = `<span class="status-success">${t('correct')} ${state.character.name}!</span>`; this.renderPlayArea();
  },

  submitGuess(guessedId, guessedName) {
    document.getElementById('autocomplete-results').classList.add('hidden');
    const input = document.getElementById('guess-input');
    input.value = guessedName;

    if (parseInt(guessedId) === state.character.id) {
      this.handleWin();
    } else {
      this.showErrorTemp();
      input.value = '';
    }
  },

  submitChoice(idx) {
    const choice = state.choices[idx];
    if (choice.correct) {
      this.handleWin();
    } else {
      if (!state.wrongChoices.includes(idx)) {
        state.wrongChoices.push(idx);
      }
      
      // Show result and wait for user to click next
      state.hintsUnlocked = 5; 
      state.isRevealed = true; 
      state.statusMsg = `<span class="status-error">${t('wrong')}</span>`;
      this.renderPlayArea();
    }
  },

  showErrorTemp() {
    state.statusMsg = `<span class="status-error">${t('wrong')}</span>`;
    if (state.answerMode === 'CHOICES') {
      this.renderPlayArea();
    } else {
      const statusEl = document.getElementById('status-message');
      if (statusEl) statusEl.innerHTML = state.statusMsg;
    }

    setTimeout(() => {
      if (!state.isWon && !state.isRevealed) {
        state.statusMsg = '';
        if (state.answerMode === 'CHOICES') {
          this.renderPlayArea();
        } else {
          const statusEl = document.getElementById('status-message');
          if (statusEl) statusEl.innerHTML = '';
        }
      }
    }, 1500);
  },

  // --- MODE B: DATABASE EXPLORER ---
  startModeB() {
    state.mode = 'B';
    elements.mainContent.innerHTML = `
        <div class="game-container" style="animation: slideIn 0.5s ease;">
            <div style="display: flex; justify-content: space-between; align-items:center;">
              <h2 style="font-size: 1.25rem;">${t('modeB')}</h2>
              <span style="font-size:0.9rem; color:var(--text-secondary); cursor:pointer;" onclick="Game.exit()">< ${t('backMenu')}</span>
            </div>
            
            <p style="color:var(--text-secondary); font-size:0.9rem;">${state.lang === 'th' ? 'ค้นหาตัวละครอนิเมะเพื่อดูรูปภาพและประวัติ (ฐานข้อมูล AniList)' : 'Search for a character to view their image and bio.'}</p>
            
            <div class="input-group" style="margin-top: 15px;">
                <input type="text" id="db-input" class="input-field" placeholder="${t('searchPlaceholder')}" autocomplete="off" />
                <div id="autocomplete-results" class="autocomplete-dropdown hidden"></div>
            </div>
            
            <div id="db-char-details" style="margin-top: 20px;"></div>
        </div>
      `;
    this.attachAutocomplete('viewCharacter', 'CHARACTER', 'db-input');
  },

  async viewCharacter(id, name) {
    document.getElementById('autocomplete-results').classList.add('hidden');
    document.getElementById('db-input').value = name;
    const detailsContainer = document.getElementById('db-char-details');
    detailsContainer.innerHTML = `<div class="spinner" style="margin:20px auto;"></div>`;

    try {
      const query = `
            query ($id: Int) {
              Character(id: $id) {
                name { full } image { large } description gender age
                media(sort: POPULARITY_DESC, type: ANIME, perPage: 2) { nodes { title { romaji english } } }
              }
            }
          `;
      const res = await fetchGraphql(query, { id: parseInt(id) });
      const char = res.data.Character;

      let desc = char.description || "";
      desc = desc.replace(/~![\s\S]*?!~/g, "[Spoilers Redacted]").replace(/__/g, "");
      let translatedDesc = await translateText(desc);

      detailsContainer.innerHTML = `
            <div class="char-image-container" style="max-width:200px; border-radius:12px;">
                <img src="${char.image.large}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
            <h3 style="text-align:center; margin-top:15px; font-size:1.5rem; color:var(--primary-color);">${char.name.full}</h3>
              <p style="text-align:center; color:var(--text-secondary); margin-bottom:15px;">
                ${char.media.nodes.map(n => n.title?.english || n.title?.romaji).join(', ')}
            </p>
            <div class="hint-box" style="opacity:1; transform:none; animation:none; font-size:0.9rem;">
                <p><strong>${t('gender')}:</strong> ${char.gender || t('noData')}</p>
                <p><strong>${t('age')}:</strong> ${char.age || t('noData')}</p>
                <div style="margin-top:10px; line-height:1.5; white-space:pre-wrap;">${translatedDesc}</div>
            </div>
          `;
    } catch (err) {
      detailsContainer.innerHTML = `<p style="color:var(--danger-color)">Error loading data.</p>`;
    }
  },

  // --- REUSABLE AUTOCOMPLETE LOGIC ---
  attachAutocomplete(callbackName, searchType = 'CHARACTER', inputId = 'guess-input') {
    const input = document.getElementById(inputId);
    const resultsDiv = document.getElementById('autocomplete-results');
    if (!input || !resultsDiv) return;

    input.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length < 3) {
        resultsDiv.classList.add('hidden');
        return;
      }
      if (state.guessTimeout) clearTimeout(state.guessTimeout);

      state.guessTimeout = setTimeout(async () => {
        let query = '';
        if (searchType === 'CHARACTER') {
          query = `query ($search: String) { Page(page:1, perPage: 6) { characters(search: $search) { id name { full } image { medium } } } }`;
        } else {
          query = `query ($search: String) { Page(page:1, perPage: 6) { media(search: $search, type: ANIME) { id title { english romaji } coverImage { medium } } } }`;
        }

        try {
          const res = await fetchGraphql(query, { search: val });
          let items = [];
          if (searchType === 'CHARACTER') items = res.data.Page.characters.map(c => ({ id: c.id, name: c.name.full, img: c.image.medium }));
          else items = res.data.Page.media.map(m => ({ id: m.id, name: m.title.english || m.title.romaji, img: m.coverImage.medium }));

          if (items.length > 0) {
            resultsDiv.innerHTML = items.map(c => {
              const safeName = c.name.replace(/'/g, "\\'").replace(/"/g, "&quot;");
              return `
                          <div class="autocomplete-item" onclick="Game.${callbackName}(${c.id}, '${safeName}', '${c.img}')">
                              <img src="${c.img}" class="autocomplete-img" />
                              <span style="color:var(--text-primary)">${c.name}</span>
                          </div>
                      `}).join('');
            resultsDiv.classList.remove('hidden');
          } else {
            resultsDiv.innerHTML = `<div class="autocomplete-item" style="justify-content:center;">${t('noData')}</div>`;
            resultsDiv.classList.remove('hidden');
          }
        } catch (err) { console.error(err); }
      }, 400);
    });
  },

  exit() {
    if (state.nextGameTimeout) clearTimeout(state.nextGameTimeout);
    this.stopTimer();
    state.mode = null;
    renderUI();
  }
};

function renderUI() {
  elements.appTitle.innerText = t("appTitle");

  if (!state.mode) {
    elements.mainContent.innerHTML = `
      <div class="menu-options" style="animation: slideIn 0.5s ease;">
        
        <div class="settings-group">
           <div class="setting-item">
              <label>${t('difficulty')}</label>
              <select onchange="Game.updateSettings('difficulty', this.value)">
                 <option value="EASY" ${state.difficulty === 'EASY' ? 'selected' : ''}>${t('diffEasy')}</option>
                 <option value="MEDIUM" ${state.difficulty === 'MEDIUM' ? 'selected' : ''}>${t('diffMedium')}</option>
                 <option value="HARD" ${state.difficulty === 'HARD' ? 'selected' : ''}>${t('diffHard')}</option>
              </select>
           </div>
           <div class="setting-item">
              <label>${t('ansMode')}</label>
              <select onchange="Game.updateSettings('answerMode', this.value)">
                 <option value="TYPING" ${state.answerMode === 'TYPING' ? 'selected' : ''}>${t('ansTyping')}</option>
                 <option value="CHOICES" ${state.answerMode === 'CHOICES' ? 'selected' : ''}>${t('ansChoices')}</option>
              </select>
           </div>
           <div class="setting-item">
              <label>${t('timer')}</label>
              <select onchange="Game.updateSettings('timerSetting', parseInt(this.value))">
                 <option value="0" ${state.timerSetting === 0 ? 'selected' : ''}>${t('timerOff')}</option>
                 <option value="15" ${state.timerSetting === 15 ? 'selected' : ''}>${t('timer15s')}</option>
                 <option value="30" ${state.timerSetting === 30 ? 'selected' : ''}>${t('timer30s')}</option>
                 <option value="60" ${state.timerSetting === 60 ? 'selected' : ''}>${t('timer60s')}</option>
              </select>
           </div>
        </div>

        <button class="btn btn-primary" onclick="Game.startModeA()">
          🪄 ${t("modeA")}
        </button>
        <button class="btn btn-accent" onclick="Game.startModeCSetup()">
          🎯 ${t("modeC")}
        </button>
        <button class="btn" style="border-image: linear-gradient(45deg, var(--primary-color), var(--accent-color)) 1; border-color: transparent; margin-top:10px;" onclick="Game.startModeD()">
          🔍 ${t("modeD")}
        </button>
        <button class="btn" style="border:1px solid var(--accent-color); color:var(--accent-color); background:transparent; margin-top:10px;" onclick="Game.startModeE()">
          🖼️ ${t("modeE")}
        </button>
        <button class="btn" style="border:1px solid var(--primary-color); color:var(--primary-color); background:transparent; margin-top:10px;" onclick="Game.startModeF()">
          🎬 ${t("modeF")}
        </button>
        <button class="btn" style="border-color: var(--primary-color); margin-top:10px;" onclick="Game.startModeB()">
          📚 ${t("modeB")}
        </button>
      </div>
    `;
  }
}

window.Game = Game;
window.renderUI = renderUI;

init();
