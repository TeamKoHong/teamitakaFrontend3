export function calculateProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const total = end - start;
  const left = end - today;
  const progress = Math.min(Math.max((1 - left / total) * 100, 0), 100); // 0~100% 보정

  return progress.toFixed(1);
}

export function calculateElapsedDays(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateRemainingDays(endDate) {
  const end = new Date(endDate);
  const today = new Date();

  // endDate를 자정으로 설정
  end.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays); // 음수 방지
}
