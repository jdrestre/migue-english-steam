/* Persistencia local segura en localStorage para Misión STEAM A1 */

window.AppStorage = (function () {
  const STORAGE_KEY = "migue_steam_english_a1_v1";

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

  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      const merged = Object.assign(clone(DEFAULT_STATE), parsed);
      merged.newspaper = Object.assign(clone(DEFAULT_NEWSPAPER), parsed.newspaper || {});
      merged.practiceStats = Object.assign(clone(DEFAULT_STATE.practiceStats), parsed.practiceStats || {});
      const incomingMeta = parsed.metacognition || {};
      merged.metacognition = clone(DEFAULT_METACOGNITION);
      ["q1", "q2", "q3", "q4", "q5"].forEach((k) => {
        if (incomingMeta[k]) {
          merged.metacognition[k] = Object.assign(merged.metacognition[k], incomingMeta[k]);
        }
      });
      return merged;
    } catch (err) {
      return clone(DEFAULT_STATE);
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  function exportJson(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "progreso-miguel-steam-a1.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return { load, save, reset, exportJson };
})();
