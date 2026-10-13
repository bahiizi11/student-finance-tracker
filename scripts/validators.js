export const RE = {
  description: /^(?=.{1,80}$)\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  dupWord: /\b(\w+)\s+\1\b/i,
  code: /^[A-Z]{3}$/,
  rate: /^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/,
};

export function realDate(s){
    const d = new Date(s + 'T00:00:00Z');
    return !isNaN(d) && d.toISOString() .slice(0,10) ===s;
}

export function validate(r) {
  const e = {};
  if (!RE.description.test(r.description)) e.description = 'Use 1 to 80 characters, with no space at the start or end.';
  if (!RE.amount.test(String(r.amount))) e.amount = 'Use a number like 12 or 12.50.';
  if (!RE.date.test(r.date) || !realDate(r.date)) e.date = 'Use a real date as YYYY-MM-DD.';
  if (!RE.category.test(r.category)) e.category = 'Use letters, spaces or hyphens only.';
  return e;
}

export function compile(pattern, ignoreCase) {
  if (!pattern) return {};
  if (pattern.length > 120) return { error: 'Pattern is too long (120 max).' };
  try { return { re: new RegExp(pattern, ignoreCase ? 'i' : '') }; }
  catch (err) { return { error: 'Invalid pattern: ' + err.message }; }
}

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function highlight(text, re) {
  text = String(text);
  if (!re) return esc(text);
  let out = '', last = 0;
  for (const m of text.matchAll(new RegExp(re.source, re.flags + 'g'))) {
    if (!m[0]) continue;
    out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

export const cents = (a) => Math.round(Number(a) * 100);
export const total = (list) => list.reduce((s, r) => s + cents(r.amount), 0) / 100;

export function topCategory(list) {
  const sums = {};
  for (const r of list) { const k = r.category.toLowerCase(); sums[k] = (sums[k] || 0) + cents(r.amount); }
  const best = Object.entries(sums).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : '-';
}

export function last7(list, today) {
const days =[];
for (let i =6; i >=0; i--){
    const d= new Date(today + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - i);
    const key=d.toISOString() .slice(0,10);
    days.push({ day: key, sum: total(list.filter((r) => r.date ===key))});
}
  return days;
}

export function capStatus(spent,cap) {
  if (cap === '' || cap == null) return { state: 'none', text: 'No spending cap set.' };
  const diff = Math.round((Number(cap) - spent) * 100) / 100;
  return diff >= 0
    ? { state: 'ok', text: `You have ${diff.toFixed(2)} remaining under your cap.` }
    : { state: 'over', text: `Over budget by ${Math.abs(diff).toFixed(2)}.` };
}

export const convert= ( amount ,rate) => amount * Number(rate);

