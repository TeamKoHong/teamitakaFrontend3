import styles from './ProjectInfoCard.module.scss';
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as ClockIcon } from '../../assets/icons/clock.svg';
import DdayProgress from './DdayProgress';
import bgImage from '../../images/bg.png';

export default function ProjectInfoCard({ name, period, meetingTime, dday }) {
  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className={styles.projectName}>{name}</div>
          <div className={styles.infoRow}>
            <span className={styles.iconText}>
              <CalendarIcon className={styles.icon} aria-hidden="true" /> {period}
            </span>
            {meetingTime && (
              <span className={styles.iconText}>
                <ClockIcon className={styles.icon} aria-hidden="true" /> {meetingTime}
              </span>
            )}
          </div>
        </div>
        <div className={styles.headerRight}>
          <DdayProgress dday={dday} />
        </div>
      </div>
    </div>
  );
} 