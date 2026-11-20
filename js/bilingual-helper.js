/* Asistente Bilingüe Local A1: detecta palabras ES -> sugiere chips EN sin inventar */

window.BilingualHelper = (function () {
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function analyze(inputText) {
    const norm = normalize(inputText);
    if (!norm) {
      return { matches: [], suggestedEn: "" };
    }

    const glossary = (window.APP_DATA && window.APP_DATA.esToEnGlossary) || [];
    const sorted = glossary.slice().sort((a, b) => b.es.length - a.es.length);

    const matches = [];
    const seenEn = new Set();
    let working = " " + norm + " ";

    sorted.forEach((entry) => {
      const needle = normalize(entry.es);
      if (!needle) return;
      const pattern = new RegExp("(^|[^a-z0-9])" + needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=$|[^a-z0-9])", "i");
      if (pattern.test(working)) {
        if (!seenEn.has(entry.en.toLowerCase())) {
          seenEn.add(entry.en.toLowerCase());
          matches.push(entry);
        }
        working = working.replace(pattern, "$1" + entry.en);
      }
    });

    const cleanedDraft = working.trim().replace(/\s+/g, " ");
    return {
      matches: matches,
      suggestedEn: matches.length > 0 ? cleanedDraft : inputText.trim()
    };
  }

  return { normalize, analyze };
})();
