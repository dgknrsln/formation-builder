import { detectZone, computeFormationCode } from '../state/store.js';
import { DUTIES, getRoleById } from '../data/roles.js';
import { MENTALITIES, TEAM_INSTRUCTION_GROUPS, PLAYER_INSTRUCTIONS } from '../data/tactics.js';

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth, maxLines = 2) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  if (lines.length === maxLines && words.length > 0) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth - 12) {
      lines[maxLines - 1] = last.slice(0, Math.max(0, last.length - 3)) + '...';
    }
  }
  return lines;
}

function drawPitch(ctx, px, py, pw, ph, players, phase) {
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 16);
  ctx.clip();

  // Çim şeritleri
  const stripeCount = 14;
  const stripeH = ph / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#25733F' : '#2A7D46';
    ctx.fillRect(px, py + i * stripeH, pw, stripeH + 1);
  }

  // Saha çizgileri (0..100 x 0..140 oranına göre)
  const sx = x => px + (x / 100) * pw;
  const sy = y => py + (y / 140) * ph;

  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.lineWidth = 2.2;

  // Dış çizgi
  ctx.strokeRect(sx(3), sy(3), sx(97) - sx(3), sy(137) - sy(3));

  // Orta çizgi & daire
  ctx.beginPath();
  ctx.moveTo(sx(3), sy(70));
  ctx.lineTo(sx(97), sy(70));
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sx(50), sy(70), (11 / 100) * pw, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sx(50), sy(70), 3, 0, Math.PI * 2);
  ctx.fill();

  // Üst ceza sahası (Rakip)
  ctx.strokeRect(sx(22), sy(3), sx(78) - sx(22), sy(23) - sy(3));
  ctx.strokeRect(sx(36), sy(3), sx(64) - sx(36), sy(10) - sy(3));
  ctx.strokeRect(sx(42), sy(1.2), sx(58) - sx(42), sy(3) - sy(1.2));
  ctx.beginPath();
  ctx.arc(sx(50), sy(15), 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx(50), sy(15), (12 / 100) * pw, 0.23 * Math.PI, 0.77 * Math.PI);
  ctx.stroke();

  // Alt ceza sahası (Kendi)
  ctx.strokeRect(sx(22), sy(117), sx(78) - sx(22), sy(137) - sy(117));
  ctx.strokeRect(sx(36), sy(130), sx(64) - sx(36), sy(137) - sy(130));
  ctx.strokeRect(sx(42), sy(137), sx(58) - sx(42), sy(138.8) - sy(137));
  ctx.beginPath();
  ctx.arc(sx(50), sy(125), 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx(50), sy(125), (12 / 100) * pw, 1.23 * Math.PI, 1.77 * Math.PI);
  ctx.stroke();

  // Oyuncular
  for (const player of players) {
    const pos = player[phase];
    const zone = detectZone(pos.x, pos.y);
    const role = getRoleById(pos.role);
    const duty = DUTIES[pos.duty] || DUTIES.support;

    const cx = px + (pos.x / 100) * pw;
    const cy = py + (pos.y / 100) * ph;

    // Daire gölge
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.32)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Görev rengi çerçeve
    ctx.strokeStyle = duty.color;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();

    // Forma numarası & Bölge
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 15px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(player.num), cx, cy - 3);

    ctx.fillStyle = '#64748B';
    ctx.font = `700 9.5px ${FONT}`;
    ctx.fillText(zone.code, cx, cy + 10);

    // Sağ üst görev rozeti
    ctx.fillStyle = duty.color;
    ctx.beginPath();
    ctx.arc(cx + 16, cy - 16, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 9px ${FONT}`;
    ctx.fillText(duty.short[0], cx + 16, cy - 15.5);

    // İsim & Rol etiketi
    const tagW = 104;
    const tagH = 30;
    const tagX = cx - tagW / 2;
    const tagY = cy + 25;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    roundRect(ctx, tagX, tagY, tagW, tagH, 6);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0F172A';
    ctx.font = `700 11.5px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(truncate(ctx, player.name, tagW - 10), cx, tagY + 10);

    ctx.fillStyle = '#475569';
    ctx.font = `600 10px ${FONT}`;
    ctx.fillText(`${role.shortName} · ${duty.short}`, cx, tagY + 22);
  }

  ctx.restore();

  // Dış beyaz kenarlık
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  roundRect(ctx, px, py, pw, ph, 16);
  ctx.stroke();
}

function truncate(ctx, text, maxW) {
  let s = String(text || '');
  if (ctx.measureText(s).width <= maxW) return s;
  while (s.length > 1 && ctx.measureText(s + '…').width > maxW) {
    s = s.slice(0, -1);
  }
  return s + '…';
}

/**
 * Tekil faz (Atak VEYA Karşılama) için saha + tüm oyuncuların özel rol/görev açıklamalarını içeren PNG üretir.
 */
export function renderPhaseCanvas(state, phase) {
  const width = 1440;
  const height = 960;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const isAtk = phase === 'attack';
  const shapeCode = computeFormationCode(state.players, phase);
  const phaseTitle = isAtk ? 'Atak Dizilişi (Topa Sahipken)' : 'Karşılama Dizilişi (Top Rakipteyken)';
  const accentColor = isAtk ? '#0284C7' : '#D97706';
  const accentBg = isAtk ? '#E0F2FE' : '#FEF3C7';

  // Arka plan (Açık Mod)
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, width, height);

  // Üst Başlık Bandı
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 84);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 84);
  ctx.lineTo(width, 84);
  ctx.stroke();

  // FM27 Rozeti
  ctx.fillStyle = '#0F172A';
  roundRect(ctx, 32, 22, 72, 40, 8);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 16px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FM27', 68, 42);

  // Başlık
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `800 22px ${FONT}`;
  const tName = state.tacticName ? `${state.tacticName} — ` : '';
  ctx.fillText(`${tName}${phaseTitle}`, 120, 34);

  const ment = MENTALITIES.find(m => m.id === state.teamInstructions?.mentality)?.label || 'Pozitif';
  const pass = TEAM_INSTRUCTION_GROUPS.passing.find(p => p.id === state.teamInstructions?.passing)?.label || 'Kısa Pas';
  const press = TEAM_INSTRUCTION_GROUPS.pressing.find(p => p.id === state.teamInstructions?.pressing)?.label || 'Yüksek';
  ctx.fillStyle = '#64748B';
  ctx.font = `500 13px ${FONT}`;
  ctx.fillText(`${state.playerCount} Oyuncu · ${ment} · ${pass} · ${press}`, 120, 57);

  // Sağ Üst Diziliş Rozeti
  ctx.fillStyle = accentBg;
  roundRect(ctx, width - 250, 22, 218, 40, 999);
  ctx.fill();
  ctx.fillStyle = accentColor;
  ctx.font = `800 16px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`Diziliş: ${shapeCode}`, width - 141, 42);

  // Sol: Saha
  const pitchX = 32;
  const pitchY = 108;
  const pitchW = 580;
  const pitchH = 800;
  drawPitch(ctx, pitchX, pitchY, pitchW, pitchH, state.players, phase);

  // Sağ: Oyuncu Rol Taktikleri Paneli
  const panelX = 640;
  const panelY = 108;
  const panelW = width - panelX - 32;
  const panelH = 820;

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, panelX, panelY, panelW, panelH, 14);
  ctx.fill();
  ctx.strokeStyle = '#DBE3EE';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = `800 16px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText('OYUNCULARA ÖZEL ROL VE GÖREV TAKTİKLERİ', panelX + 22, panelY + 28);

  const rowGap = 6;
  const startY = panelY + 50;
  const availH = panelH - 64;
  const rowH = Math.min(68, Math.floor((availH - rowGap * (state.players.length - 1)) / state.players.length));

  state.players.forEach((player, idx) => {
    const pos = player[phase];
    const zone = detectZone(pos.x, pos.y);
    const role = getRoleById(pos.role);
    const duty = DUTIES[pos.duty] || DUTIES.support;
    const detail = role.dutyDetails[duty.id] || role.summary;

    const ry = startY + idx * (rowH + rowGap);
    ctx.fillStyle = '#F8FAFC';
    roundRect(ctx, panelX + 18, ry, panelW - 36, rowH, 8);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sol renk şeridi
    ctx.fillStyle = duty.color;
    roundRect(ctx, panelX + 18, ry, 5, rowH, 3);
    ctx.fill();

    // Numara
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, panelX + 32, ry + (rowH - 32) / 2, 32, 32, 7);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 13px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(String(player.num), panelX + 48, ry + rowH / 2);

    // İsim & Bölge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = `700 13.5px ${FONT}`;
    ctx.fillText(truncate(ctx, player.name, 145), panelX + 76, ry + 20);

    ctx.fillStyle = '#64748B';
    ctx.font = `600 11px ${FONT}`;
    ctx.fillText(`${zone.code} · ${zone.label}`, panelX + 76, ry + 39);

    // Rol & Görev
    ctx.fillStyle = '#0F172A';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillText(truncate(ctx, role.name, 200), panelX + 235, ry + 20);

    // Görev Hapı
    ctx.fillStyle = duty.bg;
    roundRect(ctx, panelX + 235, ry + 29, 76, 20, 999);
    ctx.fill();
    ctx.strokeStyle = duty.border;
    ctx.stroke();
    ctx.fillStyle = duty.color;
    ctx.font = `700 10.5px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(duty.label, panelX + 273, ry + 39.5);

    // Taktik Açıklama
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = `400 11.5px ${FONT}`;
    const descX = panelX + 440;
    const descW = panelW - 440 - 30;
    const lines = wrapText(ctx, detail, descW, rowH >= 58 ? 2 : 1);
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, descX, ry + (lines.length === 1 ? rowH / 2 : 21 + lIdx * 17));
    });
  });

  return canvas;
}

/**
 * Hem Atak hem Karşılama sahasını ve iki fazdaki tüm özel rolleri yan yana gösteren birleşik PNG üretir.
 */
export function renderCombinedCanvas(state) {
  const width = 1600;
  const rowH = 38;
  const tableHeaderH = 44;
  const tableH = tableHeaderH + state.players.length * rowH + 24;
  const height = 90 + 680 + 24 + tableH + 28;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, width, height);

  // Üst Başlık
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 74);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 74);
  ctx.lineTo(width, 74);
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  roundRect(ctx, 32, 17, 70, 40, 8);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 16px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FM27', 67, 37);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `800 21px ${FONT}`;
  ctx.fillText(`${state.tacticName || 'Taktik'} — Atak & Karşılama Özeti`, 118, 29);

  const atkShape = computeFormationCode(state.players, 'attack');
  const defShape = computeFormationCode(state.players, 'defense');
  ctx.fillStyle = '#64748B';
  ctx.font = `600 13px ${FONT}`;
  ctx.fillText(
    `${state.playerCount} Oyuncu  ·  Atak: ${atkShape}  |  Karşılama: ${defShape}`,
    118,
    51
  );

  // İki Saha Yan Yana
  const pitchW = 490;
  const pitchH = 650;
  const leftPitchX = 165;
  const rightPitchX = width - 165 - pitchW;
  const pitchTopY = 122;

  // Saha Etiketleri
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0369A1';
  ctx.font = `800 16px ${FONT}`;
  ctx.fillText(`ATAK (TOPA SAHİPKEN) — ${atkShape}`, leftPitchX + pitchW / 2, 102);

  ctx.fillStyle = '#B45309';
  ctx.fillText(`KARŞILAMA (TOP RAKİPTEYKEN) — ${defShape}`, rightPitchX + pitchW / 2, 102);

  drawPitch(ctx, leftPitchX, pitchTopY, pitchW, pitchH, state.players, 'attack');
  drawPitch(ctx, rightPitchX, pitchTopY, pitchW, pitchH, state.players, 'defense');

  // Alt Tablo: Tüm Oyuncuların Atak & Karşılama Rolleri
  const tableX = 32;
  const tableY = pitchTopY + pitchH + 24;
  const tableW = width - 64;

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, tableX, tableY, tableW, tableH, 14);
  ctx.fill();
  ctx.strokeStyle = '#DBE3EE';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  roundRect(ctx, tableX, tableY, tableW, tableHeaderH, 12);
  ctx.fill();

  ctx.fillStyle = '#475569';
  ctx.font = `800 12px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText('#', tableX + 20, tableY + 23);
  ctx.fillText('OYUNCU', tableX + 64, tableY + 23);
  ctx.fillText('ATAK (TOPA SAHİPKEN) ROLÜ & GÖREVİ', tableX + 270, tableY + 23);
  ctx.fillText('KARŞILAMA (TOP RAKİPTEYKEN) ROLÜ & GÖREVİ', tableX + 920, tableY + 23);

  state.players.forEach((p, idx) => {
    const ry = tableY + tableHeaderH + idx * rowH;
    if (idx % 2 === 1) {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(tableX + 2, ry, tableW - 4, rowH);
    }

    const atkZone = detectZone(p.attack.x, p.attack.y);
    const atkRole = getRoleById(p.attack.role);
    const atkDuty = DUTIES[p.attack.duty] || DUTIES.support;

    const defZone = detectZone(p.defense.x, p.defense.y);
    const defRole = getRoleById(p.defense.role);
    const defDuty = DUTIES[p.defense.duty] || DUTIES.support;

    ctx.fillStyle = '#0F172A';
    ctx.font = `800 12.5px ${FONT}`;
    ctx.fillText(String(p.num), tableX + 20, ry + rowH / 2);
    ctx.font = `700 13px ${FONT}`;
    ctx.fillText(truncate(ctx, p.name, 190), tableX + 64, ry + rowH / 2);

    // Atak hücresi
    ctx.fillStyle = atkDuty.color;
    ctx.beginPath();
    ctx.arc(tableX + 276, ry + rowH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.font = `600 12.5px ${FONT}`;
    ctx.fillText(
      `[${atkZone.code}] ${atkRole.name} (${atkDuty.label})`,
      tableX + 290,
      ry + rowH / 2
    );

    // Karşılama hücresi
    ctx.fillStyle = defDuty.color;
    ctx.beginPath();
    ctx.arc(tableX + 926, ry + rowH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.fillText(
      `[${defZone.code}] ${defRole.name} (${defDuty.label})`,
      tableX + 940,
      ry + rowH / 2
    );
  });

  return canvas;
}

/**
 * Tek bir oyuncu için "Atakta Ne Yapacak / Savunmada Ne Yapacak" detaylı kişisel taktik kartı PNG'si üretir.
 */
export function renderPlayerCardCanvas(state, player) {
  const width = 1040;
  const height = 660;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const atkZone = detectZone(player.attack.x, player.attack.y);
  const atkRole = getRoleById(player.attack.role);
  const atkDuty = DUTIES[player.attack.duty] || DUTIES.support;
  const atkDutyDetail = atkRole.dutyDetails[atkDuty.id] || atkDuty.generalDesc;

  const defZone = detectZone(player.defense.x, player.defense.y);
  const defRole = getRoleById(player.defense.role);
  const defDuty = DUTIES[player.defense.duty] || DUTIES.support;
  const defDutyDetail = defRole.dutyDetails[defDuty.id] || defDuty.generalDesc;

  // Açık Mod Arka Plan
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, width, height);

  // Üst Başlık
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 86);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 86);
  ctx.lineTo(width, 86);
  ctx.stroke();

  // Forma Numarası Kutusu
  ctx.fillStyle = '#0F172A';
  roundRect(ctx, 28, 18, 52, 50, 10);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 22px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(player.num), 54, 43);

  // Oyuncu Adı & Alt Bilgi
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `800 22px ${FONT}`;
  ctx.fillText(player.name, 96, 35);

  ctx.fillStyle = '#64748B';
  ctx.font = `600 13px ${FONT}`;
  ctx.fillText(
    `FM27 Kişisel Taktik Kartı  ·  Atak: ${atkZone.code} (${atkZone.label})  |  Karşılama: ${defZone.code} (${defZone.label})`,
    96,
    58
  );

  // Sol: Mini Saha (Oyuncunun Atak vs Karşılama Hareketi)
  const miniX = 28;
  const miniY = 108;
  const miniW = 310;
  const miniH = 430;

  ctx.save();
  roundRect(ctx, miniX, miniY, miniW, miniH, 14);
  ctx.clip();

  const stripeH = miniH / 12;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#25733F' : '#2A7D46';
    ctx.fillRect(miniX, miniY + i * stripeH, miniW, stripeH + 1);
  }

  const sx = x => miniX + (x / 100) * miniW;
  const sy = y => miniY + (y / 140) * miniH;

  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(sx(4), sy(4), sx(96) - sx(4), sy(136) - sy(4));
  ctx.beginPath();
  ctx.moveTo(sx(4), sy(70));
  ctx.lineTo(sx(96), sy(70));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx(50), sy(70), (11 / 100) * miniW, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(sx(22), sy(4), sx(78) - sx(22), sy(23) - sy(4));
  ctx.strokeRect(sx(22), sy(117), sx(78) - sx(22), sy(136) - sy(117));

  // Karşılama -> Atak oku
  const ax = miniX + (player.attack.x / 100) * miniW;
  const ay = miniY + (player.attack.y / 100) * miniH;
  const dx = miniX + (player.defense.x / 100) * miniW;
  const dy = miniY + (player.defense.y / 100) * miniH;

  if (Math.hypot(ax - dx, ay - dy) > 8) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    ctx.restore();
  }

  // Karşılama noktası (Kehribar)
  ctx.fillStyle = '#FEF3C7';
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(dx, dy, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#B45309';
  ctx.font = `800 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('KAR', dx, dy + 0.5);

  // Atak noktası (Mavi)
  ctx.fillStyle = '#E0F2FE';
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ax, ay, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#0369A1';
  ctx.font = `800 11px ${FONT}`;
  ctx.fillText('ATK', ax, ay + 0.5);

  ctx.restore();

  // Mini saha çerçevesi & alt lejant
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  roundRect(ctx, miniX, miniY, miniW, miniH, 14);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, miniX, miniY + miniH + 12, miniW, 84, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText('ÖNE ÇIKAN ÖZELLİKLER', miniX + 14, miniY + miniH + 30);

  const combinedAttrs = Array.from(new Set([...atkRole.attributes, ...defRole.attributes])).slice(0, 6);
  let chipX = miniX + 14;
  let chipY = miniY + miniH + 46;
  ctx.font = `600 11px ${FONT}`;
  for (const attr of combinedAttrs) {
    const w = ctx.measureText(attr).width + 16;
    if (chipX + w > miniX + miniW - 12) {
      chipX = miniX + 14;
      chipY += 24;
    }
    ctx.fillStyle = '#F8FAFC';
    roundRect(ctx, chipX, chipY, w, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.fillText(attr, chipX + 8, chipY + 10.5);
    chipX += w + 6;
  }

  // Sağ Üst Kart: ATAKTA NE YAPACAK?
  const cardX = 362;
  const cardW = width - cardX - 28;
  drawPhaseDetailBox(ctx, {
    x: cardX,
    y: 108,
    w: cardW,
    h: 254,
    phaseTitle: 'ATAKTA NE YAPACAK? (TOPA SAHİPKEN)',
    accentColor: '#0284C7',
    accentBg: '#E0F2FE',
    zone: atkZone,
    role: atkRole,
    duty: atkDuty,
    dutyDetail: atkDutyDetail,
    behaviorLabel: 'Topla Davranış',
    behaviorText: atkRole.onBall,
    instructions: player.attack.instructions || []
  });

  // Sağ Alt Kart: SAVUNMADA / KARŞILAMADA NE YAPACAK?
  drawPhaseDetailBox(ctx, {
    x: cardX,
    y: 380,
    w: cardW,
    h: 254,
    phaseTitle: 'SAVUNMADA NE YAPACAK? (TOP RAKİPTEYKEN)',
    accentColor: '#D97706',
    accentBg: '#FEF3C7',
    zone: defZone,
    role: defRole,
    duty: defDuty,
    dutyDetail: defDutyDetail,
    behaviorLabel: 'Topsuz Davranış',
    behaviorText: defRole.offBall,
    instructions: player.defense.instructions || []
  });

  return canvas;
}

function drawPhaseDetailBox(ctx, opts) {
  const { x, y, w, h, phaseTitle, accentColor, accentBg, zone, role, duty, dutyDetail, behaviorLabel, behaviorText } = opts;

  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = '#DBE3EE';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Üst şerit
  ctx.fillStyle = accentBg;
  roundRect(ctx, x, y, w, 38, 12);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accentColor;
  ctx.font = `800 12.5px ${FONT}`;
  ctx.fillText(phaseTitle, x + 16, y + 19);

  // Bölge rozeti
  ctx.textAlign = 'right';
  ctx.fillText(`${zone.code} · ${zone.label}`, x + w - 16, y + 19);

  // Rol Adı + Görev Rozeti
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `800 17px ${FONT}`;
  ctx.fillText(role.name, x + 16, y + 60);

  const roleW = ctx.measureText(role.name).width;
  ctx.fillStyle = duty.bg;
  roundRect(ctx, x + 28 + roleW, y + 48, 108, 24, 999);
  ctx.fill();
  ctx.strokeStyle = duty.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = duty.color;
  ctx.font = `700 11.5px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`${duty.label} Görevi`, x + 28 + roleW + 54, y + 60.5);

  // Rol özeti
  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = `500 12.5px ${FONT}`;
  const summaryLines = wrapText(ctx, role.summary, w - 34, 2);
  summaryLines.forEach((line, idx) => {
    ctx.fillText(line, x + 16, y + 88 + idx * 17);
  });

  // Görev Etkisi Kutusu
  const boxY = y + 126;
  ctx.fillStyle = '#F8FAFC';
  roundRect(ctx, x + 16, boxY, w - 32, 62, 8);
  ctx.fill();
  ctx.fillStyle = duty.color;
  roundRect(ctx, x + 16, boxY, 4, 62, 2);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.font = `700 11px ${FONT}`;
  ctx.fillText(`"${duty.label}" GÖREVİNDE YAPACAKLARI:`, x + 28, boxY + 15);

  ctx.fillStyle = '#334155';
  ctx.font = `500 12px ${FONT}`;
  const dutyLines = wrapText(ctx, dutyDetail, w - 52, 2);
  dutyLines.forEach((line, idx) => {
    ctx.fillText(line, x + 28, boxY + 34 + idx * 16);
  });

  // Topla / Topsuz Davranış + Bireysel Talimatlar
  const instIds = (opts.instructions || []).map(id => PLAYER_INSTRUCTIONS.find(i => i.id === id)?.label).filter(Boolean);
  const fullBeh = instIds.length > 0 ? `${behaviorText}  |  Ek Talimat: ${instIds.join(', ')}` : behaviorText;

  ctx.fillStyle = '#0F172A';
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText(`${behaviorLabel}:`, x + 16, y + 208);

  const labelW = ctx.measureText(`${behaviorLabel}: `).width;
  ctx.fillStyle = '#475569';
  ctx.font = `500 12px ${FONT}`;
  const behLines = wrapText(ctx, fullBeh, w - 34 - labelW, 2);
  behLines.forEach((line, idx) => {
    ctx.fillText(line, idx === 0 ? x + 18 + labelW : x + 16, y + 208 + idx * 16);
  });
}

export function downloadCanvasAsPng(canvas, filename) {
  return new Promise(resolve => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve();
      }, 'image/png');
    } else {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      resolve();
    }
  });
}
