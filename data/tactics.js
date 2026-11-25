/**
 * Takım talimatları, bireysel oyuncu talimatları, rakip dizilişleri ve otomatik taktik analiz motoru.
 */

import { detectZone } from '../state/store.js';

export const MENTALITIES = [
  { id: 'very-defensive', label: 'Çok Defansif' },
  { id: 'defensive', label: 'Defansif' },
  { id: 'balanced', label: 'Dengeli' },
  { id: 'positive', label: 'Pozitif' },
  { id: 'attacking', label: 'Hücum' },
  { id: 'very-attacking', label: 'Çok Hücum' }
];

export const TEAM_INSTRUCTION_GROUPS = {
  passing: [
    { id: 'short', label: 'Kısa Pas' },
    { id: 'mixed', label: 'Karma' },
    { id: 'direct', label: 'Direkt / Uzun' }
  ],
  tempo: [
    { id: 'slow', label: 'Düşük Tempo' },
    { id: 'normal', label: 'Normal' },
    { id: 'high', label: 'Yüksek Tempo' }
  ],
  width: [
    { id: 'narrow', label: 'Dar' },
    { id: 'balanced', label: 'Dengeli' },
    { id: 'wide', label: 'Geniş' }
  ],
  pressing: [
    { id: 'low', label: 'Düşük Pres' },
    { id: 'medium', label: 'Orta Blok' },
    { id: 'high', label: 'Yüksek (Gegenpress)' }
  ],
  defLine: [
    { id: 'deep', label: 'Derin Hat' },
    { id: 'standard', label: 'Standart' },
    { id: 'high', label: 'Önde Savunma' }
  ]
};

export const PLAYER_INSTRUCTIONS = [
  { id: 'shoot-more', label: 'Daha Fazla Şut Çek' },
  { id: 'risky-passes', label: 'Daha Riskli Paslar At' },
  { id: 'stay-wider', label: 'Çizgiye Bas (Geniş Oyna)' },
  { id: 'cut-inside', label: 'İçe Kat Et' },
  { id: 'tight-marking', label: 'Sıkı Markaj Yap' },
  { id: 'press-more', label: 'Daha Çok Pres Yap' },
  { id: 'get-forward', label: 'Öne Bindirme Yap' }
];

/**
 * Rakip dizilişleri (yukarıdan aşağıya doğru hücum edecek şekilde konumlandırılmıştır)
 */
export const OPPONENT_FORMATIONS = {
  none: { id: 'none', name: 'Rakip Yok', players: [] },
  '4-4-2': {
    id: '4-4-2',
    name: 'Rakip: 4-4-2',
    players: [
      { label: 'KL', x: 50, y: 7 },
      { label: 'SĞB', x: 18, y: 23 },
      { label: 'STP', x: 39, y: 21 },
      { label: 'STP', x: 61, y: 21 },
      { label: 'SLB', x: 82, y: 23 },
      { label: 'SĞM', x: 18, y: 45 },
      { label: 'MO', x: 39, y: 44 },
      { label: 'MO', x: 61, y: 44 },
      { label: 'SLM', x: 82, y: 45 },
      { label: 'SF', x: 40, y: 66 },
      { label: 'SF', x: 60, y: 66 }
    ]
  },
  '4-3-3': {
    id: '4-3-3',
    name: 'Rakip: 4-3-3',
    players: [
      { label: 'KL', x: 50, y: 7 },
      { label: 'SĞB', x: 18, y: 23 },
      { label: 'STP', x: 39, y: 21 },
      { label: 'STP', x: 61, y: 21 },
      { label: 'SLB', x: 82, y: 23 },
      { label: 'DOS', x: 50, y: 36 },
      { label: 'MO', x: 35, y: 48 },
      { label: 'MO', x: 65, y: 48 },
      { label: 'SĞK', x: 20, y: 66 },
      { label: 'SF', x: 50, y: 70 },
      { label: 'SLK', x: 80, y: 66 }
    ]
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    name: 'Rakip: 4-2-3-1',
    players: [
      { label: 'KL', x: 50, y: 7 },
      { label: 'SĞB', x: 18, y: 22 },
      { label: 'STP', x: 39, y: 20 },
      { label: 'STP', x: 61, y: 20 },
      { label: 'SLB', x: 82, y: 22 },
      { label: 'DOS', x: 40, y: 36 },
      { label: 'DOS', x: 60, y: 36 },
      { label: 'SĞK', x: 20, y: 53 },
      { label: 'OOS', x: 50, y: 54 },
      { label: 'SLK', x: 80, y: 53 },
      { label: 'SF', x: 50, y: 71 }
    ]
  },
  '3-5-2': {
    id: '3-5-2',
    name: 'Rakip: 3-5-2',
    players: [
      { label: 'KL', x: 50, y: 7 },
      { label: 'STP', x: 30, y: 21 },
      { label: 'STP', x: 50, y: 19 },
      { label: 'STP', x: 70, y: 21 },
      { label: 'SĞKB', x: 13, y: 42 },
      { label: 'MO', x: 37, y: 44 },
      { label: 'DOS', x: 50, y: 35 },
      { label: 'MO', x: 63, y: 44 },
      { label: 'SLKB', x: 87, y: 42 },
      { label: 'SF', x: 41, y: 67 },
      { label: 'SF', x: 59, y: 67 }
    ]
  }
};

/**
 * Mevcut taktiği analiz edip FM Asistanı tarzı uyarı ve öneriler üretir.
 */
export function analyzeTactics(state) {
  const insights = [];
  const players = state.players;
  const atk = players.map(p => ({ ...p, pos: p.attack, zone: detectZone(p.attack.x, p.attack.y) }));
  const def = players.map(p => ({ ...p, pos: p.defense, zone: detectZone(p.defense.x, p.defense.y) }));

  // 1. Kanat savunma riski (hem bek hem kanat hücumda)
  const leftFullbackAtk = atk.find(p => ['SLB', 'SLKB'].includes(p.zone.code) && p.pos.duty === 'attack');
  const leftWingAtk = atk.find(p => ['SLK', 'SLM'].includes(p.zone.code) && p.pos.duty === 'attack');
  if (leftFullbackAtk && leftWingAtk) {
    insights.push({
      type: 'warning',
      text: 'Sol kanatta hem bek hem kanat oyuncusu Hücum görevinde — arkada kontra atak boşluğu doğabilir.'
    });
  }

  const rightFullbackAtk = atk.find(p => ['SĞB', 'SĞKB'].includes(p.zone.code) && p.pos.duty === 'attack');
  const rightWingAtk = atk.find(p => ['SĞK', 'SĞM'].includes(p.zone.code) && p.pos.duty === 'attack');
  if (rightFullbackAtk && rightWingAtk) {
    insights.push({
      type: 'warning',
      text: 'Sağ kanatta hem bek hem kanat oyuncusu Hücum görevinde — sağ koridor savunmasız kalabilir.'
    });
  }

  // 2. Merkezde kesici / savunma görevi eksikliği
  const midDefenders = atk.filter(
    p => ['DOS', 'MO'].includes(p.zone.code) && p.pos.duty === 'defend'
  );
  if (players.length >= 8 && midDefenders.length === 0) {
    insights.push({
      type: 'warning',
      text: 'Atak fazında orta sahada Savunma görevli bir kesici (Ön Libero / Çapa) bulunmuyor.'
    });
  }

  // 3. Çok fazla oyun kurucu çakışması
  const playmakers = atk.filter(p => ['dlp', 'ap', 'wp', 'regista', 'rpm', 'eng'].includes(p.pos.role));
  if (playmakers.length >= 3) {
    insights.push({
      type: 'tip',
      text: `${playmakers.length} adet Oyun Kurucu rolü seçili. Top paylaşımı için birini koşucu/bitirici role çekmek denge sağlayabilir.`
    });
  }

  // 4. Yüksek pres + derin savunma hattı uyumsuzluğu
  if (state.teamInstructions?.pressing === 'high' && state.teamInstructions?.defLine === 'deep') {
    insights.push({
      type: 'warning',
      text: 'Yüksek Pres ile Derin Savunma Hattı birlikte seçili — hatlar arası mesafe (kopukluk) çok açılabilir.'
    });
  }

  // 5. Karşılamada kompaktlık kontrolü
  const defAttackers = def.filter(p => p.pos.duty === 'attack' && p.zone.code !== 'SF');
  if (defAttackers.length >= 3) {
    insights.push({
      type: 'tip',
      text: 'Karşılama fazında birden fazla oyuncu Hücum görevinde; takım savunmasında blok bütünlüğü düşebilir.'
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'good',
      text: 'Rol ve görev dağılımı dengeli görünüyor! Savunma emniyeti ile hücum genişliği uyumlu.'
    });
  }

  return insights;
}
