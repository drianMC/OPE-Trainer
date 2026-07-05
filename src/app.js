import { clearProgress, loadProgress, saveProgress } from "./storage.js";
import { isCorrect, isSpecialStatus, summarizeProgress } from "./quiz.js";

const state = {
  questions: [],
  filtered: [],
  currentIndex: 0,
  bank: "all",
  mode: "study",
  onlyVerified: false,
  onlyUnanswered: false,
  onlyWrong: false,
  progress: loadProgress(),
  deferredInstall: null,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  datasetMeta: $("#datasetMeta"),
  bankFilters: $("#bankFilters"),
  questionCounter: $("#questionCounter"),
  questionBank: $("#questionBank"),
  questionStatus: $("#questionStatus"),
  questionTitle: $("#questionTitle"),
  questionText: $("#questionText"),
  options: $("#options"),
  answerFeedback: $("#answerFeedback"),
  explanationPanel: $("#explanationPanel"),
  foundation: $("#foundation"),
  normative: $("#normative"),
  observations: $("#observations"),
  prevQuestion: $("#prevQuestion"),
  nextQuestion: $("#nextQuestion"),
  controlPanel: $("#controlPanel"),
  menuButton: $("#menuButton"),
  onlyVerified: $("#onlyVerified"),
  onlyUnanswered: $("#onlyUnanswered"),
  onlyWrong: $("#onlyWrong"),
  filterSummary: $("#filterSummary"),
  statAnswered: $("#statAnswered"),
  statPending: $("#statPending"),
  statCorrect: $("#statCorrect"),
  statWrong: $("#statWrong"),
  statRate: $("#statRate"),
  bankProgress: $("#bankProgress"),
  resetStats: $("#resetStats"),
  installButton: $("#installButton"),
  installHint: $("#installHint"),
};

init();

async function init() {
  const response = await fetch("data/pilot.json", { cache: "no-store" });
  const data = await response.json();
  state.questions = data.questions;
  els.datasetMeta.textContent = `${data.questions.length} preguntas piloto · ${data.version}`;

  renderBankFilters();
  bindEvents();
  configureResponsiveControls();
  applyFilters();
  registerServiceWorker();
}

function renderBankFilters() {
  const banks = [
    { key: "all", label: "Todos" },
    ...Array.from(new Map(state.questions.map((q) => [q.bank, q.bankTitle])).entries())
      .map(([key, label]) => ({ key, label })),
  ];

  els.bankFilters.innerHTML = banks.map((bank) => (
    `<button type="button" data-bank="${bank.key}" class="${bank.key === state.bank ? "is-active" : ""}">${bank.label}</button>`
  )).join("");
}

function bindEvents() {
  els.bankFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-bank]");
    if (!button) return;
    state.bank = button.dataset.bank;
    $$("#bankFilters button").forEach((item) => item.classList.toggle("is-active", item === button));
    applyFilters();
  });

  document.addEventListener("click", (event) => {
    const modeButton = event.target.closest("button[data-mode]");
    if (modeButton) {
      state.mode = modeButton.dataset.mode;
      $$("button[data-mode]").forEach((item) => item.classList.toggle("is-active", item === modeButton));
      renderQuestion();
    }
  });

  els.onlyVerified.addEventListener("change", () => {
    state.onlyVerified = els.onlyVerified.checked;
    applyFilters();
  });

  els.onlyUnanswered.addEventListener("change", () => {
    state.onlyUnanswered = els.onlyUnanswered.checked;
    applyFilters();
  });

  els.onlyWrong.addEventListener("change", () => {
    state.onlyWrong = els.onlyWrong.checked;
    applyFilters();
  });

  els.prevQuestion.addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  });

  els.nextQuestion.addEventListener("click", () => {
    if (state.currentIndex < state.filtered.length - 1) {
      state.currentIndex += 1;
      renderQuestion();
    }
  });

  els.menuButton.addEventListener("click", () => {
    const open = els.controlPanel.classList.toggle("is-open");
    els.menuButton.setAttribute("aria-expanded", String(open));
    els.menuButton.setAttribute("aria-label", open ? "Cerrar controles" : "Abrir controles");
  });

  els.resetStats.addEventListener("click", () => {
    clearProgress();
    state.progress = {};
    renderQuestion();
    renderStats();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstall = event;
    els.installHint.classList.add("hidden");
  });

  els.installButton.addEventListener("click", async () => {
    if (!state.deferredInstall) {
      els.installHint.classList.remove("hidden");
      return;
    }
    state.deferredInstall.prompt();
    await state.deferredInstall.userChoice;
    state.deferredInstall = null;
    els.installHint.classList.add("hidden");
  });

  window.addEventListener("resize", configureResponsiveControls);
}

function configureResponsiveControls() {
  const mobile = window.matchMedia("(max-width: 860px)").matches;
  const bank = $("#bankDetails");
  const mode = $("#modeDetails");
  const filterDetails = $("#filterDetails");
  const progressDetails = $("#progressDetails");
  if (!bank || !mode || !filterDetails || !progressDetails) return;

  bank.open = true;
  mode.open = true;
  filterDetails.open = true;
  progressDetails.open = true;
  if (!mobile) {
    els.controlPanel.classList.remove("is-open");
    els.menuButton.setAttribute("aria-expanded", "false");
  }
}

function applyFilters() {
  state.filtered = state.questions.filter((question) => {
    const bankMatch = state.bank === "all" || question.bank === state.bank;
    const statusMatch = !state.onlyVerified || question.status === "verified";
    const progressMatch = !state.onlyUnanswered || !state.progress[question.id];
    const wrongMatch = !state.onlyWrong || Boolean(state.progress[question.id]?.everWrong);
    return bankMatch && statusMatch && progressMatch && wrongMatch;
  });
  state.currentIndex = 0;
  renderFilterSummary();
  renderQuestion();
  renderStats();
}

function getBankScopeQuestions() {
  return state.questions.filter((question) => state.bank === "all" || question.bank === state.bank);
}

function renderFilterSummary() {
  const scoped = getBankScopeQuestions();
  const answeredInScope = scoped.filter((question) => state.progress[question.id]).length;
  const pendingInScope = scoped.length - answeredInScope;
  const verifiedInScope = scoped.filter((question) => question.status === "verified").length;
  const wrongInScope = scoped.filter((question) => state.progress[question.id]?.everWrong).length;

  const parts = [];
  if (state.onlyVerified) parts.push("solo verificadas");
  if (state.onlyUnanswered) parts.push("solo sin responder");
  if (state.onlyWrong) parts.push("solo falladas");
  const filterText = parts.length ? `Filtro aplicado: ${parts.join(" + ")}.` : "Sin filtros: se muestran todas.";
  els.filterSummary.textContent = `${filterText} Banco actual: ${verifiedInScope}/${scoped.length} verificadas, ${pendingInScope} sin responder, ${wrongInScope} falladas alguna vez. Quedan ${state.filtered.length} preguntas.`;
}
function renderQuestion() {
  const question = state.filtered[state.currentIndex];
  if (!question) {
    els.questionCounter.textContent = "0 / 0";
    els.questionTitle.textContent = "No hay preguntas con esos filtros";
    els.questionText.textContent = "";
    els.options.innerHTML = "";
    els.explanationPanel.classList.add("hidden");
    els.answerFeedback.classList.add("hidden");
    els.prevQuestion.disabled = true;
    els.nextQuestion.disabled = true;
    return;
  }

  const entry = state.progress[question.id];
  els.questionCounter.textContent = `${state.currentIndex + 1} / ${state.filtered.length}`;
  els.questionBank.textContent = question.bankTitle;
  els.questionStatus.textContent = question.statusLabel || question.status;
  els.questionStatus.className = `status-pill ${question.status}`;
  els.questionTitle.textContent = `Pregunta ${question.number}`;
  els.questionText.textContent = question.question;
  els.prevQuestion.disabled = state.currentIndex === 0;
  els.nextQuestion.disabled = state.currentIndex === state.filtered.length - 1;

  els.options.innerHTML = question.options.map((option) => {
    const selected = entry?.selected === option.key;
    const reveal = state.mode === "study" || Boolean(entry);
    const correct = reveal && question.correct.includes(option.key);
    const wrong = Boolean(entry) && selected && !correct && !isSpecialStatus(question);
    const classes = ["option"];
    if (selected) classes.push("is-selected");
    if (correct) classes.push("is-correct");
    if (wrong) classes.push("is-wrong");
    return `
      <button type="button" class="${classes.join(" ")}" data-option="${option.key}">
        <span class="option-key">${option.key}</span>
        <span>${option.text}</span>
      </button>
    `;
  }).join("");

  $$("#options .option").forEach((button) => {
    button.addEventListener("click", () => answerQuestion(question, button.dataset.option));
    button.disabled = state.mode === "study";
  });

  renderExplanation(question, entry);
}

function renderExplanation(question, entry) {
  const reveal = state.mode === "study" || Boolean(entry);
  els.explanationPanel.classList.toggle("hidden", !reveal);

  els.foundation.textContent = question.foundation || "Sin fundamento cargado.";
  els.normative.textContent = question.normative || "Sin normativa cargada.";
  els.observations.textContent = question.observations || "Sin observaciones.";

  if (!entry) {
    if (state.mode === "study") {
      if (question.status === "verified") {
        els.answerFeedback.classList.add("hidden");
      } else {
        showFeedback("Pregunta con incidencia documental: revisar observaciones.", "warn");
      }
    } else {
      els.answerFeedback.classList.add("hidden");
    }
    return;
  }

  if (isSpecialStatus(question)) {
    showFeedback("Pregunta conflictiva: no se computa como fallo ordinario.", "warn");
  } else if (entry.isCorrect) {
    els.answerFeedback.classList.add("hidden");
  } else {
    showFeedback("Incorrecta. Revisa el fundamento y la normativa.", "bad");
  }
}

function answerQuestion(question, selected) {
  if (state.mode !== "test") return;
  const correct = isSpecialStatus(question) ? false : isCorrect(question, selected);
  const wrong = !correct && !isSpecialStatus(question);
  const previous = state.progress[question.id] || {};
  state.progress[question.id] = {
    ...previous,
    selected,
    isCorrect: correct,
    everWrong: Boolean(previous.everWrong || wrong),
    answeredAt: new Date().toISOString(),
    mode: "test",
  };
  saveProgress(state.progress);
  renderQuestion();
  renderStats();
}

function showFeedback(text, tone) {
  els.answerFeedback.textContent = text;
  els.answerFeedback.className = `feedback ${tone || ""}`.trim();
}

function renderStats() {
  const stats = summarizeProgress(state.questions, state.progress);
  const visibleStats = summarizeProgress(getBankScopeQuestions(), state.progress);
  els.statAnswered.textContent = stats.answered;
  els.statPending.textContent = stats.pending;
  els.statCorrect.textContent = stats.correct;
  els.statWrong.textContent = stats.wrong;
  els.statRate.textContent = `${stats.rate}%`;
  els.bankProgress.innerHTML = renderBankProgress(visibleStats);
}

function renderBankProgress(currentScopeStats) {
  const banks = Array.from(new Map(state.questions.map((question) => [question.bank, question.bankTitle])).entries());
  const rows = banks.map(([bank, label]) => {
    const questions = state.questions.filter((question) => question.bank === bank);
    const stats = summarizeProgress(questions, state.progress);
    return `
      <div class="bank-progress-row">
        <div>
          <strong>${label}</strong>
          <span>${stats.answered}/${stats.total} respondidas · ${stats.pending} sin responder</span>
        </div>
        <div class="progress-track"><span style="width:${stats.total ? Math.round((stats.answered / stats.total) * 100) : 0}%"></span></div>
      </div>
    `;
  });
  rows.unshift(`
    <div class="bank-progress-row current">
      <div>
        <strong>Grupo actual</strong>
        <span>${currentScopeStats.answered}/${currentScopeStats.total} respondidas · ${currentScopeStats.pending} sin responder</span>
      </div>
      <div class="progress-track"><span style="width:${currentScopeStats.total ? Math.round((currentScopeStats.answered / currentScopeStats.total) * 100) : 0}%"></span></div>
    </div>
  `);
  return rows.join("");
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("service-worker.js");
}

