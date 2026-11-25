import { ROLES, ROLE_CATEGORIES, DUTIES } from '../data/roles.js';

export function initRoleModal() {
  const modal = document.getElementById('role-guide-modal');
  const openBtn = document.getElementById('btn-role-guide');
  const closeBtn = document.getElementById('btn-close-modal');
  const searchInput = document.getElementById('guide-search');
  const tabsEl = document.getElementById('guide-category-tabs');
  const bodyEl = document.getElementById('role-guide-body');

  let activeCategory = 'ALL';

  function renderTabs() {
    const cats = [{ id: 'ALL', label: 'Tümü' }].concat(
      Object.entries(ROLE_CATEGORIES).map(([id, label]) => ({ id, label }))
    );

    tabsEl.innerHTML = cats
      .map(
        c => `
        <button type="button" class="pill-btn ${c.id === activeCategory ? 'active' : ''}" data-cat="${c.id}">
          ${c.label}
        </button>
      `
      )
      .join('');

    tabsEl.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderTabs();
        renderCards();
      });
    });
  }

  function renderCards() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = ROLES.filter(role => {
      if (activeCategory !== 'ALL' && role.category !== activeCategory) return false;
      if (!q) return true;
      return (
        role.name.toLowerCase().includes(q) ||
        role.summary.toLowerCase().includes(q) ||
        role.attributes.some(a => a.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      bodyEl.innerHTML = '<p style="color:var(--text-muted)">Aramanızla eşleşen rol bulunamadı.</p>';
      return;
    }

    bodyEl.innerHTML = filtered
      .map(
        role => `
        <article class="guide-card">
          <div class="guide-card-head">
            <h3>${role.name} (${role.shortName})</h3>
            <span class="guide-card-cat">${ROLE_CATEGORIES[role.category]}</span>
          </div>
          <p>${role.summary}</p>
          <div class="guide-duties">
            ${role.duties
              .map(d => {
                const dutyObj = DUTIES[d];
                return `<div><strong style="color:${dutyObj.color}">${dutyObj.label}:</strong> ${role.dutyDetails[d]}</div>`;
              })
              .join('')}
          </div>
        </article>
      `
      )
      .join('');
  }

  openBtn.addEventListener('click', () => {
    modal.hidden = false;
    renderTabs();
    renderCards();
    searchInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.hidden = true;
  });

  searchInput.addEventListener('input', renderCards);
}
