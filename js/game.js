
const Game = (() => {
  const state = {
    language: "id",
    currentPart: 1,
    currentLevel: 1,
    currentQuestion: 1,
    lives: 3,
    stars: 0,
    usedClues: [],
    selectedPlayer: null,
    questions: []
  };

  const translations = {
    id: {
      parts: "Bagian",
      levels: "Level",
      lives: "Nyawa",
      stars: "Bintang",
      question: "Pertanyaan",
      clue: "Petunjuk",
      answer: "Nama pemain",
      placeholder: "Ketik nama pemain di sini...",
      submit: "Periksa Jawaban",
      next: "Lanjut",
      back: "Kembali",
      correct: "Benar! Tebakanmu tepat!",
      incorrect: "Belum tepat. Coba lagi!",
      noClues: "Belum ada petunjuk tersedia.",
      demo: "Contoh permainan",
      locked: "Level terkunci",
      chooseLevel: "Pilih Level",
      gameTitle: "Tebak Pemain Sepakbola"
    },

    en: {
      parts: "Part",
      levels: "Level",
      lives: "Lives",
      stars: "Stars",
      question: "Question",
      clue: "Clue",
      answer: "Player name",
      placeholder: "Type the player's name here...",
      submit: "Check Answer",
      next: "Next",
      back: "Back",
      correct: "Correct! You got it!",
      incorrect: "Not quite. Try again!",
      noClues: "No clues are available yet.",
      demo: "Game preview",
      locked: "Level locked",
      chooseLevel: "Choose Level",
      gameTitle: "Guess the Footballer"
    }
  };

  function t(key) {
    return translations[state.language][key] || key;
  }

  function setLanguage(language) {
    if (!translations[language]) return;

    state.language = language;
  }

  function setProgress(part, level) {
    if (part < 1 || part > 5) {
      throw new Error("Bagian harus antara 1 dan 5.");
    }

    const maxLevel = part === 1 ? 4 : 5;

    if (level < 1 || level > maxLevel) {
      throw new Error("Level tidak tersedia pada bagian ini.");
    }

    state.currentPart = part;
    state.currentLevel = level;
    state.currentQuestion = 1;
    state.lives = 3;
    state.stars = 0;
    state.usedClues = [];
    state.selectedPlayer = null;
    state.questions = [];
  }

  function getState() {
    return {
      ...state,
      usedClues: [...state.usedClues],
      questions: [...state.questions]
    };
  }

  function getLevelCount(part) {
    return part === 1 ? 4 : 5;
  }

  function getQuestionCount(part) {
    return part === 1 ? 3 : 5;
  }

  function getPlayerPoolSize(part) {
    return part === 1 ? 7 : 11;
  }

  function getStarsForClues(clueCount) {
    if (clueCount <= 3) return 3;
    if (clueCount <= 6) return 2;
    if (clueCount <= 9) return 1;

    return 0;
  }

  function normalizeAnswer(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase();
  }

  function checkAnswer(input, player) {
    if (!player) return false;

    const acceptedNames = [
      player.name,
      player.fullName,
      ...(player.aliases || [])
    ].filter(Boolean);

    const answer = normalizeAnswer(input);

    return acceptedNames.some(
      name => normalizeAnswer(name) === answer
    );
  }

  function addClue(clueId) {
    if (state.usedClues.includes(clueId)) {
      return false;
    }

    state.usedClues.push(clueId);

    return true;
  }

  function useBonusClue() {
    if (state.lives <= 1) {
      return false;
    }

    state.lives -= 1;

    return true;
  }

  function getScore() {
    return getStarsForClues(state.usedClues.length);
  }

  return {
    setLanguage,
    setProgress,
    getState,
    getLevelCount,
    getQuestionCount,
    getPlayerPoolSize,
    getStarsForClues,
    checkAnswer,
    addClue,
    useBonusClue,
    getScore,
    t
  };
})();
