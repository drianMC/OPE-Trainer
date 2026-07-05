const KEY = "ope-trainer-progress-v1";

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function clearProgress() {
  localStorage.removeItem(KEY);
}
