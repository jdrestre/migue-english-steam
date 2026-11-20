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
        renderStation1Builder();
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
        renderBank();
        renderStation0Builder();
        renderStation1Quiz();
        renderStation1Builder();
        renderSavedComparatives();
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
    initStorageActions();
  });
})();
