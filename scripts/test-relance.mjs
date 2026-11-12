// Tests du délai légal et du plan de relance (src/espace/relance.js). Lancer : node scripts/test-relance.mjs
import assert from 'node:assert/strict';
import { dateLimite, dernierAppel, dansCreneau, prochainCreneau, prochaineTentative, estFerie, etatDelai, remplir, numeroIntl, planValide, PLAN_DEFAUT } from '../src/espace/relance.js';

const D = (s) => new Date(s); // heure locale
const f = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : null);
let n = 0; const t = (nom, fn) => { fn(); n += 1; console.log('ok', nom); };

t('jours fériés 2026', () => {
  for (const s of ['2026-01-01', '2026-04-06', '2026-05-01', '2026-05-08', '2026-05-14', '2026-05-25', '2026-07-14', '2026-08-15', '2026-11-01', '2026-11-11', '2026-12-25']) assert.ok(estFerie(D(`${s}T12:00`)), s);
  assert.ok(!estFerie(D('2026-11-12T12:00')));
});
t('limite : demande lundi 16/11 → fin du samedi 21/11, dernier appel vendredi 20 h', () => {
  assert.equal(f(dateLimite(D('2026-11-16T09:00'))), '2026-11-21 23:59');
  assert.equal(f(dernierAppel(D('2026-11-16T09:00'))), '2026-11-20 20:00');
});
t('limite : demande mardi 10/11 (11/11 férié) → 12, 13, 14, 16, 17 → mardi 17/11 20 h', () => {
  assert.equal(f(dateLimite(D('2026-11-10T15:00'))), '2026-11-17 23:59');
  assert.equal(f(dernierAppel(D('2026-11-10T15:00'))), '2026-11-17 20:00');
});
t('limite : demande samedi 14/11 → 16,17,18,19,20 → vendredi 20/11', () => {
  assert.equal(f(dernierAppel(D('2026-11-14T11:00'))), '2026-11-20 20:00');
});
t('créneaux', () => {
  assert.ok(dansCreneau(D('2026-11-12T10:00')));
  assert.ok(!dansCreneau(D('2026-11-12T13:30')));
  assert.ok(!dansCreneau(D('2026-11-12T20:00')));
  assert.ok(!dansCreneau(D('2026-11-14T11:00'))); // samedi
  assert.ok(!dansCreneau(D('2026-11-11T11:00'))); // férié
  assert.equal(f(prochainCreneau(D('2026-11-12T13:30'))), '2026-11-12 14:00');
  assert.equal(f(prochainCreneau(D('2026-11-13T21:00'))), '2026-11-16 10:00'); // vendredi soir → lundi
  assert.equal(f(prochainCreneau(D('2026-11-10T21:00'))), '2026-11-12 10:00'); // saute le 11/11
});
t('plan par défaut, demande lundi 16/11 à 11 h 12', () => {
  const dem = D('2026-11-16T11:12');
  assert.equal(f(prochaineTentative(dem, 0, PLAN_DEFAUT, dem)), '2026-11-16 11:12');
  assert.equal(f(prochaineTentative(dem, 1, PLAN_DEFAUT, D('2026-11-16T11:20'))), '2026-11-16 17:00');
  assert.equal(f(prochaineTentative(dem, 2, PLAN_DEFAUT, D('2026-11-16T17:05'))), '2026-11-17 10:30');
  assert.equal(f(prochaineTentative(dem, 3, PLAN_DEFAUT, D('2026-11-17T10:40'))), '2026-11-19 18:00');
  assert.equal(prochaineTentative(dem, 4, PLAN_DEFAUT, D('2026-11-19T18:05')), null);
});
t('demande à 21 h → premier appel le lendemain 10 h ; demande vendredi soir → lundi', () => {
  const dem = D('2026-11-16T21:00');
  assert.equal(f(prochaineTentative(dem, 0, PLAN_DEFAUT, dem)), '2026-11-17 10:00');
  const ven = D('2026-11-20T21:00');
  assert.equal(f(prochaineTentative(ven, 0, PLAN_DEFAUT, ven)), '2026-11-23 10:00');
});
t('relance en retard : jamais avant maintenant, jamais après le délai', () => {
  const dem = D('2026-11-16T11:00');
  assert.equal(f(prochaineTentative(dem, 1, PLAN_DEFAUT, D('2026-11-17T12:50'))), '2026-11-17 12:50');
  assert.equal(prochaineTentative(dem, 3, PLAN_DEFAUT, D('2026-11-20T20:30')), null);
});
t('état du délai', () => {
  const e = etatDelai(D('2026-11-16T09:00'), D('2026-11-20T10:00'));
  assert.ok(e.urgent && !e.depasse);
  assert.ok(etatDelai(D('2026-11-16T09:00'), D('2026-11-20T20:01')).depasse);
});
t('plan valide', () => {
  assert.ok(planValide(PLAN_DEFAUT));
  assert.ok(!planValide([...PLAN_DEFAUT, { j: 5, h: '10:00' }]));
  assert.ok(!planValide([{ j: 0, h: '10:00' }]));
  assert.ok(!planValide([{ j: 1, h: '25:00' }]));
});
t('modèles et numéros', () => {
  assert.equal(remplir('Bonjour {prenom}, ici {signataire} de {entreprise}.', { prenom: 'Marie', signataire: 'Julien', entreprise: 'Exemple Chauffage' }), 'Bonjour Marie, ici Julien d’Exemple Chauffage.');
  assert.equal(remplir('Bonjour {prenom}, merci.', {}), 'Bonjour, merci.');
  assert.equal(remplir('Ici {signataire} de {entreprise}. Quand puis-je vous rappeler ?', { signataire: 'Léa', entreprise: 'Thermo Sud' }), 'Ici Léa de Thermo Sud. Quand puis-je vous rappeler ?');
  assert.equal(numeroIntl('06 12 34 56 78'), '33612345678');
  assert.equal(numeroIntl('+33 6 12 34 56 78'), '33612345678');
});
console.log(`${n} tests passés`);
