import { validate, RE, compile, highlight, total, topCategory, last7, capStatus, convert } from './validators.js';

const $ = (s) => document.querySelector(s);
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let records = read('sft:records', []);
let settings = { cap: '', base: 'USD', cur: [{ code: 'EUR', rate: '0.92' }, { code: 'RWF', rate: '1450' }], ...read('sft:settings', {}) };
const save = () => {
  try {
    localStorage.setItem('sft:records', JSON.stringify(records));
    localStorage.setItem('sft:settings', JSON.stringify(settings));
  } catch { $('#io-msg').textContent = 'Could not save: storage is full or blocked.'; }
};
const today = () => new Date().toISOString().slice(0, 10);
const money = (n) => n.toFixed(2);

function route(initial){
    const views = [...document.querySelectorAll('.view')];
    const id=location.hash.slice(1);
    const name = views.some((v) => v.id ===id) ? id : 'dashboard' ;
    views.forEach((v) => (v.hidden = v.id !==name));
    document.querySelectorAll('nav a').forEach((a) =>(a.getAttribute('href') === '#' + name ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current')));
    
}

function renderRecords() {
  const { re, error } = compile($('#search').value, $('#ci').checked);
  $('#search-error').textContent = error || '';
  $('#search').setAttribute('aria-invalid', String(Boolean(error)));
  const fields = (r) => [r.date, r.description, r.category, money(Number(r.amount))];
  let list = records.filter((r) => !re || fields(r).some((f) => re.test(f)));
  const [key, dir] = $('#sort').value.split('-');
  const val = (r) => (key === 'amount' ? Number(r.amount) : key === 'desc' ? r.description.toLowerCase() : r.date);
  list.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (dir === 'asc' ? 1 : -1));
  $('#rows').innerHTML = list.map((r) => {
    const [d, desc, cat, amt] = fields(r).map((f) => highlight(f, re));
    return `<tr><td>${d}</td><td>${desc}</td><td>${cat}</td><td>${amt}</td>` +
      `<td><button class="alt" data-edit="${r.id}">Edit</button><button class="alt" data-del="${r.id}">Delete</button></td></tr>`;
  }).join('');
  $('#count').textContent = records.length ? `${list.length} of ${records.length} transactions shown.` : 'No transactions yet. Add one or load sample data in Settings.';
}

function renderStats() {
  const spent = total(records);
  $('#s-count').textContent = records.length;
  $('#s-total').textContent = `${money(spent)} ${settings.base}`;
  $('#s-top').textContent = topCategory(records);
  $('#s-other').textContent = settings.cur.map((c) => `${money(convert(spent, c.rate))} ${c.code}`).join(' · ');
  const cap = capStatus(spent, settings.cap);
  $('#cap-ok').textContent = cap.state === 'over' ? '' : cap.text;
  $('#cap-over').textContent = cap.state === 'over' ? cap.text : '';
  $('#trend').innerHTML = last7(records, today()).map((d) => `<li>${d.day}: ${money(d.sum)}</li>`).join('');
}

const render = () => { renderRecords(); renderStats(); };

/* ----- add / edit ----- */
const FIELDS = ['description', 'amount', 'category', 'date'];
function showErrors(prefix, errors, ids) {
  let first = null;
  for (const f of ids) {
    $(`#e-${f}`).textContent = errors[f] || '';
    $(`#${prefix}-${f}`).setAttribute('aria-invalid', String(Boolean(errors[f])));
    if (errors[f] && !first) first = $(`#${prefix}-${f}`);
  }
  if (first) first.focus();
  return !first;
}

function resetForm() {
  $('#form').reset();
  $('#f-id').value = '';
  $('#h-add').textContent = 'Add transaction';
  $('#save').textContent = 'Add';
  $('#cancel').hidden = true;
  FIELDS.forEach((f) => { $(`#e-${f}`).textContent = ''; $(`#f-${f}`).removeAttribute('aria-invalid'); });
  $('#warn').textContent = '';
}

$('#f-description').addEventListener('input', (e) => {
  const m = e.target.value.match(RE.dupWord);
  $('#warn').textContent = m ? `Tip: the word "${m[1]}" is repeated.` : '';
});

$('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  const rec = {
    description: $('#f-description').value.replace(/\s{2,}/g, ' '),
    amount: $('#f-amount').value,
    category: $('#f-category').value,
    date: $('#f-date').value,
  };
  if (!showErrors('f', validate(rec), FIELDS)) return;
  const now = new Date().toISOString();
  const id = $('#f-id').value;
  if (id) {
    const r = records.find((x) => x.id === id);
    Object.assign(r, rec, { amount: Number(rec.amount), updatedAt: now });
  } else {
    records.push({ id: 'txn_' + Date.now().toString(36), ...rec, amount: Number(rec.amount), createdAt: now, updatedAt: now });
  }
  save(); resetForm(); render();
  location.hash = '#records';
});

$('#cancel').addEventListener('click', () => { resetForm(); location.hash = '#records'; });

$('#rows').addEventListener('click', (e) => {
  const edit = e.target.dataset.edit, del = e.target.dataset.del;
  if (edit) {
    const r = records.find((x) => x.id === edit);
    $('#f-id').value = r.id;
    FIELDS.forEach((f) => ($(`#f-${f}`).value = r[f]));
    $('#h-add').textContent = 'Edit transaction';
    $('#save').textContent = 'Save changes';
    $('#cancel').hidden = false;
    location.hash = '#add';
  } else if (del && confirm('Delete this transaction?')) {
    records = records.filter((x) => x.id !== del);
    save(); render();
  }
});

$('#search') .addEventListener('input' , renderRecords);
$('#ci') .addEventListener('change' , renderRecords);
$('#sort').addEventListener('change',renderRecords);

/* ----- settings ----- */
function fillSettings() {
  $('#s-cap').value = settings.cap;
  $('#s-base').value = settings.base;
  settings.cur.forEach((c, i) => { $(`#c${i + 1}-code`).value = c.code; $(`#c${i + 1}-rate`).value = c.rate; });
}

$('#settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const cap = $('#s-cap').value.trim();
  const base = $('#s-base').value.trim().toUpperCase();
  const cur = [1, 2].map((i) => ({ code: $(`#c${i}-code`).value.trim().toUpperCase(), rate: $(`#c${i}-rate`).value.trim() }));
  const errors = {};
  if (cap && !RE.amount.test(cap)) errors.cap = 'Use a number like 500 or 500.50, or leave empty.';
  if (!RE.code.test(base)) errors.base = 'Use 3 capital letters, like USD.';
  if (cur.some((c) => !RE.code.test(c.code) || !RE.rate.test(c.rate) || Number(c.rate) <= 0)) errors.cur = 'Each currency needs a 3-letter code and a rate above 0.';
  $('#e-cur').textContent = errors.cur || '';
  if (!showErrors('s', errors, ['cap', 'base'])) return;
  if (errors.cur) { $('#c1-code').focus(); return; }
  settings = { cap, base, cur };
  save(); renderStats();
  $('#io-msg').textContent = 'Settings saved.';
});

/* ----- import / export ----- */
function importRecords(data) {
  const list = Array.isArray(data) ? data : data && data.records;
  if (!Array.isArray(list)) throw new Error('File must be a list of records or an object with "records".');
  const bad = list.findIndex((r) => !r || typeof r.id !== 'string' || Object.keys(validate(r)).length);
  if (bad >= 0) throw new Error(`Record ${bad + 1} is missing an id or has an invalid field. Nothing was imported.`);
  records = list;
  if (data.settings) settings = { ...settings, ...data.settings };
  save(); fillSettings(); render();
  $('#io-msg').textContent = `Imported ${list.length} records.`;
}

const msgError = (err) => { $('#io-msg').setAttribute('role', 'alert'); $('#io-msg').textContent = err.message; };

$('#import').addEventListener('change', async (e) => {
  $('#io-msg').setAttribute('role', 'status');
  try { importRecords(JSON.parse(await e.target.files[0].text())); }
  catch (err) { msgError(err.name === 'SyntaxError' ? new Error('That file is not valid JSON.') : err); }
  e.target.value = '';
});

$('#sample').addEventListener('click', async () => {
  $('#io-msg').setAttribute('role', 'status');
  try { importRecords(await (await fetch('seed.json')).json()); } catch (err) { msgError(err); }
});

$('#export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ settings, records }, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `finance-${today()}.json` });
  a.click();
  URL.revokeObjectURL(a.href);
  $('#io-msg').textContent = `Exported ${records.length} records.`;
});

window.addEventListener('hashchange', () => route(false));
fillSettings();
render();
route(true);
