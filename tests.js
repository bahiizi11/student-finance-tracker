import { RE, validate, realDate, compile, highlight, esc, total,topCategory, last7, capStatus, convert } from './scripts/validators.js';

const ok= (c, m = 'expected true') => { if (!c) throw new Error(m); };
const eq = (a, b) => ok(a === b, `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);
const good={ description: 'Lunch', amount: '12.50' , category: 'Food' , date: '2025-09-25'};

export const tests=[
    ['description accepts normal text and 80 chars', () => { ok(RE.description.test('Lunch at cafe')); ok(RE.description.test('a' .repeat(80))); }],
    ['description rejects edge spaces empty and 8 chars' , () =>{ for (const s of [ ' x', 'x ','','a' .repeat(81)])  ok(!RE.description.test(s), s);}],
    ['amount accepts 0, 12, 12.50', () => { for (const s of ['0', '12', '12.5' , '12.50']) ok(RE.amount.test(s), s);}],
    ['amount rejects 01, -5, 1,000, 12.345, .5',  () =>{ for (const s of ['01', '-5' , '1,000' , '12.345', '.5', '']) ok(!RE.amount.test(s), s);}],
    ['date accepts leap day,rejects 2025-02-29 and rejects 2025-02-29 and 2025-13-01', () => {
        ok(RE.date.test('2024-02-29') && realDate('2024-02-29'));
        ok(!realDate('2025-02-29'));
        ok(!RE.date.test('2025-13-01'));
        
    }],
        ['category accepts Food and Part-time work, rejects Food2', () => {
            ok(RE.category.test('Food') && RE.category.test('Part-time work'));
            ok(!RE.category.test('Food2') && !RE.category.test('Fast  Food'));

    
        }
        ],
        
            ['duplicate word back-reference', () => { ok(RE.dupWord.test('Coffee coffee run')); ok(!RE.dupWord.test('coffee run'));}],
            ['validate returns no errors for good record',() => eq(Object.keys(validate(good)).length,0)],
            ['validate flags all 4 bad fields' , () => eq(Object.keys(validate({description: ' x', amount: 'a' , category: '1', date: '2025-02-30'})).length,4)],
            ['compile: valid, invalid, too long, empty',() =>{
                ok(compile('a+',true).re instanceof RegExp);
                ok(compile('(',true).error.startsWith('Invalid'));
                ok(compile('a'.repeat(121), true).error);
                ok(!compile('',true).re);

            }],
            ['case flag respected' , () => { ok(compile('abc',true).re.test('ABC')); ok(!compile('abc', false).re.test('ABC'));}],
            ['highlight wraps matches in <mark>', () => eq(highlight('a coffee', compile('coffee', true).re), 'a <mark>coffee</mark>')],
            ['highlight escapes HTML', () => {
                const out=highlight('<b>x</b>' , compile('x', true).re);
                ok(!out.includes('<b>') && out.includes('&lt;b&gt;')
            && out.includes('<mark>x</mark>'));
            }

            ],       
            [ 'highlight survives zero-length patterns', () => eq(highlight('abc', compile('x*' ,true).re),'abc')],
            ['esc escapes quotes and ampersands', () => eq(esc(`&"'`), '&amp;&quot;&#39;')],
            ['total uses cents (0.1 + 0.2 = 0.3)', () => eq(total([{ amount: 0.1 }, { amount: 0.2 }]), 0.3)],
            ['topCategory is by spend, case-insensitive', () => eq(topCategory([{ category: 'Food', amount: 5 }, { category: 'food', amount: 5 }, { category: 'Books', amount: 9 }]), 'food')],
        
        ['topCategory of empty list is -', () => eq(topCategory([]), '-')],
  ['last7 spans 7 days across a month boundary', () => {
    const d = last7([{ date: '2025-03-01', amount: 4 }], '2025-03-02');
    eq(d.length, 7); eq(d[0].day, '2025-02-24'); eq(d[5].sum, 4);
  }],
  ['capStatus: none, ok, over', () => {
    eq(capStatus(10, '').state, 'none'); eq(capStatus(10, '10').state, 'ok'); eq(capStatus(10.01, '10').state, 'over');
  }],
  ['convert uses manual rate', () => eq(convert(100, '0.92'), 92)],
  ['seed.json has 10+ valid records', async () => {
    const seed = await (await fetch('seed.json')).json();
    ok(seed.length >= 10);
    seed.forEach((r) => eq(Object.keys(validate(r)).length, 0));

  }}
]
  

