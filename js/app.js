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

  /* --- Estación 0: Constructor LEGO por Colores (Solo Ejemplos Planteados) --- */
  let activeChallengeIdx = 0;
  let selectedPieceIds = [];

  const COLOR_LABELS = {
    blue: "🟦 Azul",
    orange: "🟧 Naranja",
    green: "🟩 Verde",
    purple: "🟪 Morado"
  };

  function getActiveChallenge() {
    const list = window.APP_DATA.station0Challenges || [];
    return list[activeChallengeIdx] || list[0];
  }

  function renderStation0Builder() {
    const challenges = window.APP_DATA.station0Challenges || [];
    const challenge = getActiveChallenge();
    const selectorRow = document.getElementById("challenge-selector-row");
    const spanishText = document.getElementById("builder-spanish-text");
    const colorGuide = document.getElementById("builder-color-guide");
    const pieceBank = document.getElementById("builder-piece-bank");
    const assemblyZone = document.getElementById("builder-assembly-zone");
    const previewBox = document.getElementById("builder-preview-box");
    const statusBadge = document.getElementById("builder-status-badge");
    const previewOutput = document.getElementById("builder-preview-output");
    const speakBtn = document.getElementById("builder-speak-btn");
    const progressBadge = document.getElementById("builder-progress-badge");

    if (!challenge || !selectorRow || !pieceBank || !assemblyZone) return;

    const solvedIds = state.completedStation0Challenges || [];
    if (progressBadge) {
      progressBadge.textContent = `${solvedIds.length} de ${challenges.length} retos completados`;
    }

    /* 1. Botones de los ejemplos planteados */
    selectorRow.innerHTML = challenges
      .map((ch, idx) => {
        const isSolved = solvedIds.includes(ch.id);
        const isActive = idx === activeChallengeIdx;
        return `
          <button type="button" class="challenge-tab ${isActive ? "is-active" : ""} ${isSolved ? "is-solved" : ""}" data-ch-idx="${idx}">
            ${isSolved ? "✅ " : ""}${escapeHtml(ch.label)}
          </button>`;
      })
      .join("");

    selectorRow.querySelectorAll("[data-ch-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextIdx = Number(btn.getAttribute("data-ch-idx"));
        if (nextIdx === activeChallengeIdx) return;
        activeChallengeIdx = nextIdx;
        selectedPieceIds = [];
        renderStation0Builder();
      });
    });

    /* 2. Frase en Español + Pista de secuencia de colores LEGO */
    if (spanishText) spanishText.textContent = challenge.es;
    if (colorGuide) {
      const pills = challenge.pieces
        .map((p) => `<span class="guide-pill guide-${p.color}">${COLOR_LABELS[p.color]} (${escapeHtml(p.role)})</span>`)
        .join("<span>→</span>");
      colorGuide.innerHTML = `<span>Orden de colores:</span> ${pills}`;
    }

    /* 3. Banco de bloques desordenados (sin revelar la traducción en inglés) */
    const orderedIndices =
      challenge.shuffleOrder && challenge.shuffleOrder.length === challenge.pieces.length
        ? challenge.shuffleOrder
        : challenge.pieces.map((_, i) => i);

    pieceBank.innerHTML = orderedIndices
      .map((pieceIdx) => {
        const piece = challenge.pieces[pieceIdx];
        const isUsed = selectedPieceIds.includes(piece.id);
        return `
          <button type="button" class="lego-piece lego-piece-${piece.color}" data-pick-piece="${piece.id}" ${isUsed ? "disabled" : ""}>
            <span>+ ${escapeHtml(piece.en)}</span>
            <span class="es-mini">(${escapeHtml(piece.es)})</span>
          </button>`;
      })
      .join("");

    pieceBank.querySelectorAll("[data-pick-piece]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-pick-piece");
        if (!selectedPieceIds.includes(pid)) {
          selectedPieceIds.push(pid);
          renderStation0Builder();
        }
      });
    });

    /* 4. Zona de armado en inglés (con piezas seleccionadas) */
    const selectedPieces = selectedPieceIds
      .map((pid) => challenge.pieces.find((p) => p.id === pid))
      .filter(Boolean);

    if (selectedPieces.length === 0) {
      assemblyZone.innerHTML = `<span class="assembly-placeholder">Aquí aparecerán las piezas de inglés a medida que Miguel las elija...</span>`;
    } else {
      assemblyZone.innerHTML = selectedPieces
        .map(
          (piece) => `
          <button type="button" class="lego-piece lego-piece-${piece.color}" data-remove-piece="${piece.id}" title="Haz clic para devolver esta pieza">
            <span>${escapeHtml(piece.en)}</span>
            <span class="es-mini">✕</span>
          </button>`
        )
        .join("");

      assemblyZone.querySelectorAll("[data-remove-piece]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pid = btn.getAttribute("data-remove-piece");
          selectedPieceIds = selectedPieceIds.filter((id) => id !== pid);
          renderStation0Builder();
        });
      });
    }

    /* 5. Validación de orden exacto y bloqueo/desbloqueo de audio */
    const total = challenge.pieces.length;
    let isPrefixValid = true;
    for (let i = 0; i < selectedPieces.length; i += 1) {
      if (selectedPieces[i].id !== challenge.pieces[i].id) {
        isPrefixValid = false;
        break;
      }
    }

    const isCompleteAndCorrect = isPrefixValid && selectedPieces.length === total;

    assemblyZone.classList.remove("is-correct", "is-wrong");
    previewBox.classList.remove("is-correct", "is-wrong");
    statusBadge.classList.remove("status-idle", "status-progress", "status-wrong", "status-correct");

    if (selectedPieces.length === 0) {
      statusBadge.classList.add("status-idle");
      statusBadge.textContent = "🧩 Selecciona los bloques de colores en orden para armar la frase.";
      previewOutput.textContent = "Esperando los bloques de Miguel...";
    } else if (isCompleteAndCorrect) {
      assemblyZone.classList.add("is-correct");
      previewBox.classList.add("is-correct");
      statusBadge.classList.add("status-correct");
      statusBadge.textContent = "✅ ¡Correcto Miguel! Orden perfecto. Ya puedes escuchar tu frase en inglés.";
      previewOutput.textContent = challenge.targetEn;

      if (!solvedIds.includes(challenge.id)) {
        state.completedStation0Challenges = solvedIds.concat([challenge.id]);
        window.AppStorage.save(state);
        if (progressBadge) {
          progressBadge.textContent = `${state.completedStation0Challenges.length} de ${challenges.length} retos completados`;
        }
        const activeTab = selectorRow.querySelector(`.challenge-tab[data-ch-idx="${activeChallengeIdx}"]`);
        if (activeTab && !activeTab.textContent.includes("✅")) {
          activeTab.classList.add("is-solved");
          activeTab.textContent = `✅ ${challenge.label}`;
        }
        showToast("🎉 ¡Frase armada correctamente! Oprime el botón de audio para escucharla.");
      }
    } else if (isPrefixValid) {
      const nextPiece = challenge.pieces[selectedPieces.length];
      statusBadge.classList.add("status-progress");
      statusBadge.textContent = `⏳ ¡Muy bien! Llevas ${selectedPieces.length} de ${total}. Sigue el bloque ${COLOR_LABELS[nextPiece.color]}.`;
      previewOutput.textContent = selectedPieces.map((p) => p.en).join(" ") + " ...";
    } else {
      assemblyZone.classList.add("is-wrong");
      previewBox.classList.add("is-wrong");
      statusBadge.classList.add("status-wrong");
      statusBadge.textContent = "💡 Revisa el orden de los colores arriba. Haz clic en una pieza armada para devolverla.";
      previewOutput.textContent = selectedPieces.map((p) => p.en).join(" ");
    }

    if (speakBtn) {
      speakBtn.disabled = !isCompleteAndCorrect;
      speakBtn.classList.toggle("is-unlocked", isCompleteAndCorrect);
      speakBtn.textContent = isCompleteAndCorrect
        ? "🔊 Escuchar frase armada en inglés"
        : "🔒 Arma la frase correcta para escuchar";
    }
  }

  function initStation0Builder() {
    const undoBtn = document.getElementById("builder-undo-btn");
    const clearBtn = document.getElementById("builder-clear-btn");
    const speakBtn = document.getElementById("builder-speak-btn");

    if (undoBtn) {
      undoBtn.addEventListener("click", () => {
        if (selectedPieceIds.length === 0) return;
        selectedPieceIds.pop();
        renderStation0Builder();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        selectedPieceIds = [];
        renderStation0Builder();
      });
    }

    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        if (speakBtn.disabled) return;
        const challenge = getActiveChallenge();
        if (challenge) {
          window.AppSpeech.speak(challenge.targetEn, showToast);
        }
      });
    }

    renderStation0Builder();
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
        selectedPieceIds = [];
        renderBank();
        renderStation0Builder();
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
    initStation0Builder();
    initStorageActions();
  });
})();
