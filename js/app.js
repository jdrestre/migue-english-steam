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
        if (typeof tab.scrollIntoView === "function") {
          tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
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
        renderStation1Builder();
        renderStation2Newspaper();
        renderStation3All();
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
        renderStation1Builder();
        renderStation2Newspaper();
        renderStation3All();
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

  /* ==================== ESTACIÓN 1: COMPARATIVES BUILDER ==================== */
  let compDraft = {
    item1Id: null,
    verb: "was",
    adjId: null,
    hasThan: false,
    item2Id: null
  };

  function renderStation1Warmups() {
    const grid = document.getElementById("st1-warmup-grid");
    if (!grid) return;
    const warmups = (window.APP_DATA.interestWarmups && window.APP_DATA.interestWarmups.comparatives) || [];

    grid.innerHTML = warmups
      .map(
        (w, idx) => `
        <article class="warmup-card">
          <div>
            <span class="warmup-badge">${w.icon} ${escapeHtml(w.badge)}</span>
            <div class="colored-sentence" style="margin: 10px 0 8px;">
              <span class="tok tok-blue">${escapeHtml(w.blue)}</span>
              <span class="tok tok-orange">${escapeHtml(w.orange)}</span>
              <span class="tok tok-green">${escapeHtml(w.green)}</span>
              <span class="tok tok-purple">${escapeHtml(w.purple)}.</span>
            </div>
            <p class="warmup-es">${escapeHtml(w.es)}</p>
          </div>
          <div>
            <button type="button" class="btn btn-audio btn-sm" data-warmup-speak="${idx}">🔊 Escuchar ejemplo</button>
          </div>
        </article>`
      )
      .join("");

    grid.querySelectorAll("[data-warmup-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const w = warmups[Number(btn.getAttribute("data-warmup-speak"))];
        if (w) window.AppSpeech.speak(w.en, showToast);
      });
    });
  }

  function renderStation1Quiz() {
    const grid = document.getElementById("st1-quiz-grid");
    const badge = document.getElementById("st1-quiz-badge");
    if (!grid) return;

    const items = window.APP_DATA.comparativeQuizItems || [];
    const solved = state.station1QuizSolved || [];

    if (badge) {
      badge.textContent =
        solved.length === items.length
          ? `🏆 ¡${solved.length} de ${items.length} dominados!`
          : `${solved.length} de ${items.length} dominados`;
    }

    grid.innerHTML = items
      .map((item) => {
        const isSolved = solved.includes(item.id);
        const optsHtml = item.options
          .map((opt) => {
            const cls = isSolved && opt.type === item.answer ? "is-right" : "";
            return `
              <button type="button" class="quiz-opt-btn ${cls}" data-qz-id="${item.id}" data-qz-type="${opt.type}" ${isSolved ? "disabled" : ""}>
                ${isSolved && opt.type === item.answer ? "✅ " : ""}${escapeHtml(opt.label)}
              </button>`;
          })
          .join("");

        return `
          <article class="quiz-card ${isSolved ? "is-solved" : ""}" id="card-${item.id}">
            <div class="quiz-word">
              <strong>${escapeHtml(item.base)}</strong>
              <span>(${escapeHtml(item.es)})</span>
            </div>
            <div class="quiz-options">${optsHtml}</div>
            <div class="quiz-feedback ${isSolved ? "ok" : ""}" id="fb-${item.id}">
              ${isSolved ? escapeHtml(item.tipOk) : "Elige la regla correcta:"}
            </div>
            ${
              isSolved
                ? `<button type="button" class="btn btn-audio btn-sm" data-qz-speak="${escapeHtml(item.correctForm)}">🔊 Escuchar "${escapeHtml(item.correctForm)}"</button>`
                : ""
            }
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-qz-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-qz-id");
        const chosen = btn.getAttribute("data-qz-type");
        const item = items.find((i) => i.id === qid);
        if (!item) return;

        if (chosen === item.answer) {
          if (!state.station1QuizSolved.includes(qid)) {
            state.station1QuizSolved.push(qid);
            window.AppStorage.save(state);
          }
          renderStation1Quiz();
          window.AppSpeech.speak(item.correctForm, showToast);
        } else {
          btn.classList.add("is-wrong");
          const fb = document.getElementById(`fb-${qid}`);
          if (fb) {
            fb.className = "quiz-feedback retry";
            fb.textContent = item.tipRetry;
          }
        }
      });
    });

    grid.querySelectorAll("[data-qz-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AppSpeech.speak(btn.getAttribute("data-qz-speak"), showToast);
      });
    });
  }

  function renderStation1Builder() {
    const item1Wrap = document.getElementById("comp-item1-chips");
    const item2Wrap = document.getElementById("comp-item2-chips");
    const shortWrap = document.getElementById("comp-adj-short");
    const longWrap = document.getElementById("comp-adj-long");
    const irregWrap = document.getElementById("comp-adj-irregular");
    const verbWrap = document.getElementById("comp-verb-chips");
    const thanBtn = document.getElementById("comp-than-btn");
    const slotsBar = document.getElementById("comp-slots-bar");
    const previewBox = document.getElementById("comp-preview-box");
    const statusBadge = document.getElementById("comp-status-badge");
    const previewOut = document.getElementById("comp-preview-output");
    const esMeaning = document.getElementById("comp-spanish-meaning");
    const speakBtn = document.getElementById("comp-speak-btn");
    const saveBtn = document.getElementById("comp-save-btn");

    if (!item1Wrap || !item2Wrap || !shortWrap) return;

    const bankItems = getAllBankItems();
    const adjectives = window.APP_DATA.comparativeAdjectives || [];

    if (compDraft.item1Id && !bankItems.some((i) => i.id === compDraft.item1Id)) compDraft.item1Id = null;
    if (compDraft.item2Id && !bankItems.some((i) => i.id === compDraft.item2Id)) compDraft.item2Id = null;

    /* 1. Chips de Bloque Azul (Elemento 1) */
    item1Wrap.innerHTML = bankItems
      .map((item) => {
        const sel = compDraft.item1Id === item.id;
        return `
          <button type="button" class="lego-piece lego-piece-blue ${sel ? "is-selected" : ""}" data-c-item1="${escapeHtml(item.id)}">
            <span>${escapeHtml(item.en)}</span>
            <span class="es-mini">(${escapeHtml(item.es)})</span>
          </button>`;
      })
      .join("");

    item1Wrap.querySelectorAll("[data-c-item1]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-c-item1");
        compDraft.item1Id = compDraft.item1Id === id ? null : id;
        const chosen = bankItems.find((i) => i.id === compDraft.item1Id);
        if (chosen) {
          compDraft.verb = chosen.category === "cultural" ? "is" : "was";
        }
        renderStation1Builder();
      });
    });

    /* 2. Verbo (was / is) */
    if (verbWrap) {
      verbWrap.querySelectorAll("[data-comp-verb]").forEach((btn) => {
        const v = btn.getAttribute("data-comp-verb");
        btn.classList.toggle("is-selected", compDraft.verb === v);
      });
    }

    /* 3. Chips de Adjetivos Naranja */
    function renderAdjGroup(container, groupName) {
      const list = adjectives.filter((a) => a.group === groupName);
      container.innerHTML = list
        .map((adj) => {
          const sel = compDraft.adjId === adj.id;
          return `
            <button type="button" class="lego-piece lego-piece-orange ${sel ? "is-selected" : ""}" data-c-adj="${adj.id}">
              <span>${escapeHtml(adj.en)}</span>
              <span class="es-mini">(${escapeHtml(adj.es)})</span>
            </button>`;
        })
        .join("");

      container.querySelectorAll("[data-c-adj]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const aid = btn.getAttribute("data-c-adj");
          compDraft.adjId = compDraft.adjId === aid ? null : aid;
          renderStation1Builder();
        });
      });
    }

    renderAdjGroup(shortWrap, "short");
    renderAdjGroup(longWrap, "long");
    renderAdjGroup(irregWrap, "irregular");

    /* 4. Conector Verde (than) */
    if (thanBtn) {
      thanBtn.classList.toggle("is-selected", compDraft.hasThan);
      thanBtn.innerHTML = compDraft.hasThan
        ? `<span>✓ than</span> <span class="es-mini">(que — puesto)</span>`
        : `<span>+ than</span> <span class="es-mini">(que)</span>`;
    }

    /* 5. Chips de Bloque Morado (Elemento 2) */
    item2Wrap.innerHTML = bankItems
      .map((item) => {
        const sel = compDraft.item2Id === item.id;
        return `
          <button type="button" class="lego-piece lego-piece-purple ${sel ? "is-selected" : ""}" data-c-item2="${escapeHtml(item.id)}">
            <span>${escapeHtml(item.en)}</span>
            <span class="es-mini">(${escapeHtml(item.es)})</span>
          </button>`;
      })
      .join("");

    item2Wrap.querySelectorAll("[data-c-item2]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-c-item2");
        compDraft.item2Id = compDraft.item2Id === id ? null : id;
        renderStation1Builder();
      });
    });

    /* 6. Visualizador de Slots LEGO y Validación en Vivo */
    const item1 = bankItems.find((i) => i.id === compDraft.item1Id) || null;
    const adj = adjectives.find((a) => a.id === compDraft.adjId) || null;
    const item2 = bankItems.find((i) => i.id === compDraft.item2Id) || null;

    if (slotsBar) {
      slotsBar.innerHTML = `
        <span class="lego-slot ${item1 ? "filled-blue" : ""}">${item1 ? escapeHtml(item1.en) : "1. 🟦 Cosa 1"}</span>
        <span class="lego-slot ${adj ? "filled-orange" : ""}">${adj ? escapeHtml(compDraft.verb + " " + adj.en) : "2. 🟧 " + compDraft.verb + " + comparativo"}</span>
        <span class="lego-slot ${compDraft.hasThan ? "filled-green" : ""}">${compDraft.hasThan ? "than" : "3. 🟩 than"}</span>
        <span class="lego-slot ${item2 ? "filled-purple" : ""}">${item2 ? escapeHtml(item2.en) : "4. 🟪 Cosa 2"}</span>
      `;
    }

    const isSameItem = Boolean(item1 && item2 && item1.id === item2.id);
    const isComplete = Boolean(item1 && adj && compDraft.hasThan && item2 && !isSameItem);

    previewBox.classList.remove("is-correct", "is-wrong");
    statusBadge.classList.remove("status-idle", "status-progress", "status-wrong", "status-correct");

    if (isSameItem) {
      previewBox.classList.add("is-wrong");
      statusBadge.classList.add("status-wrong");
      statusBadge.textContent = "💡 Elegiste la misma actividad en Azul y Morado. Cambia una para comparar dos cosas distintas.";
    } else if (isComplete) {
      previewBox.classList.add("is-correct");
      statusBadge.classList.add("status-correct");
      statusBadge.textContent = "✅ ¡Comparativo perfecto Miguel! Ya puedes escucharlo y guardarlo para el martes.";
    } else if (!item1) {
      statusBadge.classList.add("status-idle");
      statusBadge.textContent = "🧩 Paso 1: Elige el Bloque Azul (Actividad o Fiesta 1).";
    } else if (!adj) {
      statusBadge.classList.add("status-progress");
      statusBadge.textContent = "⏳ Paso 2: Elige el Bloque Naranja (Adjetivo comparativo).";
    } else if (!compDraft.hasThan) {
      statusBadge.classList.add("status-progress");
      statusBadge.textContent = "⏳ Paso 3: ¡No olvides el Bloque Verde! Oprime el botón '+ than (que)'.";
    } else {
      statusBadge.classList.add("status-progress");
      statusBadge.textContent = "⏳ Paso 4: Elige el Bloque Morado (Actividad o Fiesta 2) para cerrar la comparación.";
    }

    const formatItem2 = (it) => {
      if (!it) return "";
      if (it.id === "steam-maze") return "the maze";
      if (it.id === "steam-dream-catcher") return "the dream catcher";
      return it.en.startsWith("The ") ? "the " + it.en.slice(4) : it.en;
    };

    const item2Lower = formatItem2(item2);
    const parts = [];
    if (item1) parts.push(item1.en);
    if (adj) parts.push(`${compDraft.verb} ${adj.en}`);
    if (compDraft.hasThan) parts.push("than");
    if (item2) parts.push(item2Lower);

    const fullSentenceEn = isComplete ? `${item1.en} ${compDraft.verb} ${adj.en} than ${item2Lower}.` : "";
    const verbEs = compDraft.verb === "is" ? "es" : "fue";
    const fullSentenceEs = isComplete ? `${item1.es} ${verbEs} ${adj.es} que ${item2.es}.` : "";

    if (previewOut) {
      if (isComplete) {
        previewOut.innerHTML = `
          <div class="colored-sentence">
            <span class="tok tok-blue">${escapeHtml(item1.en)}</span>
            <span class="tok tok-orange">${escapeHtml(compDraft.verb + " " + adj.en)}</span>
            <span class="tok tok-green">than</span>
            <span class="tok tok-purple">${escapeHtml(item2Lower)}.</span>
          </div>`;
      } else {
        previewOut.textContent = parts.length > 0 ? parts.join(" ") + " ..." : "Arma tu comparación con los 4 colores...";
      }
    }

    if (esMeaning) {
      esMeaning.innerHTML = isComplete
        ? `<strong>Tu opinión en español:</strong> ${escapeHtml(fullSentenceEs)}`
        : "Traducción de verificación: aparecerá cuando armes los 4 bloques.";
    }

    if (speakBtn) {
      speakBtn.disabled = !isComplete;
      speakBtn.classList.toggle("is-unlocked", isComplete);
      speakBtn.textContent = isComplete
        ? "🔊 Escuchar mi comparativo"
        : "🔒 Completa los 4 bloques para escuchar";
      speakBtn.dataset.sentenceEn = fullSentenceEn;
    }

    if (saveBtn) {
      saveBtn.disabled = !isComplete;
      saveBtn.dataset.sentenceEn = fullSentenceEn;
      saveBtn.dataset.sentenceEs = fullSentenceEs;
    }
  }

  function renderSavedComparatives() {
    const listEl = document.getElementById("comp-saved-list");
    const badge = document.getElementById("comp-saved-badge");
    if (!listEl) return;

    const saved = state.comparatives || [];
    if (badge) {
      badge.textContent =
        saved.length >= 3
          ? `🏆 ${saved.length} guardadas — ¡Meta de Estación 1 lograda!`
          : `${saved.length} guardadas (Meta: 3+)`;
    }

    if (saved.length === 0) {
      listEl.innerHTML = `<p class="helper-note" style="margin: 0;">Aún no hay comparativos guardados. Arma tu primera oración arriba (por ejemplo comparando <strong>The Maze</strong> y <strong>The Dream Catcher</strong>) y haz clic en <strong>Guardar en mi lista</strong>.</p>`;
      return;
    }

    listEl.innerHTML = saved
      .map((entry) => {
        const sentenceHtml = entry.tokens
          ? `<div class="colored-sentence">
              <span class="tok tok-blue">${escapeHtml(entry.tokens.blue)}</span>
              <span class="tok tok-orange">${escapeHtml(entry.tokens.orange)}</span>
              <span class="tok tok-green">than</span>
              <span class="tok tok-purple">${escapeHtml(entry.tokens.purple)}.</span>
            </div>`
          : `<strong style="font-size: 1rem;">${escapeHtml(entry.en)}</strong>`;

        return `
          <article class="saved-item">
            <div class="saved-item-text">
              ${sentenceHtml}
              ${entry.es ? `<span class="warmup-es">${escapeHtml(entry.es)}</span>` : ""}
            </div>
            <div class="saved-item-actions">
              <button type="button" class="btn btn-audio btn-sm" data-saved-speak="${escapeHtml(entry.en)}">🔊 Escuchar</button>
              <button type="button" class="btn btn-danger-soft" data-saved-del="${escapeHtml(entry.id)}">Quitar</button>
            </div>
          </article>`;
      })
      .join("");

    listEl.querySelectorAll("[data-saved-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AppSpeech.speak(btn.getAttribute("data-saved-speak"), showToast);
      });
    });

    listEl.querySelectorAll("[data-saved-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-saved-del");
        state.comparatives = (state.comparatives || []).filter((c) => c.id !== id);
        window.AppStorage.save(state);
        renderSavedComparatives();
        showToast("Comparativo eliminado de la lista.");
      });
    });
  }

  function initStation1() {
    renderStation1Warmups();
    renderStation1Quiz();
    renderStation1Builder();
    renderSavedComparatives();

    const verbWrap = document.getElementById("comp-verb-chips");
    if (verbWrap) {
      verbWrap.querySelectorAll("[data-comp-verb]").forEach((btn) => {
        btn.addEventListener("click", () => {
          compDraft.verb = btn.getAttribute("data-comp-verb") || "was";
          renderStation1Builder();
        });
      });
    }

    const thanBtn = document.getElementById("comp-than-btn");
    if (thanBtn) {
      thanBtn.addEventListener("click", () => {
        compDraft.hasThan = !compDraft.hasThan;
        renderStation1Builder();
      });
    }

    const speakBtn = document.getElementById("comp-speak-btn");
    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        if (speakBtn.disabled || !speakBtn.dataset.sentenceEn) return;
        window.AppSpeech.speak(speakBtn.dataset.sentenceEn, showToast);
      });
    }

    const saveBtn = document.getElementById("comp-save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        if (saveBtn.disabled || !saveBtn.dataset.sentenceEn) return;
        const en = saveBtn.dataset.sentenceEn;
        const es = saveBtn.dataset.sentenceEs || "";
        const bankItems = getAllBankItems();
        const item1 = bankItems.find((i) => i.id === compDraft.item1Id);
        const adj = (window.APP_DATA.comparativeAdjectives || []).find((a) => a.id === compDraft.adjId);
        const item2 = bankItems.find((i) => i.id === compDraft.item2Id);
        const formatItem2 = (it) => {
      if (!it) return "";
      if (it.id === "steam-maze") return "the maze";
      if (it.id === "steam-dream-catcher") return "the dream catcher";
      return it.en.startsWith("The ") ? "the " + it.en.slice(4) : it.en;
    };

    const item2Lower = formatItem2(item2);

        const dup = (state.comparatives || []).some((c) => c.en.toLowerCase() === en.toLowerCase());
        if (dup) {
          showToast("¡Esa oración ya está en tu lista del martes!");
          return;
        }

        state.comparatives.push({
          id: "cmp-" + Date.now(),
          en: en,
          es: es,
          tokens: item1 && adj && item2 ? {
            blue: item1.en,
            orange: `${compDraft.verb} ${adj.en}`,
            purple: item2Lower
          } : null
        });
        window.AppStorage.save(state);
        renderSavedComparatives();
        showToast("💾 ¡Comparativo guardado para el martes!");
      });
    }

    const clearBtn = document.getElementById("comp-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        compDraft = { item1Id: null, verb: "was", adjId: null, hasThan: false, item2Id: null };
        renderStation1Builder();
      });
    }

    /* Caja opcional bilingüe para comparativos libres */
    const customEs = document.getElementById("comp-custom-es");
    const customEn = document.getElementById("comp-custom-en");
    const customChips = document.getElementById("comp-custom-chips");
    const customSaveBtn = document.getElementById("comp-custom-save-btn");

    if (customEs && customEn && customChips) {
      customEs.addEventListener("input", () => {
        const res = window.BilingualHelper.analyze(customEs.value);
        if (res.matches.length === 0) {
          customChips.innerHTML = "";
          return;
        }
        customChips.innerHTML = res.matches
          .map(
            (m) => `
            <button type="button" class="word-chip" data-c-ins="${escapeHtml(m.en)}">
              <span>+ ${escapeHtml(m.en)}</span>
              <span class="es-mini">(${escapeHtml(m.displayEs)})</span>
            </button>`
          )
          .join("");

        customChips.querySelectorAll("[data-c-ins]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const phrase = btn.getAttribute("data-c-ins");
            const cur = customEn.value.trim();
            customEn.value = cur ? `${cur} ${phrase}` : phrase;
          });
        });
      });
    }

    if (customSaveBtn && customEn && customEs) {
      customSaveBtn.addEventListener("click", () => {
        const enRaw = customEn.value.trim();
        if (!enRaw) {
          showToast("Escribe primero la frase en inglés para guardarla.");
          return;
        }
        if (!/\bthan\b/i.test(enRaw)) {
          showToast("Recuerda incluir la palabra 'than' (que) para que sea un comparativo completo.");
          return;
        }
        const enClean = enRaw.endsWith(".") ? enRaw : enRaw + ".";
        state.comparatives.push({
          id: "cmp-" + Date.now(),
          en: enClean,
          es: customEs.value.trim(),
          tokens: null
        });
        window.AppStorage.save(state);
        customEs.value = "";
        customEn.value = "";
        if (customChips) customChips.innerHTML = "";
        renderSavedComparatives();
        showToast("💾 Frase comparativa propia guardada.");
      });
    }
  }

  /* ==================== ESTACIÓN 2: STEAM NEWSPAPER & PAST SIMPLE (R2 AWWWARDS) ==================== */
  let tmIsPast = false;
  let revealedMemoryKeys = new Set();

  function formatNewspaperObj(item) {
    if (!item) return "";
    if (item.id === "steam-maze") return "the maze";
    if (item.id === "steam-dream-catcher") return "the dream catcher";
    return item.en.startsWith("The ") ? "the " + item.en.slice(4) : item.en;
  }

  function joinEnglishList(arr) {
    const clean = (arr || []).filter(Boolean);
    if (clean.length === 0) return "";
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
    return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
  }

  function renderPastToken(verbText, memKey, isMemoryMode) {
    if (!isMemoryMode) {
      return `<span class="np-past">${escapeHtml(verbText)}</span>`;
    }
    const isRevealed = revealedMemoryKeys.has(memKey);
    if (isRevealed) {
      return `<button type="button" class="np-memory-btn is-revealed" data-mem-key="${escapeHtml(memKey)}" data-mem-word="${escapeHtml(verbText)}" title="Escuchar verbo en pasado">✓ ${escapeHtml(verbText)}</button>`;
    }
    return `<button type="button" class="np-memory-btn" data-mem-key="${escapeHtml(memKey)}" data-mem-word="${escapeHtml(verbText)}" title="Toca para recordar este verbo en Past Simple">???</button>`;
  }

  function highlightExtraPastVerbs(sentence, isMemoryMode, keyPrefix) {
    const escaped = escapeHtml(sentence);
    const knownPastRegex = /\b(participated|took place|created|made|built|worked on|worked|designed|painted|used|learned|was|were|played|watched|practiced|cut|glued|drew|shared|helped)\b/gi;
    let idx = 0;
    return escaped.replace(knownPastRegex, (match) => {
      idx += 1;
      return renderPastToken(match, `${keyPrefix}-${idx}`, isMemoryMode);
    });
  }

  function renderStation2TimeMachine() {
    const grid = document.getElementById("st2-tm-grid");
    const headerBar = document.getElementById("tm-header-bar");
    const toggleBtn = document.getElementById("tm-toggle-btn");
    const modeTitle = document.getElementById("tm-mode-title");
    const modeSub = document.getElementById("tm-mode-sub");
    if (!grid) return;

    const list = (window.APP_DATA.station2Data && window.APP_DATA.station2Data.timeMachineExamples) || [];

    if (headerBar) headerBar.classList.toggle("is-past-banner", tmIsPast);
    if (toggleBtn) {
      toggleBtn.classList.toggle("is-past", tmIsPast);
      toggleBtn.textContent = tmIsPast
        ? "⏪ Volver a Hoy (Presente)"
        : "⏳ Viajar al Pasado (Past Simple)";
    }
    if (modeTitle) {
      modeTitle.textContent = tmIsPast
        ? "🚀 Modo Activo: AYER — PAST SIMPLE (Pasado)"
        : "⏰ Modo Actual: HOY — PRESENTE";
    }
    if (modeSub) {
      modeSub.textContent = tmIsPast
        ? "¡Mira los verbos en Naranja! Con -ed (regulares) o cambiando forma (make → made) cuentas cosas que ya pasaron."
        : "Oprime el botón para viajar a AYER y ver cómo los verbos cambian a Naranja (Past Simple).";
    }

    grid.innerHTML = list
      .map((ex, idx) => {
        const prefix = tmIsPast ? `<span class="np-conn">Yesterday,</span> ` : "";
        const verbHtml = tmIsPast
          ? `<span class="tm-verb-pill tm-verb-past">${escapeHtml(ex.pastVerb)}</span>`
          : `<span class="tm-verb-pill tm-verb-present">${escapeHtml(ex.presentVerb)}</span>`;
        const morphHtml = tmIsPast
          ? `<div class="tm-morph-trail"><s>${escapeHtml(ex.presentVerb)}</s> <span>→</span> <strong>${escapeHtml(ex.pastVerb)}</strong></div>`
          : "";

        return `
          <article class="tm-card ${tmIsPast ? "is-past-mode" : ""}">
            <div>
              <div class="tm-top-row">
                <span class="tm-interest">${ex.icon} ${escapeHtml(ex.interest)}</span>
                <span class="tm-rule-pill">${escapeHtml(ex.ruleTag)}</span>
              </div>
              <p class="tm-sentence">
                ${prefix}${escapeHtml(ex.subject)} ${verbHtml} ${escapeHtml(ex.rest)}
              </p>
              ${morphHtml}
              <p class="warmup-es" style="margin-top: 6px;">${escapeHtml(tmIsPast ? ex.esPast : ex.esPresent)}</p>
            </div>
            <div>
              <button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-tm-speak="${idx}">
                🔊 ${tmIsPast ? "Escuchar en Pasado" : "Escuchar en Presente"}
              </button>
            </div>
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-tm-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ex = list[Number(btn.getAttribute("data-tm-speak"))];
        if (!ex) return;
        const phrase = tmIsPast
          ? `Yesterday, ${ex.subject} ${ex.pastVerb} ${ex.rest}`
          : `${ex.subject} ${ex.presentVerb} ${ex.rest}`;
        window.AppSpeech.speak(phrase, showToast);
      });
    });
  }

  function renderStation2Quiz() {
    const grid = document.getElementById("st2-quiz-grid");
    const badge = document.getElementById("st2-quiz-badge");
    if (!grid) return;

    const items = (window.APP_DATA.station2Data && window.APP_DATA.station2Data.pastVerbQuiz) || [];
    const solved = state.station2VerbQuizSolved || [];

    if (badge) {
      badge.textContent =
        solved.length === items.length
          ? `🏆 ¡${solved.length} de ${items.length} verbos dominados!`
          : `${solved.length} de ${items.length} verbos dominados`;
    }

    grid.innerHTML = items
      .map((item) => {
        const isSolved = solved.includes(item.id);
        const optsHtml = item.options
          .map((opt) => {
            const cls = isSolved && opt === item.answer ? "is-right" : "";
            return `
              <button type="button" class="quiz-opt-btn ${cls}" data-vq-id="${item.id}" data-vq-opt="${escapeHtml(opt)}" ${isSolved ? "disabled" : ""}>
                ${isSolved && opt === item.answer ? "✅ " : ""}${escapeHtml(opt)}
              </button>`;
          })
          .join("");

        return `
          <article class="quiz-card ${isSolved ? "is-solved" : ""}">
            <div class="quiz-word">
              <strong>${escapeHtml(item.base)} → ?</strong>
              <span>(${escapeHtml(item.es)})</span>
            </div>
            <div class="quiz-options">${optsHtml}</div>
            <div class="quiz-feedback ${isSolved ? "ok" : ""}" id="vq-fb-${item.id}">
              ${isSolved ? escapeHtml(item.tipOk) : "Elige el pasado correcto (Past Simple):"}
            </div>
            ${
              isSolved
                ? `<button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-vq-speak="${escapeHtml(item.answer)}">🔊 Escuchar "${escapeHtml(item.answer)}"</button>`
                : ""
            }
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-vq-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-vq-id");
        const chosen = btn.getAttribute("data-vq-opt");
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (chosen === item.answer) {
          if (!state.station2VerbQuizSolved.includes(id)) {
            state.station2VerbQuizSolved.push(id);
            window.AppStorage.save(state);
          }
          renderStation2Quiz();
          window.AppSpeech.speak(`We ${item.answer}`, showToast);
        } else {
          btn.classList.add("is-wrong");
          const fb = document.getElementById(`vq-fb-${id}`);
          if (fb) {
            fb.className = "quiz-feedback retry";
            fb.textContent = item.tipRetry;
          }
        }
      });
    });

    grid.querySelectorAll("[data-vq-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AppSpeech.speak(btn.getAttribute("data-vq-speak"), showToast);
      });
    });
  }

  function buildNewspaperTexts(np) {
    const s2 = window.APP_DATA.station2Data;
    const isMemory = Boolean(np.memoryMode);

    /* 3. WHO — divide nombres propios por coma para gramática limpia */
    const whoParts = (np.whoSelected || [])
      .map((id) => {
        const found = s2.whoChips.find((c) => c.id === id);
        return found ? found.en : null;
      })
      .filter(Boolean);
    if (np.whoExtraEn && np.whoExtraEn.trim()) {
      np.whoExtraEn
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((person) => whoParts.push(person));
    }

    const whoSentencePlain =
      whoParts.length > 0
        ? `In this STEAM project, I participated with ${joinEnglishList(whoParts)}.`
        : "";
    const whoSentenceHtml =
      whoParts.length > 0
        ? `In this STEAM project, I ${renderPastToken("participated", "mem-who", isMemory)} with ${escapeHtml(joinEnglishList(whoParts))}.`
        : "";

    /* 4. WHERE — jerarquía natural en inglés (salón/espacio primero + colegio después, sin comas forzadas) */
    const selectedWhereObjs = (np.whereSelected || [])
      .map((id) => s2.whereChips.find((c) => c.id === id))
      .filter(Boolean);

    const roomParts = selectedWhereObjs.filter((c) => c.scope === "room").map((c) => c.en);
    if (np.whereExtraEn && np.whereExtraEn.trim()) {
      roomParts.push(np.whereExtraEn.trim());
    }
    const schoolParts = selectedWhereObjs.filter((c) => c.scope === "school").map((c) => c.en);

    let wherePhrase = "";
    if (roomParts.length > 0 && schoolParts.length > 0) {
      wherePhrase = `${joinEnglishList(roomParts)} ${schoolParts[0]}`;
    } else if (roomParts.length > 0) {
      wherePhrase = joinEnglishList(roomParts);
    } else if (schoolParts.length > 0) {
      wherePhrase = schoolParts[0];
    }

    const whereSentencePlain = wherePhrase ? `The project took place ${wherePhrase}.` : "";
    const whereSentenceHtml = wherePhrase
      ? `The project ${renderPastToken("took place", "mem-where", isMemory)} ${escapeHtml(wherePhrase)}.`
      : "";

    /* Guard de duplicados en Paso 1 y Paso 2 */
    const v1Meta = s2.storyVerbs.find((v) => v.en === np.step1Verb);
    const v2Meta = s2.storyVerbs.find((v) => v.en === np.step2Verb);
    const isDuplicateStep = Boolean(
      np.step1Verb &&
        np.step1Obj &&
        np.step2Verb &&
        np.step2Obj &&
        np.step1Obj === np.step2Obj &&
        (np.step1Verb === np.step2Verb || (v1Meta && v1Meta.creation && v2Meta && v2Meta.creation))
    );

    /* 5. WHAT DID YOU DO (First / Then / We used / Finally / Extra) */
    const storyPlainParts = [];
    const storyHtmlParts = [];

    if (np.step1Verb && np.step1Obj) {
      storyPlainParts.push(`First, we ${np.step1Verb} ${np.step1Obj}.`);
      storyHtmlParts.push(
        `<span class="np-conn">First,</span> we ${renderPastToken(np.step1Verb, "mem-s1", isMemory)} ${escapeHtml(np.step1Obj)}.`
      );
    }

    if (np.step2Verb && np.step2Obj && !isDuplicateStep) {
      storyPlainParts.push(`Then, we ${np.step2Verb} ${np.step2Obj}.`);
      storyHtmlParts.push(
        `<span class="np-conn">Then,</span> we ${renderPastToken(np.step2Verb, "mem-s2", isMemory)} ${escapeHtml(np.step2Obj)}.`
      );
    }

    const mats = np.step2Materials || [];
    if (mats.length > 0) {
      const matList = joinEnglishList(mats);
      storyPlainParts.push(`We used ${matList}.`);
      storyHtmlParts.push(
        `We ${renderPastToken("used", "mem-mats", isMemory)} ${escapeHtml(matList)}.`
      );
    }

    if (np.step3Learning) {
      storyPlainParts.push(`Finally, we learned ${np.step3Learning}.`);
      storyHtmlParts.push(
        `<span class="np-conn">Finally,</span> we ${renderPastToken("learned", "mem-s3", isMemory)} ${escapeHtml(np.step3Learning)}.`
      );
    }

    if (np.extraStepEn && np.extraStepEn.trim()) {
      const cleanExtra = np.extraStepEn.trim().endsWith(".")
        ? np.extraStepEn.trim()
        : np.extraStepEn.trim() + ".";
      storyPlainParts.push(cleanExtra);
      storyHtmlParts.push(highlightExtraPastVerbs(cleanExtra, isMemory, "mem-ext"));
    }

    const hasSecondAction = Boolean((np.step2Verb && np.step2Obj && !isDuplicateStep) || mats.length > 0 || np.step3Learning);
    const whatReady = Boolean(np.step1Verb && np.step1Obj && hasSecondAction && !isDuplicateStep);

    const checks = {
      name: Boolean(np.name && np.name.trim()),
      title: Boolean(np.title && np.title.trim()),
      who: whoParts.length > 0,
      where: Boolean(wherePhrase),
      what: whatReady
    };

    const completedCount = Object.values(checks).filter(Boolean).length;
    const whatPlain = storyPlainParts.join(" ");
    const fullPlain =
      completedCount === 5
        ? `${np.name.trim()}. ${np.title.trim()}. Written by Miguel Angel. ${whoSentencePlain} ${whereSentencePlain} ${whatPlain}`
        : "";

    return {
      checks,
      completedCount,
      isDuplicateStep,
      whoSentencePlain,
      whoSentenceHtml,
      whereSentencePlain,
      whereSentenceHtml,
      storyHtmlParts,
      whatPlain,
      fullPlain
    };
  }

  function renderWhereBilingualChips() {
    const inputEs = document.getElementById("np-where-extra-es");
    const inputEn = document.getElementById("np-where-extra");
    const chipsWrap = document.getElementById("np-where-helper-chips");
    if (!inputEs || !inputEn || !chipsWrap) return;

    const res = window.BilingualHelper.analyze(inputEs.value);
    if (res.matches.length === 0) {
      chipsWrap.innerHTML = "";
      return;
    }

    chipsWrap.innerHTML = res.matches
      .map(
        (m) => `
        <button type="button" class="word-chip" data-wh-ins="${escapeHtml(m.en)}">
          <span>+ ${escapeHtml(m.en)}</span>
          <span class="es-mini">(${escapeHtml(m.displayEs)})</span>
        </button>`
      )
      .join("");

    chipsWrap.querySelectorAll("[data-wh-ins]").forEach((btn) => {
      btn.addEventListener("click", () => {
        inputEn.value = btn.getAttribute("data-wh-ins");
        state.newspaper.whereExtraEn = inputEn.value;
        window.AppStorage.save(state);
        renderStation2Newspaper();
      });
    });
  }

  function renderExtraStepBilingualChips() {
    const extraEs = document.getElementById("np-extra-es");
    const extraEn = document.getElementById("np-extra-en");
    const extraChips = document.getElementById("np-extra-chips");
    if (!extraEs || !extraEn || !extraChips) return;

    const res = window.BilingualHelper.analyze(extraEs.value);
    if (res.matches.length === 0) {
      extraChips.innerHTML = "";
      return;
    }

    extraChips.innerHTML = res.matches
      .map(
        (m) => `
        <button type="button" class="word-chip" data-np-ins="${escapeHtml(m.en)}">
          <span>+ ${escapeHtml(m.en)}</span>
          <span class="es-mini">(${escapeHtml(m.displayEs)})</span>
        </button>`
      )
      .join("");

    extraChips.querySelectorAll("[data-np-ins]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const phrase = btn.getAttribute("data-np-ins");
        const cur = extraEn.value.trim();
        extraEn.value = cur ? `${cur} ${phrase}` : phrase;
        state.newspaper.extraStepEn = extraEn.value;
        window.AppStorage.save(state);
        renderStation2Newspaper();
      });
    });
  }

  function renderStation2Newspaper() {
    const s2 = window.APP_DATA.station2Data;
    const np = state.newspaper;
    const stepper = document.getElementById("np-anatomy-stepper");
    if (!s2 || !np || !stepper) return;

    /* Solo actividades STEAM en el periódico (sin mezclar fiestas culturales) */
    const steamItems = getAllBankItems().filter((i) => i.category === "steam");
    const validSteamObjs = steamItems.map((it) => formatNewspaperObj(it));
    if (np.step1Obj && !validSteamObjs.includes(np.step1Obj)) np.step1Obj = "";
    if (np.step2Obj && !validSteamObjs.includes(np.step2Obj)) np.step2Obj = "";
    const built = buildNewspaperTexts(np);

    /* 1. Barra interactiva de las 5 partes */
    const stepLabels = [
      { key: "name", num: "1", label: "NAME" },
      { key: "title", num: "2", label: "TITLE" },
      { key: "who", num: "3", label: "WHO" },
      { key: "where", num: "4", label: "WHERE" },
      { key: "what", num: "5", label: "WHAT (Past)" }
    ];
    stepper.innerHTML = stepLabels
      .map(
        (st) => `
        <button type="button" class="anatomy-pill ${built.checks[st.key] ? "is-done" : ""}" data-jump-card="np-card-${st.key}">
          <span class="step-num">${built.checks[st.key] ? "✅ Listo" : "Paso " + st.num}</span>
          <span>${st.label}</span>
        </button>`
      )
      .join("");

    stepper.querySelectorAll("[data-jump-card]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.getAttribute("data-jump-card"));
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.classList.add("is-pulse");
        setTimeout(() => target.classList.remove("is-pulse"), 900);
      });
    });

    ["name", "title", "who", "where", "what"].forEach((k) => {
      const card = document.getElementById(`np-card-${k}`);
      if (card) card.classList.toggle("is-filled", built.checks[k]);
    });

    /* 2. Presets apilados de NAME y TITLE */
    const namePresetsEl = document.getElementById("np-name-presets");
    if (namePresetsEl) {
      namePresetsEl.innerHTML = s2.namePresets
        .map(
          (p) => `
          <button type="button" class="editorial-opt-btn editorial-opt-blue ${np.name === p.en ? "is-selected" : ""}" data-np-name="${escapeHtml(p.en)}">
            <span class="opt-en">${np.name === p.en ? "✓ " : ""}${escapeHtml(p.en)}</span>
            <span class="opt-es">${escapeHtml(p.es)}</span>
          </button>`
        )
        .join("");

      namePresetsEl.querySelectorAll("[data-np-name]").forEach((btn) => {
        btn.addEventListener("click", () => {
          np.name = btn.getAttribute("data-np-name");
          const inp = document.getElementById("np-name-input");
          if (inp) inp.value = np.name;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    const titlePresetsEl = document.getElementById("np-title-presets");
    if (titlePresetsEl) {
      titlePresetsEl.innerHTML = s2.titlePresets
        .map(
          (p) => `
          <button type="button" class="editorial-opt-btn editorial-opt-blue ${np.title === p.en ? "is-selected" : ""}" data-np-title="${escapeHtml(p.en)}">
            <span class="opt-en">${np.title === p.en ? "✓ " : ""}${escapeHtml(p.en)}</span>
            <span class="opt-es">${escapeHtml(p.es)}</span>
          </button>`
        )
        .join("");

      titlePresetsEl.querySelectorAll("[data-np-title]").forEach((btn) => {
        btn.addEventListener("click", () => {
          np.title = btn.getAttribute("data-np-title");
          const inp = document.getElementById("np-title-input");
          if (inp) inp.value = np.title;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    /* 3. WHO chips */
    const whoEl = document.getElementById("np-who-chips");
    if (whoEl) {
      whoEl.innerHTML = s2.whoChips
        .map((c) => {
          const active = (np.whoSelected || []).includes(c.id);
          return `
            <button type="button" class="lego-piece lego-piece-purple ${active ? "is-selected" : ""}" data-np-who="${c.id}">
              <span>${active ? "✓ " : "+ "}${escapeHtml(c.en)}</span>
              <span class="es-mini">(${escapeHtml(c.es)})</span>
            </button>`;
        })
        .join("");

      whoEl.querySelectorAll("[data-np-who]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-np-who");
          const list = np.whoSelected || [];
          np.whoSelected = list.includes(id) ? list.filter((x) => x !== id) : list.concat([id]);
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    /* 4. WHERE chips (con exclusión mutua limpia entre nombre de colegio y "at school") */
    const whereEl = document.getElementById("np-where-chips");
    if (whereEl) {
      whereEl.innerHTML = s2.whereChips
        .map((c) => {
          const active = (np.whereSelected || []).includes(c.id);
          return `
            <button type="button" class="lego-piece lego-piece-green ${active ? "is-selected" : ""}" data-np-where="${c.id}">
              <span>${active ? "✓ " : "+ "}${escapeHtml(c.en)}</span>
              <span class="es-mini">(${escapeHtml(c.es)})</span>
            </button>`;
        })
        .join("");

      whereEl.querySelectorAll("[data-np-where]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-np-where");
          let list = (np.whereSelected || []).slice();
          if (list.includes(id)) {
            list = list.filter((x) => x !== id);
          } else {
            if (id === "wh-school") list = list.filter((x) => x !== "wh-at-school");
            if (id === "wh-at-school") list = list.filter((x) => x !== "wh-school");
            list.push(id);
          }
          np.whereSelected = list;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    /* 5. WHAT DID YOU DO chips (First / Then / We used / Finally) */
    function renderVerbPicker(elId, fieldKey) {
      const wrap = document.getElementById(elId);
      if (!wrap) return;
      wrap.innerHTML = s2.storyVerbs
        .map(
          (v) => `
          <button type="button" class="lego-piece lego-piece-orange ${np[fieldKey] === v.en ? "is-selected" : ""}" data-v-pick="${escapeHtml(v.en)}">
            <span>${escapeHtml(v.en)}</span>
            <span class="es-mini">(${escapeHtml(v.es)})</span>
          </button>`
        )
        .join("");

      wrap.querySelectorAll("[data-v-pick]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.getAttribute("data-v-pick");
          np[fieldKey] = np[fieldKey] === val ? "" : val;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    function renderObjPicker(elId, fieldKey, colorCls) {
      const wrap = document.getElementById(elId);
      if (!wrap) return;
      wrap.innerHTML = steamItems
        .map((it) => {
          const formatted = formatNewspaperObj(it);
          const sel = np[fieldKey] === formatted;
          return `
            <button type="button" class="lego-piece ${colorCls} ${sel ? "is-selected" : ""}" data-o-pick="${escapeHtml(formatted)}">
              <span>${escapeHtml(formatted)}</span>
              <span class="es-mini">(${escapeHtml(it.es)})</span>
            </button>`;
        })
        .join("");

      wrap.querySelectorAll("[data-o-pick]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.getAttribute("data-o-pick");
          np[fieldKey] = np[fieldKey] === val ? "" : val;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    renderVerbPicker("np-step1-verbs", "step1Verb");
    renderObjPicker("np-step1-objs", "step1Obj", "lego-piece-blue");
    renderVerbPicker("np-step2-verbs", "step2Verb");
    renderObjPicker("np-step2-objs", "step2Obj", "lego-piece-purple");

    const dupWarnEl = document.getElementById("np-dup-warning");
    if (dupWarnEl) {
      if (built.isDuplicateStep) {
        dupWarnEl.style.display = "block";
        dupWarnEl.textContent = `💡 Ya contaste cómo creaste "${np.step1Obj}" en First. Elige la otra actividad STEAM en Then o cambia el verbo a "painted" / "worked on".`;
      } else {
        dupWarnEl.style.display = "none";
      }
    }

    /* Materiales con alto contraste (.mat-chip) */
    const matsWrap = document.getElementById("np-step2-mats");
    if (matsWrap) {
      matsWrap.innerHTML = s2.materialChips
        .map((m) => {
          const active = (np.step2Materials || []).includes(m.en);
          return `
            <button type="button" class="mat-chip ${active ? "is-selected" : ""}" data-np-mat="${escapeHtml(m.en)}">
              <span>${active ? "✓ " : "+ "}${escapeHtml(m.en)}</span>
              <span class="es-mini">(${escapeHtml(m.es)})</span>
            </button>`;
        })
        .join("");

      matsWrap.querySelectorAll("[data-np-mat]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.getAttribute("data-np-mat");
          const list = np.step2Materials || [];
          np.step2Materials = list.includes(val) ? list.filter((x) => x !== val) : list.concat([val]);
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    const learnWrap = document.getElementById("np-step3-learn");
    if (learnWrap) {
      learnWrap.innerHTML = s2.learningChips
        .map(
          (l) => `
          <button type="button" class="editorial-opt-btn editorial-opt-green ${np.step3Learning === l.en ? "is-selected" : ""}" data-np-learn="${escapeHtml(l.en)}">
            <span class="opt-en">${np.step3Learning === l.en ? "✓ " : ""}${escapeHtml(l.en)}</span>
            <span class="opt-es">${escapeHtml(l.es)}</span>
          </button>`
        )
        .join("");

      learnWrap.querySelectorAll("[data-np-learn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.getAttribute("data-np-learn");
          np.step3Learning = np.step3Learning === val ? "" : val;
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    /* 6. Photo mode selector */
    const photoRow = document.getElementById("np-photo-modes");
    if (photoRow) {
      photoRow.innerHTML = s2.photoModes
        .map(
          (pm) => `
          <button type="button" class="photo-mode-btn ${np.photoMode === pm.id ? "is-active" : ""}" data-np-photo="${pm.id}">
            ${escapeHtml(pm.label)}
          </button>`
        )
        .join("");

      photoRow.querySelectorAll("[data-np-photo]").forEach((btn) => {
        btn.addEventListener("click", () => {
          np.photoMode = btn.getAttribute("data-np-photo");
          window.AppStorage.save(state);
          renderStation2Newspaper();
        });
      });
    }

    /* 7. Renderizar Portada Broadsheet en Vivo */
    const paperEl = document.getElementById("broadsheet-paper");
    const isAllReady = built.completedCount === 5;
    if (paperEl) {
      paperEl.classList.toggle("hide-highlights", !np.highlightPastVerbs);
      paperEl.classList.toggle("show-blueprint", Boolean(np.showExamBlueprint));
      paperEl.classList.toggle("is-complete-edition", isAllReady);
    }

    const hlBtn = document.getElementById("np-toggle-highlights-btn");
    if (hlBtn) {
      hlBtn.classList.toggle("is-on", Boolean(np.highlightPastVerbs));
      hlBtn.textContent = np.highlightPastVerbs
        ? "🖍️ Verbos Past Simple: SÍ"
        : "🖍️ Verbos Past Simple: NO";
    }
    const bpBtn = document.getElementById("np-toggle-blueprint-btn");
    if (bpBtn) {
      bpBtn.classList.toggle("is-on", Boolean(np.showExamBlueprint));
      bpBtn.textContent = np.showExamBlueprint
        ? "📋 Guía 5 Partes: SÍ"
        : "📋 Guía 5 Partes: NO";
    }
    const memBtn = document.getElementById("np-toggle-memory-btn");
    if (memBtn) {
      memBtn.classList.toggle("is-memory-on", Boolean(np.memoryMode));
      memBtn.textContent = np.memoryMode
        ? "🧠 Modo Memoria: SÍ"
        : "🧠 Modo Memoria: NO";
    }

    const nameOut = document.getElementById("paper-name-out");
    if (nameOut) {
      nameOut.innerHTML = built.checks.name
        ? escapeHtml(np.name.trim())
        : `<span class="paper-placeholder">1. Elige o escribe el NAME del periódico</span>`;
    }

    const titleOut = document.getElementById("paper-title-out");
    if (titleOut) {
      titleOut.innerHTML = built.checks.title
        ? escapeHtml(np.title.trim())
        : `<span class="paper-placeholder">2. Elige o escribe el TITLE de tu noticia</span>`;
    }

    const photoFrame = document.getElementById("paper-photo-frame");
    const photoCaption = document.getElementById("paper-photo-caption");
    const activePhoto = s2.photoModes.find((p) => p.id === np.photoMode) || s2.photoModes[0];
    if (photoFrame && activePhoto) {
      if (activePhoto.src) {
        photoFrame.innerHTML = `<img src="${escapeHtml(activePhoto.src)}" alt="Miguel Ángel — Proyecto STEAM" style="object-position: ${escapeHtml(activePhoto.objectPos || "center")};">`;
      } else {
        photoFrame.innerHTML = `
          <div class="paper-sketch-box">
            <span style="font-size: 1.8rem;">✏️</span>
            <strong>Espacio para tu dibujo el Martes</strong>
            <span>Dibuja aquí tu Maze y tu Dream Catcher cuando hagas el periódico en clase.</span>
          </div>`;
      }
    }
    if (photoCaption && activePhoto) {
      photoCaption.textContent = activePhoto.captionEn;
    }

    const whoOut = document.getElementById("paper-who-out");
    if (whoOut) {
      whoOut.innerHTML = built.checks.who
        ? built.whoSentenceHtml
        : `<span class="paper-placeholder">3. Selecciona quiénes participaron</span>`;
    }

    const whereOut = document.getElementById("paper-where-out");
    if (whereOut) {
      whereOut.innerHTML = built.checks.where
        ? built.whereSentenceHtml
        : `<span class="paper-placeholder">4. Selecciona dónde se hizo el proyecto</span>`;
    }

    const whatOut = document.getElementById("paper-what-out");
    if (whatOut) {
      if (built.storyHtmlParts.length > 0) {
        whatOut.classList.remove("is-placeholder-copy");
        whatOut.innerHTML = `<span class="paper-dateline">BENEDICTINO PRESS —</span> ${built.storyHtmlParts.join(" ")}`;
      } else {
        whatOut.classList.add("is-placeholder-copy");
        whatOut.innerHTML = `<span class="paper-placeholder">5. Arma First, Then, We used y Finally con verbos en Past Simple...</span>`;
      }
    }

    /* Enlazar clics interactivos de Modo Memoria dentro del Periódico */
    const memBanner = document.getElementById("np-memory-banner");
    const memCounter = document.getElementById("np-memory-counter");
    if (paperEl && np.memoryMode) {
      const memButtons = paperEl.querySelectorAll("[data-mem-key]");
      const totalMem = memButtons.length;
      let revealedCount = 0;
      memButtons.forEach((b) => {
        if (b.classList.contains("is-revealed")) revealedCount += 1;
        b.addEventListener("click", () => {
          const key = b.getAttribute("data-mem-key");
          const word = b.getAttribute("data-mem-word");
          revealedMemoryKeys.add(key);
          renderStation2Newspaper();
          if (word) window.AppSpeech.speak(word, showToast);
        });
      });

      if (memBanner) memBanner.classList.add("is-visible");
      if (memCounter) {
        if (totalMem === 0) {
          memCounter.textContent = "🧠 Completa alguna sección con verbos en pasado para activar los cuadros sorpresa.";
        } else if (revealedCount === totalMem) {
          memCounter.textContent = `🏆 ¡Excelente Miguel! Recordaste los ${totalMem} verbos en Past Simple de tu periódico.`;
        } else {
          memCounter.textContent = `🧠 Verbos recordados: ${revealedCount} de ${totalMem}. Toca cada cuadro "???" para revelar y escuchar.`;
        }
      }
    } else if (memBanner) {
      memBanner.classList.remove("is-visible");
    }

    /* 8. Estado de Validación y Audio Desbloqueable */
    const actionsBox = document.getElementById("np-actions-box");
    const statusBadge = document.getElementById("np-status-badge");
    const speakFullBtn = document.getElementById("np-speak-full-btn");
    const speakWhatBtn = document.getElementById("np-speak-what-btn");

    if (actionsBox) actionsBox.classList.toggle("is-ready", isAllReady);
    if (statusBadge) {
      statusBadge.classList.remove("status-idle", "status-progress", "status-wrong", "status-correct");
      if (built.isDuplicateStep) {
        statusBadge.classList.add("status-wrong");
        statusBadge.textContent = "💡 Revisa el Paso 5 (Then): elige una actividad o verbo diferente a First.";
      } else if (isAllReady) {
        statusBadge.classList.add("status-correct");
        statusBadge.textContent = "✅ ¡Periódico STEAM completo (5/5 partes + Past Simple)! Ya puedes escucharlo entero.";
      } else if (built.completedCount > 0) {
        const missing = stepLabels.filter((s) => !built.checks[s.key]).map((s) => s.label);
        statusBadge.classList.add("status-progress");
        statusBadge.textContent = `⏳ Llevas ${built.completedCount} de 5 partes. Falta: ${missing.join(", ")}.`;
      } else {
        statusBadge.classList.add("status-idle");
        statusBadge.textContent = "🧩 Completa las 5 partes del periódico a la izquierda para activar el audio.";
      }
    }

    if (speakFullBtn) {
      speakFullBtn.disabled = !isAllReady;
      speakFullBtn.classList.toggle("is-unlocked", isAllReady);
      speakFullBtn.textContent = isAllReady
        ? "🔊 Escuchar Periódico Completo"
        : `🔒 Completa las 5 partes (${built.completedCount}/5)`;
      speakFullBtn.dataset.fullText = built.fullPlain;
    }

    if (speakWhatBtn) {
      speakWhatBtn.disabled = !built.whatPlain;
      speakWhatBtn.dataset.whatText = built.whatPlain;
    }

    renderStation3BonusInfo();
  }

  function syncStation2InputsFromState() {
    const np = state.newspaper;
    const map = [
      ["np-name-input", np.name],
      ["np-title-input", np.title],
      ["np-who-extra", np.whoExtraEn],
      ["np-where-extra-es", np.whereExtraEs],
      ["np-where-extra", np.whereExtraEn],
      ["np-extra-es", np.extraStepEs],
      ["np-extra-en", np.extraStepEn]
    ];
    map.forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    });
    renderWhereBilingualChips();
    renderExtraStepBilingualChips();
  }

  function initStation2() {
    const tmBtn = document.getElementById("tm-toggle-btn");
    const tmPortalBtn = document.getElementById("tm-portal-btn");
    const toggleTimeMachine = () => {
      tmIsPast = !tmIsPast;
      renderStation2TimeMachine();
    };
    if (tmBtn) tmBtn.addEventListener("click", toggleTimeMachine);
    if (tmPortalBtn) tmPortalBtn.addEventListener("click", toggleTimeMachine);

    syncStation2InputsFromState();
    renderStation2TimeMachine();
    renderStation2Quiz();
    renderStation2Newspaper();

    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        state.newspaper[key] = el.value;
        window.AppStorage.save(state);
        renderStation2Newspaper();
        renderStation3BonusInfo();
      });
    };

    bindInput("np-name-input", "name");
    bindInput("np-title-input", "title");
    bindInput("np-who-extra", "whoExtraEn");
    bindInput("np-where-extra", "whereExtraEn");
    bindInput("np-extra-en", "extraStepEn");

    /* Asistente bilingüe para WHERE extra (P0-4 fix) */
    const whereEs = document.getElementById("np-where-extra-es");
    if (whereEs) {
      whereEs.addEventListener("input", () => {
        state.newspaper.whereExtraEs = whereEs.value;
        window.AppStorage.save(state);
        renderWhereBilingualChips();
      });
    }

    /* Asistente bilingüe para la oración extra opcional */
    const extraEs = document.getElementById("np-extra-es");
    if (extraEs) {
      extraEs.addEventListener("input", () => {
        state.newspaper.extraStepEs = extraEs.value;
        window.AppStorage.save(state);
        renderExtraStepBilingualChips();
      });
    }

    const hlBtn = document.getElementById("np-toggle-highlights-btn");
    if (hlBtn) {
      hlBtn.addEventListener("click", () => {
        state.newspaper.highlightPastVerbs = !state.newspaper.highlightPastVerbs;
        window.AppStorage.save(state);
        renderStation2Newspaper();
      });
    }

    const bpBtn = document.getElementById("np-toggle-blueprint-btn");
    if (bpBtn) {
      bpBtn.addEventListener("click", () => {
        state.newspaper.showExamBlueprint = !state.newspaper.showExamBlueprint;
        window.AppStorage.save(state);
        renderStation2Newspaper();
      });
    }

    const memBtn = document.getElementById("np-toggle-memory-btn");
    if (memBtn) {
      memBtn.addEventListener("click", () => {
        state.newspaper.memoryMode = !state.newspaper.memoryMode;
        revealedMemoryKeys = new Set();
        window.AppStorage.save(state);
        renderStation2Newspaper();
        if (state.newspaper.memoryMode) {
          showToast("🧠 Modo Memoria activado: toca cada cuadro ??? para recordar el verbo en pasado.");
        }
      });
    }

    const memResetBtn = document.getElementById("np-memory-reset-btn");
    if (memResetBtn) {
      memResetBtn.addEventListener("click", () => {
        revealedMemoryKeys = new Set();
        renderStation2Newspaper();
        showToast("🔄 Verbos ocultos de nuevo. ¡A practicar!");
      });
    }

    const speakFullBtn = document.getElementById("np-speak-full-btn");
    if (speakFullBtn) {
      speakFullBtn.addEventListener("click", () => {
        if (speakFullBtn.disabled || !speakFullBtn.dataset.fullText) return;
        window.AppSpeech.speak(speakFullBtn.dataset.fullText, showToast);
      });
    }

    const speakWhatBtn = document.getElementById("np-speak-what-btn");
    if (speakWhatBtn) {
      speakWhatBtn.addEventListener("click", () => {
        if (speakWhatBtn.disabled || !speakWhatBtn.dataset.whatText) return;
        window.AppSpeech.speak(speakWhatBtn.dataset.whatText, showToast);
      });
    }

    const demoBtn = document.getElementById("np-fill-demo-btn");
    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        revealedMemoryKeys = new Set();
        state.newspaper = Object.assign({}, state.newspaper, {
          name: "THE BENEDICTINO STEAM TIMES",
          title: "Making a Maze and a Dream Catcher!",
          whoSelected: ["who-classmates", "who-teachers"],
          whoExtraEs: "",
          whoExtraEn: "",
          whereSelected: ["wh-classroom", "wh-school"],
          whereExtraEs: "",
          whereExtraEn: "",
          step1Verb: "created",
          step1Obj: "the maze",
          step2Verb: "made",
          step2Obj: "the dream catcher",
          step2Materials: ["cardboard", "wool and thread", "colors and markers"],
          step3Learning: "how to build a maze and a dream catcher",
          extraStepEs: "",
          extraStepEn: ""
        });
        window.AppStorage.save(state);
        syncStation2InputsFromState();
        renderStation2Newspaper();
        renderStation3BonusInfo();
        showToast("⚡ Borrador guía cargado. ¡Personalízalo con Miguel!");
      });
    }

    const clearAllBtn = document.getElementById("np-clear-all-btn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        revealedMemoryKeys = new Set();
        state.newspaper = Object.assign({}, state.newspaper, {
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
          memoryMode: false
        });
        window.AppStorage.save(state);
        syncStation2InputsFromState();
        renderStation2Newspaper();
        renderStation3BonusInfo();
        showToast("Periódico limpiado para empezar desde cero.");
      });
    }
  }

  /* ==================== ESTACIÓN 3: METACOGNITION & INFORMATION Q&A (R2 AWWWARDS) ==================== */
  let st3ActiveQIdx = 0;
  let st3RehearsalMode = false;
  let st3RevealedWarmups = new Set();
  let st3RevealedSummary = new Set();

  function formatMakingTask(item) {
    if (!item) return "";
    if (item.id === "steam-maze") return "making the maze";
    if (item.id === "steam-dream-catcher") return "making the dream catcher";
    const base = item.en.startsWith("The ") ? "the " + item.en.slice(4) : item.en;
    return `making ${base}`;
  }

  function formatMakingTaskEs(makingVal) {
    if (!makingVal) return "";
    if (makingVal === "making the maze") return "hacer el laberinto";
    if (makingVal === "making the dream catcher") return "hacer el atrapasueños";
    const items = getAllBankItems().filter((i) => i.category === "steam");
    const match = items.find((i) => formatMakingTask(i) === makingVal);
    return match ? match.es.toLowerCase() : makingVal;
  }

  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function cleanCustomClause(raw) {
    return (raw || "").trim().replace(/^because\s+/i, "").replace(/\.+$/, "");
  }

  function findReasonEs(qDef, mainKey, reasonEn) {
    if (!qDef || !reasonEn) return "";
    let pool = qDef.reasons || [];
    if (qDef.id === "q2") {
      pool = (qDef.reasonsByMain && qDef.reasonsByMain[mainKey]) || [];
    } else if (qDef.id === "q4") {
      pool = (qDef.reasonsStandard || []).concat(qDef.reasonsPositive || []);
    }
    const found = pool.find((r) => r.en === reasonEn);
    return found ? found.es : reasonEn;
  }

  function buildMetaAnswer(qId) {
    const s3 = window.APP_DATA.station3Data;
    const m = state.metacognition && state.metacognition[qId];
    if (!s3 || !m) return { complete: false, plainEn: "", html: "", esMeaning: "", nextStepMsg: "" };

    const qDef = s3.officialQuestions.find((q) => q.id === qId);
    if (!qDef) return { complete: false, plainEn: "", html: "", esMeaning: "", nextStepMsg: "" };

    const customReason = cleanCustomClause(m.customEn);
    const activeReason = customReason || m.reason || "";
    const reasonEs = customReason
      ? (m.customEs && m.customEs.trim() ? m.customEs.trim().replace(/^porque\s+/i, "").replace(/\.+$/, "") : customReason)
      : findReasonEs(qDef, m.main, m.reason);

    if (qId === "q1") {
      const mainReady = Boolean(m.main);
      const complete = Boolean(mainReady && m.hasBecause && activeReason);
      const plainEn = complete ? `My favorite task was ${m.main} because ${activeReason}.` : "";
      const html = complete
        ? `<div class="colored-sentence">
            <span class="tok tok-blue">My favorite task</span>
            <span class="tok tok-orange">was ${escapeHtml(m.main)}</span>
            <span class="tok tok-green">because</span>
            <span class="tok tok-purple">${escapeHtml(activeReason)}.</span>
          </div>`
        : "";
      const esMeaning = complete
        ? `Mi tarea favorita fue ${formatMakingTaskEs(m.main)} porque ${reasonEs}.`
        : "";
      let nextStepMsg = "🧩 Paso 1: Elige cuál fue tu tarea favorita (Bloque Azul).";
      if (mainReady && !m.hasBecause) nextStepMsg = "⏳ Paso 2: Activa el puente verde '+ because (porque)'.";
      else if (mainReady && m.hasBecause && !activeReason) nextStepMsg = "⏳ Paso 3: Elige o escribe tu razón en el Bloque Morado.";
      return { complete, plainEn, html, esMeaning, nextStepMsg };
    }

    if (qId === "q2") {
      const mainOpt = qDef.mainOptions.find((o) => o.id === m.main);
      const mainReady = Boolean(mainOpt);
      const complete = Boolean(mainReady && m.hasBecause && activeReason);
      const plainEn = complete ? `${mainOpt.en}, because ${activeReason}.` : "";
      const html = complete
        ? `<div class="colored-sentence">
            <span class="tok tok-blue">${escapeHtml(mainOpt.en)},</span>
            <span class="tok tok-green">because</span>
            <span class="tok tok-purple">${escapeHtml(activeReason)}.</span>
          </div>`
        : "";
      const esLead = mainOpt ? (mainOpt.id === "yes" ? "Sí lo fue" : "No lo fue") : "";
      const esMeaning = complete ? `${esLead}, porque ${reasonEs}.` : "";
      let nextStepMsg = "🧩 Paso 1: Elige 'Yes, it was' o 'No, it wasn't' (Bloque Azul).";
      if (mainReady && !m.hasBecause) nextStepMsg = "⏳ Paso 2: Activa el puente verde '+ because (porque)'.";
      else if (mainReady && m.hasBecause && !activeReason) nextStepMsg = "⏳ Paso 3: Elige o escribe por qué en el Bloque Morado.";
      return { complete, plainEn, html, esMeaning, nextStepMsg };
    }

    if (qId === "q3") {
      const mainReady = Boolean(m.main);
      const complete = Boolean(mainReady && m.hasBecause && activeReason);
      const mainCap = capitalizeFirst(m.main);
      const plainEn = complete ? `${mainCap} was easier for me because ${activeReason}.` : "";
      const html = complete
        ? `<div class="colored-sentence">
            <span class="tok tok-blue">${escapeHtml(mainCap)}</span>
            <span class="tok tok-orange">was easier for me</span>
            <span class="tok tok-green">because</span>
            <span class="tok tok-purple">${escapeHtml(activeReason)}.</span>
          </div>`
        : "";
      const esMeaning = complete
        ? `${capitalizeFirst(formatMakingTaskEs(m.main))} fue más fácil para mí porque ${reasonEs}.`
        : "";
      let nextStepMsg = "🧩 Paso 1: Elige qué tarea fue más fácil para ti (Bloque Azul).";
      if (mainReady && !m.hasBecause) nextStepMsg = "⏳ Paso 2: Activa el puente verde '+ because (porque)'.";
      else if (mainReady && m.hasBecause && !activeReason) nextStepMsg = "⏳ Paso 3: Elige o escribe por qué fue más fácil (Bloque Morado).";
      return { complete, plainEn, html, esMeaning, nextStepMsg };
    }

    if (qId === "q4") {
      const mainOpt = qDef.mainOptions.find((o) => o.id === m.main);
      const mainReady = Boolean(mainOpt);
      const complete = Boolean(mainReady && m.hasBecause && activeReason);
      let plainEn = "";
      let html = "";
      let esMeaning = "";
      if (complete) {
        if (mainOpt.positive) {
          plainEn = `Nothing! Everything was fun because ${activeReason}.`;
          html = `<div class="colored-sentence">
            <span class="tok tok-blue">Nothing! Everything</span>
            <span class="tok tok-orange">was fun</span>
            <span class="tok tok-green">because</span>
            <span class="tok tok-purple">${escapeHtml(activeReason)}.</span>
          </div>`;
          esMeaning = `¡Nada! Todo fue divertido porque ${reasonEs}.`;
        } else {
          plainEn = `The most boring part was ${mainOpt.en} because ${activeReason}.`;
          html = `<div class="colored-sentence">
            <span class="tok tok-blue">The most boring part</span>
            <span class="tok tok-orange">was ${escapeHtml(mainOpt.en)}</span>
            <span class="tok tok-green">because</span>
            <span class="tok tok-purple">${escapeHtml(activeReason)}.</span>
          </div>`;
          esMeaning = `La parte más aburrida fue ${mainOpt.es} porque ${reasonEs}.`;
        }
      }
      let nextStepMsg = "🧩 Paso 1: Elige qué parte fue más lenta/aburrida (o 'Nothing! Everything was fun').";
      if (mainReady && !m.hasBecause) nextStepMsg = "⏳ Paso 2: Activa el puente verde '+ because (porque)'.";
      else if (mainReady && m.hasBecause && !activeReason) nextStepMsg = "⏳ Paso 3: Elige o escribe tu razón en el Bloque Morado.";
      return { complete, plainEn, html, esMeaning, nextStepMsg };
    }

    /* q5: What did you learn from this STEAM? (Max 2 ideas; 2 crisp rhythmic sentences when 2 selected!) */
    const itemsEn = [];
    const itemsEs = [];
    (m.selectedIds || []).forEach((id) => {
      const f = qDef.learnOptions.find((o) => o.id === id);
      if (f) {
        itemsEn.push(f.en);
        itemsEs.push(f.es);
      }
    });
    const customLearn = (m.customEn || "").trim().replace(/^I learned\s+/i, "").replace(/\.+$/, "");
    if (customLearn) {
      if (itemsEn.length >= 2) {
        itemsEn.pop();
        itemsEs.pop();
      }
      itemsEn.push(customLearn);
      itemsEs.push(m.customEs && m.customEs.trim() ? m.customEs.trim().replace(/\.+$/, "") : customLearn);
    }

    const complete = Boolean(m.hasLearnedVerb && itemsEn.length > 0);
    let plainEn = "";
    let html = "";
    let esMeaning = "";
    if (complete) {
      if (itemsEn.length === 1) {
        plainEn = `I learned ${itemsEn[0]}.`;
        html = `<div class="colored-sentence">
          <span class="tok tok-blue">I</span>
          <span class="tok tok-orange">learned</span>
          <span class="tok tok-purple">${escapeHtml(itemsEn[0])}.</span>
        </div>`;
        esMeaning = `Aprendí ${itemsEs[0]}.`;
      } else {
        plainEn = `I learned ${itemsEn[0]}. I also learned ${itemsEn[1]}.`;
        html = `<div class="colored-sentence">
          <span class="tok tok-blue">I</span>
          <span class="tok tok-orange">learned</span>
          <span class="tok tok-purple">${escapeHtml(itemsEn[0])}.</span>
          <span class="tok tok-blue">I</span>
          <span class="tok tok-green">also</span>
          <span class="tok tok-orange">learned</span>
          <span class="tok tok-purple">${escapeHtml(itemsEn[1])}.</span>
        </div>`;
        esMeaning = `Aprendí ${itemsEs[0]}. También aprendí ${itemsEs[1]}.`;
      }
    }
    let nextStepMsg = "🧩 Paso 1: Activa el bloque naranja 'I learned (Aprendí)' para recordar el Past Simple.";
    if (m.hasLearnedVerb && itemsEn.length === 0) {
      nextStepMsg = "⏳ Paso 2: Selecciona 1 o 2 aprendizajes reales (o escribe uno propio) en el Bloque Morado.";
    }
    return { complete, plainEn, html, esMeaning, nextStepMsg };
  }

  function renderStation3Warmups() {
    const grid = document.getElementById("st3-why-warmup-grid");
    if (!grid) return;
    const list = (window.APP_DATA.station3Data && window.APP_DATA.station3Data.whyWarmups) || [];

    grid.innerHTML = list
      .map((w) => {
        const revealed = st3RevealedWarmups.has(w.id);
        return `
          <article class="why-warmup-card">
            <div>
              <span class="warmup-badge">${w.icon} ${escapeHtml(w.topic)}</span>
              <p class="why-q-text">${escapeHtml(w.q)}</p>
              <p class="warmup-es">${escapeHtml(w.qEs)}</p>
              ${
                revealed
                  ? `<div class="why-answer-reveal">
                      <div class="colored-sentence" style="margin-bottom: 6px;">
                        <span class="tok tok-blue">${escapeHtml(w.blue)}</span>
                        <span class="tok tok-green">${escapeHtml(w.green)}</span>
                        <span class="tok tok-purple">${escapeHtml(w.purple)}.</span>
                      </div>
                      <p class="warmup-es">${escapeHtml(w.fullEs)}</p>
                    </div>`
                  : ""
              }
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" data-wu-toggle="${w.id}">
                ${revealed ? "🙈 Ocultar puente" : "💡 Ver puente because"}
              </button>
              <button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-wu-speak="${w.id}">
                🔊 Escuchar
              </button>
            </div>
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-wu-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-wu-toggle");
        if (st3RevealedWarmups.has(id)) st3RevealedWarmups.delete(id);
        else st3RevealedWarmups.add(id);
        renderStation3Warmups();
      });
    });

    grid.querySelectorAll("[data-wu-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-wu-speak");
        const w = list.find((item) => item.id === id);
        if (!w) return;
        const text = st3RevealedWarmups.has(id) ? `${w.q} ${w.fullEn}` : w.q;
        window.AppSpeech.speak(text, showToast);
      });
    });
  }

  function renderStation3Radar() {
    const grid = document.getElementById("st3-radar-grid");
    const badge = document.getElementById("st3-radar-badge");
    if (!grid) return;

    const items = (window.APP_DATA.station3Data && window.APP_DATA.station3Data.keywordRadar) || [];
    const solved = state.station3RadarSolved || [];

    if (badge) {
      badge.textContent =
        solved.length === items.length
          ? `🏆 ¡${solved.length} de ${items.length} preguntas detectadas!`
          : `${solved.length} de ${items.length} preguntas detectadas`;
    }

    grid.innerHTML = items
      .map((item) => {
        const isSolved = solved.includes(item.id);
        const highlightedQ = escapeHtml(item.questionEn).replace(
          escapeHtml(item.keyword),
          `<mark class="kw-highlight">${escapeHtml(item.keyword)}</mark>`
        );

        const optsHtml = item.options
          .map((opt) => {
            const cls = isSolved && opt.key === item.correctKey ? "is-right" : "";
            return `
              <button type="button" class="quiz-opt-btn ${cls}" data-kr-id="${item.id}" data-kr-key="${opt.key}" ${isSolved ? "disabled" : ""}>
                ${isSolved && opt.key === item.correctKey ? "✅ " : ""}${escapeHtml(opt.label)}
              </button>`;
          })
          .join("");

        return `
          <article class="quiz-card ${isSolved ? "is-solved" : ""}">
            <div style="font-size: 0.94rem; font-weight: 800; line-height: 1.45; color: var(--text);">
              ${highlightedQ}
            </div>
            <div class="quiz-options">${optsHtml}</div>
            <div class="quiz-feedback ${isSolved ? "ok" : ""}" id="kr-fb-${item.id}">
              ${isSolved ? escapeHtml(item.tipOk) : "¿Qué pregunta la Miss aquí?"}
            </div>
            <button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-kr-speak="${escapeHtml(item.questionEn)}">
              🔊 Escuchar pregunta
            </button>
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-kr-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-kr-id");
        const chosen = btn.getAttribute("data-kr-key");
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (chosen === item.correctKey) {
          if (!state.station3RadarSolved.includes(id)) {
            state.station3RadarSolved.push(id);
            window.AppStorage.save(state);
          }
          renderStation3Radar();
          window.AppSpeech.speak(item.questionEn, showToast);
        } else {
          btn.classList.add("is-wrong");
          const fb = document.getElementById(`kr-fb-${id}`);
          if (fb) {
            fb.className = "quiz-feedback retry";
            fb.textContent = item.tipRetry;
          }
        }
      });
    });

    grid.querySelectorAll("[data-kr-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AppSpeech.speak(btn.getAttribute("data-kr-speak"), showToast);
      });
    });
  }

  function renderStation3Stage() {
    const s3 = window.APP_DATA.station3Data;
    const tabsWrap = document.getElementById("st3-deck-tabs");
    const stageEl = document.getElementById("st3-interview-stage");
    const progressBadge = document.getElementById("st3-progress-badge");
    if (!s3 || !tabsWrap || !stageEl) return;

    /* Limpiar huérfanos si se borró una tarea STEAM personalizada en Estación 0 */
    const steamItems = getAllBankItems().filter((i) => i.category === "steam");
    const validMakingTasks = steamItems.map((it) => formatMakingTask(it));
    ["q1", "q3"].forEach((qk) => {
      if (state.metacognition[qk].main && !validMakingTasks.includes(state.metacognition[qk].main)) {
        state.metacognition[qk].main = "";
      }
    });

    const questions = s3.officialQuestions;
    const answersById = {};
    let doneCount = 0;
    questions.forEach((q) => {
      answersById[q.id] = buildMetaAnswer(q.id);
      if (answersById[q.id].complete) doneCount += 1;
    });

    if (progressBadge) {
      progressBadge.textContent =
        doneCount === questions.length
          ? `🏆 ¡${doneCount} de ${questions.length} respondidas!`
          : `${doneCount} de ${questions.length} respondidas`;
    }

    /* 1. Pestañas de las 5 preguntas */
    tabsWrap.innerHTML = questions
      .map((q, idx) => {
        const done = answersById[q.id].complete;
        const active = idx === st3ActiveQIdx;
        return `
          <button type="button" class="studio-q-tab ${active ? "is-active" : ""} ${done ? "is-done" : ""}" data-st3-tab="${idx}" role="tab" aria-selected="${active ? "true" : "false"}">
            <span class="q-tab-state">${done ? "✅ Lista" : "Pendiente"}</span>
            <span>${escapeHtml(q.shortLabel)}</span>
          </button>`;
      })
      .join("");

    tabsWrap.querySelectorAll("[data-st3-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        st3ActiveQIdx = Number(btn.getAttribute("data-st3-tab"));
        renderStation3Stage();
      });
    });

    /* 2. Renderizar la Pregunta Activa */
    const q = questions[st3ActiveQIdx] || questions[0];
    const m = state.metacognition[q.id];
    const built = answersById[q.id];
    const isLastQ = st3ActiveQIdx === questions.length - 1;

    /* Verificar coherencia suave entre Q2 y Q3 (sin bloquear) */
    let consistencyTip = "";
    if (q.id === "q3" && state.metacognition.q2.main && m.main) {
      if (state.metacognition.q2.main === "yes" && m.main === "making the maze") {
        consistencyTip = "💡 Nota para papás: En la Pregunta 2 Miguel dijo que el laberinto fue más difícil. Verifiquen si aquí prefiere elegir 'making the dream catcher' como la más fácil para que ambas respuestas coincidan el martes.";
      } else if (state.metacognition.q2.main === "no" && m.main === "making the dream catcher") {
        consistencyTip = "💡 Nota para papás: En la Pregunta 2 Miguel dijo que el laberinto NO fue más difícil. Verifiquen si aquí prefiere elegir 'making the maze' como la más fácil para mantener coherencia el martes.";
      }
    }

    /* Construir controles LEGO según la pregunta (1:1 LEGO Color Contract!) */
    let step1Html = "";
    let step2BridgeHtml = "";
    let step3ReasonHtml = "";

    if (q.id === "q1" || q.id === "q3") {
      const title1 = q.id === "q1" ? "1. 🟦 Bloque Azul: Elige tu tarea favorita en STEAM" : "1. 🟦 Bloque Azul: Elige la tarea que fue más fácil para ti";
      const taskBtns = steamItems
        .map((it) => {
          const val = formatMakingTask(it);
          const labelEn = q.id === "q3" ? capitalizeFirst(val) : val;
          const esText = it.id === "steam-maze" ? "hacer el laberinto" : it.id === "steam-dream-catcher" ? "hacer el atrapasueños" : it.es;
          const sel = m.main === val;
          return `
            <button type="button" class="lego-piece lego-piece-blue ${sel ? "is-selected" : ""}" data-m-main="${escapeHtml(val)}">
              <span>${sel ? "✓ " : ""}${escapeHtml(labelEn)}</span>
              <span class="es-mini">(${escapeHtml(esText)})</span>
            </button>`;
        })
        .join("");
      step1Html = `
        <div class="comp-step-block">
          <div class="comp-step-title"><span style="color: var(--lego-blue);">${title1}</span></div>
          <div class="chip-row" style="margin-bottom: 0;">${taskBtns}</div>
          ${consistencyTip ? `<div class="consistency-tip-box">${escapeHtml(consistencyTip)}</div>` : ""}
        </div>`;
    } else if (q.id === "q2") {
      const yesNoBtns = q.mainOptions
        .map((opt) => {
          const sel = m.main === opt.id;
          return `
            <button type="button" class="editorial-opt-btn editorial-opt-blue ${sel ? "is-selected" : ""}" data-m-main="${opt.id}">
              <span class="opt-en">${sel ? "✓ " : ""}${escapeHtml(opt.en)}</span>
              <span class="opt-es">${escapeHtml(opt.es)}</span>
            </button>`;
        })
        .join("");
      step1Html = `
        <div class="comp-step-block">
          <div class="comp-step-title"><span style="color: var(--lego-blue);">1. 🟦 Bloque Azul: ¿Sí o No? (Opinión real de Miguel)</span></div>
          <div class="editorial-option-list" style="margin-bottom: 0;">${yesNoBtns}</div>
        </div>`;
    } else if (q.id === "q4") {
      const partBtns = q.mainOptions
        .map((opt) => {
          const sel = m.main === opt.id;
          return `
            <button type="button" class="editorial-opt-btn editorial-opt-blue ${sel ? "is-selected" : ""}" data-m-main="${opt.id}">
              <span class="opt-en">${sel ? "✓ " : ""}${escapeHtml(opt.en)}</span>
              <span class="opt-es">${escapeHtml(opt.es)}</span>
            </button>`;
        })
        .join("");
      step1Html = `
        <div class="comp-step-block">
          <div class="comp-step-title"><span style="color: var(--lego-blue);">1. 🟦 Bloque Azul: ¿Cuál fue la parte más lenta o aburrida?</span></div>
          <div class="editorial-option-list" style="margin-bottom: 0;">${partBtns}</div>
        </div>`;
    } else if (q.id === "q5") {
      step1Html = `
        <div class="comp-step-block">
          <div class="comp-step-title"><span style="color: var(--lego-orange);">1. 🟧 Bloque Naranja: Activa el verbo en Pasado Simple</span></div>
          <p class="helper-note" style="margin-bottom: 8px;">La pregunta usa <code>did you learn</code>, por eso respondemos con el verbo en pasado <strong>I learned</strong>.</p>
          <button type="button" class="lego-piece lego-piece-orange ${m.hasLearnedVerb ? "is-selected" : ""}" id="st3-learned-btn">
            <span>${m.hasLearnedVerb ? "✓ I learned" : "+ I learned"}</span>
            <span class="es-mini">(Yo aprendí)</span>
          </button>
        </div>`;
    }

    /* Paso 2: Puente verde because (para Q1-Q4) */
    if (q.needsBecause) {
      step2BridgeHtml = `
        <div class="comp-step-block">
          <div class="comp-step-title"><span style="color: var(--lego-green);">2. 🟩 Bloque Verde: Conector obligatorio para responder Why?</span></div>
          <button type="button" class="lego-piece lego-piece-green ${m.hasBecause ? "is-selected" : ""}" id="st3-because-btn">
            <span>${m.hasBecause ? "✓ because" : "+ because"}</span>
            <span class="es-mini">(porque — obligatorio)</span>
          </button>
        </div>`;
    }

    /* Paso 3: Bloque Morado (1:1 .editorial-opt-purple!) */
    if (q.id === "q5") {
      const learnBtns = q.learnOptions
        .map((opt) => {
          const sel = (m.selectedIds || []).includes(opt.id);
          return `
            <button type="button" class="editorial-opt-btn editorial-opt-purple ${sel ? "is-selected" : ""}" data-m-learn="${opt.id}">
              <span class="opt-en">${sel ? "✓ " : "+ "}${escapeHtml(opt.en)}</span>
              <span class="opt-es">${escapeHtml(opt.es)}</span>
            </button>`;
        })
        .join("");

      step3ReasonHtml = `
        <div class="comp-step-block" style="margin-bottom: 0;">
          <div class="comp-step-title"><span style="color: var(--lego-purple);">2. 🟪 Bloque Morado: Elige 1 o 2 cosas que aprendiste</span></div>
          <div class="editorial-option-list">${learnBtns}</div>
          <details class="neuro-details" ${m.customEs || m.customEn ? "open" : ""}>
            <summary>
              <span>✏️ ¿Agregar otro aprendizaje propio de Miguel? (Español ↔ Inglés)</span>
              <span>▼ Abrir</span>
            </summary>
            <div class="custom-note-box">
              <div class="field" style="margin-bottom: 8px;">
                <label for="st3-custom-es">Idea de Miguel en Español (detecta palabras A1):</label>
                <input type="text" id="st3-custom-es" maxlength="90" value="${escapeHtml(m.customEs || "")}" placeholder="Ej. paciencia y usar cartón">
              </div>
              <div class="chip-row" id="st3-custom-chips"></div>
              <div class="field">
                <label for="st3-custom-en">Complemento en Inglés A1 (máximo 2 ideas en total):</label>
                <input type="text" id="st3-custom-en" maxlength="90" value="${escapeHtml(m.customEn || "")}" placeholder="Ej. to use cardboard with patience">
              </div>
            </div>
          </details>
        </div>`;
    } else {
      let reasonsList = q.reasons || [];
      if (q.id === "q2") {
        reasonsList = m.main ? q.reasonsByMain[m.main] || [] : [];
      } else if (q.id === "q4") {
        const chosenPart = q.mainOptions.find((o) => o.id === m.main);
        reasonsList = chosenPart ? (chosenPart.positive ? q.reasonsPositive : q.reasonsStandard) : [];
      }

      const reasonsContent =
        reasonsList.length > 0
          ? `<div class="editorial-option-list">
              ${reasonsList
                .map((r) => {
                  const sel = m.reason === r.en && !cleanCustomClause(m.customEn);
                  return `
                    <button type="button" class="editorial-opt-btn editorial-opt-purple ${sel ? "is-selected" : ""}" data-m-reason="${escapeHtml(r.en)}">
                      <span class="opt-en">${sel ? "✓ " : ""}${escapeHtml(r.en)}</span>
                      <span class="opt-es">${escapeHtml(r.es)}</span>
                    </button>`;
                })
                .join("")}
            </div>`
          : `<p class="helper-note" style="margin: 0 0 10px;">Primero elige el <strong>Bloque Azul (Paso 1)</strong> para ver razones coherentes con la opinión de Miguel.</p>`;

      step3ReasonHtml = `
        <div class="comp-step-block" style="margin-bottom: 0;">
          <div class="comp-step-title"><span style="color: var(--lego-purple);">3. 🟪 Bloque Morado: Elige la razón de Miguel (o escribe la tuya)</span></div>
          ${reasonsContent}
          <details class="neuro-details" ${m.customEs || m.customEn ? "open" : ""}>
            <summary>
              <span>✏️ ¿Miguel quiere dar su propia razón en Español / Inglés?</span>
              <span>▼ Abrir</span>
            </summary>
            <div class="custom-note-box">
              <div class="field" style="margin-bottom: 8px;">
                <label for="st3-custom-es">Razón de Miguel en Español (sugiere chips A1):</label>
                <input type="text" id="st3-custom-es" maxlength="90" value="${escapeHtml(m.customEs || "")}" placeholder="Ej. fue divertido pintar con colores">
              </div>
              <div class="chip-row" id="st3-custom-chips"></div>
              <div class="field">
                <label for="st3-custom-en">Razón en Inglés A1 (va después de <code>because</code>):</label>
                <input type="text" id="st3-custom-en" maxlength="90" value="${escapeHtml(m.customEn || "")}" placeholder="Ej. it was fun to paint with colors">
              </div>
            </div>
          </details>
        </div>`;
    }

    const rightNavBtnHtml = isLastQ
      ? `<button type="button" class="btn btn-audio is-unlocked" id="st3-goto-rehearsal-btn">🎭 Ir al Simulacro Oral ↓</button>`
      : `<button type="button" class="btn btn-primary" id="st3-next-btn">Siguiente pregunta →</button>`;

    stageEl.innerHTML = `
      <div class="miss-prompt-banner">
        <div>
          <div class="miss-prompt-kicker">Pregunta Oficial ${st3ActiveQIdx + 1} de 5 — Correo de la Miss</div>
          <h4 class="miss-prompt-en">${q.questionHtml}</h4>
          <p class="miss-prompt-es">${escapeHtml(q.questionEs)}</p>
        </div>
        <button type="button" class="btn btn-audio" id="st3-speak-q-btn">
          🔊 Escuchar Pregunta
        </button>
      </div>

      <div class="parent-coach-strip">${escapeHtml(q.parentTip)}</div>

      <div class="qa-stage-grid">
        <div>
          ${step1Html}
          ${step2BridgeHtml}
          ${step3ReasonHtml}
        </div>

        <!-- Monitor de Estudio ON AIR con foto de Miguel y traducción de verificación -->
        <div>
          <div class="studio-monitor ${built.complete ? "is-correct" : ""}" id="st3-studio-monitor">
            <div class="studio-monitor-bar">
              <div class="studio-guest-chip">
                <img src="assets/images/miguel-retrato.jpg" alt="Miguel Ángel en entrevista" class="studio-guest-avatar">
                <div class="studio-guest-meta">
                  <strong>Miguel Ángel</strong>
                  <span>Invitado • 3° Primaria</span>
                </div>
              </div>
              <div class="studio-onair-wrap">
                <div class="eq-bars" aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span class="onair-pill" id="st3-onair-pill">
                  <span class="onair-dot"></span>
                  <span id="st3-onair-text">${built.complete ? "ON AIR" : "STANDBY"}</span>
                </span>
              </div>
            </div>

            <div class="studio-monitor-body">
              <div class="validation-badge ${built.complete ? "status-correct" : "status-progress"}" id="st3-stage-badge">
                ${built.complete ? "✅ ¡Respuesta lista al aire! Ya puedes escuchar tu diálogo en inglés." : escapeHtml(built.nextStepMsg)}
              </div>
              <div class="preview-output" id="st3-stage-output">
                ${built.complete ? built.html : `<span class="assembly-placeholder">Aquí aparecerá la respuesta armada de Miguel por colores LEGO...</span>`}
              </div>
              <div class="spanish-meaning-box" id="st3-stage-es-meaning">
                ${built.complete ? `<strong>Tu respuesta en español:</strong> ${escapeHtml(built.esMeaning)}` : "Traducción de verificación: aparecerá cuando completes los bloques."}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button type="button" class="btn btn-audio ${built.complete ? "is-unlocked" : ""}" id="st3-speak-ans-btn" ${built.complete ? "" : "disabled"}>
                  ${built.complete ? "🔊 Escuchar Respuesta" : "🔒 Completa los bloques para escuchar"}
                </button>
                <button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" id="st3-speak-dialog-btn" ${built.complete ? "" : "disabled"}>
                  🎙️ Pregunta + Respuesta
                </button>
                <button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" id="st3-clear-q-btn">
                  🔄 Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="qa-nav-footer">
        <button type="button" class="btn btn-secondary" id="st3-prev-btn" ${st3ActiveQIdx === 0 ? "disabled" : ""}>
          ← Pregunta anterior
        </button>
        <span class="helper-note" style="margin: 0;">Pregunta ${st3ActiveQIdx + 1} de ${questions.length}</span>
        ${rightNavBtnHtml}
      </div>`;

    /* Enlazar eventos con lectura fresca de estado (P0-1 fix: cero closures desactualizados!) */
    const speakQBtn = document.getElementById("st3-speak-q-btn");
    if (speakQBtn) {
      speakQBtn.addEventListener("click", () => window.AppSpeech.speak(q.questionEn, showToast));
    }

    const speakAnsBtn = document.getElementById("st3-speak-ans-btn");
    if (speakAnsBtn) {
      speakAnsBtn.addEventListener("click", () => {
        const fresh = buildMetaAnswer(q.id);
        if (fresh.complete) window.AppSpeech.speak(fresh.plainEn, showToast);
      });
    }

    const speakDialogBtn = document.getElementById("st3-speak-dialog-btn");
    if (speakDialogBtn) {
      speakDialogBtn.addEventListener("click", () => {
        const fresh = buildMetaAnswer(q.id);
        if (fresh.complete) window.AppSpeech.speak(`${q.questionEn} ${fresh.plainEn}`, showToast);
      });
    }

    stageEl.querySelectorAll("[data-m-main]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-m-main");
        const prev = m.main;
        m.main = prev === val ? "" : val;
        if ((q.id === "q2" || q.id === "q4") && prev !== m.main) {
          m.reason = "";
        }
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
      });
    });

    const becauseBtn = document.getElementById("st3-because-btn");
    if (becauseBtn) {
      becauseBtn.addEventListener("click", () => {
        m.hasBecause = !m.hasBecause;
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
      });
    }

    const learnedBtn = document.getElementById("st3-learned-btn");
    if (learnedBtn) {
      learnedBtn.addEventListener("click", () => {
        m.hasLearnedVerb = !m.hasLearnedVerb;
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
      });
    }

    stageEl.querySelectorAll("[data-m-reason]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-m-reason");
        m.reason = m.reason === val ? "" : val;
        m.customEn = "";
        m.customEs = "";
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
      });
    });

    stageEl.querySelectorAll("[data-m-learn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-m-learn");
        const list = m.selectedIds || [];
        const hasCustom = Boolean((m.customEn || "").trim());
        const maxPresets = hasCustom ? 1 : 2;
        if (list.includes(id)) {
          m.selectedIds = list.filter((x) => x !== id);
        } else {
          if (list.length >= maxPresets) {
            showToast("Tip neuroeducativo: elige máximo 2 aprendizajes en total para que sea fácil de recordar el martes.");
            return;
          }
          m.selectedIds = list.concat([id]);
        }
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
      });
    });

    /* Asistente bilingüe en el campo libre de cada pregunta */
    const customEs = document.getElementById("st3-custom-es");
    const customEn = document.getElementById("st3-custom-en");
    const customChips = document.getElementById("st3-custom-chips");

    function updateStagePreviewOnly(qid) {
      const fresh = buildMetaAnswer(qid);
      const monitorEl = document.getElementById("st3-studio-monitor");
      const onairText = document.getElementById("st3-onair-text");
      const badgeEl = document.getElementById("st3-stage-badge");
      const outEl = document.getElementById("st3-stage-output");
      const esEl = document.getElementById("st3-stage-es-meaning");
      const ansBtn = document.getElementById("st3-speak-ans-btn");
      const dlgBtn = document.getElementById("st3-speak-dialog-btn");

      if (monitorEl) monitorEl.classList.toggle("is-correct", fresh.complete);
      if (onairText) onairText.textContent = fresh.complete ? "ON AIR" : "STANDBY";
      if (badgeEl) {
        badgeEl.className = `validation-badge ${fresh.complete ? "status-correct" : "status-progress"}`;
        badgeEl.textContent = fresh.complete
          ? "✅ ¡Respuesta lista al aire! Ya puedes escuchar tu diálogo en inglés."
          : fresh.nextStepMsg;
      }
      if (outEl) {
        outEl.innerHTML = fresh.complete
          ? fresh.html
          : `<span class="assembly-placeholder">Aquí aparecerá la respuesta armada de Miguel por colores LEGO...</span>`;
      }
      if (esEl) {
        esEl.innerHTML = fresh.complete
          ? `<strong>Tu respuesta en español:</strong> ${escapeHtml(fresh.esMeaning)}`
          : "Traducción de verificación: aparecerá cuando completes los bloques.";
      }
      if (ansBtn) {
        ansBtn.disabled = !fresh.complete;
        ansBtn.classList.toggle("is-unlocked", fresh.complete);
        ansBtn.textContent = fresh.complete ? "🔊 Escuchar Respuesta" : "🔒 Completa los bloques para escuchar";
      }
      if (dlgBtn) dlgBtn.disabled = !fresh.complete;

      /* Sincronizar estado visual de presets cuando se escribe texto propio (P0-5 fix) */
      if (qid !== "q5" && cleanCustomClause(m.customEn)) {
        stageEl.querySelectorAll("[data-m-reason]").forEach((b) => {
          b.classList.remove("is-selected");
          const enSpan = b.querySelector(".opt-en");
          if (enSpan) enSpan.textContent = b.getAttribute("data-m-reason");
        });
      }

      let count = 0;
      questions.forEach((qq, i) => {
        const done = buildMetaAnswer(qq.id).complete;
        if (done) count += 1;
        const tabBtn = tabsWrap.querySelector(`[data-st3-tab="${i}"]`);
        if (tabBtn) {
          tabBtn.classList.toggle("is-done", done);
          const stateSpan = tabBtn.querySelector(".q-tab-state");
          if (stateSpan) stateSpan.textContent = done ? "✅ Lista" : "Pendiente";
        }
      });
      if (progressBadge) {
        progressBadge.textContent =
          count === questions.length ? `🏆 ¡${count} de ${questions.length} respondidas!` : `${count} de ${questions.length} respondidas`;
      }
    }

    function renderCustomChips() {
      if (!customEs || !customEn || !customChips) return;
      const res = window.BilingualHelper.analyze(customEs.value);
      if (res.matches.length === 0) {
        customChips.innerHTML = "";
        return;
      }
      customChips.innerHTML = res.matches
        .map(
          (item) => `
          <button type="button" class="word-chip" data-st3-ins="${escapeHtml(item.en)}">
            <span>+ ${escapeHtml(item.en)}</span>
            <span class="es-mini">(${escapeHtml(item.displayEs)})</span>
          </button>`
        )
        .join("");

      customChips.querySelectorAll("[data-st3-ins]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const phrase = btn.getAttribute("data-st3-ins");
          const cur = customEn.value.trim();
          customEn.value = cur ? `${cur} ${phrase}` : phrase;
          m.customEn = customEn.value;
          if (q.id !== "q5") m.reason = "";
          window.AppStorage.save(state);
          updateStagePreviewOnly(q.id);
          renderStation3Summary();
        });
      });
    }

    if (customEs) {
      customEs.addEventListener("input", () => {
        m.customEs = customEs.value;
        window.AppStorage.save(state);
        renderCustomChips();
        updateStagePreviewOnly(q.id);
      });
      renderCustomChips();
    }

    if (customEn) {
      customEn.addEventListener("input", () => {
        m.customEn = customEn.value;
        if (q.id !== "q5" && cleanCustomClause(m.customEn)) {
          m.reason = "";
        } else if (q.id === "q5" && m.customEn.trim() && (m.selectedIds || []).length >= 2) {
          const poppedId = m.selectedIds.pop();
          const poppedBtn = stageEl.querySelector(`[data-m-learn="${poppedId}"]`);
          if (poppedBtn) {
            poppedBtn.classList.remove("is-selected");
            const optMeta = q.learnOptions.find((o) => o.id === poppedId);
            const enSpan = poppedBtn.querySelector(".opt-en");
            if (optMeta && enSpan) enSpan.textContent = `+ ${optMeta.en}`;
          }
        }
        window.AppStorage.save(state);
        updateStagePreviewOnly(q.id);
        renderStation3Summary();
      });
    }

    const clearQBtn = document.getElementById("st3-clear-q-btn");
    if (clearQBtn) {
      clearQBtn.addEventListener("click", () => {
        if (q.id === "q5") {
          state.metacognition.q5 = { hasLearnedVerb: false, selectedIds: [], customEs: "", customEn: "" };
        } else {
          state.metacognition[q.id] = { main: "", hasBecause: false, reason: "", customEs: "", customEn: "" };
        }
        window.AppStorage.save(state);
        renderStation3Stage();
        renderStation3Summary();
        showToast("Pregunta reiniciada.");
      });
    }

    const prevBtn = document.getElementById("st3-prev-btn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (st3ActiveQIdx > 0) {
          st3ActiveQIdx -= 1;
          renderStation3Stage();
        }
      });
    }

    const nextBtn = document.getElementById("st3-next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (st3ActiveQIdx < questions.length - 1) {
          st3ActiveQIdx += 1;
          renderStation3Stage();
        }
      });
    }

    const gotoRehearsalBtn = document.getElementById("st3-goto-rehearsal-btn");
    if (gotoRehearsalBtn) {
      gotoRehearsalBtn.addEventListener("click", () => {
        const target = document.getElementById("st3-rehearsal-section");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function renderStation3Summary() {
    const s3 = window.APP_DATA.station3Data;
    const grid = document.getElementById("st3-summary-grid");
    const toggleBtn = document.getElementById("st3-rehearsal-toggle-btn");
    const speakAllBtn = document.getElementById("st3-speak-all-btn");
    const consoleBar = document.getElementById("st3-rehearsal-console");
    const consoleCounter = document.getElementById("st3-rehearsal-counter");
    if (!s3 || !grid) return;

    if (toggleBtn) {
      toggleBtn.classList.toggle("is-memory-on", st3RehearsalMode);
      toggleBtn.textContent = st3RehearsalMode
        ? "🙈 Modo Simulacro Oral: SÍ"
        : "🙈 Modo Simulacro Oral: NO";
    }

    const questions = s3.officialQuestions;
    let completeCount = 0;
    let revealedCompleteCount = 0;
    const fullScriptParts = [];

    grid.innerHTML = questions
      .map((q, idx) => {
        const ans = buildMetaAnswer(q.id);
        const isRevealed = st3RevealedSummary.has(q.id);
        if (ans.complete) {
          completeCount += 1;
          if (isRevealed) revealedCompleteCount += 1;
          fullScriptParts.push(`Question ${idx + 1}. ${q.questionEn} ${ans.plainEn}`);
        }

        let bodyHtml = `<span class="helper-note" style="margin: 0;">Pendiente — haz clic en "Editar" para armar tu respuesta en la cabina arriba.</span>`;
        if (ans.complete) {
          if (st3RehearsalMode && !isRevealed) {
            bodyHtml = `<button type="button" class="qa-curtain-btn" data-st3-reveal="${q.id}">🎤 Escucha la pregunta, responde en voz alta y toca aquí para verificar tu respuesta...</button>`;
          } else {
            bodyHtml = `
              <div class="speaker-row">
                <span class="speaker-pill speaker-miguel">👦 Miguel</span>
                <div style="flex: 1;">
                  ${ans.html}
                  <p class="warmup-es" style="margin-top: 4px;">${escapeHtml(ans.esMeaning)}</p>
                </div>
              </div>`;
          }
        }

        return `
          <article class="qa-summary-card ${ans.complete ? "is-complete" : ""}">
            <div class="qa-summary-top">
              <div class="speaker-row" style="flex: 1; min-width: 220px;">
                <span class="speaker-pill speaker-miss">👩‍🏫 La Miss</span>
                <p class="qa-summary-q">${idx + 1}. ${escapeHtml(q.questionEn)}</p>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-sum-speak-q="${escapeHtml(q.questionEn)}">🔊 La Miss pregunta</button>
                ${
                  ans.complete && (!st3RehearsalMode || isRevealed)
                    ? `<button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" data-sum-speak-a="${escapeHtml(ans.plainEn)}">🔊 Mi respuesta</button>`
                    : ""
                }
                <button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" data-sum-edit="${idx}">✏️ Editar</button>
              </div>
            </div>
            <div>${bodyHtml}</div>
          </article>`;
      })
      .join("");

    if (consoleBar && consoleCounter) {
      consoleBar.classList.toggle("is-visible", st3RehearsalMode);
      if (completeCount === 0) {
        consoleCounter.innerHTML = `<span class="live-rec-dot"></span>Completa al menos una respuesta arriba para ensayar en el simulacro.`;
      } else if (revealedCompleteCount === completeCount) {
        consoleCounter.innerHTML = `🏆 ¡Simulacro completo! Comprobaste ${revealedCompleteCount} de ${completeCount} respuestas en voz alta.`;
      } else {
        consoleCounter.innerHTML = `<span class="live-rec-dot"></span>EN VIVO • Simulacro Oral: ${revealedCompleteCount} de ${completeCount} comprobadas`;
      }
    }

    grid.querySelectorAll("[data-sum-speak-q]").forEach((btn) => {
      btn.addEventListener("click", () => window.AppSpeech.speak(btn.getAttribute("data-sum-speak-q"), showToast));
    });

    grid.querySelectorAll("[data-sum-speak-a]").forEach((btn) => {
      btn.addEventListener("click", () => window.AppSpeech.speak(btn.getAttribute("data-sum-speak-a"), showToast));
    });

    grid.querySelectorAll("[data-st3-reveal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-st3-reveal");
        st3RevealedSummary.add(qid);
        renderStation3Summary();
        const ans = buildMetaAnswer(qid);
        if (ans.complete) window.AppSpeech.speak(ans.plainEn, showToast);
      });
    });

    grid.querySelectorAll("[data-sum-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        st3ActiveQIdx = Number(btn.getAttribute("data-sum-edit"));
        renderStation3Stage();
        const stage = document.getElementById("st3-interview-stage");
        if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (speakAllBtn) {
      const ready = completeCount === questions.length;
      speakAllBtn.disabled = !ready;
      speakAllBtn.classList.toggle("is-unlocked", ready);
      speakAllBtn.textContent = ready
        ? "🔊 Escuchar las 5 Preguntas y Respuestas"
        : `🔒 Completa las 5 respuestas (${completeCount}/5)`;
      speakAllBtn.dataset.fullScript = fullScriptParts.join(" ");
    }
  }

  function renderStation3BonusInfo() {
    const grid = document.getElementById("st3-bonus-info-grid");
    if (!grid) return;

    const np = state.newspaper;
    const built = buildNewspaperTexts(np);

    const cards = [
      {
        q: "What is the title of your STEAM newspaper?",
        a: built.checks.title
          ? `The title of my newspaper is "${np.title.trim()}".`
          : "Completa el TITLE en la Estación 2 para ver tu respuesta aquí."
      },
      {
        q: "Who participated in the project?",
        a: built.checks.who
          ? built.whoSentencePlain
          : "Completa WHO PARTICIPATED en la Estación 2 para ver tu respuesta aquí."
      },
      {
        q: "Where did the project take place?",
        a: built.checks.where
          ? built.whereSentencePlain
          : "Completa WHERE IT TOOK PLACE en la Estación 2 para ver tu respuesta aquí."
      }
    ];

    grid.innerHTML = cards
      .map((c, idx) => {
        const hasReal = !c.a.startsWith("Completa ");
        return `
          <article class="bonus-info-card">
            <div>
              <strong style="font-size: 0.88rem; color: var(--lego-blue); display: block; margin-bottom: 4px;">${idx + 1}. ${escapeHtml(c.q)}</strong>
              <p class="warmup-es" style="color: ${hasReal ? "var(--text)" : "var(--text-muted)"}; font-weight: ${hasReal ? "700" : "500"};">${escapeHtml(c.a)}</p>
            </div>
            ${
              hasReal
                ? `<button type="button" class="btn btn-audio btn-sm" style="min-height: 44px;" data-bonus-speak="${escapeHtml(c.q + " " + c.a)}">🔊 Escuchar Q&amp;A</button>`
                : `<button type="button" class="btn btn-secondary btn-sm" style="min-height: 44px;" data-goto-st2>Ir a Estación 2</button>`
            }
          </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-bonus-speak]").forEach((btn) => {
      btn.addEventListener("click", () => window.AppSpeech.speak(btn.getAttribute("data-bonus-speak"), showToast));
    });

    grid.querySelectorAll("[data-goto-st2]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = document.querySelector(`.station-tab[data-station="station-2"]`);
        if (tab) tab.click();
      });
    });
  }

  function renderStation3All() {
    renderStation3Warmups();
    renderStation3Radar();
    renderStation3Stage();
    renderStation3Summary();
    renderStation3BonusInfo();
  }

  function initStation3() {
    renderStation3All();

    const rehearsalBtn = document.getElementById("st3-rehearsal-toggle-btn");
    if (rehearsalBtn) {
      rehearsalBtn.addEventListener("click", () => {
        st3RehearsalMode = !st3RehearsalMode;
        st3RevealedSummary = new Set();
        renderStation3Summary();
        if (st3RehearsalMode) {
          showToast("🎭 Simulacro activado: escucha cada pregunta, responde en voz alta y toca para verificar.");
        }
      });
    }

    const rehearsalResetBtn = document.getElementById("st3-rehearsal-reset-btn");
    if (rehearsalResetBtn) {
      rehearsalResetBtn.addEventListener("click", () => {
        st3RevealedSummary = new Set();
        renderStation3Summary();
        showToast("🔄 Todas las respuestas ocultas de nuevo. ¡A ensayar!");
      });
    }

    const speakAllBtn = document.getElementById("st3-speak-all-btn");
    if (speakAllBtn) {
      speakAllBtn.addEventListener("click", () => {
        if (speakAllBtn.disabled || !speakAllBtn.dataset.fullScript) return;
        window.AppSpeech.speak(speakAllBtn.dataset.fullScript, showToast);
      });
    }
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
        compDraft = { item1Id: null, verb: "was", adjId: null, hasThan: false, item2Id: null };
        tmIsPast = false;
        revealedMemoryKeys = new Set();
        st3ActiveQIdx = 0;
        st3RehearsalMode = false;
        st3RevealedWarmups = new Set();
        st3RevealedSummary = new Set();
        renderBank();
        renderStation0Builder();
        renderStation1Quiz();
        renderStation1Builder();
        renderSavedComparatives();
        syncStation2InputsFromState();
        renderStation2TimeMachine();
        renderStation2Quiz();
        renderStation2Newspaper();
        renderStation3All();
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
    initStation1();
    initStation2();
    initStation3();
    initStorageActions();
  });
})();
