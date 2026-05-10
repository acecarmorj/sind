var SIND_SETUP = {
  USE_ACTIVE_SPREADSHEET: true,
  SPREADSHEET_NAME: 'db_sind',
  SPREADSHEET_ID: '',
  PDF_FOLDER_ID: '',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: '123456',
  ADMIN_NAME: 'Administrador',
  UNION_NAME: 'ACEAP - Associação Comercial e Empresarial de Além Paraíba - MG'
};

var SIND_SECURITY = {
  PROP_SPREADSHEET_ID: 'SIND_SPREADSHEET_ID',
  PROP_PDF_FOLDER_ID: 'SIND_PDF_FOLDER_ID',
  PROP_UNION_NAME: 'SIND_UNION_NAME',
  SESSION_PREFIX: 'SIND_SESSION_',
  PORTAL_SESSION_PREFIX: 'SIND_PORTAL_SESSION_'
};

var SIND_SHEETS = {
  MEMBERS: 'Sindicalizados',
  DUES: 'Mensalidades',
  DOCUMENTS: 'Documentos',
  ATTACHMENTS: 'Anexos',
  CASH_CLOSINGS: 'FechamentosCaixa',
  CASH_MOVEMENTS: 'MovimentosCaixa',
  PAYABLES: 'ContasPagar',
  EVENTS: 'Eventos',
  ANNOUNCEMENTS: 'Avisos',
  CATALOG: 'Catalogo',
  REQUESTS: 'Protocolos',
  CONFIG: 'Config',
  AUDIT: 'Auditoria',
  USERS: 'Usuarios'
};

var SIND_ROLES = {
  ADMIN: 'ADMIN',
  SECRETARIA: 'SECRETARIA',
  FINANCEIRO: 'FINANCEIRO',
  CONSULTA: 'CONSULTA'
};

var PERMISSION_GROUPS = {
  ADMIN: [
    'dashboard.read',
    'members.read',
    'members.write',
    'members.inactivate',
    'dues.read',
    'dues.generate',
    'dues.pay',
    'reports.read',
    'cash.read',
    'cash.close',
    'documents.read',
    'documents.issue',
    'attachments.read',
    'attachments.write',
    'audit.read',
    'users.manage',
    'events.read',
    'events.manage',
    'announcements.read',
    'announcements.manage',
    'catalog.read',
    'catalog.manage',
    'requests.read',
    'requests.manage',
    'password.change'
  ],
  SECRETARIA: [
    'dashboard.read',
    'members.read',
    'members.write',
    'dues.read',
    'dues.pay',
    'reports.read',
    'cash.read',
    'cash.close',
    'documents.read',
    'documents.issue',
    'attachments.read',
    'attachments.write',
    'events.read',
    'events.manage',
    'announcements.read',
    'announcements.manage',
    'catalog.read',
    'catalog.manage',
    'requests.read',
    'requests.manage',
    'password.change'
  ],
  FINANCEIRO: [
    'dashboard.read',
    'members.read',
    'dues.read',
    'dues.generate',
    'dues.pay',
    'reports.read',
    'cash.read',
    'cash.close',
    'documents.read',
    'documents.issue',
    'attachments.read',
    'events.read',
    'announcements.read',
    'catalog.read',
    'requests.read',
    'password.change'
  ],
  CONSULTA: [
    'dashboard.read',
    'members.read',
    'dues.read',
    'reports.read',
    'documents.read',
    'attachments.read',
    'events.read',
    'announcements.read',
    'catalog.read',
    'requests.read',
    'password.change'
  ]
};

var MEMBER_HEADERS = [
  'id',
  'nome',
  'cpf',
  'rg',
  'dataNascimento',
  'email',
  'telefone',
  'endereco',
  'bairro',
  'cidade',
  'uf',
  'cep',
  'empresa',
  'cargo',
  'dataAdmissao',
  'dataFiliacao',
  'status',
  'observacoes',
  'createdAt',
  'updatedAt',
  'portalAccessEnabled',
  'portalPasswordHash',
  'portalMustChangePassword',
  'portalLastLoginAt'
];

var DUE_HEADERS = [
  'id',
  'memberId',
  'memberNome',
  'memberCpf',
  'competencia',
  'valor',
  'vencimento',
  'pagoEm',
  'formaPagamento',
  'status',
  'observacoes',
  'createdAt',
  'updatedAt'
];

var DOCUMENT_HEADERS = [
  'id',
  'tipo',
  'numero',
  'memberId',
  'memberNome',
  'dueId',
  'competencia',
  'descricao',
  'driveFileId',
  'driveFileName',
  'mimeType',
  'createdBy',
  'createdAt'
];

var ATTACHMENT_HEADERS = [
  'id',
  'memberId',
  'memberNome',
  'tipo',
  'descricao',
  'driveFileId',
  'driveFileName',
  'mimeType',
  'tamanhoBytes',
  'createdBy',
  'createdAt'
];

var CASH_CLOSING_HEADERS = [
  'id',
  'tipo',
  'periodoInicio',
  'periodoFim',
  'competencia',
  'totalRecebido',
  'quantidadePagamentos',
  'pix',
  'dinheiro',
  'boleto',
  'cartao',
  'transferencia',
  'outro',
  'observacoes',
  'closedBy',
  'closedAt',
  'createdAt',
  'updatedAt',
  'manualEntradas',
  'totalEntradas',
  'saidasFixas',
  'saidasVariaveis',
  'totalSaidas',
  'saldoPeriodo'
];

var CASH_MOVEMENT_HEADERS = [
  'id',
  'tipo',
  'classificacao',
  'data',
  'competencia',
  'categoria',
  'descricao',
  'formaPagamento',
  'valor',
  'observacoes',
  'createdBy',
  'createdAt',
  'updatedAt'
];

var PAYABLE_HEADERS = [
  'id',
  'descricao',
  'fornecedor',
  'classificacao',
  'categoria',
  'valor',
  'vencimento',
  'competencia',
  'status',
  'pagoEm',
  'formaPagamento',
  'observacoes',
  'createdBy',
  'createdAt',
  'updatedAt',
  'paidBy',
  'paidAt'
];

var EVENT_HEADERS = [
  'id',
  'title',
  'type',
  'date',
  'time',
  'place',
  'description',
  'capacity',
  'status',
  'visibleInPortal',
  'createdBy',
  'createdAt',
  'updatedAt'
];

var ANNOUNCEMENT_HEADERS = [
  'id',
  'title',
  'message',
  'audience',
  'status',
  'pinned',
  'visibleInPortal',
  'publishedAt',
  'expiresAt',
  'createdBy',
  'createdAt',
  'updatedAt'
];

var CATALOG_HEADERS = [
  'id',
  'memberId',
  'publicName',
  'category',
  'description',
  'whatsapp',
  'instagram',
  'address',
  'visible',
  'highlight',
  'updatedBy',
  'createdAt',
  'updatedAt'
];

var REQUEST_HEADERS = [
  'id',
  'protocol',
  'memberId',
  'memberName',
  'type',
  'message',
  'status',
  'response',
  'internalNote',
  'createdBy',
  'createdAt',
  'updatedAt',
  'closedAt'
];

var AUDIT_HEADERS = [
  'timestamp',
  'username',
  'action',
  'entity',
  'entityId',
  'details'
];

var USER_HEADERS = [
  'id',
  'nome',
  'username',
  'passwordHash',
  'role',
  'status',
  'createdAt',
  'updatedAt'
];

var DOCUMENT_TYPES = {
  RECEIPT: 'RECIBO_MENSALIDADE',
  AFFILIATION: 'DECLARACAO_FILIACAO',
  MEMBER_FORM: 'FICHA_CADASTRAL',
  ANNUAL_CLEARANCE: 'DECLARACAO_QUITACAO_ANUAL'
};

function doGet(e) {
  try {
    var action = normalizeAction_((e && e.parameter && e.parameter.action) || '');

    if (action === 'health') {
      return jsonResponse_(true, 'OK', {
        service: 'sindicato-apps-script',
        version: '2026-05-09-portal-catalogo-protocolos'
      });
    }

    return jsonResponse_(false, 'Ação GET inválida.');
  } catch (error) {
    return handleError_(error);
  }
}

function doPost(e) {
  try {
    var body = parseJsonBody_(e);
    var action = normalizeAction_(body.action || '');
    var payload = body.payload || {};
    var sessionToken = String(body.sessionToken || '').trim();

    if (action === 'login') {
      return jsonResponse_(true, 'OK', login_(payload));
    }

    if (action === 'logout') {
      return jsonResponse_(true, 'OK', logout_(sessionToken));
    }

    if (action === 'portal_login' || action === 'portallogin') {
      return jsonResponse_(true, 'OK', portalLogin_(payload));
    }

    if (action === 'portal_logout' || action === 'portallogout') {
      return jsonResponse_(true, 'OK', portalLogout_(payload.portalToken));
    }

    if (action === 'portal_bootstrap' || action === 'portalbootstrap') {
      return jsonResponse_(true, 'OK', portalBootstrap_(payload));
    }

    if (action === 'portal_document_download' || action === 'portaldocumentdownload') {
      return jsonResponse_(true, 'OK', portalDownloadDocument_(payload));
    }

    if (action === 'catalog_public_list' || action === 'catalogpubliclist') {
      return jsonResponse_(true, 'OK', { items: listPublicCatalogEntries_(payload) });
    }

    if (action === 'portal_request_create' || action === 'portalrequestcreate') {
      return jsonResponse_(true, 'OK', portalCreateRequest_(payload));
    }

    if (action === 'portal_requests_list' || action === 'portalrequestslist') {
      return jsonResponse_(true, 'OK', { items: portalListRequests_(payload) });
    }

    var session = requireSession_(sessionToken);

    switch (action) {
      case 'bootstrap':
        requirePermission_(session, 'dashboard.read');
        return jsonResponse_(true, 'OK', buildBootstrap_(session));
      case 'members_list':
        requirePermission_(session, 'members.read');
        return jsonResponse_(true, 'OK', { items: listMembers_(payload) });
      case 'member_history':
        requirePermission_(session, 'members.read');
        return jsonResponse_(true, 'OK', buildMemberHistory_(payload.memberId, session));
      case 'member_save':
        requirePermission_(session, 'members.write');
        return jsonResponse_(true, 'OK', saveMember_(payload, session.username));
      case 'member_inactivate':
        requirePermission_(session, 'members.inactivate');
        return jsonResponse_(true, 'OK', inactivateMember_(payload.id, session.username));
      case 'dues_generate_batch':
        requirePermission_(session, 'dues.generate');
        return jsonResponse_(true, 'OK', generateBatchDues_(payload, session.username));
      case 'dues_list':
        requirePermission_(session, 'dues.read');
        return jsonResponse_(true, 'OK', { items: listDues_(payload) });
      case 'due_pay':
        requirePermission_(session, 'dues.pay');
        return jsonResponse_(true, 'OK', payDue_(payload, session.username));
      case 'monthly_report':
        requirePermission_(session, 'reports.read');
        return jsonResponse_(true, 'OK', buildMonthlyReport_(payload.competencia));
      case 'financial_dashboard':
        requirePermission_(session, 'reports.read');
        return jsonResponse_(true, 'OK', buildFinancialDashboard_(payload));
      case 'cash_closing_summary':
        requirePermission_(session, 'cash.read');
        return jsonResponse_(true, 'OK', buildCashClosingSummary_(payload));
      case 'cash_book_report':
        requirePermission_(session, 'cash.read');
        return jsonResponse_(true, 'OK', buildCashBookReport_(payload));
      case 'cash_closing_save':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', saveCashClosing_(payload, session.username));
      case 'cash_closings_list':
        requirePermission_(session, 'cash.read');
        return jsonResponse_(true, 'OK', { items: listCashClosings_(payload) });
      case 'cash_movements_list':
        requirePermission_(session, 'cash.read');
        return jsonResponse_(true, 'OK', { items: listCashMovements_(payload).map(sanitizeCashMovement_) });
      case 'cash_movement_save':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', saveCashMovement_(payload, session.username));
      case 'cash_movement_delete':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', deleteCashMovement_(payload.id, session.username));
      case 'payables_list':
        requirePermission_(session, 'cash.read');
        return jsonResponse_(true, 'OK', { items: listPayables_(payload).map(sanitizePayable_) });
      case 'payable_save':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', savePayable_(payload, session.username));
      case 'payable_mark_paid':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', markPayablePaid_(payload, session.username));
      case 'payable_delete':
        requirePermission_(session, 'cash.close');
        return jsonResponse_(true, 'OK', deletePayable_(payload.id, session.username));
      case 'events_list':
        requirePermission_(session, 'events.read');
        return jsonResponse_(true, 'OK', { items: listEvents_(payload) });
      case 'event_save':
        requirePermission_(session, 'events.manage');
        return jsonResponse_(true, 'OK', saveEvent_(payload, session.username));
      case 'announcements_list':
        requirePermission_(session, 'announcements.read');
        return jsonResponse_(true, 'OK', { items: listAnnouncements_(payload) });
      case 'announcement_save':
        requirePermission_(session, 'announcements.manage');
        return jsonResponse_(true, 'OK', saveAnnouncement_(payload, session.username));
      case 'catalog_list':
        requirePermission_(session, 'catalog.read');
        return jsonResponse_(true, 'OK', { items: listCatalogEntries_(payload) });
      case 'catalog_save':
        requirePermission_(session, 'catalog.manage');
        return jsonResponse_(true, 'OK', saveCatalogEntry_(payload, session.username));
      case 'requests_list':
        requirePermission_(session, 'requests.read');
        return jsonResponse_(true, 'OK', { items: listRequests_(payload) });
      case 'request_update':
        requirePermission_(session, 'requests.manage');
        return jsonResponse_(true, 'OK', updateRequest_(payload, session.username));
      case 'receipt_issue':
        requirePermission_(session, 'documents.issue');
        return jsonResponse_(true, 'OK', issueReceipt_(payload.dueId, session.username));
      case 'member_declaration':
        requirePermission_(session, 'documents.issue');
        return jsonResponse_(true, 'OK', issueMemberDeclaration_(payload.memberId, session.username));
      case 'member_profile_pdf':
        requirePermission_(session, 'documents.issue');
        return jsonResponse_(true, 'OK', issueMemberFicha_(payload.memberId, session.username));
      case 'annual_clearance_issue':
        requirePermission_(session, 'documents.issue');
        return jsonResponse_(true, 'OK', issueAnnualClearance_(payload.memberId, payload.ano, session.username));
      case 'documents_list':
        requirePermission_(session, 'documents.read');
        return jsonResponse_(true, 'OK', { items: listDocuments_(payload) });
      case 'document_download':
        requirePermission_(session, 'documents.read');
        return jsonResponse_(true, 'OK', downloadDocument_(payload.documentId));
      case 'attachments_list':
        requirePermission_(session, 'attachments.read');
        return jsonResponse_(true, 'OK', { items: listAttachments_(payload) });
      case 'attachment_upload':
        requirePermission_(session, 'attachments.write');
        return jsonResponse_(true, 'OK', uploadAttachment_(payload, session.username));
      case 'attachment_download':
        requirePermission_(session, 'attachments.read');
        return jsonResponse_(true, 'OK', downloadAttachment_(payload.attachmentId));
      case 'audit_logs':
        requirePermission_(session, 'audit.read');
        return jsonResponse_(true, 'OK', { items: listAuditLogs_(payload.limit) });
      case 'export_csv':
        return jsonResponse_(true, 'OK', exportCsv_(payload, session));
      case 'users_list':
        requirePermission_(session, 'users.manage');
        return jsonResponse_(true, 'OK', { items: listUsers_() });
      case 'user_save':
        requirePermission_(session, 'users.manage');
        return jsonResponse_(true, 'OK', saveUser_(payload, session.username));
      case 'user_toggle_status':
        requirePermission_(session, 'users.manage');
        return jsonResponse_(true, 'OK', toggleUserStatus_(payload.id, session.username));
      case 'change_password':
        requirePermission_(session, 'password.change');
        return jsonResponse_(true, 'OK', changePassword_(session, payload));
      case 'demo_seed_data':
      case 'demoseeddata':
        requirePermission_(session, 'users.manage');
        return jsonResponse_(true, 'OK', demoSeedData_(payload, session.username));
      case 'demo_clear_data':
      case 'democleardata':
        requirePermission_(session, 'users.manage');
        return jsonResponse_(true, 'OK', demoClearData_(payload, session.username));
      default:
        throw new Error('Ação inválida.');
    }
  } catch (error) {
    return handleError_(error);
  }
}



function gerarDadosDemoParaApresentacao() {
  return demoSeedData_({
    confirmation: 'CRIAR_DADOS_DEMO',
    count: 300
  }, 'system');
}

function apagarDadosDemoDepoisApresentacao() {
  return demoClearData_({
    confirmation: 'APAGAR_DADOS_DEMO'
  }, 'system');
}

function demoSeedData_(payload, username) {
  payload = payload || {};
  var confirmation = String(payload.confirmation || '').trim().toUpperCase();
  var count = Math.max(1, Math.min(Number(payload.count || 300), 1000));
  var lock = LockService.getScriptLock();

  if (confirmation !== 'CRIAR_DADOS_DEMO' && confirmation !== 'GERAR_DADOS_DEMO') {
    throw new Error('Confirme a geração enviando confirmation = CRIAR_DADOS_DEMO.');
  }

  lock.waitLock(30000);

  try {
    ensureAllSheets_();
    demoClearOperationalData_();

    var now = new Date();
    var nowIso = now.toISOString();
    var members = buildDemoMembers_(count, nowIso);
    var activeMembers = members.filter(function (member) {
      return member.status === 'ATIVO';
    });
    var dues = buildDemoDues_(activeMembers, now, nowIso);
    var cashMovements = buildDemoCashMovements_(now, nowIso, username);
    var payables = buildDemoPayables_(now, nowIso, username);
    var events = buildDemoEvents_(now, nowIso, username);
    var announcements = buildDemoAnnouncements_(now, nowIso, username);
    var catalogEntries = buildDemoCatalog_(activeMembers, nowIso, username);
    var requests = buildDemoRequests_(activeMembers, now, nowIso);
    var closings = buildDemoCashClosings_(dues, cashMovements, payables, now, nowIso, username);

    replaceSheetBody_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS, members.map(serializeMember_));
    replaceSheetBody_(SIND_SHEETS.DUES, DUE_HEADERS, dues.map(serializeDue_));
    replaceSheetBody_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS, cashMovements.map(serializeCashMovement_));
    replaceSheetBody_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS, payables.map(serializePayable_));
    replaceSheetBody_(SIND_SHEETS.EVENTS, EVENT_HEADERS, events.map(serializeEvent_));
    replaceSheetBody_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS, announcements.map(serializeAnnouncement_));
    replaceSheetBody_(SIND_SHEETS.CATALOG, CATALOG_HEADERS, catalogEntries.map(serializeCatalogEntry_));
    replaceSheetBody_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS, requests.map(serializeRequest_));
    replaceSheetBody_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS, closings.map(serializeCashClosing_));

    seedAuditLog_(
      'DEMO_SEED_DATA',
      'demo',
      'DEMO_DATA',
      'Dados fictícios gerados: ' + count + ' associados, ' + dues.length + ' mensalidades, ' + events.length + ' eventos, ' + announcements.length + ' avisos, ' + requests.length + ' protocolos.',
      username
    );

    return {
      ok: true,
      members: members.length,
      dues: dues.length,
      cashMovements: cashMovements.length,
      payables: payables.length,
      cashClosings: closings.length,
      events: events.length,
      announcements: announcements.length,
      catalogEntries: catalogEntries.length,
      requests: requests.length,
      note: 'Dados fictícios gerados com sucesso.'
    };
  } finally {
    lock.releaseLock();
  }
}

function demoClearData_(payload, username) {
  payload = payload || {};
  var confirmation = String(payload.confirmation || '').trim().toUpperCase();
  var lock = LockService.getScriptLock();

  if (confirmation !== 'APAGAR_DADOS_DEMO' && confirmation !== 'LIMPAR_DADOS_DEMO') {
    throw new Error('Confirme a limpeza enviando confirmation = APAGAR_DADOS_DEMO.');
  }

  lock.waitLock(30000);

  try {
    ensureAllSheets_();
    var counts = countOperationalRows_();
    demoClearOperationalData_();

    seedAuditLog_(
      'DEMO_CLEAR_DATA',
      'demo',
      'DEMO_DATA',
      'Dados operacionais removidos para nova demonstração.',
      username
    );

    counts.ok = true;
    counts.note = 'Dados operacionais removidos com sucesso. Usuários e configurações foram preservados.';
    return counts;
  } finally {
    lock.releaseLock();
  }
}

function demoClearOperationalData_() {
  clearDemoSheet_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
  clearDemoSheet_(SIND_SHEETS.DUES, DUE_HEADERS);
  clearDemoSheet_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  clearDemoSheet_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS);
  clearDemoSheet_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS);
  clearDemoSheet_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS);
  clearDemoSheet_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS);
  clearDemoSheet_(SIND_SHEETS.EVENTS, EVENT_HEADERS);
  clearDemoSheet_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS);
  clearDemoSheet_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
  clearDemoSheet_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
  clearDemoSheet_(SIND_SHEETS.AUDIT, AUDIT_HEADERS);
}

function clearDemoSheet_(sheetName, headers) {
  var sheet = ensureSheet_(sheetName, headers);
  clearSheetBody_(sheet);
}

function replaceSheetBody_(sheetName, headers, rows) {
  var sheet = ensureSheet_(sheetName, headers);
  clearSheetBody_(sheet);

  if (rows && rows.length) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function countOperationalRows_() {
  return {
    members: countSheetBodyRows_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS),
    dues: countSheetBodyRows_(SIND_SHEETS.DUES, DUE_HEADERS),
    documents: countSheetBodyRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS),
    attachments: countSheetBodyRows_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS),
    cashClosings: countSheetBodyRows_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS),
    cashMovements: countSheetBodyRows_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS),
    payables: countSheetBodyRows_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS),
    events: countSheetBodyRows_(SIND_SHEETS.EVENTS, EVENT_HEADERS),
    announcements: countSheetBodyRows_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS),
    catalogEntries: countSheetBodyRows_(SIND_SHEETS.CATALOG, CATALOG_HEADERS),
    requests: countSheetBodyRows_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS),
    auditLogs: countSheetBodyRows_(SIND_SHEETS.AUDIT, AUDIT_HEADERS)
  };
}

function countSheetBodyRows_(sheetName, headers) {
  var sheet = ensureSheet_(sheetName, headers);
  return Math.max(0, sheet.getLastRow() - 1);
}

function buildDemoMembers_(count, nowIso) {
  var firstNames = [
    'Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Fernando', 'Gabriela', 'Henrique',
    'Isabela', 'João', 'Larissa', 'Marcelo', 'Natália', 'Otávio', 'Patrícia', 'Rafael',
    'Simone', 'Tiago', 'Vanessa', 'Wagner', 'Mariana', 'Gustavo', 'Priscila', 'Renato'
  ];
  var lastNames = [
    'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Rodrigues', 'Almeida',
    'Nascimento', 'Lima', 'Ferreira', 'Gomes', 'Ribeiro', 'Martins', 'Carvalho', 'Mendes'
  ];
  var businessPrefixes = [
    'Mercado', 'Padaria', 'Farmácia', 'Loja', 'Boutique', 'Auto Peças', 'Papelaria',
    'Restaurante', 'Lanchonete', 'Clínica', 'Studio', 'Oficina', 'Distribuidora',
    'Construtora', 'Contabilidade', 'Informática', 'Pet Shop', 'Academia'
  ];
  var businessSuffixes = [
    'Central', 'Popular', 'Além Paraíba', 'São José', 'Imperial', 'União', 'Comercial',
    'Progresso', 'Mineira', 'Paraibana', 'Familiar', 'Premium', 'Nova Era', 'Real'
  ];
  var cargos = [
    'Proprietário(a)', 'Sócio(a)-administrador(a)', 'Gerente', 'Diretor(a)', 'Responsável legal'
  ];
  var bairros = [
    'Centro', 'Porto Novo', 'Vila Laroca', 'Santa Rosa', 'São José', 'Jardim Paraíso',
    'Ilha Recreio', 'Morro da Conceição', 'Terra do Santo', 'Vila Caxias'
  ];
  var categories = [
    'Comércio varejista', 'Alimentação', 'Saúde', 'Serviços', 'Educação',
    'Construção', 'Tecnologia', 'Beleza', 'Automotivo', 'Moda'
  ];
  var members = [];

  for (var index = 1; index <= count; index += 1) {
    var firstName = firstNames[(index - 1) % firstNames.length];
    var lastName = lastNames[(index * 3) % lastNames.length];
    var secondLastName = lastNames[(index * 7) % lastNames.length];
    var prefix = businessPrefixes[(index - 1) % businessPrefixes.length];
    var suffix = businessSuffixes[(index * 5) % businessSuffixes.length];
    var status = index % 17 === 0 ? 'INATIVO' : 'ATIVO';
    var documentValue = String(30000000000 + index);
    var phone = String(32990000000 + index);
    var day = pad2_(((index - 1) % 28) + 1);
    var month = pad2_(((index - 1) % 12) + 1);
    var category = categories[(index - 1) % categories.length];

    members.push({
      id: 'DEMO_MEM_' + padNumber_(index, 4),
      nome: firstName + ' ' + lastName + ' ' + secondLastName,
      cpf: documentValue,
      rg: 'MG-' + padNumber_(4000000 + index, 7),
      dataNascimento: (1975 + (index % 25)) + '-' + month + '-' + day,
      email: 'associado' + padNumber_(index, 3) + '@demo-aceap.com.br',
      telefone: phone,
      endereco: 'Rua Demonstrativa, ' + (100 + index),
      bairro: bairros[(index - 1) % bairros.length],
      cidade: 'Além Paraíba',
      uf: 'MG',
      cep: String(36660000 + (index % 900)),
      empresa: prefix + ' ' + suffix + ' ' + padNumber_(index, 3),
      cargo: cargos[(index - 1) % cargos.length],
      dataAdmissao: (2015 + (index % 9)) + '-' + month + '-' + day,
      dataFiliacao: (2018 + (index % 7)) + '-' + month + '-' + day,
      status: status,
      observacoes: '[DEMO_DATA] Categoria: ' + category + '. Registro fictício para apresentação.',
      createdAt: nowIso,
      updatedAt: nowIso,
      portalAccessEnabled: 'SIM',
      portalPasswordHash: '',
      portalMustChangePassword: 'NAO',
      portalLastLoginAt: ''
    });
  }

  return members;
}

function buildDemoDues_(members, baseDate, nowIso) {
  var dues = [];
  var currentYear = baseDate.getFullYear();
  var currentMonth = baseDate.getMonth() + 1;
  var methods = ['PIX', 'DINHEIRO', 'BOLETO', 'CARTAO', 'TRANSFERENCIA'];

  members.forEach(function (member, memberIndex) {
    for (var month = 1; month <= 12; month += 1) {
      var competencia = currentYear + '-' + pad2_(month);
      var vencimento = competencia + '-10';
      var valor = 45 + ((memberIndex % 6) * 5);
      var paidChance = (memberIndex + month) % 10;
      var status = 'ABERTA';
      var pagoEm = '';
      var formaPagamento = '';

      if (month < currentMonth) {
        if (paidChance <= 7) {
          status = 'PAGA';
          pagoEm = competencia + '-' + pad2_(11 + ((memberIndex + month) % 12));
          formaPagamento = methods[(memberIndex + month) % methods.length];
        } else {
          status = 'ABERTA';
        }
      } else if (month === currentMonth) {
        if (paidChance <= 4) {
          status = 'PAGA';
          pagoEm = competencia + '-' + pad2_(Math.min(9, baseDate.getDate()));
          formaPagamento = methods[(memberIndex + month) % methods.length];
        }
      }

      dues.push({
        id: 'DEMO_DUE_' + padNumber_(dues.length + 1, 6),
        memberId: member.id,
        memberNome: member.nome,
        memberCpf: member.cpf,
        competencia: competencia,
        valor: valor,
        vencimento: vencimento,
        pagoEm: pagoEm,
        formaPagamento: formaPagamento,
        status: status,
        observacoes: '[DEMO_DATA] Mensalidade fictícia para demonstração.',
        createdAt: nowIso,
        updatedAt: nowIso
      });
    }
  });

  return dues;
}

function buildDemoCashMovements_(baseDate, nowIso, username) {
  var rows = [];
  var year = baseDate.getFullYear();
  var entradaCategories = ['Patrocínio', 'Inscrição em evento', 'Locação de espaço', 'Serviço administrativo'];
  var saidaFixaCategories = ['Aluguel', 'Energia elétrica', 'Internet', 'Sistema', 'Contabilidade'];
  var saidaVariavelCategories = ['Material de escritório', 'Coffee break', 'Manutenção', 'Divulgação', 'Apoio a evento'];
  var methods = ['PIX', 'DINHEIRO', 'BOLETO', 'CARTAO', 'TRANSFERENCIA'];

  for (var month = 1; month <= 12; month += 1) {
    var competencia = year + '-' + pad2_(month);

    rows.push({
      id: 'DEMO_MOV_' + padNumber_(rows.length + 1, 5),
      tipo: 'ENTRADA',
      classificacao: 'ENTRADA',
      data: competencia + '-05',
      competencia: competencia,
      categoria: entradaCategories[month % entradaCategories.length],
      descricao: '[DEMO_DATA] Receita complementar demonstrativa ' + formatCompetenciaBr_(competencia),
      formaPagamento: methods[month % methods.length],
      valor: 600 + (month * 35),
      observacoes: '[DEMO_DATA]',
      createdBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });

    rows.push({
      id: 'DEMO_MOV_' + padNumber_(rows.length + 1, 5),
      tipo: 'SAIDA',
      classificacao: 'FIXA',
      data: competencia + '-08',
      competencia: competencia,
      categoria: saidaFixaCategories[month % saidaFixaCategories.length],
      descricao: '[DEMO_DATA] Despesa fixa demonstrativa ' + formatCompetenciaBr_(competencia),
      formaPagamento: methods[(month + 1) % methods.length],
      valor: 280 + (month * 12),
      observacoes: '[DEMO_DATA]',
      createdBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });

    rows.push({
      id: 'DEMO_MOV_' + padNumber_(rows.length + 1, 5),
      tipo: 'SAIDA',
      classificacao: 'VARIAVEL',
      data: competencia + '-18',
      competencia: competencia,
      categoria: saidaVariavelCategories[month % saidaVariavelCategories.length],
      descricao: '[DEMO_DATA] Despesa variável demonstrativa ' + formatCompetenciaBr_(competencia),
      formaPagamento: methods[(month + 2) % methods.length],
      valor: 150 + (month * 9),
      observacoes: '[DEMO_DATA]',
      createdBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  return rows;
}

function buildDemoPayables_(baseDate, nowIso, username) {
  var rows = [];
  var year = baseDate.getFullYear();
  var fornecedores = ['Energia Minas', 'Internet Fibra', 'Contabilidade Parceira', 'Gráfica Central', 'Fornecedor Eventos'];
  var categorias = ['Energia', 'Internet', 'Serviços contábeis', 'Material gráfico', 'Eventos'];
  var methods = ['PIX', 'BOLETO', 'TRANSFERENCIA'];

  for (var month = 1; month <= 12; month += 1) {
    for (var item = 0; item < 2; item += 1) {
      var competencia = year + '-' + pad2_(month);
      var paid = month < (baseDate.getMonth() + 1) && ((month + item) % 3 !== 0);

      rows.push({
        id: 'DEMO_PAY_' + padNumber_(rows.length + 1, 5),
        descricao: '[DEMO_DATA] Conta demonstrativa ' + (item + 1) + ' - ' + formatCompetenciaBr_(competencia),
        fornecedor: fornecedores[(month + item) % fornecedores.length],
        classificacao: item === 0 ? 'FIXA' : 'VARIAVEL',
        categoria: categorias[(month + item) % categorias.length],
        valor: 180 + (month * 14) + (item * 95),
        vencimento: competencia + '-' + pad2_(10 + item * 10),
        competencia: competencia,
        status: paid ? 'PAGA' : 'PENDENTE',
        pagoEm: paid ? competencia + '-' + pad2_(11 + item * 8) : '',
        formaPagamento: paid ? methods[(month + item) % methods.length] : '',
        observacoes: '[DEMO_DATA]',
        createdBy: username,
        createdAt: nowIso,
        updatedAt: nowIso,
        paidBy: paid ? username : '',
        paidAt: paid ? nowIso : ''
      });
    }
  }

  return rows;
}

function buildDemoEvents_(baseDate, nowIso, username) {
  var rows = [];
  var year = baseDate.getFullYear();
  var titles = [
    'Palestra de Vendas para o Comércio Local',
    'Workshop de Atendimento ao Cliente',
    'Encontro Empresarial ACEAP',
    'Café com Empresários',
    'Curso de Marketing Digital',
    'Rodada de Negócios',
    'Reunião com Associados',
    'Capacitação em Gestão Financeira',
    'Semana do Comércio Local',
    'Treinamento para Vitrines e Promoções'
  ];
  var types = ['PALESTRA', 'CURSO', 'REUNIAO', 'EVENTO'];
  var places = ['Auditório ACEAP', 'Sede ACEAP', 'Centro Empresarial', 'Salão de Eventos Parceiro'];

  for (var index = 1; index <= 20; index += 1) {
    var month = ((baseDate.getMonth() + index) % 12) + 1;
    var day = pad2_(((index * 3) % 24) + 3);

    rows.push({
      id: 'DEMO_EVT_' + padNumber_(index, 4),
      title: titles[(index - 1) % titles.length],
      type: types[(index - 1) % types.length],
      date: year + '-' + pad2_(month) + '-' + day,
      time: pad2_(8 + (index % 10)) + ':00',
      place: places[(index - 1) % places.length],
      description: '[DEMO_DATA] Evento fictício para demonstração do calendário da ACEAP.',
      capacity: 25 + (index * 5),
      status: index % 9 === 0 ? 'ENCERRADO' : 'ATIVO',
      visibleInPortal: index % 9 === 0 ? 'NAO' : 'SIM',
      createdBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  return rows;
}

function buildDemoAnnouncements_(baseDate, nowIso, username) {
  var rows = [];
  var year = baseDate.getFullYear();
  var month = pad2_(baseDate.getMonth() + 1);
  var titles = [
    'Campanha de valorização do comércio local',
    'Novo horário de atendimento da ACEAP',
    'Convite para reunião com associados',
    'Inscrições abertas para capacitação',
    'Atualização cadastral dos associados',
    'Comunicado sobre mensalidades',
    'Oportunidade para empresas associadas',
    'Ação especial para datas comemorativas',
    'Parceria institucional disponível',
    'Aviso de manutenção no atendimento'
  ];

  titles.forEach(function (title, index) {
    rows.push({
      id: 'DEMO_AVI_' + padNumber_(index + 1, 4),
      title: title,
      message: '[DEMO_DATA] Comunicado fictício para demonstrar o quadro de avisos do portal do associado.',
      audience: index % 3 === 0 ? 'TODOS' : 'ASSOCIADOS_ATIVOS',
      status: index % 10 === 0 ? 'ARQUIVADO' : 'ATIVO',
      pinned: index < 3 ? 'SIM' : 'NAO',
      visibleInPortal: index % 10 === 0 ? 'NAO' : 'SIM',
      publishedAt: year + '-' + month + '-' + pad2_(Math.min(25, index + 1)),
      expiresAt: year + '-12-31',
      createdBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  });

  return rows;
}

function buildDemoCatalog_(members, nowIso, username) {
  var rows = [];
  var categories = [
    'Alimentação', 'Moda', 'Saúde', 'Serviços', 'Automotivo', 'Tecnologia',
    'Educação', 'Beleza', 'Construção', 'Comércio varejista'
  ];

  members.slice(0, Math.min(120, members.length)).forEach(function (member, index) {
    rows.push({
      id: 'DEMO_CAT_' + padNumber_(index + 1, 4),
      memberId: member.id,
      publicName: member.empresa || member.nome,
      category: categories[index % categories.length],
      description: '[DEMO_DATA] Empresa participante do catálogo público demonstrativo da ACEAP.',
      whatsapp: member.telefone,
      instagram: '@empresa_demo_' + padNumber_(index + 1, 3),
      address: member.endereco + ' - ' + member.bairro + ', ' + member.cidade + '/' + member.uf,
      visible: 'SIM',
      highlight: index < 12 ? 'SIM' : 'NAO',
      updatedBy: username,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  });

  return rows;
}

function buildDemoRequests_(members, baseDate, nowIso) {
  var rows = [];
  var types = ['ATUALIZACAO_CADASTRAL', 'DECLARACAO', 'SEGUNDA_VIA', 'SUPORTE', 'CATALOGO', 'OUTRO'];
  var statuses = ['ABERTA', 'EM_ANALISE', 'AGUARDANDO_ASSOCIADO', 'CONCLUIDA', 'CANCELADA'];
  var messages = [
    'Solicito atualização dos meus dados cadastrais.',
    'Preciso de uma declaração para apresentar ao banco.',
    'Gostaria de receber uma segunda via de recibo.',
    'Tenho uma dúvida sobre minha situação associativa.',
    'Solicito inclusão da minha empresa no catálogo público.'
  ];
  var year = baseDate.getFullYear();

  members.slice(0, Math.min(80, members.length)).forEach(function (member, index) {
    var status = statuses[index % statuses.length];
    var month = pad2_(((index + 1) % 12) + 1);
    var day = pad2_(((index * 2) % 25) + 1);

    rows.push({
      id: 'DEMO_REQ_' + padNumber_(index + 1, 5),
      protocol: 'ACEAP-' + year + '-' + padNumber_(index + 1, 6),
      memberId: member.id,
      memberName: member.nome,
      type: types[index % types.length],
      message: '[DEMO_DATA] ' + messages[index % messages.length],
      status: status,
      response: status === 'CONCLUIDA' ? 'Solicitação concluída pela equipe ACEAP.' : '',
      internalNote: '[DEMO_DATA] Protocolo fictício para apresentação.',
      createdBy: 'PORTAL',
      createdAt: year + '-' + month + '-' + day + 'T09:00:00.000Z',
      updatedAt: nowIso,
      closedAt: status === 'CONCLUIDA' || status === 'CANCELADA' ? nowIso : ''
    });
  });

  return rows;
}

function buildDemoCashClosings_(dues, cashMovements, payables, baseDate, nowIso, username) {
  var rows = [];
  var year = baseDate.getFullYear();
  var currentMonth = baseDate.getMonth() + 1;

  for (var month = 1; month <= Math.min(currentMonth, 12); month += 1) {
    var competencia = year + '-' + pad2_(month);
    var paidDues = dues.filter(function (due) {
      return due.status === 'PAGA' && due.pagoEm && String(due.pagoEm).slice(0, 7) === competencia;
    });
    var movements = cashMovements.filter(function (movement) {
      return movement.competencia === competencia;
    });
    var monthPayables = payables.filter(function (payable) {
      return payable.competencia === competencia && payable.status === 'PAGA';
    });
    var totalPaidDues = paidDues.reduce(function (sum, due) {
      return sum + Number(due.valor || 0);
    }, 0);
    var manualEntradas = movements.filter(function (movement) {
      return movement.tipo === 'ENTRADA';
    }).reduce(function (sum, movement) {
      return sum + Number(movement.valor || 0);
    }, 0);
    var saidasFixas = movements.filter(function (movement) {
      return movement.tipo === 'SAIDA' && movement.classificacao === 'FIXA';
    }).reduce(function (sum, movement) {
      return sum + Number(movement.valor || 0);
    }, 0);
    var saidasVariaveis = movements.filter(function (movement) {
      return movement.tipo === 'SAIDA' && movement.classificacao === 'VARIAVEL';
    }).reduce(function (sum, movement) {
      return sum + Number(movement.valor || 0);
    }, 0);
    var payablePaid = monthPayables.reduce(function (sum, payable) {
      return sum + Number(payable.valor || 0);
    }, 0);
    var totalSaidas = saidasFixas + saidasVariaveis + payablePaid;
    var totalsByMethod = buildDemoPaymentMethodTotals_(paidDues);

    rows.push({
      id: 'DEMO_CLOSE_' + padNumber_(month, 4),
      tipo: 'MENSAL',
      periodoInicio: competencia + '-01',
      periodoFim: lastDayOfMonthStr_(competencia),
      competencia: competencia,
      totalRecebido: round2_(totalPaidDues),
      quantidadePagamentos: paidDues.length,
      pix: totalsByMethod.PIX,
      dinheiro: totalsByMethod.DINHEIRO,
      boleto: totalsByMethod.BOLETO,
      cartao: totalsByMethod.CARTAO,
      transferencia: totalsByMethod.TRANSFERENCIA,
      outro: totalsByMethod.OUTRO,
      observacoes: '[DEMO_DATA] Fechamento mensal fictício para apresentação.',
      closedBy: username,
      closedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      manualEntradas: round2_(manualEntradas),
      totalEntradas: round2_(totalPaidDues + manualEntradas),
      saidasFixas: round2_(saidasFixas + payablePaid),
      saidasVariaveis: round2_(saidasVariaveis),
      totalSaidas: round2_(totalSaidas),
      saldoPeriodo: round2_(totalPaidDues + manualEntradas - totalSaidas)
    });
  }

  return rows;
}

function buildDemoPaymentMethodTotals_(paidDues) {
  var totals = {
    PIX: 0,
    DINHEIRO: 0,
    BOLETO: 0,
    CARTAO: 0,
    TRANSFERENCIA: 0,
    OUTRO: 0
  };

  paidDues.forEach(function (due) {
    var method = normalizePaymentMethod_(due.formaPagamento);
    totals[method] += Number(due.valor || 0);
  });

  Object.keys(totals).forEach(function (key) {
    totals[key] = round2_(totals[key]);
  });

  return totals;
}

function padNumber_(value, size) {
  var text = String(value);
  while (text.length < size) {
    text = '0' + text;
  }
  return text;
}

function pad2_(value) {
  return padNumber_(value, 2);
}

function createOrResolveSpreadsheetForSetup_() {
  var active = SIND_SETUP.USE_ACTIVE_SPREADSHEET ? SpreadsheetApp.getActiveSpreadsheet() : null;
  var providedId = String(SIND_SETUP.SPREADSHEET_ID || '').trim();
  var spreadsheetName = String(SIND_SETUP.SPREADSHEET_NAME || 'db_sind').trim() || 'db_sind';

  if (active) {
    return active;
  }

  if (providedId && providedId.indexOf('COLE_AQUI') < 0) {
    return SpreadsheetApp.openById(providedId);
  }

  var spreadsheet = SpreadsheetApp.create(spreadsheetName);
  return spreadsheet;
}

function setupInitialProject_() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheet = createOrResolveSpreadsheetForSetup_();
  var spreadsheetId = spreadsheet.getId();
  var spreadsheetName = String(SIND_SETUP.SPREADSHEET_NAME || 'db_sind').trim();

  if (spreadsheetName && spreadsheet.getName() !== spreadsheetName) {
    spreadsheet.rename(spreadsheetName);
  }

  props.setProperty(SIND_SECURITY.PROP_SPREADSHEET_ID, spreadsheetId);
  props.setProperty(SIND_SECURITY.PROP_UNION_NAME, String(SIND_SETUP.UNION_NAME || 'ACEAP').trim());

  if (String(SIND_SETUP.PDF_FOLDER_ID || '').trim()) {
    props.setProperty(SIND_SECURITY.PROP_PDF_FOLDER_ID, String(SIND_SETUP.PDF_FOLDER_ID || '').trim());
  }

  ensureAllSheets_();
  ensurePdfFolder_();
  writeConfigSheet_();
  seedDefaultAdminUser_();
  seedAuditLog_('SETUP', 'config', spreadsheetId, 'Projeto inicial configurado', 'system');
}

function setupPlanilhaNoMesmoSheets() {
  setupInitialProject_();
  return 'Planilha configurada no mesmo Google Sheets do projeto.';
}

function buildBootstrap_(session) {
  var unionName = getUnionName_();
  var month = currentMonth_();
  var members = hasPermission_(session, 'members.read') ? listMembers_({}) : [];
  var report = hasPermission_(session, 'reports.read') ? buildMonthlyReport_(month) : {
    itens: [],
    totalPago: 0,
    totalAtrasado: 0
  };

  return {
    username: session.username,
    userId: session.userId,
    displayName: session.nome,
    role: session.role,
    permissions: session.permissions,
    currentCompetencia: month,
    unionName: unionName,
    availableRoles: Object.keys(PERMISSION_GROUPS),
    documentTypes: [
      DOCUMENT_TYPES.AFFILIATION,
      DOCUMENT_TYPES.MEMBER_FORM,
      DOCUMENT_TYPES.ANNUAL_CLEARANCE
    ],
    stats: {
      activeMembers: members.filter(function (item) { return item.status === 'ATIVO'; }).length,
      monthlyDues: report.itens.length,
      totalPaid: report.totalPago,
      totalLate: report.totalAtrasado
    }
  };
}

function login_(payload) {
  var username = String(payload.username || '').trim();
  var password = String(payload.password || '');

  if (!username || !password) {
    throw new Error('Informe usuário e senha.');
  }

  var user = findUserByUsername_(username);

  if (!user || user.status !== 'ATIVO' || user.passwordHash !== sha256_(password)) {
    throw new Error('Usuário ou senha inválidos.');
  }

  var token = generateId_();
  var session = {
    userId: user.id,
    username: user.username,
    nome: user.nome,
    role: user.role,
    permissions: permissionsForRole_(user.role),
    createdAt: new Date().toISOString()
  };

  CacheService.getScriptCache().put(
    SIND_SECURITY.SESSION_PREFIX + token,
    JSON.stringify(session),
    60 * 60 * 6
  );

  seedAuditLog_('LOGIN', 'session', token, 'Login efetuado', user.username);

  return {
    sessionToken: token,
    username: user.username,
    displayName: user.nome,
    role: user.role,
    permissions: session.permissions
  };
}

function logout_(sessionToken) {
  if (sessionToken) {
    CacheService.getScriptCache().remove(SIND_SECURITY.SESSION_PREFIX + sessionToken);
  }
  return { ok: true };
}

function portalLogin_(payload) {
  var documentValue = digitsOnly_(payload.document || payload.cpf || payload.cnpj || '');
  var password = String(payload.password || '');

  if (!documentValue || !password) {
    throw new Error('Informe CPF/CNPJ e senha.');
  }

  var member = findMemberByDocument_(documentValue);

  if (!member) {
    throw new Error('Não encontrei associado com esse CPF/CNPJ. Confira se ele está cadastrado na aba Sindicalizados.');
  }

  if (!isPortalActiveMember_(member)) {
    throw new Error('Associado encontrado, mas o status precisa estar ATIVO para acessar o portal.');
  }

  if (String(member.portalAccessEnabled || 'SIM').toUpperCase() === 'NAO') {
    throw new Error('Acesso ao portal não habilitado para este associado.');
  }

  if (!portalPasswordMatches_(member, password, documentValue)) {
    throw new Error('CPF/CNPJ ou senha inválidos.');
  }

  var mustChangePassword = portalMustChangePassword_(member);
  var token = generateId_();
  var session = {
    memberId: member.id,
    memberCpf: member.cpf,
    memberName: member.nome,
    mustChangePassword: mustChangePassword,
    createdAt: new Date().toISOString()
  };

  CacheService.getScriptCache().put(
    SIND_SECURITY.PORTAL_SESSION_PREFIX + token,
    JSON.stringify(session),
    60 * 60 * 6
  );

  updateMemberPortalLastLogin_(member.id);
  seedAuditLog_('PORTAL_LOGIN', 'member', member.id, 'Login no portal do associado', member.nome);

  return {
    portalToken: token,
    mustChangePassword: mustChangePassword,
    bootstrap: buildPortalBootstrapForMember_(member, mustChangePassword)
  };
}

function portalLogout_(portalToken) {
  if (portalToken) {
    CacheService.getScriptCache().remove(SIND_SECURITY.PORTAL_SESSION_PREFIX + String(portalToken || '').trim());
  }
  return { ok: true };
}

function portalBootstrap_(payload) {
  var session = requirePortalSession_(payload.portalToken);
  var member = findMemberById_(session.memberId);

  if (!member || !isPortalActiveMember_(member)) {
    throw new Error('Associado não encontrado ou inativo.');
  }

  return buildPortalBootstrapForMember_(member, !!session.mustChangePassword);
}

function portalDownloadDocument_(payload) {
  var session = requirePortalSession_(payload.portalToken);
  var documentId = String(payload.documentId || '').trim();
  var documentRecord = findDocumentById_(documentId);

  if (!documentRecord || documentRecord.memberId !== session.memberId) {
    throw new Error('Documento não encontrado para este associado.');
  }

  return downloadDocument_(documentId);
}

function requirePortalSession_(portalToken) {
  var token = String(portalToken || '').trim();
  var raw;

  if (!token) {
    throw new Error('Sessão do portal inválida ou expirada.');
  }

  raw = CacheService.getScriptCache().get(SIND_SECURITY.PORTAL_SESSION_PREFIX + token);

  if (!raw) {
    throw new Error('Sessão do portal inválida ou expirada.');
  }

  return JSON.parse(raw);
}

function findMemberByDocument_(documentValue) {
  var documentDigits = digitsOnly_(documentValue);
  var rows = getSheetRows_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToMember_(row, index + 2);
    if (!found && portalDocumentMatches_(item.cpf, documentDigits)) {
      found = item;
    }
  });

  return found;
}

function portalPasswordMatches_(member, password, documentValue) {
  var passwordHash = String(member.portalPasswordHash || '').trim();

  if (passwordHash) {
    return passwordHash === sha256_(password);
  }

  return portalDocumentMatches_(password, documentValue);
}

function portalDocumentMatches_(leftValue, rightValue) {
  var leftDigits = digitsOnly_(leftValue);
  var rightDigits = digitsOnly_(rightValue);

  if (!leftDigits || !rightDigits) {
    return false;
  }

  return leftDigits === rightDigits ||
    normalizePortalDocumentKey_(leftDigits) === normalizePortalDocumentKey_(rightDigits);
}

function normalizePortalDocumentKey_(value) {
  var digits = digitsOnly_(value).replace(/^0+/, '');
  return digits || '0';
}

function isPortalActiveMember_(member) {
  var status = String((member && member.status) || 'ATIVO')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return status === 'ATIVO' || status === 'ATIVA' || status === 'ACTIVE';
}

function portalMustChangePassword_(member) {
  return String(member.portalMustChangePassword || 'SIM').toUpperCase() === 'SIM' ||
    !String(member.portalPasswordHash || '').trim();
}

function updateMemberPortalLastLogin_(memberId) {
  var member = findMemberById_(memberId);

  if (!member || !member.rowNumber) {
    return;
  }

  member.portalLastLoginAt = new Date().toISOString();
  ensureSheet_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS)
    .getRange(member.rowNumber, 1, 1, MEMBER_HEADERS.length)
    .setValues([serializeMember_(member)]);
}

function buildPortalBootstrapForMember_(member, mustChangePassword) {
  var dues = listDues_({ memberId: member.id });
  var documents = listDocuments_({ memberId: member.id });
  var receipts = buildPortalReceipts_(dues, documents);
  var portalDocuments = documents.filter(function (documentRecord) {
    return documentRecord.tipo !== DOCUMENT_TYPES.RECEIPT;
  }).map(portalDocumentItem_);

  return {
    profile: portalProfile_(member, mustChangePassword),
    summary: portalSummary_(member, dues, receipts),
    dues: dues.map(portalDueItem_),
    receipts: receipts,
    documents: portalDocuments,
    events: portalEvents_(),
    announcements: portalAnnouncements_(member),
    requests: portalListRequestsForMember_(member.id),
    card: portalCard_(member)
  };
}

function portalProfile_(member, mustChangePassword) {
  var companyName = String(member.empresa || member.nome || 'Associado').trim();

  return {
    id: member.id,
    companyName: companyName,
    tradeName: companyName,
    document: formatDocumentBr_(member.cpf),
    responsible: member.nome || '-',
    whatsapp: formatPhoneBr_(member.telefone),
    email: member.email || '-',
    category: member.cargo || 'Associado',
    joinDate: formatDateBr_(member.dataFiliacao),
    status: statusLabel_(member.status),
    rawStatus: member.status || '',
    mustChangePassword: !!mustChangePassword
  };
}

function portalCard_(member) {
  var currentYear = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy');
  var profile = portalProfile_(member, portalMustChangePassword_(member));

  return {
    companyName: profile.companyName,
    document: profile.document,
    status: profile.status,
    validity: '31/12/' + currentYear
  };
}

function portalSummary_(member, dues, receipts) {
  var activeDues = dues.filter(function (due) {
    var status = resolveDueStatus_(due);
    return status !== 'PAGA' && status !== 'CANCELADA';
  });
  var nextDue = activeDues.slice().sort(function (a, b) {
    return String(a.vencimento || '').localeCompare(String(b.vencimento || ''));
  })[0];

  return {
    openDues: activeDues.length,
    nextDue: nextDue ? formatDateBr_(nextDue.vencimento) : '-',
    lastReceipt: receipts.length ? receipts[0].competence : '-',
    cardStatus: String(member.status || '') === 'ATIVO' ? 'Ativa' : 'Indisponível'
  };
}

function portalDueItem_(due) {
  var status = resolveDueStatus_(due);

  return {
    id: due.id,
    competence: formatCompetenciaBr_(due.competencia),
    dueDate: formatDateBr_(due.vencimento),
    value: due.valor,
    status: statusLabel_(status),
    action: portalDueActionLabel_(status)
  };
}

function buildPortalReceipts_(dues, documents) {
  var dueById = {};
  var dueByCompetence = {};

  dues.forEach(function (due) {
    dueById[due.id] = due;
    dueByCompetence[due.competencia] = due;
  });

  return documents.filter(function (documentRecord) {
    return documentRecord.tipo === DOCUMENT_TYPES.RECEIPT;
  }).map(function (documentRecord) {
    var due = dueById[documentRecord.dueId] || dueByCompetence[documentRecord.competencia] || {};
    return {
      id: documentRecord.id,
      documentId: documentRecord.id,
      number: documentRecord.numero || '-',
      date: formatDateBr_(String(documentRecord.createdAt || '').slice(0, 10)),
      competence: formatCompetenciaBr_(documentRecord.competencia || due.competencia),
      value: due.valor || 0,
      status: 'Disponível',
      canDownload: true
    };
  });
}

function portalDocumentItem_(documentRecord) {
  return {
    id: documentRecord.id,
    documentId: documentRecord.id,
    title: portalDocumentTitle_(documentRecord),
    description: portalDocumentDescription_(documentRecord),
    status: 'Disponível',
    date: formatDateBr_(String(documentRecord.createdAt || '').slice(0, 10)),
    canDownload: true
  };
}

function portalDocumentTitle_(documentRecord) {
  var labels = {};
  labels[DOCUMENT_TYPES.AFFILIATION] = 'Declaração de filiação';
  labels[DOCUMENT_TYPES.MEMBER_FORM] = 'Ficha cadastral';
  labels[DOCUMENT_TYPES.ANNUAL_CLEARANCE] = 'Declaração de quitação anual';
  labels[DOCUMENT_TYPES.RECEIPT] = 'Recibo de mensalidade';

  return (labels[documentRecord.tipo] || documentRecord.tipo || 'Documento') +
    (documentRecord.numero ? ' • ' + documentRecord.numero : '');
}

function portalDocumentDescription_(documentRecord) {
  var parts = [];

  if (documentRecord.descricao) {
    parts.push(documentRecord.descricao);
  }

  if (documentRecord.competencia) {
    parts.push('Competência: ' + formatCompetenciaBr_(documentRecord.competencia));
  }

  if (documentRecord.createdAt) {
    parts.push('Emitido em: ' + formatDateBr_(String(documentRecord.createdAt).slice(0, 10)));
  }

  return parts.join(' | ') || 'Documento emitido pela ACEAP.';
}

function portalDueActionLabel_(status) {
  if (status === 'PAGA') return 'Quitada';
  if (status === 'ATRASADA') return 'Pendente';
  if (status === 'CANCELADA') return 'Cancelada';
  return 'Aguardando pagamento';
}

function statusLabel_(status) {
  var normalized = String(status || '').toUpperCase();
  var labels = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo',
    PENDENTE: 'Pendente',
    PAGA: 'Pago',
    ABERTA: 'Aberta',
    ATRASADA: 'Atrasada',
    CANCELADA: 'Cancelada'
  };

  return labels[normalized] || status || '-';
}

function formatDocumentBr_(value) {
  var digits = digitsOnly_(value);

  if (digits.length === 11) {
    return formatCpf_(digits);
  }

  if (digits.length === 14) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  return value || '-';
}


function listEvents_(payload) {
  payload = payload || {};
  var rows = getSheetRows_(SIND_SHEETS.EVENTS, EVENT_HEADERS);
  var search = String(payload.search || '').trim().toLowerCase();
  var status = String(payload.status || '').trim();
  var month = String(payload.month || '').trim();

  return rows.map(function (row, index) {
    return rowToEvent_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (status && item.status !== status) return false;
    if (month && String(item.date || '').slice(0, 7) !== month) return false;
    if (!search) return true;
    return [
      item.title,
      item.type,
      item.place,
      item.description,
      item.status
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    return String(a.date || '').localeCompare(String(b.date || '')) ||
      String(a.time || '').localeCompare(String(b.time || ''));
  });
}

function saveEvent_(payload, username) {
  var data = normalizeEventPayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.EVENTS, EVENT_HEADERS);
    var now = new Date().toISOString();
    var existing = data.id ? findEventById_(data.id) : null;
    var eventItem = {
      id: existing && existing.id ? existing.id : generateId_(),
      title: data.title,
      type: data.type,
      date: data.date,
      time: data.time,
      place: data.place,
      description: data.description,
      capacity: data.capacity,
      status: data.status,
      visibleInPortal: data.visibleInPortal,
      createdBy: existing && existing.createdBy ? existing.createdBy : username,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, EVENT_HEADERS.length).setValues([serializeEvent_(eventItem)]);
      seedAuditLog_('UPDATE_EVENT', 'event', eventItem.id, eventItem.title, username);
    } else {
      sheet.appendRow(serializeEvent_(eventItem));
      seedAuditLog_('CREATE_EVENT', 'event', eventItem.id, eventItem.title, username);
    }

    return eventItem;
  } finally {
    lock.releaseLock();
  }
}

function listAnnouncements_(payload) {
  payload = payload || {};
  var rows = getSheetRows_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS);
  var search = String(payload.search || '').trim().toLowerCase();
  var status = String(payload.status || '').trim();

  return rows.map(function (row, index) {
    return rowToAnnouncement_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (status && item.status !== status) return false;
    if (!search) return true;
    return [
      item.title,
      item.message,
      item.audience,
      item.status
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    if (a.pinned !== b.pinned) {
      return a.pinned === 'SIM' ? -1 : 1;
    }
    return String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')) ||
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function saveAnnouncement_(payload, username) {
  var data = normalizeAnnouncementPayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS);
    var now = new Date().toISOString();
    var existing = data.id ? findAnnouncementById_(data.id) : null;
    var announcement = {
      id: existing && existing.id ? existing.id : generateId_(),
      title: data.title,
      message: data.message,
      audience: data.audience,
      status: data.status,
      pinned: data.pinned,
      visibleInPortal: data.visibleInPortal,
      publishedAt: data.publishedAt,
      expiresAt: data.expiresAt,
      createdBy: existing && existing.createdBy ? existing.createdBy : username,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, ANNOUNCEMENT_HEADERS.length).setValues([serializeAnnouncement_(announcement)]);
      seedAuditLog_('UPDATE_ANNOUNCEMENT', 'announcement', announcement.id, announcement.title, username);
    } else {
      sheet.appendRow(serializeAnnouncement_(announcement));
      seedAuditLog_('CREATE_ANNOUNCEMENT', 'announcement', announcement.id, announcement.title, username);
    }

    return announcement;
  } finally {
    lock.releaseLock();
  }
}

function portalEvents_() {
  var todayValue = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  return listEvents_({})
    .filter(function (item) {
      return item.status === 'ATIVO' &&
        item.visibleInPortal === 'SIM' &&
        (!item.date || item.date >= todayValue);
    })
    .slice(0, 20)
    .map(function (item) {
      return {
        id: item.id,
        title: item.title,
        type: eventTypeLabel_(item.type),
        date: formatDateBr_(item.date),
        rawDate: item.date,
        time: item.time || '',
        place: item.place || 'Local a definir',
        description: item.description || '',
        capacityLabel: item.capacity ? item.capacity + ' vaga(s)' : ''
      };
    });
}

function portalAnnouncements_(member) {
  var todayValue = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var isLate = listDues_({ memberId: member.id }).some(function (due) {
    return resolveDueStatus_(due) === 'ATRASADA';
  });

  return listAnnouncements_({})
    .filter(function (item) {
      if (item.status !== 'ATIVO' || item.visibleInPortal !== 'SIM') return false;
      if (item.publishedAt && item.publishedAt > todayValue) return false;
      if (item.expiresAt && item.expiresAt < todayValue) return false;
      if (item.audience === 'INADIMPLENTES' && !isLate) return false;
      if (item.audience === 'ATIVOS' && !isPortalActiveMember_(member)) return false;
      return true;
    })
    .slice(0, 20)
    .map(function (item) {
      return {
        id: item.id,
        title: item.title,
        message: item.message,
        audience: item.audience,
        publishedAt: formatDateBr_(item.publishedAt),
        pinned: item.pinned === 'SIM'
      };
    });
}

function normalizeEventPayload_(payload) {
  payload = payload || {};
  var title = String(payload.title || '').trim();
  var date = String(payload.date || '').trim();
  var status = normalizeEventStatus_(payload.status);
  var visibleInPortal = normalizeYesNo_(payload.visibleInPortal, 'SIM');

  if (!title || title.length < 3) {
    throw new Error('Informe o título do evento.');
  }

  validateDateInput_(date);

  return {
    id: String(payload.id || '').trim(),
    title: title,
    type: normalizeEventType_(payload.type),
    date: date,
    time: String(payload.time || '').trim(),
    place: String(payload.place || '').trim(),
    description: String(payload.description || '').trim(),
    capacity: Math.max(0, Math.floor(parseNumber_(payload.capacity || 0))),
    status: status,
    visibleInPortal: visibleInPortal
  };
}

function normalizeAnnouncementPayload_(payload) {
  payload = payload || {};
  var title = String(payload.title || '').trim();
  var message = String(payload.message || '').trim();
  var publishedAt = String(payload.publishedAt || '').trim() || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var expiresAt = String(payload.expiresAt || '').trim();

  if (!title || title.length < 3) {
    throw new Error('Informe o título do aviso.');
  }

  if (!message || message.length < 3) {
    throw new Error('Informe a mensagem do aviso.');
  }

  validateDateInput_(publishedAt);
  if (expiresAt) {
    validateDateInput_(expiresAt);
    if (expiresAt < publishedAt) {
      throw new Error('A data de expiração não pode ser anterior à publicação.');
    }
  }

  return {
    id: String(payload.id || '').trim(),
    title: title,
    message: message,
    audience: normalizeAnnouncementAudience_(payload.audience),
    status: normalizeAnnouncementStatus_(payload.status),
    pinned: normalizeYesNo_(payload.pinned, 'NAO'),
    visibleInPortal: normalizeYesNo_(payload.visibleInPortal, 'SIM'),
    publishedAt: publishedAt,
    expiresAt: expiresAt
  };
}

function rowToEvent_(row, rowNumber) {
  row = normalizeRow_(row, EVENT_HEADERS.length);
  return {
    id: row[0] || '',
    title: row[1] || '',
    type: normalizeEventType_(row[2]),
    date: row[3] || '',
    time: row[4] || '',
    place: row[5] || '',
    description: row[6] || '',
    capacity: parseNumber_(row[7] || 0),
    status: normalizeEventStatus_(row[8]),
    visibleInPortal: normalizeYesNo_(row[9], 'SIM'),
    createdBy: row[10] || '',
    createdAt: row[11] || '',
    updatedAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function serializeEvent_(item) {
  return [
    item.id || '',
    item.title || '',
    normalizeEventType_(item.type),
    item.date || '',
    item.time || '',
    item.place || '',
    item.description || '',
    Math.max(0, Math.floor(Number(item.capacity || 0))),
    normalizeEventStatus_(item.status),
    normalizeYesNo_(item.visibleInPortal, 'SIM'),
    item.createdBy || '',
    item.createdAt || '',
    item.updatedAt || ''
  ];
}

function findEventById_(id) {
  var rows = getSheetRows_(SIND_SHEETS.EVENTS, EVENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToEvent_(row, index + 2);
    if (item.id === id) {
      found = item;
    }
  });

  return found;
}

function rowToAnnouncement_(row, rowNumber) {
  row = normalizeRow_(row, ANNOUNCEMENT_HEADERS.length);
  return {
    id: row[0] || '',
    title: row[1] || '',
    message: row[2] || '',
    audience: normalizeAnnouncementAudience_(row[3]),
    status: normalizeAnnouncementStatus_(row[4]),
    pinned: normalizeYesNo_(row[5], 'NAO'),
    visibleInPortal: normalizeYesNo_(row[6], 'SIM'),
    publishedAt: row[7] || '',
    expiresAt: row[8] || '',
    createdBy: row[9] || '',
    createdAt: row[10] || '',
    updatedAt: row[11] || '',
    rowNumber: rowNumber
  };
}

function serializeAnnouncement_(item) {
  return [
    item.id || '',
    item.title || '',
    item.message || '',
    normalizeAnnouncementAudience_(item.audience),
    normalizeAnnouncementStatus_(item.status),
    normalizeYesNo_(item.pinned, 'NAO'),
    normalizeYesNo_(item.visibleInPortal, 'SIM'),
    item.publishedAt || '',
    item.expiresAt || '',
    item.createdBy || '',
    item.createdAt || '',
    item.updatedAt || ''
  ];
}

function findAnnouncementById_(id) {
  var rows = getSheetRows_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToAnnouncement_(row, index + 2);
    if (item.id === id) {
      found = item;
    }
  });

  return found;
}

function normalizeEventType_(value) {
  var type = String(value || 'OUTRO').trim().toUpperCase();
  if (['CURSO', 'PALESTRA', 'REUNIAO', 'ASSEMBLEIA', 'CAMPANHA', 'OUTRO'].indexOf(type) >= 0) {
    return type;
  }
  return 'OUTRO';
}

function eventTypeLabel_(value) {
  var labels = {
    CURSO: 'Curso',
    PALESTRA: 'Palestra',
    REUNIAO: 'Reunião',
    ASSEMBLEIA: 'Assembleia',
    CAMPANHA: 'Campanha',
    OUTRO: 'Outro'
  };
  return labels[normalizeEventType_(value)] || 'Evento';
}

function normalizeEventStatus_(value) {
  var status = String(value || 'ATIVO').trim().toUpperCase();
  if (['ATIVO', 'RASCUNHO', 'CANCELADO', 'ENCERRADO'].indexOf(status) >= 0) {
    return status;
  }
  return 'ATIVO';
}

function normalizeAnnouncementStatus_(value) {
  var status = String(value || 'ATIVO').trim().toUpperCase();
  if (['ATIVO', 'RASCUNHO', 'ARQUIVADO'].indexOf(status) >= 0) {
    return status;
  }
  return 'ATIVO';
}

function normalizeAnnouncementAudience_(value) {
  var audience = String(value || 'TODOS').trim().toUpperCase();
  if (['TODOS', 'ATIVOS', 'INADIMPLENTES'].indexOf(audience) >= 0) {
    return audience;
  }
  return 'TODOS';
}

function normalizeYesNo_(value, fallback) {
  var normalized = String(value || fallback || 'NAO').trim().toUpperCase();
  return normalized === 'SIM' ? 'SIM' : 'NAO';
}


function listCatalogEntries_(payload) {
  payload = payload || {};
  var rows = getSheetRows_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
  var search = String(payload.search || '').trim().toLowerCase();
  var visible = String(payload.visible || '').trim().toUpperCase();

  return rows.map(function (row, index) {
    return rowToCatalogEntry_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (visible && item.visible !== visible) return false;
    if (!search) return true;
    return [
      item.publicName,
      item.category,
      item.description,
      item.whatsapp,
      item.instagram,
      item.address
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    if (a.highlight !== b.highlight) {
      return a.highlight === 'SIM' ? -1 : 1;
    }
    return a.publicName.localeCompare(b.publicName, 'pt-BR');
  });
}

function listPublicCatalogEntries_(payload) {
  var search = String((payload && payload.search) || '').trim().toLowerCase();
  var category = String((payload && payload.category) || '').trim().toLowerCase();

  return listCatalogEntries_({ visible: 'SIM' }).filter(function (item) {
    if (category && String(item.category || '').toLowerCase() !== category) return false;
    if (!search) return true;
    return [
      item.publicName,
      item.category,
      item.description,
      item.whatsapp,
      item.instagram,
      item.address
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).map(function (item) {
    return {
      id: item.id,
      publicName: item.publicName,
      category: item.category,
      description: item.description,
      whatsapp: item.whatsapp,
      instagram: item.instagram,
      address: item.address,
      highlight: item.highlight
    };
  });
}

function saveCatalogEntry_(payload, username) {
  var data = normalizeCatalogPayload_(payload);
  var member = findMemberById_(data.memberId);
  var lock = LockService.getScriptLock();

  if (!member) {
    throw new Error('Associado não encontrado para o catálogo.');
  }

  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
    var existing = data.id ? findCatalogEntryById_(data.id) : findCatalogEntryByMemberId_(data.memberId);
    var now = new Date().toISOString();
    var entry = {
      id: existing && existing.id ? existing.id : generateId_(),
      memberId: data.memberId,
      publicName: data.publicName || member.empresa || member.nome,
      category: data.category,
      description: data.description,
      whatsapp: data.whatsapp || member.telefone,
      instagram: data.instagram,
      address: data.address || buildMemberAddress_(member),
      visible: data.visible,
      highlight: data.highlight,
      updatedBy: username,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, CATALOG_HEADERS.length).setValues([serializeCatalogEntry_(entry)]);
      seedAuditLog_('UPDATE_CATALOG', 'catalog', entry.id, entry.publicName, username);
    } else {
      sheet.appendRow(serializeCatalogEntry_(entry));
      seedAuditLog_('CREATE_CATALOG', 'catalog', entry.id, entry.publicName, username);
    }

    return entry;
  } finally {
    lock.releaseLock();
  }
}

function buildMemberAddress_(member) {
  return [
    member.endereco,
    member.bairro,
    member.cidade,
    member.uf
  ].filter(Boolean).join(', ');
}

function normalizeCatalogPayload_(payload) {
  var data = {
    id: String((payload && payload.id) || '').trim(),
    memberId: String((payload && payload.memberId) || '').trim(),
    publicName: String((payload && payload.publicName) || '').trim(),
    category: String((payload && payload.category) || '').trim(),
    description: String((payload && payload.description) || '').trim(),
    whatsapp: digitsOnly_((payload && payload.whatsapp) || ''),
    instagram: String((payload && payload.instagram) || '').trim(),
    address: String((payload && payload.address) || '').trim(),
    visible: normalizeYesNo_((payload && payload.visible), 'SIM'),
    highlight: normalizeYesNo_((payload && payload.highlight), 'NAO')
  };

  if (!data.memberId) {
    throw new Error('Selecione o associado do catálogo.');
  }

  if (!data.publicName || data.publicName.length < 2) {
    throw new Error('Informe o nome público que aparecerá no catálogo.');
  }

  return data;
}

function rowToCatalogEntry_(row, rowNumber) {
  row = normalizeRow_(row, CATALOG_HEADERS.length);
  return {
    id: row[0] || '',
    memberId: row[1] || '',
    publicName: row[2] || '',
    category: row[3] || '',
    description: row[4] || '',
    whatsapp: row[5] || '',
    instagram: row[6] || '',
    address: row[7] || '',
    visible: normalizeYesNo_(row[8], 'SIM'),
    highlight: normalizeYesNo_(row[9], 'NAO'),
    updatedBy: row[10] || '',
    createdAt: row[11] || '',
    updatedAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function serializeCatalogEntry_(item) {
  return [
    item.id || '',
    item.memberId || '',
    item.publicName || '',
    item.category || '',
    item.description || '',
    digitsOnly_(item.whatsapp || ''),
    item.instagram || '',
    item.address || '',
    normalizeYesNo_(item.visible, 'SIM'),
    normalizeYesNo_(item.highlight, 'NAO'),
    item.updatedBy || '',
    item.createdAt || '',
    item.updatedAt || ''
  ];
}

function findCatalogEntryById_(id) {
  var rows = getSheetRows_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToCatalogEntry_(row, index + 2);
    if (item.id === id) {
      found = item;
    }
  });

  return found;
}

function findCatalogEntryByMemberId_(memberId) {
  var rows = getSheetRows_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToCatalogEntry_(row, index + 2);
    if (!found && item.memberId === memberId) {
      found = item;
    }
  });

  return found;
}


function portalCreateRequest_(payload) {
  var session = requirePortalSession_(payload.portalToken);
  var member = findMemberById_(session.memberId);
  var data = normalizePortalRequestPayload_(payload);
  var lock = LockService.getScriptLock();

  if (!member || !isPortalActiveMember_(member)) {
    throw new Error('Associado não encontrado ou inativo.');
  }

  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
    var now = new Date().toISOString();
    var request = {
      id: generateId_(),
      protocol: nextRequestProtocol_(),
      memberId: member.id,
      memberName: member.empresa || member.nome,
      type: data.type,
      message: data.message,
      status: 'ABERTA',
      response: '',
      internalNote: '',
      createdBy: 'PORTAL',
      createdAt: now,
      updatedAt: now,
      closedAt: ''
    };

    sheet.appendRow(serializeRequest_(request));
    seedAuditLog_('CREATE_PROTOCOL', 'request', request.id, request.protocol + ' / ' + request.memberName, member.nome);

    return portalRequestItem_(request);
  } finally {
    lock.releaseLock();
  }
}

function portalListRequests_(payload) {
  var session = requirePortalSession_(payload.portalToken);
  return portalListRequestsForMember_(session.memberId);
}

function portalListRequestsForMember_(memberId) {
  return listRequests_({ memberId: memberId }).map(portalRequestItem_);
}

function listRequests_(payload) {
  payload = payload || {};
  var rows = getSheetRows_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
  var search = String(payload.search || '').trim().toLowerCase();
  var status = String(payload.status || '').trim().toUpperCase();
  var memberId = String(payload.memberId || '').trim();

  return rows.map(function (row, index) {
    return rowToRequest_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (memberId && item.memberId !== memberId) return false;
    if (status && item.status !== status) return false;
    if (!search) return true;
    return [
      item.protocol,
      item.memberName,
      item.type,
      item.message,
      item.status,
      item.response,
      item.internalNote
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function updateRequest_(payload, username) {
  var requestId = String((payload && payload.id) || '').trim();
  var request = findRequestById_(requestId);
  var status = normalizeRequestStatus_((payload && payload.status) || '');
  var response = String((payload && payload.response) || '').trim();
  var internalNote = String((payload && payload.internalNote) || '').trim();
  var now = new Date().toISOString();

  if (!request || !request.rowNumber) {
    throw new Error('Protocolo não encontrado.');
  }

  request.status = status;
  request.response = response;
  request.internalNote = internalNote;
  request.updatedAt = now;
  request.closedAt = status === 'CONCLUIDA' || status === 'CANCELADA' ? (request.closedAt || now) : '';

  ensureSheet_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS)
    .getRange(request.rowNumber, 1, 1, REQUEST_HEADERS.length)
    .setValues([serializeRequest_(request)]);

  seedAuditLog_('UPDATE_PROTOCOL', 'request', request.id, request.protocol + ' / ' + request.status, username);

  return request;
}

function normalizePortalRequestPayload_(payload) {
  var type = normalizeRequestType_((payload && payload.type) || '');
  var message = String((payload && payload.message) || '').trim();

  if (!message || message.length < 5) {
    throw new Error('Descreva a solicitação com pelo menos 5 caracteres.');
  }

  return {
    type: type,
    message: message
  };
}

function nextRequestProtocol_() {
  var year = String(new Date().getFullYear());
  var prefix = 'ACEAP-' + year + '-';
  var rows = getSheetRows_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
  var max = 0;

  rows.forEach(function (row, index) {
    var item = rowToRequest_(row, index + 2);
    var number;
    if (String(item.protocol || '').indexOf(prefix) === 0) {
      number = Number(String(item.protocol).replace(prefix, ''));
      if (number > max) {
        max = number;
      }
    }
  });

  return prefix + padLeft_(String(max + 1), 6, '0');
}

function padLeft_(value, size, charValue) {
  value = String(value || '');
  charValue = String(charValue || '0');
  while (value.length < size) {
    value = charValue + value;
  }
  return value;
}

function rowToRequest_(row, rowNumber) {
  row = normalizeRow_(row, REQUEST_HEADERS.length);
  return {
    id: row[0] || '',
    protocol: row[1] || '',
    memberId: row[2] || '',
    memberName: row[3] || '',
    type: normalizeRequestType_(row[4]),
    message: row[5] || '',
    status: normalizeRequestStatus_(row[6]),
    response: row[7] || '',
    internalNote: row[8] || '',
    createdBy: row[9] || '',
    createdAt: row[10] || '',
    updatedAt: row[11] || '',
    closedAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function serializeRequest_(item) {
  return [
    item.id || '',
    item.protocol || '',
    item.memberId || '',
    item.memberName || '',
    normalizeRequestType_(item.type),
    item.message || '',
    normalizeRequestStatus_(item.status),
    item.response || '',
    item.internalNote || '',
    item.createdBy || '',
    item.createdAt || '',
    item.updatedAt || '',
    item.closedAt || ''
  ];
}

function findRequestById_(id) {
  var rows = getSheetRows_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToRequest_(row, index + 2);
    if (item.id === id) {
      found = item;
    }
  });

  return found;
}

function normalizeRequestType_(value) {
  var type = String(value || 'SUPORTE').trim().toUpperCase();
  if ([
    'ATUALIZACAO_CADASTRAL',
    'DECLARACAO',
    'SEGUNDA_VIA',
    'SUPORTE',
    'CATALOGO',
    'DESLIGAMENTO',
    'OUTRO'
  ].indexOf(type) >= 0) {
    return type;
  }
  return 'OUTRO';
}

function requestTypeLabel_(value) {
  var labels = {
    ATUALIZACAO_CADASTRAL: 'Atualização cadastral',
    DECLARACAO: 'Declaração',
    SEGUNDA_VIA: 'Segunda via',
    SUPORTE: 'Suporte',
    CATALOGO: 'Catálogo',
    DESLIGAMENTO: 'Desligamento',
    OUTRO: 'Outro'
  };
  return labels[normalizeRequestType_(value)] || 'Outro';
}

function normalizeRequestStatus_(value) {
  var status = String(value || 'ABERTA').trim().toUpperCase();
  if ([
    'ABERTA',
    'EM_ANALISE',
    'AGUARDANDO_ASSOCIADO',
    'CONCLUIDA',
    'CANCELADA'
  ].indexOf(status) >= 0) {
    return status;
  }
  return 'ABERTA';
}

function requestStatusLabel_(value) {
  var labels = {
    ABERTA: 'Aberta',
    EM_ANALISE: 'Em análise',
    AGUARDANDO_ASSOCIADO: 'Aguardando associado',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada'
  };
  return labels[normalizeRequestStatus_(value)] || 'Aberta';
}

function portalRequestItem_(request) {
  return {
    id: request.id,
    protocol: request.protocol,
    type: request.type,
    typeLabel: requestTypeLabel_(request.type),
    message: request.message,
    status: request.status,
    statusLabel: requestStatusLabel_(request.status),
    response: request.response,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    closedAt: request.closedAt
  };
}


function requireSession_(token) {
  var raw = CacheService.getScriptCache().get(SIND_SECURITY.SESSION_PREFIX + token);
  if (!raw) {
    throw new Error('Sessão inválida ou expirada.');
  }

  var session = JSON.parse(raw);
  session.permissions = permissionsForRole_(session.role);
  return session;
}

function requirePermission_(session, permission) {
  if (!hasPermission_(session, permission)) {
    throw new Error('Você não tem permissão para executar esta ação.');
  }
}

function hasPermission_(session, permission) {
  return permissionsForRole_(session && session.role).indexOf(permission) >= 0;
}

function permissionsForRole_(role) {
  return (PERMISSION_GROUPS[String(role || '').trim()] || []).slice();
}

function getTargetSpreadsheet_() {
  var secureId = String(getScriptProperty_(SIND_SECURITY.PROP_SPREADSHEET_ID, '') || '').trim();

  if (secureId) {
    return SpreadsheetApp.openById(secureId);
  }

  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }

  throw new Error('Planilha não configurada.');
}

function getUnionName_() {
  return String(getScriptProperty_(SIND_SECURITY.PROP_UNION_NAME, SIND_SETUP.UNION_NAME || 'ACEAP')).trim();
}

function getPdfFolder_() {
  var folderId = String(getScriptProperty_(SIND_SECURITY.PROP_PDF_FOLDER_ID, '') || '').trim();
  if (!folderId) {
    return ensurePdfFolder_();
  }
  return DriveApp.getFolderById(folderId);
}

function ensurePdfFolder_() {
  var props = PropertiesService.getScriptProperties();
  var folderId = String(props.getProperty(SIND_SECURITY.PROP_PDF_FOLDER_ID) || '').trim();
  if (folderId) {
    return DriveApp.getFolderById(folderId);
  }

  var folder = DriveApp.createFolder('Documentos - ' + getUnionName_());
  props.setProperty(SIND_SECURITY.PROP_PDF_FOLDER_ID, folder.getId());
  return folder;
}

function ensureAllSheets_() {
  ensureSheet_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
  ensureSheet_(SIND_SHEETS.DUES, DUE_HEADERS);
  ensureSheet_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  ensureSheet_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS);
  ensureSheet_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS);
  ensureSheet_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS);
  ensureSheet_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS);
  ensureSheet_(SIND_SHEETS.EVENTS, EVENT_HEADERS);
  ensureSheet_(SIND_SHEETS.ANNOUNCEMENTS, ANNOUNCEMENT_HEADERS);
  ensureSheet_(SIND_SHEETS.CATALOG, CATALOG_HEADERS);
  ensureSheet_(SIND_SHEETS.REQUESTS, REQUEST_HEADERS);
  ensureSheet_(SIND_SHEETS.CONFIG, ['chave', 'valor']);
  ensureSheet_(SIND_SHEETS.AUDIT, AUDIT_HEADERS);
  ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS);
}

function ensureSheet_(sheetName, headers) {
  var ss = getTargetSpreadsheet_();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  var current = headerRange.getDisplayValues()[0] || [];
  var match = current.length === headers.length && headers.every(function (header, index) {
    return String(current[index] || '') === String(header);
  });

  if (!match) {
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function writeConfigSheet_() {
  var sheet = ensureSheet_(SIND_SHEETS.CONFIG, ['chave', 'valor']);
  var rows = [
    ['union_name', getUnionName_()],
    ['spreadsheet_id', getScriptProperty_(SIND_SECURITY.PROP_SPREADSHEET_ID, '')],
    ['pdf_folder_id', getScriptProperty_(SIND_SECURITY.PROP_PDF_FOLDER_ID, '')],
    ['updated_at', new Date().toISOString()]
  ];

  clearSheetBody_(sheet);
  sheet.getRange(2, 1, rows.length, 2).setValues(rows);
}

function clearSheetBody_(sheet) {
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(1, sheet.getLastColumn())).clearContent();
  }
}

function seedDefaultAdminUser_() {
  var users = listUsers_();
  if (users.length) {
    return;
  }

  var now = new Date().toISOString();
  ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS).appendRow([
    generateId_(),
    String(SIND_SETUP.ADMIN_NAME || 'Administrador'),
    String(SIND_SETUP.ADMIN_USERNAME || 'admin').trim(),
    sha256_(String(SIND_SETUP.ADMIN_PASSWORD || '')),
    SIND_ROLES.ADMIN,
    'ATIVO',
    now,
    now
  ]);
}

function resetAdminPassword_() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = String(SIND_SETUP.SPREADSHEET_ID || '').trim();
  var username = String(SIND_SETUP.ADMIN_USERNAME || 'admin').trim();
  var now = new Date().toISOString();
  var sheet;
  var existing;
  var user;

  if (spreadsheetId) {
    props.setProperty(SIND_SECURITY.PROP_SPREADSHEET_ID, spreadsheetId);
  }

  props.setProperty(SIND_SECURITY.PROP_UNION_NAME, String(SIND_SETUP.UNION_NAME || 'ACEAP').trim());

  ensureAllSheets_();
  sheet = ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS);
  existing = findUserByUsername_(username);
  user = {
    id: existing && existing.id ? existing.id : generateId_(),
    nome: existing && existing.nome ? existing.nome : String(SIND_SETUP.ADMIN_NAME || 'Administrador'),
    username: username,
    passwordHash: sha256_(String(SIND_SETUP.ADMIN_PASSWORD || '123456')),
    role: SIND_ROLES.ADMIN,
    status: 'ATIVO',
    createdAt: existing && existing.createdAt ? existing.createdAt : now,
    updatedAt: now
  };

  if (existing && existing.rowNumber) {
    sheet.getRange(existing.rowNumber, 1, 1, USER_HEADERS.length).setValues([serializeUser_(user)]);
  } else {
    sheet.appendRow(serializeUser_(user));
  }

  seedAuditLog_('RESET_ADMIN', 'user', user.id, 'Usuário administrador resetado', 'system');
  return 'Admin resetado: ' + username + ' / senha inicial configurada.';
}

function listMembers_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
  var items = rows.map(function (row, index) {
    return rowToMember_(row, index + 2);
  }).filter(function (item) {
    return item.id && item.nome;
  });

  var search = String((payload && payload.search) || '').trim().toLowerCase();
  var status = String((payload && payload.status) || '').trim();

  return items.filter(function (item) {
    if (status && item.status !== status) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [
      item.nome,
      item.cpf,
      item.empresa,
      item.telefone,
      item.status
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

function saveMember_(payload, username) {
  var data = normalizeMemberPayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
    var items = listMembers_({});
    var duplicate = items.find(function (item) {
      return item.cpf === data.cpf && item.id !== data.id;
    });

    if (duplicate) {
      throw new Error('Já existe associado com este CPF.');
    }

    var now = new Date().toISOString();

    if (data.id) {
      var existing = findMemberById_(data.id);
      if (!existing || !existing.rowNumber) {
        throw new Error('Associado não encontrado.');
      }

      var updated = {
        id: existing.id,
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        dataNascimento: data.dataNascimento,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        cep: data.cep,
        empresa: data.empresa,
        cargo: data.cargo,
        dataAdmissao: data.dataAdmissao,
        dataFiliacao: data.dataFiliacao,
        status: data.status,
        observacoes: data.observacoes,
        createdAt: existing.createdAt,
        updatedAt: now,
        portalAccessEnabled: existing.portalAccessEnabled || 'SIM',
        portalPasswordHash: existing.portalPasswordHash || '',
        portalMustChangePassword: existing.portalMustChangePassword || 'SIM',
        portalLastLoginAt: existing.portalLastLoginAt || ''
      };

      sheet.getRange(existing.rowNumber, 1, 1, MEMBER_HEADERS.length).setValues([serializeMember_(updated)]);
      seedAuditLog_('UPDATE', 'member', updated.id, updated.nome + ' / CPF ' + updated.cpf, username);
      return updated;
    }

    var created = {
      id: generateId_(),
      nome: data.nome,
      cpf: data.cpf,
      rg: data.rg,
      dataNascimento: data.dataNascimento,
      email: data.email,
      telefone: data.telefone,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      cep: data.cep,
      empresa: data.empresa,
      cargo: data.cargo,
      dataAdmissao: data.dataAdmissao,
      dataFiliacao: data.dataFiliacao,
      status: data.status,
      observacoes: data.observacoes,
      createdAt: now,
      updatedAt: now,
      portalAccessEnabled: 'SIM',
      portalPasswordHash: '',
      portalMustChangePassword: 'SIM',
      portalLastLoginAt: ''
    };

    sheet.appendRow(serializeMember_(created));
    seedAuditLog_('CREATE', 'member', created.id, created.nome + ' / CPF ' + created.cpf, username);
    return created;
  } finally {
    lock.releaseLock();
  }
}

function inactivateMember_(memberId, username) {
  var member = findMemberById_(memberId);
  if (!member || !member.rowNumber) {
    throw new Error('Associado não encontrado.');
  }

  member.status = 'INATIVO';
  member.updatedAt = new Date().toISOString();

  ensureSheet_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS)
    .getRange(member.rowNumber, 1, 1, MEMBER_HEADERS.length)
    .setValues([serializeMember_(member)]);

  seedAuditLog_('INACTIVATE', 'member', member.id, member.nome + ' / CPF ' + member.cpf, username);
  return member;
}

function generateBatchDues_(payload, username) {
  var competencia = String(payload.competencia || '').trim();
  var valor = parseNumber_(payload.valor);
  var vencimento = String(payload.vencimento || '').trim();

  validateCompetencia_(competencia);
  validateDateInput_(vencimento);

  if (valor <= 0) {
    throw new Error('Valor da mensalidade deve ser maior que zero.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var members = listMembers_({ status: 'ATIVO' });
    var dues = listDues_({ competencia: competencia });
    var existingMap = {};
    dues.forEach(function (due) {
      existingMap[due.memberId + ':' + due.competencia] = true;
    });

    var sheet = ensureSheet_(SIND_SHEETS.DUES, DUE_HEADERS);
    var createdCount = 0;
    var skippedCount = 0;
    var now = new Date().toISOString();

    members.forEach(function (member) {
      var key = member.id + ':' + competencia;
      if (existingMap[key]) {
        skippedCount += 1;
        return;
      }

      var due = {
        id: generateId_(),
        memberId: member.id,
        memberNome: member.nome,
        memberCpf: member.cpf,
        competencia: competencia,
        valor: valor,
        vencimento: vencimento,
        pagoEm: '',
        formaPagamento: '',
        status: resolveDueStatus_({
          vencimento: vencimento,
          pagoEm: '',
          status: 'ABERTA'
        }),
        observacoes: '',
        createdAt: now,
        updatedAt: now
      };

      sheet.appendRow(serializeDue_(due));
      createdCount += 1;
    });

    seedAuditLog_('GENERATE_BATCH', 'due', competencia, 'Criadas ' + createdCount + ' mensalidades / ignoradas ' + skippedCount, username);
    return {
      createdCount: createdCount,
      skippedCount: skippedCount
    };
  } finally {
    lock.releaseLock();
  }
}

function listDues_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.DUES, DUE_HEADERS);
  var items = rows.map(function (row, index) {
    return rowToDue_(row, index + 2);
  }).filter(function (item) {
    return item.id && item.memberId;
  });

  var competencia = String((payload && payload.competencia) || '').trim();
  var search = String((payload && payload.search) || '').trim().toLowerCase();
  var status = String((payload && payload.status) || '').trim();
  var memberId = String((payload && payload.memberId) || '').trim();

  items = items.map(function (item) {
    item.status = resolveDueStatus_(item);
    return item;
  });

  return items.filter(function (item) {
    if (competencia && item.competencia !== competencia) {
      return false;
    }
    if (memberId && item.memberId !== memberId) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [
      item.memberNome,
      item.memberCpf,
      item.formaPagamento,
      item.status,
      item.competencia
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    if (a.competencia !== b.competencia) {
      return b.competencia.localeCompare(a.competencia);
    }
    return a.memberNome.localeCompare(b.memberNome, 'pt-BR');
  });
}

function payDue_(payload, username) {
  var dueId = String(payload.dueId || '').trim();
  var pagoEm = String(payload.pagoEm || '').trim();
  var formaPagamento = String(payload.formaPagamento || '').trim();
  var observacoes = String(payload.observacoes || '').trim();

  validateDateInput_(pagoEm);
  if (!formaPagamento) {
    throw new Error('Informe a forma de pagamento.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var due = findDueById_(dueId);
    if (!due || !due.rowNumber) {
      throw new Error('Mensalidade não encontrada.');
    }

    due.pagoEm = pagoEm;
    due.formaPagamento = formaPagamento;
    due.status = 'PAGA';
    due.observacoes = observacoes || due.observacoes || '';
    due.updatedAt = new Date().toISOString();

    ensureSheet_(SIND_SHEETS.DUES, DUE_HEADERS)
      .getRange(due.rowNumber, 1, 1, DUE_HEADERS.length)
      .setValues([serializeDue_(due)]);

    seedAuditLog_('PAY', 'due', due.id, due.memberNome + ' / ' + due.competencia + ' / ' + due.valor, username);
    return due;
  } finally {
    lock.releaseLock();
  }
}

function buildMonthlyReport_(competencia) {
  validateCompetencia_(competencia);
  var items = listDues_({ competencia: competencia });
  var totalLancado = 0;
  var totalPago = 0;
  var totalAberto = 0;
  var totalAtrasado = 0;
  var quantidadePagos = 0;
  var quantidadeEmAberto = 0;
  var quantidadeAtrasados = 0;
  var quantidadeCancelados = 0;
  var inadimplentesMap = {};

  items.forEach(function (item) {
    if (item.status !== 'CANCELADA') {
      totalLancado += Number(item.valor || 0);
    }

    if (item.status === 'PAGA') {
      totalPago += Number(item.valor || 0);
      quantidadePagos += 1;
    }

    if (item.status === 'ABERTA') {
      totalAberto += Number(item.valor || 0);
      quantidadeEmAberto += 1;
    }

    if (item.status === 'ATRASADA') {
      totalAtrasado += Number(item.valor || 0);
      quantidadeAtrasados += 1;
      if (!inadimplentesMap[item.memberId]) {
        inadimplentesMap[item.memberId] = {
          memberId: item.memberId,
          memberNome: item.memberNome,
          memberCpf: item.memberCpf,
          total: 0
        };
      }
      inadimplentesMap[item.memberId].total += Number(item.valor || 0);
    }

    if (item.status === 'CANCELADA') {
      quantidadeCancelados += 1;
    }
  });

  var inadimplentes = Object.keys(inadimplentesMap).map(function (key) {
    return inadimplentesMap[key];
  }).sort(function (a, b) {
    return b.total - a.total;
  });

  return {
    competencia: competencia,
    totalLancado: round2_(totalLancado),
    totalPago: round2_(totalPago),
    totalAberto: round2_(totalAberto),
    totalAtrasado: round2_(totalAtrasado),
    quantidadePagos: quantidadePagos,
    quantidadeEmAberto: quantidadeEmAberto,
    quantidadeAtrasados: quantidadeAtrasados,
    quantidadeCancelados: quantidadeCancelados,
    inadimplentes: inadimplentes,
    itens: items
  };
}

function buildFinancialDashboard_(payload) {
  payload = payload || {};
  var current = currentMonth_();
  var inicio = String(payload.inicio || current.slice(0, 4) + '-01').trim();
  var fim = String(payload.fim || current).trim();
  var status = String(payload.status || '').trim();
  var search = String(payload.search || '').trim().toLowerCase();

  validateCompetencia_(inicio);
  validateCompetencia_(fim);
  if (inicio > fim) {
    throw new Error('Periodo financeiro invalido.');
  }

  var items = listDues_({}).filter(function (item) {
    if (item.competencia < inicio || item.competencia > fim) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [
      item.memberNome,
      item.memberCpf,
      item.formaPagamento,
      item.status,
      item.competencia
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  });

  var totals = {
    totalLancado: 0,
    totalPago: 0,
    totalAberto: 0,
    totalAtrasado: 0,
    totalCancelado: 0,
    quantidade: 0,
    quantidadePagas: 0,
    quantidadeAbertas: 0,
    quantidadeAtrasadas: 0,
    quantidadeCanceladas: 0
  };
  var monthMap = {};
  var statusMap = {};
  var inadimplentesMap = {};
  var months = monthsBetween_(inicio, fim);

  months.forEach(function (month) {
    monthMap[month] = {
      competencia: month,
      totalLancado: 0,
      totalPago: 0,
      totalAberto: 0,
      totalAtrasado: 0,
      quantidade: 0
    };
  });

  ['PAGA', 'ABERTA', 'ATRASADA', 'CANCELADA'].forEach(function (itemStatus) {
    statusMap[itemStatus] = { status: itemStatus, total: 0, quantidade: 0 };
  });

  items.forEach(function (item) {
    var value = Number(item.valor || 0);
    var bucket = monthMap[item.competencia] || {
      competencia: item.competencia,
      totalLancado: 0,
      totalPago: 0,
      totalAberto: 0,
      totalAtrasado: 0,
      quantidade: 0
    };
    var statusBucket = statusMap[item.status] || { status: item.status, total: 0, quantidade: 0 };

    totals.quantidade += 1;
    bucket.quantidade += 1;
    statusBucket.quantidade += 1;

    if (item.status !== 'CANCELADA') {
      totals.totalLancado += value;
      bucket.totalLancado += value;
    } else {
      totals.totalCancelado += value;
      totals.quantidadeCanceladas += 1;
    }

    if (item.status === 'PAGA') {
      totals.totalPago += value;
      totals.quantidadePagas += 1;
      bucket.totalPago += value;
    }

    if (item.status === 'ABERTA') {
      totals.totalAberto += value;
      totals.quantidadeAbertas += 1;
      bucket.totalAberto += value;
    }

    if (item.status === 'ATRASADA') {
      totals.totalAtrasado += value;
      totals.quantidadeAtrasadas += 1;
      bucket.totalAtrasado += value;
      if (!inadimplentesMap[item.memberId]) {
        inadimplentesMap[item.memberId] = {
          memberId: item.memberId,
          memberNome: item.memberNome,
          memberCpf: item.memberCpf,
          total: 0,
          quantidade: 0,
          ultimaCompetencia: item.competencia
        };
      }
      inadimplentesMap[item.memberId].total += value;
      inadimplentesMap[item.memberId].quantidade += 1;
      if (item.competencia > inadimplentesMap[item.memberId].ultimaCompetencia) {
        inadimplentesMap[item.memberId].ultimaCompetencia = item.competencia;
      }
    }

    statusBucket.total += value;
    monthMap[item.competencia] = bucket;
    statusMap[item.status] = statusBucket;
  });

  var inadimplentes = Object.keys(inadimplentesMap).map(function (key) {
    var item = inadimplentesMap[key];
    item.total = round2_(item.total);
    return item;
  }).sort(function (a, b) {
    return b.total - a.total;
  });

  var monthlyRevenue = Object.keys(monthMap).sort().map(function (key) {
    var item = monthMap[key];
    item.totalLancado = round2_(item.totalLancado);
    item.totalPago = round2_(item.totalPago);
    item.totalAberto = round2_(item.totalAberto);
    item.totalAtrasado = round2_(item.totalAtrasado);
    return item;
  });

  Object.keys(totals).forEach(function (key) {
    if (key.indexOf('total') === 0) {
      totals[key] = round2_(totals[key]);
    }
  });

  return {
    inicio: inicio,
    fim: fim,
    status: status,
    search: search,
    totals: totals,
    porStatus: Object.keys(statusMap).map(function (key) {
      var item = statusMap[key];
      item.total = round2_(item.total);
      return item;
    }),
    arrecadacaoMensal: monthlyRevenue,
    inadimplentes: inadimplentes.slice(0, 50),
    itens: items
  };
}

function buildCashClosingSummary_(payload) {
  var period = normalizeCashPeriod_(payload);
  var payments = listDues_({}).filter(function (due) {
    return due.status === 'PAGA' &&
      due.pagoEm &&
      due.pagoEm >= period.periodoInicio &&
      due.pagoEm <= period.periodoFim;
  });
  var movements = listCashMovementsForPeriod_(period);
  var paymentTotals = buildCashTotals_(payments);
  var movementTotals = buildCashMovementTotals_(movements);
  var porForma = mergePaymentMethods_(paymentTotals.porForma, movementTotals.porFormaEntradas);
  var existing = findCashClosingByPeriod_(period.tipo, period.periodoInicio, period.periodoFim);

  return {
    tipo: period.tipo,
    periodoInicio: period.periodoInicio,
    periodoFim: period.periodoFim,
    competencia: period.competencia,
    totalRecebido: paymentTotals.totalRecebido,
    quantidadePagamentos: paymentTotals.quantidadePagamentos,
    manualEntradas: movementTotals.entradas,
    totalEntradas: round2_(paymentTotals.totalRecebido + movementTotals.entradas),
    saidasFixas: movementTotals.saidasFixas,
    saidasVariaveis: movementTotals.saidasVariaveis,
    totalSaidas: movementTotals.totalSaidas,
    saldoPeriodo: round2_(paymentTotals.totalRecebido + movementTotals.entradas - movementTotals.totalSaidas),
    porForma: porForma,
    pagamentos: payments.map(function (due) {
      return {
        id: due.id,
        memberId: due.memberId,
        memberNome: due.memberNome,
        memberCpf: due.memberCpf,
        competencia: due.competencia,
        valor: due.valor,
        pagoEm: due.pagoEm,
        formaPagamento: due.formaPagamento || 'OUTRO',
        observacoes: due.observacoes || ''
      };
    }),
    movimentos: movements.map(sanitizeCashMovement_),
    fechamentoExistente: existing ? sanitizeCashClosing_(existing) : null
  };
}


function buildCashBookReport_(payload) {
  payload = payload || {};
  var inicio = String(payload.inicio || '').trim();
  var fim = String(payload.fim || '').trim();
  var search = String(payload.search || '').trim().toLowerCase();
  var entries = [];
  var saldoAnterior = 0;

  validateDateInput_(inicio);
  validateDateInput_(fim);

  if (inicio > fim) {
    throw new Error('Período do livro caixa inválido.');
  }

  listDues_({}).forEach(function (due) {
    var status = resolveDueStatus_(due);
    var data = String(due.pagoEm || '').trim();
    var valor = Number(due.valor || 0);

    if (status !== 'PAGA' || !data || valor <= 0) {
      return;
    }

    if (data < inicio) {
      saldoAnterior += valor;
      return;
    }

    if (data > fim) {
      return;
    }

    entries.push({
      id: due.id,
      data: data,
      tipo: 'ENTRADA',
      origem: 'Mensalidade',
      categoria: 'Mensalidades',
      descricao: 'Mensalidade ' + formatCompetenciaBr_(due.competencia) + ' - ' + (due.memberNome || '-'),
      formaPagamento: normalizePaymentMethod_(due.formaPagamento || 'OUTRO'),
      entrada: round2_(valor),
      saida: 0,
      valor: round2_(valor),
      sortKey: data + '|1|' + String(due.memberNome || '') + '|' + String(due.id || '')
    });
  });

  listCashMovements_({}).forEach(function (movement) {
    var data = String(movement.data || '').trim();
    var valor = Number(movement.valor || 0);
    var delta = movement.tipo === 'SAIDA' ? -valor : valor;

    if (!data || valor <= 0) {
      return;
    }

    if (data < inicio) {
      saldoAnterior += delta;
      return;
    }

    if (data > fim) {
      return;
    }

    entries.push({
      id: movement.id,
      data: data,
      tipo: movement.tipo === 'SAIDA' ? 'SAIDA' : 'ENTRADA',
      origem: 'Caixa',
      categoria: movement.categoria || formatCashClassificationText_(movement.classificacao),
      descricao: movement.descricao || '-',
      formaPagamento: normalizePaymentMethod_(movement.formaPagamento || 'OUTRO'),
      entrada: movement.tipo === 'SAIDA' ? 0 : round2_(valor),
      saida: movement.tipo === 'SAIDA' ? round2_(valor) : 0,
      valor: round2_(valor),
      sortKey: data + '|2|' + String(movement.createdAt || '') + '|' + String(movement.id || '')
    });
  });

  if (search) {
    entries = entries.filter(function (entry) {
      return [
        entry.data,
        entry.tipo,
        entry.origem,
        entry.categoria,
        entry.descricao,
        entry.formaPagamento
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  entries.sort(function (a, b) {
    return String(a.sortKey).localeCompare(String(b.sortKey));
  });

  var totalEntradas = 0;
  var totalSaidas = 0;
  var runningBalance = round2_(saldoAnterior);

  entries = entries.map(function (entry) {
    totalEntradas += Number(entry.entrada || 0);
    totalSaidas += Number(entry.saida || 0);
    runningBalance = round2_(runningBalance + Number(entry.entrada || 0) - Number(entry.saida || 0));

    return {
      id: entry.id,
      data: entry.data,
      tipo: entry.tipo,
      origem: entry.origem,
      categoria: entry.categoria,
      descricao: entry.descricao,
      formaPagamento: entry.formaPagamento,
      entrada: entry.entrada,
      saida: entry.saida,
      saldo: runningBalance
    };
  });

  totalEntradas = round2_(totalEntradas);
  totalSaidas = round2_(totalSaidas);

  return {
    inicio: inicio,
    fim: fim,
    search: search,
    saldoAnterior: round2_(saldoAnterior),
    totalEntradas: totalEntradas,
    totalSaidas: totalSaidas,
    saldoPeriodo: round2_(totalEntradas - totalSaidas),
    saldoFinal: round2_(runningBalance),
    quantidadeLancamentos: entries.length,
    entries: entries
  };
}

function formatCashClassificationText_(value) {
  var labels = {
    RECEITA_OPERACIONAL: 'Receita operacional',
    CUSTO_FIXO: 'Custo fixo',
    CUSTO_VARIAVEL: 'Custo variável'
  };

  return labels[String(value || '').trim().toUpperCase()] || String(value || 'Sem categoria');
}


function saveCashClosing_(payload, username) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var summary = buildCashClosingSummary_(payload);
    var observacoes = String((payload && payload.observacoes) || '').trim();
    var existing = findCashClosingByPeriod_(summary.tipo, summary.periodoInicio, summary.periodoFim);
    var sheet = ensureSheet_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS);
    var now = new Date().toISOString();
    var closing = {
      id: existing && existing.id ? existing.id : generateId_(),
      tipo: summary.tipo,
      periodoInicio: summary.periodoInicio,
      periodoFim: summary.periodoFim,
      competencia: summary.competencia,
      totalRecebido: summary.totalRecebido,
      quantidadePagamentos: summary.quantidadePagamentos,
      pix: summary.porForma.PIX || 0,
      dinheiro: summary.porForma.DINHEIRO || 0,
      boleto: summary.porForma.BOLETO || 0,
      cartao: summary.porForma.CARTAO || 0,
      transferencia: summary.porForma.TRANSFERENCIA || 0,
      outro: summary.porForma.OUTRO || 0,
      observacoes: observacoes,
      closedBy: username,
      closedAt: now,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now,
      manualEntradas: summary.manualEntradas,
      totalEntradas: summary.totalEntradas,
      saidasFixas: summary.saidasFixas,
      saidasVariaveis: summary.saidasVariaveis,
      totalSaidas: summary.totalSaidas,
      saldoPeriodo: summary.saldoPeriodo
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, CASH_CLOSING_HEADERS.length).setValues([serializeCashClosing_(closing)]);
      seedAuditLog_('UPDATE_CASH_CLOSING', 'cash_closing', closing.id, closing.tipo + ' / ' + closing.periodoInicio + ' a ' + closing.periodoFim, username);
    } else {
      sheet.appendRow(serializeCashClosing_(closing));
      seedAuditLog_('CLOSE_CASH', 'cash_closing', closing.id, closing.tipo + ' / ' + closing.periodoInicio + ' a ' + closing.periodoFim, username);
    }

    return sanitizeCashClosing_(closing);
  } finally {
    lock.releaseLock();
  }
}


function listCashClosings_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS);
  var tipo = String((payload && payload.tipo) || '').trim().toUpperCase();
  var competencia = String((payload && payload.competencia) || '').trim();
  var inicio = String((payload && payload.inicio) || '').trim();
  var fim = String((payload && payload.fim) || '').trim();

  return rows.map(function (row, index) {
    return rowToCashClosing_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (tipo && item.tipo !== tipo) return false;
    if (competencia && item.competencia !== competencia) return false;
    if (inicio && item.periodoFim < inicio) return false;
    if (fim && item.periodoInicio > fim) return false;
    return true;
  }).sort(function (a, b) {
    return String(b.periodoInicio).localeCompare(String(a.periodoInicio));
  }).map(sanitizeCashClosing_);
}

function normalizeCashMovementType_(value) {
  var tipo = String(value || '').trim().toUpperCase();
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
    throw new Error('Tipo de movimentação inválido.');
  }
  return tipo;
}

function normalizeCashClassification_(tipo, value) {
  var classificacao = String(value || '').trim().toUpperCase();

  if (tipo === 'ENTRADA') {
    return 'RECEITA_OPERACIONAL';
  }

  if (classificacao !== 'CUSTO_FIXO' && classificacao !== 'CUSTO_VARIAVEL') {
    throw new Error('Classificação de saída inválida.');
  }

  return classificacao;
}

function normalizeCashMovementPayload_(payload) {
  payload = payload || {};
  var tipo = normalizeCashMovementType_(payload.tipo);
  var data = String(payload.data || '').trim();
  validateDateInput_(data);

  var valor = round2_(parseNumber_(payload.valor));
  if (valor <= 0) {
    throw new Error('Informe um valor maior que zero.');
  }

  var descricao = String(payload.descricao || '').trim();
  if (!descricao) {
    throw new Error('Informe a descrição do lançamento.');
  }

  return {
    id: String(payload.id || '').trim(),
    tipo: tipo,
    classificacao: normalizeCashClassification_(tipo, payload.classificacao),
    data: data,
    competencia: data.slice(0, 7),
    categoria: String(payload.categoria || '').trim(),
    descricao: descricao,
    formaPagamento: normalizePaymentMethod_(payload.formaPagamento || 'OUTRO'),
    valor: valor,
    observacoes: String(payload.observacoes || '').trim()
  };
}

function saveCashMovement_(payload, username) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var normalized = normalizeCashMovementPayload_(payload);
    var existing = normalized.id ? findCashMovementById_(normalized.id) : null;
    var sheet = ensureSheet_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS);
    var now = new Date().toISOString();
    var movement = {
      id: existing && existing.id ? existing.id : generateId_(),
      tipo: normalized.tipo,
      classificacao: normalized.classificacao,
      data: normalized.data,
      competencia: normalized.competencia,
      categoria: normalized.categoria,
      descricao: normalized.descricao,
      formaPagamento: normalized.formaPagamento,
      valor: normalized.valor,
      observacoes: normalized.observacoes,
      createdBy: existing && existing.createdBy ? existing.createdBy : username,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, CASH_MOVEMENT_HEADERS.length).setValues([serializeCashMovement_(movement)]);
      seedAuditLog_('UPDATE_CASH_MOVEMENT', 'cash_movement', movement.id, movement.tipo + ' / ' + movement.descricao, username);
    } else {
      sheet.appendRow(serializeCashMovement_(movement));
      seedAuditLog_('CREATE_CASH_MOVEMENT', 'cash_movement', movement.id, movement.tipo + ' / ' + movement.descricao, username);
    }

    return sanitizeCashMovement_(movement);
  } finally {
    lock.releaseLock();
  }
}

function deleteCashMovement_(id, username) {
  var movement = findCashMovementById_(id);
  if (!movement || !movement.rowNumber) {
    throw new Error('Lançamento de caixa não encontrado.');
  }

  ensureSheet_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS).deleteRow(movement.rowNumber);
  seedAuditLog_('DELETE_CASH_MOVEMENT', 'cash_movement', movement.id, movement.tipo + ' / ' + movement.descricao, username);

  return { deleted: true };
}

function listCashMovements_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS);
  var tipo = String((payload && payload.tipo) || '').trim().toUpperCase();
  var classificacao = String((payload && payload.classificacao) || '').trim().toUpperCase();
  var inicio = String((payload && payload.inicio) || '').trim();
  var fim = String((payload && payload.fim) || '').trim();
  var competencia = String((payload && payload.competencia) || '').trim();

  return rows.map(function (row, index) {
    return rowToCashMovement_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (tipo && item.tipo !== tipo) return false;
    if (classificacao && item.classificacao !== classificacao) return false;
    if (competencia && item.competencia !== competencia) return false;
    if (inicio && item.data < inicio) return false;
    if (fim && item.data > fim) return false;
    return true;
  }).sort(function (a, b) {
    return String(b.data).localeCompare(String(a.data)) || String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function listCashMovementsForPeriod_(period) {
  return listCashMovements_({
    inicio: period.periodoInicio,
    fim: period.periodoFim
  });
}

function findCashMovementById_(id) {
  var targetId = String(id || '').trim();
  if (!targetId) return null;

  var rows = getSheetRows_(SIND_SHEETS.CASH_MOVEMENTS, CASH_MOVEMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToCashMovement_(row, index + 2);
    if (item.id === targetId) {
      found = item;
    }
  });

  return found;
}

function buildCashMovementTotals_(movements) {
  var totals = {
    entradas: 0,
    saidasFixas: 0,
    saidasVariaveis: 0,
    totalSaidas: 0,
    porFormaEntradas: {
      PIX: 0,
      DINHEIRO: 0,
      BOLETO: 0,
      CARTAO: 0,
      TRANSFERENCIA: 0,
      OUTRO: 0
    }
  };

  movements.forEach(function (movement) {
    var value = Number(movement.valor || 0);
    var method = normalizePaymentMethod_(movement.formaPagamento || 'OUTRO');

    if (movement.tipo === 'ENTRADA') {
      totals.entradas += value;
      totals.porFormaEntradas[method] += value;
      return;
    }

    if (movement.classificacao === 'CUSTO_FIXO') {
      totals.saidasFixas += value;
    } else {
      totals.saidasVariaveis += value;
    }
  });

  totals.entradas = round2_(totals.entradas);
  totals.saidasFixas = round2_(totals.saidasFixas);
  totals.saidasVariaveis = round2_(totals.saidasVariaveis);
  totals.totalSaidas = round2_(totals.saidasFixas + totals.saidasVariaveis);

  Object.keys(totals.porFormaEntradas).forEach(function (key) {
    totals.porFormaEntradas[key] = round2_(totals.porFormaEntradas[key]);
  });

  return totals;
}

function mergePaymentMethods_(base, additional) {
  var result = {
    PIX: 0,
    DINHEIRO: 0,
    BOLETO: 0,
    CARTAO: 0,
    TRANSFERENCIA: 0,
    OUTRO: 0
  };

  Object.keys(result).forEach(function (key) {
    result[key] = round2_(Number((base && base[key]) || 0) + Number((additional && additional[key]) || 0));
  });

  return result;
}

function sanitizeCashMovement_(movement) {
  return {
    id: movement.id,
    tipo: movement.tipo,
    classificacao: movement.classificacao,
    data: movement.data,
    competencia: movement.competencia,
    categoria: movement.categoria,
    descricao: movement.descricao,
    formaPagamento: movement.formaPagamento,
    valor: movement.valor,
    observacoes: movement.observacoes,
    createdBy: movement.createdBy,
    createdAt: movement.createdAt,
    updatedAt: movement.updatedAt
  };
}

function rowToCashMovement_(row, rowNumber) {
  row = normalizeRow_(row, CASH_MOVEMENT_HEADERS.length);
  return {
    id: row[0] || '',
    tipo: row[1] || '',
    classificacao: row[2] || '',
    data: row[3] || '',
    competencia: row[4] || '',
    categoria: row[5] || '',
    descricao: row[6] || '',
    formaPagamento: row[7] || '',
    valor: parseNumber_(row[8] || 0),
    observacoes: row[9] || '',
    createdBy: row[10] || '',
    createdAt: row[11] || '',
    updatedAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function serializeCashMovement_(movement) {
  return [
    movement.id || '',
    movement.tipo || '',
    movement.classificacao || '',
    movement.data || '',
    movement.competencia || '',
    movement.categoria || '',
    movement.descricao || '',
    movement.formaPagamento || '',
    round2_(Number(movement.valor || 0)),
    movement.observacoes || '',
    movement.createdBy || '',
    movement.createdAt || '',
    movement.updatedAt || ''
  ];
}


function normalizePayableStatus_(value) {
  var status = String(value || 'PENDENTE').trim().toUpperCase();
  return status === 'PAGA' ? 'PAGA' : 'PENDENTE';
}

function normalizePayablePayload_(payload) {
  payload = payload || {};

  var descricao = String(payload.descricao || '').trim();
  if (!descricao) {
    throw new Error('Informe a descrição da conta a pagar.');
  }

  var vencimento = String(payload.vencimento || '').trim();
  validateDateInput_(vencimento);

  var valor = round2_(parseNumber_(payload.valor));
  if (valor <= 0) {
    throw new Error('Informe um valor maior que zero.');
  }

  var classificacao = normalizeCashClassification_('SAIDA', payload.classificacao);
  var categoria = String(payload.categoria || '').trim();
  if (!categoria) {
    throw new Error('Informe a categoria da conta a pagar.');
  }

  return {
    id: String(payload.id || '').trim(),
    descricao: descricao,
    fornecedor: String(payload.fornecedor || '').trim(),
    classificacao: classificacao,
    categoria: categoria,
    valor: valor,
    vencimento: vencimento,
    competencia: vencimento.slice(0, 7),
    status: normalizePayableStatus_(payload.status),
    pagoEm: String(payload.pagoEm || '').trim(),
    formaPagamento: normalizePaymentMethod_(payload.formaPagamento || 'OUTRO'),
    observacoes: String(payload.observacoes || '').trim()
  };
}

function rowToPayable_(row, rowNumber) {
  row = normalizeRow_(row, PAYABLE_HEADERS.length);
  return {
    id: row[0] || '',
    descricao: row[1] || '',
    fornecedor: row[2] || '',
    classificacao: row[3] || '',
    categoria: row[4] || '',
    valor: parseNumber_(row[5] || 0),
    vencimento: row[6] || '',
    competencia: row[7] || '',
    status: normalizePayableStatus_(row[8]),
    pagoEm: row[9] || '',
    formaPagamento: row[10] || '',
    observacoes: row[11] || '',
    createdBy: row[12] || '',
    createdAt: row[13] || '',
    updatedAt: row[14] || '',
    paidBy: row[15] || '',
    paidAt: row[16] || '',
    rowNumber: rowNumber
  };
}

function serializePayable_(payable) {
  return [
    payable.id || '',
    payable.descricao || '',
    payable.fornecedor || '',
    payable.classificacao || '',
    payable.categoria || '',
    round2_(Number(payable.valor || 0)),
    payable.vencimento || '',
    payable.competencia || '',
    normalizePayableStatus_(payable.status),
    payable.pagoEm || '',
    payable.formaPagamento || '',
    payable.observacoes || '',
    payable.createdBy || '',
    payable.createdAt || '',
    payable.updatedAt || '',
    payable.paidBy || '',
    payable.paidAt || ''
  ];
}

function sanitizePayable_(payable) {
  return {
    id: payable.id,
    descricao: payable.descricao,
    fornecedor: payable.fornecedor,
    classificacao: payable.classificacao,
    categoria: payable.categoria,
    valor: payable.valor,
    vencimento: payable.vencimento,
    competencia: payable.competencia,
    status: normalizePayableStatus_(payable.status),
    pagoEm: payable.pagoEm,
    formaPagamento: payable.formaPagamento,
    observacoes: payable.observacoes,
    createdBy: payable.createdBy,
    createdAt: payable.createdAt,
    updatedAt: payable.updatedAt,
    paidBy: payable.paidBy,
    paidAt: payable.paidAt
  };
}

function findPayableById_(id) {
  var targetId = String(id || '').trim();
  if (!targetId) return null;

  var rows = getSheetRows_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToPayable_(row, index + 2);
    if (item.id === targetId) {
      found = item;
    }
  });

  return found;
}

function listPayables_(payload) {
  payload = payload || {};
  var rows = getSheetRows_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS);
  var competencia = String(payload.competencia || '').trim();
  var status = String(payload.status || '').trim().toUpperCase();
  var classificacao = String(payload.classificacao || '').trim().toUpperCase();
  var inicio = String(payload.inicio || '').trim();
  var fim = String(payload.fim || '').trim();

  return rows.map(function (row, index) {
    return rowToPayable_(row, index + 2);
  }).filter(function (item) {
    if (!item.id) return false;
    if (competencia && item.competencia !== competencia) return false;
    if (status && normalizePayableStatus_(item.status) !== status) return false;
    if (classificacao && item.classificacao !== classificacao) return false;
    if (inicio && item.vencimento < inicio) return false;
    if (fim && item.vencimento > fim) return false;
    return true;
  }).sort(function (a, b) {
    return String(a.vencimento || '').localeCompare(String(b.vencimento || '')) ||
      String(a.descricao || '').localeCompare(String(b.descricao || ''));
  });
}

function savePayable_(payload, username) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var normalized = normalizePayablePayload_(payload);
    var existing = normalized.id ? findPayableById_(normalized.id) : null;

    if (existing && normalizePayableStatus_(existing.status) === 'PAGA') {
      throw new Error('Conta já baixada não pode ser alterada.');
    }

    var sheet = ensureSheet_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS);
    var now = new Date().toISOString();
    var payable = {
      id: existing && existing.id ? existing.id : generateId_(),
      descricao: normalized.descricao,
      fornecedor: normalized.fornecedor,
      classificacao: normalized.classificacao,
      categoria: normalized.categoria,
      valor: normalized.valor,
      vencimento: normalized.vencimento,
      competencia: normalized.competencia,
      status: 'PENDENTE',
      pagoEm: '',
      formaPagamento: normalized.formaPagamento,
      observacoes: normalized.observacoes,
      createdBy: existing && existing.createdBy ? existing.createdBy : username,
      createdAt: existing && existing.createdAt ? existing.createdAt : now,
      updatedAt: now,
      paidBy: '',
      paidAt: ''
    };

    if (existing && existing.rowNumber) {
      sheet.getRange(existing.rowNumber, 1, 1, PAYABLE_HEADERS.length).setValues([serializePayable_(payable)]);
      seedAuditLog_('UPDATE_PAYABLE', 'payable', payable.id, payable.descricao, username);
    } else {
      sheet.appendRow(serializePayable_(payable));
      seedAuditLog_('CREATE_PAYABLE', 'payable', payable.id, payable.descricao, username);
    }

    return sanitizePayable_(payable);
  } finally {
    lock.releaseLock();
  }
}

function markPayablePaid_(payload, username) {
  payload = payload || {};
  var payable = findPayableById_(payload.id);

  if (!payable || !payable.rowNumber) {
    throw new Error('Conta a pagar não encontrada.');
  }

  if (normalizePayableStatus_(payable.status) === 'PAGA') {
    throw new Error('Conta a pagar já foi baixada.');
  }

  var pagoEm = String(payload.pagoEm || currentDateStr_()).trim();
  validateDateInput_(pagoEm);

  payable.status = 'PAGA';
  payable.pagoEm = pagoEm;
  payable.formaPagamento = normalizePaymentMethod_(payload.formaPagamento || payable.formaPagamento || 'OUTRO');
  payable.updatedAt = new Date().toISOString();
  payable.paidBy = username;
  payable.paidAt = payable.updatedAt;

  ensureSheet_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS)
    .getRange(payable.rowNumber, 1, 1, PAYABLE_HEADERS.length)
    .setValues([serializePayable_(payable)]);

  var movement = saveCashMovement_({
    tipo: 'SAIDA',
    classificacao: payable.classificacao,
    data: payable.pagoEm,
    categoria: payable.categoria,
    descricao: 'Pagamento - ' + payable.descricao,
    formaPagamento: payable.formaPagamento,
    valor: payable.valor,
    observacoes: 'Baixa da conta a pagar: ' + payable.descricao
  }, username);

  seedAuditLog_('PAY_PAYABLE', 'payable', payable.id, payable.descricao, username);

  return {
    payable: sanitizePayable_(payable),
    movement: movement
  };
}

function deletePayable_(id, username) {
  var payable = findPayableById_(id);

  if (!payable || !payable.rowNumber) {
    throw new Error('Conta a pagar não encontrada.');
  }

  if (normalizePayableStatus_(payable.status) === 'PAGA') {
    throw new Error('Conta já baixada não pode ser excluída.');
  }

  ensureSheet_(SIND_SHEETS.PAYABLES, PAYABLE_HEADERS).deleteRow(payable.rowNumber);
  seedAuditLog_('DELETE_PAYABLE', 'payable', payable.id, payable.descricao, username);

  return { deleted: true };
}


function buildCashTotals_(payments) {
  var totals = {
    totalRecebido: 0,
    quantidadePagamentos: 0,
    porForma: {
      PIX: 0,
      DINHEIRO: 0,
      BOLETO: 0,
      CARTAO: 0,
      TRANSFERENCIA: 0,
      OUTRO: 0
    }
  };

  payments.forEach(function (due) {
    var method = normalizePaymentMethod_(due.formaPagamento);
    var value = Number(due.valor || 0);
    totals.totalRecebido += value;
    totals.quantidadePagamentos += 1;
    totals.porForma[method] += value;
  });

  totals.totalRecebido = round2_(totals.totalRecebido);
  Object.keys(totals.porForma).forEach(function (key) {
    totals.porForma[key] = round2_(totals.porForma[key]);
  });

  return totals;
}

function normalizeCashPeriod_(payload) {
  var tipo = String((payload && payload.tipo) || 'DIARIO').trim().toUpperCase();
  var data = String((payload && payload.data) || '').trim();
  var competencia = String((payload && payload.competencia) || '').trim();

  if (tipo !== 'DIARIO' && tipo !== 'MENSAL') {
    throw new Error('Tipo de fechamento inválido.');
  }

  if (tipo === 'MENSAL') {
    validateCompetencia_(competencia);
    return {
      tipo: tipo,
      periodoInicio: competencia + '-01',
      periodoFim: lastDayOfMonthStr_(competencia),
      competencia: competencia
    };
  }

  validateDateInput_(data);
  return {
    tipo: tipo,
    periodoInicio: data,
    periodoFim: data,
    competencia: data.slice(0, 7)
  };
}

function normalizePaymentMethod_(value) {
  var method = String(value || 'OUTRO').trim().toUpperCase();
  if (['PIX', 'DINHEIRO', 'BOLETO', 'CARTAO', 'TRANSFERENCIA'].indexOf(method) >= 0) {
    return method;
  }
  return 'OUTRO';
}

function sanitizeCashClosing_(closing) {
  return {
    id: closing.id,
    tipo: closing.tipo,
    periodoInicio: closing.periodoInicio,
    periodoFim: closing.periodoFim,
    competencia: closing.competencia,
    totalRecebido: closing.totalRecebido,
    quantidadePagamentos: closing.quantidadePagamentos,
    manualEntradas: closing.manualEntradas || 0,
    totalEntradas: closing.totalEntradas || closing.totalRecebido || 0,
    saidasFixas: closing.saidasFixas || 0,
    saidasVariaveis: closing.saidasVariaveis || 0,
    totalSaidas: closing.totalSaidas || 0,
    saldoPeriodo: closing.saldoPeriodo || closing.totalRecebido || 0,
    porForma: {
      PIX: closing.pix,
      DINHEIRO: closing.dinheiro,
      BOLETO: closing.boleto,
      CARTAO: closing.cartao,
      TRANSFERENCIA: closing.transferencia,
      OUTRO: closing.outro
    },
    observacoes: closing.observacoes,
    closedBy: closing.closedBy,
    closedAt: closing.closedAt,
    createdAt: closing.createdAt,
    updatedAt: closing.updatedAt
  };
}


function buildMemberHistory_(memberId, session) {
  memberId = String(memberId || '').trim();
  if (!memberId) {
    throw new Error('Informe o associado.');
  }

  var member = findMemberById_(memberId);
  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  var dues = hasPermission_(session, 'dues.read') ? listDues_({ memberId: memberId }) : [];
  var documents = hasPermission_(session, 'documents.read') ? listDocuments_({ memberId: memberId }) : [];
  var attachments = hasPermission_(session, 'attachments.read') ? listAttachments_({ memberId: memberId }) : [];
  var auditLogs = hasPermission_(session, 'audit.read')
    ? listAuditLogs_(300).filter(function (item) {
      return auditLogMatchesMember_(item, member);
    }).slice(0, 80)
    : [];

  var summary = dues.reduce(function (totals, due) {
    if (due.status !== 'CANCELADA') {
      totals.totalLancado += Number(due.valor || 0);
    }
    if (due.status === 'PAGA') {
      totals.totalPago += Number(due.valor || 0);
      totals.quantidadePagas += 1;
    } else if (due.status === 'ATRASADA') {
      totals.totalAtrasado += Number(due.valor || 0);
      totals.quantidadeAtrasadas += 1;
    } else if (due.status === 'ABERTA') {
      totals.totalAberto += Number(due.valor || 0);
      totals.quantidadeAbertas += 1;
    }
    totals.quantidadeMensalidades += 1;
    return totals;
  }, {
    totalLancado: 0,
    totalPago: 0,
    totalAberto: 0,
    totalAtrasado: 0,
    quantidadeMensalidades: 0,
    quantidadePagas: 0,
    quantidadeAbertas: 0,
    quantidadeAtrasadas: 0,
    quantidadeDocumentos: documents.length,
    quantidadeAnexos: attachments.length,
    quantidadeAuditoria: auditLogs.length
  });

  summary.totalLancado = round2_(summary.totalLancado);
  summary.totalPago = round2_(summary.totalPago);
  summary.totalAberto = round2_(summary.totalAberto);
  summary.totalAtrasado = round2_(summary.totalAtrasado);

  return {
    member: member,
    summary: summary,
    dues: dues,
    documents: documents,
    attachments: attachments,
    auditLogs: auditLogs,
    permissions: {
      dues: hasPermission_(session, 'dues.read'),
      documents: hasPermission_(session, 'documents.read'),
      attachments: hasPermission_(session, 'attachments.read'),
      attachmentsWrite: hasPermission_(session, 'attachments.write'),
      audit: hasPermission_(session, 'audit.read')
    }
  };
}

function auditLogMatchesMember_(log, member) {
  var details = String(log.details || '').toLowerCase();
  var entityId = String(log.entityId || '');
  var nome = String(member.nome || '').toLowerCase();
  var cpf = digitsOnly_(member.cpf || '');
  var detailsDigits = digitsOnly_(details);

  return entityId === member.id ||
    (nome && details.indexOf(nome) >= 0) ||
    (cpf && detailsDigits.indexOf(cpf) >= 0);
}

function listDocuments_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  var items = rows.map(function (row, index) {
    return rowToDocument_(row, index + 2);
  }).filter(function (item) {
    return item.id && item.numero;
  });

  var search = String((payload && payload.search) || '').trim().toLowerCase();
  var tipo = String((payload && payload.tipo) || '').trim();
  var ano = String((payload && payload.ano) || '').trim();
  var memberId = String((payload && payload.memberId) || '').trim();

  return items.filter(function (item) {
    if (memberId && item.memberId !== memberId) {
      return false;
    }

    if (tipo && item.tipo !== tipo) {
      return false;
    }

    if (ano && String(item.competencia || '').slice(0, 4) !== ano && String(item.createdAt || '').slice(0, 4) !== ano) {
      return false;
    }

    if (!search) {
      return true;
    }

    return [
      item.numero,
      item.tipo,
      item.memberNome,
      item.competencia,
      item.descricao
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function downloadDocument_(documentId) {
  var doc = findDocumentById_(documentId);
  if (!doc) {
    throw new Error('Documento não encontrado.');
  }

  var file = DriveApp.getFileById(doc.driveFileId);
  var blob = file.getBlob();
  return {
    documentId: doc.id,
    numero: doc.numero,
    tipo: doc.tipo,
    fileName: file.getName(),
    mimeType: blob.getContentType(),
    base64Content: Utilities.base64Encode(blob.getBytes())
  };
}

function listAttachments_(payload) {
  var rows = getSheetRows_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS);
  var memberId = String((payload && payload.memberId) || '').trim();
  var search = String((payload && payload.search) || '').trim().toLowerCase();

  return rows.map(function (row, index) {
    return rowToAttachment_(row, index + 2);
  }).filter(function (item) {
    if (!item.id || !item.memberId) {
      return false;
    }
    if (memberId && item.memberId !== memberId) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [
      item.memberNome,
      item.tipo,
      item.descricao,
      item.driveFileName
    ].join(' ').toLowerCase().indexOf(search) >= 0;
  }).sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function uploadAttachment_(payload, username) {
  var data = normalizeAttachmentPayload_(payload);
  var member = findMemberById_(data.memberId);
  var bytes;
  var blob;
  var file;
  var attachment;

  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  bytes = Utilities.base64Decode(data.base64Content);
  if (bytes.length > 10 * 1024 * 1024) {
    throw new Error('Anexo muito grande. O limite é 10 MB.');
  }

  blob = Utilities.newBlob(bytes, data.mimeType || 'application/octet-stream', data.fileName);
  file = getPdfFolder_().createFile(blob);
  attachment = {
    id: generateId_(),
    memberId: member.id,
    memberNome: member.nome,
    tipo: data.tipo,
    descricao: data.descricao,
    driveFileId: file.getId(),
    driveFileName: file.getName(),
    mimeType: file.getMimeType(),
    tamanhoBytes: bytes.length,
    createdBy: username,
    createdAt: new Date().toISOString()
  };

  ensureSheet_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS).appendRow(serializeAttachment_(attachment));
  seedAuditLog_('ATTACHMENT_UPLOAD', 'attachment', attachment.id, attachment.memberNome + ' / ' + attachment.driveFileName, username);
  return attachment;
}

function downloadAttachment_(attachmentId) {
  var attachment = findAttachmentById_(attachmentId);
  var file;
  var blob;

  if (!attachment) {
    throw new Error('Anexo não encontrado.');
  }

  file = DriveApp.getFileById(attachment.driveFileId);
  blob = file.getBlob();
  return {
    attachmentId: attachment.id,
    fileName: file.getName(),
    mimeType: blob.getContentType(),
    base64Content: Utilities.base64Encode(blob.getBytes())
  };
}

function listAuditLogs_(limit) {
  var rows = getSheetRows_(SIND_SHEETS.AUDIT, AUDIT_HEADERS);
  var max = Math.max(1, Math.min(Number(limit || 150), 500));
  return rows.map(function (row) {
    return {
      timestamp: row[0] || '',
      username: row[1] || '',
      action: row[2] || '',
      entity: row[3] || '',
      entityId: row[4] || '',
      details: row[5] || ''
    };
  }).reverse().slice(0, max);
}

function listUsers_() {
  var rows = getSheetRows_(SIND_SHEETS.USERS, USER_HEADERS);
  return rows.map(function (row, index) {
    return rowToUser_(row, index + 2);
  }).filter(function (item) {
    return item.id && item.username;
  }).sort(function (a, b) {
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

function saveUser_(payload, actorUsername) {
  var data = normalizeUserPayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var sheet = ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS);
    var users = listUsers_();
    var duplicate = users.find(function (item) {
      return item.username.toLowerCase() === data.username.toLowerCase() && item.id !== data.id;
    });

    if (duplicate) {
      throw new Error('Já existe usuário com este login.');
    }

    var now = new Date().toISOString();

    if (data.id) {
      var existing = findUserById_(data.id);
      if (!existing || !existing.rowNumber) {
        throw new Error('Usuário não encontrado.');
      }

      var updated = {
        id: existing.id,
        nome: data.nome,
        username: data.username,
        passwordHash: data.password ? sha256_(data.password) : existing.passwordHash,
        role: data.role,
        status: data.status,
        createdAt: existing.createdAt,
        updatedAt: now
      };

      sheet.getRange(existing.rowNumber, 1, 1, USER_HEADERS.length).setValues([serializeUser_(updated)]);
      seedAuditLog_('UPDATE', 'user', updated.id, updated.username + ' / ' + updated.role, actorUsername);
      return sanitizeUser_(updated);
    }

    if (!data.password) {
      throw new Error('Informe a senha inicial do usuário.');
    }

    var created = {
      id: generateId_(),
      nome: data.nome,
      username: data.username,
      passwordHash: sha256_(data.password),
      role: data.role,
      status: data.status,
      createdAt: now,
      updatedAt: now
    };

    sheet.appendRow(serializeUser_(created));
    seedAuditLog_('CREATE', 'user', created.id, created.username + ' / ' + created.role, actorUsername);
    return sanitizeUser_(created);
  } finally {
    lock.releaseLock();
  }
}

function toggleUserStatus_(userId, actorUsername) {
  var user = findUserById_(userId);
  if (!user || !user.rowNumber) {
    throw new Error('Usuário não encontrado.');
  }

  if (user.username === String(actorUsername || '').trim()) {
    throw new Error('Você não pode inativar o próprio usuário.');
  }

  user.status = user.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
  user.updatedAt = new Date().toISOString();

  ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS)
    .getRange(user.rowNumber, 1, 1, USER_HEADERS.length)
    .setValues([serializeUser_(user)]);

  seedAuditLog_('STATUS', 'user', user.id, user.username + ' / ' + user.status, actorUsername);
  return sanitizeUser_(user);
}

function changePassword_(session, payload) {
  var currentPassword = String(payload.currentPassword || '');
  var newPassword = String(payload.newPassword || '');
  var confirmPassword = String(payload.confirmPassword || '');

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('Preencha a senha atual, a nova senha e a confirmação.');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('A confirmação da senha não confere.');
  }

  if (newPassword.length < 6) {
    throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
  }

  var user = findUserById_(session.userId);
  if (!user || !user.rowNumber) {
    throw new Error('Usuário não encontrado.');
  }

  if (user.passwordHash !== sha256_(currentPassword)) {
    throw new Error('Senha atual incorreta.');
  }

  user.passwordHash = sha256_(newPassword);
  user.updatedAt = new Date().toISOString();

  ensureSheet_(SIND_SHEETS.USERS, USER_HEADERS)
    .getRange(user.rowNumber, 1, 1, USER_HEADERS.length)
    .setValues([serializeUser_(user)]);

  seedAuditLog_('PASSWORD_CHANGE', 'user', user.id, user.username, session.username);
  return { ok: true };
}

function exportCsv_(payload, session) {
  var type = String(payload.type || '').trim();
  var fileName = '';
  var rows = [];

  if (type === 'members') {
    requirePermission_(session, 'members.read');
    fileName = 'associados.csv';
    rows = [MEMBER_HEADERS].concat(listMembers_({}).map(serializeMember_));
  } else if (type === 'dues') {
    requirePermission_(session, 'dues.read');
    fileName = 'mensalidades-' + String(payload.dueCompetencia || currentMonth_()) + '.csv';
    rows = [DUE_HEADERS].concat(listDues_({
      competencia: payload.dueCompetencia,
      status: payload.dueStatus,
      search: payload.dueSearch
    }).map(serializeDue_));
  } else if (type === 'documents') {
    requirePermission_(session, 'documents.read');
    fileName = 'documentos.csv';
    rows = [DOCUMENT_HEADERS].concat(listDocuments_({
      search: payload.documentSearch,
      tipo: payload.documentType,
      ano: payload.documentYear
    }).map(serializeDocument_));
  } else if (type === 'monthly_report') {
    requirePermission_(session, 'reports.read');
    var report = buildMonthlyReport_(String(payload.competencia || currentMonth_()));
    fileName = 'relatorio-' + report.competencia + '.csv';
    rows = [
      ['competencia', report.competencia],
      ['totalLancado', report.totalLancado],
      ['totalPago', report.totalPago],
      ['totalAberto', report.totalAberto],
      ['totalAtrasado', report.totalAtrasado],
      ['quantidadePagos', report.quantidadePagos],
      ['quantidadeEmAberto', report.quantidadeEmAberto],
      ['quantidadeAtrasados', report.quantidadeAtrasados],
      [],
      DUE_HEADERS
    ].concat(report.itens.map(serializeDue_));
  } else if (type === 'financial_dashboard') {
    requirePermission_(session, 'reports.read');
    var dashboard = buildFinancialDashboard_({
      inicio: payload.financialInicio,
      fim: payload.financialFim,
      status: payload.financialStatus,
      search: payload.financialSearch
    });
    fileName = 'financeiro-' + dashboard.inicio + '-a-' + dashboard.fim + '.csv';
    rows = [
      ['inicio', dashboard.inicio],
      ['fim', dashboard.fim],
      ['totalLancado', dashboard.totals.totalLancado],
      ['totalPago', dashboard.totals.totalPago],
      ['totalAberto', dashboard.totals.totalAberto],
      ['totalAtrasado', dashboard.totals.totalAtrasado],
      ['quantidade', dashboard.totals.quantidade],
      [],
      ['competencia', 'totalLancado', 'totalPago', 'totalAberto', 'totalAtrasado', 'quantidade']
    ].concat(dashboard.arrecadacaoMensal.map(function (item) {
      return [
        item.competencia,
        item.totalLancado,
        item.totalPago,
        item.totalAberto,
        item.totalAtrasado,
        item.quantidade
      ];
    })).concat([
      [],
      ['Inadimplentes'],
      ['nome', 'cpf', 'mensalidades', 'ultimaCompetencia', 'total']
    ]).concat(dashboard.inadimplentes.map(function (item) {
      return [
        item.memberNome,
        item.memberCpf,
        item.quantidade,
        item.ultimaCompetencia,
        item.total
      ];
    })).concat([
      [],
      DUE_HEADERS
    ]).concat(dashboard.itens.map(serializeDue_));
  } else if (type === 'cash_closings') {
    requirePermission_(session, 'cash.read');
    fileName = 'fechamentos-caixa.csv';
    rows = [CASH_CLOSING_HEADERS].concat(listCashClosings_({
      tipo: payload.cashTipo,
      competencia: payload.cashCompetencia,
      inicio: payload.cashInicio,
      fim: payload.cashFim
    }).map(function (item) {
      return serializeCashClosing_({
        id: item.id,
        tipo: item.tipo,
        periodoInicio: item.periodoInicio,
        periodoFim: item.periodoFim,
        competencia: item.competencia,
        totalRecebido: item.totalRecebido,
        quantidadePagamentos: item.quantidadePagamentos,
        pix: item.porForma.PIX,
        dinheiro: item.porForma.DINHEIRO,
        boleto: item.porForma.BOLETO,
        cartao: item.porForma.CARTAO,
        transferencia: item.porForma.TRANSFERENCIA,
        outro: item.porForma.OUTRO,
        observacoes: item.observacoes,
        closedBy: item.closedBy,
        closedAt: item.closedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        manualEntradas: item.manualEntradas,
        totalEntradas: item.totalEntradas,
        saidasFixas: item.saidasFixas,
        saidasVariaveis: item.saidasVariaveis,
        totalSaidas: item.totalSaidas,
        saldoPeriodo: item.saldoPeriodo
      });
    }));
  } else if (type === 'cash_book') {
    requirePermission_(session, 'cash.read');
    var cashBook = buildCashBookReport_({
      inicio: payload.cashBookInicio,
      fim: payload.cashBookFim,
      search: payload.cashBookSearch
    });
    fileName = 'livro-caixa-' + cashBook.inicio + '-a-' + cashBook.fim + '.csv';
    rows = [
      ['Livro caixa'],
      ['inicio', cashBook.inicio],
      ['fim', cashBook.fim],
      ['saldoAnterior', cashBook.saldoAnterior],
      ['totalEntradas', cashBook.totalEntradas],
      ['totalSaidas', cashBook.totalSaidas],
      ['saldoPeriodo', cashBook.saldoPeriodo],
      ['saldoFinal', cashBook.saldoFinal],
      [],
      ['data', 'tipo', 'origem', 'categoria', 'descricao', 'formaPagamento', 'entrada', 'saida', 'saldo']
    ].concat(cashBook.entries.map(function (entry) {
      return [
        entry.data,
        entry.tipo,
        entry.origem,
        entry.categoria,
        entry.descricao,
        entry.formaPagamento,
        entry.entrada,
        entry.saida,
        entry.saldo
      ];
    }));
  } else if (type === 'users') {
    requirePermission_(session, 'users.manage');
    fileName = 'usuarios.csv';
    rows = [['id', 'nome', 'username', 'role', 'status', 'createdAt', 'updatedAt']].concat(listUsers_().map(function (item) {
      return [
        item.id,
        item.nome,
        item.username,
        item.role,
        item.status,
        item.createdAt,
        item.updatedAt
      ];
    }));
  } else {
    throw new Error('Tipo de exportação inválido.');
  }

  var csv = rows.map(function (row) {
    return (row || []).map(csvEscape_).join(';');
  }).join('\n');

  return {
    fileName: fileName,
    mimeType: 'text/csv;charset=utf-8',
    base64Content: Utilities.base64Encode(Utilities.newBlob('\ufeff' + csv, 'text/csv', fileName).getBytes())
  };
}

function issueReceipt_(dueId, username) {
  var due = findDueById_(dueId);
  if (!due) {
    throw new Error('Mensalidade não encontrada.');
  }

  if (resolveDueStatus_(due) !== 'PAGA') {
    throw new Error('Recibo disponível apenas para mensalidade paga.');
  }

  var member = findMemberById_(due.memberId);
  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  var existing = findDocumentByDueAndType_(due.id, DOCUMENT_TYPES.RECEIPT);
  if (existing) {
    return downloadDocument_(existing.id);
  }

  var numero = nextDocumentNumber_('REC');
  var docTitle = numero + ' - ' + member.nome;
  var lines = [
    getUnionName_(),
    'RECIBO DE MENSALIDADE SINDICAL',
    '',
    'Recibo nº: ' + numero,
    'Emitido em: ' + formatDateTimeBr_(new Date()),
    '',
    'Recebemos de: ' + member.nome,
    'CPF: ' + formatCpf_(member.cpf),
    'Empresa: ' + (member.empresa || '-'),
    '',
    'Competência: ' + formatCompetenciaBr_(due.competencia),
    'Valor pago: ' + formatCurrencyBr_(due.valor),
    'Data do pagamento: ' + formatDateBr_(due.pagoEm),
    'Forma de pagamento: ' + (due.formaPagamento || '-'),
    '',
    'Declaramos, para os devidos fins, que o valor acima foi recebido a título de mensalidade sindical.',
    '',
    'Assinatura eletrônica:',
    getUnionName_()
  ];

  var pdfFile = createPdfFile_(docTitle, lines);
  var record = saveDocumentRecord_({
    tipo: DOCUMENT_TYPES.RECEIPT,
    numero: numero,
    memberId: member.id,
    memberNome: member.nome,
    dueId: due.id,
    competencia: due.competencia,
    descricao: 'Recibo da mensalidade ' + due.competencia + ' - ' + member.nome,
    driveFileId: pdfFile.getId(),
    driveFileName: pdfFile.getName(),
    mimeType: pdfFile.getMimeType(),
    createdBy: username
  }, username);

  return documentResponse_(record, pdfFile);
}

function issueMemberDeclaration_(memberId, username) {
  var member = findMemberById_(memberId);
  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  var numero = nextDocumentNumber_('DEC');
  var docTitle = numero + ' - ' + member.nome;
  var lines = [
    getUnionName_(),
    'DECLARAÇÃO DE FILIAÇÃO',
    '',
    'Declara-se, para os devidos fins, que ' + member.nome + ', CPF ' + formatCpf_(member.cpf) + ',',
    'encontra-se cadastrado(a) na ACEAP com status atual "' + member.status + '".',
    '',
    'Empresa: ' + (member.empresa || '-'),
    'Cargo: ' + (member.cargo || '-'),
    'Data de filiação: ' + formatDateBr_(member.dataFiliacao),
    '',
    'Além Paraíba - MG, ' + formatDateExtensoBr_(new Date()),
    '',
    'Assinatura eletrônica:',
    getUnionName_()
  ];

  var pdfFile = createPdfFile_(docTitle, lines);
  var record = saveDocumentRecord_({
    tipo: DOCUMENT_TYPES.AFFILIATION,
    numero: numero,
    memberId: member.id,
    memberNome: member.nome,
    dueId: '',
    competencia: '',
    descricao: 'Declaração de filiação - ' + member.nome,
    driveFileId: pdfFile.getId(),
    driveFileName: pdfFile.getName(),
    mimeType: pdfFile.getMimeType(),
    createdBy: username
  }, username);

  return documentResponse_(record, pdfFile);
}

function issueMemberFicha_(memberId, username) {
  var member = findMemberById_(memberId);
  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  var numero = nextDocumentNumber_('FIC');
  var docTitle = numero + ' - ' + member.nome;
  var lines = [
    getUnionName_(),
    'FICHA CADASTRAL DO SINDICALIZADO',
    '',
    'Número do documento: ' + numero,
    'Emitido em: ' + formatDateTimeBr_(new Date()),
    '',
    'Nome: ' + member.nome,
    'CPF: ' + formatCpf_(member.cpf),
    'RG: ' + (member.rg || '-'),
    'Data de nascimento: ' + formatDateBr_(member.dataNascimento),
    'E-mail: ' + (member.email || '-'),
    'Telefone: ' + formatPhoneBr_(member.telefone),
    '',
    'Endereço: ' + (member.endereco || '-'),
    'Bairro: ' + (member.bairro || '-'),
    'Cidade/UF: ' + (member.cidade || '-') + '/' + (member.uf || '-'),
    'CEP: ' + formatCepBr_(member.cep),
    '',
    'Empresa: ' + (member.empresa || '-'),
    'Cargo: ' + (member.cargo || '-'),
    'Data de admissão: ' + formatDateBr_(member.dataAdmissao),
    'Data de filiação: ' + formatDateBr_(member.dataFiliacao),
    'Status atual: ' + (member.status || '-'),
    '',
    'Observações: ' + (member.observacoes || '-'),
    '',
    'Assinatura eletrônica:',
    getUnionName_()
  ];

  var pdfFile = createPdfFile_(docTitle, lines);
  var record = saveDocumentRecord_({
    tipo: DOCUMENT_TYPES.MEMBER_FORM,
    numero: numero,
    memberId: member.id,
    memberNome: member.nome,
    dueId: '',
    competencia: '',
    descricao: 'Ficha cadastral - ' + member.nome,
    driveFileId: pdfFile.getId(),
    driveFileName: pdfFile.getName(),
    mimeType: pdfFile.getMimeType(),
    createdBy: username
  }, username);

  return documentResponse_(record, pdfFile);
}

function issueAnnualClearance_(memberId, ano, username) {
  var member = findMemberById_(memberId);
  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  ano = String(ano || '').trim();
  if (!/^\d{4}$/.test(ano)) {
    throw new Error('Informe um ano válido com 4 dígitos.');
  }

  var existing = findDocumentByMemberAndTypeAndCompetencia_(memberId, DOCUMENT_TYPES.ANNUAL_CLEARANCE, ano);
  if (existing) {
    return downloadDocument_(existing.id);
  }

  var dues = listDues_({ memberId: memberId }).filter(function (item) {
    return String(item.competencia || '').slice(0, 4) === ano;
  });

  if (!dues.length) {
    throw new Error('Não há mensalidades lançadas para este associado no ano informado.');
  }

  var pending = dues.filter(function (item) {
    return resolveDueStatus_(item) !== 'PAGA';
  });

  if (pending.length) {
    throw new Error('Existe(m) ' + pending.length + ' mensalidade(s) pendente(s) ou em atraso neste ano.');
  }

  var total = dues.reduce(function (sum, item) {
    return sum + Number(item.valor || 0);
  }, 0);

  var numero = nextDocumentNumber_('QUIT');
  var docTitle = numero + ' - ' + member.nome + ' - ' + ano;
  var lines = [
    getUnionName_(),
    'DECLARAÇÃO DE QUITAÇÃO ANUAL',
    '',
    'Declara-se, para os devidos fins, que ' + member.nome + ', CPF ' + formatCpf_(member.cpf) + ',',
    'encontra-se quite com as mensalidades sindicais referentes ao exercício de ' + ano + '.',
    '',
    'Quantidade de mensalidades quitadas: ' + dues.length,
    'Valor total quitado no ano: ' + formatCurrencyBr_(total),
    'Empresa: ' + (member.empresa || '-'),
    '',
    'Além Paraíba - MG, ' + formatDateExtensoBr_(new Date()),
    '',
    'Assinatura eletrônica:',
    getUnionName_()
  ];

  var pdfFile = createPdfFile_(docTitle, lines);
  var record = saveDocumentRecord_({
    tipo: DOCUMENT_TYPES.ANNUAL_CLEARANCE,
    numero: numero,
    memberId: member.id,
    memberNome: member.nome,
    dueId: '',
    competencia: ano,
    descricao: 'Declaração de quitação anual ' + ano + ' - ' + member.nome,
    driveFileId: pdfFile.getId(),
    driveFileName: pdfFile.getName(),
    mimeType: pdfFile.getMimeType(),
    createdBy: username
  }, username);

  return documentResponse_(record, pdfFile);
}

function createPdfFile_(title, lines) {
  var folder = getPdfFolder_();
  var doc = DocumentApp.create(title);
  var body = doc.getBody();
  var unionName = getUnionName_();
  var i;

  body.setMarginTop(50).setMarginBottom(50).setMarginLeft(50).setMarginRight(50);

  for (i = 0; i < lines.length; i += 1) {
    var line = String(lines[i] || '');
    var paragraph = body.appendParagraph(line);
    paragraph.setFontFamily('Arial').setFontSize(12);

    if (i === 0) {
      paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      paragraph.setBold(true);
      paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    } else if (
      line === 'RECIBO DE MENSALIDADE SINDICAL' ||
      line === 'DECLARAÇÃO DE FILIAÇÃO' ||
      line === 'FICHA CADASTRAL DO SINDICALIZADO' ||
      line === 'DECLARAÇÃO DE QUITAÇÃO ANUAL'
    ) {
      paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      paragraph.setBold(true);
      paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    } else if (line === '') {
      paragraph.setSpacingAfter(10);
    }
  }

  body.appendParagraph('');
  body.appendParagraph('Documento emitido eletronicamente por ' + unionName + '.')
    .setFontSize(10)
    .setForegroundColor('#666666');

  doc.saveAndClose();

  var docFile = DriveApp.getFileById(doc.getId());
  var pdfBlob = docFile.getAs(MimeType.PDF).setName(title + '.pdf');
  var pdfFile = folder.createFile(pdfBlob);
  docFile.setTrashed(true);

  return pdfFile;
}

function saveDocumentRecord_(data, username) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var now = new Date().toISOString();
    var document = {
      id: generateId_(),
      tipo: data.tipo,
      numero: data.numero,
      memberId: data.memberId || '',
      memberNome: data.memberNome || '',
      dueId: data.dueId || '',
      competencia: data.competencia || '',
      descricao: data.descricao || '',
      driveFileId: data.driveFileId || '',
      driveFileName: data.driveFileName || '',
      mimeType: data.mimeType || 'application/pdf',
      createdBy: data.createdBy || username || '',
      createdAt: now
    };

    ensureSheet_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS).appendRow(serializeDocument_(document));
    seedAuditLog_('DOCUMENT', 'document', document.id, document.numero + ' / ' + document.tipo, username);
    return document;
  } finally {
    lock.releaseLock();
  }
}

function documentResponse_(record, file) {
  var blob = file.getBlob();
  return {
    documentId: record.id,
    numero: record.numero,
    tipo: record.tipo,
    fileName: file.getName(),
    mimeType: blob.getContentType(),
    driveFileId: file.getId(),
    base64Content: Utilities.base64Encode(blob.getBytes())
  };
}

function nextDocumentNumber_(prefix) {
  var rows = getSheetRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  var year = new Date().getFullYear();
  var sequence = rows.filter(function (row) {
    var numero = String(row[2] || '');
    return numero.indexOf(prefix + '-' + year + '-') === 0;
  }).length + 1;

  return prefix + '-' + year + '-' + ('0000' + sequence).slice(-4);
}

function seedAuditLog_(action, entity, entityId, details, username) {
  ensureSheet_(SIND_SHEETS.AUDIT, AUDIT_HEADERS).appendRow([
    new Date().toISOString(),
    username || 'system',
    action || '',
    entity || '',
    entityId || '',
    details || ''
  ]);
}

function getSheetRows_(sheetName, headers) {
  var sheet = ensureSheet_(sheetName, headers);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }
  return sheet.getRange(2, 1, lastRow - 1, headers.length).getDisplayValues();
}

function findMemberById_(memberId) {
  var rows = getSheetRows_(SIND_SHEETS.MEMBERS, MEMBER_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToMember_(row, index + 2);
    if (item.id === memberId) {
      found = item;
    }
  });

  return found;
}

function findDueById_(dueId) {
  var rows = getSheetRows_(SIND_SHEETS.DUES, DUE_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToDue_(row, index + 2);
    if (item.id === dueId) {
      item.status = resolveDueStatus_(item);
      found = item;
    }
  });

  return found;
}

function findDocumentById_(documentId) {
  var rows = getSheetRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToDocument_(row, index + 2);
    if (item.id === documentId) {
      found = item;
    }
  });

  return found;
}

function findDocumentByDueAndType_(dueId, type) {
  var rows = getSheetRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToDocument_(row, index + 2);
    if (item.dueId === dueId && item.tipo === type) {
      found = item;
    }
  });

  return found;
}

function findDocumentByMemberAndTypeAndCompetencia_(memberId, type, competencia) {
  var rows = getSheetRows_(SIND_SHEETS.DOCUMENTS, DOCUMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToDocument_(row, index + 2);
    if (item.memberId === memberId && item.tipo === type && String(item.competencia || '') === String(competencia || '')) {
      found = item;
    }
  });

  return found;
}

function findAttachmentById_(attachmentId) {
  var rows = getSheetRows_(SIND_SHEETS.ATTACHMENTS, ATTACHMENT_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToAttachment_(row, index + 2);
    if (item.id === attachmentId) {
      found = item;
    }
  });

  return found;
}

function findCashClosingByPeriod_(tipo, periodoInicio, periodoFim) {
  var rows = getSheetRows_(SIND_SHEETS.CASH_CLOSINGS, CASH_CLOSING_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToCashClosing_(row, index + 2);
    if (item.tipo === tipo && item.periodoInicio === periodoInicio && item.periodoFim === periodoFim) {
      found = item;
    }
  });

  return found;
}

function findUserById_(userId) {
  var rows = getSheetRows_(SIND_SHEETS.USERS, USER_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToUser_(row, index + 2);
    if (item.id === userId) {
      found = item;
    }
  });

  return found;
}

function findUserByUsername_(username) {
  username = String(username || '').trim().toLowerCase();
  var rows = getSheetRows_(SIND_SHEETS.USERS, USER_HEADERS);
  var found = null;

  rows.forEach(function (row, index) {
    var item = rowToUser_(row, index + 2);
    if (String(item.username || '').trim().toLowerCase() === username) {
      found = item;
    }
  });

  return found;
}

function rowToMember_(row, rowNumber) {
  row = normalizeRow_(row, MEMBER_HEADERS.length);
  return {
    id: row[0] || '',
    nome: row[1] || '',
    cpf: row[2] || '',
    rg: row[3] || '',
    dataNascimento: row[4] || '',
    email: row[5] || '',
    telefone: row[6] || '',
    endereco: row[7] || '',
    bairro: row[8] || '',
    cidade: row[9] || '',
    uf: row[10] || 'MG',
    cep: row[11] || '',
    empresa: row[12] || '',
    cargo: row[13] || '',
    dataAdmissao: row[14] || '',
    dataFiliacao: row[15] || '',
    status: row[16] || 'ATIVO',
    observacoes: row[17] || '',
    createdAt: row[18] || '',
    updatedAt: row[19] || '',
    portalAccessEnabled: row[20] || 'SIM',
    portalPasswordHash: row[21] || '',
    portalMustChangePassword: row[22] || 'SIM',
    portalLastLoginAt: row[23] || '',
    rowNumber: rowNumber
  };
}

function rowToDue_(row, rowNumber) {
  row = normalizeRow_(row, DUE_HEADERS.length);
  return {
    id: row[0] || '',
    memberId: row[1] || '',
    memberNome: row[2] || '',
    memberCpf: row[3] || '',
    competencia: row[4] || '',
    valor: parseNumber_(row[5] || 0),
    vencimento: row[6] || '',
    pagoEm: row[7] || '',
    formaPagamento: row[8] || '',
    status: row[9] || 'ABERTA',
    observacoes: row[10] || '',
    createdAt: row[11] || '',
    updatedAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function rowToDocument_(row, rowNumber) {
  row = normalizeRow_(row, DOCUMENT_HEADERS.length);
  return {
    id: row[0] || '',
    tipo: row[1] || '',
    numero: row[2] || '',
    memberId: row[3] || '',
    memberNome: row[4] || '',
    dueId: row[5] || '',
    competencia: row[6] || '',
    descricao: row[7] || '',
    driveFileId: row[8] || '',
    driveFileName: row[9] || '',
    mimeType: row[10] || 'application/pdf',
    createdBy: row[11] || '',
    createdAt: row[12] || '',
    rowNumber: rowNumber
  };
}

function rowToAttachment_(row, rowNumber) {
  row = normalizeRow_(row, ATTACHMENT_HEADERS.length);
  return {
    id: row[0] || '',
    memberId: row[1] || '',
    memberNome: row[2] || '',
    tipo: row[3] || '',
    descricao: row[4] || '',
    driveFileId: row[5] || '',
    driveFileName: row[6] || '',
    mimeType: row[7] || 'application/octet-stream',
    tamanhoBytes: parseNumber_(row[8] || 0),
    createdBy: row[9] || '',
    createdAt: row[10] || '',
    rowNumber: rowNumber
  };
}

function rowToCashClosing_(row, rowNumber) {
  row = normalizeRow_(row, CASH_CLOSING_HEADERS.length);
  return {
    id: row[0] || '',
    tipo: row[1] || '',
    periodoInicio: row[2] || '',
    periodoFim: row[3] || '',
    competencia: row[4] || '',
    totalRecebido: parseNumber_(row[5] || 0),
    quantidadePagamentos: parseNumber_(row[6] || 0),
    pix: parseNumber_(row[7] || 0),
    dinheiro: parseNumber_(row[8] || 0),
    boleto: parseNumber_(row[9] || 0),
    cartao: parseNumber_(row[10] || 0),
    transferencia: parseNumber_(row[11] || 0),
    outro: parseNumber_(row[12] || 0),
    observacoes: row[13] || '',
    closedBy: row[14] || '',
    closedAt: row[15] || '',
    createdAt: row[16] || '',
    updatedAt: row[17] || '',
    manualEntradas: parseNumber_(row[18] || 0),
    totalEntradas: parseNumber_(row[19] || row[5] || 0),
    saidasFixas: parseNumber_(row[20] || 0),
    saidasVariaveis: parseNumber_(row[21] || 0),
    totalSaidas: parseNumber_(row[22] || 0),
    saldoPeriodo: parseNumber_(row[23] || row[5] || 0),
    rowNumber: rowNumber
  };
}


function rowToUser_(row, rowNumber) {
  row = normalizeRow_(row, USER_HEADERS.length);
  return {
    id: row[0] || '',
    nome: row[1] || '',
    username: row[2] || '',
    passwordHash: row[3] || '',
    role: row[4] || SIND_ROLES.CONSULTA,
    status: row[5] || 'ATIVO',
    createdAt: row[6] || '',
    updatedAt: row[7] || '',
    rowNumber: rowNumber
  };
}

function sanitizeUser_(user) {
  return {
    id: user.id,
    nome: user.nome,
    username: user.username,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    rowNumber: user.rowNumber
  };
}

function serializeMember_(member) {
  return [
    member.id || '',
    member.nome || '',
    member.cpf || '',
    member.rg || '',
    member.dataNascimento || '',
    member.email || '',
    member.telefone || '',
    member.endereco || '',
    member.bairro || '',
    member.cidade || '',
    member.uf || '',
    member.cep || '',
    member.empresa || '',
    member.cargo || '',
    member.dataAdmissao || '',
    member.dataFiliacao || '',
    member.status || '',
    member.observacoes || '',
    member.createdAt || '',
    member.updatedAt || '',
    member.portalAccessEnabled || 'SIM',
    member.portalPasswordHash || '',
    member.portalMustChangePassword || 'SIM',
    member.portalLastLoginAt || ''
  ];
}

function serializeDue_(due) {
  return [
    due.id || '',
    due.memberId || '',
    due.memberNome || '',
    due.memberCpf || '',
    due.competencia || '',
    round2_(Number(due.valor || 0)),
    due.vencimento || '',
    due.pagoEm || '',
    due.formaPagamento || '',
    due.status || '',
    due.observacoes || '',
    due.createdAt || '',
    due.updatedAt || ''
  ];
}

function serializeDocument_(document) {
  return [
    document.id || '',
    document.tipo || '',
    document.numero || '',
    document.memberId || '',
    document.memberNome || '',
    document.dueId || '',
    document.competencia || '',
    document.descricao || '',
    document.driveFileId || '',
    document.driveFileName || '',
    document.mimeType || 'application/pdf',
    document.createdBy || '',
    document.createdAt || ''
  ];
}

function serializeAttachment_(attachment) {
  return [
    attachment.id || '',
    attachment.memberId || '',
    attachment.memberNome || '',
    attachment.tipo || '',
    attachment.descricao || '',
    attachment.driveFileId || '',
    attachment.driveFileName || '',
    attachment.mimeType || 'application/octet-stream',
    Number(attachment.tamanhoBytes || 0),
    attachment.createdBy || '',
    attachment.createdAt || ''
  ];
}

function serializeCashClosing_(closing) {
  return [
    closing.id || '',
    closing.tipo || '',
    closing.periodoInicio || '',
    closing.periodoFim || '',
    closing.competencia || '',
    round2_(Number(closing.totalRecebido || 0)),
    Number(closing.quantidadePagamentos || 0),
    round2_(Number(closing.pix || 0)),
    round2_(Number(closing.dinheiro || 0)),
    round2_(Number(closing.boleto || 0)),
    round2_(Number(closing.cartao || 0)),
    round2_(Number(closing.transferencia || 0)),
    round2_(Number(closing.outro || 0)),
    closing.observacoes || '',
    closing.closedBy || '',
    closing.closedAt || '',
    closing.createdAt || '',
    closing.updatedAt || '',
    round2_(Number(closing.manualEntradas || 0)),
    round2_(Number(closing.totalEntradas || closing.totalRecebido || 0)),
    round2_(Number(closing.saidasFixas || 0)),
    round2_(Number(closing.saidasVariaveis || 0)),
    round2_(Number(closing.totalSaidas || 0)),
    round2_(Number(closing.saldoPeriodo || closing.totalRecebido || 0))
  ];
}


function serializeUser_(user) {
  return [
    user.id || '',
    user.nome || '',
    user.username || '',
    user.passwordHash || '',
    user.role || SIND_ROLES.CONSULTA,
    user.status || 'ATIVO',
    user.createdAt || '',
    user.updatedAt || ''
  ];
}

function normalizeMemberPayload_(payload) {
  var data = {
    id: String(payload.id || '').trim(),
    nome: String(payload.nome || '').trim(),
    cpf: digitsOnly_(payload.cpf || ''),
    rg: String(payload.rg || '').trim(),
    dataNascimento: String(payload.dataNascimento || '').trim(),
    email: String(payload.email || '').trim(),
    telefone: digitsOnly_(payload.telefone || ''),
    endereco: String(payload.endereco || '').trim(),
    bairro: String(payload.bairro || '').trim(),
    cidade: String(payload.cidade || 'Além Paraíba').trim(),
    uf: String(payload.uf || 'MG').trim().toUpperCase(),
    cep: digitsOnly_(payload.cep || ''),
    empresa: String(payload.empresa || '').trim(),
    cargo: String(payload.cargo || '').trim(),
    dataAdmissao: String(payload.dataAdmissao || '').trim(),
    dataFiliacao: String(payload.dataFiliacao || '').trim(),
    status: String(payload.status || 'ATIVO').trim(),
    observacoes: String(payload.observacoes || '').trim()
  };

  if (!data.nome || data.nome.length < 3) {
    throw new Error('Informe o nome completo.');
  }

  validateCpf_(data.cpf);

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('E-mail inválido.');
  }

  if (data.dataNascimento) validateDateInput_(data.dataNascimento);
  if (data.dataAdmissao) validateDateInput_(data.dataAdmissao);
  if (data.dataFiliacao) validateDateInput_(data.dataFiliacao);

  if (!/^[A-Z]{2}$/.test(data.uf)) {
    throw new Error('UF inválida.');
  }

  if (['ATIVO', 'PENDENTE', 'INATIVO'].indexOf(data.status) < 0) {
    throw new Error('Status inválido.');
  }

  return data;
}

function normalizeUserPayload_(payload) {
  var data = {
    id: String(payload.id || '').trim(),
    nome: String(payload.nome || '').trim(),
    username: String(payload.username || '').trim(),
    password: String(payload.password || ''),
    role: String(payload.role || SIND_ROLES.CONSULTA).trim(),
    status: String(payload.status || 'ATIVO').trim()
  };

  if (!data.nome || data.nome.length < 3) {
    throw new Error('Informe o nome do usuário.');
  }

  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(data.username)) {
    throw new Error('Login inválido. Use 3 a 30 caracteres sem espaços.');
  }

  if (Object.keys(PERMISSION_GROUPS).indexOf(data.role) < 0) {
    throw new Error('Perfil inválido.');
  }

  if (['ATIVO', 'INATIVO'].indexOf(data.status) < 0) {
    throw new Error('Status do usuário inválido.');
  }

  if (data.password && data.password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  return data;
}

function normalizeAttachmentPayload_(payload) {
  var data = {
    memberId: String(payload.memberId || '').trim(),
    tipo: String(payload.tipo || 'DOCUMENTO').trim().toUpperCase(),
    descricao: String(payload.descricao || '').trim(),
    fileName: cleanFileName_(payload.fileName || 'anexo'),
    mimeType: String(payload.mimeType || 'application/octet-stream').trim(),
    base64Content: String(payload.base64Content || '').trim()
  };

  if (!data.memberId) {
    throw new Error('Selecione o associado.');
  }

  if (!data.base64Content) {
    throw new Error('Selecione um arquivo para anexar.');
  }

  if (data.tipo.length > 40) {
    data.tipo = data.tipo.slice(0, 40);
  }

  if (data.descricao.length > 240) {
    data.descricao = data.descricao.slice(0, 240);
  }

  return data;
}

function resolveDueStatus_(due) {
  if (String(due.status || '') === 'CANCELADA') {
    return 'CANCELADA';
  }

  if (String(due.pagoEm || '').trim()) {
    return 'PAGA';
  }

  var dueDate = new Date(String(due.vencimento || '') + 'T23:59:59');
  if (!isNaN(dueDate.getTime()) && dueDate.getTime() < new Date().getTime()) {
    return 'ATRASADA';
  }

  return 'ABERTA';
}

function validateCpf_(value) {
  var cpf = digitsOnly_(value);
  var sum = 0;
  var remainder;
  var i;

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    throw new Error('CPF inválido.');
  }

  for (i = 1; i <= 9; i += 1) {
    sum += Number(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(cpf.substring(9, 10))) {
    throw new Error('CPF inválido.');
  }

  sum = 0;
  for (i = 1; i <= 10; i += 1) {
    sum += Number(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(cpf.substring(10, 11))) {
    throw new Error('CPF inválido.');
  }
}

function validateCompetencia_(value) {
  if (!/^\d{4}-\d{2}$/.test(String(value || '').trim())) {
    throw new Error('Competência inválida. Use YYYY-MM.');
  }
}

function validateDateInput_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim())) {
    throw new Error('Data inválida. Use YYYY-MM-DD.');
  }
}

function normalizeAction_(value) {
  return String(value || '').trim().toLowerCase();
}

function parseJsonBody_(e) {
  var text = String((e && e.postData && e.postData.contents) || '{}').trim();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('JSON inválido.');
  }
}

function handleError_(error) {
  return jsonResponse_(false, error && error.message ? error.message : 'Erro interno.');
}

function jsonResponse_(ok, message, data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: !!ok,
      message: message || '',
      data: data || {}
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateId_() {
  return Utilities.getUuid();
}

function sha256_(text) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text || ''),
    Utilities.Charset.UTF_8
  );

  return bytes.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function normalizeRow_(row, size) {
  var result = (row || []).slice();
  while (result.length < size) {
    result.push('');
  }
  return result;
}

function digitsOnly_(value) {
  return String(value || '').replace(/\D/g, '');
}

function parseNumber_(value) {
  var normalized = String(value == null ? '' : value)
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  var parsed = Number(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

function round2_(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function csvEscape_(value) {
  var text = String(value == null ? '' : value);
  if (/[;"\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function formatCurrencyBr_(value) {
  return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
}

function formatDateBr_(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return value || '-';
  }
  return String(value).slice(8, 10) + '/' + String(value).slice(5, 7) + '/' + String(value).slice(0, 4);
}

function formatDateTimeBr_(value) {
  var date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return String(value || '-');
  }
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
}

function formatCompetenciaBr_(value) {
  if (!value || !/^\d{4}-\d{2}$/.test(String(value))) {
    return value || '-';
  }
  return String(value).slice(5, 7) + '/' + String(value).slice(0, 4);
}

function formatCpf_(value) {
  var cpf = digitsOnly_(value);
  if (cpf.length !== 11) return value || '-';
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function formatPhoneBr_(value) {
  var phone = digitsOnly_(value);
  if (phone.length === 11) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  if (phone.length === 10) {
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return value || '-';
}

function formatCepBr_(value) {
  var cep = digitsOnly_(value);
  if (cep.length !== 8) return value || '-';
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

function lastDayOfMonthStr_(competencia) {
  var year = Number(String(competencia).slice(0, 4));
  var month = Number(String(competencia).slice(5, 7));
  var date = new Date(year, month, 0);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function monthsBetween_(inicio, fim) {
  var months = [];
  var year = Number(String(inicio).slice(0, 4));
  var month = Number(String(inicio).slice(5, 7));
  var endYear = Number(String(fim).slice(0, 4));
  var endMonth = Number(String(fim).slice(5, 7));

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(year + '-' + (month < 10 ? '0' + month : String(month)));
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return months;
}

function cleanFileName_(value) {
  var fileName = String(value || 'anexo').trim().replace(/[\\/:*?"<>|]/g, '-');
  if (!fileName) {
    return 'anexo';
  }
  return fileName.slice(0, 140);
}

function formatDateExtensoBr_(date) {
  var months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  var d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return '-';
  }
  return d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
}

function currentMonth_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
}

function currentDateStr_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getScriptProperty_(name, fallback) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  return value == null || value === '' ? fallback : value;
}
