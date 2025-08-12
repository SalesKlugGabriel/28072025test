export function isRequired(v?: string, min = 2) { return !!(v && v.trim().length >= min) }
export function isEmail(v?: string) { if (!v) return true; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) }
export function isPhoneBR(v?: string) { if (!v) return true; const d = v.replace(/\D/g,''); return d.length >= 10 && d.length <= 11 }
