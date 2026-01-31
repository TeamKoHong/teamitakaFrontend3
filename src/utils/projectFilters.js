/**
 * Project Filtering and Sorting Utilities
 * Single source of truth for project list derivation
 */

/**
 * Check if a project is completed
 * SINGLE SOURCE OF TRUTH for completion status
 *
 * @param {Object} project - Project object
 * @returns {boolean} - True if project is completed
 */
export function isCompleted(project) {
  // Use uppercase to match server convention
  return project.status === "COMPLETED" || project.status === "completed";
}

/**
 * Sort projects by end date descending (newest first)
 * SINGLE SOURCE OF TRUTH for completed project sorting
 *
 * @param {Object} a - First project
 * @param {Object} b - Second project
 * @returns {number} - Sort comparison result
 */
export function sortByLatest(a, b) {
  const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
  const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
  return dateB - dateA; // Descending (newest first)
}

/**
 * Sort projects by end date ascending (oldest first)
 *
 * @param {Object} a - First project
 * @param {Object} b - Second project
 * @returns {number} - Sort comparison result
 */
export function sortByOldest(a, b) {
  const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
  const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
  return dateA - dateB; // Ascending (oldest first)
}

/**
 * Derive completed projects from server data
 * This is the SINGLE PIPELINE for creating the UI list
 *
 * @param {Array} serverProjects - Raw projects from server
 * @param {Object} options - Options
 * @param {string} options.sortOrder - 'latest' (default) or 'oldest'
 * @returns {Array} - Filtered and sorted completed projects
 */
export function deriveCompletedProjects(serverProjects, { sortOrder = 'latest' } = {}) {
  if (!serverProjects || !Array.isArray(serverProjects)) {
    return [];
  }

  // Step 1: Filter completed projects only
  const completed = serverProjects.filter(isCompleted);

  // Step 2: Sort by end date
  const sorted = [...completed].sort(sortOrder === 'oldest' ? sortByOldest : sortByLatest);

  return sorted;
}

/**
 * Split completed projects by evaluation status
 * Used for UI display sections
 *
 * @param {Array} completedProjects - Already filtered and sorted completed projects
 * @returns {Object} - { pending, completed } projects
 */
export function splitByEvaluationStatus(completedProjects) {
  // COMPLETED 또는 NOT_REQUIRED 상태만 완료 섹션으로
  const completed = completedProjects.filter(
    p => p.evaluation_status === 'COMPLETED' || p.evaluation_status === 'NOT_REQUIRED'
  );

  // 나머지는 모두 pending 섹션으로 (undefined, null, 'PENDING' 포함)
  // 이렇게 하면 evaluation_status가 없는 프로젝트도 평가 대기로 표시됨
  const pending = completedProjects.filter(
    p => p.evaluation_status !== 'COMPLETED' && p.evaluation_status !== 'NOT_REQUIRED'
  );

  return { pending, completed };
}
