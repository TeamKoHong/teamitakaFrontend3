import { apiFetch } from './api';

/**
 * Fetches notifications for a specific project
 * @param {string} projectId - Project UUID
 * @returns {Promise<Array>} List of notifications
 */
export async function fetchProjectNotifications(projectId) {
    try {
        const response = await apiFetch(`/api/projects/${projectId}/notifications`);

        if (!response.ok) {
            // 404 means no notifications found, return empty array
            if (response.status === 404) {
                return [];
            }
            const errorData = await response.json();
            throw new Error(errorData.error || '알림 조회에 실패했습니다.');
        }

        const result = await response.json();
        return result.data || result || [];
    } catch (error) {

        // Return empty array on error to prevent UI crash, but log error
        return [];
    }
}
