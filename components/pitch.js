import { store, detectZone } from '../state/store.js';
import { DUTIES, getRoleById } from '../data/roles.js';
import { OPPONENT_FORMATIONS } from '../data/tactics.js';

function toScreen(x, y, isHorizontal) {
  return isHorizontal ? { sx: 100 - y, sy: x } : { sx: x, sy: y };
}

function fromScreen(sx, sy, isHorizontal) {
  return isHorizontal ? { x: sy, y: 100 - sx } : { x: sx, y: sy };
}

function toSvgCoords(x, y, isHorizontal) {
  if (isHorizontal) {
    return { vx: ((100 - y) / 100) * 140, vy: x };
  }
  return { vx: x, vy: (y / 100) * 140 };
}

export function initPitch() {
  const container = document.getElementById('pitch-container');
  const board = document.getElementById('pitch-board');
  const svg = board.querySelector('.pitch-svg');
  const playersLayer = document.getElementById('pitch-players-layer');
  const ghostLayer = document.getElementById('pitch-ghost-layer');
  const opponentLayer = document.getElementById('pitch-opponent-layer');
  const arrowsLayer = document.getElementById('pitch-arrows-layer');
  const coverageLayer = document.getElementById('pitch-coverage-layer');
  const drawingsLayer = document.getElementById('pitch-drawings-layer');
  const zonesLayer = document.getElementById('pitch-zones-layer');
  const dirTop = document.getElementById('pitch-dir-top');
  const dirBottom = document.getElementById('pitch-dir-bottom');

  // SVG saha çizgilerini yatay moda çevirmek için iç elemanları tek bir g içine alalım
  let pitchBaseGroup = svg.querySelector('#pitch-base-lines');
  if (!pitchBaseGroup) {
    pitchBaseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pitchBaseGroup.id = 'pitch-base-lines';
    const childrenToWrap = Array.from(svg.children).filter(
      el =>
        el.tagName !== 'defs' &&
        !['pitch-coverage-layer', 'pitch-arrows-layer', 'pitch-drawings-layer'].includes(el.id)
    );
    childrenToWrap.forEach(el => pitchBaseGroup.appendChild(el));
    svg.insertBefore(pitchBaseGroup, coverageLayer);
  }

  let dragInfo = null;
  let drawPreview = null;

  // Saha üzerinde çizim modu (Pas / Koşu oku)
  board.addEventListener('pointerdown', (e) => {
    const state = store.getState();
    if (state.drawMode === 'none') return;
    if (e.target.closest('.player-token')) return;

    e.preventDefault();
    const isH = state.orientation === 'horizontal';
    const rect = board.getBoundingClientRect();
    const sx = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const sy = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));
    const start = fromScreen(sx, sy, isH);

    board.setPointerCapture(e.pointerId);
    drawPreview = {
      type: state.drawMode,
      x1: start.x,
      y1: start.y,
      x2: start.x,
      y2: start.y,
      isH
    };
  });

  board.addEventListener('pointermove', (e) => {
    if (!drawPreview) return;
    const rect = board.getBoundingClientRect();
    const sx = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const sy = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));
    const end = fromScreen(sx, sy, drawPreview.isH);
    drawPreview.x2 = end.x;
    drawPreview.y2 = end.y;
    renderDrawings(store.getState(), drawPreview);
  });

  const finishDraw = () => {
    if (!drawPreview) return;
    const dist = Math.hypot(drawPreview.x2 - drawPreview.x1, drawPreview.y2 - drawPreview.y1);
    const finished = drawPreview;
    drawPreview = null;
    if (dist > 4) {
      store.addDrawing({
        id: `d-${Date.now()}`,
        type: finished.type,
        x1: Math.round(finished.x1 * 10) / 10,
        y1: Math.round(finished.y1 * 10) / 10,
        x2: Math.round(finished.x2 * 10) / 10,
        y2: Math.round(finished.y2 * 10) / 10
      });
    } else {
      renderDrawings(store.getState(), null);
    }
  };

  board.addEventListener('pointerup', finishDraw);
  board.addEventListener('pointercancel', finishDraw);

  function renderDrawings(state, preview = null) {
    const isH = state.orientation === 'horizontal';
    drawingsLayer.innerHTML = '';
    const all = preview ? [...state.drawings, preview] : state.drawings;

    for (const d of all) {
      const p1 = toSvgCoords(d.x1, d.y1, isH);
      const p2 = toSvgCoords(d.x2, d.y2, isH);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.vx);
      line.setAttribute('y1', p1.vy);
      line.setAttribute('x2', p2.vx);
      line.setAttribute('y2', p2.vy);
      line.setAttribute('stroke', d.type === 'pass' ? '#38BDF8' : '#FACC15');
      line.setAttribute('stroke-width', '0.9');
      if (d.type === 'run') {
        line.setAttribute('stroke-dasharray', '2.2 1.6');
      }
      line.setAttribute('marker-end', d.type === 'pass' ? 'url(#arrow-pass)' : 'url(#arrow-run)');
      drawingsLayer.appendChild(line);
    }
  }

  function render(state) {
    const {
      players,
      phase,
      selectedPlayerId,
      showTransition,
      showZones,
      showCoverage,
      orientation,
      opponentFormation,
      drawMode
    } = state;

    const isH = orientation === 'horizontal';
    const otherPhase = phase === 'attack' ? 'defense' : 'attack';

    container.classList.toggle('is-horizontal', isH);
    board.classList.toggle('drawing-active', drawMode !== 'none');

    if (isH) {
      svg.setAttribute('viewBox', '0 0 140 100');
      pitchBaseGroup.setAttribute('transform', 'translate(140, 0) rotate(90)');
      dirTop.textContent = 'KENDİ KALEMİZ  ◀━━━━━━━━━━  HÜCUM YÖNÜ (RAKİP KALE) ▶';
      dirBottom.textContent = '';
    } else {
      svg.setAttribute('viewBox', '0 0 100 140');
      pitchBaseGroup.removeAttribute('transform');
      dirTop.textContent = '▲ RAKİP KALE (HÜCUM YÖNÜ) ▲';
      dirBottom.textContent = 'KENDİ KALEMİZ';
    }

    zonesLayer.style.display = showZones ? 'block' : 'none';
    ghostLayer.innerHTML = '';
    opponentLayer.innerHTML = '';
    arrowsLayer.innerHTML = '';
    coverageLayer.innerHTML = '';
    playersLayer.innerHTML = '';

    // Rakip Hayalet Diziliş
    const opp = OPPONENT_FORMATIONS[opponentFormation];
    if (opp && opp.players.length > 0) {
      for (const op of opp.players) {
        const { sx, sy } = toScreen(op.x, op.y, isH);
        const el = document.createElement('div');
        el.className = 'opponent-token';
        el.style.left = `${sx}%`;
        el.style.top = `${sy}%`;
        el.textContent = op.label;
        opponentLayer.appendChild(el);
      }
    }

    for (const player of players) {
      const pos = player[phase] || player.attack;
      const otherPos = player[otherPhase] || player.attack;
      const zone = detectZone(pos.x, pos.y);
      const role = getRoleById(pos.role);
      const duty = DUTIES[pos.duty] || DUTIES.support;
      const screenPos = toScreen(pos.x, pos.y, isH);

      // Bölge Kapsama Halkası
      if (showCoverage) {
        const cPos = toSvgCoords(pos.x, pos.y, isH);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cPos.vx);
        circle.setAttribute('cy', cPos.vy);
        circle.setAttribute('r', '14.5');
        circle.setAttribute('fill', duty.color);
        circle.setAttribute('fill-opacity', '0.18');
        circle.setAttribute('stroke', duty.color);
        circle.setAttribute('stroke-opacity', '0.35');
        circle.setAttribute('stroke-width', '0.4');
        coverageLayer.appendChild(circle);
      }

      // Geçiş hayaletleri ve okları (Duran top modunda gösterme)
      if (showTransition && phase !== 'setpiece') {
        const dist = Math.hypot(pos.x - otherPos.x, pos.y - otherPos.y);
        if (dist > 3.5) {
          const otherScreen = toScreen(otherPos.x, otherPos.y, isH);
          const ghost = document.createElement('div');
          ghost.className = 'ghost-token';
          ghost.style.left = `${otherScreen.sx}%`;
          ghost.style.top = `${otherScreen.sy}%`;
          ghost.textContent = String(player.num);
          ghostLayer.appendChild(ghost);

          const p1 = toSvgCoords(otherPos.x, otherPos.y, isH);
          const p2 = toSvgCoords(pos.x, pos.y, isH);
          const mx = (p1.vx + p2.vx) / 2 + (p1.vy - p2.vy) * 0.08;
          const my = (p1.vy + p2.vy) / 2 + (p2.vx - p1.vx) * 0.08;

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${p1.vx} ${p1.vy} Q ${mx} ${my} ${p2.vx} ${p2.vy}`);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'rgba(255,255,255,0.68)');
          path.setAttribute('stroke-width', '0.65');
          path.setAttribute('stroke-dasharray', '1.8 1.5');
          path.setAttribute('marker-end', 'url(#arrow-atk)');
          arrowsLayer.appendChild(path);
        }
      }

      // Aktif Oyuncu Tokenı
      const token = document.createElement('div');
      token.className = `player-token${player.id === selectedPlayerId ? ' selected' : ''}`;
      token.dataset.playerId = player.id;
      token.style.left = `${screenPos.sx}%`;
      token.style.top = `${screenPos.sy}%`;
      token.style.setProperty('--duty-color', duty.color);

      token.innerHTML = `
        <div class="player-circle">
          <span class="player-duty-badge" title="${duty.label}">${duty.short[0]}</span>
          <span class="player-circle-num">${player.num}</span>
          <span class="player-circle-zone">${zone.code}</span>
        </div>
        <div class="player-tag">
          <div class="player-tag-name">${escapeHtml(player.name)}</div>
          <div class="player-tag-role">${role.shortName} · ${duty.short}</div>
        </div>
      `;

      token.addEventListener('pointerdown', (e) => {
        if (store.getState().drawMode !== 'none') return;
        e.preventDefault();
        store.selectPlayer(player.id);
        token.setPointerCapture(e.pointerId);
        token.classList.add('dragging');
        const rect = board.getBoundingClientRect();
        dragInfo = {
          playerId: player.id,
          token,
          rect,
          isH,
          currentX: pos.x,
          currentY: pos.y
        };
      });

      token.addEventListener('pointermove', (e) => {
        if (!dragInfo || dragInfo.playerId !== player.id) return;
        const { rect } = dragInfo;
        const sx = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
        const sy = Math.max(6, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
        const logical = fromScreen(sx, sy, dragInfo.isH);

        dragInfo.currentX = Math.max(6, Math.min(94, logical.x));
        dragInfo.currentY = Math.max(6, Math.min(94, logical.y));
        token.style.left = `${sx}%`;
        token.style.top = `${sy}%`;

        const liveZone = detectZone(dragInfo.currentX, dragInfo.currentY);
        const zoneEl = token.querySelector('.player-circle-zone');
        if (zoneEl) zoneEl.textContent = liveZone.code;
      });

      const finishDrag = () => {
        if (!dragInfo || dragInfo.playerId !== player.id) return;
        token.classList.remove('dragging');
        const { currentX, currentY } = dragInfo;
        dragInfo = null;
        store.movePlayer(player.id, currentX, currentY);
      };

      token.addEventListener('pointerup', finishDrag);
      token.addEventListener('pointercancel', finishDrag);

      playersLayer.appendChild(token);
    }

    renderDrawings(state);
  }

  store.subscribe(render);
  render(store.getState());
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
