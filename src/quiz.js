export function isSpecialStatus(question) {
  return question.status === "test_error" || question.status === "multiple_possible";
}

export function isCorrect(question, selected) {
  if (!selected || !question.correct.length) return false;
  return question.correct.includes(selected);
}

export function summarizeProgress(questions, progress) {
  let answered = 0;
  let correct = 0;
  let wrong = 0;

  for (const question of questions) {
    const entry = progress[question.id];
    if (!entry) continue;
    answered += 1;
    if (entry.isCorrect) correct += 1;
    if (!entry.isCorrect && !isSpecialStatus(question)) wrong += 1;
  }

  const pending = questions.length - answered;
  const rate = answered ? Math.round((correct / answered) * 100) : 0;
  return { answered, pending, correct, wrong, rate, total: questions.length };
}
