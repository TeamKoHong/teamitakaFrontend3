import { SCORING_SYSTEM, PERSONALITY_TYPES, questions } from './questions';

export type Answer = boolean; // true = 예, false = 아니오
export type Answers = Answer[];
export type PersonalityType = string; // 실험티미, 감각티미 등

interface AxisScores {
    energy: { active: number; stable: number };
    thinking: { creative: number; analytical: number };
    social: { positive: number; coordinating: number };
    response: { adaptive: number; sensory: number };
}

/**
 * 사용자의 답변을 기반으로 점수를 계산합니다.
 * @param answers 15개 질문에 대한 답변 배열 (true=예, false=아니오)
 * @returns 4축별 점수
 */
export function calculateScores(answers: Answers): AxisScores {
    const scores: AxisScores = {
        energy: { active: 0, stable: 0 },
        thinking: { creative: 0, analytical: 0 },
        social: { positive: 0, coordinating: 0 },
        response: { adaptive: 0, sensory: 0 }
    };

    answers.forEach((answer, index) => {
        if (answer === true) { // '예' 답변일 때만 점수 부여
            const questionId = index + 1;
            const question = questions.find(q => q.id === questionId);

            if (question) {
                const axis = question.axis;
                const direction = question.direction;

                // 타입 안전한 점수 부여
                const axisScoring = SCORING_SYSTEM[axis];
                if (axisScoring && direction in axisScoring) {
                    const directionScoring = axisScoring[direction as keyof typeof axisScoring];
                    if (directionScoring && questionId in directionScoring) {
                        const scoreValue = (directionScoring as any)[questionId] || 0;
                        (scores[axis] as any)[direction] += scoreValue;
                    }
                }
            }
        }
    });

    return scores;
}

/**
 * 최종 성격 유형을 결정합니다.
 * @param scores 4축별 점수
 * @param answers 원본 답변 배열 (동점 처리용)
 * @returns 12개 성격 유형 중 하나
 */
export function determinePersonality(scores: AxisScores, answers: Answers): PersonalityType {
    const results: Record<string, string> = {};

    // 각 축별로 우세한 방향 결정
    Object.entries(scores).forEach(([axis, axisScores]) => {
        const [option1, option2] = Object.keys(axisScores);
        const score1 = axisScores[option1 as keyof typeof axisScores];
        const score2 = axisScores[option2 as keyof typeof axisScores];

        if (score1 > score2) {
            results[axis] = option1;
        } else if (score2 > score1) {
            results[axis] = option2;
        } else {
            // 동점 처리 - 앵커 질문 기준
            const anchorQuestions: Record<string, number> = {
                energy: 0,    // Q1 (index 0)
                thinking: 4,  // Q5 (index 4) 
                social: 8,    // Q9 (index 8)
                response: 12  // Q13 (index 12)
            };
            const anchorAnswer = answers[anchorQuestions[axis]];
            results[axis] = anchorAnswer === true ? option1 : option2;
        }
    });

    const typeKey = `${results.energy}-${results.thinking}-${results.social}-${results.response}`;
    return PERSONALITY_TYPES[typeKey as keyof typeof PERSONALITY_TYPES] || "알 수 없는 유형";
}

/**
 * 사용자의 답변을 기반으로 최종 성격 유형을 계산합니다.
 * @param answers 15개 질문에 대한 답변 배열 (true=예, false=아니오)
 * @returns 12개 성격 유형 중 하나
 */
export function calculateMBTIType(answers: Answers): PersonalityType {

    if (!Array.isArray(answers)) {
        throw new Error('답변은 배열이어야 합니다.');
    }

    if (answers.length !== 15) {

        throw new Error(`15개의 답변이 모두 필요합니다. 현재: ${answers.length}개`);
    }

    const scores = calculateScores(answers);
    return determinePersonality(scores, answers);
}

/**
 * 답변 진행률을 계산합니다.
 * @param answers 현재까지의 답변 배열
 * @returns 0-100 사이의 진행률
 */
export function calculateProgress(answers: Answers): number {
    return Math.round((answers.length / 15) * 100);
}

/**
 * 특정 질문 번호에 대한 점수 정보를 반환합니다.
 * @param questionId 질문 번호 (1-15)
 * @returns 해당 질문의 점수 정보
 */
export function getQuestionScore(questionId: number) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;

    const axis = question.axis;
    const direction = question.direction;

    // 타입 안전한 점수 검색
    let score = 0;
    const axisScoring = SCORING_SYSTEM[axis];
    if (axisScoring && direction in axisScoring) {
        const directionScoring = axisScoring[direction as keyof typeof axisScoring];
        if (directionScoring && questionId in directionScoring) {
            score = (directionScoring as any)[questionId];
        }
    }

    return {
        axis,
        direction,
        score,
        isAnchor: question.isAnchor || false
    };
}

/**
 * 개발/테스트용: 답변 배열의 유효성을 검사합니다.
 */
export function validateAnswers(answers: Answers): boolean {
    return answers.length <= 15 && answers.every(answer => typeof answer === 'boolean');
}

/**
 * 디버깅용: 상세 점수 정보를 반환합니다.
 */
export function getDetailedResults(answers: Answers) {
    const scores = calculateScores(answers);
    const personality = determinePersonality(scores, answers);

    return {
        scores,
        personality,
        breakdown: answers.map((answer, index) => {
            const questionId = index + 1;
            const question = questions.find(q => q.id === questionId);
            const scoreInfo = getQuestionScore(questionId);

            return {
                questionId,
                question: question?.text,
                answer,
                scoreInfo,
                appliedScore: answer && scoreInfo ? scoreInfo.score : 0
            };
        })
    };
}
