/* Pronunciación nativa en inglés (Web Speech API) sin dependencias externas */

window.AppSpeech = (function () {
  let currentRate = 0.85;

  function isSupported() {
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  }

  function setRate(rate) {
    currentRate = rate;
  }

  function getRate() {
    return currentRate;
  }

  function pickEnglishVoice() {
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find((v) => v.lang === "en-US" && /natural|google|samantha|aria|jenny/i.test(v.name)) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) ||
      null
    );
  }

  function speak(text, onNotice) {
    if (!text || !text.trim()) return;
    if (!isSupported()) {
      if (onNotice) onNotice("Tu navegador no soporta audio en inglés automático.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = "en-US";
      utterance.rate = currentRate;
      utterance.pitch = 1.02;
      const voice = pickEnglishVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
      if (onNotice) onNotice("Escuchando en inglés...");
    } catch (err) {
      if (onNotice) onNotice("No se pudo reproducir el audio en este dispositivo.");
    }
  }

  if (isSupported() && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = function () {
      pickEnglishVoice();
    };
  }

  return { isSupported, setRate, getRate, speak };
})();
