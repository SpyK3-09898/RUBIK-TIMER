const timerPanel = document.getElementById("timerPanel");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");
const hintEl = document.getElementById("hint");
const scrambleEl = document.getElementById("scramble");
const solvesEl = document.getElementById("solves");
const bestEl = document.getElementById("best");
const ao5El = document.getElementById("ao5");
const ao12El = document.getElementById("ao12");
const last10El = document.getElementById("last10");
const subEl = document.getElementById("sub");
const historyTitleEl = document.getElementById("historyTitle");
const clearHistoryButton = document.getElementById("clearHistory");
const sessionTab = document.getElementById("sessionTab");
const todayTab = document.getElementById("todayTab");
const historyTab = document.getElementById("historyTab");
const settingsModal = document.getElementById("settingsModal");
const inspectionInput = document.getElementById("inspectionInput");
const pauseKeyInput = document.getElementById("pauseKeyInput");
const setPauseKeyButton = document.getElementById("setPauseKey");
const languageSelect = document.getElementById("languageSelect");
const themeSelect = document.getElementById("themeSelect");
const comparisonToast = document.getElementById("comparisonToast");
const copyFeedback = document.getElementById("copyFeedback");
const copySessionBtn = document.getElementById("copySession");
const copyTodayBtn = document.getElementById("copyToday");
const copyHistoryBtn = document.getElementById("copyHistory");
const scrambleHistoryBox = document.getElementById("scrambleHistoryBox");
const scrambleHistoryToggle = document.getElementById("scrambleHistoryToggle");
const scrambleHistoryList = document.getElementById("scrambleHistoryList");
const accentSwatchesEl = document.getElementById("accentSwatches");
const loginScreen = document.getElementById("loginScreen");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerEmail = document.getElementById("registerEmail");
const registerDisplayName = document.getElementById("registerDisplayName");
const registerPassword = document.getElementById("registerPassword");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const rememberMe = document.getElementById("rememberMe");
const userBadgeName = document.getElementById("userBadgeName");
const logoutBtn = document.getElementById("logoutBtn");
const appRoot = document.getElementById("appRoot");

let state = "idle";
let startTime = 0;
let inspectionStart = 0;
let animationFrame = null;
let autoStartTimeout = null;
let resumeTimeout = null;
let audioContext = null;
let lastAnnouncedSecond = 0;
let keyArmed = false;
let mouseArmed = false;
let sessionSolves = [];
let toastTimeout = null;
let pausedElapsed = 0;
let resumeCountdown = 3;
let settingPauseKey = false;
let currentUser = null; // email key
let currentDisplayName = null;

let allSolves = [];
let scrambleHistory = [];
let currentView = "session";
let inspectionTime = 15;
let language = "en";
let theme = "dark";
let accent = "purple";
let pauseKey = "p";

const SUPPORTED_LANGS = ["en", "pt", "es"];

const faces = ["R", "L", "U", "D", "F", "B"];
const modifiers = ["", "'", "2"];

const THEMES = {
    purple: {
        label: { pt: "Roxo", en: "Purple", es: "Morado" },
        swatch: "#7c5cff",
        dark: {
            bg: "#0b0d12", panel: "#12151c", panel2: "#181c25", border: "#252b37",
            text: "#eef1f7", muted: "#858d9d",
            accent: "#7c5cff", accentRgb: "124, 92, 255",
            shadow: "rgba(0,0,0,0.25)", ready: "#39d98a", danger: "#ff5d73", yellow: "#f6c453", glow: "0.18"
        },
        light: {
            bg: "#eef1f8", panel: "#ffffff", panel2: "#f4f6fb", border: "#d4dae8",
            text: "#1a1f2e", muted: "#6b7289",
            accent: "#6b4fff", accentRgb: "107, 79, 255",
            shadow: "rgba(80,90,140,0.12)", ready: "#22c55e", danger: "#ef4444", yellow: "#eab308", glow: "0.12"
        }
    },
    catppuccin: {
        label: { pt: "Catppuccin", en: "Catppuccin", es: "Catppuccin" },
        swatch: "#cba6f7",
        dark: {
            bg: "#1e1e2e", panel: "#181825", panel2: "#313244", border: "#45475a",
            text: "#cdd6f4", muted: "#a6adc8",
            accent: "#cba6f7", accentRgb: "203, 166, 247",
            shadow: "rgba(0,0,0,0.35)", ready: "#a6e3a1", danger: "#f38ba8", yellow: "#f9e2af", glow: "0.16"
        },
        light: {
            bg: "#eff1f5", panel: "#ffffff", panel2: "#e6e9ef", border: "#ccd0da",
            text: "#4c4f69", muted: "#6c6f85",
            accent: "#8839ef", accentRgb: "136, 57, 239",
            shadow: "rgba(80,70,120,0.12)", ready: "#40a02b", danger: "#d20f39", yellow: "#df8e1d", glow: "0.10"
        }
    },
    nord: {
        label: { pt: "Nord", en: "Nord", es: "Nord" },
        swatch: "#88c0d0",
        dark: {
            bg: "#2e3440", panel: "#3b4252", panel2: "#434c5e", border: "#4c566a",
            text: "#eceff4", muted: "#d8dee9",
            accent: "#88c0d0", accentRgb: "136, 192, 208",
            shadow: "rgba(0,0,0,0.30)", ready: "#a3be8c", danger: "#bf616a", yellow: "#ebcb8b", glow: "0.14"
        },
        light: {
            bg: "#eceff4", panel: "#ffffff", panel2: "#e5e9f0", border: "#d8dee9",
            text: "#2e3440", muted: "#4c566a",
            accent: "#5e81ac", accentRgb: "94, 129, 172",
            shadow: "rgba(60,80,110,0.12)", ready: "#a3be8c", danger: "#bf616a", yellow: "#ebcb8b", glow: "0.10"
        }
    },
    tokyo: {
        label: { pt: "Tokyo Night", en: "Tokyo Night", es: "Tokyo Night" },
        swatch: "#7aa2f7",
        dark: {
            bg: "#1a1b26", panel: "#24283b", panel2: "#1f2335", border: "#3b4261",
            text: "#c0caf5", muted: "#a9b1d6",
            accent: "#7aa2f7", accentRgb: "122, 162, 247",
            shadow: "rgba(0,0,0,0.35)", ready: "#9ece6a", danger: "#f7768e", yellow: "#e0af68", glow: "0.16"
        },
        light: {
            bg: "#e1e2e7", panel: "#ffffff", panel2: "#d5d6db", border: "#c4c5cb",
            text: "#343b59", muted: "#565a6e",
            accent: "#2e7de9", accentRgb: "46, 125, 233",
            shadow: "rgba(50,70,120,0.12)", ready: "#587539", danger: "#f52a65", yellow: "#8c6c3e", glow: "0.10"
        }
    },
    dracula: {
        label: { pt: "Dracula", en: "Dracula", es: "Dracula" },
        swatch: "#bd93f9",
        dark: {
            bg: "#282a36", panel: "#21222c", panel2: "#44475a", border: "#6272a4",
            text: "#f8f8f2", muted: "#bd93f9",
            accent: "#bd93f9", accentRgb: "189, 147, 249",
            shadow: "rgba(0,0,0,0.35)", ready: "#50fa7b", danger: "#ff5555", yellow: "#f1fa8c", glow: "0.16"
        },
        light: {
            bg: "#f8f8f2", panel: "#ffffff", panel2: "#eaeaea", border: "#d0d0d0",
            text: "#282a36", muted: "#6272a4",
            accent: "#7c3aed", accentRgb: "124, 58, 237",
            shadow: "rgba(80,60,120,0.12)", ready: "#2e7d32", danger: "#c62828", yellow: "#f9a825", glow: "0.10"
        }
    },
    gruvbox: {
        label: { pt: "Gruvbox", en: "Gruvbox", es: "Gruvbox" },
        swatch: "#fe8019",
        dark: {
            bg: "#282828", panel: "#3c3836", panel2: "#504945", border: "#665c54",
            text: "#ebdbb2", muted: "#a89984",
            accent: "#fe8019", accentRgb: "254, 128, 25",
            shadow: "rgba(0,0,0,0.35)", ready: "#b8bb26", danger: "#fb4934", yellow: "#fabd2f", glow: "0.14"
        },
        light: {
            bg: "#fbf1c7", panel: "#ffffff", panel2: "#ebdbb2", border: "#d5c4a1",
            text: "#3c3836", muted: "#7c6f64",
            accent: "#d65d0e", accentRgb: "214, 93, 14",
            shadow: "rgba(120,90,40,0.12)", ready: "#79740e", danger: "#9d0006", yellow: "#b57614", glow: "0.10"
        }
    },
    onedark: {
        label: { pt: "One Dark", en: "One Dark", es: "One Dark" },
        swatch: "#61afef",
        dark: {
            bg: "#282c34", panel: "#21252b", panel2: "#2c313a", border: "#3e4451",
            text: "#abb2bf", muted: "#5c6370",
            accent: "#61afef", accentRgb: "97, 175, 239",
            shadow: "rgba(0,0,0,0.35)", ready: "#98c379", danger: "#e06c75", yellow: "#e5c07b", glow: "0.14"
        },
        light: {
            bg: "#fafafa", panel: "#ffffff", panel2: "#f0f0f0", border: "#e5e5e6",
            text: "#383a42", muted: "#a0a1a7",
            accent: "#4078f2", accentRgb: "64, 120, 242",
            shadow: "rgba(60,80,120,0.10)", ready: "#50a14f", danger: "#e45649", yellow: "#c18401", glow: "0.08"
        }
    },
    solarized: {
        label: { pt: "Solarized", en: "Solarized", es: "Solarized" },
        swatch: "#268bd2",
        dark: {
            bg: "#002b36", panel: "#073642", panel2: "#094553", border: "#586e75",
            text: "#839496", muted: "#657b83",
            accent: "#268bd2", accentRgb: "38, 139, 210",
            shadow: "rgba(0,0,0,0.35)", ready: "#859900", danger: "#dc322f", yellow: "#b58900", glow: "0.14"
        },
        light: {
            bg: "#fdf6e3", panel: "#ffffff", panel2: "#eee8d5", border: "#93a1a1",
            text: "#657b83", muted: "#93a1a1",
            accent: "#268bd2", accentRgb: "38, 139, 210",
            shadow: "rgba(80,100,80,0.10)", ready: "#859900", danger: "#dc322f", yellow: "#b58900", glow: "0.08"
        }
    },
    github: {
        label: { pt: "GitHub", en: "GitHub", es: "GitHub" },
        swatch: "#58a6ff",
        dark: {
            bg: "#0d1117", panel: "#161b22", panel2: "#21262d", border: "#30363d",
            text: "#c9d1d9", muted: "#8b949e",
            accent: "#58a6ff", accentRgb: "88, 166, 255",
            shadow: "rgba(0,0,0,0.40)", ready: "#3fb950", danger: "#f85149", yellow: "#d29922", glow: "0.14"
        },
        light: {
            bg: "#ffffff", panel: "#f6f8fa", panel2: "#eef1f4", border: "#d0d7de",
            text: "#24292f", muted: "#57606a",
            accent: "#0969da", accentRgb: "9, 105, 218",
            shadow: "rgba(30,50,80,0.10)", ready: "#1a7f37", danger: "#cf222e", yellow: "#9a6700", glow: "0.08"
        }
    },
    everforest: {
        label: { pt: "Everforest", en: "Everforest", es: "Everforest" },
        swatch: "#a7c080",
        dark: {
            bg: "#2d353b", panel: "#343f44", panel2: "#3d484d", border: "#4f585e",
            text: "#d3c6aa", muted: "#859289",
            accent: "#a7c080", accentRgb: "167, 192, 128",
            shadow: "rgba(0,0,0,0.30)", ready: "#a7c080", danger: "#e67e80", yellow: "#dbbc7f", glow: "0.14"
        },
        light: {
            bg: "#fdf6e3", panel: "#ffffff", panel2: "#f4f0d9", border: "#e0dcc0",
            text: "#5c6a72", muted: "#829181",
            accent: "#8da101", accentRgb: "141, 161, 1",
            shadow: "rgba(80,100,60,0.10)", ready: "#8da101", danger: "#f85552", yellow: "#dfa000", glow: "0.08"
        }
    }
};

if (!THEMES[accent]) accent = "purple";

const translations = {
    pt: {
        title: "Cubo Timer",
        subtitle: "Speedcubing timer",
        newScramble: "Novo scramble",
        scramble: "Scramble",
        scrambleHistory: "Histórico de scrambles",
        noScrambleHistory: "Nenhum scramble ainda.",
        useScramble: "Usar",
        ready: "Pronto",
        inspecting: "Inspeção",
        preparing: "Preparando",
        running: "Correndo",
        paused: "Pausado",
        resuming: "Continuando",
        stopped: "Finalizado",
        over: "Inspeção excedida",
        holdToInspect: "Pressione uma letra (A-Z) para começar a inspeção",
        inspectionRelease: "A solve começará automaticamente",
        pressToStop: "Pressione uma letra para parar",
        pressToPause: "Pressione a tecla de pausa para pausar",
        pressToResume: "Pressione a tecla de pausa para continuar",
        resumeIn: "Continuando em",
        nextSolve: "Pressione uma letra para próxima inspeção",
        reset: "Resetar",
        clearSession: "Limpar sessão",
        clearHistory: "Limpar histórico",
        deleteSolve: "Apagar",
        confirmDeleteSolve: "Tem certeza que deseja apagar esta solve? Esta ação não pode ser desfeita.",
        session: "Sessão atual",
        today: "Hoje",
        history: "Histórico",
        solves: "Solves",
        best: "Best:",
        last10: "Últimas 10:",
        sub: "Sub:",
        noSolves: "Nenhuma solve ainda.",
        noSessionSolves: "Nenhuma solve nesta sessão.",
        noTodaySolves: "Nenhuma solve hoje.",
        noHistory: "Nenhuma solve no histórico.",
        sessionTitle: "Sessão atual",
        todayTitle: "Hoje",
        historyTitle: "Histórico",
        settings: "Configurações",
        inspectionTime: "Tempo de inspeção",
        inspectionDescription: "Tempo para analisar o cubo antes da solve",
        pauseKey: "Tecla de pausa",
        pauseKeyDescription: "Tecla usada para pausar e continuar a solve",
        setKey: "Definir",
        pressKey: "Pressione uma tecla...",
        accentColor: "Tom da interface",
        accentDescription: "Tom da interface (claro e escuro)",
        language: "Idioma",
        languageDescription: "Altera o idioma da interface",
        theme: "Tema",
        themeDescription: "Escolha entre tema claro e escuro",
        copySession: "Copiar sessão",
        copyToday: "Copiar hoje",
        copyHistory: "Copiar histórico",
        copied: "Copiado para a área de transferência!",
        nothingToCopy: "Nada para copiar.",
        fasterBy: "Mais rápido que a média em",
        slowerBy: "Mais lento que a média em",
        sameAsAvg: "Igual à média",
        vsAverage: "vs média da sessão",
        sessionAverage: "Sessão",
        historyAverage: "Histórico",
        logout: "Sair",
        loginTitle: "Entrar",
        registerTitle: "Criar conta",
        loginSub: "Seus dados ficam salvos neste dispositivo",
        email: "Email",
        displayName: "Nome de exibição",
        password: "Senha",
        rememberMe: "Manter conectado",
        loginBtn: "Entrar",
        registerBtn: "Criar conta",
        noAccount: "Não tem conta?",
        hasAccount: "Já tem conta?",
        createOne: "Criar uma",
        signIn: "Entrar",
        userExists: "Esse email já está cadastrado.",
        invalidLogin: "Email ou senha incorretos.",
        fillFields: "Preencha todos os campos.",
        invalidEmail: "Email inválido.",
        shortName: "Nome precisa ter pelo menos 2 caracteres.",
        shortPass: "Senha precisa ter pelo menos 4 caracteres."
    },
    en: {
        title: "Cube Timer",
        subtitle: "Speedcubing timer",
        newScramble: "New scramble",
        scramble: "Scramble",
        scrambleHistory: "Scramble history",
        noScrambleHistory: "No scrambles yet.",
        useScramble: "Use",
        ready: "Ready",
        inspecting: "Inspection",
        preparing: "Preparing",
        running: "Running",
        paused: "Paused",
        resuming: "Resuming",
        stopped: "Finished",
        over: "Inspection exceeded",
        holdToInspect: "Press a letter (A-Z) to start inspection",
        inspectionRelease: "The solve will start automatically",
        pressToStop: "Press a letter to stop",
        pressToPause: "Press the pause key to pause",
        pressToResume: "Press the pause key to resume",
        resumeIn: "Resuming in",
        nextSolve: "Press a letter for the next inspection",
        reset: "Reset",
        clearSession: "Clear session",
        clearHistory: "Clear history",
        deleteSolve: "Delete",
        confirmDeleteSolve: "Are you sure you want to delete this solve? This action cannot be undone.",
        session: "Current session",
        today: "Today",
        history: "History",
        solves: "Solves",
        best: "Best:",
        last10: "Last 10:",
        sub: "Sub:",
        noSolves: "No solves yet.",
        noSessionSolves: "No solves in this session.",
        noTodaySolves: "No solves today.",
        noHistory: "No solves in history.",
        sessionTitle: "Current session",
        todayTitle: "Today",
        historyTitle: "History",
        settings: "Settings",
        inspectionTime: "Inspection time",
        inspectionDescription: "Time to inspect the cube before the solve",
        pauseKey: "Pause key",
        pauseKeyDescription: "Key used to pause and resume the solve",
        setKey: "Set",
        pressKey: "Press a key...",
        accentColor: "Interface tone",
        accentDescription: "Interface tone (light and dark)",
        language: "Language",
        languageDescription: "Change the interface language",
        theme: "Theme",
        themeDescription: "Choose between light and dark theme",
        copySession: "Copy session",
        copyToday: "Copy today",
        copyHistory: "Copy history",
        copied: "Copied to clipboard!",
        nothingToCopy: "Nothing to copy.",
        fasterBy: "Faster than average by",
        slowerBy: "Slower than average by",
        sameAsAvg: "Same as average",
        vsAverage: "vs session average",
        sessionAverage: "Session",
        historyAverage: "History",
        logout: "Log out",
        loginTitle: "Sign in",
        registerTitle: "Create account",
        loginSub: "Your data is stored on this device",
        email: "Email",
        displayName: "Display name",
        password: "Password",
        rememberMe: "Stay signed in",
        loginBtn: "Sign in",
        registerBtn: "Create account",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        createOne: "Create one",
        signIn: "Sign in",
        userExists: "That email is already registered.",
        invalidLogin: "Invalid email or password.",
        fillFields: "Please fill in all fields.",
        invalidEmail: "Invalid email.",
        shortName: "Display name must be at least 2 characters.",
        shortPass: "Password must be at least 4 characters."
    },
    es: {
        title: "Cubo Timer",
        subtitle: "Temporizador de speedcubing",
        newScramble: "Nuevo scramble",
        scramble: "Scramble",
        scrambleHistory: "Historial de scrambles",
        noScrambleHistory: "Ningún scramble aún.",
        useScramble: "Usar",
        ready: "Listo",
        inspecting: "Inspección",
        preparing: "Preparando",
        running: "Corriendo",
        paused: "Pausado",
        resuming: "Continuando",
        stopped: "Finalizado",
        over: "Inspección excedida",
        holdToInspect: "Presiona una letra (A-Z) para comenzar la inspección",
        inspectionRelease: "La solve comenzará automáticamente",
        pressToStop: "Presiona una letra para detener",
        pressToPause: "Presiona la tecla de pausa para pausar",
        pressToResume: "Presiona la tecla de pausa para continuar",
        resumeIn: "Continuando en",
        nextSolve: "Presiona una letra para la siguiente inspección",
        reset: "Reiniciar",
        clearSession: "Limpiar sesión",
        clearHistory: "Limpiar historial",
        deleteSolve: "Borrar",
        confirmDeleteSolve: "¿Estás seguro de que deseas borrar esta solve? Esta acción no se puede deshacer.",
        session: "Sesión actual",
        today: "Hoy",
        history: "Historial",
        solves: "Solves",
        best: "Mejor:",
        last10: "Últimas 10:",
        sub: "Sub:",
        noSolves: "Ninguna solve aún.",
        noSessionSolves: "Ninguna solve en esta sesión.",
        noTodaySolves: "Ninguna solve hoy.",
        noHistory: "Ninguna solve en el historial.",
        sessionTitle: "Sesión actual",
        todayTitle: "Hoy",
        historyTitle: "Historial",
        settings: "Configuración",
        inspectionTime: "Tiempo de inspección",
        inspectionDescription: "Tiempo para analizar el cubo antes de la solve",
        pauseKey: "Tecla de pausa",
        pauseKeyDescription: "Tecla usada para pausar y continuar la solve",
        setKey: "Definir",
        pressKey: "Presiona una tecla...",
        accentColor: "Tono de la interfaz",
        accentDescription: "Tono de la interfaz (claro y oscuro)",
        language: "Idioma",
        languageDescription: "Cambia la interfaz",
        theme: "Tema",
        themeDescription: "Elige entre tema claro y oscuro",
        copySession: "Copiar sesión",
        copyToday: "Copiar hoy",
        copyHistory: "Copiar historial",
        copied: "¡Copiado al portapapeles!",
        nothingToCopy: "Nada que copiar.",
        fasterBy: "Más rápido que el promedio en",
        slowerBy: "Más lento que el promedio en",
        sameAsAvg: "Igual al promedio",
        vsAverage: "vs promedio de la sesión",
        sessionAverage: "Sesión",
        historyAverage: "Historial",
        logout: "Salir",
        loginTitle: "Iniciar sesión",
        registerTitle: "Crear cuenta",
        loginSub: "Tus datos se guardan en este dispositivo",
        email: "Email",
        displayName: "Nombre visible",
        password: "Contraseña",
        rememberMe: "Mantener sesión",
        loginBtn: "Entrar",
        registerBtn: "Crear cuenta",
        noAccount: "¿No tienes cuenta?",
        hasAccount: "¿Ya tienes cuenta?",
        createOne: "Crear una",
        signIn: "Entrar",
        userExists: "Ese email ya está registrado.",
        invalidLogin: "Email o contraseña incorrectos.",
        fillFields: "Completa todos los campos.",
        invalidEmail: "Email inválido.",
        shortName: "El nombre debe tener al menos 2 caracteres.",
        shortPass: "La contraseña debe tener al menos 4 caracteres."
    }
};

function t(key) {
    return translations[language][key] || key;
}

function storageKey(suffix) {
    if (!currentUser) return null;
    return `cubeTimer_${currentUser}_${suffix}`;
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("cubeTimer_users") || "{}");
    } catch {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem("cubeTimer_users", JSON.stringify(users));
}

function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return String(h);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function registerUser(email, displayName, password) {
    const users = getUsers();
    const key = email.trim().toLowerCase();
    if (users[key]) return { ok: false, error: "userExists" };
    users[key] = {
        email: key,
        displayName: displayName.trim(),
        pass: simpleHash(password),
        created: Date.now()
    };
    saveUsers(users);
    return { ok: true };
}

function authenticate(email, password) {
    const users = getUsers();
    const key = email.trim().toLowerCase();
    const user = users[key];
    if (!user) return null;
    if (user.pass !== simpleHash(password)) return null;
    return user;
}

function detectBrowserLanguage() {
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    const code = nav.split("-")[0];
    if (SUPPORTED_LANGS.includes(code)) return code;
    return "en";
}

function loadUserData() {
    if (!currentUser) return;

    try {
        allSolves = JSON.parse(localStorage.getItem(storageKey("solves")) || "[]");
    } catch {
        allSolves = [];
    }

    try {
        scrambleHistory = JSON.parse(localStorage.getItem(storageKey("scrambles")) || "[]");
    } catch {
        scrambleHistory = [];
    }

    if (scrambleHistory.length > 10) {
        scrambleHistory = scrambleHistory.slice(0, 10);
        saveScrambleHistory();
    }

    inspectionTime = Number(localStorage.getItem(storageKey("inspectionTime"))) || 15;
    pauseKey = localStorage.getItem(storageKey("pauseKey")) || "p";
    language = localStorage.getItem(storageKey("language"))
        || localStorage.getItem("cubeTimer_global_language")
        || detectBrowserLanguage();
    theme = localStorage.getItem(storageKey("theme")) || localStorage.getItem("cubeTimer_global_theme") || "dark";
    accent = localStorage.getItem(storageKey("accent")) || localStorage.getItem("cubeTimer_global_accent") || "purple";

    if (!THEMES[accent]) accent = "purple";
    if (!SUPPORTED_LANGS.includes(language)) language = "en";
    sessionSolves = [];
}

function saveSolves() {
    if (!currentUser) return;
    localStorage.setItem(storageKey("solves"), JSON.stringify(allSolves));
}

function saveScrambleHistory() {
    if (!currentUser) return;
    localStorage.setItem(storageKey("scrambles"), JSON.stringify(scrambleHistory));
}

function saveSession() {
    if (!currentUser) return;
    localStorage.setItem("cubeTimer_session", JSON.stringify({
        email: currentUser,
        ts: Date.now()
    }));
}

function clearSession() {
    localStorage.removeItem("cubeTimer_session");
}

function tryAutoLogin() {
    try {
        const raw = localStorage.getItem("cubeTimer_session");
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !data.email) return false;
        const users = getUsers();
        const key = data.email.toLowerCase();
        if (!users[key]) {
            clearSession();
            return false;
        }
        currentUser = key;
        currentDisplayName = users[key].displayName || key;
        return true;
    } catch {
        clearSession();
        return false;
    }
}

function showApp() {
    loginScreen.classList.add("hidden");
    appRoot.style.display = "";
    userBadgeName.textContent = currentDisplayName || currentUser;
    loadUserData();
    inspectionInput.value = inspectionTime;
    displayPauseKey();
    applyLanguage();
    applyTheme();
    applyAccent();
    newScramble();
    renderScrambleHistory();
    renderCurrentView();
}

function showLogin() {
    loginScreen.classList.remove("hidden");
    appRoot.style.display = "none";
    currentUser = null;
    currentDisplayName = null;
    sessionSolves = [];
    allSolves = [];
    scrambleHistory = [];
    showLoginForm();
}

function showLoginForm() {
    loginForm.style.display = "";
    registerForm.style.display = "none";
    loginError.textContent = "";
    registerError.textContent = "";
    const titleEl = document.getElementById("loginTitle");
    if (titleEl) titleEl.textContent = t("loginTitle");
}

function showRegisterForm() {
    loginForm.style.display = "none";
    registerForm.style.display = "";
    loginError.textContent = "";
    registerError.textContent = "";
    const titleEl = document.getElementById("loginTitle");
    if (titleEl) titleEl.textContent = t("registerTitle");
}

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function playBeep(frequency = 880, duration = 0.08, volume = 0.08, type = "sine") {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playStartInspection() {
    playBeep(520, 0.06, 0.06);
    setTimeout(() => playBeep(720, 0.07, 0.07), 70);
}

function playStartSolve() {
    playBeep(880, 0.05, 0.07);
    setTimeout(() => playBeep(1100, 0.08, 0.09), 60);
}

function playStopSolve() {
    playBeep(660, 0.06, 0.07);
    setTimeout(() => playBeep(440, 0.12, 0.08), 80);
}

function playPause() {
    playBeep(430, 0.08, 0.08);
    setTimeout(() => playBeep(320, 0.12, 0.07), 70);
}

function playResumeCountdown(second) {
    const frequencies = { 3: 520, 2: 650, 1: 820 };
    playBeep(frequencies[second] || 650, 0.11, 0.075);
}

function playResumeStart() {
    playBeep(880, 0.05, 0.07);
    setTimeout(() => playBeep(1180, 0.09, 0.09), 60);
}

function playInspectionWarning() {
    playBeep(1000, 0.12, 0.10);
}

function playMinuteBeep() {
    initAudio();
    playBeep(660, 0.12, 0.10);
    setTimeout(() => playBeep(880, 0.14, 0.10), 130);
    setTimeout(() => playBeep(1100, 0.18, 0.12), 280);
}

function playCopySuccess() {
    playBeep(800, 0.05, 0.05);
    setTimeout(() => playBeep(1000, 0.06, 0.06), 50);
}

function isAlphabetKey(event) {
    if (event.key.length !== 1) return false;
    const code = event.key.toLowerCase().charCodeAt(0);
    return code >= 97 && code <= 122;
}

function normalizePauseKey(value) {
    return value.trim().toLowerCase();
}

function isPauseKey(event) {
    const configured = normalizePauseKey(pauseKey);
    if (!configured) return false;
    if (configured === "space") return event.code === "Space";
    return event.key.toLowerCase() === configured || event.code.toLowerCase() === configured;
}

function displayPauseKey() {
    if (pauseKey.toLowerCase() === "space") {
        pauseKeyInput.value = "Space";
        return;
    }
    pauseKeyInput.value = pauseKey.length === 1 ? pauseKey.toUpperCase() : pauseKey;
}

function applyAccent() {
    const tone = THEMES[accent] || THEMES.purple;
    const mode = theme === "light" ? tone.light : tone.dark;
    const root = document.documentElement;

    root.style.setProperty("--bg", mode.bg);
    root.style.setProperty("--panel", mode.panel);
    root.style.setProperty("--panel-2", mode.panel2);
    root.style.setProperty("--border", mode.border);
    root.style.setProperty("--text", mode.text);
    root.style.setProperty("--muted", mode.muted);
    root.style.setProperty("--accent", mode.accent);
    root.style.setProperty("--accent-rgb", mode.accentRgb);
    root.style.setProperty("--shadow", mode.shadow);
    root.style.setProperty("--ready", mode.ready);
    root.style.setProperty("--danger", mode.danger);
    root.style.setProperty("--yellow", mode.yellow);
    root.style.setProperty("--accent-soft", `rgba(${mode.accentRgb}, ${theme === "light" ? "0.08" : "0.12"})`);
    root.style.setProperty("--grid-line", theme === "light"
        ? "rgba(100, 110, 150, 0.06)"
        : "rgba(255, 255, 255, 0.018)");

    document.body.style.background = theme === "light"
        ? `radial-gradient(circle at 50% -10%, rgba(${mode.accentRgb}, ${mode.glow}), transparent 42%), radial-gradient(circle at 90% 80%, rgba(57, 217, 138, 0.06), transparent 35%), ${mode.bg}`
        : `radial-gradient(circle at 50% -10%, rgba(${mode.accentRgb}, ${mode.glow}), transparent 38%), ${mode.bg}`;

    document.querySelectorAll(".accent-swatch").forEach(el => {
        el.classList.toggle("active", el.dataset.accent === accent);
    });
}

function renderAccentSwatches() {
    accentSwatchesEl.innerHTML = Object.entries(THEMES).map(([key, val]) => `
        <button type="button"
            class="accent-swatch ${key === accent ? "active" : ""}"
            data-accent="${key}"
            style="--swatch-color: ${val.swatch}; --swatch-rgb: ${val.dark.accentRgb}; background: ${val.swatch};"
            title="${val.label[language] || val.label.en}">
        </button>
    `).join("");
}

function applyLanguage() {
    document.documentElement.lang =
        language === "pt" ? "pt-BR" : language === "es" ? "es" : "en";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        element.textContent = t(key);
    });

    const langLabels = { pt: "🇧🇷 PT", en: "🇺🇸 EN", es: "🇪🇸 ES" };
    document.getElementById("languageButton").textContent = langLabels[language] || "🇧🇷 PT";
    languageSelect.value = language;

    if (!settingPauseKey) displayPauseKey();

    if (state === "idle") {
        hintEl.textContent = t("holdToInspect");
    } else if (state === "running") {
        hintEl.textContent = `${t("pressToStop")} • ${t("pauseKey")}: ${pauseKey.toUpperCase()}`;
    } else if (state === "paused") {
        hintEl.textContent = t("pressToResume");
    } else if (state === "resuming") {
        hintEl.textContent = `${t("resumeIn")} ${resumeCountdown}`;
    }

    const titles = {
        session: t("sessionTitle"),
        today: t("todayTitle"),
        history: t("historyTitle")
    };
    historyTitleEl.textContent = titles[currentView] || t("sessionTitle");

    // Login labels
    const loginTitleEl = document.getElementById("loginTitle");
    const registerTitleEl = document.getElementById("registerTitle");
    if (loginTitleEl) loginTitleEl.textContent = t("loginTitle");
    if (registerTitleEl) registerTitleEl.textContent = t("registerTitle");

    document.querySelectorAll("[data-i18n-login]").forEach(el => {
        el.textContent = t(el.dataset.i18nLogin);
    });

    renderAccentSwatches();
    applyAccent();
}

function applyTheme() {
    document.body.classList.toggle("light", theme === "light");
    themeSelect.value = theme;
    document.getElementById("themeButton").textContent = theme === "light" ? "🌙" : "☀️";
    applyAccent();
}

function generateScramble(length = 20) {
    const result = [];
    let previousFace = null;
    let previousAxis = null;
    const axis = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };

    while (result.length < length) {
        const face = faces[Math.floor(Math.random() * faces.length)];
        if (face === previousFace || axis[face] === previousAxis) continue;
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        result.push(face + modifier);
        previousFace = face;
        previousAxis = axis[face];
    }
    return result.join(" ");
}

function addToScrambleHistory(scramble) {
    if (!scramble || !scramble.trim()) return;
    if (scrambleHistory[0] && scrambleHistory[0].scramble === scramble) return;
    scrambleHistory.unshift({ scramble, date: Date.now() });
    if (scrambleHistory.length > 10) scrambleHistory = scrambleHistory.slice(0, 10);
    saveScrambleHistory();
    renderScrambleHistory();
}

function newScramble() {
    scrambleEl.classList.add("updating");
    setTimeout(() => {
        const s = generateScramble();
        scrambleEl.textContent = s;
        scrambleEl.classList.remove("updating");
        addToScrambleHistory(s);
    }, 150);
}

function renderScrambleHistory() {
    if (!scrambleHistory.length) {
        scrambleHistoryList.innerHTML = `<div class="scramble-history-empty">${t("noScrambleHistory")}</div>`;
        return;
    }

    scrambleHistoryList.innerHTML = scrambleHistory.map((item, index) => `
        <div class="scramble-history-item">
            <div class="scramble-history-num">#${scrambleHistory.length - index}</div>
            <div class="scramble-history-text" title="${item.scramble}">${item.scramble}</div>
            <button class="scramble-history-use" data-index="${index}">${t("useScramble")}</button>
        </div>
    `).join("");
}

function formatTime(ms) {
    return (ms / 1000).toFixed(2);
}

function setStatus(text, type = "") {
    statusEl.textContent = text;
    statusEl.className = "status " + type;
}

function isSameDay(ts1, ts2) {
    const d1 = new Date(ts1);
    const d2 = new Date(ts2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function getTodaySolves() {
    const now = Date.now();
    return allSolves.filter(s => isSameDay(s.date, now));
}

function showComparison(solveTime) {
    const previous = sessionSolves.slice(1);
    const sessionAvg = previous.length
        ? previous.reduce((s, x) => s + x.time, 0) / previous.length
        : null;

    const historyPrevious = allSolves.slice(1);
    const historyAvg = historyPrevious.length
        ? historyPrevious.reduce((s, x) => s + x.time, 0) / historyPrevious.length
        : null;

    if (sessionAvg === null && historyAvg === null) {
        comparisonToast.classList.remove("show", "faster", "slower", "same");
        return;
    }

    clearTimeout(toastTimeout);
    comparisonToast.classList.remove("show", "faster", "slower", "same");

    const getComparison = (average) => {
        const diff = average - solveTime;
        const pct = Math.abs((diff / average) * 100);
        return {
            diff,
            text: pct < 0.5
                ? t("sameAsAvg")
                : diff > 0
                ? `${t("fasterBy")} ${pct.toFixed(1)}%`
                : `${t("slowerBy")} ${pct.toFixed(1)}%`
        };
    };

    const historyComparison = historyAvg !== null ? getComparison(historyAvg) : null;
    const sessionComparison = sessionAvg !== null ? getComparison(sessionAvg) : null;

    if (historyComparison) {
        comparisonToast.classList.add(
            historyComparison.diff > 0 ? "faster" : historyComparison.diff < 0 ? "slower" : "same"
        );
        comparisonToast.innerHTML = `
            <div>${t("historyAverage")}: ${historyComparison.text}</div>
            ${sessionComparison
                ? `<div class="session-comparison">${t("sessionAverage")}: ${sessionComparison.text}</div>`
                : ""}
        `;
    } else if (sessionComparison) {
        comparisonToast.classList.add(
            sessionComparison.diff > 0 ? "faster" : sessionComparison.diff < 0 ? "slower" : "same"
        );
        comparisonToast.innerHTML = `<div>${t("sessionAverage")}: ${sessionComparison.text}</div>`;
    }

    requestAnimationFrame(() => comparisonToast.classList.add("show"));
    toastTimeout = setTimeout(() => comparisonToast.classList.remove("show"), 3500);
}

function updateInspection() {
    if (state !== "inspecting" && state !== "inspectionOver") return;

    const elapsed = (performance.now() - inspectionStart) / 1000;
    const remaining = inspectionTime - elapsed;

    if (remaining > 0) {
        timeEl.textContent = remaining.toFixed(1);
        timeEl.classList.add("inspection");
        setStatus(t("inspecting"), "inspecting");
        hintEl.textContent = t("inspectionRelease");
        animationFrame = requestAnimationFrame(updateInspection);
        return;
    }

    if (state === "inspecting") {
        state = "inspectionOver";
        timeEl.textContent = "0.0";
        timeEl.classList.add("inspection");
        timeEl.style.color = "var(--yellow)";
        setStatus(t("preparing"), "inspecting");
        hintEl.textContent = t("inspectionRelease");
        cancelAnimationFrame(animationFrame);
        playInspectionWarning();
        autoStartTimeout = setTimeout(() => {
            if (state !== "inspectionOver") return;
            startSolve();
        }, 1000);
        return;
    }

    const overtime = Math.abs(remaining);
    timeEl.textContent = "+" + overtime.toFixed(1);
    timeEl.style.color = "var(--danger)";
    setStatus(t("over"), "over");
    hintEl.textContent = t("inspectionRelease");
    animationFrame = requestAnimationFrame(updateInspection);
}

function updateTimer() {
    if (state !== "running") return;

    const elapsed = performance.now() - startTime;
    const currentSecond = Math.floor(elapsed / 1000);

    if (
        currentSecond > lastAnnouncedSecond &&
        currentSecond > 0 &&
        currentSecond % 10 === 0
    ) {
        lastAnnouncedSecond = currentSecond;
        if (currentSecond === 60) {
            playMinuteBeep();
        } else {
            playBeep(760, 0.07, 0.055);
        }
    }

    timeEl.textContent = formatTime(elapsed);
    animationFrame = requestAnimationFrame(updateTimer);
}

function startInspection() {
    if (state !== "idle" && state !== "stopped") return;
    cancelAnimationFrame(animationFrame);
    clearTimeout(autoStartTimeout);
    clearTimeout(resumeTimeout);
    comparisonToast.classList.remove("show");
    timerPanel.classList.remove("paused", "resuming");
    timeEl.classList.remove("paused-time", "resume-countdown");
    state = "inspecting";
    inspectionStart = performance.now();
    timeEl.style.color = "";
    timeEl.classList.add("inspection");
    playStartInspection();
    updateInspection();
}

function startSolve() {
    if (state !== "inspecting" && state !== "inspectionOver") return;
    cancelAnimationFrame(animationFrame);
    clearTimeout(autoStartTimeout);
    state = "running";
    lastAnnouncedSecond = 0;
    initAudio();
    startTime = performance.now();
    pausedElapsed = 0;
    timeEl.textContent = "0.00";
    timeEl.classList.remove("inspection", "paused-time", "resume-countdown");
    timeEl.style.color = "";
    timerPanel.classList.remove("paused", "resuming");
    timeEl.classList.add("pulse");
    setTimeout(() => timeEl.classList.remove("pulse"), 400);
    setStatus(t("running"), "running");
    hintEl.textContent = `${t("pressToStop")} • ${t("pauseKey")}: ${pauseKey.toUpperCase()}`;
    playStartSolve();
    updateTimer();
}

function pauseSolve() {
    if (state !== "running") return;

    pausedElapsed = performance.now() - startTime;
    state = "paused";

    cancelAnimationFrame(animationFrame);
    clearTimeout(autoStartTimeout);
    clearTimeout(resumeTimeout);

    timeEl.textContent = formatTime(pausedElapsed);
    timeEl.classList.add("paused-time");
    timeEl.classList.remove("pulse");
    timerPanel.classList.add("paused");
    timerPanel.classList.remove("resuming");

    setStatus(t("paused"), "paused");
    hintEl.textContent = t("pressToResume");
    playPause();
}

function resumeSolve() {
    if (state !== "paused") return;

    state = "resuming";
    resumeCountdown = 3;

    timerPanel.classList.remove("paused");
    timerPanel.classList.add("resuming");

    timeEl.classList.remove("paused-time", "resume-countdown");
    timeEl.classList.add("resume-countdown");

    setStatus(t("resuming"), "resuming");
    hintEl.textContent = `${t("resumeIn")} ${resumeCountdown}`;

    playResumeCountdown(resumeCountdown);
    runResumeCountdown();
}

function runResumeCountdown() {
    if (state !== "resuming") return;

    timeEl.textContent = resumeCountdown;
    hintEl.textContent = `${t("resumeIn")} ${resumeCountdown}`;

    timeEl.classList.remove("resume-countdown");
    void timeEl.offsetWidth;
    timeEl.classList.add("resume-countdown");

    if (resumeCountdown <= 1) {
        resumeTimeout = setTimeout(() => {
            if (state !== "resuming") return;

            state = "running";
            startTime = performance.now() - pausedElapsed;
            lastAnnouncedSecond = Math.floor(pausedElapsed / 1000);

            timerPanel.classList.remove("resuming");
            timeEl.classList.remove("resume-countdown");
            timeEl.textContent = formatTime(pausedElapsed);
            setStatus(t("running"), "running");
            hintEl.textContent = `${t("pressToStop")} • ${t("pauseKey")}: ${pauseKey.toUpperCase()}`;

            playResumeStart();
            updateTimer();
        }, 1000);
        return;
    }

    resumeCountdown--;
    resumeTimeout = setTimeout(() => {
        if (state !== "resuming") return;
        playResumeCountdown(resumeCountdown);
        runResumeCountdown();
    }, 1000);
}

function stopSolve() {
    if (state !== "running") return;
    state = "stopped";
    cancelAnimationFrame(animationFrame);
    clearTimeout(autoStartTimeout);
    clearTimeout(resumeTimeout);

    const elapsed = performance.now() - startTime;
    timeEl.textContent = formatTime(elapsed);
    timeEl.classList.remove("inspection", "paused-time", "resume-countdown");
    timeEl.style.color = "";
    timerPanel.classList.remove("paused", "resuming");
    timeEl.classList.add("pulse");
    setTimeout(() => timeEl.classList.remove("pulse"), 400);

    setStatus(t("stopped"), "stopped");
    hintEl.textContent = t("nextSolve");
    playStopSolve();

    const solve = {
        time: elapsed,
        scramble: scrambleEl.textContent,
        date: Date.now()
    };

    sessionSolves.unshift(solve);
    allSolves.unshift(solve);
    saveSolves();
    showComparison(elapsed);
    renderCurrentView();
    newScramble();
}

function resetTimer() {
    cancelAnimationFrame(animationFrame);
    clearTimeout(autoStartTimeout);
    clearTimeout(resumeTimeout);
    comparisonToast.classList.remove("show");
    timerPanel.classList.remove("paused", "resuming");
    timeEl.classList.remove("inspection", "paused-time", "resume-countdown");
    state = "idle";
    pausedElapsed = 0;
    resumeCountdown = 3;
    timeEl.textContent = "0.00";
    timeEl.style.color = "";
    setStatus(t("ready"));
    hintEl.textContent = t("holdToInspect");
}

function average(times) {
    if (!times.length) return null;
    return times.reduce((sum, value) => sum + value, 0) / times.length;
}

function trimmedAverage(times) {
    if (times.length < 5) return null;
    const sorted = [...times].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, -1);
    return average(trimmed);
}

function getSub(time) {
    if (time === null) return "—";
    const seconds = time / 1000;
    if (seconds < 5) return "5";
    if (seconds < 10) return "10";
    if (seconds < 15) return "15";
    if (seconds < 20) return "20";
    if (seconds < 25) return "25";
    if (seconds < 30) return "30";
    if (seconds < 35) return "35";
    if (seconds < 40) return "40";
    if (seconds < 45) return "45";
    if (seconds < 50) return "50";
    if (seconds < 60) return "60";
    if (seconds < 70) return "70";
    if (seconds < 80) return "80";
    if (seconds < 90) return "90";
    if (seconds < 100) return "100";
    return Math.ceil(seconds / 10) * 10;
}

function renderStats(list) {
    if (!list.length) {
        bestEl.textContent = "—";
        ao5El.textContent = "—";
        ao12El.textContent = "—";
        last10El.textContent = "—";
        subEl.textContent = "—";
        return;
    }

    const times = list.map(solve => solve.time);
    const best = Math.min(...times);
    const ao5Times = times.slice(0, 5);
    const ao12Times = times.slice(0, 12);
    const last10Times = times.slice(0, 10);

    const ao5 = ao5Times.length >= 5 ? trimmedAverage(ao5Times) : average(ao5Times);
    const ao12 = ao12Times.length >= 12 ? trimmedAverage(ao12Times) : average(ao12Times);
    const last10 = average(last10Times);

    bestEl.textContent = formatTime(best);
    ao5El.textContent = ao5 === null ? "—" : formatTime(ao5);
    ao12El.textContent = ao12 === null ? "—" : formatTime(ao12);
    last10El.textContent = last10 === null ? "—" : formatTime(last10);
    subEl.textContent = last10 === null ? "—" : "Sub-" + getSub(last10);
}

function renderSolves(list, emptyText) {
    if (!list.length) {
        solvesEl.innerHTML = `<div class="empty">${emptyText}</div>`;
        renderStats([]);
        return;
    }

    solvesEl.innerHTML = list.map((solve, index) => `
        <div class="solve" style="animation-delay: ${Math.min(index * 0.03, 0.3)}s">
            <div class="number">#${list.length - index}</div>
            <div class="solve-time">${formatTime(solve.time)}</div>
            <div class="solve-scramble">${solve.scramble}</div>
            <button class="delete-solve" data-index="${index}">
                ${t("deleteSolve")}
            </button>
        </div>
    `).join("");

    renderStats(list);
}

function formatSolvesAsText(list, title) {
    if (!list.length) return "";
    const lines = [
        `=== ${title} ===`,
        `Total: ${list.length} solves`,
        ""
    ];
    list.forEach((solve, i) => {
        const n = list.length - i;
        const time = formatTime(solve.time);
        const date = new Date(solve.date).toLocaleString(
            language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US"
        );
        lines.push(`#${n}  ${time}s  |  ${solve.scramble}  |  ${date}`);
    });

    const times = list.map(s => s.time);
    const best = Math.min(...times);
    const avg = average(times);
    lines.push("");
    lines.push(`Best: ${formatTime(best)}s`);
    lines.push(`Average: ${formatTime(avg)}s`);
    return lines.join("\n");
}

function showCopyFeedback(msg) {
    copyFeedback.textContent = msg;
    copyFeedback.classList.add("show");
    playCopySuccess();
    setTimeout(() => copyFeedback.classList.remove("show"), 2000);
}

async function copyText(text) {
    if (!text) {
        showCopyFeedback(t("nothingToCopy"));
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback(t("copied"));
    } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showCopyFeedback(t("copied"));
    }
}

function renderCurrentView() {
    clearHistoryButton.style.display = currentView === "history" ? "block" : "none";
    copySessionBtn.style.display = currentView === "session" ? "inline-block" : "none";
    copyTodayBtn.style.display = currentView === "today" ? "inline-block" : "none";
    copyHistoryBtn.style.display = currentView === "history" ? "inline-block" : "none";

    if (currentView === "session") {
        historyTitleEl.textContent = t("sessionTitle");
        renderSolves(sessionSolves, t("noSessionSolves"));
        return;
    }

    if (currentView === "today") {
        historyTitleEl.textContent = t("todayTitle");
        renderSolves(getTodaySolves(), t("noTodaySolves"));
        return;
    }

    historyTitleEl.textContent = t("historyTitle");
    renderSolves(allSolves, t("noHistory"));
}

function setView(view) {
    currentView = view;
    sessionTab.classList.toggle("active", view === "session");
    todayTab.classList.toggle("active", view === "today");
    historyTab.classList.toggle("active", view === "history");
    renderCurrentView();
}

// --- Event listeners ---

solvesEl.addEventListener("click", event => {
    const button = event.target.closest(".delete-solve");
    if (!button) return;
    event.stopPropagation();

    const index = Number(button.dataset.index);
    let list;
    if (currentView === "history") list = allSolves;
    else if (currentView === "today") list = getTodaySolves();
    else list = sessionSolves;

    const solve = list[index];
    if (!solve) return;

    if (!confirm(t("confirmDeleteSolve"))) return;

    if (currentView === "history" || currentView === "today") {
        const solveIndex = allSolves.indexOf(solve);
        if (solveIndex !== -1) allSolves.splice(solveIndex, 1);
        const sessionIndex = sessionSolves.indexOf(solve);
        if (sessionIndex !== -1) sessionSolves.splice(sessionIndex, 1);
        saveSolves();
    } else {
        sessionSolves.splice(index, 1);
    }
    renderCurrentView();
});

scrambleHistoryList.addEventListener("click", event => {
    const btn = event.target.closest(".scramble-history-use");
    if (!btn) return;
    event.stopPropagation();
    const index = Number(btn.dataset.index);
    const item = scrambleHistory[index];
    if (!item) return;
    scrambleEl.textContent = item.scramble;
    resetTimer();
});

scrambleHistoryToggle.addEventListener("click", event => {
    event.stopPropagation();
    scrambleHistoryBox.classList.toggle("open");
});

document.addEventListener("keydown", event => {
    if (event.repeat) return;
    if (!currentUser) return;

    if (settingPauseKey) {
        event.preventDefault();

        if (event.key === "Escape") {
            settingPauseKey = false;
            setPauseKeyButton.textContent = t("setKey");
            displayPauseKey();
            return;
        }

        pauseKey = event.code === "Space" ? "space" : event.key;
        pauseKey = normalizePauseKey(pauseKey);
        if (!pauseKey) pauseKey = "p";

        localStorage.setItem(storageKey("pauseKey"), pauseKey);
        settingPauseKey = false;
        displayPauseKey();
        setPauseKeyButton.textContent = t("setKey");
        applyLanguage();
        return;
    }

    if (settingsModal.classList.contains("open")) return;

    if (event.key === "Escape") {
        resetTimer();
        return;
    }

    const tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea") return;

    if (isPauseKey(event)) {
        event.preventDefault();
        if (state === "running") {
            pauseSolve();
            return;
        }
        if (state === "paused") {
            resumeSolve();
            return;
        }
        if (state === "resuming") return;
    }

    const isSpaceKey = event.code === "Space";
    if (!isAlphabetKey(event) && !isSpaceKey) return;
    if (isSpaceKey) event.preventDefault();

    if (state === "running") {
        stopSolve();
        return;
    }

    if (state === "inspecting" || state === "inspectionOver") {
        startSolve();
        return;
    }

    if (state === "idle" || state === "stopped") {
        keyArmed = true;
        startInspection();
    }
});

document.addEventListener("keyup", event => {
    if (!keyArmed) return;
    keyArmed = false;
});

timerPanel.addEventListener("mousedown", event => {
    if (!currentUser) return;
    if (event.button !== 0) return;

    if (state === "idle" || state === "stopped") {
        mouseArmed = true;
        startInspection();
        return;
    }

    if (state === "inspecting" || state === "inspectionOver") {
        startSolve();
        return;
    }

    if (state === "running") {
        stopSolve();
    }
});

document.addEventListener("mouseup", event => {
    if (!mouseArmed || event.button !== 0) return;
    mouseArmed = false;
});

sessionTab.addEventListener("click", event => {
    event.stopPropagation();
    setView("session");
});

todayTab.addEventListener("click", event => {
    event.stopPropagation();
    setView("today");
});

historyTab.addEventListener("click", event => {
    event.stopPropagation();
    setView("history");
});

copySessionBtn.addEventListener("click", event => {
    event.stopPropagation();
    copyText(formatSolvesAsText(sessionSolves, t("sessionTitle")));
});

copyTodayBtn.addEventListener("click", event => {
    event.stopPropagation();
    copyText(formatSolvesAsText(getTodaySolves(), t("todayTitle")));
});

copyHistoryBtn.addEventListener("click", event => {
    event.stopPropagation();
    copyText(formatSolvesAsText(allSolves, t("historyTitle")));
});

clearHistoryButton.addEventListener("click", event => {
    event.stopPropagation();
    if (!allSolves.length) return;

    const msg = language === "pt"
        ? "Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita."
        : language === "es"
        ? "¿Estás seguro de que deseas borrar todo el historial? Esta acción no se puede deshacer."
        : "Are you sure you want to delete all history? This action cannot be undone.";

    if (!confirm(msg)) return;

    allSolves = [];
    sessionSolves = [];
    localStorage.removeItem(storageKey("solves"));
    setView("history");
    resetTimer();
});

document.getElementById("newScramble").addEventListener("click", event => {
    event.stopPropagation();
    newScramble();
    resetTimer();
});

document.getElementById("reset").addEventListener("click", event => {
    event.stopPropagation();
    resetTimer();
});

document.getElementById("clearSession").addEventListener("click", event => {
    event.stopPropagation();
    sessionSolves = [];
    setView("session");
    resetTimer();
});

document.getElementById("themeButton").addEventListener("click", event => {
    event.stopPropagation();
    theme = theme === "dark" ? "light" : "dark";
    if (currentUser) localStorage.setItem(storageKey("theme"), theme);
    localStorage.setItem("cubeTimer_global_theme", theme);
    applyTheme();
});

document.getElementById("languageButton").addEventListener("click", event => {
    event.stopPropagation();
    const order = ["pt", "en", "es"];
    const idx = order.indexOf(language);
    language = order[(idx + 1) % order.length];
    if (currentUser) localStorage.setItem(storageKey("language"), language);
    localStorage.setItem("cubeTimer_global_language", language);
    applyLanguage();
    renderCurrentView();
    renderScrambleHistory();
});

document.getElementById("settingsButton").addEventListener("click", event => {
    event.stopPropagation();
    settingsModal.classList.add("open");
});

document.getElementById("closeSettings").addEventListener("click", event => {
    event.stopPropagation();
    settingPauseKey = false;
    setPauseKeyButton.textContent = t("setKey");
    displayPauseKey();
    settingsModal.classList.remove("open");
});

settingsModal.addEventListener("click", event => {
    if (event.target === settingsModal) {
        settingPauseKey = false;
        setPauseKeyButton.textContent = t("setKey");
        displayPauseKey();
        settingsModal.classList.remove("open");
    }
});

accentSwatchesEl.addEventListener("click", event => {
    const btn = event.target.closest(".accent-swatch");
    if (!btn) return;
    event.stopPropagation();
    accent = btn.dataset.accent;
    if (currentUser) localStorage.setItem(storageKey("accent"), accent);
    localStorage.setItem("cubeTimer_global_accent", accent);
    applyAccent();
});

inspectionInput.addEventListener("change", () => {
    let value = Number(inspectionInput.value);
    if (Number.isNaN(value)) value = 15;
    value = Math.max(0, Math.min(60, value));
    inspectionTime = value;
    inspectionInput.value = value;
    if (currentUser) localStorage.setItem(storageKey("inspectionTime"), value);
});

pauseKeyInput.addEventListener("change", () => {
    if (settingPauseKey) return;
    let value = normalizePauseKey(pauseKeyInput.value);
    if (!value) value = "p";
    pauseKey = value;
    if (currentUser) localStorage.setItem(storageKey("pauseKey"), pauseKey);
    displayPauseKey();
    applyLanguage();
});

setPauseKeyButton.addEventListener("click", event => {
    event.stopPropagation();
    if (settingPauseKey) return;
    settingPauseKey = true;
    pauseKeyInput.value = "";
    setPauseKeyButton.textContent = t("pressKey");
});

languageSelect.addEventListener("change", () => {
    language = languageSelect.value;
    if (currentUser) localStorage.setItem(storageKey("language"), language);
    localStorage.setItem("cubeTimer_global_language", language);
    applyLanguage();
    renderCurrentView();
    renderScrambleHistory();
});

themeSelect.addEventListener("change", () => {
    theme = themeSelect.value;
    if (currentUser) localStorage.setItem(storageKey("theme"), theme);
    localStorage.setItem("cubeTimer_global_theme", theme);
    applyTheme();
});

logoutBtn.addEventListener("click", event => {
    event.stopPropagation();
    clearSession();
    resetTimer();
    showLogin();
});

function handleLogin(event) {
    event.preventDefault();
    const email = loginEmail.value.trim();
    const pass = loginPassword.value;
    if (!email || !pass) {
        loginError.textContent = t("fillFields");
        return;
    }
    if (!isValidEmail(email)) {
        loginError.textContent = t("invalidEmail");
        return;
    }
    const user = authenticate(email, pass);
    if (!user) {
        loginError.textContent = t("invalidLogin");
        return;
    }
    currentUser = user.email;
    currentDisplayName = user.displayName || user.email;
    if (rememberMe.checked) saveSession();
    else clearSession();
    showApp();
}

function handleRegister(event) {
    event.preventDefault();
    const email = registerEmail.value.trim();
    const displayName = registerDisplayName.value.trim();
    const pass = registerPassword.value;
    if (!email || !displayName || !pass) {
        registerError.textContent = t("fillFields");
        return;
    }
    if (!isValidEmail(email)) {
        registerError.textContent = t("invalidEmail");
        return;
    }
    if (displayName.length < 2) {
        registerError.textContent = t("shortName");
        return;
    }
    if (pass.length < 4) {
        registerError.textContent = t("shortPass");
        return;
    }
    const result = registerUser(email, displayName, pass);
    if (!result.ok) {
        registerError.textContent = t(result.error);
        return;
    }
    currentUser = email.trim().toLowerCase();
    currentDisplayName = displayName;
    const remember = document.getElementById("rememberMeReg");
    if (remember && remember.checked) saveSession();
    else clearSession();
    showApp();
}

loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);

document.getElementById("toRegister").addEventListener("click", event => {
    event.preventDefault();
    showRegisterForm();
});

document.getElementById("toLogin").addEventListener("click", event => {
    event.preventDefault();
    showLoginForm();
});

// Boot
(function init() {
    language = localStorage.getItem("cubeTimer_global_language") || detectBrowserLanguage();
    if (!SUPPORTED_LANGS.includes(language)) language = "en";
    theme = localStorage.getItem("cubeTimer_global_theme") || "dark";
    accent = localStorage.getItem("cubeTimer_global_accent") || "purple";
    if (!THEMES[accent]) accent = "purple";

    applyTheme();
    applyAccent();
    applyLanguage();

    if (tryAutoLogin()) {
        showApp();
    } else {
        showLogin();
    }
})();
