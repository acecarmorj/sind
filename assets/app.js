(function () {
  'use strict';

  var api = window.ASSOC_API;
  var runtime = api.getRuntime();

  var state = {
    user: null,
    members: [],
    recentMembers: [],
    report: null,
    users: [],
    publicItems: [],
    publicGroups: {},
    options: {
      locaisTrabalho: [],
      setores: [],
      funcoes: [],
      items: {
        localTrabalho: [],
        setor: [],
        funcao: []
      }
    }
  };

  var OPTION_CONFIG = {
    localTrabalho: {
      label: 'Onde trabalha',
      formId: 'optionFormLocalTrabalho',
      idInput: 'optionLocalTrabalhoId',
      nameInput: 'optionLocalTrabalhoNome',
      bodyId: 'optionsLocalTrabalhoBody'
    },
    setor: {
      label: 'Setor',
      formId: 'optionFormSetor',
      idInput: 'optionSetorId',
      nameInput: 'optionSetorNome',
      bodyId: 'optionsSetorBody'
    },
    funcao: {
      label: 'Função/cargo',
      formId: 'optionFormFuncao',
      idInput: 'optionFuncaoId',
      nameInput: 'optionFuncaoNome',
      bodyId: 'optionsFuncaoBody'
    }
  };

  var PUBLIC_TYPE_LABELS = {
    comunicado: 'Comunicado',
    agenda: 'Agenda',
    documento: 'Documento',
    ata: 'Ata',
    curso: 'Curso',
    servico: 'Serviço'
  };

  var PUBLIC_TYPE_ORDER = ['comunicado', 'agenda', 'curso', 'servico', 'documento', 'ata'];

  function byId(id) {
    return document.getElementById(id);
  }

  function all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function text(id, value) {
    var el = byId(id);
    if (el) el.textContent = value;
  }

  function value(id) {
    var el = byId(id);
    return el ? String(el.value || '').trim() : '';
  }

  function setValue(id, newValue) {
    var el = byId(id);
    if (el) el.value = newValue == null ? '' : newValue;
  }

  function html(id, content) {
    var el = byId(id);
    if (el) el.innerHTML = content;
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

    if (!href) {
      return '';
    }

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

  function digits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function formatCpf(value) {
    var cpf = digits(value);

    if (cpf.length === 11) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    return value || '-';
  }

  function formatPhone(value) {
    var phone = digits(value);

    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return value || '-';
  }

  function formatDate(value) {
    if (!value) return '-';
    var parts = String(value).slice(0, 10).split('-');
    if (parts.length !== 3) return value;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function formatDateTime(value) {
    if (!value) return '-';
    var date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('pt-BR');
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function setMessage(id, message, type) {
    var el = byId(id);
    if (!el) return;

    el.textContent = message || '';
    el.className = 'message' + (type ? ' ' + type : '');
  }

  function clearMessages() {
    [
      'loginMessage',
      'globalMessage',
      'memberMessage',
      'consultMessage',
      'reportMessage',
      'optionsMessage',
      'usersMessage',
      'publicMessage',
      'publicConfigMessage'
    ].forEach(function (id) {
      setMessage(id, '');
    });
  }

  function showPublic() {
    showLogin();
  }

  function showLogin() {
    var publicScreen = byId('publicScreen');
    var loginScreen = byId('loginScreen');
    var appScreen = byId('appScreen');

    if (publicScreen) publicScreen.classList.add('hidden');
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (appScreen) appScreen.classList.add('hidden');
  }

  function showApp() {
    var publicScreen = byId('publicScreen');
    var loginScreen = byId('loginScreen');
    var appScreen = byId('appScreen');

    if (publicScreen) publicScreen.classList.add('hidden');
    if (loginScreen) loginScreen.classList.add('hidden');
    if (appScreen) appScreen.classList.remove('hidden');
  }

  function activateTab(tabName) {
    document.querySelectorAll('[data-tab]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
  }

  function activatePublicSection(sectionName) {
    document.querySelectorAll('[data-public-section]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-public-section') === sectionName);
    });

    document.querySelectorAll('.public-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'public-panel-' + sectionName);
    });
  }

  function optionMarkup(options, emptyLabel) {
    return '<option value="">' + escapeHtml(emptyLabel || 'Todos') + '</option>' +
      options.map(function (item) {
        return '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>';
      }).join('');
  }

  function dataListMarkup(options) {
    return options.map(function (item) {
      return '<option value="' + escapeHtml(item) + '"></option>';
    }).join('');
  }

  function normalizeOptionItems(options, type) {
    var items = options && options.items && options.items[type] ? options.items[type] : [];

    return items.map(function (item) {
      return {
        id: item.id || '',
        tipo: item.tipo || type,
        nome: item.nome || item.label || ''
      };
    }).filter(function (item) {
      return item.nome;
    });
  }

  function fillOptions(options) {
    state.options = options || state.options;
    state.options.items = {
      localTrabalho: normalizeOptionItems(state.options, 'localTrabalho'),
      setor: normalizeOptionItems(state.options, 'setor'),
      funcao: normalizeOptionItems(state.options, 'funcao')
    };

    var locais = state.options.locaisTrabalho || [];
    var setores = state.options.setores || [];
    var funcoes = state.options.funcoes || [];

    html('filterLocalTrabalho', optionMarkup(locais, 'Todos'));
    html('filterSetor', optionMarkup(setores, 'Todos'));
    html('filterFuncao', optionMarkup(funcoes, 'Todas'));

    html('reportLocalTrabalho', optionMarkup(locais, 'Todos'));
    html('reportSetor', optionMarkup(setores, 'Todos'));
    html('reportFuncao', optionMarkup(funcoes, 'Todas'));

    html('localTrabalhoList', dataListMarkup(locais));
    html('setorList', dataListMarkup(setores));
    html('funcaoList', dataListMarkup(funcoes));

    renderOptionManagers();
  }

  function badge(status) {
    var value = status || 'ATIVO';
    return '<span class="badge ' + escapeHtml(value) + '">' + escapeHtml(value) + '</span>';
  }

  function memberRow(member, includeActions) {
    var cells = [
      escapeHtml(member.nome || '-'),
      escapeHtml(formatCpf(member.cpf)),
      escapeHtml(formatPhone(member.telefone)),
      escapeHtml(member.localTrabalho || '-'),
      escapeHtml(member.setor || '-'),
      escapeHtml(member.funcao || '-'),
      badge(member.status || 'ATIVO')
    ];

    if (includeActions) {
      cells.push(
        '<button class="btn btn-secondary" type="button" data-edit-member="' +
        escapeHtml(member.id) +
        '">Editar</button>'
      );
    }

    return '<tr>' + cells.map(function (cell) {
      return '<td>' + cell + '</td>';
    }).join('') + '</tr>';
  }

  function groupRow(item, labelFallback) {
    return '<tr><td>' + escapeHtml(item.label || labelFallback || 'Não informado') +
      '</td><td>' + escapeHtml(item.total) + '</td></tr>';
  }

  function renderDashboard(data) {
    var stats = data.stats || {};
    state.recentMembers = data.recentMembers || [];

    text('unionName', data.unionName || runtime.UNION_NAME_FALLBACK || 'Cadastro de Associados');
    text('buildInfo', 'Usuário: ' + (state.user && state.user.nome ? state.user.nome : 'admin') + ' • ' + runtime.BUILD_VERSION);
    text('statTotal', stats.total || 0);
    text('statAtivos', stats.ativos || 0);
    text('statLocais', stats.locaisTrabalho || 0);
    text('statFuncoes', stats.funcoes || 0);

    if (!state.recentMembers.length) {
      html('recentMembersBody', '<tr><td colspan="5">Nenhum associado cadastrado ainda.</td></tr>');
      return;
    }

    html('recentMembersBody', state.recentMembers.map(function (member) {
      return '<tr>' +
        '<td>' + escapeHtml(member.nome || '-') + '</td>' +
        '<td>' + escapeHtml(member.localTrabalho || '-') + '</td>' +
        '<td>' + escapeHtml(member.setor || '-') + '</td>' +
        '<td>' + escapeHtml(member.funcao || '-') + '</td>' +
        '<td>' + badge(member.status || 'ATIVO') + '</td>' +
        '</tr>';
    }).join(''));
  }

  function renderMembers(members) {
    state.members = members || [];

    text('consultCount', state.members.length + ' associado(s) encontrado(s).');

    if (!state.members.length) {
      html('membersTableBody', '<tr><td colspan="8">Nenhum associado encontrado.</td></tr>');
      return;
    }

    html('membersTableBody', state.members.map(function (member) {
      return memberRow(member, true);
    }).join(''));
  }

  function renderReport(report) {
    state.report = report || {};
    var summary = state.report.summary || {};
    var groups = state.report.groups || {};
    var members = state.report.members || [];

    text('reportTotal', summary.total || 0);
    text('reportAtivos', summary.ativos || 0);
    text('reportInativos', summary.inativos || 0);
    text('reportGeneratedAt', formatDateTime(state.report.generatedAt));
    text('reportListCount', members.length + ' associado(s) listado(s).');

    html('reportByLocalBody', (groups.porLocalTrabalho || []).length ?
      groups.porLocalTrabalho.map(groupRow).join('') :
      '<tr><td colspan="2">Sem dados.</td></tr>');

    html('reportBySetorBody', (groups.porSetor || []).length ?
      groups.porSetor.map(groupRow).join('') :
      '<tr><td colspan="2">Sem dados.</td></tr>');

    html('reportByFuncaoBody', (groups.porFuncao || []).length ?
      groups.porFuncao.map(groupRow).join('') :
      '<tr><td colspan="2">Sem dados.</td></tr>');

    html('reportMembersBody', members.length ?
      members.map(function (member) { return memberRow(member, false); }).join('') :
      '<tr><td colspan="7">Nenhum associado encontrado para o relatório.</td></tr>');
  }

  function resetMemberForm() {
    [
      'memberId',
      'memberNome',
      'memberCpf',
      'memberRg',
      'memberDataNascimento',
      'memberTelefone',
      'memberEmail',
      'memberEndereco',
      'memberBairro',
      'memberCep',
      'memberLocalTrabalho',
      'memberSetor',
      'memberFuncao',
      'memberMatricula',
      'memberObservacoes'
    ].forEach(function (id) {
      setValue(id, '');
    });

    setValue('memberCidade', 'Além Paraíba');
    setValue('memberUf', 'MG');
    setValue('memberDataAssociacao', today());
    setValue('memberStatus', 'ATIVO');
    setMessage('memberMessage', '');
  }

  function memberPayload() {
    return {
      id: value('memberId'),
      nome: value('memberNome'),
      cpf: value('memberCpf'),
      rg: value('memberRg'),
      dataNascimento: value('memberDataNascimento'),
      telefone: value('memberTelefone'),
      email: value('memberEmail'),
      endereco: value('memberEndereco'),
      bairro: value('memberBairro'),
      cidade: value('memberCidade'),
      uf: value('memberUf').toUpperCase(),
      cep: value('memberCep'),
      localTrabalho: value('memberLocalTrabalho'),
      setor: value('memberSetor'),
      funcao: value('memberFuncao'),
      matricula: value('memberMatricula'),
      dataAssociacao: value('memberDataAssociacao'),
      status: value('memberStatus') || 'ATIVO',
      observacoes: value('memberObservacoes')
    };
  }

  function fillMemberForm(member) {
    setValue('memberId', member.id);
    setValue('memberNome', member.nome);
    setValue('memberCpf', formatCpf(member.cpf));
    setValue('memberRg', member.rg);
    setValue('memberDataNascimento', member.dataNascimento);
    setValue('memberTelefone', member.telefone);
    setValue('memberEmail', member.email);
    setValue('memberEndereco', member.endereco);
    setValue('memberBairro', member.bairro);
    setValue('memberCidade', member.cidade || 'Além Paraíba');
    setValue('memberUf', member.uf || 'MG');
    setValue('memberCep', member.cep);
    setValue('memberLocalTrabalho', member.localTrabalho);
    setValue('memberSetor', member.setor);
    setValue('memberFuncao', member.funcao);
    setValue('memberMatricula', member.matricula);
    setValue('memberDataAssociacao', member.dataAssociacao);
    setValue('memberStatus', member.status || 'ATIVO');
    setValue('memberObservacoes', member.observacoes);
  }

  function queryFilters(prefix) {
    return {
      search: value(prefix + 'Search'),
      localTrabalho: value(prefix + 'LocalTrabalho'),
      setor: value(prefix + 'Setor'),
      funcao: value(prefix + 'Funcao'),
      status: value(prefix + 'Status'),
      sortBy: value(prefix + 'SortBy') || 'nome',
      sortDir: value(prefix + 'SortDir') || 'asc',
      limit: value(prefix + 'Limit'),
      dataInicial: value(prefix + 'DataInicial'),
      dataFinal: value(prefix + 'DataFinal')
    };
  }

  function consultFilters() {
    return {
      search: value('filterSearch'),
      localTrabalho: value('filterLocalTrabalho'),
      setor: value('filterSetor'),
      funcao: value('filterFuncao'),
      status: value('filterStatus'),
      sortBy: value('filterSortBy') || 'nome',
      sortDir: value('filterSortDir') || 'asc',
      limit: value('filterLimit')
    };
  }

  async function loadOptions() {
    var response = await api.getApi('options');
    fillOptions(response.options || {});
  }

  async function loadDashboard() {
    var response = await api.getApi('dashboard');
    renderDashboard(response);
  }

  async function searchMembers() {
    clearMessages();

    try {
      var response = await api.getApi('members_list', consultFilters());
      renderMembers(response.members || []);
      setMessage('consultMessage', 'Consulta carregada com sucesso.', 'success');
    } catch (error) {
      setMessage('consultMessage', error.message || 'Falha ao consultar associados.', 'error');
    }
  }

  async function loadReport() {
    clearMessages();

    try {
      var response = await api.getApi('reports_associados', queryFilters('report'));
      renderReport(response.report || {});
      setMessage('reportMessage', 'Relatório gerado com sucesso.', 'success');
    } catch (error) {
      setMessage('reportMessage', error.message || 'Falha ao gerar relatório.', 'error');
    }
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

      if (orderA !== orderB) return orderA - orderB;

      var typeA = orderMap[a.tipo] == null ? 99 : orderMap[a.tipo];
      var typeB = orderMap[b.tipo] == null ? 99 : orderMap[b.tipo];

      if (typeA !== typeB) return typeA - typeB;

      var dateA = a.data || '';
      var dateB = b.data || '';

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

    if (item.data) meta.push(formatDate(item.data));
    if (item.horario) meta.push(item.horario);
    if (item.local) meta.push(item.local);

    var link = safeHref(item.link);

    return '<article class="public-info-card">' +
      '<span class="portal-status-badge">' + escapeHtml(publicTypeLabel(item.tipo)) + '</span>' +
      '<strong>' + escapeHtml(item.titulo || '-') + '</strong>' +
      (item.descricao ? '<p>' + escapeHtml(item.descricao) + '</p>' : '<p class="muted">Sem descrição complementar.</p>') +
      (meta.length ? '<small>' + escapeHtml(meta.join(' • ')) + '</small>' : '') +
      (link ? '<a class="btn btn-secondary" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">Abrir link</a>' : '') +
      '</article>';
  }

  function renderPublicList(id, items, emptyMessage) {
    if (!byId(id)) {
      return;
    }

    if (!items || !items.length) {
      html(id, '<p class="muted">' + escapeHtml(emptyMessage || 'Nenhuma informação publicada.') + '</p>');
      return;
    }

    html(id, items.map(publicCardMarkup).join(''));
  }

  function renderPublicTimeline(items) {
    var agenda = sortPublicItems(items || []).filter(function (item) {
      return item.tipo === 'agenda';
    });

    if (!agenda.length) {
      html('publicNextAgenda', '<p class="muted">Nenhuma agenda publicada.</p>');
      return;
    }

    html('publicNextAgenda', agenda.slice(0, 6).map(function (item) {
      var meta = [formatDate(item.data), item.horario, item.local].filter(Boolean).join(' • ');

      return '<div>' +
        '<strong>' + escapeHtml(item.titulo || '-') + '</strong>' +
        '<span>' + escapeHtml(meta || 'Data a confirmar') + '</span>' +
        (item.descricao ? '<p class="muted small">' + escapeHtml(item.descricao) + '</p>' : '') +
      '</div>';
    }).join(''));
  }

  function renderPublicItems(items) {
    var activeItems = (items || []).filter(function (item) {
      return String(item.status || 'ATIVO').toUpperCase() === 'ATIVO';
    });
    var groups = groupPublicItems(activeItems);
    var highlights = sortPublicItems(activeItems).slice(0, 6);

    state.publicGroups = groups;

    renderPublicList('publicHighlights', highlights, 'Nenhum destaque publicado ainda.');
    renderPublicTimeline(groups.agenda || []);
    renderPublicList('publicAgendaList', groups.agenda, 'Nenhuma agenda publicada.');
    renderPublicList('publicComunicadoList', groups.comunicado, 'Nenhum comunicado publicado.');
    renderPublicList('publicDocumentoList', groups.documento, 'Nenhum documento publicado.');
    renderPublicList('publicAtaList', groups.ata, 'Nenhuma ata publicada.');
    renderPublicList('publicCursoList', groups.curso, 'Nenhum curso publicado.');
    renderPublicList('publicServicoList', groups.servico, 'Nenhum serviço publicado.');
  }

  async function loadPublicContent() {
    try {
      var response = await api.getApi('public_list');
      state.publicItems = response.items || [];
      renderPublicItems(state.publicItems);
      setMessage('publicMessage', '');
    } catch (error) {
      renderPublicItems([]);
      setMessage('publicMessage', error.message || 'Falha ao carregar o painel público.', 'error');
    }
  }

  function publicItemPayload() {
    return {
      id: value('publicItemId'),
      tipo: value('publicItemTipo') || 'comunicado',
      titulo: value('publicItemTitulo'),
      descricao: value('publicItemDescricao'),
      data: value('publicItemData'),
      horario: value('publicItemHorario'),
      local: value('publicItemLocal'),
      link: value('publicItemLink'),
      ordem: value('publicItemOrdem'),
      status: value('publicItemStatus') || 'ATIVO'
    };
  }

  function resetPublicItemForm() {
    setValue('publicItemId', '');
    setValue('publicItemTipo', 'comunicado');
    setValue('publicItemTitulo', '');
    setValue('publicItemDescricao', '');
    setValue('publicItemData', '');
    setValue('publicItemHorario', '');
    setValue('publicItemLocal', '');
    setValue('publicItemLink', '');
    setValue('publicItemOrdem', '');
    setValue('publicItemStatus', 'ATIVO');
    setMessage('publicConfigMessage', '');
  }

  function renderPublicItemsAdmin(items) {
    state.publicItems = items || [];

    if (!byId('publicItemsBody')) {
      return;
    }

    if (!state.publicItems.length) {
      html('publicItemsBody', '<tr><td colspan="5">Nenhuma informação pública cadastrada.</td></tr>');
      return;
    }

    html('publicItemsBody', sortPublicItems(state.publicItems).map(function (item) {
      return '<tr>' +
        '<td>' + escapeHtml(publicTypeLabel(item.tipo)) + '</td>' +
        '<td>' + escapeHtml(item.titulo || '-') + '</td>' +
        '<td>' + escapeHtml(formatDate(item.data)) + '</td>' +
        '<td>' + badge(item.status || 'ATIVO') + '</td>' +
        '<td>' +
          '<div class="option-actions">' +
            '<button class="btn btn-secondary" type="button" data-edit-public-item="' + escapeHtml(item.id) + '">Editar</button>' +
            '<button class="btn btn-secondary" type="button" data-delete-public-item="' + escapeHtml(item.id) + '">Excluir</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join(''));
  }

  async function loadPublicItemsAdmin() {
    var response = await api.getApi('public_items_list');
    renderPublicItemsAdmin(response.items || []);
  }

  async function savePublicItem(event) {
    event.preventDefault();
    clearMessages();

    var payload = publicItemPayload();

    if (!payload.titulo) {
      setMessage('publicConfigMessage', 'Informe o título da informação pública.', 'error');
      return;
    }

    try {
      await api.postApi('public_item_save', payload);
      resetPublicItemForm();
      await loadPublicItemsAdmin();
      await loadPublicContent();
      setMessage('publicConfigMessage', 'Informação pública salva com sucesso.', 'success');
    } catch (error) {
      setMessage('publicConfigMessage', error.message || 'Falha ao salvar informação pública.', 'error');
    }
  }

  function editPublicItem(id) {
    var item = (state.publicItems || []).find(function (publicItem) {
      return publicItem.id === id;
    });

    if (!item) {
      setMessage('publicConfigMessage', 'Informação pública não encontrada para edição.', 'error');
      return;
    }

    setValue('publicItemId', item.id);
    setValue('publicItemTipo', item.tipo || 'comunicado');
    setValue('publicItemTitulo', item.titulo);
    setValue('publicItemDescricao', item.descricao);
    setValue('publicItemData', item.data);
    setValue('publicItemHorario', item.horario);
    setValue('publicItemLocal', item.local);
    setValue('publicItemLink', item.link);
    setValue('publicItemOrdem', item.ordem);
    setValue('publicItemStatus', item.status || 'ATIVO');

    byId('publicItemTitulo').focus();
    setMessage('publicConfigMessage', 'Edite a informação e clique em Salvar.', 'success');
  }

  async function deletePublicItem(id) {
    var item = (state.publicItems || []).find(function (publicItem) {
      return publicItem.id === id;
    });

    if (!item) {
      setMessage('publicConfigMessage', 'Informação pública não encontrada para exclusão.', 'error');
      return;
    }

    if (!window.confirm('Excluir a informação "' + item.titulo + '"?')) {
      return;
    }

    try {
      await api.postApi('public_item_delete', { id: id });
      resetPublicItemForm();
      await loadPublicItemsAdmin();
      await loadPublicContent();
      setMessage('publicConfigMessage', 'Informação pública excluída com sucesso.', 'success');
    } catch (error) {
      setMessage('publicConfigMessage', error.message || 'Falha ao excluir informação pública.', 'error');
    }
  }

  async function openInternalArea() {
    if (!api.getSessionToken()) {
      showLogin();
      return;
    }

    try {
      var response = await api.getApi('session');
      state.user = response.user;
      showApp();
      resetMemberForm();
      await refreshAll();
    } catch (error) {
      api.clearSessionToken();
      showLogin();
    }
  }


  async function refreshAll() {
    clearMessages();

    try {
      await loadOptions();
      await loadUsers();
      await loadPublicItemsAdmin();
      await loadDashboard();

      if (byId('tab-consulta').classList.contains('active')) {
        await searchMembers();
      }

      if (byId('tab-relatorios').classList.contains('active')) {
        await loadReport();
      }

      setMessage('globalMessage', 'Sistema atualizado.', 'success');
    } catch (error) {
      setMessage('globalMessage', error.message || 'Falha ao atualizar o sistema.', 'error');
    }
  }

  async function saveMember(event) {
    event.preventDefault();
    clearMessages();

    var payload = memberPayload();

    if (!payload.nome || !payload.localTrabalho || !payload.setor || !payload.funcao) {
      setMessage('memberMessage', 'Preencha nome, onde trabalha, setor e função/cargo.', 'error');
      return;
    }

    try {
      var response = await api.postApi('member_save', payload);
      fillMemberForm(response.member);
      setMessage('memberMessage', 'Associado salvo com sucesso.', 'success');
      await loadOptions();
      await loadUsers();
      await loadPublicItemsAdmin();
      await loadDashboard();
    } catch (error) {
      setMessage('memberMessage', error.message || 'Falha ao salvar associado.', 'error');
    }
  }

  async function editMember(id) {
    clearMessages();

    try {
      var response = await api.getApi('member_get', { id: id });
      fillMemberForm(response.member || {});
      activateTab('cadastro');
      setMessage('memberMessage', 'Cadastro carregado para edição.', 'success');
    } catch (error) {
      setMessage('consultMessage', error.message || 'Falha ao carregar associado.', 'error');
    }
  }

  async function quickSearch(event) {
    event.preventDefault();
    clearMessages();

    try {
      var response = await api.getApi('members_list', {
        search: value('quickSearchText'),
        limit: 5,
        sortBy: 'nome',
        sortDir: 'asc'
      });

      var members = response.members || [];

      if (!members.length) {
        html('quickResult', '<p class="muted">Nenhum associado encontrado.</p>');
        return;
      }

      html('quickResult', members.map(function (member) {
        return '<div class="panel-block">' +
          '<strong>' + escapeHtml(member.nome || '-') + '</strong>' +
          '<dl>' +
          '<dt>Onde trabalha</dt><dd>' + escapeHtml(member.localTrabalho || '-') + '</dd>' +
          '<dt>Setor</dt><dd>' + escapeHtml(member.setor || '-') + '</dd>' +
          '<dt>Função</dt><dd>' + escapeHtml(member.funcao || '-') + '</dd>' +
          '<dt>Telefone</dt><dd>' + escapeHtml(formatPhone(member.telefone)) + '</dd>' +
          '</dl>' +
          '<button class="btn btn-secondary mt-16" type="button" data-edit-member="' + escapeHtml(member.id) + '">Editar</button>' +
          '</div>';
      }).join(''));
    } catch (error) {
      html('quickResult', '<p class="message error">' + escapeHtml(error.message || 'Falha na consulta rápida.') + '</p>');
    }
  }

  function optionItems(type) {
    return state.options && state.options.items && state.options.items[type]
      ? state.options.items[type]
      : [];
  }

  function optionConfig(type) {
    return OPTION_CONFIG[type] || null;
  }

  function resetOptionForm(type) {
    var config = optionConfig(type);

    if (!config) return;

    setValue(config.idInput, '');
    setValue(config.nameInput, '');
  }

  function renderOptionManagers() {
    Object.keys(OPTION_CONFIG).forEach(function (type) {
      var config = OPTION_CONFIG[type];
      var items = optionItems(type);

      if (!byId(config.bodyId)) {
        return;
      }

      if (!items.length) {
        html(config.bodyId, '<tr><td colspan="2">Nenhuma opção cadastrada.</td></tr>');
        return;
      }

      html(config.bodyId, items.map(function (item) {
        return '<tr>' +
          '<td>' + escapeHtml(item.nome || '-') + '</td>' +
          '<td>' +
            '<div class="option-actions">' +
              '<button class="btn btn-secondary" type="button" data-edit-option="' + escapeHtml(item.id) + '" data-option-type="' + escapeHtml(type) + '">Editar</button>' +
              '<button class="btn btn-secondary" type="button" data-delete-option="' + escapeHtml(item.id) + '" data-option-type="' + escapeHtml(type) + '">Excluir</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join(''));
    });
  }

  async function saveOption(event) {
    event.preventDefault();
    clearMessages();

    var form = event.currentTarget;
    var type = form.getAttribute('data-option-type');
    var config = optionConfig(type);
    var nome = config ? value(config.nameInput) : '';

    if (!config || !nome) {
      setMessage('optionsMessage', 'Informe o nome da opção.', 'error');
      return;
    }

    try {
      await api.postApi('option_save', {
        id: value(config.idInput),
        tipo: type,
        nome: nome
      });

      resetOptionForm(type);
      await loadOptions();
      setMessage('optionsMessage', config.label + ' salvo com sucesso.', 'success');
    } catch (error) {
      setMessage('optionsMessage', error.message || 'Falha ao salvar opção.', 'error');
    }
  }

  function editOption(type, id) {
    var config = optionConfig(type);
    var item = optionItems(type).find(function (option) {
      return option.id === id;
    });

    if (!config || !item) {
      setMessage('optionsMessage', 'Opção não encontrada para edição.', 'error');
      return;
    }

    setValue(config.idInput, item.id);
    setValue(config.nameInput, item.nome);
    byId(config.nameInput).focus();
    setMessage('optionsMessage', 'Edite o nome e clique em Salvar.', 'success');
  }

  async function deleteOption(type, id) {
    var config = optionConfig(type);
    var item = optionItems(type).find(function (option) {
      return option.id === id;
    });

    if (!config || !item) {
      setMessage('optionsMessage', 'Opção não encontrada para exclusão.', 'error');
      return;
    }

    if (!window.confirm('Excluir a opção "' + item.nome + '"? Os associados já cadastrados não serão apagados.')) {
      return;
    }

    try {
      await api.postApi('option_delete', {
        id: id,
        tipo: type
      });

      resetOptionForm(type);
      await loadOptions();
      setMessage('optionsMessage', config.label + ' excluído com sucesso.', 'success');
    } catch (error) {
      setMessage('optionsMessage', error.message || 'Falha ao excluir opção.', 'error');
    }
  }

  function resetUserForm() {
    setValue('userNome', '');
    setValue('userUsername', '');
    setValue('userPassword', '');
  }

  function renderUsers(users) {
    state.users = users || [];

    if (!state.users.length) {
      html('usersTableBody', '<tr><td colspan="4">Nenhum usuário ativo cadastrado.</td></tr>');
      return;
    }

    html('usersTableBody', state.users.map(function (user) {
      return '<tr>' +
        '<td>' + escapeHtml(user.nome || '-') + '</td>' +
        '<td>' + escapeHtml(user.username || '-') + '</td>' +
        '<td>' + escapeHtml(formatDateTime(user.createdAt)) + '</td>' +
        '<td>' +
          '<button class="btn btn-secondary" type="button" data-delete-user="' + escapeHtml(user.id) + '">Remover</button>' +
        '</td>' +
      '</tr>';
    }).join(''));
  }

  async function loadUsers() {
    var response = await api.getApi('users_list');
    renderUsers(response.users || []);
  }

  async function saveUser(event) {
    event.preventDefault();
    clearMessages();

    var payload = {
      nome: value('userNome'),
      username: value('userUsername'),
      password: value('userPassword')
    };

    if (!payload.nome || !payload.username || !payload.password) {
      setMessage('usersMessage', 'Preencha nome, usuário e senha.', 'error');
      return;
    }

    try {
      await api.postApi('user_save', payload);
      resetUserForm();
      await loadUsers();
      setMessage('usersMessage', 'Usuário adicionado com sucesso.', 'success');
    } catch (error) {
      setMessage('usersMessage', error.message || 'Falha ao adicionar usuário.', 'error');
    }
  }

  async function deleteUser(id) {
    var user = (state.users || []).find(function (item) {
      return item.id === id;
    });

    if (!user) {
      setMessage('usersMessage', 'Usuário não encontrado para remoção.', 'error');
      return;
    }

    if (!window.confirm('Remover o usuário "' + user.username + '"?')) {
      return;
    }

    try {
      await api.postApi('user_delete', { id: id });
      await loadUsers();
      setMessage('usersMessage', 'Usuário removido com sucesso.', 'success');
    } catch (error) {
      setMessage('usersMessage', error.message || 'Falha ao remover usuário.', 'error');
    }
  }

  function csvEscape(value) {
    var textValue = String(value == null ? '' : value);
    return '"' + textValue.replace(/"/g, '""') + '"';
  }

  function downloadCsv(filename, rows) {
    if (!rows.length) {
      setMessage('globalMessage', 'Não há dados para exportar.', 'error');
      return;
    }

    var content = rows.map(function (row) {
      return row.map(csvEscape).join(';');
    }).join('\n');

    var blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function memberCsvRows(members) {
    var rows = [[
      'Nome',
      'CPF',
      'RG',
      'Telefone',
      'E-mail',
      'Onde trabalha',
      'Setor',
      'Função',
      'Matrícula',
      'Data de associação',
      'Status',
      'Observações'
    ]];

    members.forEach(function (member) {
      rows.push([
        member.nome,
        formatCpf(member.cpf),
        member.rg,
        formatPhone(member.telefone),
        member.email,
        member.localTrabalho,
        member.setor,
        member.funcao,
        member.matricula,
        formatDate(member.dataAssociacao),
        member.status,
        member.observacoes
      ]);
    });

    return rows;
  }

  function exportConsultCsv() {
    downloadCsv('consulta_associados.csv', memberCsvRows(state.members || []));
  }

  function exportReportCsv() {
    var members = state.report && state.report.members ? state.report.members : [];
    downloadCsv('relatorio_associados.csv', memberCsvRows(members));
  }

  function printReport() {
    if (!state.report) {
      setMessage('reportMessage', 'Gere o relatório antes de imprimir.', 'error');
      return;
    }

    window.print();
  }

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('loginMessage', '');

    try {
      var response = await api.postApi('login', {
        username: value('loginUsername'),
        password: value('loginPassword')
      }, false);

      api.setSessionToken(response.sessionToken);
      state.user = response.user;
      showApp();
      resetMemberForm();
      await refreshAll();
    } catch (error) {
      setMessage('loginMessage', error.message || 'Falha no login.', 'error');
    }
  }

  async function handleLogout() {
    try {
      await api.postApi('logout', {});
    } catch (error) {
      // A sessão local deve ser encerrada mesmo que o servidor já tenha expirado.
    }

    api.clearSessionToken();
    showLogin();
  }

  async function restoreSession() {
    if (!api.getSessionToken()) {
      showLogin();
      return;
    }

    try {
      var response = await api.getApi('session');
      state.user = response.user;
      showApp();
      resetMemberForm();
      await refreshAll();
    } catch (error) {
      api.clearSessionToken();
      showLogin();
    }
  }

  function bindEvents() {
    byId('loginForm').addEventListener('submit', handleLogin);
    byId('logoutBtn').addEventListener('click', handleLogout);
    byId('refreshBtn').addEventListener('click', refreshAll);

    if (byId('internalLoginBtn')) {
      byId('internalLoginBtn').addEventListener('click', openInternalArea);
    }

    if (byId('publicBackBtn')) {
      byId('publicBackBtn').addEventListener('click', showPublic);
    }

    if (byId('publicRefreshBtn')) {
      byId('publicRefreshBtn').addEventListener('click', loadPublicContent);
    }

    if (byId('publicItemForm')) {
      byId('publicItemForm').addEventListener('submit', savePublicItem);
    }

    if (byId('clearPublicItemBtn')) {
      byId('clearPublicItemBtn').addEventListener('click', resetPublicItemForm);
    }
    byId('memberForm').addEventListener('submit', saveMember);
    byId('userForm').addEventListener('submit', saveUser);
    byId('newMemberBtn').addEventListener('click', resetMemberForm);
    byId('clearMemberBtn').addEventListener('click', resetMemberForm);
    byId('clearUserBtn').addEventListener('click', resetUserForm);
    byId('searchMembersBtn').addEventListener('click', searchMembers);
    byId('quickSearchForm').addEventListener('submit', quickSearch);
    byId('loadReportBtn').addEventListener('click', loadReport);
    byId('printReportBtn').addEventListener('click', printReport);
    byId('exportConsultCsvBtn').addEventListener('click', exportConsultCsv);
    byId('exportReportCsvBtn').addEventListener('click', exportReportCsv);

    Object.keys(OPTION_CONFIG).forEach(function (type) {
      var config = OPTION_CONFIG[type];

      if (byId(config.formId)) {
        byId(config.formId).addEventListener('submit', saveOption);
      }
    });

    document.querySelectorAll('[data-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        activateTab(button.getAttribute('data-tab'));
      });
    });

    document.querySelectorAll('[data-public-section]').forEach(function (button) {
      button.addEventListener('click', function () {
        activatePublicSection(button.getAttribute('data-public-section'));
      });
    });

    document.querySelectorAll('[data-open-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        activateTab(button.getAttribute('data-open-tab'));
      });
    });

    document.addEventListener('click', function (event) {
      var editButton = event.target.closest('[data-edit-member]');
      if (editButton) {
        editMember(editButton.getAttribute('data-edit-member'));
        return;
      }

      var deleteUserButton = event.target.closest('[data-delete-user]');
      if (deleteUserButton) {
        deleteUser(deleteUserButton.getAttribute('data-delete-user'));
        return;
      }

      var editPublicItemButton = event.target.closest('[data-edit-public-item]');
      if (editPublicItemButton) {
        editPublicItem(editPublicItemButton.getAttribute('data-edit-public-item'));
        return;
      }

      var deletePublicItemButton = event.target.closest('[data-delete-public-item]');
      if (deletePublicItemButton) {
        deletePublicItem(deletePublicItemButton.getAttribute('data-delete-public-item'));
        return;
      }

      var editOptionButton = event.target.closest('[data-edit-option]');
      if (editOptionButton) {
        editOption(
          editOptionButton.getAttribute('data-option-type'),
          editOptionButton.getAttribute('data-edit-option')
        );
        return;
      }

      var deleteOptionButton = event.target.closest('[data-delete-option]');
      if (deleteOptionButton) {
        deleteOption(
          deleteOptionButton.getAttribute('data-option-type'),
          deleteOptionButton.getAttribute('data-delete-option')
        );
        return;
      }

      var clearOptionButton = event.target.closest('[data-clear-option]');
      if (clearOptionButton) {
        resetOptionForm(clearOptionButton.getAttribute('data-clear-option'));
      }
    });

    ['filterSearch', 'filterLocalTrabalho', 'filterSetor', 'filterFuncao', 'filterStatus'].forEach(function (id) {
      byId(id).addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          searchMembers();
        }
      });
    });
  }

  function startPhraseRotator() {
    var phrases = [
      'Controle os dados dos associados por local de trabalho, setor e função.',
      'Use relatórios para localizar motoristas, professores e demais categorias.',
      'Cadastros completos facilitam atendimento interno e prestação de informações.',
      'Atualize setor e função sempre que o associado mudar de local de trabalho.'
    ];
    var index = 0;
    var phraseEl = byId('managementPhrase');

    if (!phraseEl) return;

    window.setInterval(function () {
      index = (index + 1) % phrases.length;
      phraseEl.classList.add('is-changing');

      window.setTimeout(function () {
        phraseEl.textContent = phrases[index];
        phraseEl.classList.remove('is-changing');
      }, 180);
    }, 6200);
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    startPhraseRotator();
    restoreSession();
  });
}());
