export interface Question {
    id: number;
    text: string;
    choices: [string, string]; // [예, 아니오]
    axis: 'energy' | 'thinking' | 'social' | 'response';
    direction: 'active' | 'stable' | 'creative' | 'analytical' | 'positive' | 'coordinating' | 'adaptive' | 'sensory';
    isAnchor?: boolean;
}

export const questions: Question[] = [
    // 에너지 축 (활동 vs 안정)
    {
        id: 1,
        text: "나는 가만히 있는 것보다 새로운 활동이나 이벤트에 참여하는 게 더 즐겁다.",
        choices: ["예", "아니오"],
        axis: "energy",
        direction: "active",
        isAnchor: true
    },
    {
        id: 2,
        text: "계획보다는 즉흥적으로 움직일 때 에너지가 난다.",
        choices: ["예", "아니오"],
        axis: "energy",
        direction: "active"
    },
    {
        id: 3,
        text: "집에서 쉬는 것보다 밖에서 사람들을 만나야 충전되는 느낌이 든다.",
        choices: ["예", "아니오"],
        axis: "energy",
        direction: "active"
    },
    {
        id: 4,
        text: "안정된 루틴을 유지하는 게 가장 편하다.",
        choices: ["예", "아니오"],
        axis: "energy",
        direction: "stable"
    },

    // 사고 축 (창의·실험 vs 분석·완벽)
    {
        id: 5,
        text: "틀에 얽매이지 않고 새로운 방법을 찾는 걸 좋아한다.",
        choices: ["예", "아니오"],
        axis: "thinking",
        direction: "creative",
        isAnchor: true
    },
    {
        id: 6,
        text: "실패하더라도 시도해보는 게 중요하다고 생각한다.",
        choices: ["예", "아니오"],
        axis: "thinking",
        direction: "creative"
    },
    {
        id: 7,
        text: "세부적인 오류나 디테일을 그냥 넘어가지 못하는 편이다.",
        choices: ["예", "아니오"],
        axis: "thinking",
        direction: "analytical"
    },
    {
        id: 8,
        text: "문제를 분석해서 원인을 밝혀내는 과정이 즐겁다.",
        choices: ["예", "아니오"],
        axis: "thinking",
        direction: "analytical"
    },

    // 대인 축 (긍정·융합 vs 조율·통찰)
    {
        id: 9,
        text: "사람들과 있을 때 분위기를 긍정적으로 바꾸는 편이다.",
        choices: ["예", "아니오"],
        axis: "social",
        direction: "positive",
        isAnchor: true
    },
    {
        id: 10,
        text: "다른 사람들의 아이디어를 연결해서 새로운 가능성을 발견하는 게 재미있다.",
        choices: ["예", "아니오"],
        axis: "social",
        direction: "positive"
    },
    {
        id: 11,
        text: "갈등이 생기면 중재하고 조율하는 역할을 자주 맡는다.",
        choices: ["예", "아니오"],
        axis: "social",
        direction: "coordinating"
    },
    {
        id: 12,
        text: "겉으로 보이는 말보다는 그 사람의 숨은 의도를 읽으려 한다.",
        choices: ["예", "아니오"],
        axis: "social",
        direction: "coordinating"
    },

    // 대응 축 (적응 vs 감각)
    {
        id: 13,
        text: "새로운 환경에 금방 적응하는 편이다.",
        choices: ["예", "아니오"],
        axis: "response",
        direction: "adaptive",
        isAnchor: true
    },
    {
        id: 14,
        text: "내가 지금 느끼는 감각(맛, 소리, 촉감 등)에 민감하게 반응하는 편이다.",
        choices: ["예", "아니오"],
        axis: "response",
        direction: "sensory"
    },
    {
        id: 15,
        text: "계획에 없는 변수가 생겨도 유연하게 대처하는 편이다.",
        choices: ["예", "아니오"],
        axis: "response",
        direction: "adaptive"
    }
];

// 새로운 4축 점수 시스템
export const SCORING_SYSTEM = {
    energy: {
        active: { 1: 2.5, 2: 2.0, 3: 1.5 },    // 총 6점
        stable: { 4: 6.0 }                       // 총 6점
    },
    thinking: {
        creative: { 5: 3.0, 6: 3.0 },           // 총 6점  
        analytical: { 7: 3.0, 8: 3.0 }          // 총 6점
    },
    social: {
        positive: { 9: 3.0, 10: 3.0 },          // 총 6점
        coordinating: { 11: 3.0, 12: 3.0 }      // 총 6점
    },
    response: {
        adaptive: { 13: 2.5, 15: 2.5 },         // 총 5점
        sensory: { 14: 5.0 }                     // 총 5점
    }
} as const;

// 12개 성격 유형 매핑 테이블
export const PERSONALITY_TYPES = {
    "active-creative-positive-adaptive": "실험티미",
    "active-creative-positive-sensory": "감각티미",
    "active-creative-coordinating-adaptive": "창의티미",
    "active-creative-coordinating-sensory": "융합티미",
    "active-analytical-positive-adaptive": "긍정티미",
    "active-analytical-positive-sensory": "활동티미",
    "active-analytical-coordinating-adaptive": "적응티미",
    "active-analytical-coordinating-sensory": "조율티미",
    "stable-creative-positive-adaptive": "융합티미",
    "stable-creative-positive-sensory": "창의티미",
    "stable-creative-coordinating-adaptive": "통찰티미",
    "stable-creative-coordinating-sensory": "안정티미",
    "stable-analytical-positive-adaptive": "안정티미",
    "stable-analytical-positive-sensory": "분석티미",
    "stable-analytical-coordinating-adaptive": "완벽티미",
    "stable-analytical-coordinating-sensory": "분석티미"
} as const;
