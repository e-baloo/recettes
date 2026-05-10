/**
 * Mes Recettes – Application logic
 *
 * Data is persisted in localStorage under the key "recettes".
 * An initial set of sample recipes is loaded on first visit.
 */

/* ================================================================
   Constants & helpers
   ================================================================ */

const STORAGE_KEY = 'recettes';

/** Generate a simple unique ID */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Escape HTML to prevent XSS when rendering user content */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Format minutes as "X h Y min" or "Y min" */
function formatTime(minutes) {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

/** Build a total-time label for a recipe */
function totalTimeLabel(recipe) {
  const total = (parseInt(recipe.prepTime, 10) || 0) + (parseInt(recipe.cookTime, 10) || 0);
  return formatTime(total);
}

/* ================================================================
   Data layer – localStorage CRUD
   ================================================================ */

function loadRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore parse errors */ }
  return null;
}

function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getAll() {
  return loadRecipes() || [];
}

function getById(id) {
  return getAll().find(r => r.id === id) || null;
}

function upsert(recipe) {
  const recipes = getAll();
  const idx = recipes.findIndex(r => r.id === recipe.id);
  if (idx === -1) {
    recipes.unshift(recipe);  // newest first
  } else {
    recipes[idx] = recipe;
  }
  saveRecipes(recipes);
  return recipe;
}

function remove(id) {
  const recipes = getAll().filter(r => r.id !== id);
  saveRecipes(recipes);
}

/* ================================================================
   Sample data – loaded only on first visit
   ================================================================ */

const SAMPLE_RECIPES = [
  {
    id: 'sample-1',
    name: 'Tarte aux pommes',
    category: 'dessert',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    ingredients: ['1 pâte brisée', '6 pommes Golden', '50 g de sucre', '30 g de beurre', '1 sachet de sucre vanillé', '1 pincée de cannelle'],
    steps: [
      'Préchauffer le four à 180 °C (th. 6).',
      'Éplucher, épépiner et couper les pommes en fines lamelles.',
      'Foncer un moule à tarte avec la pâte brisée.',
      'Disposer les lamelles de pommes en rosace sur la pâte.',
      'Parsemer de sucre, sucre vanillé et cannelle, puis déposer les morceaux de beurre.',
      'Cuire 40 minutes jusqu\'à coloration dorée.'
    ],
    notes: 'Servir tiède avec une boule de glace à la vanille.',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'sample-2',
    name: 'Soupe à l\'oignon gratinée',
    category: 'entrée',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    ingredients: ['6 oignons jaunes', '60 g de beurre', '1 L de bouillon de bœuf', '200 ml de vin blanc sec', '8 tranches de baguette', '150 g de gruyère râpé', 'Sel, poivre'],
    steps: [
      'Émincer finement les oignons.',
      'Les faire fondre dans le beurre à feu moyen pendant 20 minutes jusqu\'à coloration.',
      'Déglacer avec le vin blanc, laisser réduire 5 minutes.',
      'Ajouter le bouillon, porter à ébullition puis laisser mijoter 20 minutes.',
      'Répartir la soupe dans des bols allant au four.',
      'Poser les tranches de baguette, recouvrir de gruyère râpé.',
      'Faire gratiner 5 à 10 minutes sous le gril.'
    ],
    notes: 'Utiliser un bouillon fait maison pour encore plus de saveur.',
    createdAt: '2026-01-12T09:30:00.000Z',
    updatedAt: '2026-01-12T09:30:00.000Z',
  },
  {
    id: 'sample-3',
    name: 'Poulet rôti aux herbes',
    category: 'plat',
    prepTime: 15,
    cookTime: 90,
    servings: 4,
    ingredients: ['1 poulet entier (environ 1,5 kg)', '40 g de beurre mou', '3 gousses d\'ail', '1 citron', 'Thym, romarin, persil', 'Sel, poivre', '2 c. à soupe d\'huile d\'olive'],
    steps: [
      'Préchauffer le four à 200 °C (th. 6-7).',
      'Mélanger le beurre mou avec l\'ail écrasé, les herbes ciselées, sel et poivre.',
      'Glisser le beurre aux herbes sous la peau du poulet.',
      'Frotter l\'extérieur du poulet avec l\'huile, sel et poivre.',
      'Placer le citron coupé en deux à l\'intérieur du poulet.',
      'Rôtir 1 h 30 en arrosant toutes les 20 minutes avec le jus de cuisson.',
      'Laisser reposer 10 minutes avant de découper.'
    ],
    notes: 'Accompagner de pommes de terre rôties ajoutées autour du poulet après 30 minutes de cuisson.',
    createdAt: '2026-01-15T11:00:00.000Z',
    updatedAt: '2026-01-15T11:00:00.000Z',
  },
  {
    id: 'sample-4',
    name: 'Limonade maison',
    category: 'boisson',
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    ingredients: ['6 citrons non traités', '150 g de sucre', '1 L d\'eau gazeuse', 'Quelques feuilles de menthe', 'Glaçons'],
    steps: [
      'Presser les citrons pour obtenir leur jus.',
      'Préparer un sirop en faisant chauffer 200 ml d\'eau avec le sucre jusqu\'à dissolution.',
      'Laisser refroidir le sirop.',
      'Mélanger le jus de citron, le sirop et l\'eau gazeuse dans un pichet.',
      'Ajouter des glaçons et les feuilles de menthe.',
      'Servir immédiatement.'
    ],
    notes: 'Peut se préparer à l\'avance : conserver jus + sirop au frais et ajouter l\'eau gazeuse au moment de servir.',
    createdAt: '2026-01-18T14:00:00.000Z',
    updatedAt: '2026-01-18T14:00:00.000Z',
  },
  {
    id: 'sample-5',
    name: 'Ratatouille provençale',
    category: 'plat',
    prepTime: 25,
    cookTime: 60,
    servings: 6,
    ingredients: ['2 courgettes', '1 aubergine', '2 poivrons (rouge et vert)', '4 tomates bien mûres', '2 oignons', '4 gousses d\'ail', 'Huile d\'olive', 'Thym, laurier, basilic', 'Sel, poivre'],
    steps: [
      'Couper tous les légumes en dés d\'environ 2 cm.',
      'Faire revenir les oignons et l\'ail dans l\'huile d\'olive.',
      'Ajouter les poivrons, cuire 5 minutes.',
      'Ajouter l\'aubergine, cuire 5 minutes supplémentaires.',
      'Incorporer les courgettes et les tomates.',
      'Assaisonner, ajouter les herbes et cuire à couvert 45 minutes à feu doux.',
      'Rectifier l\'assaisonnement et servir chaud ou froid.'
    ],
    notes: 'Encore meilleure réchauffée le lendemain. Accompagne parfaitement viandes grillées et poissons.',
    createdAt: '2026-02-01T10:30:00.000Z',
    updatedAt: '2026-02-01T10:30:00.000Z',
  },
];

function initSampleData() {
  if (loadRecipes() === null) {
    saveRecipes(SAMPLE_RECIPES);
  }
}

/* ================================================================
   State
   ================================================================ */

const state = {
  activeCategory: 'all',
  searchQuery: '',
  pendingDeleteId: null,
};

/* ================================================================
   Rendering helpers
   ================================================================ */

function categoryLabel(cat) {
  const labels = {
    entrée: 'Entrée',
    plat: 'Plat',
    dessert: 'Dessert',
    boisson: 'Boisson',
    autre: 'Autre',
  };
  return labels[cat] || cat;
}

function renderCard(recipe) {
  const timeLabel = totalTimeLabel(recipe);
  const article = document.createElement('article');
  article.className = 'recipe-card';
  article.setAttribute('role', 'listitem');
  article.setAttribute('tabindex', '0');
  article.dataset.id = recipe.id;

  article.innerHTML = `
    <div class="recipe-card__body">
      <h2 class="recipe-card__title">${escapeHtml(recipe.name)}</h2>
      <div class="recipe-card__meta">
        <span class="badge badge--category">${escapeHtml(categoryLabel(recipe.category))}</span>
        ${timeLabel ? `<span class="badge badge--time">⏱ ${escapeHtml(timeLabel)}</span>` : ''}
        ${recipe.servings ? `<span class="badge badge--servings">👥 ${escapeHtml(String(recipe.servings))} pers.</span>` : ''}
      </div>
    </div>
    <div class="recipe-card__actions">
      <button class="btn btn-icon btn-secondary btn-edit" data-id="${escapeHtml(recipe.id)}" aria-label="Modifier ${escapeHtml(recipe.name)}">✏️ Modifier</button>
      <button class="btn btn-icon btn-danger btn-delete" data-id="${escapeHtml(recipe.id)}" aria-label="Supprimer ${escapeHtml(recipe.name)}">🗑 Supprimer</button>
    </div>
  `;

  // Click on card body → open detail
  article.querySelector('.recipe-card__body').addEventListener('click', () => openDetail(recipe.id));
  article.querySelector('.recipe-card__body').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openDetail(recipe.id);
  });

  article.querySelector('.btn-edit').addEventListener('click', e => {
    e.stopPropagation();
    openForm(recipe.id);
  });

  article.querySelector('.btn-delete').addEventListener('click', e => {
    e.stopPropagation();
    openDeleteConfirm(recipe.id);
  });

  return article;
}

function renderGrid() {
  const grid = document.getElementById('recipeGrid');
  const emptyState = document.getElementById('emptyState');
  let recipes = getAll();

  // Filter by category
  if (state.activeCategory !== 'all') {
    recipes = recipes.filter(r => r.category === state.activeCategory);
  }

  // Filter by search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    recipes = recipes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.ingredients || []).some(i => i.toLowerCase().includes(q)) ||
      (r.category || '').toLowerCase().includes(q)
    );
  }

  grid.innerHTML = '';
  if (recipes.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    recipes.forEach(r => grid.appendChild(renderCard(r)));
  }
}

/* ================================================================
   Detail modal
   ================================================================ */

function openDetail(id) {
  const recipe = getById(id);
  if (!recipe) return;

  const timeLabel = totalTimeLabel(recipe);
  const overlay = document.getElementById('detailOverlay');
  const content = document.getElementById('detailContent');

  const ingredientsList = (recipe.ingredients || [])
    .map(i => `<li>${escapeHtml(i)}</li>`)
    .join('');

  const stepsList = (recipe.steps || [])
    .map((s, idx) => `<li><strong>${idx + 1}.</strong> ${escapeHtml(s)}</li>`)
    .join('');

  content.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-title" id="detailTitle">${escapeHtml(recipe.name)}</h2>
      <div class="detail-meta">
        <span class="badge badge--category">${escapeHtml(categoryLabel(recipe.category))}</span>
        ${recipe.prepTime > 0 ? `<span class="badge badge--time">Prép. ${escapeHtml(formatTime(recipe.prepTime))}</span>` : ''}
        ${recipe.cookTime > 0 ? `<span class="badge badge--time">Cuisson ${escapeHtml(formatTime(recipe.cookTime))}</span>` : ''}
        ${timeLabel ? `<span class="badge badge--time">Total ${escapeHtml(timeLabel)}</span>` : ''}
        ${recipe.servings ? `<span class="badge badge--servings">👥 ${escapeHtml(String(recipe.servings))} personne${recipe.servings > 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>

    ${ingredientsList ? `
    <div class="detail-section">
      <h3>Ingrédients</h3>
      <ul>${ingredientsList}</ul>
    </div>` : ''}

    ${stepsList ? `
    <div class="detail-section">
      <h3>Préparation</h3>
      <ol>${stepsList}</ol>
    </div>` : ''}

    ${recipe.notes ? `
    <div class="detail-section">
      <h3>Notes</h3>
      <p class="detail-notes">${escapeHtml(recipe.notes)}</p>
    </div>` : ''}

    <div class="detail-actions">
      <button class="btn btn-secondary" id="detailEditBtn">✏️ Modifier</button>
      <button class="btn btn-danger" id="detailDeleteBtn">🗑 Supprimer</button>
    </div>
  `;

  document.getElementById('detailEditBtn').addEventListener('click', () => {
    closeDetail();
    openForm(id);
  });

  document.getElementById('detailDeleteBtn').addEventListener('click', () => {
    closeDetail();
    openDeleteConfirm(id);
  });

  overlay.hidden = false;
  document.getElementById('detailClose').focus();
}

function closeDetail() {
  document.getElementById('detailOverlay').hidden = true;
}

/* ================================================================
   Form modal (add / edit)
   ================================================================ */

function openForm(id) {
  const isEdit = Boolean(id);
  const recipe = id ? getById(id) : null;

  document.getElementById('formTitle').textContent = isEdit ? 'Modifier la recette' : 'Nouvelle recette';
  document.getElementById('recipeId').value = id || '';
  document.getElementById('recipeName').value = recipe ? recipe.name : '';
  document.getElementById('recipeCategory').value = recipe ? recipe.category : 'plat';
  document.getElementById('recipePrepTime').value = recipe ? (recipe.prepTime || '') : '';
  document.getElementById('recipeCookTime').value = recipe ? (recipe.cookTime || '') : '';
  document.getElementById('recipeServings').value = recipe ? (recipe.servings || '') : '';
  document.getElementById('recipeIngredients').value = recipe ? (recipe.ingredients || []).join('\n') : '';
  document.getElementById('recipeSteps').value = recipe ? (recipe.steps || []).join('\n') : '';
  document.getElementById('recipeNotes').value = recipe ? (recipe.notes || '') : '';

  clearFormError();

  document.getElementById('formOverlay').hidden = false;
  document.getElementById('recipeName').focus();
}

function closeForm() {
  document.getElementById('formOverlay').hidden = true;
}

function clearFormError() {
  const err = document.getElementById('formError');
  err.textContent = '';
  err.hidden = true;
  document.getElementById('recipeName').removeAttribute('aria-invalid');
}

function showFormError(msg) {
  const err = document.getElementById('formError');
  err.textContent = msg;
  err.hidden = false;
  document.getElementById('recipeName').setAttribute('aria-invalid', 'true');
}

function handleFormSubmit(e) {
  e.preventDefault();
  clearFormError();

  const name = document.getElementById('recipeName').value.trim();
  if (!name) {
    showFormError('Le nom de la recette est obligatoire.');
    document.getElementById('recipeName').focus();
    return;
  }

  const id = document.getElementById('recipeId').value || uid();
  const existing = getById(id);

  const recipe = {
    id,
    name,
    category: document.getElementById('recipeCategory').value,
    prepTime: parseInt(document.getElementById('recipePrepTime').value, 10) || 0,
    cookTime: parseInt(document.getElementById('recipeCookTime').value, 10) || 0,
    servings: parseInt(document.getElementById('recipeServings').value, 10) || 0,
    ingredients: document.getElementById('recipeIngredients').value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    steps: document.getElementById('recipeSteps').value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    notes: document.getElementById('recipeNotes').value.trim(),
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  upsert(recipe);
  closeForm();
  renderGrid();
}

/* ================================================================
   Delete confirm modal
   ================================================================ */

function openDeleteConfirm(id) {
  const recipe = getById(id);
  if (!recipe) return;

  state.pendingDeleteId = id;
  document.getElementById('deleteMessage').textContent =
    `Supprimer « ${recipe.name} » ? Cette action est irréversible.`;

  document.getElementById('deleteOverlay').hidden = false;
  document.getElementById('deleteCancelBtn').focus();
}

function closeDeleteConfirm() {
  state.pendingDeleteId = null;
  document.getElementById('deleteOverlay').hidden = true;
}

function handleDeleteConfirm() {
  if (state.pendingDeleteId) {
    remove(state.pendingDeleteId);
    closeDeleteConfirm();
    renderGrid();
  }
}

/* ================================================================
   Event wiring
   ================================================================ */

function init() {
  initSampleData();

  // New recipe button
  document.getElementById('btnNewRecipe').addEventListener('click', () => openForm(null));

  // Search
  document.getElementById('searchInput').addEventListener('input', e => {
    state.searchQuery = e.target.value.trim();
    renderGrid();
  });

  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderGrid();
    });
  });

  // Detail modal – close
  document.getElementById('detailClose').addEventListener('click', closeDetail);
  document.getElementById('detailOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetail();
  });

  // Form modal – close / submit
  document.getElementById('formClose').addEventListener('click', closeForm);
  document.getElementById('formCancel').addEventListener('click', closeForm);
  document.getElementById('formOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeForm();
  });
  document.getElementById('recipeForm').addEventListener('submit', handleFormSubmit);

  // Delete confirm modal
  document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteConfirm);
  document.getElementById('deleteConfirmBtn').addEventListener('click', handleDeleteConfirm);
  document.getElementById('deleteOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDeleteConfirm();
  });

  // Close modals on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('deleteOverlay').hidden) closeDeleteConfirm();
      else if (!document.getElementById('formOverlay').hidden) closeForm();
      else if (!document.getElementById('detailOverlay').hidden) closeDetail();
    }
  });

  // Initial render
  renderGrid();
}

document.addEventListener('DOMContentLoaded', init);
