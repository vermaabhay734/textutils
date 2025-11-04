// Quick standalone test for the SQL formatter used in TextForm
function formatSqlQueryLocal(input) {
  if (!input) return input;
  const strings = [];
  const masked = input.replace(/'(?:[^']|'')*'/g, (m) => {
    const key = `__STR${strings.length}__`;
    strings.push(m);
    return key;
  });
  let s = masked.replace(/\s+/g, ' ').trim();
  const kws = [
    'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'UNION'
  ];
    // Uppercase keywords first (multi-word first), then insert newline before them
    kws.sort((a,b) => b.length - a.length).forEach(kw => {
      const pat = kw.split(' ').join('\\s+');
      const re = new RegExp('\\b' + pat + '\\b', 'gi');
      s = s.replace(re, kw);
    });
    console.log('AFTER UPPERCASE:', s);
    // Insert newline before any keyword now uppercased
    const kwsPattern = kws.map(k => k.replace(/ /g, '\\s+')).join('|');
      s = s.replace(new RegExp('\\b(' + kwsPattern + ')\\b', 'g'), '\n$1');
    console.log('AFTER NEWLINE INSERTION:', s);
  // Removed stray closing brace
      s = s.replace(/([<>!=]=?|=)/g, ' $1 ').replace(/[ \t]+/g, ' ').trim();
  let lines = s.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const out = [];
  lines.forEach(line => {
    if (/^SELECT\b/i.test(line)) {
      const rest = line.replace(/^SELECT\b/i, '').trim();
      out.push('SELECT');
      if (rest) {
        const cols = rest.split(',').map(c => c.trim()).filter(Boolean);
        cols.forEach((c, i) => out.push('  ' + c + (i === cols.length -1 ? '' : ',')));
      }
    } else {
      // Match only known SQL keywords at line start to avoid greedy captures
      const kwMatch = line.match(/^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|VALUES|SET|INSERT INTO|UPDATE|DELETE|UNION|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN|ON)\b/i);
      if (kwMatch) {
        const kw = kwMatch[1].toUpperCase();
        const rest = line.slice(kwMatch[1].length).trim();
        if (rest) {
          out.push(kw);
          out.push('  ' + rest);
        } else {
          out.push(kw);
        }
      } else {
        out.push(line);
      }
    }
  });
  const final = [];
  let depth = 0;
  out.forEach(line => {
    if (/^\)/.test(line)) depth = Math.max(0, depth - 1);
    final.push('  '.repeat(depth) + line);
    const opens = (line.match(/\(/g) || []).length;
    const closes = (line.match(/\)/g) || []).length;
    depth += opens - closes;
    if (depth < 0) depth = 0;
  });
  let result = final.join('\n');
  strings.forEach((st, idx) => {
    result = result.replace(new RegExp(`__STR${idx}__`, 'g'), st);
  });
  if (/;\s*$/.test(input.trim()) && !/;\s*$/.test(result)) result = result.trim() + ';';
  return result.trim();
}

const inputs = [
  `select id,name from customers where age>18 order by name desc;`,
  `SELECT * FROM users -- fetch all users\nWHERE age > 18;\n/* multi line\ncomment */\nSELECT id FROM accounts;`,
  `select 'a, b, c' as col, count(*) from t where name='O''Reilly' and age>=30;`
];

inputs.forEach((inp, i) => {
  console.log('--- Input', i+1, '---');
  console.log(inp);
  console.log('--- Output ---');
  console.log(formatSqlQueryLocal(inp));
  console.log('\n');
});
