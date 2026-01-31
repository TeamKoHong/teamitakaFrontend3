import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.scss';


function OnboardingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000); // 3초 후 이동

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="onboarding-page-container">
            <img src={require('../../assets/icons/Teamitaka.png')} alt="onboarding-page-logo" />
        </div>
    );
}

export default OnboardingPage;