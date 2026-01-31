import React, { useState, useEffect, useRef } from "react";

import "./TodoBox.scss";


import { getProjectActivityLogs, getProjectTodos, createProjectTodo, updateProjectTodo } from "../../services/projects";

// projectId props를 받아야 해당 프로젝트의 투두를 불러올 수 있습니다.
function TodoBox({ showFeed = true, projectId }) {
  // 초기 상태는 비워둠 (API로 채움)
  const [projects, setProjects] = useState([]);

  const [projectFeeds, setProjectFeeds] = useState([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);

  const [isTodoExpanded, setIsTodoExpanded] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const inputRef = useRef(null);

  // ✅ 1. 투두 리스트 불러오기 (Read)
  useEffect(() => {
    if (!projectId) return;

    const fetchTodos = async () => {
      try {
        const response = await getProjectTodos(projectId);
        // 백엔드 응답 형식 확인: 배열이 직접 오거나 { data: { items: [...] } } 형식
        let todosArray = [];
        if (Array.isArray(response)) {
          // 배열이 직접 오는 경우
          todosArray = response;
        } else if (response.data?.items) {
          // { data: { items: [...] } } 형식
          todosArray = response.data.items;
        } else if (response.data && Array.isArray(response.data)) {
          // { data: [...] } 형식
          todosArray = response.data;
        }

        // [{ todo_id, title, status, ... }] 형태를 UI 형식으로 변환
        const fetchedTodos = todosArray.map(todo => ({
          id: todo.todo_id,
          text: todo.title,
          checked: todo.status === 'COMPLETED' || todo.is_completed === true
        }));

        // 화면 구성을 위해 projects 배열 형태로 설정
        setProjects([
          {
            id: projectId,
            todos: fetchedTodos
          }
        ]);
      } catch (error) {
        console.error("투두 불러오기 실패:", error);
        // 에러 발생 시 빈 배열로 설정
        setProjects([]);
      }
    };

    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);


  // 활동 로그 다시 불러오기 함수
  const refreshActivityLogs = async () => {
    if (!projectId || !showFeed) return;

    try {
      const response = await getProjectActivityLogs(projectId, 5, 0);

      // API 응답을 UI 형식에 맞게 변환
      const feeds = response.activity_logs?.map((log) => ({
        id: log.todo_id,
        text: log.title,
        timestamp: formatRelativeTime(log.completed_at),
        avatar: log.completedByUser?.avatar,
        username: log.completedByUser?.username || "익명",
      })) || [];

      setProjectFeeds(feeds);
    } catch (error) {
      // 에러는 조용히 처리 (활동 로그가 없거나 엔드포인트 미구현)
      if (error.code !== 'RESOURCE_NOT_FOUND') {
        console.error("활동 로그 불러오기 실패:", error);
      }
    }
  };

  // ✅ 2. 투두 체크/해제 (Update)
  const toggleTodo = async (projId, todoId, currentStatus) => {
    try {
      // 1. 백엔드에 상태 업데이트 요청
      const newStatus = !currentStatus; // true/false 반전
      await updateProjectTodo(projId, todoId, {
        status: newStatus ? "COMPLETED" : "PENDING"
      });

      // 2. Todo 목록 다시 불러오기 (최신 상태 반영)
      const response = await getProjectTodos(projId);

      // 백엔드 응답 형식 확인
      let todosArray = [];
      if (Array.isArray(response)) {
        todosArray = response;
      } else if (response.data?.items) {
        todosArray = response.data.items;
      } else if (response.data && Array.isArray(response.data)) {
        todosArray = response.data;
      }

      // UI 형식으로 변환
      const fetchedTodos = todosArray.map(todo => ({
        id: todo.todo_id,
        text: todo.title,
        checked: todo.status === 'COMPLETED' || todo.is_completed === true
      }));

      // 완료된 투두를 맨 아래로 정렬
      const sortedTodos = fetchedTodos.sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1;
      });

      // 상태 업데이트
      setProjects([
        {
          id: projId,
          todos: sortedTodos
        }
      ]);

      // 3. 완료된 경우 활동 로그도 새로고침
      if (newStatus) {
        await refreshActivityLogs();
      }

    } catch (error) {
      console.error("투두 상태 업데이트 실패:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const totalIncompleteTodos = projects.reduce(
    (total, project) => total + project.todos.filter((todo) => !todo.checked).length,
    0
  );

  // 새 투두 추가 (API 호출)
  const handleAddTodo = async () => {
    if (!newTodoText.trim() || !projectId) return;

    setIsCreatingTodo(true);
    try {
      await createProjectTodo(projectId, newTodoText.trim());

      // Todo 생성 성공 후 목록 다시 불러오기
      const response = await getProjectTodos(projectId);

      // 백엔드 응답 형식 확인: 배열이 직접 오거나 { data: { items: [...] } } 형식
      let todosArray = [];
      if (Array.isArray(response)) {
        todosArray = response;
      } else if (response.data?.items) {
        todosArray = response.data.items;
      } else if (response.data && Array.isArray(response.data)) {
        todosArray = response.data;
      }

      // [{ todo_id, title, status, ... }] 형태를 UI 형식으로 변환
      const fetchedTodos = todosArray.map(todo => ({
        id: todo.todo_id,
        text: todo.title,
        checked: todo.status === 'COMPLETED' || todo.is_completed === true
      }));

      // 화면 구성을 위해 projects 배열 형태로 설정
      setProjects([
        {
          id: projectId,
          todos: fetchedTodos
        }
      ]);

      setNewTodoText("");
      setIsAddingTodo(false);
    } catch (error) {
      // 에러 메시지 표시
      if (error.code === 'VALIDATION_ERROR') {
        const errorMsg = error.errors && error.errors.length > 0
          ? error.errors.map(e => e.message).join('\n')
          : error.message || "내용을 입력해주세요.";
        alert(errorMsg);
      } else if (error.code === 'NOT_PROJECT_MEMBER') {
        alert("프로젝트 멤버만 Todo를 추가할 수 있습니다.");
      } else if (error.code === 'UNAUTHORIZED') {
        alert("인증이 필요합니다. 다시 로그인해주세요.");
      } else {
        alert(error.message || "Todo 추가에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsCreatingTodo(false);
    }
  };

  // 엔터 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  // 플러스 버튼 클릭
  const handlePlusClick = () => {
    setIsTodoExpanded(true);
    setIsAddingTodo(true);
  };

  // 입력창 포커스
  useEffect(() => {
    if (isAddingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTodo]);

  // 날짜를 상대 시간으로 변환하는 함수
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return "방금 전";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}주일 전`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}개월 전`;
    } else {
      return `${diffInYears}년 전`;
    }
  };

  // ✅ 3. 활동 로그 불러오기
  useEffect(() => {
    if (!projectId || !showFeed) return;

    const fetchActivityLogs = async () => {
      setIsLoadingFeeds(true);
      try {
        const response = await getProjectActivityLogs(projectId, 5, 0);

        // API 응답을 UI 형식에 맞게 변환
        const feeds = response.activity_logs?.map((log) => ({
          id: log.todo_id,
          text: log.title,
          timestamp: formatRelativeTime(log.completed_at),
          avatar: log.completedByUser?.avatar,
          username: log.completedByUser?.username || "익명",
        })) || [];

        setProjectFeeds(feeds);
      } catch (error) {
        // 404 에러는 조용히 처리 (활동 로그가 없거나 엔드포인트 미구현)
        if (error.code !== 'RESOURCE_NOT_FOUND') {
          console.error("활동 로그 불러오기 실패:", error);
        }
        setProjectFeeds([]);
      } finally {
        setIsLoadingFeeds(false);
      }
    };

    fetchActivityLogs();
  }, [projectId, showFeed]);

  return (
    <div className="todo-box-container">
      {/* 할 일 요약 섹션 */}
      <div className="todo-summary">
        <div className="todo-summary-content">
          <span className="todo-summary-text" onClick={() => setIsTodoExpanded(!isTodoExpanded)}>
            {totalIncompleteTodos === 0 ? (
              "할 일을 추가해보세요."
            ) : (
              <>오늘 총 <span className="todo-count-highlight">{totalIncompleteTodos}건</span>의 할 일이 있어요.</>
            )}
          </span>
          <button className="todo-add-btn" onClick={handlePlusClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="#F76241"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 할 일 펼쳐진 상태 */}
      {isTodoExpanded && (
        <div className="todo-expanded-container">
          <div className="project-todo-box">
            {/* 투두 입력 창 - projects와 상관없이 항상 표시 */}
            {isAddingTodo && (
              <div className="todo-project-section">
                <div className="todo-item todo-input-item">
                  <div className="todo-content">
                    <input
                      ref={inputRef}
                      type="text"
                      className="todo-input"
                      placeholder={isCreatingTodo ? "추가 중..." : "할 일을 입력하세요..."}
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      maxLength={25}
                      disabled={isCreatingTodo}
                    />
                  </div>
                  <div className="todo-checkbox-container">
                    <div className="checkbox-label">
                      <div className="custom-checkbox"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {projects.length > 0 ? projects.map((project) => (
              <div key={project.id} className="todo-project-section">
                <div className="project-todos-list">
                  {project.todos.length > 0 ? project.todos.map((todo) => (
                    <div key={todo.id} className={`todo-item ${todo.checked ? "completed" : ""}`}>
                      <div className="todo-content">
                        <span className="todo-text">{todo.text}</span>
                      </div>

                      <div className="todo-checkbox-container">
                        <input
                          type="checkbox"
                          id={`project-${project.id}-todo-${todo.id}`}
                          checked={todo.checked}
                          onChange={() => toggleTodo(project.id, todo.id, todo.checked)}
                          className="todo-checkbox"
                        />
                        <label
                          htmlFor={`project-${project.id}-todo-${todo.id}`}
                          className="checkbox-label"
                        >
                          <div className="custom-checkbox">
                            {todo.checked && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '10px', color: '#999' }}>등록된 할 일이 없습니다.</div>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                불러올 프로젝트가 없거나 로딩 중입니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 팀원 활동 로그 섹션 */}
      {showFeed && (
        <div className="project-feed-section">
          <div className="project-feed-header">
            <h3>팀원 활동 로그</h3>
            <p>팀원들이 완료한 투두리스트를 살펴보세요.</p>
          </div>

          <div className="project-feed-list">
            {isLoadingFeeds ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                로딩 중...
              </div>
            ) : projectFeeds.length > 0 ? (
              projectFeeds.map((feed) => (
                <div key={feed.id} className="feed-item">
                  <div className="feed-avatar">
                    {feed.avatar ? (
                      <img
                        src={feed.avatar}
                        alt={feed.username}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="18" fill="#EBEBEB" />
                        <path
                          d="M18 9C21.3 9 24 11.7 24 15C24 18.3 21.3 21 18 21C14.7 21 12 18.3 12 15C12 11.7 14.7 9 18 9ZM18 22.5C23.25 22.5 27.5 26.75 27.5 32H8.5C8.5 26.75 12.75 22.5 18 22.5Z"
                          fill="#999"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="feed-content">
                    <span className="feed-text">{feed.text}</span>
                    <span className="feed-timestamp">{feed.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                아직 완료된 할 일이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoBox;