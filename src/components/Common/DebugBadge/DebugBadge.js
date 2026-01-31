import React from 'react';

/**
 * DebugBadge Component
 * Displays server/UI sync status in development mode
 *
 * @param {Object} props
 * @param {Object} props.report - Comparison report from compareProjectLists
 */
export default function DebugBadge({ report }) {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!report) return null;

  // Check if there are any warnings
  const warn =
    report.missingInUI.length ||
    report.extraInUI.length ||
    report.fieldMismatches.length ||
    report.duplicatesUI.length;

  return (
    <div
      style={{
        position: 'fixed',
        right: 12,
        bottom: 72,
        zIndex: 9999,
        background: warn ? '#FDECEC' : '#EEFDF3',
        color: '#333',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: '6px 8px',
        fontSize: 12,
        fontFamily: 'monospace',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
      onClick={() => {
        console.group('📊 Debug Badge - Full Report');
        console.table(report.counts);
        if (report.duplicatesUI.length) console.warn('duplicatesUI', report.duplicatesUI);
        if (report.missingInUI.length) console.warn('missingInUI', report.missingInUI);
        if (report.extraInUI.length) console.warn('extraInUI', report.extraInUI);
        if (report.fieldMismatches.length) console.warn('fieldMismatches', report.fieldMismatches);
        console.groupEnd();
      }}
      title="Click to log full report to console"
    >
      {`S:${report.counts.server} / UI:${report.counts.ui}`}{' '}
      {warn ? '⚠︎ mismatch' : '✓ in-sync'}
    </div>
  );
}
