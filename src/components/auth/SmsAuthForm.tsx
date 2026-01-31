import React, { useEffect } from 'react';
import { useSmsAuth } from '../../hooks/useSmsAuth';
import { LuCheck, LuLoader, LuRefreshCw } from 'react-icons/lu';

interface SmsAuthFormProps {
    onVerificationSuccess?: () => void;
}

export const SmsAuthForm: React.FC<SmsAuthFormProps> = ({ onVerificationSuccess }) => {
    const {
        phone,
        code,
        step,
        timer,
        isLoading,
        error,
        handlePhoneChange,
        handleCodeChange,
        sendSms,
        verifySms,
        reset,
    } = useSmsAuth();

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (step === 'VERIFIED') {
            if (onVerificationSuccess) {
                onVerificationSuccess();
            }
        }
    }, [step, onVerificationSuccess]);

    if (step === 'VERIFIED') {
        return (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center space-x-2 text-green-600">
                    <LuCheck className="w-5 h-5" />
                    <span className="font-medium">인증이 완료되었습니다.</span>
                </div>
                <button
                    onClick={reset}
                    className="text-xs text-gray-400 underline hover:text-gray-600"
                >
                    다른 번호로 인증하기
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="space-y-4">
                {/* Phone Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 hidden">
                        휴대폰 번호
                    </label>
                    <div className="flex space-x-2">
                        <div className="relative flex-grow">
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                disabled={step === 'INPUT_CODE' || isLoading}
                                placeholder="휴대폰 번호 입력"
                                className={`w-full bg-[#F2F4F6] rounded-xl px-4 py-3.5 outline-none text-gray-900 placeholder-gray-400 ${error && step === 'INPUT_PHONE' ? 'ring-1 ring-red-400' : ''
                                    } disabled:text-gray-500`}
                            />
                        </div>
                        <button
                            onClick={sendSms}
                            disabled={isLoading || step === 'INPUT_CODE' || phone.length < 12}
                            className={`whitespace-nowrap px-4 py-3.5 rounded-xl font-medium text-sm transition-all
                                ${step === 'INPUT_CODE'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-500'}`}
                        >
                            {isLoading && step === 'INPUT_PHONE' ? (
                                <LuLoader className="w-4 h-4 animate-spin" />
                            ) : (
                                step === 'INPUT_CODE' ? '재전송' : '인증번호 받기'
                            )}
                        </button>
                    </div>
                </div>

                {/* Code Input (Visible only in INPUT_CODE step) */}
                {step === 'INPUT_CODE' && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                disabled={isLoading}
                                placeholder="인증번호 4자리"
                                maxLength={4}
                                className="w-full bg-[#F2F4F6] rounded-xl px-4 py-3.5 outline-none text-gray-900 placeholder-gray-400 text-center tracking-widest font-medium"
                            />

                            {/* Timer inside input */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-sm font-mono">
                                <span className={timer < 30 ? 'text-red-500' : 'text-indigo-600'}>
                                    {formatTimer(timer)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={verifySms}
                            disabled={isLoading || code.length !== 4}
                            className="w-full mt-3 py-3.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-500 flex items-center justify-center transition-all"
                        >
                            {isLoading ? (
                                <LuLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                '인증번호 확인'
                            )}
                        </button>

                        {/* Manual Resend Trigger when timer expires */}
                        {timer === 0 && !isLoading && (
                            <div className="mt-2 text-center">
                                <button
                                    onClick={sendSms}
                                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1 mx-auto"
                                >
                                    <LuRefreshCw className="w-3 h-3" />
                                    <span>인증번호 재전송</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-xs px-1">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

