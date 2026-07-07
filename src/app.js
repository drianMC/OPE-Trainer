import {
  clearAllStudyData,
  loadActiveRound,
  loadHistory,
  loadLegacyProgress,
  loadRounds,
  saveActiveRound,
  saveHistory,
  saveRounds,
} from "./storage.js";
import { isCorrect, isSpecialStatus } from "./quiz.js";

const state = {
  questions: [],
  filtered: [],
  studyQuestions: [],
  studyIndex: 0,
  configMode: "study",
  bank: "all",
  onlyVerified: false,
  onlyUnanswered: false,
  onlyWrong: false,
  randomOrder: false,
  history: loadHistory(),
  rounds: loadRounds(),
  activeRound: loadActiveRound(),
  finishedRound: null,
  quizMode: "study",
  deferredInstall: null,
  resetArmed: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  datasetMeta: $("#datasetMeta"),
  configView: $("#configView"),
  quizView: $("#quizView"),
  summaryView: $("#summaryView"),
  controlPanel: $("#controlPanel"),
  menuButton: $("#menuButton"),
  installButton: $("#installButton"),
  installHint: $("#installHint"),
  bankFilters: $("#bankFilters"),
  onlyVerified: $("#onlyVerified"),
  onlyUnanswered: $("#onlyUnanswered"),
  onlyWrong: $("#onlyWrong"),
  randomOrder: $("#randomOrder"),
  filterSummary: $("#filterSummary"),
  startActivity: $("#startActivity"),
  resumeRoundCard: $("#resumeRoundCard"),
  resumeRoundText: $("#resumeRoundText"),
  resumeRound: $("#resumeRound"),
  finishStoredRound: $("#finishStoredRound"),
  questionMap: $("#questionMap"),
  roundHistory: $("#roundHistory"),
  statAnswered: $("#statAnswered"),
  statAttempts: $("#statAttempts"),
  statCorrect: $("#statCorrect"),
  statWrong: $("#statWrong"),
  statRate: $("#statRate"),
  ratioBar: $("#ratioBar"),
  bankProgress: $("#bankProgress"),
  resetStats: $("#resetStats"),
  backToConfig: $("#backToConfig"),
  questionCounter: $("#questionCounter"),
  roundMiniStats: $("#roundMiniStats"),
  roundRatioBar: $("#roundRatioBar"),
  nextQuestion: $("#nextQuestion"),
  questionBank: $("#questionBank"),
  questionStatus: $("#questionStatus"),
  questionTitle: $("#questionTitle"),
  questionText: $("#questionText"),
  options: $("#options"),
  answerFeedback: $("#answerFeedback"),
  finishRound: $("#finishRound"),
  explanationPanel: $("#explanationPanel"),
  foundation: $("#foundation"),
  normative: $("#normative"),
  observations: $("#observations"),
  roundSummary: $("#roundSummary"),
  summaryRatioBar: $("#summaryRatioBar"),
  saveRound: $("#saveRound"),
  discardRound: $("#discardRound"),
};

init();

async function init() {
  const response = await fetch("data/pilot.json", { cache: "no-store" });
  const data = await response.json();
  state.questions = data.questions;
  els.datasetMeta.textContent = `${data.questions.length} preguntas piloto · ${data.version}`;

  migrateLegacyProgress();
  renderBankFilters();
  bindEvents();
  configureResponsiveControls();
  applyFilters();
  renderConfig();
  showConfig();
  registerServiceWorker();
}

function migrateLegacyProgress() {
  if (Object.keys(state.history).length) return;
  const legacy = loadLegacyProgress();
  for (const [id, entry] of Object.entries(legacy)) {
    state.history[id] = {
      attempts: 1,
      correct: entry.isCorrect ? 1 : 0,
      wrong: entry.isCorrect ? 0 : 1,
      lastSelected: entry.selected,
      lastAnsweredAt: entry.answeredAt,
      everWrong: !entry.isCorrect,
    };
  }
  if (Object.keys(state.history).length) saveHistory(state.history);
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
    renderConfig();
  });

  document.addEventListener("click", (event) => {
    const modeButton = event.target.closest("button[data-config-mode]");
    if (!modeButton) return;
    state.configMode = modeButton.dataset.configMode;
    $$("button[data-config-mode]").forEach((item) => item.classList.toggle("is-active", item === modeButton));
    applyFilters();
    renderConfig();
  });

  for (const [element, key] of [
    [els.onlyVerified, "onlyVerified"],
    [els.onlyUnanswered, "onlyUnanswered"],
    [els.onlyWrong, "onlyWrong"],
    [els.randomOrder, "randomOrder"],
  ]) {
    element.addEventListener("change", () => {
      state[key] = element.checked;
      applyFilters();
      renderConfig();
    });
  }

  els.startActivity.addEventListener("click", startActivity);
  els.resumeRound.addEventListener("click", () => showRound());
  els.finishStoredRound.addEventListener("click", finishRound);
  els.backToConfig.addEventListener("click", showConfig);
  els.nextQuestion.addEventListener("click", nextQuestion);
  els.finishRound.addEventListener("click", finishRound);
  els.saveRound.addEventListener("click", saveFinishedRound);
  els.discardRound.addEventListener("click", discardFinishedRound);

  els.menuButton.addEventListener("click", () => {
    const open = els.controlPanel.classList.toggle("is-open");
    els.menuButton.setAttribute("aria-expanded", String(open));
    els.menuButton.setAttribute("aria-label", open ? "Cerrar controles" : "Abrir controles");
  });

  els.resetStats.addEventListener("click", handleResetHistory);

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
  if (!mobile) {
    els.controlPanel.classList.add("is-open");
    els.menuButton.setAttribute("aria-expanded", "true");
  } else {
    els.controlPanel.classList.remove("is-open");
    els.menuButton.setAttribute("aria-expanded", "false");
  }
}

function applyFilters() {
  const scoped = getBankScopeQuestions();
  let result = scoped.filter((question) => {
    const history = state.history[question.id];
    const statusMatch = !state.onlyVerified || question.status === "verified";
    const progressMatch = !state.onlyUnanswered || !history?.attempts;
    const wrongMatch = !state.onlyWrong || Boolean(history?.everWrong);
    return statusMatch && progressMatch && wrongMatch;
  });

  if (state.configMode === "review") {
    result = result
      .filter((question) => (state.history[question.id]?.wrong || 0) > 0)
      .sort((a, b) => getWrongScore(b) - getWrongScore(a));
  }

  state.filtered = result;
  renderFilterSummary();
}

function getBankScopeQuestions() {
  return state.questions.filter((question) => state.bank === "all" || question.bank === state.bank);
}

function renderFilterSummary() {
  const scoped = getBankScopeQuestions();
  const verifiedInScope = scoped.filter((question) => question.status === "verified").length;
  const answeredInScope = scoped.filter((question) => state.history[question.id]?.attempts).length;
  const wrongInScope = scoped.filter((question) => state.history[question.id]?.everWrong).length;
  const parts = [];
  if (state.onlyVerified) parts.push("solo verificadas");
  if (state.onlyUnanswered) parts.push("solo sin responder");
  if (state.onlyWrong) parts.push("solo falladas");
  if (state.randomOrder) parts.push("orden aleatorio");
  if (state.configMode === "review") parts.push("repaso por mayor fallo");
  const filterText = parts.length ? `Filtro aplicado: ${parts.join(" + ")}.` : "Sin filtros: se muestran todas.";
  els.filterSummary.textContent = `${filterText} Banco actual: ${verifiedInScope}/${scoped.length} verificadas, ${answeredInScope} con histórico, ${wrongInScope} falladas alguna vez. La actividad tendrá ${state.filtered.length} preguntas.`;
}

function renderConfig() {
  els.startActivity.textContent = getStartLabel();
  els.resumeRoundCard.classList.toggle("hidden", !state.activeRound);
  if (state.activeRound) {
    const stats = summarizeRound(state.activeRound);
    els.resumeRoundText.textContent = `${state.activeRound.label}: ${stats.answered}/${stats.total} respondidas, ${stats.correct} aciertos y ${stats.wrong} fallos.`;
  }
  renderStats();
  renderQuestionMap();
  renderRoundHistory();
}

function getStartLabel() {
  if (state.configMode === "study") return "Empezar estudio";
  if (state.configMode === "review") return "Iniciar repaso";
  return "Iniciar ronda";
}

function startActivity() {
  applyFilters();
  const questions = state.randomOrder ? shuffle(state.filtered) : [...state.filtered];
  if (!questions.length) {
    els.filterSummary.textContent = "No hay preguntas disponibles con esta configuración.";
    return;
  }

  if (state.configMode === "study") {
    state.studyQuestions = questions;
    state.studyIndex = 0;
    showStudy();
    return;
  }

  state.activeRound = {
    id: `round-${Date.now()}`,
    label: state.configMode === "review" ? "Repaso de falladas" : "Ronda examen",
    mode: state.configMode,
    questionIds: questions.map((question) => question.id),
    currentIndex: 0,
    answers: {},
    startedAt: new Date().toISOString(),
    config: {
      bank: state.bank,
      onlyVerified: state.onlyVerified,
      onlyUnanswered: state.onlyUnanswered,
      onlyWrong: state.onlyWrong,
      randomOrder: state.randomOrder,
    },
  };
  saveActiveRound(state.activeRound);
  showRound();
}

function showConfig() {
  els.configView.classList.remove("hidden");
  els.quizView.classList.add("hidden");
  els.summaryView.classList.add("hidden");
  renderConfig();
}

function showStudy() {
  state.quizMode = "study";
  els.configView.classList.add("hidden");
  els.summaryView.classList.add("hidden");
  els.quizView.classList.remove("hidden");
  els.roundMiniStats.classList.add("hidden");
  els.roundRatioBar.classList.add("hidden");
  els.finishRound.classList.add("hidden");
  renderQuestion(getCurrentStudyQuestion(), "study");
}

function showRound() {
  if (!state.activeRound) return showConfig();
  state.quizMode = "round";
  els.configView.classList.add("hidden");
  els.summaryView.classList.add("hidden");
  els.quizView.classList.remove("hidden");
  els.roundMiniStats.classList.remove("hidden");
  els.roundRatioBar.classList.remove("hidden");
  els.finishRound.classList.remove("hidden");
  renderQuestion(getCurrentRoundQuestion(), "round");
}

function showSummary() {
  els.configView.classList.add("hidden");
  els.quizView.classList.add("hidden");
  els.summaryView.classList.remove("hidden");
  renderSummary();
}

function getCurrentStudyQuestion() {
  return state.studyQuestions[state.studyIndex];
}

function getCurrentRoundQuestion() {
  if (!state.activeRound) return null;
  return getQuestionById(state.activeRound.questionIds[state.activeRound.currentIndex]);
}

function getQuestionById(id) {
  return state.questions.find((question) => question.id === id);
}

function renderQuestion(question, mode) {
  if (!question) {
    els.questionCounter.textContent = "0 / 0";
    els.questionTitle.textContent = "No hay preguntas disponibles";
    els.questionText.textContent = "";
    els.options.innerHTML = "";
    els.explanationPanel.classList.add("hidden");
    els.answerFeedback.classList.add("hidden");
    els.nextQuestion.disabled = true;
    return;
  }

  const roundAnswer = mode === "round" ? state.activeRound.answers[question.id] : null;
  const total = mode === "round" ? state.activeRound.questionIds.length : state.studyQuestions.length;
  const index = mode === "round" ? state.activeRound.currentIndex : state.studyIndex;
  const reveal = mode === "study" || Boolean(roundAnswer);

  els.questionCounter.textContent = `${index + 1} / ${total}`;
  els.questionBank.textContent = question.bankTitle;
  els.questionStatus.textContent = question.statusLabel || question.status;
  els.questionStatus.className = `status-pill ${question.status}`;
  els.questionTitle.textContent = `Pregunta ${question.number}`;
  els.questionText.textContent = question.question;
  els.nextQuestion.disabled = index >= total - 1;
  els.nextQuestion.classList.toggle("hidden", mode === "round" && index >= total - 1);

  els.options.innerHTML = question.options.map((option) => {
    const selected = roundAnswer?.selected === option.key;
    const correct = reveal && question.correct.includes(option.key);
    const wrong = Boolean(roundAnswer) && selected && !correct && !isSpecialStatus(question);
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
    button.disabled = mode === "study" || Boolean(roundAnswer);
    button.addEventListener("click", () => answerRoundQuestion(question, button.dataset.option));
  });

  renderExplanation(question, reveal, roundAnswer);
  renderRoundHeader();
}

function renderExplanation(question, reveal, answer) {
  els.explanationPanel.classList.toggle("hidden", !reveal);
  els.foundation.textContent = question.foundation || "Sin fundamento cargado.";
  els.normative.textContent = question.normative || "Sin normativa cargada.";
  els.observations.textContent = question.observations || "Sin observaciones.";

  if (!answer) {
    if (reveal && question.status !== "verified") {
      showFeedback("Pregunta con incidencia documental: revisar observaciones.", "warn");
    } else {
      els.answerFeedback.classList.add("hidden");
    }
    return;
  }

  if (isSpecialStatus(question)) {
    showFeedback("Pregunta conflictiva: no se computa como fallo ordinario.", "warn");
  } else if (answer.isCorrect) {
    els.answerFeedback.classList.add("hidden");
  } else {
    showFeedback("Incorrecta. Revisa el fundamento y la normativa.", "bad");
  }
}

function answerRoundQuestion(question, selected) {
  if (!state.activeRound || state.activeRound.answers[question.id]) return;
  const special = isSpecialStatus(question);
  const correct = !special && isCorrect(question, selected);
  const answer = {
    selected,
    isCorrect: correct,
    isSpecial: special,
    answeredAt: new Date().toISOString(),
  };
  state.activeRound.answers[question.id] = answer;
  updateQuestionHistory(question.id, answer);
  saveActiveRound(state.activeRound);
  saveHistory(state.history);
  renderQuestion(question, "round");
  renderStats();
}

function updateQuestionHistory(questionId, answer) {
  const previous = state.history[questionId] || { attempts: 0, correct: 0, wrong: 0, everWrong: false };
  previous.attempts += 1;
  if (answer.isCorrect) previous.correct += 1;
  if (!answer.isCorrect && !answer.isSpecial) {
    previous.wrong += 1;
    previous.everWrong = true;
  }
  previous.lastSelected = answer.selected;
  previous.lastAnsweredAt = answer.answeredAt;
  state.history[questionId] = previous;
}

function nextQuestion() {
  if (state.quizMode === "round" && state.activeRound && !els.quizView.classList.contains("hidden")) {
    if (state.activeRound.currentIndex < state.activeRound.questionIds.length - 1) {
      state.activeRound.currentIndex += 1;
      saveActiveRound(state.activeRound);
      renderQuestion(getCurrentRoundQuestion(), "round");
    }
    return;
  }

  if (state.studyIndex < state.studyQuestions.length - 1) {
    state.studyIndex += 1;
    renderQuestion(getCurrentStudyQuestion(), "study");
  }
}

function finishRound() {
  if (!state.activeRound) return;
  state.finishedRound = {
    ...state.activeRound,
    finishedAt: new Date().toISOString(),
  };
  showSummary();
}

function saveFinishedRound() {
  if (!state.finishedRound) return;
  const stats = summarizeRound(state.finishedRound);
  state.rounds.unshift({
    id: state.finishedRound.id,
    label: state.finishedRound.label,
    startedAt: state.finishedRound.startedAt,
    finishedAt: state.finishedRound.finishedAt,
    total: stats.total,
    answered: stats.answered,
    correct: stats.correct,
    wrong: stats.wrong,
    rate: stats.rate,
  });
  state.rounds = state.rounds.slice(0, 50);
  saveRounds(state.rounds);
  clearActiveRoundState();
  showConfig();
}

function discardFinishedRound() {
  clearActiveRoundState();
  showConfig();
}

function clearActiveRoundState() {
  state.activeRound = null;
  state.finishedRound = null;
  saveActiveRound(null);
}

function renderSummary() {
  const stats = summarizeRound(state.finishedRound);
  els.roundSummary.innerHTML = `
    <div><strong>${stats.total}</strong><span>Preguntas</span></div>
    <div><strong>${stats.answered}</strong><span>Respondidas</span></div>
    <div><strong>${stats.correct}</strong><span>Aciertos</span></div>
    <div><strong>${stats.wrong}</strong><span>Fallos</span></div>
    <div><strong>${stats.rate}%</strong><span>Tasa</span></div>
  `;
  setRatioBar(els.summaryRatioBar, stats.correct, stats.wrong);
}

function renderRoundHeader() {
  if (!state.activeRound || els.roundMiniStats.classList.contains("hidden")) return;
  const stats = summarizeRound(state.activeRound);
  els.roundMiniStats.textContent = `${stats.answered}/${stats.total} resp. · ${stats.correct} bien · ${stats.wrong} mal · ${stats.rate}%`;
  setRatioBar(els.roundRatioBar, stats.correct, stats.wrong);
}

function summarizeRound(round) {
  if (!round) return { total: 0, answered: 0, correct: 0, wrong: 0, rate: 0 };
  const answers = Object.values(round.answers || {});
  const answered = answers.length;
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const wrong = answers.filter((answer) => !answer.isCorrect && !answer.isSpecial).length;
  const rate = answered ? Math.round((correct / answered) * 100) : 0;
  return { total: round.questionIds.length, answered, correct, wrong, rate };
}

function renderStats() {
  const stats = summarizeHistory(state.questions);
  els.statAnswered.textContent = stats.answeredQuestions;
  els.statAttempts.textContent = stats.attempts;
  els.statCorrect.textContent = stats.correct;
  els.statWrong.textContent = stats.wrong;
  els.statRate.textContent = `${stats.rate}%`;
  setRatioBar(els.ratioBar, stats.correct, stats.wrong);
  els.bankProgress.innerHTML = renderBankProgress();
}

function summarizeHistory(questions) {
  let answeredQuestions = 0;
  let attempts = 0;
  let correct = 0;
  let wrong = 0;
  for (const question of questions) {
    const item = state.history[question.id];
    if (!item?.attempts) continue;
    answeredQuestions += 1;
    attempts += item.attempts;
    correct += item.correct || 0;
    wrong += item.wrong || 0;
  }
  const rate = attempts ? Math.round((correct / attempts) * 100) : 0;
  return { answeredQuestions, attempts, correct, wrong, rate };
}

function renderBankProgress() {
  const banks = Array.from(new Map(state.questions.map((question) => [question.bank, question.bankTitle])).entries());
  return banks.map(([bank, label]) => {
    const questions = state.questions.filter((question) => question.bank === bank);
    const stats = summarizeHistory(questions);
    return `
      <div class="bank-progress-row">
        <div>
          <strong>${label}</strong>
          <span>${stats.answeredQuestions}/${questions.length} con histórico · ${stats.correct} bien · ${stats.wrong} mal</span>
        </div>
        <div class="ratio-bar compact"><span class="ratio-ok" style="width:${stats.rate}%"></span><span class="ratio-bad" style="width:${100 - stats.rate}%"></span></div>
      </div>
    `;
  }).join("");
}

function renderQuestionMap() {
  const scoped = getBankScopeQuestions();
  els.questionMap.innerHTML = scoped.map((question) => {
    const item = state.history[question.id];
    const classes = ["question-dot"];
    let title = `Pregunta ${question.number}: sin histórico`;
    if (item?.attempts) {
      const wrongRate = item.wrong / item.attempts;
      if (wrongRate > 0.5) classes.push("bad");
      else if (item.wrong > 0) classes.push("mixed");
      else classes.push("good");
      title = `Pregunta ${question.number}: ${item.correct || 0} bien, ${item.wrong || 0} mal, ${item.attempts} intentos`;
    }
    return `<span class="${classes.join(" ")}" title="${title}">${question.number}</span>`;
  }).join("");
}

function renderRoundHistory() {
  if (!state.rounds.length) {
    els.roundHistory.innerHTML = `<p class="empty-text">Todavía no hay rondas guardadas.</p>`;
    return;
  }
  els.roundHistory.innerHTML = state.rounds.map((round) => `
    <div class="round-row">
      <div>
        <strong>${round.label}</strong>
        <span>${formatDate(round.finishedAt)} · ${round.answered}/${round.total} respondidas</span>
      </div>
      <div><strong>${round.rate}%</strong><span>${round.correct} bien · ${round.wrong} mal</span></div>
    </div>
  `).join("");
}

function handleResetHistory() {
  if (!state.resetArmed) {
    state.resetArmed = true;
    els.resetStats.textContent = "Confirmar borrado";
    els.resetStats.classList.add("danger");
    window.setTimeout(() => {
      state.resetArmed = false;
      els.resetStats.textContent = "Borrar histórico";
      els.resetStats.classList.remove("danger");
    }, 5000);
    return;
  }
  clearAllStudyData();
  state.history = {};
  state.rounds = [];
  state.activeRound = null;
  state.finishedRound = null;
  state.resetArmed = false;
  els.resetStats.textContent = "Borrar histórico";
  els.resetStats.classList.remove("danger");
  applyFilters();
  renderConfig();
}

function setRatioBar(bar, correct, wrong) {
  const total = correct + wrong;
  const okWidth = total ? Math.round((correct / total) * 100) : 0;
  const badWidth = total ? 100 - okWidth : 0;
  bar.querySelector(".ratio-ok").style.width = `${okWidth}%`;
  bar.querySelector(".ratio-bad").style.width = `${badWidth}%`;
}

function getWrongScore(question) {
  const item = state.history[question.id];
  if (!item?.attempts) return 0;
  return (item.wrong / item.attempts) * 1000 + item.wrong;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function showFeedback(text, tone) {
  els.answerFeedback.textContent = text;
  els.answerFeedback.className = `feedback ${tone || ""}`.trim();
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("service-worker.js");
}
