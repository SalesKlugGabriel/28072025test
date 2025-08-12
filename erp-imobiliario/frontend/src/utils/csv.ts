export function exportToCSV(filename: string, rows: Array<Record<string, any>>) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [ headers.join(";"), ...rows.map(r => headers.map(h => cell(r[h])).join(";")) ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
const cell = (v:any)=>{ if(v==null) return ""; const s=String(v).replace(/"/g,'""'); return /[;,"\n]/.test(s)?`"${s}"`:s }
