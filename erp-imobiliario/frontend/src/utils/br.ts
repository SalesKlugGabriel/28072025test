/** Validações BR (CPF/CNPJ) e e-mail */
export function onlyDigits(s: string) { return (s || '').replace(/\D/g, '') }

export function isEmailStrict(v?: string) {
  if (!v) return true
  // RFC 5322 simplificado + proíbe espaços e terminações inválidas
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

export function isCPF(v?: string) {
  if (!v) return false
  const s = onlyDigits(v)
  if (s.length !== 11 || /^(\d)\1{10}$/.test(s)) return false
  const calc = (base: string, factor: number) => {
    let total = 0
    for (let i = 0; i < base.length; i++) total += parseInt(base[i]) * (factor - i)
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }
  const d1 = calc(s.slice(0, 9), 10)
  const d2 = calc(s.slice(0, 10), 11)
  return d1 === parseInt(s[9]) && d2 === parseInt(s[10])
}

export function isCNPJ(v?: string) {
  if (!v) return false
  const s = onlyDigits(v)
  if (s.length !== 14 || /^(\d)\1{13}$/.test(s)) return false
  const calc = (base: string) => {
    const pesos = [6,5,4,3,2,9,8,7,6,5,4,3,2]
    let soma = 0
    for (let i = 0; i < base.length; i++) soma += parseInt(base[i]) * pesos[i + (pesos.length - base.length)]
    const rest = soma % 11
    return rest < 2 ? 0 : 11 - rest
  }
  const d1 = calc(s.slice(0, 12))
  const d2 = calc(s.slice(0, 13))
  return d1 === parseInt(s[12]) && d2 === parseInt(s[13])
}

export function isCpfOuCnpj(v?: string) {
  const s = (v || '').trim()
  return isCPF(s) || isCNPJ(s)
}