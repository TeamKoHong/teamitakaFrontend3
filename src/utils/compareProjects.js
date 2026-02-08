/**
 * Project List Comparison Utility
 * Verifies consistency between server data and UI display
 */

/**
 * Normalize date string to YYYY-MM-DD format
 * @param {string} s - Date string in various formats
 * @returns {string} - Normalized date
 */
function normalizeDate(s) {
  if (!s) return "";
  return s.slice(0, 10).replace(/\./g, "-").replace(/\//g, "-");
}

/**
 * Compare server project list with UI project list
 *
 * @param {Array} serverList - Raw projects from server
 * @param {Array} uiList - Projects displayed in UI
 * @param {Object} options - Comparison options
 * @param {string} options.key - ID field name (default: "project_id")
 * @param {Array} options.fields - Fields to compare
 * @returns {Object} - Comparison report
 */
export function compareProjectLists(serverList, uiList, {
  key = "project_id",
  fields = ["title", "status", "start_date", "end_date", "description"]
} = {}) {
  // Build maps for fast lookup
  const toMap = (arr) => {
    const m = new Map();
    arr.forEach(p => m.set(p[key], p));
    return m;
  };

  const sMap = toMap(serverList);
  const uMap = toMap(uiList);

  const serverIds = new Set(serverList.map(p => p[key]));
  const uiIds = new Set(uiList.map(p => p[key]));

  // Check for duplicate IDs in UI
  const duplicatesUI = uiList
    .map(p => p[key])
    .filter((id, i, a) => a.indexOf(id) !== i);

  // Find IDs in server but not in UI
  const missingInUI = [...serverIds].filter(id => !uiIds.has(id));

  // Find IDs in UI but not in server
  const extraInUI = [...uiIds].filter(id => !serverIds.has(id));

  // Check field mismatches for common IDs
  const fieldMismatches = [];
  for (const id of serverIds) {
    if (!uMap.has(id)) continue;

    const a = sMap.get(id);
    const b = uMap.get(id);
    const diff = {};

    fields.forEach(f => {
      // Normalize dates before comparing
      const va = (f.includes("date") || f.includes("Date") ? normalizeDate(a[f]) : a[f]) ?? "";
      const vb = (f.includes("date") || f.includes("Date") ? normalizeDate(b[f]) : b[f]) ?? "";

      if (va !== vb) {
        diff[f] = { server: va, ui: vb };
      }
    });

    if (Object.keys(diff).length) {
      fieldMismatches.push({ id, diff });
    }
  }

  return {
    counts: { server: serverList.length, ui: uiList.length },
    duplicatesUI,
    missingInUI,
    extraInUI,
    fieldMismatches,
  };
}

/**
 * Log comparison report to console
 *
 * @param {Object} report - Report from compareProjectLists
 * @param {string} label - Label for console group
 */
export function logComparisonReport(report, label = "Project Comparison") {
  if (process.env.NODE_ENV !== 'development') return;
  console.group(`🔍 ${label}`);

  // Always show counts
  console.table(report.counts);

  // Show warnings only if there are issues
  if (report.duplicatesUI.length) {

  }

  if (report.missingInUI.length) {

  }

  if (report.extraInUI.length) {

  }

  if (report.fieldMismatches.length) {

    report.fieldMismatches.forEach(({ id, diff }) => {
      console.group(`  ID: ${id}`);
      console.table(diff);
      console.groupEnd();
    });
  }

  if (
    !report.duplicatesUI.length &&
    !report.missingInUI.length &&
    !report.extraInUI.length &&
    !report.fieldMismatches.length
  ) {

  }

  console.groupEnd();
}
