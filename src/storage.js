const LEGACY_PROGRESS_KEY = "ope-trainer-progress-v1";
const HISTORY_KEY = "ope-trainer-history-v2";
const ROUNDS_KEY = "ope-trainer-rounds-v2";
const ACTIVE_ROUND_KEY = "ope-trainer-active-round-v2";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLegacyProgress() {
  return readJson(LEGACY_PROGRESS_KEY, {});
}

export function loadHistory() {
  return readJson(HISTORY_KEY, {});
}

export function saveHistory(history) {
  writeJson(HISTORY_KEY, history);
}

export function loadRounds() {
  return readJson(ROUNDS_KEY, []);
}

export function saveRounds(rounds) {
  writeJson(ROUNDS_KEY, rounds);
}

export function loadActiveRound() {
  return readJson(ACTIVE_ROUND_KEY, null);
}

export function saveActiveRound(round) {
  if (!round) {
    localStorage.removeItem(ACTIVE_ROUND_KEY);
    return;
  }
  writeJson(ACTIVE_ROUND_KEY, round);
}

export function clearAllStudyData() {
  localStorage.removeItem(LEGACY_PROGRESS_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(ROUNDS_KEY);
  localStorage.removeItem(ACTIVE_ROUND_KEY);
}
