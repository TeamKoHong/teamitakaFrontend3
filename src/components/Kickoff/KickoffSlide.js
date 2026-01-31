import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './KickoffSlide.scss';
import DefaultHeader from '../Common/DefaultHeader';
import DateRangePickerSheet from '../ProjectRecruit/DateRangePicker/DateRangePickerSheet';
import TeamMemberInfoSlide from './TeamMemberInfoSlide';
import { createProjectFromRecruitment } from '../../services/recruitment';

export default function KickoffSlide({ open, onClose, selectedMembers, recruitmentId }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState(null);
  const [teamInfoOpen, setTeamInfoOpen] = useState(false);

  const isValidRange = useMemo(() => {
    if (!start || !end) return false;
    return new Date(start) <= new Date(end);
  }, [start, end]);

  const isReady = Boolean(title.trim()) && isValidRange;

  // Format dates for display
  const formattedDateRange = useMemo(() => {
    if (!start || !end) return '';
    const startFormatted = dayjs(start).format('YYYY.MM.DD');
    const endFormatted = dayjs(end).format('YYYY.MM.DD');
    return `${startFormatted} - ${endFormatted}`;
  }, [start, end]);

  const handleDateRangeSelect = (startDate, endDate) => {
    setStart(dayjs(startDate).format('YYYY-MM-DD'));
    setEnd(dayjs(endDate).format('YYYY-MM-DD'));
  };

  const handleNext = async () => {
    if (!isReady) return;
    
    if (!recruitmentId || !selectedMembers || selectedMembers.length === 0) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    setLoading(true);
    
    try {
      // API 요청 데이터 구성
      const requestData = {
        title,
        resolution: desc || '', // 설명 또는 다짐
        start_date: start,
        end_date: end,
        memberUserIds: selectedMembers.map(member => member.user_id)
      };

      console.log('✅ 프로젝트 생성 요청:', requestData);

      // 프로젝트 생성 API 호출 (KickoffSlide에서 직접 호출)
      const result = await createProjectFromRecruitment(recruitmentId, requestData);
      
      console.log('✅ 프로젝트 생성 성공:', result);
      
      // 프로젝트 ID 저장 (data.project_id 또는 result.project_id)
      const projectId = result.data?.project_id || result.project_id;
      console.log('📌 생성된 프로젝트 ID:', projectId);
      setCreatedProjectId(projectId);

      // 팀원 정보 입력 슬라이드 열기
      console.log('📌 팀원 정보 슬라이드 열기 시도');
      setTeamInfoOpen(true);
      console.log('📌 teamInfoOpen 상태 설정 완료');
      
    } catch (err) {
      console.error('❌ 프로젝트 생성 실패:', err);
      
      if (err.code === 'UNAUTHORIZED') {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else if (err.code === 'ALREADY_CONVERTED') {
        alert('이미 프로젝트로 전환된 모집글입니다.');
        onClose();
      } else {
        alert(err.message || '프로젝트 생성에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`kickoff-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`kickoff-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="프로젝트 킥오프" onBack={onClose} />
        
        <div className="kickoff-content">
        <div className="kickoff-title">프로젝트 킥오프</div>
          <div className="section">
            <div className="label">제목</div>
            <div className={`field ${title ? 'field--active' : ''}`}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 15))}
                placeholder="프로젝트 제목을 입력해주세요."
                maxLength={15}
              />
            </div>
          </div>

          {/* 프로젝트 진행 기간 */}
          <div className="section">
            <div className="label">프로젝트 진행 기간</div>
            <button
              type="button"
              className={`field date-picker-btn ${start && end ? 'field--active' : ''}`}
              onClick={() => {
                console.log('🔍 날짜 선택 버튼 클릭');
                setDatePickerOpen(true);
              }}
            >
              <span className="date-picker-text">
                {formattedDateRange || '프로젝트 진행 기간을 설정해주세요.'}
              </span>
            </button>
          </div>

          {/* 프로젝트 설명 또는 다짐 */}
          <div className="section">
            <div className="label">프로젝트 설명 또는 다짐</div>
            <div className={`field ${desc ? 'field--active' : ''}`}>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="협상의 기술 중간고사 팀플입니다."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="kickoff-footer">
          <button
            className={`kickoff-button ${isReady ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!isReady || loading}
          >
            {loading ? '프로젝트 생성 중...' : '다음'}
          </button>
        </div>
      </div>

      {/* 팀원 정보 입력 슬라이드 */}
      <TeamMemberInfoSlide
        open={teamInfoOpen}
        onClose={() => {
          setTeamInfoOpen(false);
          onClose();
        }}
        selectedMembers={selectedMembers}
        projectId={createdProjectId}
      />

      {/* Date Range Picker Bottom Sheet */}
      <DateRangePickerSheet
        open={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        onComplete={handleDateRangeSelect}
        initialStart={start ? new Date(start) : null}
        initialEnd={end ? new Date(end) : null}
        maxRangeWeeks={12}
        title="프로젝트 진행 기간을 선택해주세요."
      />
    </>
  );
}

