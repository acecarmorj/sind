// assets/portal.js
(function () {
  'use strict';

  var TOKEN_KEY = 'aceap_portal_token';

  var state = {
    profile: null,
    summary: null,
    dues: [],
    receipts: [],
    documents: [],
    events: [],
    announcements: [],
    requests: [],
    card: null
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function setText(id, value) {
    var element = byId(id);
    if (element) {
      element.textContent = value == null ? '' : String(value);
    }
  }

  function setValue(id, value) {
    var element = byId(id);
    if (element) {
      element.value = value == null ? '' : String(value);
    }
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

  function getPortalToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function setPortalToken(token) {
    localStorage.setItem(TOKEN_KEY, token || '');
  }

  function clearPortalToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function parseJsonResponse(response) {
    var text = await response.text();
    var data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Não foi possível carregar as informações no momento.');
    }

    if (!data.ok) {
      throw new Error(data.message || 'Não foi possível concluir a solicitação.');
    }

    return data.data || {};
  }

  async function portalPost(action, payload) {
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

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function createCell(text) {
    var cell = document.createElement('td');
    cell.textContent = text == null ? '' : String(text);
    return cell;
  }

  function createStatusBadge(status) {
    var badge = document.createElement('span');
    badge.className = 'portal-table-status';
    badge.textContent = status || '-';
    return badge;
  }

  function clearElement(element) {
    while (element && element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function setMessage(message, type) {
    var element = byId('portalLoginMessage');

    if (!element) {
      return;
    }

    element.textContent = message || '';
    element.className = 'message';

    if (type) {
      element.classList.add(type);
    }
  }

  function setLoginBusy(isBusy) {
    var submit = byId('portalLoginSubmit');

    if (!submit) {
      submit = byId('portalLoginForm') && byId('portalLoginForm').querySelector('button[type="submit"]');
    }

    if (submit) {
      submit.disabled = !!isBusy;
      submit.textContent = isBusy ? 'Entrando...' : 'Entrar no portal';
    }
  }

  function showLogin() {
    var login = byId('portalLoginScreen');
    var app = byId('portalAppScreen');

    if (login) {
      login.classList.remove('hidden');
    }

    if (app) {
      app.classList.add('hidden');
    }
  }

  function showPortal() {
    var login = byId('portalLoginScreen');
    var app = byId('portalAppScreen');

    if (login) {
      login.classList.add('hidden');
    }

    if (app) {
      app.classList.remove('hidden');
    }

    renderPortal();
  }

  function showTab(tabName) {
    var targetId = 'portal-tab-' + tabName;
    var targetPanel = byId(targetId);

    if (!targetPanel) {
      return;
    }

    all('[data-portal-tab]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-portal-tab') === tabName);
    });

    all('.portal-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === targetId);
    });
  }

  function normalizeBootstrap(data) {
    data = data || {};
    state.profile = data.profile || {};
    state.summary = data.summary || {};
    state.dues = Array.isArray(data.dues) ? data.dues : [];
    state.receipts = Array.isArray(data.receipts) ? data.receipts : [];
    state.documents = Array.isArray(data.documents) ? data.documents : [];
    state.events = Array.isArray(data.events) ? data.events : [];
    state.announcements = Array.isArray(data.announcements) ? data.announcements : [];
    state.requests = Array.isArray(data.requests) ? data.requests : [];
    state.card = data.card || {};
  }


  function buildCardQrPayload(profile, card) {
    var payload = [
      'ACEAP - Carteirinha do Associado',
      'Empresa: ' + (card.companyName || profile.companyName || '-'),
      'CPF/CNPJ: ' + (card.document || profile.document || '-'),
      'Status: ' + (card.status || profile.status || '-'),
      'Validade: ' + (card.validity || '-'),
      'ID: ' + (profile.id || '-')
    ].join('\n');

    return payload;
  }

  function renderCardQr(profile, card) {
    var image = byId('portalCardQrImage');
    var text = byId('portalCardQrText');
    var payload;

    if (!image) {
      return;
    }

    payload = buildCardQrPayload(profile || {}, card || {});
    image.src = 'https://quickchart.io/qr?size=180&margin=1&text=' + encodeURIComponent(payload);
    image.title = 'QR Code da carteirinha ACEAP';

    if (text) {
      text.textContent = 'Aponte a câmera para conferir os dados da carteirinha.';
    }
  }

  function renderProfile() {
    var profile = state.profile || {};
    var card = state.card || {};
    var welcomeText = 'Bem-vindo ao seu portal de relacionamento com a ACEAP.';

    if (profile.mustChangePassword) {
      welcomeText = 'Bem-vindo ao seu portal de relacionamento com a ACEAP.';
    }

    setText('portalMemberNameTop', profile.companyName || 'Área exclusiva do associado');
    setText('portalWelcomeTitle', 'Olá, ' + (profile.tradeName || profile.companyName || 'associado'));
    setText('portalWelcomeText', welcomeText);
    setText('portalStatusBadge', profile.status || '-');

    setValue('portalCompanyName', profile.companyName || '');
    setValue('portalTradeName', profile.tradeName || '');
    setValue('portalCompanyDocument', profile.document || '');
    setValue('portalResponsible', profile.responsible || '');
    setValue('portalWhatsapp', profile.whatsapp || '');
    setValue('portalEmail', profile.email || '');
    setValue('portalCategory', profile.category || '');
    setValue('portalJoinDate', profile.joinDate || '');
    setValue('portalMemberStatus', profile.status || '');

    setText('portalCardCompany', card.companyName || profile.companyName || '-');
    setText('portalCardDocument', card.document || profile.document || '-');
    setText('portalCardMemberStatus', card.status || profile.status || '-');
    setText('portalCardValidity', card.validity || '-');
    renderCardQr(profile, card);
  }

  function appendEmptyRow(tbody, colSpan, message) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');

    cell.colSpan = colSpan;
    cell.className = 'muted';
    cell.textContent = message;
    row.appendChild(cell);
    tbody.appendChild(row);
  }

  function renderDues() {
    var tbody = byId('portalDuesTableBody');
    clearElement(tbody);

    if (!state.dues.length) {
      appendEmptyRow(tbody, 5, 'Nenhuma mensalidade encontrada para este associado.');
      return;
    }

    state.dues.forEach(function (due) {
      var row = document.createElement('tr');
      var statusCell = document.createElement('td');

      row.appendChild(createCell(due.competence));
      row.appendChild(createCell(due.dueDate));
      row.appendChild(createCell(formatCurrency(due.value)));
      statusCell.appendChild(createStatusBadge(due.status));
      row.appendChild(statusCell);
      row.appendChild(createCell(due.action));
      tbody.appendChild(row);
    });
  }

  function downloadBase64File(file) {
    var link = document.createElement('a');

    link.href = 'data:' + (file.mimeType || 'application/pdf') + ';base64,' + file.base64Content;
    link.download = file.fileName || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function downloadDocument(documentId) {
    var token = getPortalToken();

    if (!token) {
      clearPortalToken();
      showLogin();
      return;
    }

    try {
      var file = await portalPost('portal_document_download', {
        portalToken: token,
        documentId: documentId
      });
      downloadBase64File(file);
    } catch (error) {
      alert(error.message || 'Não foi possível baixar o documento.');
    }
  }

  function createDownloadButton(documentId) {
    var button = document.createElement('button');

    button.className = 'btn btn-outline';
    button.type = 'button';
    button.textContent = 'Baixar';
    button.addEventListener('click', function () {
      downloadDocument(documentId);
    });

    return button;
  }

  function renderReceipts() {
    var tbody = byId('portalReceiptsTableBody');
    clearElement(tbody);

    if (!state.receipts.length) {
      appendEmptyRow(tbody, 5, 'Nenhum recibo emitido encontrado.');
      return;
    }

    state.receipts.forEach(function (receipt) {
      var row = document.createElement('tr');
      var actionCell = document.createElement('td');

      row.appendChild(createCell(receipt.number));
      row.appendChild(createCell(receipt.date));
      row.appendChild(createCell(receipt.competence));
      row.appendChild(createCell(formatCurrency(receipt.value)));

      if (receipt.canDownload && receipt.documentId) {
        actionCell.appendChild(createDownloadButton(receipt.documentId));
      } else {
        actionCell.textContent = receipt.status || 'Indisponível';
      }

      row.appendChild(actionCell);
      tbody.appendChild(row);
    });
  }

  function renderDocuments() {
    var grid = byId('portalDocumentsGrid');
    clearElement(grid);

    if (!state.documents.length) {
      var empty = document.createElement('article');
      empty.className = 'portal-document-card';
      empty.textContent = 'Nenhum documento emitido encontrado.';
      grid.appendChild(empty);
      return;
    }

    state.documents.forEach(function (documentItem) {
      var card = document.createElement('article');
      var title = document.createElement('strong');
      var description = document.createElement('p');
      var status = document.createElement('span');

      card.className = 'portal-document-card';
      title.textContent = documentItem.title || 'Documento';
      description.textContent = documentItem.description || '';
      status.className = 'portal-table-status';
      status.textContent = documentItem.status || 'Disponível';

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(status);

      if (documentItem.canDownload && documentItem.documentId) {
        card.appendChild(createDownloadButton(documentItem.documentId));
      }

      grid.appendChild(card);
    });
  }


  function createPortalEmptyCard(message) {
    var card = document.createElement('article');
    card.className = 'portal-document-card muted';
    card.textContent = message;
    return card;
  }

  function renderPortalEvents() {
    var grid = byId('portalEventsGrid');
    clearElement(grid);

    if (!state.events.length) {
      grid.appendChild(createPortalEmptyCard('Nenhum evento publicado no momento.'));
      return;
    }

    state.events.forEach(function (eventItem) {
      var card = document.createElement('article');
      var date = document.createElement('span');
      var title = document.createElement('strong');
      var description = document.createElement('p');
      var meta = document.createElement('small');

      card.className = 'portal-event-card';
      date.className = 'portal-event-date';
      date.textContent = (eventItem.date || '-') + (eventItem.time ? ' • ' + eventItem.time : '');
      title.textContent = eventItem.title || 'Evento';
      description.textContent = eventItem.description || 'Mais informações serão divulgadas pela ACEAP.';
      meta.textContent = [eventItem.type, eventItem.place, eventItem.capacityLabel].filter(Boolean).join(' • ');

      card.appendChild(date);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  function renderPortalAnnouncements() {
    var board = byId('portalAnnouncementsBoard');
    clearElement(board);

    if (!state.announcements.length) {
      board.appendChild(createPortalEmptyCard('Nenhum aviso publicado no momento.'));
      return;
    }

    state.announcements.forEach(function (item) {
      var card = document.createElement('article');
      var meta = document.createElement('span');
      var title = document.createElement('strong');
      var message = document.createElement('p');

      card.className = 'portal-announcement-card' + (item.pinned ? ' is-pinned' : '');
      meta.textContent = (item.pinned ? 'Fixado • ' : '') + (item.publishedAt || '-');
      title.textContent = item.title || 'Aviso';
      message.textContent = item.message || '';

      card.appendChild(meta);
      card.appendChild(title);
      card.appendChild(message);
      board.appendChild(card);
    });
  }


  function portalRequestStatusLabel(value) {
    var labels = {
      ABERTA: 'Aberta',
      EM_ANALISE: 'Em análise',
      AGUARDANDO_ASSOCIADO: 'Aguardando associado',
      CONCLUIDA: 'Concluída',
      CANCELADA: 'Cancelada'
    };
    return labels[String(value || '').toUpperCase()] || value || '-';
  }

  function portalRequestTypeLabel(value) {
    var labels = {
      ATUALIZACAO_CADASTRAL: 'Atualização cadastral',
      DECLARACAO: 'Declaração',
      SEGUNDA_VIA: 'Segunda via',
      SUPORTE: 'Suporte',
      CATALOGO: 'Catálogo',
      DESLIGAMENTO: 'Desligamento',
      OUTRO: 'Outro'
    };
    return labels[String(value || '').toUpperCase()] || value || '-';
  }

  function setPortalRequestMessage(message, type) {
    var element = byId('portalRequestMessage');

    if (!element) return;

    element.textContent = message || '';
    element.className = 'message';

    if (type) {
      element.classList.add(type);
    }
  }

  function renderPortalRequests() {
    var list = byId('portalRequestsList');
    clearElement(list);

    if (!state.requests.length) {
      list.appendChild(createPortalEmptyCard('Nenhum protocolo aberto até o momento.'));
      return;
    }

    state.requests.forEach(function (request) {
      var card = document.createElement('article');
      var meta = document.createElement('span');
      var title = document.createElement('strong');
      var message = document.createElement('p');
      var response = document.createElement('small');

      card.className = 'portal-request-card';
      meta.textContent = (request.protocol || '-') + ' • ' + (request.createdAt || '-');
      title.textContent = portalRequestTypeLabel(request.type) + ' — ' + portalRequestStatusLabel(request.status);
      message.textContent = request.message || '';
      response.textContent = request.response ? 'Resposta: ' + request.response : 'Aguardando atendimento da ACEAP.';

      card.appendChild(meta);
      card.appendChild(title);
      card.appendChild(message);
      card.appendChild(response);
      list.appendChild(card);
    });
  }

  async function refreshPortalRequests() {
    var token = getPortalToken();

    if (!token) {
      clearPortalToken();
      showLogin();
      return;
    }

    var result = await portalPost('portal_requests_list', {
      portalToken: token
    });

    state.requests = result.items || [];
    renderPortalRequests();
  }

  async function handlePortalRequestSubmit(event) {
    var token = getPortalToken();
    var submit = byId('portalRequestSubmitBtn');

    event.preventDefault();

    if (!token) {
      clearPortalToken();
      showLogin();
      return;
    }

    if (!byId('portalRequestMessageText').value.trim()) {
      setPortalRequestMessage('Descreva sua solicitação.', 'error');
      return;
    }

    try {
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Abrindo...';
      }

      setPortalRequestMessage('Abrindo protocolo...', '');
      await portalPost('portal_request_create', {
        portalToken: token,
        type: byId('portalRequestType').value,
        message: byId('portalRequestMessageText').value.trim()
      });

      byId('portalRequestMessageText').value = '';
      setPortalRequestMessage('Protocolo aberto com sucesso.', 'success');
      await refreshPortalRequests();
    } catch (error) {
      setPortalRequestMessage(error.message || 'Não foi possível abrir o protocolo.', 'error');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Abrir protocolo';
      }
    }
  }

  function renderSummary() {
    var summary = state.summary || {};

    setText('portalOpenDues', String(summary.openDues == null ? 0 : summary.openDues));
    setText('portalNextDue', summary.nextDue || '-');
    setText('portalLastReceipt', summary.lastReceipt || '-');
    setText('portalCardStatus', summary.cardStatus || '-');
  }

  function renderPortal() {
    renderProfile();
    renderSummary();
    renderDues();
    renderReceipts();
    renderDocuments();
    renderPortalEvents();
    renderPortalAnnouncements();
    renderPortalRequests();
  }

  async function loadPortal() {
    var token = getPortalToken();

    if (!token) {
      showLogin();
      return;
    }

    try {
      var data = await portalPost('portal_bootstrap', {
        portalToken: token
      });
      normalizeBootstrap(data);
      showPortal();
    } catch (error) {
      clearPortalToken();
      showLogin();
      setMessage(error.message || 'Sessão expirada. Entre novamente.', 'error');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    var documentValue = byId('portalDocument').value.trim();
    var passwordValue = byId('portalPassword').value.trim();

    if (!documentValue || !passwordValue) {
      setMessage('Informe CPF/CNPJ e senha para visualizar o portal.', 'error');
      return;
    }

    try {
      setLoginBusy(true);
      setMessage('Validando acesso...', 'info');

      var result = await portalPost('portal_login', {
        document: documentValue,
        password: passwordValue
      });

      setPortalToken(result.portalToken);
      normalizeBootstrap(result.bootstrap || {});
      setMessage('');
      showPortal();
      showTab('inicio');
    } catch (error) {
      clearPortalToken();
      setMessage(error.message || 'Não foi possível entrar no portal.', 'error');
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    var token = getPortalToken();

    clearPortalToken();

    if (token) {
      try {
        await portalPost('portal_logout', {
          portalToken: token
        });
      } catch (error) {
        // O logout local já foi concluído.
      }
    }

    showLogin();
  }

  function bindEvents() {
    var loginForm = byId('portalLoginForm');
    var logoutBtn = byId('portalLogoutBtn');
    var printCardBtn = byId('portalPrintCardBtn');

    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    if (printCardBtn) {
      printCardBtn.addEventListener('click', function () {
        window.print();
      });
    }

    if (byId('portalRequestForm')) {
      byId('portalRequestForm').addEventListener('submit', handlePortalRequestSubmit);
    }

    if (byId('portalRequestsRefreshBtn')) {
      byId('portalRequestsRefreshBtn').addEventListener('click', function () {
        refreshPortalRequests().catch(function (error) {
          setPortalRequestMessage(error.message || 'Falha ao atualizar protocolos.', 'error');
        });
      });
    }

    all('[data-portal-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        showTab(button.getAttribute('data-portal-tab'));
      });
    });

    all('[data-portal-go]').forEach(function (button) {
      button.addEventListener('click', function () {
        showTab(button.getAttribute('data-portal-go'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    loadPortal();
  });
}());
