// 알람이 있을 때 뜨는 페이지
import { useNavigate } from 'react-router-dom';

export default function NotificationsList({
  items,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) {
  const nav = useNavigate();

  // 간단한 날짜 레이블 (오늘/어제/이전)
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);

  const sections = [
    { label: '오늘',     filter: d => d >= +today },
    { label: '어제',     filter: d => d >= +yesterday && d < +today },
    { label: '이전',     filter: d => d < +yesterday },
  ];

  // 읽지 않은 알림 개수 계산
  const unreadCount = items.filter(it => !it.is_read).length;

  const handleItemClick = (item) => {
    if (!item.is_read && onMarkAsRead) {
      onMarkAsRead(item.id);
    }
    // 알림 타입에 따라 해당 페이지로 이동할 수 있음
    // 예: if (item.type === 'application') nav(`/applications/${item.related_id}`);
  };

  const handleDelete = (e, itemId) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (onDelete) {
      onDelete(itemId);
    }
  };

  return (
    <div className="page notifications-page">
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <div className="title">알림</div>
        <div className="settings-text" onClick={() => nav('/notifications/settings')}>설정</div>
      </div>

      {/* 모두 읽음 버튼 */}
      {unreadCount > 0 && onMarkAllAsRead && (
        <div className="mark-all-read-container" style={{
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            className="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#007AFF',
              fontSize: 13,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            모두 읽음 ({unreadCount})
          </button>
        </div>
      )}

      <div className="notifications-list-container" style={{ padding: '8px 20px' }}>
        {sections.map(sec => {
          const rows = items.filter(it => sec.filter(+new Date(it.created_at || it.createdAt)));
          if (rows.length === 0) return null;
          return (
            <div key={sec.label} className="notification-date-group" style={{ marginBottom: 18 }}>
              <div className="notification-date" style={{ fontWeight:600, color:'#111', margin:'12px 0' }}>{sec.label}</div>
              {rows.map(it => (
                <div
                  key={it.id}
                  className={`notification-item ${it.is_read ? 'read' : 'unread'}`}
                  onClick={() => handleItemClick(it)}
                  style={{
                    padding:'12px 0',
                    borderBottom:'1px solid #eee',
                    backgroundColor: it.is_read ? 'transparent' : '#f8f9ff',
                    marginLeft: -20,
                    marginRight: -20,
                    paddingLeft: 20,
                    paddingRight: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div className="notification-content" style={{ flex: 1 }}>
                    <div className="notification-type" style={{ fontSize:12, color:'#999', marginBottom:4 }}>
                      {it.type || '알림'}
                      {!it.is_read && (
                        <span
                          className="unread-dot"
                          style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#007AFF',
                            marginLeft: 6,
                            verticalAlign: 'middle',
                          }}
                        />
                      )}
                    </div>
                    <div className="notification-title" style={{ fontSize:14, color:'#111' }}>
                      {it.title || it.message || '알림'}
                    </div>
                    {(it.body || it.message) && (
                      <div className="notification-body" style={{ fontSize:13, color:'#555', marginTop:4 }}>
                        {it.body || (it.title ? it.message : '')}
                      </div>
                    )}
                  </div>
                  {onDelete && (
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, it.id)}
                      aria-label="알림 삭제"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        fontSize: 18,
                        cursor: 'pointer',
                        padding: '0 8px',
                        marginLeft: 8,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
