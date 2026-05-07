// Lightweight CSV utilities for the admin CRM.
// `leadsToCsv` produces a UTF-8 CSV string with French headers.
// `downloadCsv` triggers a browser download with a UTF-8 BOM so Excel/Numbers
// pick up the encoding correctly (otherwise é/à come out garbled).

const HEADERS = [
  ['id', 'ID'],
  ['first_name', 'Prénom'],
  ['company', 'Entreprise'],
  ['email', 'Email'],
  ['phone', 'Téléphone'],
  ['stage', 'Stage'],
  ['sector', 'Secteur'],
  ['budget', 'Budget'],
  ['goal', 'Objectif'],
  ['outcome', 'Outcome'],
  ['timing', 'Timing'],
  ['utm_source', 'UTM Source'],
  ['utm_campaign', 'UTM Campaign'],
  ['utm_content', 'UTM Content'],
  ['notes', 'Notes'],
  ['created_at', 'Créé le'],
  ['updated_at', 'Mis à jour'],
];

const escape = (v) => {
  if (v == null) return '';
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
};

export function leadsToCsv(leads) {
  const headerRow = HEADERS.map(([, label]) => escape(label)).join(',');
  const rows = (leads || []).map((l) =>
    HEADERS.map(([key]) => escape(l?.[key])).join(',')
  );
  return [headerRow, ...rows].join('\n');
}

export function downloadCsv(filename, content) {
  // BOM ensures Excel/Numbers detect UTF-8.
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function dateStamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
