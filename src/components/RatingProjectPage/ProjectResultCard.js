import styles from './ProjectResultCard.module.scss';
import linkIconPng from '../../assets/icons/link.png';

function displayText(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.host;
  } catch (e) {
    return url.replace(/^https?:\/\//, '');
  }
}

export default function ProjectResultCard({ resultLink }) {
  const hasLink = resultLink && String(resultLink).trim();

  return (
    <section className={styles.section} aria-labelledby="result-title">
      <h2 id="result-title" className={styles.sectionTitle}>프로젝트 결과물</h2>
      {hasLink ? (
        <a href={resultLink} className={styles.resultRow} target="_blank" rel="noopener noreferrer" aria-label="프로젝트 결과물 링크">
          <img src={linkIconPng} alt="링크 아이콘" className={styles.linkIcon} />
          <span className={styles.urlText}>{displayText(resultLink)}</span>
        </a>
      ) : (
        <p className={styles.emptyText}>등록된 결과물이 없습니다</p>
      )}
      <hr className={styles.dividerStrong} />
    </section>
  );
}