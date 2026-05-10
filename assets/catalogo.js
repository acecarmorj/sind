// assets/catalogo.js
(function () {
  'use strict';

  var state = {
    items: []
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getRuntime() {
    if (window.SIND_API && typeof window.SIND_API.getRuntime === 'function') {
      return window.SIND_API.getRuntime();
    }

    return window.SIND_RUNTIME_CONFIG || {};
  }

  function getApiUrl() {
    var url = String((getRuntime() || {}).API_URL || '').trim();

    if (!url || url.indexOf('COLE_AQUI') >= 0) {
      throw new Error('Serviço indisponível. Verifique a configuração do sistema.');
    }

    return url;
  }

  async function parseJsonResponse(response) {
    var text = await response.text();
    var data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Não foi possível carregar as empresas no momento.');
    }

    if (!data.ok) {
      throw new Error(data.message || 'Não foi possível carregar as empresas.');
    }

    return data.data || {};
  }

  async function postApi(action, payload) {
    var response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: action,
        payload: payload || {}
      })
    });

    return parseJsonResponse(response);
  }

  function setMessage(message, type) {
    var element = byId('catalogPublicMessage');

    if (!element) return;

    element.textContent = message || '';
    element.className = 'message';

    if (type) {
      element.classList.add(type);
    }
  }

  function normalizeInstagram(value) {
    value = String(value || '').trim();
    if (!value) return '';
    return value.charAt(0) === '@' ? value : '@' + value;
  }

  function whatsappLink(value) {
    var digits = String(value || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length <= 11) {
      digits = '55' + digits;
    }
    return 'https://wa.me/' + digits;
  }

  function formatPhone(value) {
    var digits = String(value || '').replace(/\D/g, '');

    if (digits.length === 11) {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    if (digits.length === 10) {
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return value || '';
  }

  function filteredItems() {
    var search = String(byId('catalogPublicSearch').value || '').trim().toLowerCase();
    var category = String(byId('catalogPublicCategory').value || '').trim();

    return state.items.filter(function (item) {
      if (category && item.category !== category) return false;
      if (!search) return true;
      return [
        item.publicName,
        item.category,
        item.description,
        item.whatsapp,
        item.instagram,
        item.address
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  function renderCategoryOptions() {
    var select = byId('catalogPublicCategory');
    var current = select.value;
    var categories = [];

    state.items.forEach(function (item) {
      if (item.category && categories.indexOf(item.category) < 0) {
        categories.push(item.category);
      }
    });

    categories.sort(function (a, b) {
      return a.localeCompare(b, 'pt-BR');
    });

    select.innerHTML = '<option value="">Todas</option>' + categories.map(function (category) {
      return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
    }).join('');

    select.value = current;
  }

  function renderCatalog() {
    var grid = byId('catalogPublicGrid');
    var items = filteredItems();

    grid.innerHTML = '';

    if (!items.length) {
      grid.innerHTML = '<article class="catalog-public-card muted">Nenhuma empresa encontrada no catálogo.</article>';
      return;
    }

    items.forEach(function (item) {
      var card = document.createElement('article');
      var category = document.createElement('span');
      var title = document.createElement('strong');
      var description = document.createElement('p');
      var meta = document.createElement('small');
      var actions = document.createElement('div');
      var whatsLink = whatsappLink(item.whatsapp);

      card.className = 'catalog-public-card' + (item.highlight === 'SIM' ? ' is-highlight' : '');
      category.textContent = item.category || 'Associado ACEAP';
      title.textContent = item.publicName || 'Empresa associada';
      description.textContent = item.description || 'Empresa participante do catálogo público da ACEAP.';
      meta.textContent = [formatPhone(item.whatsapp), normalizeInstagram(item.instagram), item.address].filter(Boolean).join(' • ');
      actions.className = 'catalog-public-actions';

      if (whatsLink) {
        var whatsapp = document.createElement('a');
        whatsapp.className = 'btn btn-primary';
        whatsapp.href = whatsLink;
        whatsapp.target = '_blank';
        whatsapp.rel = 'noopener';
        whatsapp.textContent = 'WhatsApp';
        actions.appendChild(whatsapp);
      }

      if (item.instagram) {
        var instagram = document.createElement('a');
        instagram.className = 'btn btn-outline';
        instagram.href = 'https://instagram.com/' + normalizeInstagram(item.instagram).replace('@', '');
        instagram.target = '_blank';
        instagram.rel = 'noopener';
        instagram.textContent = 'Instagram';
        actions.appendChild(instagram);
      }

      card.appendChild(category);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  async function loadCatalog() {
    try {
      setMessage('Carregando catálogo...', '');
      var response = await postApi('catalog_public_list', {});
      state.items = response.items || [];
      renderCategoryOptions();
      renderCatalog();
      setMessage(state.items.length + ' empresa(s) publicada(s).', 'success');
    } catch (error) {
      setMessage(error.message || 'Não foi possível carregar o catálogo.', 'error');
    }
  }

  function bindEvents() {
    byId('catalogPublicSearch').addEventListener('input', renderCatalog);
    byId('catalogPublicCategory').addEventListener('change', renderCatalog);
    byId('catalogPublicRefreshBtn').addEventListener('click', loadCatalog);
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    loadCatalog();
  });
}());
