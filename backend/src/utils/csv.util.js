function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';

  const text = String(value);

  if (/[",\n\r;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function toCsv(rows, columns) {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(',');
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column.key])).join(','),
  );

  return [header, ...body].join('\n');
}

module.exports = {
  toCsv,
};
