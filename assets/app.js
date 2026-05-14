(function () {
  'use strict';

  var api = window.ASSOC_API;
  var runtime = api.getRuntime();

  var state = {
    user: null,
    members: [],
    recentMembers: [],
    report: null,
    reportPage: 1,
    reportPageSize: 50,
    reportActiveFuncao: '',
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

  function formatCep(value) {
    var cep = digits(value);

    if (cep.length === 8) {
      return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
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

  function setMemberEditMode(member) {
    var memberId = String(member && member.id ? member.id : '').trim();
    var memberName = String(member && member.nome ? member.nome : '').trim();
    var notice = byId('memberEditNotice');
    var nameEl = byId('memberEditName');
    var submitBtn = byId('memberSubmitBtn');

    if (notice) {
      notice.classList.toggle('hidden', !memberId);
    }

    if (nameEl) {
      nameEl.textContent = memberName || '-';
    }

    if (submitBtn) {
      submitBtn.textContent = memberId ? 'Atualizar associado' : 'Salvar associado';
    }
  }

  function setDuplicateNotice(duplicates) {
    var notice = byId('memberDuplicateNotice');

    if (!notice) return;

    if (!duplicates || !duplicates.length) {
      notice.classList.add('hidden');
      notice.innerHTML = '';
      return;
    }

    notice.classList.remove('hidden');
    notice.innerHTML =
      '<strong>Atenção: possível cadastro duplicado.</strong>' +
      '<span>Confira antes de salvar. O sistema encontrou:</span>' +
      '<ul>' +
      duplicates.slice(0, 5).map(function (item) {
        return '<li>' + escapeHtml(item.motivos.join(', ')) + ': ' +
          escapeHtml(item.nome || '-') + ' — ' +
          escapeHtml(item.funcao || '-') + '</li>';
      }).join('') +
      '</ul>';
  }

  function duplicateConfirmText(duplicates) {
    return 'Possível cadastro duplicado encontrado:\n\n' +
      duplicates.slice(0, 5).map(function (item) {
        return '- ' + item.motivos.join(', ') + ': ' +
          (item.nome || '-') + ' / ' + (item.funcao || '-');
      }).join('\n') +
      '\n\nDeseja salvar mesmo assim?';
  }

  async function confirmPossibleDuplicate(payload) {
    var response = await api.postApi('member_duplicates', payload);
    var duplicates = response.duplicates || [];

    setDuplicateNotice(duplicates);

    if (!duplicates.length) {
      return true;
    }

    return window.confirm(duplicateConfirmText(duplicates));
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
    var safeValue = escapeHtml(value);
    return '<span class="badge status-badge ' + safeValue + '" aria-label="' + safeValue + '">' + safeValue + '</span>';
  }

  function memberRow(member, includeActions) {
    var cells = [
      escapeHtml(member.nome || '-'),
      escapeHtml(formatDate(member.dataAdmissao)),
      escapeHtml(formatPhone(member.telefone)),
      escapeHtml(member.localTrabalho || '-'),
      escapeHtml(member.setor || '-'),
      escapeHtml(member.funcao || '-'),
      badge(member.status || 'ATIVO')
    ];

    if (includeActions) {
      cells.push(
        '<div class="actions member-row-actions">' +
        '<button class="btn btn-secondary" type="button" data-edit-member="' +
        escapeHtml(member.id) +
        '">Editar</button>' +
        '<button class="btn btn-secondary" type="button" data-delete-member="' +
        escapeHtml(member.id) +
        '" data-member-name="' +
        escapeHtml(member.nome || '') +
        '">Excluir</button>' +
        '</div>'
      );
    }

    return '<tr>' + cells.map(function (cell) {
      return '<td>' + cell + '</td>';
    }).join('') + '</tr>';
  }

  function memberActions(member) {
    return '<div class="actions member-row-actions">' +
      '<button class="btn btn-secondary" type="button" data-edit-member="' +
      escapeHtml(member.id) +
      '">Editar</button>' +
      '<button class="btn btn-secondary" type="button" data-delete-member="' +
      escapeHtml(member.id) +
      '" data-member-name="' +
      escapeHtml(member.nome || '') +
      '">Excluir</button>' +
      '</div>';
  }

  function reportMetaLine(label, value) {
    return '<span><b>' + escapeHtml(label) + ':</b> ' + escapeHtml(value || '-') + '</span>';
  }

  function reportStatusText(status) {
    var value = status || 'ATIVO';
    var className = normalizeText(value) === 'inativo' ? 'is-inactive' : 'is-active';

    return '<span class="report-status-badge ' + className + '">' + escapeHtml(value) + '</span>';
  }

  function reportMemberRow(member) {
    return '<tr>' +
      '<td class="report-person-cell" data-print-member="' + escapeHtml(member.id) + '" title="Clique duas vezes para gerar a ficha em PDF">' +
      '<strong class="report-member-name">' + escapeHtml(member.nome || '-') + '</strong>' +
      '<div class="report-member-meta">' +
      reportMetaLine('Admissão', formatDate(member.dataAdmissao)) +
      reportMetaLine('Telefone', formatPhone(member.telefone)) +
      reportMetaLine('Matrícula', member.matricula || '-') +
      '</div>' +
      '</td>' +
      '<td class="report-work-cell">' +
      '<strong class="report-member-function">' + escapeHtml(member.funcao || '-') + '</strong>' +
      '<div class="report-member-meta">' +
      reportMetaLine('Setor', member.setor || '-') +
      reportMetaLine('Onde trabalha', member.localTrabalho || '-') +
      '</div>' +
      '</td>' +
      '<td class="report-status-cell">' + reportStatusText(member.status) + '</td>' +
      '<td class="report-actions-cell">' + memberActions(member) + '</td>' +
      '</tr>';
  }

  function groupRow(item, labelFallback) {
    return '<tr><td>' + escapeHtml(item.label || labelFallback || 'Não informado') +
      '</td><td>' + escapeHtml(item.total) + '</td></tr>';
  }

  function functionGroupRow(item) {
    var label = item.label || 'Não informado';
    return '<tr class="report-function-row" data-report-funcao="' + escapeHtml(label) + '">' +
      '<td>' + escapeHtml(label) + '</td>' +
      '<td>' + escapeHtml(item.total) + '</td>' +
      '</tr>';
  }

  function renderDashboard(data) {
    var stats = data.stats || {};
    state.recentMembers = data.recentMembers || [];

    text('unionName', data.unionName || runtime.UNION_NAME_FALLBACK || 'Cadastro de Associados');
    text('buildInfo', 'Usuário: ' + (state.user && state.user.nome ? state.user.nome : 'admin') + ' • ' + runtime.BUILD_VERSION);
    text('statTotal', stats.total || 0);
    text('statAtivos', stats.ativos || 0);
    text('statInativos', stats.inativos || 0);
    text('statGeneratedAt', formatDateTime(new Date().toISOString()));

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
    state.reportPage = 1;
    state.reportActiveFuncao = '';

    var groups = state.report.groups || {};
    var members = state.report.members || [];

    renderReportMembers(members, '');

    html('reportByFuncaoBody', (groups.porFuncao || []).length ?
      groups.porFuncao.map(functionGroupRow).join('') :
      '<tr><td colspan="2">Sem dados.</td></tr>');
  }

  function renderReportMembers(members, funcao) {
    var filteredMembers = members || [];
    var pageSize = Number(value('reportPageSize') || state.reportPageSize || 50);

    state.reportActiveFuncao = funcao || '';
    state.reportPageSize = pageSize > 0 ? pageSize : 50;

    if (funcao) {
      filteredMembers = filteredMembers.filter(function (member) {
        return normalizeText(member.funcao || 'Não informado') === normalizeText(funcao);
      });
    }

    var total = filteredMembers.length;
    var totalPages = Math.max(1, Math.ceil(total / state.reportPageSize));

    if (state.reportPage < 1) {
      state.reportPage = 1;
    }

    if (state.reportPage > totalPages) {
      state.reportPage = totalPages;
    }

    var startIndex = (state.reportPage - 1) * state.reportPageSize;
    var pageMembers = filteredMembers.slice(startIndex, startIndex + state.reportPageSize);
    var rangeLabel = total ?
      ' Mostrando ' + (startIndex + 1) + '-' + (startIndex + pageMembers.length) + ' de ' + total + '.' :
      '';

    text(
      'reportListCount',
      total + ' associado(s) listado(s).' +
      (funcao ? ' Função: ' + funcao + '.' : '') +
      rangeLabel
    );

    text('reportPageInfo', 'Página ' + state.reportPage + ' de ' + totalPages);

    var previousButton = byId('reportPrevPageBtn');
    var nextButton = byId('reportNextPageBtn');

    if (previousButton) {
      previousButton.disabled = state.reportPage <= 1;
    }

    if (nextButton) {
      nextButton.disabled = state.reportPage >= totalPages;
    }

    html('reportMembersBody', pageMembers.length ?
      pageMembers.map(reportMemberRow).join('') :
      '<tr><td colspan="4">Nenhum associado encontrado para o relatório.</td></tr>');
  }

  function rerenderReportPage() {
    renderReportMembers(
      state.report && state.report.members ? state.report.members : [],
      state.reportActiveFuncao
    );
  }

  function changeReportPage(direction) {
    state.reportPage += direction;
    rerenderReportPage();
  }

  function changeReportPageSize() {
    state.reportPage = 1;
    state.reportPageSize = Number(value('reportPageSize') || 50);
    rerenderReportPage();
  }

  function clearFunctionFilter() {
    state.reportPage = 1;
    state.reportActiveFuncao = '';

    document.querySelectorAll('[data-report-funcao]').forEach(function (row) {
      row.classList.remove('is-selected');
    });

    renderReportMembers(state.report && state.report.members ? state.report.members : [], '');
  }

  function resetMemberForm() {
    [
      'memberId',
      'memberNome',
      'memberCpf',
      'memberRg',
      'memberDataNascimento',
      'memberDataAdmissao',
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
    setValue('memberDataAdmissao', '');
    setValue('memberStatus', 'ATIVO');
    setMessage('memberMessage', '');
    setDuplicateNotice([]);
    setMemberEditMode({});
  }

  function memberPayload() {
    return {
      id: value('memberId'),
      nome: value('memberNome'),
      cpf: value('memberCpf'),
      rg: value('memberRg'),
      dataNascimento: value('memberDataNascimento'),
      dataAdmissao: value('memberDataAdmissao'),
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
    setValue('memberDataAdmissao', member.dataAdmissao);
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
    setDuplicateNotice([]);
    setMemberEditMode(member || {});
  }

  function queryFilters(prefix) {
    return {
      search: value(prefix + 'Search'),
      nome: value(prefix + 'Nome'),
      cpf: value(prefix + 'Cpf'),
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

  function clearReportFilters() {
    [
      'reportNome',
      'reportCpf',
      'reportLocalTrabalho',
      'reportSetor',
      'reportFuncao',
      'reportStatus',
      'reportDataInicial',
      'reportDataFinal'
    ].forEach(function (id) {
      setValue(id, '');
    });

    setValue('reportSortBy', 'nome');
    state.reportPage = 1;
    loadReport();
  }

  async function loadReport() {
    clearMessages();

    try {
      state.reportPage = 1;
      var response = await api.getApi('reports_associados', queryFilters('report'));
      renderReport(response.report || {});
      setMessage('reportMessage', 'Consulta carregada com sucesso.', 'success');
    } catch (error) {
      setMessage('reportMessage', error.message || 'Falha ao consultar associados.', 'error');
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


  function renderHomeAgenda(items) {
    if (!byId('homeAgendaList')) {
      return;
    }

    var today = new Date();
    var todayKey = today.toISOString().slice(0, 10);

    var agendaItems = (items || []).filter(function (item) {
      return item.tipo === 'agenda' &&
        String(item.status || 'ATIVO').toUpperCase() === 'ATIVO' &&
        (!item.data || item.data >= todayKey);
    }).sort(function (a, b) {
      var dateA = a.data || '9999-12-31';
      var dateB = b.data || '9999-12-31';

      if (dateA !== dateB) return dateA < dateB ? -1 : 1;

      return normalizeText(a.titulo || '') < normalizeText(b.titulo || '') ? -1 : 1;
    }).slice(0, 5);

    if (!agendaItems.length) {
      html('homeAgendaList',
        '<div class="home-agenda-empty">' +
          '<strong>Nenhum compromisso publicado.</strong>' +
          '<span>Cadastre agenda em Configurações > Painel público para aparecer aqui.</span>' +
        '</div>');
      return;
    }

    html('homeAgendaList', agendaItems.map(function (item) {
      var meta = [formatDate(item.data), item.horario, item.local].filter(Boolean).join(' • ');

      return '<article class="home-agenda-item">' +
        '<div class="home-agenda-date">' +
          '<strong>' + escapeHtml(item.data ? formatDate(item.data).slice(0, 5) : '--/--') + '</strong>' +
          '<span>' + escapeHtml(item.data ? formatDate(item.data).slice(6) : 'Data') + '</span>' +
        '</div>' +
        '<div class="home-agenda-info">' +
          '<strong>' + escapeHtml(item.titulo || 'Compromisso') + '</strong>' +
          '<span>' + escapeHtml(meta || 'Data a confirmar') + '</span>' +
          (item.descricao ? '<p>' + escapeHtml(item.descricao) + '</p>' : '') +
        '</div>' +
      '</article>';
    }).join(''));
  }

  function renderPublicItemsAdmin(items) {
    state.publicItems = items || [];
    renderHomeAgenda(state.publicItems);

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


  async function loadBootstrap() {
    var response = await api.getApi('app_bootstrap');

    fillOptions(response.options || {});
    renderUsers(response.users || []);
    renderPublicItemsAdmin(response.publicItems || []);
    renderDashboard(response.dashboard || {});
  }

  async function refreshAll() {
    clearMessages();

    try {
      await loadBootstrap();

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

    if (!payload.nome || !payload.funcao) {
      setMessage('memberMessage', 'Preencha nome e função/cargo.', 'error');
      return;
    }

    try {
      var canSave = await confirmPossibleDuplicate(payload);

      if (!canSave) {
        setMessage('memberMessage', 'Salvamento cancelado para conferência do possível duplicado.', 'error');
        return;
      }

      var response = await api.postApi('member_save', payload);
      fillMemberForm(response.member);
      setMessage('memberMessage', payload.id ? 'Associado atualizado com sucesso.' : 'Associado salvo com sucesso.', 'success');
      await loadBootstrap();
    } catch (error) {
      setMessage('memberMessage', error.message || 'Falha ao salvar associado.', 'error');
    }
  }

  async function editMember(id) {
    clearMessages();

    if (!id) {
      setMessage('memberMessage', 'Associado não informado para edição.', 'error');
      return;
    }

    activateTab('cadastro');
    setMessage('memberMessage', 'Carregando cadastro para edição...', 'success');

    try {
      var response = await api.getApi('member_get', { id: id });
      fillMemberForm(response.member || {});

      var nomeInput = byId('memberNome');
      if (nomeInput) {
        nomeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nomeInput.focus();
      }

      setMessage('memberMessage', 'Editando associado: ' + (response.member && response.member.nome ? response.member.nome : '-'), 'success');
    } catch (error) {
      setMessage('memberMessage', error.message || 'Falha ao carregar associado.', 'error');
    }
  }

  async function deleteMember(id, name) {
    clearMessages();

    if (!id) {
      setMessage('reportMessage', 'Associado não informado para exclusão.', 'error');
      return;
    }

    if (!window.confirm('Excluir o associado "' + (name || 'selecionado') + '"? O cadastro ficará arquivado e sairá das consultas.')) {
      return;
    }

    try {
      await api.postApi('member_delete', { id: id });
      await loadDashboard();

      if (byId('tab-relatorios') && byId('tab-relatorios').classList.contains('active')) {
        await loadReport();
      }

      setMessage('reportMessage', 'Associado excluído das consultas com sucesso.', 'success');
    } catch (error) {
      setMessage('reportMessage', error.message || 'Falha ao excluir associado.', 'error');
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

    downloadTextFile(filename, '\ufeff' + content, 'text/csv;charset=utf-8;');
  }

  function downloadTextFile(filename, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain;charset=utf-8;' });
    var link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function fileStamp() {
    var date = new Date();
    var pad = function (value) {
      return String(value).padStart(2, '0');
    };

    return date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      '_' +
      pad(date.getHours()) +
      pad(date.getMinutes());
  }

  function downloadExcel(filename, rows) {
    if (!rows.length) {
      setMessage('globalMessage', 'Não há dados para exportar.', 'error');
      return;
    }

    var tableRows = rows.map(function (row) {
      return '<tr>' + row.map(function (cell) {
        return '<td>' + escapeHtml(cell == null ? '' : cell) + '</td>';
      }).join('') + '</tr>';
    }).join('');

    var content =
      '<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body>' +
      '<table border="1">' + tableRows + '</table>' +
      '</body></html>';

    downloadTextFile(filename, content, 'application/vnd.ms-excel;charset=utf-8;');
  }

  function downloadJson(filename, data) {
    downloadTextFile(
      filename,
      JSON.stringify(data, null, 2),
      'application/json;charset=utf-8;'
    );
  }


  function splitImportLine(line) {
    var tabCount = (line.match(/\t/g) || []).length;
    var semicolonCount = (line.match(/;/g) || []).length;
    var commaCount = (line.match(/,/g) || []).length;
    var separator = '\t';

    if (tabCount === 0 && semicolonCount >= commaCount) {
      separator = ';';
    } else if (tabCount === 0 && commaCount > semicolonCount) {
      separator = ',';
    }

    return line.split(separator).map(function (cell) {
      return String(cell || '').trim();
    });
  }

  function importHeaderKey(value) {
    var normalized = normalizeText(value).replace(/[^a-z0-9]/g, '');

    if (normalized === 'nome' || normalized === 'nomecompleto' || normalized === 'associado') {
      return 'nome';
    }

    if (normalized === 'cpf') {
      return 'cpf';
    }

    if (normalized === 'matricula' || normalized === 'matriculafuncional') {
      return 'matricula';
    }

    if (normalized === 'datadeadmissao' || normalized === 'dataadmissao' || normalized === 'admissao') {
      return 'dataAdmissao';
    }

    return '';
  }

  function parseAdmissionImport(rawText) {
    var lines = String(rawText || '')
      .split(/\r?\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean);

    if (!lines.length) {
      return [];
    }

    var firstColumns = splitImportLine(lines[0]);
    var headerKeys = firstColumns.map(importHeaderKey);
    var hasHeader = headerKeys.indexOf('dataAdmissao') >= 0 &&
      (headerKeys.indexOf('cpf') >= 0 || headerKeys.indexOf('matricula') >= 0 || headerKeys.indexOf('nome') >= 0);

    var indexes = hasHeader ? {
      nome: -1,
      cpf: -1,
      matricula: -1,
      dataAdmissao: -1
    } : {
      nome: 0,
      cpf: 1,
      matricula: 2,
      dataAdmissao: 3
    };

    if (hasHeader) {
      headerKeys.forEach(function (key, index) {
        if (key) {
          indexes[key] = index;
        }
      });
      lines = lines.slice(1);
    }

    function columnValue(columns, index) {
      return index >= 0 ? columns[index] || '' : '';
    }

    return lines.map(function (line) {
      var columns = splitImportLine(line);

      return {
        nome: columnValue(columns, indexes.nome),
        cpf: columnValue(columns, indexes.cpf),
        matricula: columnValue(columns, indexes.matricula),
        dataAdmissao: columnValue(columns, indexes.dataAdmissao)
      };
    }).filter(function (row) {
      return row.nome || row.cpf || row.matricula || row.dataAdmissao;
    });
  }

  function renderAdmissionImportResult(result) {
    if (!result) {
      byId('admissionImportResult').classList.add('hidden');
      html('admissionImportResult', '');
      return;
    }

    var details = [];

    if (result.notFound && result.notFound.length) {
      details.push('<strong>Não encontrados:</strong> ' + escapeHtml(result.notFound.slice(0, 8).join(', ')));
    }

    if (result.ambiguous && result.ambiguous.length) {
      details.push('<strong>Duplicados/ambíguos:</strong> ' + escapeHtml(result.ambiguous.slice(0, 8).join(', ')));
    }

    if (result.invalidDates && result.invalidDates.length) {
      details.push('<strong>Datas inválidas:</strong> ' + escapeHtml(result.invalidDates.slice(0, 8).join(', ')));
    }

    byId('admissionImportResult').classList.remove('hidden');
    html('admissionImportResult',
      '<div class="import-result-grid">' +
        '<span><strong>' + escapeHtml(result.total || 0) + '</strong> linha(s) lida(s)</span>' +
        '<span><strong>' + escapeHtml(result.updated || 0) + '</strong> atualizada(s)</span>' +
        '<span><strong>' + escapeHtml(result.skipped || 0) + '</strong> não atualizada(s)</span>' +
      '</div>' +
      (details.length ? '<div class="import-result-details">' + details.map(function (item) {
        return '<p>' + item + '</p>';
      }).join('') + '</div>' : '')
    );
  }

  function clearAdmissionImport() {
    setValue('admissionImportText', '');
    setMessage('admissionImportMessage', '');
    renderAdmissionImportResult(null);
  }

  async function importAdmissionDates(event) {
    event.preventDefault();
    clearMessages();

    var rows = parseAdmissionImport(value('admissionImportText'));

    if (!rows.length) {
      setMessage('admissionImportMessage', 'Cole os dados da planilha antes de importar.', 'error');
      return;
    }

    if (!window.confirm('Importar data de admissão para ' + rows.length + ' linha(s)?')) {
      return;
    }

    setMessage('admissionImportMessage', 'Importando datas de admissão...', 'success');

    try {
      var response = await api.postApi('member_admission_import', {
        rows: rows
      });

      renderAdmissionImportResult(response.result);
      setMessage('admissionImportMessage', 'Importação concluída.', 'success');
      await loadBootstrap();

      if (byId('tab-relatorios').classList.contains('active')) {
        await loadReport();
      }
    } catch (error) {
      setMessage('admissionImportMessage', error.message || 'Falha ao importar datas de admissão.', 'error');
    }
  }


  function memberCsvRows(members) {
    var rows = [[
      'Nome',
      'Data de admissão',
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
        formatDate(member.dataAdmissao),
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

  function exportReportExcel() {
    var members = state.report && state.report.members ? state.report.members : [];

    if (!members.length) {
      setMessage('reportMessage', 'Busque um relatório antes de exportar.', 'error');
      return;
    }

    downloadExcel('relatorio_associados_' + fileStamp() + '.xls', memberCsvRows(members));
    setMessage('reportMessage', 'Relatório exportado em Excel.', 'success');
  }

  function exportReportCsv() {
    exportReportExcel();
  }

  function filteredReportMembers() {
    var members = state.report && state.report.members ? state.report.members.slice() : [];

    if (!state.reportActiveFuncao) {
      return members;
    }

    return members.filter(function (member) {
      return normalizeText(member.funcao || 'Não informado') === normalizeText(state.reportActiveFuncao);
    });
  }

  function reportStatusTotals(members) {
    return (members || []).reduce(function (acc, member) {
      var status = normalizeText(member && member.status ? member.status : '');

      if (status === 'ativo') {
        acc.ativos += 1;
      } else if (status === 'inativo') {
        acc.inativos += 1;
      }

      return acc;
    }, { ativos: 0, inativos: 0 });
  }

  function reportFilterSummaryItems() {
    var items = [];
    var nome = value('reportNome');
    var cpf = formatCpf(value('reportCpf'));
    var localTrabalho = value('reportLocalTrabalho');
    var setor = value('reportSetor');
    var funcao = state.reportActiveFuncao || value('reportFuncao');
    var status = value('reportStatus');
    var dataInicial = value('reportDataInicial');
    var dataFinal = value('reportDataFinal');

    if (nome) items.push(['Nome', nome]);
    if (cpf && cpf !== '-') items.push(['CPF', cpf]);
    if (localTrabalho) items.push(['Onde trabalha', localTrabalho]);
    if (setor) items.push(['Setor', setor]);
    if (funcao) items.push(['Função', funcao]);
    if (status) items.push(['Status', status === 'ATIVO' ? 'Ativo' : status === 'INATIVO' ? 'Inativo' : status]);
    if (dataInicial || dataFinal) {
      items.push(['Admissão', (dataInicial ? formatDate(dataInicial) : '...') + ' até ' + (dataFinal ? formatDate(dataFinal) : '...')]);
    }

    return items;
  }

  function buildReportPrintHtml(members) {
    var generatedAt = formatDateTime(new Date().toISOString());
    var imageUrl = new URL('./assets/sede-sinsermap.jpg', window.location.href).href;
    var statusTotals = reportStatusTotals(members);
    var uniqueFuncoes = {};
    var filterItems = reportFilterSummaryItems();

    members.forEach(function (member) {
      var key = normalizeText(member.funcao || 'Não informado');
      if (!uniqueFuncoes[key]) {
        uniqueFuncoes[key] = member.funcao || 'Não informado';
      }
    });

    var summaryCards = [
      ['Total listado', members.length],
      ['Ativos', statusTotals.ativos],
      ['Inativos', statusTotals.inativos],
      ['Funções', Object.keys(uniqueFuncoes).length]
    ].map(function (item) {
      return '<div class="summary-card"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('');

    var filtersHtml = filterItems.length ?
      '<section class="filter-box"><h3>Filtros aplicados</h3><div class="filter-grid">' +
      filterItems.map(function (item) {
        return '<div class="filter-item"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
      }).join('') +
      '</div></section>' : '';

    var rowsHtml = members.map(function (member) {
      return '<tr>' +
        '<td class="name-col">' + escapeHtml(member.nome || '-') + '</td>' +
        '<td class="date-col">' + escapeHtml(formatDate(member.dataAdmissao)) + '</td>' +
        '<td class="phone-col">' + escapeHtml(formatPhone(member.telefone)) + '</td>' +
        '<td class="work-col">' + escapeHtml(member.localTrabalho || '-') + '</td>' +
        '<td class="setor-col">' + escapeHtml(member.setor || '-') + '</td>' +
        '<td class="funcao-col">' + escapeHtml(member.funcao || '-') + '</td>' +
        '<td class="status-col"><span class="status-badge ' + escapeHtml(normalizeText(member.status || '')) + '">' + escapeHtml(member.status || '-') + '</span></td>' +
      '</tr>';
    }).join('');

    return '<!DOCTYPE html>' +
      '<html lang="pt-BR">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<title>Relatório de Associados - SINSERMAP</title>' +
      '<style>' +
      '@page { size: A4 landscape; margin: 14mm 10mm 16mm; }' +
      ':root { color-scheme: light; --green:#2f6f46; --green-dark:#245639; --green-soft:#edf5ef; --gold:#c8a23a; --text:#20313a; --muted:#5f6f79; --border:#d7dfe3; }' +
      '* { box-sizing:border-box; }' +
      'html,body { margin:0; padding:0; color:var(--text); font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; background:#fff; }' +
      'body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }' +
      '.page { width:100%; }' +
      '.report-header { display:grid; grid-template-columns: 170px 1fr; gap:14px; align-items:stretch; padding:0 0 12px; border-bottom:2px solid var(--green); }' +
      '.header-figure img { display:block; width:100%; height:110px; object-fit:cover; border-radius:10px; border:1px solid #d8dfdb; }' +
      '.header-copy { display:flex; flex-direction:column; justify-content:center; }' +
      '.kicker { color:var(--green); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px; }' +
      '.header-copy h1 { margin:0; color:var(--green-dark); font-size:28px; line-height:1.1; }' +
      '.header-copy h2 { margin:2px 0 8px; color:#2b3941; font-size:15px; font-weight:600; }' +
      '.header-copy p { margin:0; color:var(--muted); line-height:1.45; }' +
      '.header-meta { margin-top:10px; display:flex; gap:14px; flex-wrap:wrap; color:#4c5d66; font-size:11px; }' +
      '.summary-grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:10px; margin:12px 0; }' +
      '.summary-card { padding:10px 12px; border:1px solid var(--border); border-left:4px solid var(--green); border-radius:8px; background:#fff; }' +
      '.summary-card span { display:block; color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.03em; }' +
      '.summary-card strong { display:block; margin-top:4px; color:var(--text); font-size:22px; line-height:1.05; }' +
      '.filter-box { margin:0 0 12px; padding:10px 12px; background:var(--green-soft); border:1px solid #dbe7dd; border-radius:8px; }' +
      '.filter-box h3 { margin:0 0 8px; color:var(--green-dark); font-size:13px; }' +
      '.filter-grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:8px 12px; }' +
      '.filter-item { display:grid; gap:2px; }' +
      '.filter-item span { color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.03em; }' +
      '.filter-item strong { color:var(--text); font-size:12px; }' +
      'table { width:100%; border-collapse:collapse; table-layout:fixed; }' +
      'thead th { padding:8px 8px; text-align:left; color:#fff; background:var(--green); border:1px solid var(--green-dark); font-size:11px; }' +
      'tbody td { padding:7px 8px; border:1px solid var(--border); vertical-align:top; color:#25353d; word-break:break-word; white-space:normal; }' +
      'tbody tr:nth-child(even) td { background:#fafcfa; }' +
      '.name-col { width:22%; font-weight:600; } .date-col { width:10%; } .phone-col { width:11%; } .work-col { width:16%; } .setor-col { width:13%; } .funcao-col { width:20%; } .status-col { width:8%; }' +
      '.status-badge { display:inline-block; min-width:68px; padding:4px 8px; border-radius:999px; text-align:center; font-size:10px; font-weight:700; white-space:nowrap; }' +
      '.status-badge.ativo { background:#e9f5ed; color:#215537; border:1px solid #cde2d4; }' +
      '.status-badge.inativo { background:#f7eded; color:#8f3932; border:1px solid #e4c5c2; }' +
      '.report-footer { position:fixed; left:0; right:0; bottom:0; padding:6px 10mm 0; border-top:1px solid #d8e0dc; color:#5b6a72; font-size:10px; background:#fff; }' +
      '.report-footer-inner { display:flex; justify-content:space-between; gap:12px; }' +
      '.empty-note { padding:18px; border:1px dashed #cfd7db; border-radius:8px; color:#5e6d75; text-align:center; }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div class="page">' +
      '<header class="report-header">' +
      '<div class="header-figure"><img src="' + escapeHtml(imageUrl) + '" alt="Sede do SINSERMAP" /></div>' +
      '<div class="header-copy">' +
      '<span class="kicker">SINSERMAP</span>' +
      '<h1>Sindicato dos Servidores Públicos Municipais de Além Paraíba</h1>' +
      '<h2>Relatório de associados</h2>' +
      '<p>Documento gerado pelo sistema interno para consulta, conferência e apoio administrativo.</p>' +
      '<div class="header-meta">' +
      '<span><strong>Gerado em:</strong> ' + escapeHtml(generatedAt) + '</span>' +
      '<span><strong>Usuário:</strong> ' + escapeHtml(state.user && (state.user.nome || state.user.username) || 'Sistema') + '</span>' +
      '</div>' +
      '</div>' +
      '</header>' +
      '<section class="summary-grid">' + summaryCards + '</section>' +
      filtersHtml +
      (members.length ? '<table><thead><tr><th class="name-col">Nome</th><th class="date-col">Admissão</th><th class="phone-col">Telefone</th><th class="work-col">Onde trabalha</th><th class="setor-col">Setor</th><th class="funcao-col">Função</th><th class="status-col">Status</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>' : '<div class="empty-note">Nenhum associado encontrado para os filtros informados.</div>') +
      '</div>' +
      '<footer class="report-footer"><div class="report-footer-inner"><span>SINSERMAP • Cadastro de Associados</span><span>Relatório gerado em ' + escapeHtml(generatedAt) + '</span></div></footer>' +
      '</body></html>';
  }

  function findReportMemberById(id) {
    var members = state.report && state.report.members ? state.report.members : [];
    return members.find(function (member) {
      return member.id === id;
    });
  }

  function memberProfileField(label, value, className) {
    return '<div class="profile-field ' + escapeHtml(className || '') + '"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value || '-') + '</strong></div>';
  }

  function buildMemberProfileHtml(member) {
    var generatedAt = formatDateTime(new Date().toISOString());
    var imageUrl = new URL('./assets/sede-sinsermap.jpg', window.location.href).href;
    var address = [
      member.endereco,
      member.bairro,
      member.cidade,
      member.uf,
      formatCep ? formatCep(member.cep) : member.cep
    ].filter(Boolean).join(' - ');

    return '<!DOCTYPE html>' +
      '<html lang="pt-BR">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<title>Ficha do Associado - ' + escapeHtml(member.nome || 'Associado') + '</title>' +
      '<style>' +
      '@page { size: A4 portrait; margin: 14mm; }' +
      ':root { --green:#2f6f46; --green-dark:#214d33; --green-soft:#edf5ef; --text:#1f2d35; --muted:#5e6c74; --border:#d8e0dc; }' +
      '* { box-sizing:border-box; }' +
      'html,body { margin:0; padding:0; color:var(--text); font-family:Segoe UI, Tahoma, Arial, sans-serif; background:#fff; }' +
      'body { -webkit-print-color-adjust:exact; print-color-adjust:exact; font-size:13px; }' +
      '.page { display:grid; gap:14px; }' +
      '.header { display:grid; grid-template-columns: 138px 1fr; gap:14px; align-items:center; padding-bottom:12px; border-bottom:3px solid var(--green); }' +
      '.header img { width:138px; height:94px; object-fit:cover; border-radius:10px; border:1px solid var(--border); }' +
      '.kicker { color:var(--green); font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }' +
      'h1 { margin:4px 0 2px; color:var(--green-dark); font-size:26px; line-height:1.1; }' +
      '.subtitle { margin:0; color:var(--muted); line-height:1.45; }' +
      '.hero { padding:14px 16px; border:1px solid #cddbd2; border-radius:10px; background:var(--green-soft); }' +
      '.hero h2 { margin:0; color:#15291d; font-size:28px; line-height:1.15; }' +
      '.hero-meta { display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:8px; color:#405047; }' +
      '.hero-meta span { font-size:12px; }' +
      '.section { border:1px solid var(--border); border-radius:10px; overflow:hidden; }' +
      '.section h3 { margin:0; padding:9px 12px; color:#fff; background:var(--green); font-size:13px; text-transform:uppercase; letter-spacing:.04em; }' +
      '.grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:0; }' +
      '.profile-field { min-height:56px; padding:10px 12px; border-top:1px solid var(--border); }' +
      '.profile-field:nth-child(odd) { border-right:1px solid var(--border); }' +
      '.profile-field span { display:block; color:var(--muted); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.04em; }' +
      '.profile-field strong { display:block; margin-top:4px; color:var(--text); font-size:14px; line-height:1.3; white-space:pre-wrap; }' +
      '.wide { grid-column:1 / -1; border-right:0 !important; }' +
      '.status { display:inline-block; min-width:76px; padding:5px 10px; border-radius:999px; text-align:center; font-size:11px; font-weight:800; }' +
      '.status.ativo { background:#e7f4ec; color:#215537; border:1px solid #c7ddcf; }' +
      '.status.inativo { background:#f7eeee; color:#8d3831; border:1px solid #e2c5c2; }' +
      '.footer { margin-top:4px; padding-top:8px; border-top:1px solid var(--border); color:var(--muted); font-size:10px; display:flex; justify-content:space-between; gap:12px; }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<main class="page">' +
      '<header class="header">' +
      '<img src="' + escapeHtml(imageUrl) + '" alt="Sede do SINSERMAP" />' +
      '<div><span class="kicker">SINSERMAP</span><h1>Ficha do associado</h1><p class="subtitle">Cadastro individual gerado pelo sistema interno para conferência e atendimento.</p></div>' +
      '</header>' +
      '<section class="hero">' +
      '<h2>' + escapeHtml(member.nome || '-') + '</h2>' +
      '<div class="hero-meta">' +
      '<span><strong>Função:</strong> ' + escapeHtml(member.funcao || '-') + '</span>' +
      '<span><strong>Matrícula:</strong> ' + escapeHtml(member.matricula || '-') + '</span>' +
      '<span><strong>Status:</strong> <span class="status ' + escapeHtml(normalizeText(member.status || '')) + '">' + escapeHtml(member.status || '-') + '</span></span>' +
      '</div>' +
      '</section>' +
      '<section class="section"><h3>Dados principais</h3><div class="grid">' +
      memberProfileField('Nome completo', member.nome) +
      memberProfileField('CPF', formatCpf(member.cpf)) +
      memberProfileField('RG', member.rg) +
      memberProfileField('Data de nascimento', formatDate(member.dataNascimento)) +
      memberProfileField('Telefone', formatPhone(member.telefone)) +
      memberProfileField('E-mail', member.email) +
      '</div></section>' +
      '<section class="section"><h3>Dados funcionais</h3><div class="grid">' +
      memberProfileField('Função / cargo', member.funcao) +
      memberProfileField('Matrícula', member.matricula) +
      memberProfileField('Data de admissão', formatDate(member.dataAdmissao)) +
      memberProfileField('Data de associação', formatDate(member.dataAssociacao)) +
      memberProfileField('Onde trabalha', member.localTrabalho) +
      memberProfileField('Setor', member.setor) +
      '</div></section>' +
      '<section class="section"><h3>Endereço e observações</h3><div class="grid">' +
      memberProfileField('Endereço', address || '-', 'wide') +
      memberProfileField('CEP', formatCep ? formatCep(member.cep) : member.cep) +
      memberProfileField('Observações', member.observacoes || '-', 'wide') +
      '</div></section>' +
      '<footer class="footer"><span>SINSERMAP • Cadastro de Associados</span><span>Ficha gerada em ' + escapeHtml(generatedAt) + '</span></footer>' +
      '</main>' +
      '</body></html>';
  }

  function printMemberProfile(id) {
    var member = findReportMemberById(id);
    var printWindow;

    if (!member) {
      setMessage('reportMessage', 'Associado não encontrado na consulta atual.', 'error');
      return;
    }

    printWindow = window.open('', '_blank', 'width=900,height=1000');

    if (!printWindow) {
      setMessage('reportMessage', 'Não foi possível abrir a ficha. Verifique se o navegador bloqueou pop-ups.', 'error');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildMemberProfileHtml(member));
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      setTimeout(function () {
        printWindow.print();
      }, 250);
    };
  }

  async function downloadFullBackup() {
    setMessage('reportMessage', 'Gerando backup completo...', 'success');

    try {
      var response = await api.getApi('backup_full');
      downloadJson('backup_sinsermap_' + fileStamp() + '.json', response.backup);
      setMessage('reportMessage', 'Backup completo gerado com sucesso.', 'success');
    } catch (error) {
      setMessage('reportMessage', error.message || 'Falha ao gerar backup.', 'error');
    }
  }

  function printReport() {
    if (!state.report) {
      setMessage('reportMessage', 'Gere o relatório antes de imprimir.', 'error');
      return;
    }

    var members = filteredReportMembers();
    var printWindow = window.open('', '_blank', 'width=1200,height=900');

    if (!printWindow) {
      setMessage('reportMessage', 'Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou pop-ups.', 'error');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildReportPrintHtml(members));
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      setTimeout(function () {
        printWindow.print();
      }, 250);
    };
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

    if (byId('admissionImportForm')) {
      byId('admissionImportForm').addEventListener('submit', importAdmissionDates);
    }

    if (byId('clearAdmissionImportBtn')) {
      byId('clearAdmissionImportBtn').addEventListener('click', clearAdmissionImport);
    }

    byId('newMemberBtn').addEventListener('click', resetMemberForm);
    byId('clearMemberBtn').addEventListener('click', resetMemberForm);
    byId('clearUserBtn').addEventListener('click', resetUserForm);
    if (byId('searchMembersBtn')) {
      byId('searchMembersBtn').addEventListener('click', searchMembers);
    }
    if (byId('quickSearchForm')) {
      byId('quickSearchForm').addEventListener('submit', quickSearch);
    }
    byId('loadReportBtn').addEventListener('click', loadReport);
    if (byId('clearReportFiltersBtn')) {
      byId('clearReportFiltersBtn').addEventListener('click', clearReportFilters);
    }
    byId('printReportBtn').addEventListener('click', printReport);

    if (byId('reportPrevPageBtn')) {
      byId('reportPrevPageBtn').addEventListener('click', function () {
        changeReportPage(-1);
      });
    }

    if (byId('reportNextPageBtn')) {
      byId('reportNextPageBtn').addEventListener('click', function () {
        changeReportPage(1);
      });
    }

    if (byId('reportPageSize')) {
      byId('reportPageSize').addEventListener('change', changeReportPageSize);
    }

    if (byId('clearFunctionFilterBtn')) {
      byId('clearFunctionFilterBtn').addEventListener('click', clearFunctionFilter);
    }

    if (byId('exportConsultCsvBtn')) {
      byId('exportConsultCsvBtn').addEventListener('click', exportConsultCsv);
    }

    if (byId('exportReportExcelBtn')) {
      byId('exportReportExcelBtn').addEventListener('click', exportReportExcel);
    } else if (byId('exportReportCsvBtn')) {
      byId('exportReportCsvBtn').addEventListener('click', exportReportCsv);
    }

    if (byId('backupFullBtn')) {
      byId('backupFullBtn').addEventListener('click', downloadFullBackup);
    }

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

    document.addEventListener('dblclick', function (event) {
      var printMemberTarget = event.target.closest('[data-print-member]');

      if (printMemberTarget) {
        printMemberProfile(printMemberTarget.getAttribute('data-print-member'));
      }
    });

    document.addEventListener('click', function (event) {
      var editButton = event.target.closest('[data-edit-member]');
      if (editButton) {
        editMember(editButton.getAttribute('data-edit-member'));
        return;
      }

      var deleteMemberButton = event.target.closest('[data-delete-member]');
      if (deleteMemberButton) {
        deleteMember(
          deleteMemberButton.getAttribute('data-delete-member'),
          deleteMemberButton.getAttribute('data-member-name')
        );
        return;
      }

      var reportFunctionRow = event.target.closest('[data-report-funcao]');
      if (reportFunctionRow) {
        document.querySelectorAll('[data-report-funcao]').forEach(function (row) {
          row.classList.remove('is-selected');
        });
        reportFunctionRow.classList.add('is-selected');
        state.reportPage = 1;
        renderReportMembers(state.report && state.report.members ? state.report.members : [], reportFunctionRow.getAttribute('data-report-funcao'));
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
      if (!byId(id)) {
        return;
      }

      byId(id).addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          searchMembers();
        }
      });
    });
  }

  function startPhraseRotator() {
    var messages = [
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
    var start = new Date(new Date().getFullYear(), 0, 0);
    var day = Math.floor((new Date() - start) / 86400000);
    var message = messages[day % messages.length];

    text('dailyHomeTitle', message.title);
    text('dailyHomeMessage', message.text);
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    startPhraseRotator();
    restoreSession();
  });
}());
