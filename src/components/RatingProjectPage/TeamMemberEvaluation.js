import React from 'react';
import styles from './TeamMemberEvaluation.module.scss';

export default function TeamMemberEvaluation({ question, answers = [], editable = false, inputValues = [], onInputChange }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>팀원 평가지</div>
      <div className={styles.question}>{question}</div>
      {editable
        ? inputValues.map((value, i) => (
            <input
              key={i}
              className={styles.answer}
              type="text"
              value={value}
              placeholder="구체적인 역할을 입력하세요."
              onChange={e => onInputChange(i, e.target.value)}
            />
          ))
        : answers.map((ans, i) => (
            <div className={styles.answer} key={i}>{ans}</div>
          ))}
      <div className={styles.more}>상세 내용 더보기</div>
    </div>
  );
} 