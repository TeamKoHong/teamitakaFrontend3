import React from "react";
import Header from "../components/Header";
import ProfileImage from "../components/ProfileImage";
import DefaultProfile from "../assets/profile_default.png"; // 기본 이미지 (감자)
import BasicInfo from "../components/BasicInfo";
import "./ProfileEdit.css";
import MajorInput from "../components/MajorInput";
import TeamExperience from "../components/TeamExperience";
import InterestKeywords from "../components/InterestKeywords";
import Withdrawal from "../components/Withdrawal";

export default function ProfileEdit() {
  return (
    <div className="page-frame">
      <Header />
      <ProfileImage src={DefaultProfile} />
      <BasicInfo />
      <MajorInput />
      <TeamExperience />
      <InterestKeywords />
      <Withdrawal />
    </div>
  );
}
