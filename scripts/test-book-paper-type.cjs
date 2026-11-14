const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const files = [
  'src/utils/bookMapper.ts',
  'src/components/ProductsPage.tsx',
  'src/app/products/category/[slug]/page.tsx',
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('function mapAPIBookToBook(');
  assert.ok(start >= 0, `${file}: mapper must exist`);
  const end = source.indexOf('\n}', start);
  assert.ok(end >= 0, `${file}: mapper must be complete`);
  const { outputText } = ts.transpileModule(source.slice(start, end + 2), {
    compilerOptions: { target: ts.ScriptTarget.ES2017 },
  });
  const map = vm.runInNewContext(`${outputText}\nmapAPIBookToBook`);
  const book = { price: 11000, category: { name: 'Cerita Rakyat Nusantara' }, createdAt: '2026-11-13' };
  for (const paperType of ['CD', 'HVS', 'Art Paper', '', null, undefined]) {
    assert.equal(map({ ...book, paper_type: paperType }).paperType, paperType || 'HVS', file);
  }
  const oldMap = vm.runInNewContext(`${outputText.replace("apiBook.paper_type || 'HVS'", "'HVS'")}\nmapAPIBookToBook`);
  assert.throws(() => assert.equal(oldMap({ ...book, paper_type: 'CD' }).paperType, 'CD'));
}

console.log('PASS: all three mappers preserve API paper type and fallback; old hardcoded value fails.');
