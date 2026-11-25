import { store, detectZone } from '../state/store.js';
import { DUTIES, ROLES, getRoleById, getRolesForZone } from '../data/roles.js';
import { PLAYER_INSTRUCTIONS } from '../data/tactics.js';

export function initInspector() {
  const panel = document.getElementById('inspector-panel');
  let renderedPlayerId = null;
  let renderedPhase = null;

  function render(state) {
    const { players, selectedPlayerId, phase, showAllRoles } = state;
    const player = players.find(p => p.id === selectedPlayerId) || players[0];
    if (!player) {
      renderedPlayerId = null;
      renderedPhase = null;
      panel.innerHTML = '<div class="inspector-body"><p>Oyuncu seçilmedi.</p></div>';
      return;
    }

    // İsim veya numara yazılırken input odaktaysa DOM'u yeniden çizip odağı kaybetme
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.id === 'insp-name' || activeEl.id === 'insp-num') &&
      panel.contains(activeEl) &&
      renderedPlayerId === player.id &&
      renderedPhase === phase
    ) {
      return;
    }

    renderedPlayerId = player.id;
    renderedPhase = phase;

    const pos = player[phase] || player.attack;
    const zone = detectZone(pos.x, pos.y);
    const activeRole = getRoleById(pos.role);
    const activeDuty = DUTIES[pos.duty] || DUTIES[activeRole.duties[0]];
    const availableRoles = showAllRoles ? ROLES : getRolesForZone(zone.code);
    const selectedInsts = pos.instructions || [];

    // Eğer seçili rol mevcut bölgede yoksa yine de listede görünsün
    const roleList = availableRoles.some(r => r.id === activeRole.id)
      ? availableRoles
      : [activeRole, ...availableRoles];

    const phaseLabel =
      phase === 'attack'
        ? 'Atak (Topa Sahipken)'
        : phase === 'defense'
          ? 'Karşılama (Top Rakipteyken)'
          : 'Duran Top (Korner)';
    const dutyExplanation = activeRole.dutyDetails[activeDuty.id] || activeDuty.generalDesc;

    panel.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-player-row">
          <input
            type="number"
            min="1"
            max="99"
            class="inspector-num-input"
            id="insp-num"
            value="${player.num}"
            aria-label="Forma Numarası"
          />
          <input
            type="text"
            maxlength="24"
            class="inspector-name-input"
            id="insp-name"
            value="${escapeAttr(player.name)}"
            aria-label="Oyuncu Adı"
          />
        </div>
        <div class="inspector-meta">
          <span>Bölge: <span class="zone-pill">${zone.code} · ${zone.label}</span></span>
          <span>Faz: <strong>${phaseLabel}</strong></span>
        </div>
        <div class="swap-row">
          <select id="insp-swap-select" class="select-input select-input--sm" style="flex:1">
            <option value="">Oyuncuyla Yer Değiştir (Takas)...</option>
            ${players
              .filter(p => p.id !== player.id)
              .map(p => `<option value="${p.id}">#${p.num} ${escapeAttr(p.name)}</option>`)
              .join('')}
          </select>
        </div>
      </div>

      <div class="inspector-body">
        <!-- Rol Seçimi -->
        <div>
          <div class="field-label-row">
            <span class="field-label">Oyuncu Rolü</span>
            <button type="button" class="link-btn" id="btn-toggle-all-roles">
              ${showAllRoles ? 'Sadece Bölge Rolleri' : 'Tüm Rolleri Göster'}
            </button>
          </div>
          <div class="role-grid">
            ${roleList
              .map(
                r => `
              <button
                type="button"
                class="role-option-btn ${r.id === activeRole.id ? 'active' : ''}"
                data-role-id="${r.id}"
              >
                <span class="role-option-name">${r.name}</span>
                <span class="role-option-short">${r.shortName}</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Görev (Duty) Seçimi -->
        <div>
          <div class="field-label-row">
            <span class="field-label">Görev / Mentalite</span>
          </div>
          <div class="duty-selector">
            ${activeRole.duties
              .map(dutyKey => {
                const d = DUTIES[dutyKey];
                const isActive = dutyKey === activeDuty.id;
                return `
                  <button
                    type="button"
                    class="duty-btn ${isActive ? 'active' : ''}"
                    data-duty-id="${dutyKey}"
                    style="--duty-text:${d.color}; --duty-bg:${d.bg}; --duty-border:${d.border};"
                  >
                    ${d.label}
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Rol & Görev Açıklaması -->
        <div class="explanation-card" style="--duty-color:${activeDuty.color};">
          <div class="explanation-title">
            <h3>${activeRole.name}</h3>
            <span
              class="duty-tag"
              style="color:${activeDuty.color}; background:${activeDuty.bg}; border:1px solid ${activeDuty.border};"
            >
              ${activeDuty.label} Görevi
            </span>
          </div>

          <p class="explanation-summary">${activeRole.summary}</p>

          <div class="duty-effect-box">
            <strong>"${activeDuty.label}" Görevi Ne Anlama Gelir?</strong>
            <p>${dutyExplanation}</p>
          </div>

          <div class="behavior-list">
            <div class="behavior-item">
              <strong>Topla Davranış:</strong> ${activeRole.onBall}
            </div>
            <div class="behavior-item">
              <strong>Topsuz Davranış:</strong> ${activeRole.offBall}
            </div>
          </div>

          <div>
            <div class="field-label" style="margin-bottom:5px;">Öne Çıkan Özellikler</div>
            <div class="attr-chips">
              ${activeRole.attributes.map(a => `<span class="attr-chip">${a}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Bireysel Oyuncu Talimatları -->
        <div>
          <div class="field-label-row">
            <span class="field-label">Bireysel Oyuncu Talimatları</span>
          </div>
          <div class="player-inst-grid">
            ${PLAYER_INSTRUCTIONS.map(
              inst => `
              <label class="player-inst-item">
                <input type="checkbox" data-player-inst="${inst.id}" ${selectedInsts.includes(inst.id) ? 'checked' : ''} />
                <span>${inst.label}</span>
              </label>
            `
            ).join('')}
          </div>
        </div>
      </div>
    `;

    // Olay Dinleyicileri
    const numInput = panel.querySelector('#insp-num');
    const nameInput = panel.querySelector('#insp-name');

    numInput.addEventListener('change', () => {
      const val = Math.max(1, Math.min(99, parseInt(numInput.value, 10) || 1));
      store.updatePlayerInfo(player.id, { num: val });
    });

    nameInput.addEventListener('input', () => {
      store.updatePlayerInfo(player.id, { name: nameInput.value });
    });

    panel.querySelector('#btn-toggle-all-roles').addEventListener('click', () => {
      store.toggleShowAllRoles();
    });

    panel.querySelectorAll('[data-role-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setPlayerRole(player.id, btn.dataset.roleId);
      });
    });

    panel.querySelectorAll('[data-duty-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setPlayerDuty(player.id, btn.dataset.dutyId);
      });
    });

    panel.querySelector('#insp-swap-select').addEventListener('change', (e) => {
      if (e.target.value) {
        store.swapPlayers(player.id, e.target.value);
      }
    });

    panel.querySelectorAll('[data-player-inst]').forEach(cb => {
      cb.addEventListener('change', () => {
        store.togglePlayerInstruction(player.id, cb.dataset.playerInst);
      });
    });
  }

  store.subscribe(render);
  render(store.getState());
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
