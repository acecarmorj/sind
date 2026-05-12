var ASSOC_SETUP = {
  USE_ACTIVE_SPREADSHEET: true,
  SPREADSHEET_NAME: 'db_associados_sinsermap',
  SPREADSHEET_ID: '',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: '123456',
  ADMIN_NAME: 'Administrador',
  UNION_NAME: 'SINSERMAP - Sindicato dos Servidores Públicos Municipais de Além Paraíba'
};

var ASSOC_SECURITY = {
  PROP_SPREADSHEET_ID: 'ASSOC_SPREADSHEET_ID',
  PROP_UNION_NAME: 'ASSOC_UNION_NAME',
  SESSION_PREFIX: 'ASSOC_SESSION_',
  SESSION_TTL_SECONDS: 21600
};

var ASSOC_SHEETS = {
  MEMBERS: 'Associados',
  USERS: 'Usuarios',
  CONFIG: 'Config',
  AUDIT: 'Auditoria',
  OPTIONS: 'ListasCadastro',
  PUBLIC: 'PainelPublico'
};

var MEMBER_HEADERS = [
  'id',
  'nome',
  'cpf',
  'rg',
  'dataNascimento',
  'telefone',
  'email',
  'endereco',
  'bairro',
  'cidade',
  'uf',
  'cep',
  'localTrabalho',
  'setor',
  'funcao',
  'matricula',
  'dataAssociacao',
  'status',
  'observacoes',
  'createdAt',
  'updatedAt'
];

var USER_HEADERS = [
  'id',
  'username',
  'passwordHash',
  'nome',
  'role',
  'status',
  'createdAt',
  'updatedAt'
];

var CONFIG_HEADERS = [
  'chave',
  'valor'
];

var AUDIT_HEADERS = [
  'id',
  'acao',
  'entidade',
  'entidadeId',
  'usuario',
  'detalhes',
  'createdAt'
];


var OPTION_HEADERS = [
  'id',
  'tipo',
  'nome',
  'status',
  'createdAt',
  'updatedAt'
];

var PUBLIC_ITEM_HEADERS = [
  'id',
  'tipo',
  'titulo',
  'descricao',
  'data',
  'horario',
  'local',
  'link',
  'ordem',
  'status',
  'createdAt',
  'updatedAt'
];

var OPTION_TYPES = {
  localTrabalho: 'Onde trabalha',
  setor: 'Setor',
  funcao: 'Função/cargo'
};

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Cadastro de Associados')
      .addItem('Criar/atualizar banco', 'setupDatabase')
      .addToUi();
  } catch (error) {
    Logger.log(error);
  }
}

function setupDatabase() {
  var spreadsheet = getSpreadsheet_();
  ensureDatabase_(spreadsheet);

  return {
    ok: true,
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    message: 'Banco criado/atualizado nesta planilha.'
  };
}

function doOptions() {
  return jsonResponse_({
    ok: true
  });
}

function doGet(e) {
  return handleRequest_(e, 'GET');
}

function doPost(e) {
  return handleRequest_(e, 'POST');
}

function handleRequest_(e, method) {
  try {
    var request = buildRequest_(e, method);
    var result = dispatch_(request);
    return jsonResponse_(extend_({ ok: true }, result));
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : String(error)
    });
  }
}

function buildRequest_(e, method) {
  var parameter = e && e.parameter ? e.parameter : {};
  var body = {};

  if (method === 'POST' && e && e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (error) {
      throw new Error('Requisição inválida.');
    }
  }

  return {
    method: method,
    action: String(body.action || parameter.action || '').trim(),
    sessionToken: String(body.sessionToken || parameter.sessionToken || '').trim(),
    payload: body.payload || parameter || {}
  };
}

function dispatch_(request) {
  if (!request.action) {
    throw new Error('Ação não informada.');
  }

  ensureDatabase_(getSpreadsheet_());

  switch (request.action) {
    case 'login':
      return login_(request.payload);

    case 'logout':
      return logout_(request.sessionToken);

    case 'session':
      return {
        user: requireSession_(request.sessionToken),
        unionName: getUnionName_()
      };

    case 'dashboard':
      requireSession_(request.sessionToken);
      return dashboard_();

    case 'options':
      requireSession_(request.sessionToken);
      return {
        options: getOptions_()
      };

    case 'public_list':
      return {
        items: listPublicItems_(false),
        unionName: getUnionName_()
      };

    case 'public_items_list':
      requireSession_(request.sessionToken);
      return {
        items: listPublicItems_(true)
      };

    case 'public_item_save':
      return {
        item: savePublicItem_(request.payload, requireSession_(request.sessionToken)),
        items: listPublicItems_(true)
      };

    case 'public_item_delete':
      deletePublicItem_(request.payload, requireSession_(request.sessionToken));
      return {
        items: listPublicItems_(true)
      };

    case 'option_save':
      return {
        option: saveOption_(request.payload, requireSession_(request.sessionToken)),
        options: getOptions_()
      };

    case 'option_delete':
      deleteOption_(request.payload, requireSession_(request.sessionToken));
      return {
        options: getOptions_()
      };

    case 'users_list':
      requireSession_(request.sessionToken);
      return {
        users: listUsers_()
      };

    case 'user_save':
      return {
        user: saveUser_(request.payload, requireSession_(request.sessionToken)),
        users: listUsers_()
      };

    case 'user_delete':
      deleteUser_(request.payload, requireSession_(request.sessionToken));
      return {
        users: listUsers_()
      };

    case 'members_list':
      requireSession_(request.sessionToken);
      return {
        members: listMembers_(request.payload)
      };

    case 'member_get':
      requireSession_(request.sessionToken);
      return {
        member: getMemberById_(request.payload.id)
      };

    case 'member_save':
      return {
        member: saveMember_(request.payload, requireSession_(request.sessionToken))
      };

    case 'reports_associados':
      requireSession_(request.sessionToken);
      return {
        report: reportAssociados_(request.payload)
      };

    default:
      throw new Error('Ação não reconhecida: ' + request.action);
  }
}

function getSpreadsheet_() {
  var properties = PropertiesService.getScriptProperties();

  if (ASSOC_SETUP.USE_ACTIVE_SPREADSHEET) {
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (activeSpreadsheet) {
      properties.setProperty(ASSOC_SECURITY.PROP_SPREADSHEET_ID, activeSpreadsheet.getId());
      return activeSpreadsheet;
    }
  }

  var spreadsheetId = ASSOC_SETUP.SPREADSHEET_ID ||
    properties.getProperty(ASSOC_SECURITY.PROP_SPREADSHEET_ID);

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  throw new Error('Nenhuma planilha ativa encontrada. Abra a planilha, vá em Extensões > Apps Script, cole esta API e execute setupDatabase().');
}

function ensureDatabase_(spreadsheet) {
  ensureSheet_(spreadsheet, ASSOC_SHEETS.MEMBERS, MEMBER_HEADERS);
  ensureSheet_(spreadsheet, ASSOC_SHEETS.USERS, USER_HEADERS);
  ensureSheet_(spreadsheet, ASSOC_SHEETS.CONFIG, CONFIG_HEADERS);
  ensureSheet_(spreadsheet, ASSOC_SHEETS.AUDIT, AUDIT_HEADERS);
  ensureSheet_(spreadsheet, ASSOC_SHEETS.OPTIONS, OPTION_HEADERS);
  ensureSheet_(spreadsheet, ASSOC_SHEETS.PUBLIC, PUBLIC_ITEM_HEADERS);
  seedConfig_();
  seedAdminUser_();
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
    return sheet;
  }

  var lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  var currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var changed = false;

  headers.forEach(function (header) {
    if (currentHeaders.indexOf(header) === -1) {
      currentHeaders.push(header);
      changed = true;
    }
  });

  if (changed) {
    sheet.getRange(1, 1, 1, currentHeaders.length).setValues([currentHeaders]);
  }

  sheet.setFrozenRows(1);
  return sheet;
}

function seedConfig_() {
  var sheet = getSheet_(ASSOC_SHEETS.CONFIG);
  var data = sheetToObjects_(ASSOC_SHEETS.CONFIG);
  var unionRow = data.find(function (item) {
    return item.chave === 'UNION_NAME';
  });

  if (!unionRow) {
    sheet.appendRow(['UNION_NAME', ASSOC_SETUP.UNION_NAME]);
  } else if (unionRow.valor !== ASSOC_SETUP.UNION_NAME) {
    sheet.getRange(unionRow._rowNumber, 2).setValue(ASSOC_SETUP.UNION_NAME);
  }

  PropertiesService.getScriptProperties()
    .setProperty(ASSOC_SECURITY.PROP_UNION_NAME, ASSOC_SETUP.UNION_NAME);
}

function seedAdminUser_() {
  var users = sheetToObjects_(ASSOC_SHEETS.USERS);
  var username = String(ASSOC_SETUP.ADMIN_USERNAME || 'admin').toLowerCase();

  var exists = users.some(function (user) {
    return String(user.username || '').toLowerCase() === username;
  });

  if (exists) {
    return;
  }

  var now = nowIso_();
  var row = [
    generateId_('USER'),
    username,
    hash_(ASSOC_SETUP.ADMIN_PASSWORD || '123456'),
    ASSOC_SETUP.ADMIN_NAME || 'Administrador',
    'ADMIN',
    'ATIVO',
    now,
    now
  ];

  getSheet_(ASSOC_SHEETS.USERS).appendRow(row);
}

function login_(payload) {
  var username = String(payload.username || '').trim().toLowerCase();
  var password = String(payload.password || '');

  if (!username || !password) {
    throw new Error('Informe usuário e senha.');
  }

  var users = sheetToObjects_(ASSOC_SHEETS.USERS);
  var passwordHash = hash_(password);

  var user = users.find(function (item) {
    return String(item.username || '').toLowerCase() === username &&
      item.passwordHash === passwordHash &&
      String(item.status || '').toUpperCase() === 'ATIVO';
  });

  if (!user) {
    throw new Error('Usuário ou senha inválidos.');
  }

  var safeUser = safeUser_(user);

  audit_('LOGIN', 'Usuarios', user.id, safeUser.username, 'Acesso ao sistema.');
  return {
    sessionToken: createSession_(safeUser),
    user: safeUser,
    unionName: getUnionName_()
  };
}

function logout_(sessionToken) {
  if (sessionToken) {
    PropertiesService.getScriptProperties()
      .deleteProperty(ASSOC_SECURITY.SESSION_PREFIX + sessionToken);
  }

  return {
    message: 'Sessão encerrada.'
  };
}

function createSession_(user) {
  var token = Utilities.getUuid() + Utilities.getUuid();
  var expiresAt = new Date(Date.now() + ASSOC_SECURITY.SESSION_TTL_SECONDS * 1000).toISOString();

  PropertiesService.getScriptProperties().setProperty(
    ASSOC_SECURITY.SESSION_PREFIX + token,
    JSON.stringify({
      username: user.username,
      nome: user.nome,
      role: user.role,
      expiresAt: expiresAt
    })
  );

  return token;
}

function requireSession_(sessionToken) {
  if (!sessionToken) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  var propertyKey = ASSOC_SECURITY.SESSION_PREFIX + sessionToken;
  var raw = PropertiesService.getScriptProperties().getProperty(propertyKey);

  if (!raw) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  var session = JSON.parse(raw);

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    PropertiesService.getScriptProperties().deleteProperty(propertyKey);
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  var activeUser = sheetToObjects_(ASSOC_SHEETS.USERS).some(function (user) {
    return String(user.username || '').toLowerCase() === String(session.username || '').toLowerCase() &&
      String(user.status || 'ATIVO').trim().toUpperCase() === 'ATIVO';
  });

  if (!activeUser) {
    PropertiesService.getScriptProperties().deleteProperty(propertyKey);
    throw new Error('Usuário removido. Faça login com outro usuário.');
  }

  return {
    username: session.username,
    nome: session.nome,
    role: session.role
  };
}

function listUsers_() {
  return sheetToObjects_(ASSOC_SHEETS.USERS)
    .filter(function (user) {
      return String(user.status || 'ATIVO').trim().toUpperCase() === 'ATIVO';
    })
    .map(safeUserForList_)
    .sort(function (a, b) {
      return normalizeText_(a.nome || a.username) < normalizeText_(b.nome || b.username) ? -1 : 1;
    });
}

function saveUser_(payload, currentUser) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = getSheet_(ASSOC_SHEETS.USERS);
    var users = sheetToObjects_(ASSOC_SHEETS.USERS);
    var user = normalizeUser_(payload);
    var now = nowIso_();

    validateUser_(user, users);

    user.id = generateId_('USER');
    user.passwordHash = hash_(user.password);
    user.role = 'USUARIO';
    user.status = 'ATIVO';
    user.createdAt = now;
    user.updatedAt = now;

    appendObject_(sheet, user, USER_HEADERS);
    audit_('CRIAR_USUARIO', 'Usuarios', user.id, currentUser.username, user.username);

    return safeUserForList_(user);
  } finally {
    lock.releaseLock();
  }
}

function deleteUser_(payload, currentUser) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var userId = clean_(payload.id);
    var sheet = getSheet_(ASSOC_SHEETS.USERS);
    var users = sheetToObjects_(ASSOC_SHEETS.USERS);
    var activeUsers = users.filter(function (user) {
      return String(user.status || 'ATIVO').trim().toUpperCase() === 'ATIVO';
    });
    var existing = activeUsers.find(function (user) {
      return user.id === userId;
    });

    if (!existing) {
      throw new Error('Usuário não encontrado para remoção.');
    }

    if (activeUsers.length <= 1) {
      throw new Error('Não é possível remover o único usuário ativo.');
    }

    existing.status = 'INATIVO';
    existing.updatedAt = nowIso_();

    updateRow_(sheet, existing._rowNumber, existing, USER_HEADERS);
    audit_('REMOVER_USUARIO', 'Usuarios', existing.id, currentUser.username, existing.username);
  } finally {
    lock.releaseLock();
  }
}

function normalizeUser_(payload) {
  return {
    id: clean_(payload.id),
    username: clean_(payload.username).toLowerCase(),
    password: String(payload.password || ''),
    nome: clean_(payload.nome),
    role: 'USUARIO',
    status: 'ATIVO',
    createdAt: clean_(payload.createdAt),
    updatedAt: clean_(payload.updatedAt)
  };
}

function validateUser_(user, users) {
  if (!user.nome) {
    throw new Error('Nome do usuário não informado.');
  }

  if (!user.username) {
    throw new Error('Usuário não informado.');
  }

  if (!/^[a-z0-9._-]{3,40}$/.test(user.username)) {
    throw new Error('Use usuário com 3 a 40 caracteres: letras, números, ponto, hífen ou sublinhado.');
  }

  if (!user.password || user.password.length < 4) {
    throw new Error('A senha deve ter pelo menos 4 caracteres.');
  }

  var duplicate = users.find(function (item) {
    return String(item.status || 'ATIVO').trim().toUpperCase() === 'ATIVO' &&
      String(item.username || '').toLowerCase() === user.username;
  });

  if (duplicate) {
    throw new Error('Esse usuário já está cadastrado.');
  }
}

function safeUserForList_(user) {
  return {
    id: user.id,
    username: user.username,
    nome: user.nome,
    role: user.role || 'USUARIO',
    status: String(user.status || 'ATIVO').trim().toUpperCase(),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function dashboard_() {
  var members = listMembers_({
    sortBy: 'updatedAt',
    sortDir: 'desc'
  });

  var activeMembers = members.filter(function (member) {
    return member.status === 'ATIVO';
  });

  return {
    unionName: getUnionName_(),
    stats: {
      total: members.length,
      ativos: activeMembers.length,
      inativos: members.length - activeMembers.length,
      locaisTrabalho: distinct_(members, 'localTrabalho').length,
      setores: distinct_(members, 'setor').length,
      funcoes: distinct_(members, 'funcao').length
    },
    recentMembers: members.slice(0, 10)
  };
}

function getOptions_() {
  var members = readMembers_();
  var optionGroups = groupedActiveOptions_();

  return {
    locaisTrabalho: mergeOptionNames_(optionGroups.localTrabalho, distinct_(members, 'localTrabalho')),
    setores: mergeOptionNames_(optionGroups.setor, distinct_(members, 'setor')),
    funcoes: mergeOptionNames_(optionGroups.funcao, distinct_(members, 'funcao')),
    items: {
      localTrabalho: optionGroups.localTrabalho,
      setor: optionGroups.setor,
      funcao: optionGroups.funcao
    }
  };
}

function groupedActiveOptions_() {
  var groups = {
    localTrabalho: [],
    setor: [],
    funcao: []
  };

  readOptions_().forEach(function (item) {
    var type = normalizeOptionType_(item.tipo);

    if (!type || item.status !== 'ATIVO') {
      return;
    }

    groups[type].push({
      id: item.id,
      tipo: type,
      nome: item.nome
    });
  });

  Object.keys(groups).forEach(function (type) {
    groups[type].sort(function (a, b) {
      return normalizeText_(a.nome) < normalizeText_(b.nome) ? -1 : 1;
    });
  });

  return groups;
}

function readOptions_() {
  return sheetToObjects_(ASSOC_SHEETS.OPTIONS).map(function (item) {
    item.tipo = normalizeOptionType_(item.tipo);
    item.nome = clean_(item.nome);
    item.status = String(item.status || 'ATIVO').trim().toUpperCase();
    return item;
  });
}

function mergeOptionNames_(items, extraNames) {
  var seen = {};
  var values = [];

  function pushName(name) {
    var cleanName = clean_(name);
    var key = normalizeText_(cleanName);

    if (cleanName && !seen[key]) {
      seen[key] = true;
      values.push(cleanName);
    }
  }

  items.forEach(function (item) {
    pushName(item.nome);
  });

  (extraNames || []).forEach(pushName);

  values.sort(function (a, b) {
    return normalizeText_(a) < normalizeText_(b) ? -1 : 1;
  });

  return values;
}

function saveOption_(payload, user) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = getSheet_(ASSOC_SHEETS.OPTIONS);
    var options = readOptions_();
    var option = normalizeOption_(payload);
    var now = nowIso_();

    validateOption_(option, options);

    if (option.id) {
      var existing = options.find(function (item) {
        return item.id === option.id;
      });

      if (!existing) {
        throw new Error('Opção não encontrada para edição.');
      }

      option.createdAt = existing.createdAt || now;
      option.updatedAt = now;

      updateRow_(sheet, existing._rowNumber, option, OPTION_HEADERS);
      audit_('ATUALIZAR_OPCAO', 'ListasCadastro', option.id, user.username, option.tipo + ': ' + option.nome);
    } else {
      option.id = generateId_('OPT');
      option.status = 'ATIVO';
      option.createdAt = now;
      option.updatedAt = now;

      appendObject_(sheet, option, OPTION_HEADERS);
      audit_('CRIAR_OPCAO', 'ListasCadastro', option.id, user.username, option.tipo + ': ' + option.nome);
    }

    delete option._rowNumber;
    return option;
  } finally {
    lock.releaseLock();
  }
}

function deleteOption_(payload, user) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var type = normalizeOptionType_(payload.tipo);
    var optionId = clean_(payload.id);
    var sheet = getSheet_(ASSOC_SHEETS.OPTIONS);
    var options = readOptions_();
    var existing = options.find(function (item) {
      return item.id === optionId && (!type || item.tipo === type);
    });

    if (!existing) {
      throw new Error('Opção não encontrada para exclusão.');
    }

    existing.status = 'INATIVO';
    existing.updatedAt = nowIso_();

    updateRow_(sheet, existing._rowNumber, existing, OPTION_HEADERS);
    audit_('EXCLUIR_OPCAO', 'ListasCadastro', existing.id, user.username, existing.tipo + ': ' + existing.nome);
  } finally {
    lock.releaseLock();
  }
}

function normalizeOption_(payload) {
  return {
    id: clean_(payload.id),
    tipo: normalizeOptionType_(payload.tipo),
    nome: clean_(payload.nome),
    status: String(payload.status || 'ATIVO').trim().toUpperCase(),
    createdAt: clean_(payload.createdAt),
    updatedAt: clean_(payload.updatedAt)
  };
}

function normalizeOptionType_(type) {
  var cleanType = clean_(type);

  return OPTION_TYPES[cleanType] ? cleanType : '';
}

function validateOption_(option, options) {
  if (!option.tipo) {
    throw new Error('Tipo da lista não informado.');
  }

  if (!option.nome) {
    throw new Error('Nome da opção não informado.');
  }

  var duplicate = options.find(function (item) {
    return item.id !== option.id &&
      item.tipo === option.tipo &&
      item.status === 'ATIVO' &&
      normalizeText_(item.nome) === normalizeText_(option.nome);
  });

  if (duplicate) {
    throw new Error('Essa opção já está cadastrada em ' + OPTION_TYPES[option.tipo] + '.');
  }
}


function listPublicItems_(includeInactive) {
  var items = sheetToObjects_(ASSOC_SHEETS.PUBLIC).map(function (item) {
    return normalizePublicItem_(item);
  }).filter(function (item) {
    if (includeInactive) {
      return item.status !== 'EXCLUIDO';
    }

    return item.status === 'ATIVO';
  });

  sortPublicItems_(items);
  return items;
}

function savePublicItem_(payload, user) {
  var normalized = normalizePublicItem_(payload || {});
  validatePublicItem_(normalized);

  var sheet = getSheet_(ASSOC_SHEETS.PUBLIC);
  var existing = normalized.id ? sheetToObjects_(ASSOC_SHEETS.PUBLIC).find(function (item) {
    return item.id === normalized.id;
  }) : null;

  if (existing) {
    normalized.createdAt = existing.createdAt || nowIso_();
    normalized.updatedAt = nowIso_();
    updateRow_(sheet, existing._rowNumber, normalized, PUBLIC_ITEM_HEADERS);
    audit_('PUBLIC_ITEM_UPDATE', 'PainelPublico', normalized.id, user.username, normalized.titulo);
    return normalized;
  }

  normalized.id = generateId_('PUB');
  normalized.createdAt = nowIso_();
  normalized.updatedAt = normalized.createdAt;
  appendObject_(sheet, normalized, PUBLIC_ITEM_HEADERS);
  audit_('PUBLIC_ITEM_CREATE', 'PainelPublico', normalized.id, user.username, normalized.titulo);
  return normalized;
}

function deletePublicItem_(payload, user) {
  var id = clean_(payload && payload.id);

  if (!id) {
    throw new Error('Informação pública não informada.');
  }

  var sheet = getSheet_(ASSOC_SHEETS.PUBLIC);
  var existing = sheetToObjects_(ASSOC_SHEETS.PUBLIC).find(function (item) {
    return item.id === id;
  });

  if (!existing) {
    throw new Error('Informação pública não encontrada.');
  }

  sheet.deleteRow(existing._rowNumber);
  audit_('PUBLIC_ITEM_DELETE', 'PainelPublico', id, user.username, existing.titulo || '');
}

function normalizePublicItem_(payload) {
  var status = String(payload.status || 'ATIVO').trim().toUpperCase();

  if (status !== 'ATIVO' && status !== 'INATIVO' && status !== 'EXCLUIDO') {
    status = 'ATIVO';
  }

  return {
    id: clean_(payload.id),
    tipo: normalizePublicItemType_(payload.tipo),
    titulo: clean_(payload.titulo),
    descricao: clean_(payload.descricao),
    data: cleanDate_(payload.data),
    horario: clean_(payload.horario),
    local: clean_(payload.local),
    link: clean_(payload.link),
    ordem: String(Number(payload.ordem || 0) || 0),
    status: status,
    createdAt: clean_(payload.createdAt),
    updatedAt: clean_(payload.updatedAt)
  };
}

function normalizePublicItemType_(value) {
  var type = String(value || 'comunicado').trim().toLowerCase();
  var allowed = {
    comunicado: true,
    agenda: true,
    documento: true,
    ata: true,
    curso: true,
    servico: true
  };

  return allowed[type] ? type : 'comunicado';
}

function validatePublicItem_(item) {
  if (!item.titulo) {
    throw new Error('Informe o título da informação pública.');
  }
}

function sortPublicItems_(items) {
  var orderMap = {
    comunicado: 0,
    agenda: 1,
    curso: 2,
    servico: 3,
    documento: 4,
    ata: 5
  };

  items.sort(function (a, b) {
    var orderA = Number(a.ordem || 0);
    var orderB = Number(b.ordem || 0);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    var typeA = orderMap[a.tipo] == null ? 99 : orderMap[a.tipo];
    var typeB = orderMap[b.tipo] == null ? 99 : orderMap[b.tipo];

    if (typeA !== typeB) {
      return typeA - typeB;
    }

    if ((a.data || '') !== (b.data || '')) {
      return (a.data || '') > (b.data || '') ? -1 : 1;
    }

    return normalizeText_(a.titulo) < normalizeText_(b.titulo) ? -1 : 1;
  });
}


function listMembers_(filters) {
  return filterMembers_(readMembers_(), filters || {});
}

function getMemberById_(id) {
  var memberId = String(id || '').trim();

  if (!memberId) {
    throw new Error('ID do associado não informado.');
  }

  var member = readMembers_().find(function (item) {
    return item.id === memberId;
  });

  if (!member) {
    throw new Error('Associado não encontrado.');
  }

  delete member._rowNumber;
  return member;
}

function saveMember_(payload, user) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = getSheet_(ASSOC_SHEETS.MEMBERS);
    var members = readMembers_();
    var member = normalizeMember_(payload);
    var now = nowIso_();

    validateMember_(member, members);

    if (member.id) {
      var existing = members.find(function (item) {
        return item.id === member.id;
      });

      if (!existing) {
        throw new Error('Associado não encontrado para edição.');
      }

      member.createdAt = existing.createdAt || now;
      member.updatedAt = now;

      updateRow_(sheet, existing._rowNumber, member, MEMBER_HEADERS);
      audit_('ATUALIZAR_ASSOCIADO', 'Associados', member.id, user.username, member.nome);
    } else {
      member.id = generateId_('ASSOC');
      member.createdAt = now;
      member.updatedAt = now;

      appendObject_(sheet, member, MEMBER_HEADERS);
      audit_('CRIAR_ASSOCIADO', 'Associados', member.id, user.username, member.nome);
    }

    delete member._rowNumber;
    return member;
  } finally {
    lock.releaseLock();
  }
}

function normalizeMember_(payload) {
  return {
    id: clean_(payload.id),
    nome: clean_(payload.nome),
    cpf: onlyDigits_(payload.cpf),
    rg: clean_(payload.rg),
    dataNascimento: cleanDate_(payload.dataNascimento),
    telefone: onlyDigits_(payload.telefone),
    email: clean_(payload.email).toLowerCase(),
    endereco: clean_(payload.endereco),
    bairro: clean_(payload.bairro),
    cidade: clean_(payload.cidade),
    uf: clean_(payload.uf).toUpperCase().slice(0, 2),
    cep: onlyDigits_(payload.cep),
    localTrabalho: clean_(payload.localTrabalho),
    setor: clean_(payload.setor),
    funcao: clean_(payload.funcao),
    matricula: clean_(payload.matricula),
    dataAssociacao: cleanDate_(payload.dataAssociacao),
    status: String(payload.status || 'ATIVO').toUpperCase() === 'INATIVO' ? 'INATIVO' : 'ATIVO',
    observacoes: clean_(payload.observacoes),
    createdAt: clean_(payload.createdAt),
    updatedAt: clean_(payload.updatedAt)
  };
}

function validateMember_(member, members) {
  if (!member.nome) {
    throw new Error('Informe o nome do associado.');
  }

  if (!member.localTrabalho) {
    throw new Error('Informe onde o associado trabalha.');
  }

  if (!member.setor) {
    throw new Error('Informe o setor do associado.');
  }

  if (!member.funcao) {
    throw new Error('Informe a função/cargo do associado.');
  }

  if (member.cpf && member.cpf.length !== 11) {
    throw new Error('CPF inválido. Informe 11 dígitos ou deixe em branco.');
  }

  if (member.email && member.email.indexOf('@') === -1) {
    throw new Error('E-mail inválido.');
  }

  if (member.cpf) {
    var duplicate = members.find(function (item) {
      return item.cpf === member.cpf && item.id !== member.id;
    });

    if (duplicate) {
      throw new Error('Já existe associado cadastrado com este CPF.');
    }
  }
}

function reportAssociados_(filters) {
  var members = filterMembers_(readMembers_(), filters || {});
  var activeMembers = members.filter(function (member) {
    return member.status === 'ATIVO';
  });

  return {
    generatedAt: nowIso_(),
    unionName: getUnionName_(),
    filters: filters || {},
    summary: {
      total: members.length,
      ativos: activeMembers.length,
      inativos: members.length - activeMembers.length
    },
    groups: {
      porLocalTrabalho: countBy_(members, 'localTrabalho'),
      porSetor: countBy_(members, 'setor'),
      porFuncao: countBy_(members, 'funcao'),
      porStatus: countBy_(members, 'status')
    },
    members: members
  };
}

function filterMembers_(members, filters) {
  var search = normalizeText_(filters.search || '');
  var localTrabalho = normalizeText_(filters.localTrabalho || '');
  var setor = normalizeText_(filters.setor || '');
  var funcao = normalizeText_(filters.funcao || '');
  var status = String(filters.status || '').trim().toUpperCase();
  var dataInicial = cleanDate_(filters.dataInicial);
  var dataFinal = cleanDate_(filters.dataFinal);

  var result = members.filter(function (member) {
    if (search) {
      var searchable = normalizeText_([
        member.nome,
        member.cpf,
        member.rg,
        member.telefone,
        member.email,
        member.localTrabalho,
        member.setor,
        member.funcao,
        member.matricula,
        member.cidade
      ].join(' '));

      if (searchable.indexOf(search) === -1) {
        return false;
      }
    }

    if (localTrabalho && normalizeText_(member.localTrabalho) !== localTrabalho) {
      return false;
    }

    if (setor && normalizeText_(member.setor) !== setor) {
      return false;
    }

    if (funcao && normalizeText_(member.funcao) !== funcao) {
      return false;
    }

    if (status && member.status !== status) {
      return false;
    }

    if (dataInicial && (!member.dataAssociacao || member.dataAssociacao < dataInicial)) {
      return false;
    }

    if (dataFinal && (!member.dataAssociacao || member.dataAssociacao > dataFinal)) {
      return false;
    }

    return true;
  });

  sortMembers_(result, filters.sortBy, filters.sortDir);

  var limit = Number(filters.limit || 0);
  if (limit > 0) {
    result = result.slice(0, limit);
  }

  return result.map(function (member) {
    var copy = extend_({}, member);
    delete copy._rowNumber;
    return copy;
  });
}

function sortMembers_(members, sortBy, sortDir) {
  var allowed = {
    nome: true,
    localTrabalho: true,
    setor: true,
    funcao: true,
    status: true,
    updatedAt: true,
    dataAssociacao: true
  };
  var field = allowed[sortBy] ? sortBy : 'nome';
  var direction = String(sortDir || 'asc').toLowerCase() === 'desc' ? -1 : 1;

  members.sort(function (a, b) {
    var av = normalizeText_(a[field] || '');
    var bv = normalizeText_(b[field] || '');

    if (av < bv) return -1 * direction;
    if (av > bv) return 1 * direction;
    return normalizeText_(a.nome || '') < normalizeText_(b.nome || '') ? -1 : 1;
  });
}

function readMembers_() {
  return sheetToObjects_(ASSOC_SHEETS.MEMBERS).map(function (member) {
    member.status = member.status || 'ATIVO';
    return member;
  });
}

function getSheet_(sheetName) {
  var sheet = getSpreadsheet_().getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('A aba "' + sheetName + '" não foi encontrada. Execute setupDatabase().');
  }

  return sheet;
}

function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
}

function sheetToObjects_(sheetName) {
  var sheet = getSheet_(sheetName);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  var values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  var headers = values[0].map(function (header) {
    return String(header || '').trim();
  });
  var rows = [];

  values.slice(1).forEach(function (row, index) {
    var item = {};
    var hasValue = false;

    headers.forEach(function (header, columnIndex) {
      if (!header) {
        return;
      }

      item[header] = cellToString_(row[columnIndex]);

      if (item[header] !== '') {
        hasValue = true;
      }
    });

    if (hasValue) {
      item._rowNumber = index + 2;
      rows.push(item);
    }
  });

  return rows;
}

function appendObject_(sheet, objectValue, headers) {
  sheet.appendRow(headers.map(function (header) {
    return objectValue[header] == null ? '' : objectValue[header];
  }));
}

function updateRow_(sheet, rowNumber, objectValue, headers) {
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([
    headers.map(function (header) {
      return objectValue[header] == null ? '' : objectValue[header];
    })
  ]);
}

function getUnionName_() {
  var config = sheetToObjects_(ASSOC_SHEETS.CONFIG);
  var item = config.find(function (row) {
    return row.chave === 'UNION_NAME';
  });

  return item && item.valor ? item.valor : ASSOC_SETUP.UNION_NAME;
}

function audit_(action, entity, entityId, username, details) {
  try {
    var row = {
      id: generateId_('AUDIT'),
      acao: action,
      entidade: entity,
      entidadeId: entityId,
      usuario: username || '',
      detalhes: details || '',
      createdAt: nowIso_()
    };

    appendObject_(getSheet_(ASSOC_SHEETS.AUDIT), row, AUDIT_HEADERS);
  } catch (error) {
    Logger.log(error);
  }
}

function distinct_(items, field) {
  var seen = {};
  var values = [];

  items.forEach(function (item) {
    var value = clean_(item[field]);

    if (value && !seen[normalizeText_(value)]) {
      seen[normalizeText_(value)] = true;
      values.push(value);
    }
  });

  values.sort(function (a, b) {
    return normalizeText_(a) < normalizeText_(b) ? -1 : 1;
  });

  return values;
}

function countBy_(items, field) {
  var map = {};

  items.forEach(function (item) {
    var label = clean_(item[field]) || 'Não informado';
    var key = normalizeText_(label);

    if (!map[key]) {
      map[key] = {
        label: label,
        total: 0
      };
    }

    map[key].total += 1;
  });

  return Object.keys(map).map(function (key) {
    return map[key];
  }).sort(function (a, b) {
    if (b.total !== a.total) {
      return b.total - a.total;
    }

    return normalizeText_(a.label) < normalizeText_(b.label) ? -1 : 1;
  });
}

function safeUser_(user) {
  return {
    username: user.username,
    nome: user.nome,
    role: user.role
  };
}

function clean_(value) {
  return String(value == null ? '' : value).trim();
}

function onlyDigits_(value) {
  return clean_(value).replace(/\D/g, '');
}

function cleanDate_(value) {
  var text = clean_(value);

  if (!text) {
    return '';
  }

  var match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? match[1] + '-' + match[2] + '-' + match[3] : '';
}

function normalizeText_(value) {
  var text = clean_(value).toLowerCase();

  try {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (error) {
    return text;
  }
}

function cellToString_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone() || 'America/Sao_Paulo', 'yyyy-MM-dd');
  }

  return String(value == null ? '' : value).trim();
}

function nowIso_() {
  return new Date().toISOString();
}

function generateId_(prefix) {
  return prefix + '-' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Sao_Paulo', 'yyyyMMddHHmmss') +
    '-' +
    Utilities.getUuid().slice(0, 8).toUpperCase();
}

function hash_(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value || ''),
    Utilities.Charset.UTF_8
  );

  return bytes.map(function (byteValue) {
    var normalized = byteValue < 0 ? byteValue + 256 : byteValue;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function extend_(target, source) {
  Object.keys(source || {}).forEach(function (key) {
    target[key] = source[key];
  });

  return target;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
