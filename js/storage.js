/* Persistencia local segura en localStorage para Misión STEAM A1 */

window.AppStorage = (function () {
  const STORAGE_KEY = "migue_steam_english_a1_v1";

  const DEFAULT_STATE = {
    version: 1,
    speechRate: 0.85,
    customItems: [],
    completedStation0Challenges: [],
    station1QuizSolved: [],
    /* Espacios reservados para Estaciones 1 a 4 */
    comparatives: [],
    newspaper: {},
    metacognition: {},
    practiceStats: { completed: 0 }
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return Object.assign(clone(DEFAULT_STATE), parsed);
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
