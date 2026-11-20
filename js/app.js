/* Controlador principal modular — Fase 0 (Base + Estación 0: Mapa y Banco Veraz) */

(function () {
  "use strict";

  let state = window.AppStorage.load();
  window.AppSpeech.setRate(state.speechRate || 0.85);

  /* --- Utilidades de UI --- */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getAllBankItems() {
    return window.APP_DATA.verifiedCoreItems.concat(state.customItems || []);
  }

  /* --- Navegación entre Estaciones --- */
  function initNavigation() {
    const tabs = document.querySelectorAll(".station-tab");
    const panels = document.querySelectorAll(".station-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("data-station");
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        panels.forEach((p) => {
          p.classList.toggle("is-active", p.id === targetId);
        });
      });
    });

    document.querySelectorAll("[data-goto-station]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-goto-station");
        const tab = document.querySelector(`.station-tab[data-station="${target}"]`);
        if (tab) tab.click();
      });
    });
  }

  /* --- Control de Velocidad de Audio --- */
  function initSpeechControls() {
    const slowBtn = document.getElementById("rate-slow-btn");
    const normalBtn = document.getElementById("rate-normal-btn");

    function updateButtons() {
      const isSlow = window.AppSpeech.getRate() < 0.9;
      if (slowBtn) slowBtn.classList.toggle("active", isSlow);
      if (normalBtn) normalBtn.classList.toggle("active", !isSlow);
    }

    if (slowBtn) {
      slowBtn.addEventListener("click", () => {
        window.AppSpeech.setRate(0.75);
        state.speechRate = 0.75;
        window.AppStorage.save(state);
        updateButtons();
        showToast("Voz en inglés: modo despacio (0.75x)");
      });
    }

    if (normalBtn) {
      normalBtn.addEventListener("click", () => {
        window.AppSpeech.setRate(1.0);
        state.speechRate = 1.0;
        window.AppStorage.save(state);
        updateButtons();
        showToast("Voz en inglés: modo normal (1.0x)");
      });
    }

    updateButtons();

    const welcomeAudioBtn = document.getElementById("welcome-audio-btn");
    if (welcomeAudioBtn) {
      welcomeAudioBtn.addEventListener("click", () => {
        window.AppSpeech.speak(
          "Hello Miguel Angel! Are you ready for the STEAM English challenge? Let's do it step by step!",
          showToast
        );
      });
    }
  }

  /* --- Temporizador Pomodoro Infantil (15 min enfoque / 5 min pausa) --- */
  function initPomodoro() {
    const display = document.getElementById("timer-display");
    const toggleBtn = document.getElementById("timer-toggle-btn");
    const modeBtn = document.getElementById("timer-mode-btn");
    if (!display || !toggleBtn || !modeBtn) return;

    let isBreak = false;
    let remainingSec = 15 * 60;
    let intervalId = null;

    function formatTime(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      return `${m}:${s}`;
    }

    function render() {
      display.textContent = formatTime(remainingSec);
      toggleBtn.textContent = intervalId ? "Pausar" : "Iniciar";
      modeBtn.textContent = isBreak ? "Pausa 5m" : "Estudio 15m";
    }

    toggleBtn.addEventListener("click", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      } else {
        intervalId = setInterval(() => {
          remainingSec -= 1;
          if (remainingSec <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            showToast(isBreak ? "¡Fin de la pausa! Listos para el siguiente reto." : "¡15 minutos logrados! Hora de una pausa activa de 5 minutos.");
            isBreak = !isBreak;
            remainingSec = (isBreak ? 5 : 15) * 60;
          }
          render();
        }, 1000);
      }
      render();
    });

    modeBtn.addEventListener("click", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      isBreak = !isBreak;
      remainingSec = (isBreak ? 5 : 15) * 60;
      render();
    });

    render();
  }

  /* --- Estación 0: Leyenda LEGO y Guía Neuroeducativa --- */
  function renderStation0Static() {
    const legendEl = document.getElementById("lego-legend-grid");
    if (legendEl) {
      legendEl.innerHTML = window.APP_DATA.legoLegend
        .map(
          (item) => `
          <div class="lego-card ${item.cls}">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.desc)}</p>
            <span class="lego-example">Ej: ${escapeHtml(item.example)}</span>
          </div>`
        )
        .join("");
    }

    const rulesEl = document.getElementById("neuro-rules-list");
    if (rulesEl) {
      rulesEl.innerHTML = window.APP_DATA.neuroRules
        .map((rule) => `<li>${escapeHtml(rule)}</li>`)
        .join("");
    }
  }

  /* --- Estación 0: Banco de Actividades Veraces y Fiestas Culturales --- */
  function renderBank() {
    const grid = document.getElementById("bank-items-grid");
    const countBadge = document.getElementById("bank-count-badge");
    if (!grid) return;

    const items = getAllBankItems();
    if (countBadge) {
      countBadge.textContent = `${items.length} elementos activos`;
    }

    grid.innerHTML = items
      .map((item) => {
        const catClass = item.category === "cultural" ? "cat-cultural" : "cat-steam";
        const catLabel = item.category === "cultural" ? "Fiesta / Evento Cultural" : "Actividad STEAM";
        const verifiedBadge = item.verified
          ? `<span class="item-cat cat-verified">Confirmado del correo</span>`
          : `<span class="item-cat">Agregado del cuaderno</span>`;

        const deleteBtn = item.verified
          ? ""
          : `<button type="button" class="btn btn-danger-soft" data-delete-item="${escapeHtml(item.id)}">Quitar</button>`;

        return `
          <article class="bank-item ${item.verified ? "is-verified" : ""}">
            <div>
              <div class="bank-item-top">
                <span class="item-cat ${catClass}">${catLabel}</span>
                ${verifiedBadge}
              </div>
              <p class="item-en">${escapeHtml(item.en)}</p>
              <p class="item-es">${escapeHtml(item.es)}</p>
            </div>
            <div class="bank-item-actions">
              <button type="button" class="btn btn-audio btn-sm" data-speak="${escapeHtml(item.en)}">🔊 Escuchar</button>
              ${deleteBtn}
            </div>
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AppSpeech.speak(btn.getAttribute("data-speak"), showToast);
      });
    });

    grid.querySelectorAll("[data-delete-item]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-delete-item");
        state.customItems = (state.customItems || []).filter((i) => i.id !== id);
        window.AppStorage.save(state);
        renderBank();
        showToast("Elemento quitado del banco.");
      });
    });
  }

  function initAddBankForm() {
    const form = document.getElementById("add-bank-form");
    const inputEs = document.getElementById("new-item-es");
    const inputEn = document.getElementById("new-item-en");
    const selectCat = document.getElementById("new-item-cat");
    const chipsWrap = document.getElementById("optional-cultural-chips");

    if (chipsWrap) {
      chipsWrap.innerHTML = window.APP_DATA.optionalCulturalChips
        .map(
          (chip, idx) => `
          <button type="button" class="word-chip" data-chip-idx="${idx}">
            <span>+ ${escapeHtml(chip.en)}</span>
            <span class="es-mini">(${escapeHtml(chip.es)})</span>
          </button>`
        )
        .join("");

      chipsWrap.querySelectorAll("[data-chip-idx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const chip = window.APP_DATA.optionalCulturalChips[Number(btn.getAttribute("data-chip-idx"))];
          if (!chip) return;
          if (inputEs) inputEs.value = chip.es;
          if (inputEn) inputEn.value = chip.en;
          if (selectCat) selectCat.value = chip.category;
          showToast(`Cargado en el formulario: ${chip.en}. Haz clic en "Agregar al Banco" si lo vieron en clase.`);
        });
      });
    }

    if (inputEs && inputEn) {
      inputEs.addEventListener("input", () => {
        if (inputEn.dataset.userEdited === "true") return;
        const analysis = window.BilingualHelper.analyze(inputEs.value);
        if (analysis.matches.length > 0) {
          inputEn.value = analysis.matches[0].en;
        }
      });

      inputEn.addEventListener("input", () => {
        inputEn.dataset.userEdited = inputEn.value.trim() ? "true" : "false";
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const esVal = (inputEs.value || "").trim();
        const enVal = (inputEn.value || "").trim();
        const catVal = selectCat.value || "cultural";

        if (!enVal || !esVal) {
          showToast("Completa el nombre en español y en inglés antes de agregar.");
          return;
        }

        const exists = getAllBankItems().some(
          (i) => i.en.toLowerCase() === enVal.toLowerCase()
        );
        if (exists) {
          showToast("Ese elemento ya existe en el banco.");
          return;
        }

        state.customItems.push({
          id: "custom-" + Date.now(),
          en: enVal,
          es: esVal,
          category: catVal,
          verified: false
        });
        window.AppStorage.save(state);
        renderBank();
        form.reset();
        if (inputEn) inputEn.dataset.userEdited = "false";
        showToast(`Agregado al banco: ${enVal}`);
      });
    }
  }

  /* --- Estación 0: Probador Bilingüe Interactivo para Miguel --- */
  function initBilingualSandbox() {
    const inputEs = document.getElementById("sandbox-input-es");
    const inputEn = document.getElementById("sandbox-input-en");
    const chipsBox = document.getElementById("sandbox-chips");
    const previewOut = document.getElementById("sandbox-preview-output");
    const speakBtn = document.getElementById("sandbox-speak-btn");

    if (!inputEs || !inputEn || !chipsBox || !previewOut) return;

    inputEs.value = state.sandboxEs || "";
    inputEn.value = state.sandboxEn || "";

    function updatePreview() {
      const enText = inputEn.value.trim();
      const esText = inputEs.value.trim();
      if (enText) {
        previewOut.textContent = enText;
      } else if (esText) {
        previewOut.textContent = `Idea de Miguel: "${esText}" (usa los chips o escribe la versión en inglés abajo)`;
      } else {
        previewOut.textContent = "Escribe arriba una idea corta (ej. 'El laberinto fue divertido') o haz clic en un botón de ejemplo.";
      }
    }

    function renderSuggestions() {
      const result = window.BilingualHelper.analyze(inputEs.value);
      if (result.matches.length === 0) {
        chipsBox.innerHTML = `<span class="helper-note">Tip: prueba escribir palabras como <strong>laberinto</strong>, <strong>atrapasueños</strong>, <strong>divertido</strong>, <strong>fácil</strong>, <strong>difícil</strong> o <strong>piano</strong>.</span>`;
        return;
      }

      chipsBox.innerHTML = result.matches
        .map(
          (m) => `
          <button type="button" class="word-chip" data-insert-en="${escapeHtml(m.en)}">
            <span>+ ${escapeHtml(m.en)}</span>
            <span class="es-mini">(${escapeHtml(m.displayEs)})</span>
          </button>`
        )
        .join("");

      chipsBox.querySelectorAll("[data-insert-en]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const phrase = btn.getAttribute("data-insert-en");
          const current = inputEn.value.trim();
          inputEn.value = current ? `${current} ${phrase}` : phrase;
          state.sandboxEn = inputEn.value;
          window.AppStorage.save(state);
          updatePreview();
        });
      });
    }

    inputEs.addEventListener("input", () => {
      state.sandboxEs = inputEs.value;
      window.AppStorage.save(state);
      renderSuggestions();
      updatePreview();
    });

    inputEn.addEventListener("input", () => {
      state.sandboxEn = inputEn.value;
      window.AppStorage.save(state);
      updatePreview();
    });

    document.querySelectorAll("[data-sandbox-demo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        inputEs.value = btn.getAttribute("data-demo-es") || "";
        inputEn.value = btn.getAttribute("data-demo-en") || "";
        state.sandboxEs = inputEs.value;
        state.sandboxEn = inputEn.value;
        window.AppStorage.save(state);
        renderSuggestions();
        updatePreview();
        showToast("Ejemplo cargado en el espacio de Miguel.");
      });
    });

    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        const text = inputEn.value.trim();
        if (!text) {
          showToast("Primero escribe o carga una frase en inglés para escucharla.");
          return;
        }
        window.AppSpeech.speak(text, showToast);
      });
    }

    renderSuggestions();
    updatePreview();
  }

  /* --- Respaldo y Reinicio --- */
  function initStorageActions() {
    const exportBtn = document.getElementById("export-json-btn");
    const resetBtn = document.getElementById("reset-data-btn");

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        window.AppStorage.exportJson(state);
        showToast("Respaldo descargado (.json).");
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const ok = window.confirm("¿Reiniciar los datos guardados de prueba en este navegador?");
        if (!ok) return;
        state = window.AppStorage.reset();
        window.AppSpeech.setRate(state.speechRate);
        renderBank();
        initBilingualSandbox();
        showToast("Datos reiniciados correctamente.");
      });
    }
  }

  /* --- Inicialización --- */
  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSpeechControls();
    initPomodoro();
    renderStation0Static();
    renderBank();
    initAddBankForm();
    initBilingualSandbox();
    initStorageActions();
  });
})();
