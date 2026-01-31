import React from "react";
import "./SectionHeader.scss";

const SectionHeader = ({
  explainText,
  highlightText,
  filterOptions,
  onFilterChange,
}) => {
  const renderExplainText = () => {
    return explainText.split("\n").map((line, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {line.split(highlightText).map((part, idx, arr) =>
          idx < arr.length - 1 ? (
            <React.Fragment key={idx}>
              {part}
              <strong>{highlightText}</strong>
            </React.Fragment>
          ) : (
            part
          )
        )}
        {lineIdx < explainText.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <section className="project-header">
      <p className="project-explain">{renderExplainText()}</p>

      {filterOptions && filterOptions.length > 0 && (
        <div className="project-filter">
          <select className="project-select" onChange={onFilterChange}>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
};

export default SectionHeader;
