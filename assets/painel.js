// assets/painel.js
(function () {
  'use strict';

  var api = window.ASSOC_API;

  var PUBLIC_TYPE_LABELS = {
    comunicado: 'Comunicado',
    agenda: 'Agenda',
    documento: 'Documento',
    ata: 'Ata',
    curso: 'Curso',
    servico: 'Serviço'
  };

  var PUBLIC_TYPE_ORDER = ['comunicado', 'agenda', 'curso', 'servico', 'documento', 'ata'];

  var UNION_MESSAGES = [
    {
      title: 'Participação fortalece a categoria',
      text: 'Juntos, os servidores têm mais força, voz e representação.'
    },
    {
      title: 'Servidor valorizado, cidade mais forte',
      text: 'Valorizar o servidor público é valorizar o atendimento, os serviços e a vida da comunidade.'
    },
    {
      title: 'Informação também é proteção',
      text: 'Servidor informado participa melhor das decisões e acompanha de perto os direitos da categoria.'
    },
    {
      title: 'União transforma reivindicações em conquistas',
      text: 'A força coletiva nasce da participação, do diálogo e da presença de cada servidor.'
    },
    {
      title: 'O sindicato é ponto de encontro',
      text: 'Aqui a categoria encontra orientação, informação e espaço para construir soluções em conjunto.'
    },
    {
      title: 'Participar é cuidar do futuro',
      text: 'Cada assembleia, curso e comunicado ajuda a manter a categoria mais próxima e organizada.'
    },
    {
      title: 'Direitos precisam de presença',
      text: 'A defesa dos servidores se fortalece quando a categoria acompanha, participa e se mantém unida.'
    }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function html(id, content) {
    var element = byId(id);

    if (element) {
      element.innerHTML = content;
    }
  }

  function show(id) {
    var element = byId(id);

    if (element) {
      element.classList.remove('hidden');
    }
  }

  function hide(id) {
    var element = byId(id);

    if (element) {
      element.classList.add('hidden');
    }
  }

  function setMessage(message, type) {
    var element = byId('publicMessage');

    if (!element) {
      return;
    }

    element.textContent = message || '';
    element.className = 'message public-site-message' + (type ? ' ' + type : '');

    if (message) {
      element.classList.remove('hidden');
      return;
    }

    element.classList.add('hidden');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeHref(value) {
    var href = String(value || '').trim();

    if (/^(https?:|mailto:|tel:)/i.test(href)) {
      return href;
    }

    return '';
  }

  function normalizeText(value) {
    var textValue = String(value == null ? '' : value).trim().toLowerCase();

    try {
      return textValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch (error) {
      return textValue;
    }
  }

  function formatDate(value) {
    var parts;

    if (!value) {
      return '';
    }

    parts = String(value).slice(0, 10).split('-');

    if (parts.length !== 3) {
      return value;
    }

    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function publicTypeLabel(type) {
    return PUBLIC_TYPE_LABELS[type] || type || 'Informação';
  }

  function sortPublicItems(items) {
    var orderMap = {};

    PUBLIC_TYPE_ORDER.forEach(function (type, index) {
      orderMap[type] = index;
    });

    return (items || []).slice().sort(function (a, b) {
      var orderA = Number(a.ordem || 0);
      var orderB = Number(b.ordem || 0);
      var typeA = orderMap[a.tipo] == null ? 99 : orderMap[a.tipo];
      var typeB = orderMap[b.tipo] == null ? 99 : orderMap[b.tipo];
      var dateA = a.data || '';
      var dateB = b.data || '';

      if (orderA !== orderB) return orderA - orderB;
      if (typeA !== typeB) return typeA - typeB;
      if (dateA !== dateB) return dateA > dateB ? -1 : 1;

      return normalizeText(a.titulo || '') < normalizeText(b.titulo || '') ? -1 : 1;
    });
  }

  function groupPublicItems(items) {
    var groups = {
      comunicado: [],
      agenda: [],
      documento: [],
      ata: [],
      curso: [],
      servico: []
    };

    sortPublicItems(items || []).forEach(function (item) {
      var type = item.tipo || 'comunicado';

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push(item);
    });

    return groups;
  }

  function publicCardMarkup(item) {
    var meta = [];
    var link = safeHref(item.link);

    if (item.data) meta.push(formatDate(item.data));
    if (item.horario) meta.push(item.horario);
    if (item.local) meta.push(item.local);

    return '<article class="public-site-item">' +
      '<p class="public-site-item-type">' + escapeHtml(publicTypeLabel(item.tipo)) + '</p>' +
      '<h3>' + escapeHtml(item.titulo || '-') + '</h3>' +
      (meta.length ? '<p class="public-site-item-meta">' + escapeHtml(meta.join(' • ')) + '</p>' : '') +
      (item.descricao ? '<p>' + escapeHtml(item.descricao) + '</p>' : '') +
      (link ? '<a class="public-site-text-link" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">Ver informação</a>' : '') +
      '</article>';
  }

  function renderSection(sectionId, listId, items) {
    if (!items || !items.length) {
      html(listId, '');
      hide(sectionId);
      return;
    }

    html(listId, items.map(publicCardMarkup).join(''));
    show(sectionId);
  }

  function renderDocumentsSection(documentos, atas) {
    var hasDocumentos = documentos && documentos.length;
    var hasAtas = atas && atas.length;

    if (!hasDocumentos && !hasAtas) {
      html('publicDocumentoList', '');
      html('publicAtaList', '');
      hide('documentosSubsection');
      hide('atasSubsection');
      hide('documentos');
      return;
    }

    if (hasDocumentos) {
      html('publicDocumentoList', documentos.map(publicCardMarkup).join(''));
      show('documentosSubsection');
    } else {
      html('publicDocumentoList', '');
      hide('documentosSubsection');
    }

    if (hasAtas) {
      html('publicAtaList', atas.map(publicCardMarkup).join(''));
      show('atasSubsection');
    } else {
      html('publicAtaList', '');
      hide('atasSubsection');
    }

    show('documentos');
  }

  function renderPublicItems(items) {
    var activeItems = (items || []).filter(function (item) {
      return String(item.status || 'ATIVO').toUpperCase() === 'ATIVO';
    });
    var groups = groupPublicItems(activeItems);
    renderSection('comunicados', 'publicComunicadoList', groups.comunicado);
    renderSection('agenda', 'publicAgendaList', groups.agenda);
    renderSection('cursos', 'publicCursoList', groups.curso);
    renderSection('servicos', 'publicServicoList', groups.servico);
    renderDocumentsSection(groups.documento, groups.ata);
  }

  function renderUnionMessage() {
    var titleElement = byId('unionMessageTitle');
    var textElement = byId('unionMessageText');
    var index;
    var selectedMessage;

    if (!titleElement || !textElement || !UNION_MESSAGES.length) {
      return;
    }

    index = Math.floor(Math.random() * UNION_MESSAGES.length);
    selectedMessage = UNION_MESSAGES[index];

    titleElement.textContent = selectedMessage.title;
    textElement.textContent = selectedMessage.text;
  }

  async function loadPublicContent() {
    try {
      setMessage('');

      if (!api || typeof api.getApi !== 'function') {
        throw new Error('API do painel informativo não configurada.');
      }

      var response = await api.getApi('public_list');

      renderPublicItems(response.items || []);
    } catch (error) {
      renderPublicItems([]);
      setMessage(error.message || 'Não foi possível carregar as informações publicadas.', 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderUnionMessage();
    loadPublicContent();
  });
}());
