(function () {
  'use strict';

  var api = window.SIND_API;
  var runtime = api.getRuntime();
  var state = {
    bootstrap: null,
    members: [],
    dues: [],
    report: null,
    documents: [],
    auditLogs: [],
    users: [],
    selectedDueId: '',
    currentTab: 'cadastro'
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function qsa(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function digits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentMonth() {
    return today().slice(0, 7);
  }

  function currentYear() {
    return String(new Date().getFullYear());
  }

  function defaultDueDate(monthValue) {
    if (!/^\d{4}-\d{2}$/.test(String(monthValue || ''))) return today();
    return monthValue + '-10';
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value || 0));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    var parts = String(dateStr).split('-');
    if (parts.length !== 3) return dateStr;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function formatDateTime(value) {
    if (!value) return '-';
    var d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR');
  }

  function formatMonth(value) {
    if (!value || !/^\d{4}-\d{2}$/.test(value)) return value || '-';
    return value.slice(5, 7) + '/' + value.slice(0, 4);
  }

  function formatDocType(value) {
    var labels = {
      RECIBO_MENSALIDADE: 'Recibo',
      DECLARACAO_FILIACAO: 'Declaração',
      FICHA_CADASTRAL: 'Ficha cadastral',
      DECLARACAO_QUITACAO_ANUAL: 'Quitação anual'
    };
    return labels[value] || value || '-';
  }

  function setMessage(id, text, type) {
    var el = byId(id);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'message' + (type ? ' ' + type : '');
  }

  function setGlobalMessage(text, type) {
    setMessage('globalMessage', text, type);
  }

  function clearMessages() {
    [
      'loginMessage',
      'memberMessage',
      'batchMessage',
      'paymentMessage',
      'documentIssueMessage',
      'changePasswordMessage',
      'userMessage',
      'globalMessage'
    ].forEach(function (id) {
      setMessage(id, '', '');
    });
  }

  function parseCurrencyInput(value) {
    var normalized = String(value || '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    var numberValue = Number(normalized);
    return isNaN(numberValue) ? 0 : numberValue;
  }

  function maskCpf(value) {
    var v = digits(value).slice(0, 11);
    return v
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  function maskPhone(value) {
    var v = digits(value).slice(0, 11);
    if (v.length <= 10) {
      return v
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function maskCep(value) {
    var v = digits(value).slice(0, 8);
    return v.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  function validateCpf(value) {
    var cpf = digits(value);
    var sum = 0;
    var remainder;
    var i;

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    for (i = 1; i <= 9; i += 1) {
      sum += Number(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cpf.substring(9, 10))) return false;

    sum = 0;
    for (i = 1; i <= 10; i += 1) {
      sum += Number(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === Number(cpf.substring(10, 11));
  }

  function buildBadge(value) {
    return '<span class="badge ' + escapeHtml(value || '') + '">' + escapeHtml(value || '-') + '</span>';
  }

  function hasPermission(permission) {
    var permissions = (state.bootstrap && state.bootstrap.permissions) || [];
    return permissions.indexOf(permission) >= 0;
  }

  function firstAllowedTab() {
    var buttons = qsa('.tab-btn').filter(function (button) {
      return !button.classList.contains('hidden');
    });
    return buttons.length ? buttons[0].getAttribute('data-tab') : 'cadastro';
  }

  function showTab(tabName) {
    state.currentTab = tabName;
    qsa('.tab-btn').forEach(function (button) {
      var current = button.getAttribute('data-tab') === tabName;
      button.classList.toggle('active', current);
    });

    qsa('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
  }

  function applyPermissions() {
    qsa('[data-permission]').forEach(function (node) {
      var permission = node.getAttribute('data-permission');
      var visible = !permission || hasPermission(permission);
      node.classList.toggle('hidden', !visible);
    });

    if (!hasPermission('audit.read')) {
      byId('tab-auditoria').classList.add('hidden');
    } else {
      byId('tab-auditoria').classList.remove('hidden');
    }

    if (!hasPermission('users.manage')) {
      byId('tab-usuarios').classList.add('hidden');
    } else {
      byId('tab-usuarios').classList.remove('hidden');
    }

    if (!hasPermission('documents.read') && state.currentTab === 'documentos') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('members.read') && state.currentTab === 'cadastro') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('dues.read') && state.currentTab === 'mensalidades') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('reports.read') && state.currentTab === 'relatorios') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('users.manage') && state.currentTab === 'usuarios') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('audit.read') && state.currentTab === 'auditoria') {
      showTab(firstAllowedTab());
    }
  }

  function applyInputMasks() {
    byId('memberCpf').addEventListener('input', function (event) {
      event.target.value = maskCpf(event.target.value);
    });

    byId('memberTelefone').addEventListener('input', function (event) {
      event.target.value = maskPhone(event.target.value);
    });

    byId('memberCep').addEventListener('input', function (event) {
      event.target.value = maskCep(event.target.value);
    });

    byId('batchValor').addEventListener('blur', function (event) {
      var value = parseCurrencyInput(event.target.value);
      event.target.value = value ? value.toFixed(2).replace('.', ',') : '';
    });
  }

  function updateDocumentTypeVisibility() {
    var annual = byId('documentType').value === 'DECLARACAO_QUITACAO_ANUAL';
    byId('documentYearWrap').classList.toggle('hidden', !annual);
  }

  function memberFormPayload() {
    return {
      id: byId('memberId').value.trim(),
      nome: byId('memberNome').value.trim(),
      cpf: digits(byId('memberCpf').value),
      rg: byId('memberRg').value.trim(),
      dataNascimento: byId('memberNascimento').value,
      email: byId('memberEmail').value.trim(),
      telefone: digits(byId('memberTelefone').value),
      endereco: byId('memberEndereco').value.trim(),
      bairro: byId('memberBairro').value.trim(),
      cidade: byId('memberCidade').value.trim(),
      uf: byId('memberUf').value.trim().toUpperCase(),
      cep: digits(byId('memberCep').value),
      empresa: byId('memberEmpresa').value.trim(),
      cargo: byId('memberCargo').value.trim(),
      dataAdmissao: byId('memberAdmissao').value,
      dataFiliacao: byId('memberFiliacao').value,
      status: byId('memberStatus').value,
      observacoes: byId('memberObservacoes').value.trim()
    };
  }

  function resetMemberForm() {
    byId('memberId').value = '';
    byId('memberNome').value = '';
    byId('memberCpf').value = '';
    byId('memberRg').value = '';
    byId('memberNascimento').value = '';
    byId('memberEmail').value = '';
    byId('memberTelefone').value = '';
    byId('memberEndereco').value = '';
    byId('memberBairro').value = '';
    byId('memberCidade').value = 'Além Paraíba';
    byId('memberUf').value = 'MG';
    byId('memberCep').value = '';
    byId('memberEmpresa').value = '';
    byId('memberCargo').value = '';
    byId('memberAdmissao').value = '';
    byId('memberFiliacao').value = today();
    byId('memberStatus').value = 'ATIVO';
    byId('memberObservacoes').value = '';
    byId('memberFormTitle').textContent = 'Novo sindicalizado';
    byId('cancelMemberEditBtn').classList.add('hidden');
  }

  function fillMemberForm(member) {
    byId('memberId').value = member.id || '';
    byId('memberNome').value = member.nome || '';
    byId('memberCpf').value = maskCpf(member.cpf || '');
    byId('memberRg').value = member.rg || '';
    byId('memberNascimento').value = member.dataNascimento || '';
    byId('memberEmail').value = member.email || '';
    byId('memberTelefone').value = maskPhone(member.telefone || '');
    byId('memberEndereco').value = member.endereco || '';
    byId('memberBairro').value = member.bairro || '';
    byId('memberCidade').value = member.cidade || 'Além Paraíba';
    byId('memberUf').value = member.uf || 'MG';
    byId('memberCep').value = maskCep(member.cep || '');
    byId('memberEmpresa').value = member.empresa || '';
    byId('memberCargo').value = member.cargo || '';
    byId('memberAdmissao').value = member.dataAdmissao || '';
    byId('memberFiliacao').value = member.dataFiliacao || '';
    byId('memberStatus').value = member.status || 'ATIVO';
    byId('memberObservacoes').value = member.observacoes || '';
    byId('memberFormTitle').textContent = 'Editar sindicalizado';
    byId('cancelMemberEditBtn').classList.remove('hidden');
    showTab('cadastro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function userFormPayload() {
    return {
      id: byId('userId').value.trim(),
      nome: byId('userNome').value.trim(),
      username: byId('userUsername').value.trim(),
      password: byId('userPassword').value,
      role: byId('userRole').value,
      status: byId('userStatus').value
    };
  }

  function resetUserForm() {
    byId('userId').value = '';
    byId('userNome').value = '';
    byId('userUsername').value = '';
    byId('userPassword').value = '';
    byId('userRole').value = 'CONSULTA';
    byId('userStatus').value = 'ATIVO';
    byId('userFormTitle').textContent = 'Novo usuário';
    byId('cancelUserEditBtn').classList.add('hidden');
  }

  function fillUserForm(user) {
    byId('userId').value = user.id || '';
    byId('userNome').value = user.nome || '';
    byId('userUsername').value = user.username || '';
    byId('userPassword').value = '';
    byId('userRole').value = user.role || 'CONSULTA';
    byId('userStatus').value = user.status || 'ATIVO';
    byId('userFormTitle').textContent = 'Editar usuário';
    byId('cancelUserEditBtn').classList.remove('hidden');
    showTab('usuarios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function downloadBase64File(fileName, mimeType, base64Content) {
    var binary = atob(base64Content);
    var len = binary.length;
    var bytes = new Uint8Array(len);
    var i;

    for (i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    var blob = new Blob([bytes], { type: mimeType || 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'arquivo';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
  }

  function selectDue(due) {
    state.selectedDueId = due.id;
    byId('paymentTarget').value = due.memberNome + ' - ' + formatMonth(due.competencia) + ' - ' + formatCurrency(due.valor);
    byId('paymentNotes').value = due.observacoes || '';
    byId('paymentDate').value = today();
    byId('paymentMethod').value = due.formaPagamento || 'PIX';
  }

  function clearSelectedDue() {
    state.selectedDueId = '';
    byId('paymentTarget').value = '';
    byId('paymentNotes').value = '';
    byId('paymentDate').value = today();
    byId('paymentMethod').value = 'PIX';
  }

  function filteredMembers() {
    var search = byId('memberSearch').value.trim().toLowerCase();
    var status = byId('memberStatusFilter').value;

    return state.members.filter(function (member) {
      if (status && member.status !== status) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [
        member.nome,
        member.cpf,
        member.empresa,
        member.telefone,
        member.status
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  function filteredDocuments() {
    var search = byId('documentsSearch').value.trim().toLowerCase();
    var type = byId('documentsTypeFilter').value;
    var year = byId('documentsYearFilter').value.trim();

    return state.documents.filter(function (doc) {
      if (type && doc.tipo !== type) {
        return false;
      }

      if (year) {
        var baseYear = String(doc.competencia || '').slice(0, 4) || String(doc.createdAt || '').slice(0, 4);
        if (baseYear !== year) {
          return false;
        }
      }

      if (!search) return true;

      return [
        doc.numero,
        doc.tipo,
        doc.memberNome,
        doc.competencia,
        doc.descricao
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  function filteredUsers() {
    return state.users || [];
  }

  function renderMemberOptions() {
    var select = byId('documentMemberId');
    var activeMembers = state.members.filter(function (member) {
      return member.status !== 'INATIVO';
    });

    if (!activeMembers.length) {
      select.innerHTML = '<option value="">Nenhum sindicalizado disponível</option>';
      return;
    }

    select.innerHTML = activeMembers.map(function (member) {
      return '<option value="' + escapeHtml(member.id) + '">' +
        escapeHtml(member.nome + ' - ' + maskCpf(member.cpf || '')) +
        '</option>';
    }).join('');
  }

  function renderMembers() {
    var tbody = byId('membersTableBody');
    var items = filteredMembers();

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum sindicalizado encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (member) {
      var actions = [];

      if (hasPermission('members.write')) {
        actions.push('<button class="btn btn-secondary js-edit-member" data-id="' + escapeHtml(member.id) + '" type="button">Editar</button>');
      }

      if (hasPermission('members.inactivate') && member.status !== 'INATIVO') {
        actions.push('<button class="btn btn-secondary js-inactivate-member" data-id="' + escapeHtml(member.id) + '" type="button">Inativar</button>');
      }

      if (hasPermission('documents.issue')) {
        actions.push('<button class="btn btn-secondary js-declaration-member" data-id="' + escapeHtml(member.id) + '" type="button">Declaração PDF</button>');
        actions.push('<button class="btn btn-secondary js-profile-member" data-id="' + escapeHtml(member.id) + '" type="button">Ficha PDF</button>');
      }

      return [
        '<tr>',
        '<td><strong>' + escapeHtml(member.nome) + '</strong><div class="muted small">' + escapeHtml(member.email || 'Sem e-mail') + '</div></td>',
        '<td>' + escapeHtml(maskCpf(member.cpf)) + '</td>',
        '<td>' + escapeHtml(member.empresa || '-') + '</td>',
        '<td>' + escapeHtml(maskPhone(member.telefone || '')) + '</td>',
        '<td>' + buildBadge(member.status) + '</td>',
        '<td><div class="actions">' + actions.join('') + '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderDues() {
    var tbody = byId('duesTableBody');

    if (!state.dues.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="muted">Nenhuma mensalidade encontrada.</td></tr>';
      return;
    }

    tbody.innerHTML = state.dues.map(function (due) {
      var actions = [];

      if (hasPermission('dues.pay') && due.status !== 'PAGA') {
        actions.push('<button class="btn btn-secondary js-pay-due" data-id="' + escapeHtml(due.id) + '" type="button">Selecionar</button>');
      }

      if (hasPermission('documents.issue') && due.status === 'PAGA') {
        actions.push('<button class="btn btn-secondary js-receipt-due" data-id="' + escapeHtml(due.id) + '" type="button">Recibo PDF</button>');
      }

      return [
        '<tr>',
        '<td><strong>' + escapeHtml(due.memberNome) + '</strong><div class="muted small">' + escapeHtml(maskCpf(due.memberCpf || '')) + '</div></td>',
        '<td>' + escapeHtml(formatMonth(due.competencia)) + '</td>',
        '<td>' + escapeHtml(formatCurrency(due.valor)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.vencimento)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.pagoEm)) + '</td>',
        '<td>' + buildBadge(due.status) + '</td>',
        '<td><div class="actions">' + actions.join('') + '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderReport() {
    var report = state.report || {};
    byId('reportLancado').textContent = formatCurrency(report.totalLancado || 0);
    byId('reportPago').textContent = formatCurrency(report.totalPago || 0);
    byId('reportAberto').textContent = formatCurrency(report.totalAberto || 0);
    byId('reportAtrasado').textContent = formatCurrency(report.totalAtrasado || 0);

    var tbody = byId('reportTableBody');
    var items = report.inadimplentes || [];

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="muted">Nenhum inadimplente para esta competência.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (item) {
      return [
        '<tr>',
        '<td>' + escapeHtml(item.memberNome) + '</td>',
        '<td>' + escapeHtml(maskCpf(item.memberCpf || '')) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.total)) + '</td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderDocuments() {
    var tbody = byId('documentsTableBody');
    var items = filteredDocuments();

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum documento encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (doc) {
      return [
        '<tr>',
        '<td><strong>' + escapeHtml(doc.numero || '-') + '</strong></td>',
        '<td>' + escapeHtml(formatDocType(doc.tipo || '-')) + '</td>',
        '<td>' + escapeHtml(doc.memberNome || '-') + '</td>',
        '<td>' + escapeHtml(doc.competencia ? doc.competencia.length === 4 ? doc.competencia : formatMonth(doc.competencia) : '-') + '</td>',
        '<td>' + escapeHtml(formatDateTime(doc.createdAt)) + '</td>',
        '<td><button class="btn btn-secondary js-download-document" data-id="' + escapeHtml(doc.id) + '" type="button">Baixar PDF</button></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderAuditLogs() {
    var tbody = byId('auditTableBody');
    var items = state.auditLogs || [];

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="muted">Nenhum log encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (item) {
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDateTime(item.timestamp)) + '</td>',
        '<td>' + escapeHtml(item.username || '-') + '</td>',
        '<td>' + escapeHtml(item.action || '-') + '</td>',
        '<td>' + escapeHtml(item.entity || '-') + '</td>',
        '<td>' + escapeHtml(item.details || '-') + '</td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderUsers() {
    var tbody = byId('usersTableBody');
    var items = filteredUsers();

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="muted">Nenhum usuário encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (user) {
      var actions = [];
      actions.push('<button class="btn btn-secondary js-edit-user" data-id="' + escapeHtml(user.id) + '" type="button">Editar</button>');
      actions.push('<button class="btn btn-secondary js-toggle-user" data-id="' + escapeHtml(user.id) + '" type="button">' + escapeHtml(user.status === 'ATIVO' ? 'Inativar' : 'Ativar') + '</button>');

      return [
        '<tr>',
        '<td>' + escapeHtml(user.nome || '-') + '</td>',
        '<td>' + escapeHtml(user.username || '-') + '</td>',
        '<td>' + buildBadge(user.role || '-') + '</td>',
        '<td>' + buildBadge(user.status || '-') + '</td>',
        '<td><div class="actions">' + actions.join('') + '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderStats() {
    var activeMembers = state.members.filter(function (item) {
      return item.status === 'ATIVO';
    }).length;

    byId('statMembers').textContent = String(activeMembers);
    byId('statDues').textContent = String(state.dues.length);
    byId('statPaid').textContent = formatCurrency((state.report && state.report.totalPago) || 0);
    byId('statLate').textContent = formatCurrency((state.report && state.report.totalAtrasado) || 0);
  }

  async function loadBootstrap() {
    var response = await api.postApi('bootstrap', {});
    state.bootstrap = response.data;
    byId('unionName').textContent = state.bootstrap.unionName || runtime.UNION_NAME_FALLBACK;
    byId('buildInfo').textContent =
      'Usuário: ' + (state.bootstrap.displayName || state.bootstrap.username || '-') +
      ' · Perfil: ' + (state.bootstrap.role || '-') +
      ' · Versão: ' + (runtime.BUILD_VERSION || '-');

    populateRoleOptions();
    applyPermissions();
  }

  function populateRoleOptions() {
    var roles = (state.bootstrap && state.bootstrap.availableRoles) || ['ADMIN', 'SECRETARIA', 'FINANCEIRO', 'CONSULTA'];
    byId('userRole').innerHTML = roles.map(function (role) {
      return '<option value="' + escapeHtml(role) + '">' + escapeHtml(role) + '</option>';
    }).join('');
  }

  async function loadMembers() {
    if (!hasPermission('members.read')) {
      state.members = [];
      renderMembers();
      renderMemberOptions();
      renderStats();
      return;
    }

    var response = await api.postApi('members_list', {});
    state.members = response.data.items || [];
    renderMembers();
    renderMemberOptions();
    renderStats();
  }

  async function loadDues() {
    if (!hasPermission('dues.read')) {
      state.dues = [];
      renderDues();
      renderStats();
      return;
    }

    var response = await api.postApi('dues_list', {
      competencia: byId('duesCompetencia').value,
      status: byId('duesStatusFilter').value,
      search: byId('duesSearch').value.trim()
    });

    state.dues = response.data.items || [];
    renderDues();
    renderStats();
  }

  async function loadReport() {
    if (!hasPermission('reports.read')) {
      state.report = { totalLancado: 0, totalPago: 0, totalAberto: 0, totalAtrasado: 0, inadimplentes: [] };
      renderReport();
      renderStats();
      return;
    }

    var response = await api.postApi('monthly_report', {
      competencia: byId('reportCompetencia').value
    });

    state.report = response.data || {};
    renderReport();
    renderStats();
  }

  async function loadDocuments() {
    if (!hasPermission('documents.read')) {
      state.documents = [];
      renderDocuments();
      return;
    }

    var response = await api.postApi('documents_list', {
      search: byId('documentsSearch').value.trim(),
      tipo: byId('documentsTypeFilter').value,
      ano: byId('documentsYearFilter').value.trim()
    });

    state.documents = response.data.items || [];
    renderDocuments();
  }

  async function loadAudit() {
    if (!hasPermission('audit.read')) {
      state.auditLogs = [];
      renderAuditLogs();
      return;
    }

    var response = await api.postApi('audit_logs', { limit: 150 });
    state.auditLogs = response.data.items || [];
    renderAuditLogs();
  }

  async function loadUsers() {
    if (!hasPermission('users.manage')) {
      state.users = [];
      renderUsers();
      return;
    }

    var response = await api.postApi('users_list', {});
    state.users = response.data.items || [];
    renderUsers();
  }

  async function loadAll() {
    setGlobalMessage('Atualizando dados...', '');

    await loadBootstrap();

    var tasks = [];
    tasks.push(loadMembers());
    tasks.push(loadDues());
    tasks.push(loadReport());
    tasks.push(loadDocuments());

    if (hasPermission('audit.read')) {
      tasks.push(loadAudit());
    }

    if (hasPermission('users.manage')) {
      tasks.push(loadUsers());
    }

    await Promise.all(tasks);
    clearMessages();
  }

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('loginMessage', 'Entrando...', '');

    try {
      var response = await api.postApi('login', {
        username: byId('loginUsername').value.trim(),
        password: byId('loginPassword').value
      }, false);

      api.setSessionToken(response.data.sessionToken);
      byId('loginPassword').value = '';
      byId('loginScreen').classList.add('hidden');
      byId('appScreen').classList.remove('hidden');

      initializeDefaults();
      await loadAll();
      setGlobalMessage('Login realizado com sucesso.', 'success');
    } catch (error) {
      setMessage('loginMessage', error.message || 'Falha no login.', 'error');
    }
  }

  async function handleLogout() {
    try {
      await api.postApi('logout', {});
    } catch (error) {
      // ignore
    }

    api.clearSessionToken();
    location.reload();
  }

  async function handleMemberSubmit(event) {
    event.preventDefault();
    clearMessages();

    var payload = memberFormPayload();

    if (!payload.nome) {
      setMessage('memberMessage', 'Informe o nome.', 'error');
      return;
    }

    if (!validateCpf(payload.cpf)) {
      setMessage('memberMessage', 'CPF inválido.', 'error');
      return;
    }

    try {
      await api.postApi('member_save', payload);
      setMessage('memberMessage', 'Sindicalizado salvo com sucesso.', 'success');
      resetMemberForm();
      await Promise.all([loadMembers(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
    } catch (error) {
      setMessage('memberMessage', error.message || 'Falha ao salvar sindicalizado.', 'error');
    }
  }

  async function handleBatchSubmit(event) {
    event.preventDefault();
    clearMessages();

    var competencia = byId('batchCompetencia').value;
    var valor = parseCurrencyInput(byId('batchValor').value);
    var vencimento = byId('batchVencimento').value;

    if (!competencia || !valor || !vencimento) {
      setMessage('batchMessage', 'Preencha competência, valor e vencimento.', 'error');
      return;
    }

    try {
      var response = await api.postApi('dues_generate_batch', {
        competencia: competencia,
        valor: valor,
        vencimento: vencimento
      });

      setMessage(
        'batchMessage',
        'Mensalidades geradas: ' + response.data.createdCount + '. Ignoradas: ' + response.data.skippedCount + '.',
        'success'
      );

      byId('duesCompetencia').value = competencia;
      byId('reportCompetencia').value = competencia;
      await Promise.all([loadDues(), loadReport(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
    } catch (error) {
      setMessage('batchMessage', error.message || 'Falha ao gerar mensalidades.', 'error');
    }
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    clearMessages();

    if (!state.selectedDueId) {
      setMessage('paymentMessage', 'Selecione uma mensalidade na tabela.', 'error');
      return;
    }

    try {
      await api.postApi('due_pay', {
        dueId: state.selectedDueId,
        pagoEm: byId('paymentDate').value,
        formaPagamento: byId('paymentMethod').value,
        observacoes: byId('paymentNotes').value.trim()
      });

      clearSelectedDue();
      setMessage('paymentMessage', 'Pagamento registrado com sucesso.', 'success');

      var tasks = [loadDues(), loadReport(), hasPermission('documents.read') ? loadDocuments() : Promise.resolve()];
      if (hasPermission('audit.read')) tasks.push(loadAudit());
      await Promise.all(tasks);
    } catch (error) {
      setMessage('paymentMessage', error.message || 'Falha ao registrar pagamento.', 'error');
    }
  }

  async function downloadGeneratedDocument(action, payload) {
    var response = await api.postApi(action, payload);
    var documentData = response.data || {};

    if (documentData.base64Content) {
      downloadBase64File(documentData.fileName, documentData.mimeType, documentData.base64Content);
    }

    return documentData;
  }

  async function handleDocumentIssue(event) {
    event.preventDefault();
    clearMessages();

    var memberId = byId('documentMemberId').value;
    var type = byId('documentType').value;
    var year = byId('documentYear').value.trim();
    var action = '';
    var payload = {};

    if (!memberId) {
      setMessage('documentIssueMessage', 'Selecione um sindicalizado.', 'error');
      return;
    }

    if (type === 'DECLARACAO_FILIACAO') {
      action = 'member_declaration';
      payload = { memberId: memberId };
    } else if (type === 'FICHA_CADASTRAL') {
      action = 'member_profile_pdf';
      payload = { memberId: memberId };
    } else if (type === 'DECLARACAO_QUITACAO_ANUAL') {
      if (!/^\d{4}$/.test(year)) {
        setMessage('documentIssueMessage', 'Informe um ano válido.', 'error');
        return;
      }
      action = 'annual_clearance_issue';
      payload = { memberId: memberId, ano: year };
    } else {
      setMessage('documentIssueMessage', 'Tipo de documento inválido.', 'error');
      return;
    }

    try {
      var result = await downloadGeneratedDocument(action, payload);
      setMessage('documentIssueMessage', 'Documento ' + (result.numero || '') + ' gerado com sucesso.', 'success');
      var tasks = [loadDocuments()];
      if (hasPermission('audit.read')) tasks.push(loadAudit());
      await Promise.all(tasks);
    } catch (error) {
      setMessage('documentIssueMessage', error.message || 'Falha ao gerar documento.', 'error');
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    clearMessages();

    try {
      await api.postApi('change_password', {
        currentPassword: byId('passwordCurrent').value,
        newPassword: byId('passwordNew').value,
        confirmPassword: byId('passwordConfirm').value
      });

      byId('passwordCurrent').value = '';
      byId('passwordNew').value = '';
      byId('passwordConfirm').value = '';
      setMessage('changePasswordMessage', 'Senha atualizada com sucesso.', 'success');

      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('changePasswordMessage', error.message || 'Falha ao alterar senha.', 'error');
    }
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    clearMessages();

    try {
      await api.postApi('user_save', userFormPayload());
      resetUserForm();
      setMessage('userMessage', 'Usuário salvo com sucesso.', 'success');

      var tasks = [loadUsers()];
      if (hasPermission('audit.read')) tasks.push(loadAudit());
      await Promise.all(tasks);
    } catch (error) {
      setMessage('userMessage', error.message || 'Falha ao salvar usuário.', 'error');
    }
  }

  async function exportCsv(type) {
    var response = await api.postApi('export_csv', {
      type: type,
      competencia: byId('reportCompetencia').value,
      dueCompetencia: byId('duesCompetencia').value,
      dueStatus: byId('duesStatusFilter').value,
      dueSearch: byId('duesSearch').value.trim(),
      documentSearch: byId('documentsSearch').value.trim(),
      documentType: byId('documentsTypeFilter').value,
      documentYear: byId('documentsYearFilter').value.trim()
    });

    downloadBase64File(response.data.fileName, response.data.mimeType, response.data.base64Content);
  }

  function bindTableActions() {
    byId('membersTableBody').addEventListener('click', async function (event) {
      var editBtn = event.target.closest('.js-edit-member');
      var inactivateBtn = event.target.closest('.js-inactivate-member');
      var declarationBtn = event.target.closest('.js-declaration-member');
      var profileBtn = event.target.closest('.js-profile-member');

      if (editBtn) {
        var memberToEdit = state.members.find(function (item) {
          return item.id === editBtn.getAttribute('data-id');
        });
        if (memberToEdit) fillMemberForm(memberToEdit);
        return;
      }

      if (inactivateBtn) {
        if (!window.confirm('Deseja inativar este sindicalizado?')) return;

        try {
          await api.postApi('member_inactivate', { id: inactivateBtn.getAttribute('data-id') });
          setGlobalMessage('Sindicalizado inativado com sucesso.', 'success');
          await Promise.all([loadMembers(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao inativar sindicalizado.', 'error');
        }
        return;
      }

      if (declarationBtn) {
        try {
          await downloadGeneratedDocument('member_declaration', { memberId: declarationBtn.getAttribute('data-id') });
          setGlobalMessage('Declaração gerada com sucesso.', 'success');
          await Promise.all([loadDocuments(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao gerar declaração.', 'error');
        }
        return;
      }

      if (profileBtn) {
        try {
          await downloadGeneratedDocument('member_profile_pdf', { memberId: profileBtn.getAttribute('data-id') });
          setGlobalMessage('Ficha cadastral gerada com sucesso.', 'success');
          await Promise.all([loadDocuments(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao gerar ficha cadastral.', 'error');
        }
      }
    });

    byId('duesTableBody').addEventListener('click', async function (event) {
      var payBtn = event.target.closest('.js-pay-due');
      var receiptBtn = event.target.closest('.js-receipt-due');

      if (payBtn) {
        var due = state.dues.find(function (item) {
          return item.id === payBtn.getAttribute('data-id');
        });
        if (due) selectDue(due);
        return;
      }

      if (receiptBtn) {
        try {
          await downloadGeneratedDocument('receipt_issue', { dueId: receiptBtn.getAttribute('data-id') });
          setGlobalMessage('Recibo gerado com sucesso.', 'success');
          await Promise.all([loadDocuments(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao gerar recibo.', 'error');
        }
      }
    });

    byId('documentsTableBody').addEventListener('click', async function (event) {
      var button = event.target.closest('.js-download-document');
      if (!button) return;

      try {
        var response = await api.postApi('document_download', { documentId: button.getAttribute('data-id') });
        downloadBase64File(response.data.fileName, response.data.mimeType, response.data.base64Content);
      } catch (error) {
        setGlobalMessage(error.message || 'Falha ao baixar documento.', 'error');
      }
    });

    byId('usersTableBody').addEventListener('click', async function (event) {
      var editBtn = event.target.closest('.js-edit-user');
      var toggleBtn = event.target.closest('.js-toggle-user');

      if (editBtn) {
        var userToEdit = state.users.find(function (item) {
          return item.id === editBtn.getAttribute('data-id');
        });
        if (userToEdit) fillUserForm(userToEdit);
        return;
      }

      if (toggleBtn) {
        if (!window.confirm('Deseja alterar o status deste usuário?')) return;

        try {
          await api.postApi('user_toggle_status', { id: toggleBtn.getAttribute('data-id') });
          setGlobalMessage('Status do usuário atualizado.', 'success');
          var tasks = [loadUsers()];
          if (hasPermission('audit.read')) tasks.push(loadAudit());
          await Promise.all(tasks);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao alterar status do usuário.', 'error');
        }
      }
    });
  }

  function initializeDefaults() {
    var month = currentMonth();
    byId('memberFiliacao').value = today();
    byId('batchCompetencia').value = month;
    byId('batchValor').value = '30,00';
    byId('batchVencimento').value = defaultDueDate(month);
    byId('duesCompetencia').value = month;
    byId('reportCompetencia').value = month;
    byId('paymentDate').value = today();
    byId('documentYear').value = currentYear();
    resetMemberForm();
    resetUserForm();
    clearSelectedDue();
    updateDocumentTypeVisibility();
    byId('buildInfo').textContent = 'Versão: ' + (runtime.BUILD_VERSION || '-');
  }

  function debounce(fn, delay) {
    var timer = 0;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function bindEvents() {
    byId('loginForm').addEventListener('submit', handleLogin);
    byId('logoutBtn').addEventListener('click', handleLogout);
    byId('refreshBtn').addEventListener('click', function () {
      loadAll().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao atualizar.', 'error');
      });
    });

    byId('memberForm').addEventListener('submit', handleMemberSubmit);
    byId('cancelMemberEditBtn').addEventListener('click', resetMemberForm);
    byId('batchForm').addEventListener('submit', handleBatchSubmit);
    byId('paymentForm').addEventListener('submit', handlePaymentSubmit);
    byId('clearPaymentSelectionBtn').addEventListener('click', clearSelectedDue);
    byId('documentIssueForm').addEventListener('submit', handleDocumentIssue);
    byId('changePasswordForm').addEventListener('submit', handleChangePassword);
    byId('userForm').addEventListener('submit', handleUserSubmit);
    byId('cancelUserEditBtn').addEventListener('click', resetUserForm);

    byId('documentType').addEventListener('change', updateDocumentTypeVisibility);

    byId('memberSearch').addEventListener('input', renderMembers);
    byId('memberStatusFilter').addEventListener('change', renderMembers);

    byId('documentsSearch').addEventListener('input', debounce(function () {
      loadDocuments().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar documentos.', 'error');
      });
    }, 250));
    byId('documentsTypeFilter').addEventListener('change', function () {
      loadDocuments().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar documentos.', 'error');
      });
    });
    byId('documentsYearFilter').addEventListener('input', debounce(function () {
      loadDocuments().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar documentos.', 'error');
      });
    }, 250));

    byId('duesCompetencia').addEventListener('change', function () {
      loadDues().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar mensalidades.', 'error');
      });
    });
    byId('duesStatusFilter').addEventListener('change', function () {
      loadDues().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar mensalidades.', 'error');
      });
    });
    byId('duesSearch').addEventListener('input', debounce(function () {
      loadDues().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao carregar mensalidades.', 'error');
      });
    }, 300));

    byId('refreshReportBtn').addEventListener('click', function () {
      loadReport().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao atualizar relatório.', 'error');
      });
    });

    byId('documentsRefreshBtn').addEventListener('click', function () {
      loadDocuments().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao atualizar documentos.', 'error');
      });
    });

    byId('auditRefreshBtn').addEventListener('click', function () {
      loadAudit().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao atualizar auditoria.', 'error');
      });
    });

    byId('usersRefreshBtn').addEventListener('click', function () {
      loadUsers().catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao atualizar usuários.', 'error');
      });
    });

    byId('membersExportBtn').addEventListener('click', function () {
      exportCsv('members').catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao exportar sindicalizados.', 'error');
      });
    });

    byId('duesExportBtn').addEventListener('click', function () {
      exportCsv('dues').catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao exportar mensalidades.', 'error');
      });
    });

    byId('documentsExportBtn').addEventListener('click', function () {
      exportCsv('documents').catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao exportar documentos.', 'error');
      });
    });

    byId('reportExportBtn').addEventListener('click', function () {
      exportCsv('monthly_report').catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao exportar relatório.', 'error');
      });
    });

    byId('usersExportBtn').addEventListener('click', function (event) {
      event.preventDefault();
      exportCsv('users').catch(function (error) {
        setGlobalMessage(error.message || 'Falha ao exportar usuários.', 'error');
      });
    });

    qsa('.tab-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.classList.contains('hidden')) return;
        showTab(button.getAttribute('data-tab'));
      });
    });

    bindTableActions();
    applyInputMasks();
  }

  async function restoreSessionIfPossible() {
    if (!api.getSessionToken()) {
      return;
    }

    try {
      byId('loginScreen').classList.add('hidden');
      byId('appScreen').classList.remove('hidden');
      initializeDefaults();
      await loadAll();
    } catch (error) {
      api.clearSessionToken();
      byId('appScreen').classList.add('hidden');
      byId('loginScreen').classList.remove('hidden');
      setMessage('loginMessage', 'Sua sessão expirou. Entre novamente.', 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    initializeDefaults();
    restoreSessionIfPossible().catch(function (error) {
      setMessage('loginMessage', error.message || 'Falha ao restaurar sessão.', 'error');
    });
  });
}());
