import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import "./ProjectMemberPage.scss";
import defaultProfile from "../../assets/default_profile.png";

import NextArrow from "../../components/Common/UI/NextArrow";
import MemberTaskSlide from "../../components/ProjectMemberPage/MemberTaskSlide";
import { fetchProjectMembers } from "../../services/projects";

export default function ProjectMemberPage() {
  const { id: projectId } = useParams();
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMembers = useCallback(async () => {
    if (!projectId) {
      setError("프로젝트 ID가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔍 팀원 목록 조회 시작 - projectId:", projectId);
      const response = await fetchProjectMembers(projectId);
      console.log("📦 API 응답 전체:", response);
      
      // API 응답 구조에 맞게 데이터 변환
      const membersData = response.data?.items || response.items || response.data || response;
      console.log("📋 추출된 membersData:", membersData);
      console.log("📋 membersData 타입:", typeof membersData, "isArray:", Array.isArray(membersData));
      
      if (!Array.isArray(membersData)) {
        console.error("❌ 배열이 아닌 데이터:", membersData);
        throw new Error("팀원 데이터 형식이 올바르지 않습니다.");
      }

      // 백엔드 응답을 프론트엔드 형식으로 변환
      const formattedMembers = membersData.map((member, index) => {
        console.log(`👤 멤버 ${index + 1}:`, member);
        
        // role에 따른 기본 역할명
        const defaultRole = member.role === 'LEADER' ? '조장' : '팀원';
        
        // task에서 역할 부분 제거하고 업무 내용만 추출
        let taskContent = "";
        let fullTask = member.task || "";
        
        if (fullTask && fullTask.includes(" - ")) {
          const parts = fullTask.split(" - ");
          taskContent = parts[1] || "";
        } else if (fullTask) {
          // ' - '가 없으면 전체를 업무로 간주
          taskContent = fullTask;
          fullTask = `${defaultRole} - ${fullTask}`;
        } else {
          // task가 없으면 기본 역할만 설정
          fullTask = defaultRole;
          taskContent = "";
        }
        
        // 업무 내용이 없으면 "업무 미입력"
        if (!taskContent.trim()) {
          taskContent = "업무 미입력";
        }
        
        return {
          id: member.user_id,
          name: member.User?.username || "알 수 없음",
          role: member.role || "MEMBER",
          avatar: member.User?.avatar || defaultProfile,
          email: member.User?.email || "",
          joined_at: member.joined_at,
          task: fullTask, // 전체 task 내용 (역할 - 업무)
          taskDisplay: taskContent, // 화면 표시용 (업무만)
        };
      });

      console.log("✅ 변환된 멤버 목록:", formattedMembers);
      setMembers(formattedMembers);
    } catch (err) {
      console.error("❌ 팀원 목록 조회 실패:", err);
      setError(err.message || "팀원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <div className="team-page">
      <DefaultHeader title="팀원 정보" showChat={false} />

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <p>팀원 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#e74c3c" }}>
          <p>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <p>팀원이 없습니다.</p>
        </div>
      ) : (
        <ul className="team-list">
          {members.map((m) => (
            <li
              key={m.id}
              className="team-list-item"
              onClick={() => setSelected(m)}
            >
              <div className="team-info">
                <img src={m.avatar} alt={`${m.name} 아바타`} className="avatar" />
                <div className="text">
                  <p className="name">{m.name}</p>
                  <p className="role">{m.taskDisplay}</p>
                </div>
              </div>
              <NextArrow className="chevron" />
            </li>
          ))}
        </ul>
      )}

      <MemberTaskSlide
        open={!!selected}
        onClose={() => {
          setSelected(null);
          // 슬라이드 닫힐 때 목록 새로고침
          if (projectId) {
            loadMembers();
          }
        }}
        member={selected}
        projectId={projectId}
      />
    </div>
  );
}
