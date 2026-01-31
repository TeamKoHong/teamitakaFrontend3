import { apiFetch } from './api';

export const getSummary = async () => {
    const res = await apiFetch('/api/dashboard/summary');
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const getMyProjects = async ({ status = 'ongoing', limit = 5, offset = 0 } = {}) => {
    const url = `/api/projects/mine?status=${encodeURIComponent(status)}&limit=${limit}&offset=${offset}`;
    const res = await apiFetch(url);
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const getTodos = async ({ status = 'open', limit = 5, offset = 0 } = {}) => {
    const url = `/api/todos?status=${encodeURIComponent(status)}&limit=${limit}&offset=${offset}`;
    const res = await apiFetch(url);
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const getNotifications = async ({ unreadOnly = false, limit = 20, offset = 0 } = {}) => {
    const url = `/api/notifications?unreadOnly=${unreadOnly ? 'true' : 'false'}&limit=${limit}&offset=${offset}`;
    const res = await apiFetch(url);
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const getNotificationUnreadCount = async () => {
    const res = await apiFetch('/api/notifications/unread-count');
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const markAllNotificationsRead = async () => {
    const res = await apiFetch('/api/notifications/read-all', {
        method: 'PUT',
    });
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const markNotificationRead = async (notificationId) => {
    const res = await apiFetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
    });
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const deleteNotification = async (notificationId) => {
    const res = await apiFetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

export const getUpcomingSchedules = async ({ days = 7, limit = 5, offset = 0 } = {}) => {
    const url = `/api/schedules/upcoming?days=${days}&limit=${limit}&offset=${offset}`;
    const res = await apiFetch(url);
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};
