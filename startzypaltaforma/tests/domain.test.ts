import test from 'node:test';
import assert from 'node:assert/strict';
import { leadSchema, normalizeImport, briefing } from '../lib/domain.ts';
import { calendarDates, monthCells, validDate, exportICS } from '../lib/calendar.ts';
import { parseBackup } from '../lib/backup.ts';

test('calendário calcula datas móveis e o dia 256 em ano bissexto', () => {
  const dates = calendarDates(2026);
  for (const [id, expected] of [['pascoa','2026-04-05'],['carnaval','2026-02-17'],['maes','2026-05-10'],['pais','2026-08-09'],['black-friday','2026-11-27']]) assert.equal(dates.find(d => d.id === `builtin-${id}`)?.date, expected);
  assert.equal(calendarDates(2028).find(d => d.id === 'builtin-programador')?.date, '2028-09-12');
  assert.equal(calendarDates(2027).some(d => d.id === 'builtin-eleicao2026'), false);
  assert.equal(monthCells(2026, 9).length, 42);
  assert.equal(monthCells(2026, 9).filter(d => d.current).length, 31);
});
test('datas impossíveis são recusadas no calendário e no retorno comercial', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2028-02-29'), true);
  assert.equal(leadSchema.safeParse({ name: 'Exemplo', followUp: '2026-02-30' }).success, false);
});
test('importação normaliza formatos existentes e preserva histórico válido', () => {
  const rows = normalizeImport({ companies: [{ nome: 'Café Teste', cidade: 'Mauá', uf: 'SP', site: 'example.com', history: [{ at: '2026-10-21T12:00:00.000Z', text: 'Primeira pesquisa' }] }] });
  assert.equal(rows[0].website, 'https://example.com');
  assert.equal(rows[0].city, 'Mauá');
  assert.equal(rows[0].history?.[0].text, 'Primeira pesquisa');
  assert.throws(() => normalizeImport([{ name: 'Teste', website: 'javascript:alert(1)', colors: 'red' }]));
  assert.throws(() => normalizeImport([]));
});
test('briefing mantém lacunas visíveis e identifica arquivo privado', () => {
  const lead = leadSchema.parse({ name: 'Teste', logo: '/api/assets?id=12345678-abcd-4000-8000-123456789012' });
  const text = briefing(lead, 'site', 'https://startzy.com.br');
  assert.match(text, /Não informado — confirmar/);
  assert.match(text, /arquivo privado/);
  assert.match(text, /https:\/\/startzy.com.br\/api\/assets/);
});
test('agenda exportada escapa vírgulas e quebras de linha', () => {
  const ics = exportICS([{ id: '1', title: 'Oferta, contexto', date: '2026-10-25', time: '14:30', caption: 'Linha 1\nLinha 2' }]);
  assert.match(ics, /DTSTART;TZID=America\/Sao_Paulo:20261025T143000/);
  assert.ok(ics.includes('SUMMARY:Oferta\\, contexto'));
  assert.ok(ics.includes('Linha 1\\nLinha 2'));
});
test('backup valida formato antes de restaurar', () => {
  assert.throws(() => parseBackup({ schemaVersion: 1, items: [{ id: 'x', title: 'Exemplo', date: '2026-02-30' }], events: [] }));
  assert.equal(parseBackup({ schemaVersion: 1, items: [{ id: 'seed-P01', title: 'Exemplo' }], events: [] }).items[0].time, '09:00');
});
