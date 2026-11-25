import { PRESETS } from '../data/presets.js';
import { getRoleById, getRolesForZone } from '../data/roles.js';

const STORAGE_KEY = 'fm27-taktik-builder-v2';
const SLOTS_KEY = 'fm27-taktik-slots-v1';

/**
 * Saha koordinatlarından (x: 0-100, y: 0-100) FM tarzı pozisyon kodu ve adı çıkarır.
 * y=0 rakip kale, y=100 kendi kalemiz.
 */
export function detectZone(x, y) {
  if (y >= 85 && x >= 32 && x <= 68) {
    return { code: 'KL', label: 'Kaleci' };
  }

  const side = x < 28 ? 'L' : x > 72 ? 'R' : 'C';

  if (y >= 67) {
    if (side === 'L') return { code: 'SLB', label: 'Sol Bek' };
    if (side === 'R') return { code: 'SĞB', label: 'Sağ Bek' };
    return { code: 'STP', label: 'Stoper' };
  }

  if (y >= 56) {
    if (side === 'L') return { code: 'SLKB', label: 'Sol Kanat Bek' };
    if (side === 'R') return { code: 'SĞKB', label: 'Sağ Kanat Bek' };
    return { code: 'DOS', label: 'Ön Libero' };
  }

  if (y >= 41) {
    if (side === 'L') return { code: 'SLM', label: 'Sol Orta Saha' };
    if (side === 'R') return { code: 'SĞM', label: 'Sağ Orta Saha' };
    return { code: 'MO', label: 'Merkez Orta Saha' };
  }

  if (y >= 23) {
    if (side === 'L') return { code: 'SLK', label: 'Sol Kanat' };
    if (side === 'R') return { code: 'SĞK', label: 'Sağ Kanat' };
    return { code: 'OOS', label: 'On Numara' };
  }

  if (side === 'L' && y > 18) return { code: 'SLK', label: 'Sol Açık' };
  if (side === 'R' && y > 18) return { code: 'SĞK', label: 'Sağ Açık' };
  return { code: 'SF', label: 'Santrafor' };
}

/**
 * Oyuncu koordinatlarından otomatik diziliş kodu hesaplar (ör. "4-2-3-1").
 */
export function computeFormationCode(players, phase) {
  const targetPhase = phase === 'setpiece' ? 'attack' : phase;
  const outfield = players
    .map(p => ({ p, pos: p[targetPhase] || p.attack }))
    .filter(({ pos }) => detectZone(pos.x, pos.y).code !== 'KL')
    .sort((a, b) => b.pos.y - a.pos.y);

  if (outfield.length === 0) return '0';

  const lines = [];
  for (const item of outfield) {
    const lastLine = lines[lines.length - 1];
    if (!lastLine) {
      lines.push([item.pos.y]);
    } else {
      const avgY = lastLine.reduce((s, v) => s + v, 0) / lastLine.length;
      if (Math.abs(item.pos.y - avgY) <= 10.5) {
        lastLine.push(item.pos.y);
      } else {
        lines.push([item.pos.y]);
      }
    }
  }

  return lines.map(l => l.length).join('-');
}

function buildCornerPositions(players) {
  return players.map((p, idx) => {
    const zone = detectZone(p.attack.x, p.attack.y).code;
    if (zone === 'KL') return { x: 50, y: 92 };
    if (idx === players.length - 1) return { x: 92, y: 8 }; // Korner kullanan
    if (zone === 'STP') return { x: 46 + (idx % 2) * 8, y: 12 }; // Ceza sahası kafa
    if (zone === 'SLB' || zone === 'SĞB') return { x: 35 + (idx % 2) * 30, y: 42 }; // Geride kalanlar
    if (zone === 'DOS' || zone === 'MO') return { x: 50, y: 26 }; // Yay üstü
    return { x: 34 + (idx % 3) * 16, y: 15 };
  });
}

function buildPlayersFromPreset(preset) {
  const base = preset.players.map((item, idx) => ({
    id: `p-${idx + 1}`,
    num: item.num,
    name: item.name,
    attack: { ...item.atk, instructions: [] },
    defense: { ...item.def, instructions: [] }
  }));
  const cornerCoords = buildCornerPositions(base);
  return base.map((p, idx) => ({
    ...p,
    setpiece: {
      x: cornerCoords[idx].x,
      y: cornerCoords[idx].y,
      role: p.attack.role,
      duty: p.attack.duty,
      instructions: []
    }
  }));
}

const DEFAULT_TEAM_INSTRUCTIONS = {
  mentality: 'positive',
  passing: 'short',
  tempo: 'normal',
  width: 'balanced',
  playOutOfDefense: true,
  pressing: 'high',
  defLine: 'high',
  offsideTrap: true
};

const DEFAULT_SUBS = [
  { id: 'sub-1', num: 12, name: 'Yedek Kaleci' },
  { id: 'sub-2', num: 14, name: 'Yedek Stoper' },
  { id: 'sub-3', num: 16, name: 'Yedek Orta Saha' },
  { id: 'sub-4', num: 18, name: 'Yedek Kanat' },
  { id: 'sub-5', num: 19, name: 'Yedek Forvet' }
];

function decodeUrlHash() {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#t=')) return null;
    const b64 = decodeURIComponent(hash.slice(3));
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (parsed && Array.isArray(parsed.players) && parsed.players.length >= 5) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function createInitialState() {
  const fromHash = decodeUrlHash();
  if (fromHash) {
    return normalizeLoadedState(fromHash);
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('fm27-taktik-builder-v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.players) && parsed.players.length >= 5) {
        return normalizeLoadedState(parsed);
      }
    }
  } catch {
    // Ignore
  }

  const defaultPreset = PRESETS[11][0];
  const players = buildPlayersFromPreset(defaultPreset);
  return {
    tacticName: 'Ana Takım Taktiği',
    playerCount: 11,
    presetId: defaultPreset.id,
    phase: 'attack',
    orientation: 'vertical', // 'vertical' | 'horizontal'
    showTransition: true,
    showZones: true,
    showCoverage: false,
    drawMode: 'none', // 'none' | 'pass' | 'run'
    opponentFormation: 'none',
    showAllRoles: false,
    selectedPlayerId: players[8]?.id || players[0].id,
    teamInstructions: { ...DEFAULT_TEAM_INSTRUCTIONS },
    drawings: [],
    subs: [...DEFAULT_SUBS],
    players
  };
}

function normalizeLoadedState(parsed) {
  const players = parsed.players.map((p, idx) => ({
    ...p,
    attack: { instructions: [], ...p.attack },
    defense: { instructions: [], ...p.defense },
    setpiece: p.setpiece
      ? { instructions: [], ...p.setpiece }
      : { ...p.attack, instructions: [] }
  }));
  return {
    tacticName: parsed.tacticName || 'Ana Takım Taktiği',
    playerCount: parsed.playerCount || players.length,
    presetId: parsed.presetId || null,
    phase: ['attack', 'defense', 'setpiece'].includes(parsed.phase) ? parsed.phase : 'attack',
    orientation: parsed.orientation === 'horizontal' ? 'horizontal' : 'vertical',
    showTransition: parsed.showTransition !== undefined ? Boolean(parsed.showTransition) : true,
    showZones: parsed.showZones !== undefined ? Boolean(parsed.showZones) : true,
    showCoverage: Boolean(parsed.showCoverage),
    drawMode: 'none',
    opponentFormation: parsed.opponentFormation || 'none',
    showAllRoles: Boolean(parsed.showAllRoles),
    selectedPlayerId: parsed.selectedPlayerId || players[0].id,
    teamInstructions: { ...DEFAULT_TEAM_INSTRUCTIONS, ...(parsed.teamInstructions || {}) },
    drawings: Array.isArray(parsed.drawings) ? parsed.drawings : [],
    subs: Array.isArray(parsed.subs) ? parsed.subs : [...DEFAULT_SUBS],
    players
  };
}

class Store {
  constructor() {
    this.ephemeral = Boolean(window.location.hash && window.location.hash.startsWith('#t='));
    this.state = createInitialState();
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    if (!this.ephemeral) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Ignore
      }
    }
    for (const fn of this.listeners) {
      fn(this.state);
    }
  }

  getState() {
    return this.state;
  }

  setTacticName(name) {
    this.state = { ...this.state, tacticName: name };
    this.notify();
  }

  setPhase(phase) {
    if (this.state.phase === phase) return;
    this.state = { ...this.state, phase };
    this.notify();
  }

  toggleOrientation() {
    this.state = {
      ...this.state,
      orientation: this.state.orientation === 'vertical' ? 'horizontal' : 'vertical'
    };
    this.notify();
  }

  toggleTransition() {
    this.state = { ...this.state, showTransition: !this.state.showTransition };
    this.notify();
  }

  toggleZones() {
    this.state = { ...this.state, showZones: !this.state.showZones };
    this.notify();
  }

  toggleCoverage() {
    this.state = { ...this.state, showCoverage: !this.state.showCoverage };
    this.notify();
  }

  setDrawMode(mode) {
    this.state = { ...this.state, drawMode: this.state.drawMode === mode ? 'none' : mode };
    this.notify();
  }

  addDrawing(drawing) {
    this.state = { ...this.state, drawings: [...this.state.drawings, drawing] };
    this.notify();
  }

  clearDrawings() {
    this.state = { ...this.state, drawings: [] };
    this.notify();
  }

  setOpponentFormation(id) {
    this.state = { ...this.state, opponentFormation: id };
    this.notify();
  }

  toggleShowAllRoles() {
    this.state = { ...this.state, showAllRoles: !this.state.showAllRoles };
    this.notify();
  }

  selectPlayer(playerId) {
    if (this.state.selectedPlayerId === playerId) return;
    this.state = { ...this.state, selectedPlayerId: playerId };
    this.notify();
  }

  setTeamInstruction(key, value) {
    this.state = {
      ...this.state,
      teamInstructions: { ...this.state.teamInstructions, [key]: value }
    };
    this.notify();
  }

  setPlayerCount(count) {
    const clamped = Math.max(5, Math.min(11, count));
    const presets = PRESETS[clamped] || [];
    if (presets.length > 0) {
      this.applyPreset(presets[0].id, clamped);
    }
  }

  applyPreset(presetId, countOverride = null) {
    const count = countOverride || this.state.playerCount;
    const list = PRESETS[count] || [];
    const preset = list.find(p => p.id === presetId) || list[0];
    if (!preset) return;
    const players = buildPlayersFromPreset(preset);
    this.state = {
      ...this.state,
      playerCount: count,
      presetId: preset.id,
      players,
      selectedPlayerId: players[players.length - 1]?.id || players[0].id
    };
    this.notify();
  }

  movePlayer(playerId, x, y, phase = this.state.phase) {
    const clampedX = Math.max(6, Math.min(94, Math.round(x * 10) / 10));
    const clampedY = Math.max(6, Math.min(94, Math.round(y * 10) / 10));

    const players = this.state.players.map(p => {
      if (p.id !== playerId) return p;
      const cur = p[phase] || p.attack;
      const prevZone = detectZone(cur.x, cur.y).code;
      const nextZone = detectZone(clampedX, clampedY).code;
      let nextRole = cur.role;
      let nextDuty = cur.duty;

      if (phase !== 'setpiece' && ((prevZone === 'KL' && nextZone !== 'KL') || (prevZone !== 'KL' && nextZone === 'KL'))) {
        const validRoles = getRolesForZone(nextZone);
        if (validRoles.length > 0 && !validRoles.some(r => r.id === nextRole)) {
          nextRole = validRoles[0].id;
          nextDuty = validRoles[0].duties[0];
        }
      }

      return {
        ...p,
        [phase]: {
          ...cur,
          x: clampedX,
          y: clampedY,
          role: nextRole,
          duty: nextDuty
        }
      };
    });

    this.state = { ...this.state, players, presetId: null };
    this.notify();
  }

  updatePlayerInfo(playerId, { name, num }) {
    const players = this.state.players.map(p => {
      if (p.id !== playerId) return p;
      return {
        ...p,
        name: name !== undefined ? name : p.name,
        num: num !== undefined ? num : p.num
      };
    });
    this.state = { ...this.state, players };
    this.notify();
  }

  swapPlayers(idA, idB) {
    if (!idA || !idB || idA === idB) return;
    const pA = this.state.players.find(p => p.id === idA);
    const pB = this.state.players.find(p => p.id === idB);
    if (!pA || !pB) return;

    const players = this.state.players.map(p => {
      if (p.id === idA) return { ...p, name: pB.name, num: pB.num };
      if (p.id === idB) return { ...p, name: pA.name, num: pA.num };
      return p;
    });
    this.state = { ...this.state, players };
    this.notify();
  }

  addSub(name, num) {
    const sub = {
      id: `sub-${Date.now()}`,
      name: name || 'Yeni Yedek',
      num: Number(num) || 20
    };
    this.state = { ...this.state, subs: [...this.state.subs, sub] };
    this.notify();
  }

  removeSub(subId) {
    this.state = { ...this.state, subs: this.state.subs.filter(s => s.id !== subId) };
    this.notify();
  }

  swapWithSub(subId, starterId = this.state.selectedPlayerId) {
    const sub = this.state.subs.find(s => s.id === subId);
    const starter = this.state.players.find(p => p.id === starterId) || this.state.players[0];
    if (!sub || !starter) return;

    const players = this.state.players.map(p =>
      p.id === starter.id ? { ...p, name: sub.name, num: sub.num } : p
    );
    const subs = this.state.subs.map(s =>
      s.id === sub.id ? { ...s, name: starter.name, num: starter.num } : s
    );
    this.state = { ...this.state, players, subs };
    this.notify();
  }

  setPlayerRole(playerId, roleId, phase = this.state.phase) {
    const roleObj = getRoleById(roleId);
    const players = this.state.players.map(p => {
      if (p.id !== playerId) return p;
      const cur = p[phase] || p.attack;
      const validDuty = roleObj.duties.includes(cur.duty) ? cur.duty : roleObj.duties[0];
      return {
        ...p,
        [phase]: { ...cur, role: roleId, duty: validDuty }
      };
    });
    this.state = { ...this.state, players };
    this.notify();
  }

  setPlayerDuty(playerId, dutyId, phase = this.state.phase) {
    const players = this.state.players.map(p => {
      if (p.id !== playerId) return p;
      const cur = p[phase] || p.attack;
      const roleObj = getRoleById(cur.role);
      if (!roleObj.duties.includes(dutyId)) return p;
      return {
        ...p,
        [phase]: { ...cur, duty: dutyId }
      };
    });
    this.state = { ...this.state, players };
    this.notify();
  }

  togglePlayerInstruction(playerId, instId, phase = this.state.phase) {
    const players = this.state.players.map(p => {
      if (p.id !== playerId) return p;
      const cur = p[phase] || p.attack;
      const list = cur.instructions || [];
      const next = list.includes(instId) ? list.filter(i => i !== instId) : [...list, instId];
      return {
        ...p,
        [phase]: { ...cur, instructions: next }
      };
    });
    this.state = { ...this.state, players };
    this.notify();
  }

  copyPhase(fromPhase, toPhase) {
    const players = this.state.players.map(p => ({
      ...p,
      [toPhase]: { ...p[fromPhase], instructions: [...(p[fromPhase].instructions || [])] }
    }));
    this.state = { ...this.state, players };
    this.notify();
  }

  resetToDefault() {
    const count = this.state.playerCount || 11;
    const list = PRESETS[count] || PRESETS[11];
    this.state = {
      ...this.state,
      drawings: [],
      opponentFormation: 'none',
      teamInstructions: { ...DEFAULT_TEAM_INSTRUCTIONS }
    };
    this.applyPreset(list[0].id, count);
  }

  // Taktik Slotları (localStorage)
  getSavedSlots() {
    try {
      return JSON.parse(localStorage.getItem(SLOTS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  saveToSlot(slotName) {
    const slots = this.getSavedSlots();
    const entry = {
      id: `slot-${Date.now()}`,
      name: slotName || this.state.tacticName || 'Kayıtlı Taktik',
      savedAt: new Date().toLocaleString('tr-TR'),
      data: this.state
    };
    const next = [entry, ...slots.filter(s => s.name !== entry.name)].slice(0, 10);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(next));
    this.notify();
  }

  loadSlot(slotId) {
    const slots = this.getSavedSlots();
    const found = slots.find(s => s.id === slotId);
    if (!found) return;
    this.state = normalizeLoadedState(found.data);
    this.notify();
  }

  deleteSlot(slotId) {
    const slots = this.getSavedSlots().filter(s => s.id !== slotId);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
    this.notify();
  }

  generateShareUrl() {
    const json = JSON.stringify(this.state);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return `${window.location.origin}${window.location.pathname}#t=${encodeURIComponent(b64)}`;
  }

  exportBackup() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      current: this.state,
      slots: this.getSavedSlots()
    };
  }

  importBackup(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Geçersiz yedek dosyası.');
    }

    if (Array.isArray(payload.slots)) {
      const existing = this.getSavedSlots();
      const merged = [...payload.slots];
      for (const s of existing) {
        if (!merged.some(m => m.id === s.id)) {
          merged.push(s);
        }
      }
      localStorage.setItem(SLOTS_KEY, JSON.stringify(merged.slice(0, 20)));
    }

    const targetState = payload.current || (Array.isArray(payload.players) ? payload : null);
    if (targetState && Array.isArray(targetState.players) && targetState.players.length >= 5) {
      this.ephemeral = true;
      this.state = normalizeLoadedState(targetState);
      try {
        const shareUrl = this.generateShareUrl();
        const hash = '#' + shareUrl.split('#')[1];
        window.history.replaceState(null, '', hash);
      } catch {
        // Ignore
      }
    }

    this.notify();
  }
}

export const store = new Store();
