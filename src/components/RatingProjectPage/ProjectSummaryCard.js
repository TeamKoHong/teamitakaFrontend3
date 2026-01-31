import styles from './ProjectSummaryCard.module.scss';

export default function ProjectSummaryCard({ good, improve }) {
  return (
    <div className={styles.summaryRow}>
      <div className={styles.goodCard}>
        <div className={styles.title}>이런 점이 좋아요👍</div>
        <ul>
          {good.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className={styles.improveCard}>
        <div className={styles.title}>이런 점은 개선이 필요해요🚨</div>
        <ul>
          {improve.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
} 