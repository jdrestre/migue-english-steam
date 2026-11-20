/* Persistencia local segura en localStorage para Misión STEAM A1 */

window.AppStorage = (function () {
  const STORAGE_KEY = "migue_steam_english_a1_v1";
  const MAX_IMPORT_BYTES = 512 * 1024;

  const DEFAULT_NEWSPAPER = {
    name: "",
    title: "",
    whoSelected: [],
    whoExtraEs: "",
    whoExtraEn: "",
    whereSelected: [],
    whereExtraEs: "",
    whereExtraEn: "",
    step1Verb: "",
    step1Obj: "",
    step2Verb: "",
    step2Obj: "",
    step2Materials: [],
    step3Learning: "",
    extraStepEs: "",
    extraStepEn: "",
    photoMode: "constructor",
    highlightPastVerbs: true,
    showExamBlueprint: false,
    memoryMode: false
  };

  const DEFAULT_METACOGNITION = {
    q1: { main: "", hasBecause: false, reason: "", customEs: "", customEn: "" },
    q2: { main: "", hasBecause: false, reason: "", customEs: "", customEn: "" },
    q3: { main: "", hasBecause: false, reason: "", customEs: "", customEn: "" },
    q4: { main: "", hasBecause: false, reason: "", customEs: "", customEn: "" },
    q5: { hasLearnedVerb: false, selectedIds: [], customEs: "", customEn: "" }
  };

  const DEFAULT_STATE = {
    version: 3,
    speechRate: 0.85,
    customItems: [],
    completedStation0Challenges: [],
    station1QuizSolved: [],
    station2VerbQuizSolved: [],
    station3RadarSolved: [],
    /* Espacios reservados para Estaciones 1 a 4 */
    comparatives: [],
    newspaper: DEFAULT_NEWSPAPER,
    metacognition: DEFAULT_METACOGNITION,
    practiceStats: {
      level1Best: 0,
      level2Best: 0,
      printHighlights: true,
      printPencilMode: false
    }
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isPlainObject(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }

  function safeStr(val, maxLen) {
    if (typeof val !== "string") return "";
    return val.slice(0, maxLen || 240);
  }

  function safeBool(val, fallback) {
    return typeof val === "boolean" ? val : Boolean(fallback);
  }

  function safeNum(val, min, max, fallback) {
    const n = Number(val);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function safeStringArray(val, maxItems, maxLen) {
    if (!Array.isArray(val)) return [];
    const seen = new Set();
    const out = [];
    for (let i = 0; i < val.length && out.length < (maxItems || 40); i += 1) {
      if (typeof val[i] !== "string") continue;
      const item = val[i].slice(0, maxLen || 140);
      if (!item || seen.has(item)) continue;
      seen.add(item);
      out.push(item);
    }
    return out;
  }

  function sanitizeCustomItems(arr) {
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seenIds = new Set();
    for (let i = 0; i < arr.length && out.length < 40; i += 1) {
      const it = arr[i];
      if (!isPlainObject(it)) continue;
      const id = safeStr(it.id, 80);
      const en = safeStr(it.en, 120).trim();
      const es = safeStr(it.es, 120).trim();
      if (!id || !en || !es || seenIds.has(id)) continue;
      seenIds.add(id);
      out.push({
        id,
        en,
        es,
        category: it.category === "steam" ? "steam" : "cultural",
        verified: Boolean(it.verified)
      });
    }
    return out;
  }

  function sanitizeComparatives(arr) {
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seenIds = new Set();
    for (let i = 0; i < arr.length && out.length < 40; i += 1) {
      const c = arr[i];
      if (!isPlainObject(c)) continue;
      const id = safeStr(c.id, 80) || `comp-${Date.now()}-${i}`;
      const en = safeStr(c.en, 240).trim();
      if (!en || seenIds.has(id)) continue;
      seenIds.add(id);
      let tokens = null;
      if (isPlainObject(c.tokens)) {
        const blue = safeStr(c.tokens.blue, 140);
        const orange = safeStr(c.tokens.orange, 140);
        const purple = safeStr(c.tokens.purple, 140);
        if (blue && orange && purple) {
          tokens = { blue, orange, purple };
        }
      }
      out.push({
        id,
        en,
        es: safeStr(c.es, 240).trim(),
        tokens
      });
    }
    return out;
  }

  function getAllowedIds(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    const set = new Set();
    list.forEach((item) => {
      if (item && typeof item.id === "string" && item.id) set.add(item.id);
    });
    return set.size > 0 ? set : null;
  }

  function filterAllowedIds(arr, allowedSet) {
    if (!allowedSet) return arr;
    return arr.filter((id) => allowedSet.has(id));
  }

  function normalizeState(parsed) {
    const base = clone(DEFAULT_STATE);
    if (!isPlainObject(parsed)) return base;

    const data = window.APP_DATA || null;
    const st0Allowed = data ? getAllowedIds(data.station0Challenges) : null;
    const st1Allowed = data ? getAllowedIds(data.comparativeQuizItems) : null;
    const st2Allowed = data && data.station2Data ? getAllowedIds(data.station2Data.pastVerbQuiz) : null;
    const st3Allowed = data && data.station3Data ? getAllowedIds(data.station3Data.keywordRadar) : null;
    const allowedPhotoModes =
      data && data.station2Data && Array.isArray(data.station2Data.photoModes)
        ? data.station2Data.photoModes.map((p) => p.id)
        : ["constructor", "familia", "retrato", "sketch"];

    base.speechRate = safeNum(parsed.speechRate, 0.5, 1.5, DEFAULT_STATE.speechRate);
    base.customItems = sanitizeCustomItems(parsed.customItems);
    base.completedStation0Challenges = filterAllowedIds(
      safeStringArray(parsed.completedStation0Challenges, 20, 80),
      st0Allowed
    );
    base.station1QuizSolved = filterAllowedIds(
      safeStringArray(parsed.station1QuizSolved, 20, 80),
      st1Allowed
    );
    base.station2VerbQuizSolved = filterAllowedIds(
      safeStringArray(parsed.station2VerbQuizSolved, 30, 80),
      st2Allowed
    );
    base.station3RadarSolved = filterAllowedIds(
      safeStringArray(parsed.station3RadarSolved, 20, 80),
      st3Allowed
    );
    base.comparatives = sanitizeComparatives(parsed.comparatives);

    if (isPlainObject(parsed.newspaper)) {
      const np = parsed.newspaper;
      base.newspaper = {
        name: safeStr(np.name, 100),
        title: safeStr(np.title, 140),
        whoSelected: safeStringArray(np.whoSelected, 15, 80),
        whoExtraEs: safeStr(np.whoExtraEs, 180),
        whoExtraEn: safeStr(np.whoExtraEn, 180),
        whereSelected: safeStringArray(np.whereSelected, 15, 80),
        whereExtraEs: safeStr(np.whereExtraEs, 180),
        whereExtraEn: safeStr(np.whereExtraEn, 180),
        step1Verb: safeStr(np.step1Verb, 40),
        step1Obj: safeStr(np.step1Obj, 120),
        step2Verb: safeStr(np.step2Verb, 40),
        step2Obj: safeStr(np.step2Obj, 120),
        step2Materials: safeStringArray(np.step2Materials, 15, 80),
        step3Learning: safeStr(np.step3Learning, 180),
        extraStepEs: safeStr(np.extraStepEs, 200),
        extraStepEn: safeStr(np.extraStepEn, 200),
        photoMode: allowedPhotoModes.includes(np.photoMode) ? np.photoMode : "constructor",
        highlightPastVerbs: safeBool(np.highlightPastVerbs, true),
        showExamBlueprint: safeBool(np.showExamBlueprint, false),
        memoryMode: safeBool(np.memoryMode, false)
      };
    }

    if (isPlainObject(parsed.metacognition)) {
      const inc = parsed.metacognition;
      ["q1", "q2", "q3", "q4"].forEach((k) => {
        if (isPlainObject(inc[k])) {
          base.metacognition[k] = {
            main: safeStr(inc[k].main, 120),
            hasBecause: safeBool(inc[k].hasBecause, false),
            reason: safeStr(inc[k].reason, 140),
            customEs: safeStr(inc[k].customEs, 200),
            customEn: safeStr(inc[k].customEn, 200)
          };
        }
      });
      if (isPlainObject(inc.q5)) {
        base.metacognition.q5 = {
          hasLearnedVerb: safeBool(inc.q5.hasLearnedVerb, false),
          selectedIds: safeStringArray(inc.q5.selectedIds, 15, 80),
          customEs: safeStr(inc.q5.customEs, 200),
          customEn: safeStr(inc.q5.customEn, 200)
        };
      }
    }

    if (isPlainObject(parsed.practiceStats)) {
      const ps = parsed.practiceStats;
      base.practiceStats = {
        level1Best: Math.round(safeNum(ps.level1Best, 0, 100, 0)),
        level2Best: Math.round(safeNum(ps.level2Best, 0, 100, 0)),
        printHighlights: safeBool(ps.printHighlights, true),
        printPencilMode: safeBool(ps.printPencilMode, false)
      };
    }

    return base;
  }

  function notifyUpdated(state) {
    try {
      window.dispatchEvent(new CustomEvent("app-storage-updated", { detail: state }));
    } catch (err) {
      /* Entornos sin CustomEvent */
    }
  }

  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      return normalizeState(JSON.parse(raw));
    } catch (err) {
      return clone(DEFAULT_STATE);
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      notifyUpdated(state);
      return true;
    } catch (err) {
      return false;
    }
  }

  function reset() {
    const fresh = clone(DEFAULT_STATE);
    save(fresh);
    return fresh;
  }

  function resetSection(currentState, sectionId) {
    if (sectionId === "all") return reset();
    const next = normalizeState(currentState);
    switch (sectionId) {
      case "station-0":
        next.customItems = [];
        next.completedStation0Challenges = [];
        break;
      case "station-1":
        next.station1QuizSolved = [];
        next.comparatives = [];
        break;
      case "station-2":
        next.station2VerbQuizSolved = [];
        next.newspaper = clone(DEFAULT_NEWSPAPER);
        break;
      case "station-3":
        next.station3RadarSolved = [];
        next.metacognition = clone(DEFAULT_METACOGNITION);
        break;
      case "station-4":
        next.practiceStats = clone(DEFAULT_STATE.practiceStats);
        break;
      default:
        return next;
    }
    save(next);
    return next;
  }

  function parseBackupJson(rawText) {
    if (typeof rawText !== "string" || !rawText.trim()) {
      return { ok: false, error: "El archivo está vacío." };
    }
    if (rawText.length > MAX_IMPORT_BYTES) {
      return { ok: false, error: "El archivo supera el límite seguro (512 KB)." };
    }
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      return { ok: false, error: "El archivo no contiene un formato JSON válido." };
    }
    if (!isPlainObject(parsed)) {
      return { ok: false, error: "El respaldo JSON debe ser un objeto válido de Misión STEAM." };
    }
    const knownKeys = [
      "version",
      "speechRate",
      "customItems",
      "completedStation0Challenges",
      "station1QuizSolved",
      "station2VerbQuizSolved",
      "station3RadarSolved",
      "comparatives",
      "newspaper",
      "metacognition",
      "practiceStats"
    ];
    const hasRecognizedKey = knownKeys.some((k) => Object.prototype.hasOwnProperty.call(parsed, k));
    if (!hasRecognizedKey) {
      return { ok: false, error: "Este archivo JSON no corresponde a un respaldo de Misión STEAM." };
    }
    const normalized = normalizeState(parsed);
    return { ok: true, state: normalized };
  }

  function exportJson(state) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progreso-miguel-steam-a1-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function isSectionDirty(currentState, sectionId) {
    const s = normalizeState(currentState);
    switch (sectionId) {
      case "station-0":
        return s.customItems.length > 0 || s.completedStation0Challenges.length > 0;
      case "station-1":
        return s.station1QuizSolved.length > 0 || s.comparatives.length > 0;
      case "station-2":
        return (
          s.station2VerbQuizSolved.length > 0 ||
          JSON.stringify(s.newspaper) !== JSON.stringify(DEFAULT_NEWSPAPER)
        );
      case "station-3":
        return (
          s.station3RadarSolved.length > 0 ||
          JSON.stringify(s.metacognition) !== JSON.stringify(DEFAULT_METACOGNITION)
        );
      case "station-4":
        return JSON.stringify(s.practiceStats) !== JSON.stringify(DEFAULT_STATE.practiceStats);
      default:
        return false;
    }
  }

  return {
    STORAGE_KEY,
    MAX_IMPORT_BYTES,
    load,
    save,
    reset,
    resetSection,
    isSectionDirty,
    parseBackupJson,
    exportJson
  };
})();
