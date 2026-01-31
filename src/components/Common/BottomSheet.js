import React from "react";
import { BottomSheet as RSBBottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import "./BottomSheet.scss";

export default function BottomSheet({
  open,
  onDismiss,
  header, // 상단에 렌더링할 JSX (e.g. <h3>타이틀</h3>)
  children, // 본문 영역
  className,
  sheetClassName = "", // 시트(container) 클래스
  headerClassName = "", // 헤더 영역 클래스
  contentClassName = "", // 본문 영역 클래스
  style = {}, // 최상위 컨테이너 style
  sheetStyle = {}, // 시트(container) style
  headerStyle = {}, // 헤더 영역 style
  contentStyle = {}, // 본문 영역 style
  snapPoints, // react-spring-bottom-sheet snapPoints prop
  ...restProps // 나머지 RSBBottomSheet props (blocking, expandOnContentDrag 등)
}) {
  return (
    <RSBBottomSheet
      open={open}
      onDismiss={onDismiss}
      className={`bottom-sheet-root ${className}`}
      snapPoints={snapPoints}
      {...restProps}
      style={style}
    >
      <div
        className={`bottom-sheet-content ${contentClassName}`}
        style={contentStyle}
      >
        {children}
      </div>
    </RSBBottomSheet>
  );
}
