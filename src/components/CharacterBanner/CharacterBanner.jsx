import './CharacterBanner.css';
import bannerImage from '../../assets/character_banner/비회원 캐릭터 배너_테스트유도용.png';

export default function CharacterBanner() {
  return (
    <div className="character-banner">
      <img src={bannerImage} alt="캐릭터 배너" className="banner-image" />
    </div>
  );
}
