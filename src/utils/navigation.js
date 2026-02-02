// Centralized navigation helpers for project-related routes

/**
 * Navigate to rating project page with optional project summary state
 * @param {Function} navigate - react-router navigate function
 * @param {{ id: number } & Record<string, any>} project - project object containing at least id
 */
export function navigateToRatingProject(navigate, project) {
  if (!project || !project.id) {
    throw new Error('navigateToRatingProject: invalid project');
  }
  navigate(`/project/${project.id}/rating-project`, {
    state: { projectSummary: project },
  });
}

/**
 * Navigate to rating project page by project id when summary is not available
 * @param {Function} navigate - react-router navigate function
 * @param {number|string} projectId - project id
 */
export function navigateToRatingProjectById(navigate, projectId) {
  if (!projectId && projectId !== 0) {
    throw new Error('navigateToRatingProjectById: invalid projectId');
  }
  navigate(`/project/${projectId}/rating-project`);
}

