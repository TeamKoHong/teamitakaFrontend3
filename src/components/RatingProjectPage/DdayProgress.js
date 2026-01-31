import CircularProgress from '../../components/Common/CircularProgress';
import styles from './DdayProgress.module.scss';

export default function DdayProgress({ dday }) {
  // dday가 객체 또는 숫자일 수 있으므로 방어적 처리
  const ddayValue = typeof dday === 'object' ? dday?.value : dday;
  const ddayPercent = typeof dday === 'object' ? dday?.percent : 0;

  // D-Day 텍스트 포맷팅
  // 양수: D-{n} (n일 남음), 음수: D+{n} (n일 지남), 0: D-Day
  const formatDday = (value) => {
    // NaN 또는 유효하지 않은 값 체크
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '완료';
    }
    if (value === 0) return 'D-Day';
    if (value > 0) return `D-${value}`;
    return `D+${Math.abs(value)}`;
  };

  return (
    <div className={styles.wrapper}>
      <CircularProgress percentage={Number(ddayPercent) || 0}>
        {formatDday(ddayValue ?? 0)}
      </CircularProgress>
    </div>
  );
} 