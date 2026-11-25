import { store, detectZone, computeFormationCode } from './state/store.js';
import { PRESETS } from './data/presets.js';
import { DUTIES, getRoleById } from './data/roles.js';
import {
  MENTALITIES,
  TEAM_INSTRUCTION_GROUPS,
  OPPONENT_FORMATIONS,
  analyzeTactics
} from './data/tactics.js';
import { initPitch } from './components/pitch.js';
import { initInspector } from './components/inspector.js';
import { initRoleModal } from './components/roleModal.js';
import {
  renderPhaseCanvas,
  renderCombinedCanvas,
  renderPlayerCardCanvas,
  downloadCanvasAsPng
} from './utils/exportPng.js';

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function initTopbar() {
  const tacticNameInput = document.getElementById('tactic-name-input');
  const countPills = document.getElementById('player-count-pills');
  const presetSelect = document.getElementById('preset-select');
  const btnAttack = document.getElementById('btn-phase-attack');
  const btnDefense = document.getElementById('btn-phase-defense');
  const btnSetpiece = document.getElementById('btn-phase-setpiece');
  const btnReset = document.getElementById('btn-reset');
  const exportDropdown = document.getElementById('export-dropdown');
  const btnExportMenu = document.getElementById('btn-export-menu');
  const exportMenu = document.getElementById('export-menu');
  const toggleTransition = document.getElementById('toggle-transition');
  const toggleZones = document.getElementById('toggle-zones');
  const toggleCoverage = document.getElementById('toggle-coverage');
  const btnOrientation = document.getElementById('btn-orientation');
  const opponentSelect = document.getElementById('opponent-select');
  const btnDrawPass = document.getElementById('btn-draw-pass');
  const btnDrawRun = document.getElementById('btn-draw-run');
  const btnClearDrawings = document.getElementById('btn-clear-drawings');

  tacticNameInput.addEventListener('input', () => {
    store.setTacticName(tacticNameInput.value);
  });

  const counts = [5, 6, 7, 8, 9, 10, 11];
  countPills.innerHTML = counts
    .map(c => `<button type="button" class="pill-btn" data-count="${c}">${c}</button>`)
    .join('');

  countPills.querySelectorAll('[data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setPlayerCount(Number(btn.dataset.count));
    });
  });

  presetSelect.addEventListener('change', () => {
    if (presetSelect.value) {
      store.applyPreset(presetSelect.value);
    }
  });

  btnAttack.addEventListener('click', () => store.setPhase('attack'));
  btnDefense.addEventListener('click', () => store.setPhase('defense'));
  btnSetpiece.addEventListener('click', () => store.setPhase('setpiece'));

  toggleTransition.addEventListener('change', () => store.toggleTransition());
  toggleZones.addEventListener('change', () => store.toggleZones());
  toggleCoverage.addEventListener('change', () => store.toggleCoverage());
  btnOrientation.addEventListener('click', () => store.toggleOrientation());

  opponentSelect.innerHTML = Object.values(OPPONENT_FORMATIONS)
    .map(op => `<option value="${op.id}">${op.name}</option>`)
    .join('');
  opponentSelect.addEventListener('change', () => {
    store.setOpponentFormation(opponentSelect.value);
  });

  btnDrawPass.addEventListener('click', () => store.setDrawMode('pass'));
  btnDrawRun.addEventListener('click', () => store.setDrawMode('run'));
  btnClearDrawings.addEventListener('click', () => {
    store.clearDrawings();
    showToast('Saha çizimleri temizlendi.');
  });

  btnReset.addEventListener('click', () => {
    store.resetToDefault();
    showToast('Diziliş varsayılan şablona sıfırlandı.');
  });

  const closeExportMenu = () => {
    exportMenu.hidden = true;
    btnExportMenu.setAttribute('aria-expanded', 'false');
  };

  btnExportMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !exportMenu.hidden;
    exportMenu.hidden = isOpen;
    btnExportMenu.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!exportDropdown.contains(e.target)) {
      closeExportMenu();
    }
  });

  exportMenu.querySelectorAll('[data-export]').forEach(item => {
    item.addEventListener('click', async () => {
      const mode = item.dataset.export;
      const state = store.getState();
      const atkCode = computeFormationCode(state.players, 'attack');
      const defCode = computeFormationCode(state.players, 'defense');
      closeExportMenu();

      if (mode === 'both-single') {
        const atkCanvas = renderPhaseCanvas(state, 'attack');
        await downloadCanvasAsPng(atkCanvas, `taktik-atak-${atkCode}.png`);
        const defCanvas = renderPhaseCanvas(state, 'defense');
        await downloadCanvasAsPng(defCanvas, `taktik-karsilama-${defCode}.png`);
        showToast('Atak ve Karşılama PNG dosyaları indirildi!');
      } else if (mode === 'combined') {
        const combinedCanvas = renderCombinedCanvas(state);
        await downloadCanvasAsPng(combinedCanvas, `taktik-birlesik-${atkCode}-vs-${defCode}.png`);
        showToast('Birleşik Atak & Karşılama PNG indirildi!');
      } else if (mode === 'attack') {
        const atkCanvas = renderPhaseCanvas(state, 'attack');
        await downloadCanvasAsPng(atkCanvas, `taktik-atak-${atkCode}.png`);
        showToast('Atak dizilişi PNG indirildi!');
      } else if (mode === 'defense') {
        const defCanvas = renderPhaseCanvas(state, 'defense');
        await downloadCanvasAsPng(defCanvas, `taktik-karsilama-${defCode}.png`);
        showToast('Karşılama dizilişi PNG indirildi!');
      } else if (mode === 'selected-player') {
        const player = state.players.find(p => p.id === state.selectedPlayerId) || state.players[0];
        if (player) {
          const cardCanvas = renderPlayerCardCanvas(state, player);
          const safeName = player.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '-');
          await downloadCanvasAsPng(cardCanvas, `oyuncu-${player.num}-${safeName}.png`);
          showToast(`${player.name} için detaylı taktik kartı indirildi!`);
        }
      } else if (mode === 'all-players') {
        for (const player of state.players) {
          const cardCanvas = renderPlayerCardCanvas(state, player);
          const safeName = player.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '-');
          await downloadCanvasAsPng(cardCanvas, `oyuncu-${player.num}-${safeName}.png`);
          await new Promise(r => setTimeout(r, 180));
        }
        showToast(`${state.players.length} oyuncu için özel detaylı PNG kartları indirildi!`);
      } else if (mode === 'share-link') {
        const url = store.generateShareUrl();
        try {
          await navigator.clipboard.writeText(url);
          showToast('Paylaşım linki panoya kopyalandı!');
        } catch {
          window.location.hash = url.split('#')[1];
          showToast('Paylaşım linki adres çubuğuna eklendi!');
        }
      } else if (mode === 'json') {
        const payload = {
          tacticName: state.tacticName,
          playerCount: state.playerCount,
          attackFormation: atkCode,
          defenseFormation: defCode,
          teamInstructions: state.teamInstructions,
          players: state.players
        };
        const json = JSON.stringify(payload, null, 2);
        try {
          await navigator.clipboard.writeText(json);
          showToast('Taktik JSON panoya kopyalandı!');
        } catch {
          console.log(json);
          showToast('Taktik JSON tarayıcı konsoluna yazdırıldı.');
        }
      } else if (mode === 'backup-download') {
        const backup = store.exportBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fm27-taktik-yedek-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Tüm taktik ve slot yedeği (.json) indirildi!');
      } else if (mode === 'backup-import') {
        document.getElementById('backup-file-input').click();
      }
    });
  });

  const backupInput = document.getElementById('backup-file-input');
  backupInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      store.importBackup(parsed);
      showToast('Yedek başarıyla yüklendi!');
    } catch {
      showToast('Geçersiz yedek dosyası (.json)!');
    } finally {
      backupInput.value = '';
    }
  });

  function renderTopbar(state) {
    if (document.activeElement !== tacticNameInput) {
      tacticNameInput.value = state.tacticName || 'Ana Takım Taktiği';
    }

    countPills.querySelectorAll('[data-count]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.count) === state.playerCount);
    });

    const availablePresets = PRESETS[state.playerCount] || [];
    presetSelect.innerHTML =
      `<option value="">Özel Diziliş</option>` +
      availablePresets
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join('');
    presetSelect.value = state.presetId || '';

    btnAttack.classList.toggle('active', state.phase === 'attack');
    btnDefense.classList.toggle('active', state.phase === 'defense');
    btnSetpiece.classList.toggle('active', state.phase === 'setpiece');

    toggleTransition.checked = state.showTransition;
    toggleZones.checked = state.showZones;
    toggleCoverage.checked = state.showCoverage;
    btnOrientation.textContent = state.orientation === 'horizontal' ? 'Dikey Görünüm' : 'Yatay Görünüm';

    opponentSelect.value = state.opponentFormation || 'none';
    btnDrawPass.classList.toggle('active', state.drawMode === 'pass');
    btnDrawRun.classList.toggle('active', state.drawMode === 'run');

    const banner = document.getElementById('pitch-phase-banner');
    if (state.phase === 'attack') {
      banner.className = 'pitch-phase-banner is-attack';
      banner.innerHTML = '<span class="phase-dot phase-dot--atk"></span> Topa Sahipken (Atak)';
    } else if (state.phase === 'defense') {
      banner.className = 'pitch-phase-banner is-defense';
      banner.innerHTML = '<span class="phase-dot phase-dot--def"></span> Top Rakipteyken (Karşılama)';
    } else {
      banner.className = 'pitch-phase-banner is-setpiece';
      banner.innerHTML = '<span class="phase-dot phase-dot--sp"></span> Duran Top (Korner Dizilişi)';
    }
  }

  store.subscribe(renderTopbar);
  renderTopbar(store.getState());
}

function initLeftPanel() {
  const formationBadge = document.getElementById('formation-code-badge');
  const compareCard = document.getElementById('phase-compare-card');
  const dutySummary = document.getElementById('duty-summary');
  const rosterCount = document.getElementById('roster-count');
  const rosterList = document.getElementById('roster-list');
  const tiContainer = document.getElementById('team-instructions-container');
  const analysisList = document.getElementById('analysis-list');
  const subsList = document.getElementById('subs-list');

  // Sol Panel Sekmeleri
  const tabBtns = document.querySelectorAll('[data-left-tab]');
  const panes = {
    squad: document.getElementById('pane-squad'),
    instructions: document.getElementById('pane-instructions'),
    analysis: document.getElementById('pane-analysis')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.leftTab;
      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      Object.entries(panes).forEach(([k, el]) => {
        el.hidden = k !== target;
      });
    });
  });

  document.getElementById('btn-copy-atk-to-def').addEventListener('click', () => {
    store.copyPhase('attack', 'defense');
    showToast('Atak dizilişi Karşılama fazına kopyalandı.');
  });

  document.getElementById('btn-copy-def-to-atk').addEventListener('click', () => {
    store.copyPhase('defense', 'attack');
    showToast('Karşılama dizilişi Atak fazına kopyalandı.');
  });

  document.getElementById('btn-add-sub').addEventListener('click', () => {
    const state = store.getState();
    const nextNum = 12 + state.subs.length;
    store.addSub(`Yedek Oyuncu ${state.subs.length + 1}`, nextNum);
  });

  function renderLeft(state) {
    const { players, phase, selectedPlayerId, teamInstructions, subs } = state;
    const atkShape = computeFormationCode(players, 'attack');
    const defShape = computeFormationCode(players, 'defense');

    formationBadge.textContent = phase === 'defense' ? defShape : atkShape;
    rosterCount.textContent = `${players.length} Oyuncu`;

    compareCard.innerHTML = `
      <div class="compare-box ${phase === 'attack' ? 'active-atk' : ''}">
        <div class="compare-box-label">Atak Şekli</div>
        <div class="compare-box-value">${atkShape}</div>
      </div>
      <div class="compare-box ${phase === 'defense' ? 'active-def' : ''}">
        <div class="compare-box-label">Karşılama Şekli</div>
        <div class="compare-box-value">${defShape}</div>
      </div>
    `;

    const counts = { defend: 0, support: 0, attack: 0, auto: 0 };
    for (const p of players) {
      const d = (p[phase] || p.attack).duty;
      if (counts[d] !== undefined) counts[d]++;
    }
    const total = players.length || 1;
    const pct = k => `${(counts[k] / total) * 100}%`;

    dutySummary.innerHTML = `
      <div class="duty-bar" title="Görev Dağılımı">
        <div style="width:${pct('defend')}; background:var(--duty-defend)"></div>
        <div style="width:${pct('support')}; background:var(--duty-support)"></div>
        <div style="width:${pct('attack')}; background:var(--duty-attack)"></div>
        <div style="width:${pct('auto')}; background:var(--duty-auto)"></div>
      </div>
      <div class="duty-legend">
        <span style="color:var(--duty-defend)">Sav: ${counts.defend}</span>
        <span style="color:var(--duty-support)">Des: ${counts.support}</span>
        <span style="color:var(--duty-attack)">Hüc: ${counts.attack}</span>
      </div>
    `;

    rosterList.innerHTML = players
      .map(p => {
        const pos = p[phase] || p.attack;
        const zone = detectZone(pos.x, pos.y);
        const role = getRoleById(pos.role);
        const duty = DUTIES[pos.duty] || DUTIES.support;
        return `
          <button type="button" class="roster-item ${p.id === selectedPlayerId ? 'selected' : ''}" data-roster-id="${p.id}">
            <span class="roster-num">${p.num}</span>
            <span class="roster-info">
              <div class="roster-name">${escapeHtml(p.name)}</div>
              <div class="roster-role">${role.name} · ${duty.label}</div>
            </span>
            <span class="duty-pill-dot" style="background:${duty.color}"></span>
            <span class="roster-zone-badge">${zone.code}</span>
          </button>
        `;
      })
      .join('');

    rosterList.querySelectorAll('[data-roster-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.selectPlayer(btn.dataset.rosterId);
      });
    });

    // Sekme 2: Takım Talimatları
    const renderGroup = (title, key, options) => `
      <div class="ti-group">
        <div class="ti-group-title">${title}</div>
        <div class="ti-pills">
          ${options
            .map(
              opt => `
            <button type="button" class="ti-pill ${teamInstructions[key] === opt.id ? 'active' : ''}" data-ti-key="${key}" data-ti-val="${opt.id}">
              ${opt.label}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    tiContainer.innerHTML = `
      ${renderGroup('Oyun Anlayışı (Mentalite)', 'mentality', MENTALITIES)}
      ${renderGroup('Pas Mesafesi', 'passing', TEAM_INSTRUCTION_GROUPS.passing)}
      ${renderGroup('Oyun Temposu', 'tempo', TEAM_INSTRUCTION_GROUPS.tempo)}
      ${renderGroup('Hücum Genişliği', 'width', TEAM_INSTRUCTION_GROUPS.width)}
      ${renderGroup('Pres Şiddeti (Top Rakipteyken)', 'pressing', TEAM_INSTRUCTION_GROUPS.pressing)}
      ${renderGroup('Savunma Hattı Yüksekliği', 'defLine', TEAM_INSTRUCTION_GROUPS.defLine)}
      <div class="ti-group" style="margin-top:10px;">
        <div class="ti-group-title">Ek Takım Tercihleri</div>
        <label class="ti-check">
          <input type="checkbox" id="ti-play-out" ${teamInstructions.playOutOfDefense ? 'checked' : ''} />
          <span>Geriden Pasla Çık</span>
        </label>
        <label class="ti-check">
          <input type="checkbox" id="ti-offside" ${teamInstructions.offsideTrap ? 'checked' : ''} />
          <span>Ofsayt Tuzağı Uygula</span>
        </label>
      </div>
    `;

    tiContainer.querySelectorAll('[data-ti-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setTeamInstruction(btn.dataset.tiKey, btn.dataset.tiVal);
      });
    });

    tiContainer.querySelector('#ti-play-out').addEventListener('change', (e) => {
      store.setTeamInstruction('playOutOfDefense', e.target.checked);
    });
    tiContainer.querySelector('#ti-offside').addEventListener('change', (e) => {
      store.setTeamInstruction('offsideTrap', e.target.checked);
    });

    // Sekme 3: Analiz & Yedekler
    const insights = analyzeTactics(state);
    analysisList.innerHTML = insights
      .map(item => `<div class="analysis-item analysis-item--${item.type}">${item.text}</div>`)
      .join('');

    subsList.innerHTML = subs
      .map(
        s => `
        <div class="sub-item">
          <span class="roster-num">${s.num}</span>
          <span class="sub-item-name">${escapeHtml(s.name)}</span>
          <button type="button" class="btn btn-sm btn-outline" data-swap-sub="${s.id}" title="Seçili oyuncuyla değiştir">Al ⇄</button>
          <button type="button" class="btn btn-sm btn-ghost" data-del-sub="${s.id}" title="Yedeği sil">✕</button>
        </div>
      `
      )
      .join('');

    subsList.querySelectorAll('[data-swap-sub]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.swapWithSub(btn.dataset.swapSub);
        showToast('Oyuncu değişikliği yapıldı!');
      });
    });

    subsList.querySelectorAll('[data-del-sub]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.removeSub(btn.dataset.delSub);
      });
    });
  }

  store.subscribe(renderLeft);
  renderLeft(store.getState());
}

function initSlotsModal() {
  const modal = document.getElementById('slots-modal');
  const openBtn = document.getElementById('btn-slots');
  const closeBtn = document.getElementById('btn-close-slots');
  const nameInput = document.getElementById('slot-name-input');
  const saveBtn = document.getElementById('btn-save-slot');
  const listEl = document.getElementById('slots-list');

  function renderSlots() {
    const slots = store.getSavedSlots();
    if (slots.length === 0) {
      listEl.innerHTML = '<p style="color:var(--text-muted); margin:0;">Henüz kayıtlı taktik slotu yok. Yukarıdan mevcut taktiğinizi kaydedebilirsiniz.</p>';
      return;
    }

    listEl.innerHTML = slots
      .map(
        s => `
        <div class="slot-row">
          <div class="slot-info">
            <strong>${escapeHtml(s.name)}</strong>
            <span>${s.data.playerCount || 11} Oyuncu · ${s.savedAt}</span>
          </div>
          <div class="slot-actions">
            <button type="button" class="btn btn-sm btn-primary" data-load-slot="${s.id}">Yükle</button>
            <button type="button" class="btn btn-sm btn-ghost" data-del-slot="${s.id}">Sil</button>
          </div>
        </div>
      `
      )
      .join('');

    listEl.querySelectorAll('[data-load-slot]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.loadSlot(btn.dataset.loadSlot);
        modal.hidden = true;
        showToast('Kayıtlı taktik yüklendi!');
      });
    });

    listEl.querySelectorAll('[data-del-slot]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.deleteSlot(btn.dataset.delSlot);
        renderSlots();
      });
    });
  }

  openBtn.addEventListener('click', () => {
    nameInput.value = store.getState().tacticName || '';
    renderSlots();
    modal.hidden = false;
  });

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.hidden = true;
  });

  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || store.getState().tacticName || 'Kayıtlı Taktik';
    store.saveToSlot(name);
    renderSlots();
    showToast(`"${name}" slotlara kaydedildi!`);
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  initLeftPanel();
  initPitch();
  initInspector();
  initRoleModal();
  initSlotsModal();
});
