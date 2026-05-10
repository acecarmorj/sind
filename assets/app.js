(function () {
  'use strict';

  var api = window.SIND_API;
  var runtime = api.getRuntime();
  var state = {
    bootstrap: null,
    members: [],
    dues: [],
    report: null,
    financialDashboard: null,
    documents: [],
    auditLogs: [],
    users: [],
    memberHistory: null,
    cashSummary: null,
    cashClosings: [],
    monthlyCashReport: null,
    cashBookReport: null,
    payables: [],
    payableAlerts: [],
    selectedHistoryMemberId: '',
    selectedDueId: '',
    currentTab: 'inicio',
    statsVisible: false,
    privacyMode: true
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

  function formatCpf(value) {
    var cpf = digits(value);

    if (cpf.length === 11) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    if (cpf.length === 14) {
      return cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }

    return value || '';
  }

  function formatPhone(value) {
    var phone = digits(value);

    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return value || '';
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

  function formatPercent(value) {
    return Number(value || 0).toFixed(1).replace('.', ',') + '%';
  }

  function formatBytes(value) {
    var bytes = Number(value || 0);
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1).replace('.', ',') + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  }

  function startManagementPhraseRotator() {
    var phrases = [
      'Conferência de cadastros, mensalidades e caixa para fechamento interno do período.',
      'Dados atualizados reduzem divergências entre secretaria, financeiro e chefia.',
      'Baixas, pendências e documentos devem ser revisados antes do encerramento mensal.',
      'Histórico organizado facilita atendimento, consulta interna e prestação de contas.',
      'Lançamentos consistentes geram relatórios mais confiáveis para a diretoria.'
    ];
    var phraseEl = byId('managementPhrase');
    if (!phraseEl) return;

    var index = 0;
    window.setInterval(function () {
      index = (index + 1) % phrases.length;
      phraseEl.classList.add('is-changing');

      window.setTimeout(function () {
        phraseEl.textContent = phrases[index];
        phraseEl.classList.remove('is-changing');
      }, 200);
    }, 6200);
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

  function formatCashMovementType(value) {
    return value === 'SAIDA' ? 'Saída' : 'Entrada';
  }

  function formatCashClassification(value) {
    var labels = {
      RECEITA_OPERACIONAL: 'Receita operacional',
      CUSTO_FIXO: 'Custo fixo',
      CUSTO_VARIAVEL: 'Custo variável'
    };
    return labels[value] || value || '-';
  }

  function formatPayableStatus(value) {
    return value === 'PAGA' ? 'Paga' : 'Pendente';
  }

  function daysUntil(dateStr) {
    if (!dateStr) return 0;
    var base = new Date(today() + 'T00:00:00');
    var target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return 0;
    return Math.round((target.getTime() - base.getTime()) / 86400000);
  }

  var CASH_CATEGORY_OPTIONS = {
    RECEITA_OPERACIONAL: [
      'Mensalidade avulsa',
      'Contribuição',
      'Doação ou apoio',
      'Taxa de documento',
      'Evento ou inscrição',
      'Reembolso',
      'Outra entrada'
    ],
    CUSTO_FIXO: [
      'Aluguel',
      'Energia elétrica',
      'Água',
      'Internet e telefone',
      'Contabilidade',
      'Sistema ou software',
      'Salários ou serviços fixos',
      'Tarifas bancárias',
      'Manutenção contratada',
      'Outro custo fixo'
    ],
    CUSTO_VARIAVEL: [
      'Material de escritório',
      'Impressões e cópias',
      'Evento ou reunião',
      'Deslocamento',
      'Correios ou entregas',
      'Manutenção eventual',
      'Taxas e emolumentos',
      'Serviços avulsos',
      'Compra de materiais',
      'Outro custo variável'
    ]
  };

  function isOtherCashCategory(value) {
    return [
      'Outra entrada',
      'Outro custo fixo',
      'Outro custo variável',
      'OUTRA'
    ].indexOf(String(value || '')) >= 0;
  }

  function updateCashMovementModeButtons() {
    var tipoEl = byId('cashMovementTipo');
    var expenseBtn = byId('cashExpenseModeBtn');
    var incomeBtn = byId('cashIncomeModeBtn');
    if (!tipoEl || !expenseBtn || !incomeBtn) return;

    var isExpense = tipoEl.value === 'SAIDA';
    expenseBtn.classList.toggle('active', isExpense);
    incomeBtn.classList.toggle('active', !isExpense);
  }

  function updateCashMovementCategoryOther() {
    var categoriaEl = byId('cashMovementCategoria');
    var wrap = byId('cashMovementCategoriaOutraWrap');
    var otherEl = byId('cashMovementCategoriaOutra');
    if (!categoriaEl || !wrap || !otherEl) return;

    var showOther = isOtherCashCategory(categoriaEl.value);
    wrap.classList.toggle('hidden', !showOther);
    if (!showOther) {
      otherEl.value = '';
    }
  }

  function populateCashMovementCategories(previousValue) {
    var categoriaEl = byId('cashMovementCategoria');
    var classificacaoEl = byId('cashMovementClassificacao');
    if (!categoriaEl || !classificacaoEl) return;

    var options = CASH_CATEGORY_OPTIONS[classificacaoEl.value] || [];
    categoriaEl.innerHTML = options.map(function (category) {
      return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
    }).join('');

    if (previousValue && options.indexOf(previousValue) >= 0) {
      categoriaEl.value = previousValue;
    } else if (options.length) {
      categoriaEl.value = options[0];
    }

    updateCashMovementCategoryOther();
  }

  function setCashMovementMode(mode) {
    var tipoEl = byId('cashMovementTipo');
    var classificacaoEl = byId('cashMovementClassificacao');
    if (!tipoEl || !classificacaoEl) return;

    if (mode === 'income') {
      tipoEl.value = 'ENTRADA';
      classificacaoEl.value = 'RECEITA_OPERACIONAL';
    } else {
      tipoEl.value = 'SAIDA';
      if (classificacaoEl.value === 'RECEITA_OPERACIONAL') {
        classificacaoEl.value = 'CUSTO_FIXO';
      }
    }

    updateCashMovementClassificationOptions();
    populateCashMovementCategories();
    updateCashMovementModeButtons();
  }


  function populateQuickExpenseCategories(previousValue) {
    var categoriaEl = byId('quickExpenseCategoria');
    var classificacaoEl = byId('quickExpenseClassificacao');
    if (!categoriaEl || !classificacaoEl) return;

    var options = CASH_CATEGORY_OPTIONS[classificacaoEl.value] || [];
    categoriaEl.innerHTML = options.map(function (category) {
      return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
    }).join('');

    if (previousValue && options.indexOf(previousValue) >= 0) {
      categoriaEl.value = previousValue;
    } else if (options.length) {
      categoriaEl.value = options[0];
    }
  }

  function resetQuickExpenseForm() {
    if (!byId('quickExpenseForm')) return;

    byId('quickExpenseDescricao').value = '';
    byId('quickExpenseValor').value = '';
    byId('quickExpenseClassificacao').value = 'CUSTO_VARIAVEL';
    populateQuickExpenseCategories();
  }

  function quickExpensePayload() {
    return {
      tipo: 'SAIDA',
      classificacao: byId('quickExpenseClassificacao').value,
      data: today(),
      categoria: byId('quickExpenseCategoria').value,
      valor: parseCurrencyInput(byId('quickExpenseValor').value),
      formaPagamento: 'PIX',
      descricao: byId('quickExpenseDescricao').value.trim(),
      observacoes: 'Despesa registrada pelo lançamento simples.'
    };
  }

  async function handleQuickExpenseSubmit(event) {
    event.preventDefault();
    clearMessages();

    if (!hasPermission('cash.close')) {
      setMessage('cashMessage', 'Você não tem permissão para lançar despesas.', 'error');
      return;
    }

    var payload = quickExpensePayload();

    if (!payload.descricao) {
      setMessage('cashMessage', 'Informe a descrição da despesa simples.', 'error');
      return;
    }

    if (!payload.valor || payload.valor <= 0) {
      setMessage('cashMessage', 'Informe um valor maior que zero.', 'error');
      return;
    }

    if (!payload.categoria) {
      setMessage('cashMessage', 'Selecione a categoria da despesa.', 'error');
      return;
    }

    try {
      await api.postApi('cash_movement_save', payload);
      setMessage('cashMessage', 'Despesa simples lançada no caixa.', 'success');
      resetQuickExpenseForm();
      await loadCash();
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('cashMessage', error.message || 'Falha ao lançar despesa simples.', 'error');
    }
  }

  function updatePayableCategoryOther() {
    var categoriaEl = byId('payableCategoria');
    var wrap = byId('payableCategoriaOutraWrap');
    var otherEl = byId('payableCategoriaOutra');
    if (!categoriaEl || !wrap || !otherEl) return;

    var showOther = isOtherCashCategory(categoriaEl.value);
    wrap.classList.toggle('hidden', !showOther);
    if (!showOther) {
      otherEl.value = '';
    }
  }

  function populatePayableCategories(previousValue) {
    var categoriaEl = byId('payableCategoria');
    var classificacaoEl = byId('payableClassificacao');
    if (!categoriaEl || !classificacaoEl) return;

    var options = CASH_CATEGORY_OPTIONS[classificacaoEl.value] || [];
    categoriaEl.innerHTML = options.map(function (category) {
      return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
    }).join('');

    if (previousValue && options.indexOf(previousValue) >= 0) {
      categoriaEl.value = previousValue;
    } else if (options.length) {
      categoriaEl.value = options[0];
    }

    updatePayableCategoryOther();
  }

  function resetPayableForm() {
    if (!byId('payableId')) return;

    byId('payableId').value = '';
    byId('payableDescricao').value = '';
    byId('payableFornecedor').value = '';
    byId('payableVencimento').value = today();
    byId('payableClassificacao').value = 'CUSTO_FIXO';
    byId('payableValor').value = '';
    byId('payableFormaPagamento').value = 'PIX';
    byId('payableObservacoes').value = '';
    if (byId('payableCategoriaOutra')) {
      byId('payableCategoriaOutra').value = '';
    }
    populatePayableCategories();
  }

  function payablePayload() {
    var selectedCategory = byId('payableCategoria').value;
    var otherCategory = byId('payableCategoriaOutra') ? byId('payableCategoriaOutra').value.trim() : '';
    var category = isOtherCashCategory(selectedCategory) ? otherCategory : selectedCategory;

    return {
      id: byId('payableId').value,
      descricao: byId('payableDescricao').value.trim(),
      fornecedor: byId('payableFornecedor').value.trim(),
      vencimento: byId('payableVencimento').value,
      classificacao: byId('payableClassificacao').value,
      categoria: category.trim(),
      valor: parseCurrencyInput(byId('payableValor').value),
      formaPagamento: byId('payableFormaPagamento').value,
      observacoes: byId('payableObservacoes').value.trim()
    };
  }

  function fillPayableForm(payable) {
    byId('payableId').value = payable.id || '';
    byId('payableDescricao').value = payable.descricao || '';
    byId('payableFornecedor').value = payable.fornecedor || '';
    byId('payableVencimento').value = payable.vencimento || today();
    byId('payableClassificacao').value = payable.classificacao || 'CUSTO_FIXO';
    byId('payableValor').value = payable.valor ? Number(payable.valor).toFixed(2).replace('.', ',') : '';
    byId('payableFormaPagamento').value = payable.formaPagamento || 'PIX';
    byId('payableObservacoes').value = payable.observacoes || '';
    populatePayableCategories(payable.categoria || '');
    if (byId('payableCategoria').value !== payable.categoria && byId('payableCategoriaOutra')) {
      byId('payableCategoria').value = byId('payableClassificacao').value === 'CUSTO_FIXO' ? 'Outro custo fixo' : 'Outro custo variável';
      byId('payableCategoriaOutra').value = payable.categoria || '';
      updatePayableCategoryOther();
    }
    byId('payableDescricao').focus();
  }

  function getFixedPayablesDueThisMonth() {
    var month = currentMonth();
    var source = state.payableAlerts && state.payableAlerts.length ? state.payableAlerts : state.payables;
    return (source || []).filter(function (payable) {
      return payable.status !== 'PAGA' &&
        payable.classificacao === 'CUSTO_FIXO' &&
        String(payable.vencimento || '').slice(0, 7) === month;
    }).sort(function (a, b) {
      return String(a.vencimento || '').localeCompare(String(b.vencimento || ''));
    });
  }

  function renderPayableAlerts() {
    var due = getFixedPayablesDueThisMonth();
    var startAlert = byId('payableMonthAlert');
    var startText = byId('payableMonthAlertText');
    var dueBox = byId('payablesDueBox');

    if (startAlert && startText) {
      startAlert.classList.toggle('hidden', due.length === 0);
      startText.textContent = due.length === 0 ?
        'Nenhuma despesa fixa pendente para este mês.' :
        due.length + ' despesa(s) fixa(s) pendente(s) com vencimento neste mês.';
    }

    if (!dueBox) return;

    if (!due.length) {
      dueBox.innerHTML = '<p class="muted small">Nenhuma despesa fixa pendente para este mês.</p>';
      return;
    }

    dueBox.innerHTML = due.slice(0, 6).map(function (payable) {
      var delta = daysUntil(payable.vencimento);
      var statusText = delta < 0 ? 'Vencida há ' + Math.abs(delta) + ' dia(s)' :
        delta === 0 ? 'Vence hoje' :
          'Vence em ' + delta + ' dia(s)';
      return [
        '<div class="payable-due-item ' + (delta < 0 ? 'is-overdue' : 'is-this-month') + '">',
        '<strong>' + escapeHtml(payable.descricao || '-') + '</strong>',
        '<span>' + escapeHtml(formatDate(payable.vencimento)) + ' · ' + escapeHtml(statusText) + '</span>',
        '<span>' + escapeHtml(payable.fornecedor || '-') + ' · ' + escapeHtml(formatCashClassification(payable.classificacao)) + '</span>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderPayables() {
    var items = state.payables || [];
    var tbody = byId('payablesTableBody');

    renderPayableAlerts();

    if (!tbody) return;

    tbody.innerHTML = items.length ? items.map(function (payable) {
      var statusClass = payable.status === 'PAGA' ? 'is-paga' : 'is-pendente';
      var canPay = payable.status !== 'PAGA';
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDate(payable.vencimento)) + '</td>',
        '<td><strong>' + escapeHtml(payable.descricao || '-') + '</strong><div class="muted small">' + escapeHtml(payable.observacoes || '') + '</div></td>',
        '<td>' + escapeHtml(payable.fornecedor || '-') + '</td>',
        '<td>' + escapeHtml(formatCashClassification(payable.classificacao)) + '</td>',
        '<td>' + escapeHtml(payable.categoria || '-') + '</td>',
        '<td><strong>' + escapeHtml(formatCurrency(payable.valor)) + '</strong></td>',
        '<td><span class="payable-status ' + statusClass + '">' + escapeHtml(formatPayableStatus(payable.status)) + '</span></td>',
        '<td>',
        '<button class="btn btn-secondary js-edit-payable" data-id="' + escapeHtml(payable.id) + '" data-permission="cash.close" type="button">Editar</button> ',
        canPay ? '<button class="btn btn-primary js-pay-payable" data-id="' + escapeHtml(payable.id) + '" data-permission="cash.close" type="button">Baixar</button> ' : '',
        '<button class="btn btn-secondary js-delete-payable" data-id="' + escapeHtml(payable.id) + '" data-permission="cash.close" type="button">Excluir</button>',
        '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="8" class="muted">Nenhuma conta a pagar encontrada.</td></tr>';

    applyPermissions();
  }

  async function loadPayables() {
    if (!hasPermission('cash.read') || !byId('payablesCompetencia')) {
      state.payables = [];
      state.payableAlerts = [];
      renderPayables();
      return;
    }

    var response = await api.postApi('payables_list', {
      competencia: byId('payablesCompetencia').value || currentMonth(),
      status: byId('payablesStatusFilter').value
    });
    var alertResponse = await api.postApi('payables_list', {
      competencia: currentMonth(),
      status: 'PENDENTE',
      classificacao: 'CUSTO_FIXO'
    });

    state.payables = response.data.items || [];
    state.payableAlerts = alertResponse.data.items || [];
    renderPayables();
  }

  async function handlePayableSubmit(event) {
    event.preventDefault();
    clearMessages();

    if (!hasPermission('cash.close')) {
      setMessage('payableMessage', 'Você não tem permissão para salvar contas a pagar.', 'error');
      return;
    }

    var payload = payablePayload();

    if (!payload.descricao) {
      setMessage('payableMessage', 'Informe a descrição da conta.', 'error');
      return;
    }

    if (!payload.vencimento) {
      setMessage('payableMessage', 'Informe o vencimento.', 'error');
      return;
    }

    if (!payload.valor || payload.valor <= 0) {
      setMessage('payableMessage', 'Informe um valor maior que zero.', 'error');
      return;
    }

    if (!payload.categoria) {
      setMessage('payableMessage', 'Selecione ou informe a categoria.', 'error');
      return;
    }

    try {
      await api.postApi('payable_save', payload);
      setMessage('payableMessage', 'Conta a pagar salva.', 'success');
      resetPayableForm();
      await loadPayables();
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('payableMessage', error.message || 'Falha ao salvar conta a pagar.', 'error');
    }
  }

  async function markPayablePaid(id) {
    if (!hasPermission('cash.close')) {
      setMessage('payableMessage', 'Você não tem permissão para baixar contas.', 'error');
      return;
    }

    var payable = (state.payables || []).find(function (item) {
      return item.id === id;
    });

    if (!payable) {
      setMessage('payableMessage', 'Conta a pagar não encontrada.', 'error');
      return;
    }

    if (!window.confirm('Baixar esta conta e registrar a saída no caixa?')) return;

    try {
      await api.postApi('payable_mark_paid', {
        id: id,
        pagoEm: today(),
        formaPagamento: payable.formaPagamento || 'PIX'
      });
      setMessage('payableMessage', 'Conta baixada e saída lançada no caixa.', 'success');
      await Promise.all([loadPayables(), loadCash()]);
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('payableMessage', error.message || 'Falha ao baixar conta.', 'error');
    }
  }

  async function deletePayable(id) {
    if (!hasPermission('cash.close')) {
      setMessage('payableMessage', 'Você não tem permissão para excluir contas.', 'error');
      return;
    }

    if (!window.confirm('Deseja excluir esta conta a pagar?')) return;

    try {
      await api.postApi('payable_delete', { id: id });
      setMessage('payableMessage', 'Conta a pagar excluída.', 'success');
      await loadPayables();
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('payableMessage', error.message || 'Falha ao excluir conta.', 'error');
    }
  }

  function buildCashMonthlyReportPrintHtml(report) {
    var categoryTotals = buildCashCategoryTotals(report.movimentos || []);
    var categoryRows = Object.keys(categoryTotals).sort().map(function (key) {
      var item = categoryTotals[key];
      return [
        '<tr>',
        '<td>' + escapeHtml(item.categoria) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.entradas)) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.saidas)) + '</td>',
        '</tr>'
      ].join('');
    }).join('') || '<tr><td colspan="3">Nenhum lançamento manual categorizado.</td></tr>';

    var movementRows = (report.movimentos || []).map(function (movement) {
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDate(movement.data)) + '</td>',
        '<td>' + escapeHtml(formatCashMovementType(movement.tipo)) + '</td>',
        '<td>' + escapeHtml(formatCashClassification(movement.classificacao)) + '</td>',
        '<td>' + escapeHtml(movement.categoria || '-') + '</td>',
        '<td>' + escapeHtml(movement.descricao || '-') + '</td>',
        '<td>' + escapeHtml(formatCurrency(movement.valor)) + '</td>',
        '</tr>'
      ].join('');
    }).join('') || '<tr><td colspan="6">Nenhum lançamento manual no mês.</td></tr>';

    return [
      '<section class="print-report">',
      '<h1>Relatório mensal do caixa</h1>',
      '<div class="muted">ACEAP · Competência: ' + escapeHtml(formatMonth(report.competencia)) + ' · Emitido em: ' + escapeHtml(new Date().toLocaleString('pt-BR')) + '</div>',
      '<div class="print-report-summary">',
      '<div><span>Entradas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalEntradas || 0)) + '</strong></div>',
      '<div><span>Custos fixos</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saidasFixas || 0)) + '</strong></div>',
      '<div><span>Custos variáveis</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saidasVariaveis || 0)) + '</strong></div>',
      '<div><span>Total de saídas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalSaidas || 0)) + '</strong></div>',
      '<div><span>Saldo</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saldoPeriodo || 0)) + '</strong></div>',
      '<div><span>Mensalidades recebidas</span><strong>' + escapeHtml(formatCurrency(report.totalRecebido || 0)) + '</strong></div>',
      '</div>',
      '<table><thead><tr><th>Categoria</th><th>Entradas</th><th>Saídas</th></tr></thead><tbody>' + categoryRows + '</tbody></table>',
      '<table><thead><tr><th>Data</th><th>Tipo</th><th>Classificação</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>' + movementRows + '</tbody></table>',
      '</section>'
    ].join('');
  }

  function printCashMonthlyReport() {
    var report = state.monthlyCashReport;
    if (!report) {
      setMessage('cashMessage', 'Gere o relatório mensal antes de imprimir ou salvar em PDF.', 'error');
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildCashMonthlyReportPrintHtml(report);
    document.body.appendChild(wrapper.firstChild);
    document.body.classList.add('printing-report');

    window.setTimeout(function () {
      window.print();
      window.setTimeout(function () {
        var reportEl = document.querySelector('.print-report');
        if (reportEl) reportEl.remove();
        document.body.classList.remove('printing-report');
      }, 300);
    }, 80);
  }


  function updateStatusBar() {
    var now = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    var user = (state.bootstrap && (state.bootstrap.displayName || state.bootstrap.username)) || '-';
    var statusUser = byId('statusUser');
    var statusLastUpdate = byId('statusLastUpdate');
    var statusConnection = byId('statusConnection');

    if (statusUser) statusUser.textContent = 'Usuário: ' + user;
    if (statusLastUpdate) statusLastUpdate.textContent = 'Última atualização: ' + now;
    if (statusConnection) statusConnection.textContent = api.getSessionToken() ? 'Conectado' : 'Desconectado';

    updatePrivacyMode();
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
      'historyMessage',
      'attachmentMessage',
      'cashMessage',
      'payableMessage',
      'eventMessage',
      'announcementMessage',
      'financeMessage',
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
    return buttons.length ? buttons[0].getAttribute('data-tab') : 'inicio';
  }

  function currentSectionForTab(tabName) {
    var sections = {
      inicio: 'inicio',
      cadastro: 'associados',
      historico: 'associados',
      mensalidades: 'associados',
      caixa: 'financeiro',
      despesas: 'financeiro',
      'contas-pagar': 'financeiro',
      documentos: 'documentos',
      eventos: 'eventos',
      avisos: 'avisos',
      relatorios: 'relatorios',
      usuarios: 'usuarios',
      auditoria: 'auditoria'
    };

    return sections[tabName] || tabName || 'inicio';
  }

  function quickActionsTitle(tabName) {
    var titles = {
      inicio: 'Atalhos de início',
      cadastro: 'Ações de cadastro',
      historico: 'Ações de histórico',
      mensalidades: 'Ações de mensalidades',
      caixa: 'Ações de caixa',
      despesas: 'Ações de movimentos',
      'contas-pagar': 'Ações de contas a pagar',
      documentos: 'Ações de documentos',
      eventos: 'Ações de eventos',
      avisos: 'Ações de avisos',
      relatorios: 'Ações de relatórios',
      usuarios: 'Ações de usuários',
      auditoria: 'Ações de auditoria'
    };

    return titles[tabName] || 'Ações da tela';
  }

  function breadcrumbForTab(tabName) {
    var labels = {
      inicio: 'Início',
      cadastro: 'Associados > Cadastro',
      historico: 'Associados > Histórico',
      mensalidades: 'Associados > Mensalidades',
      caixa: 'Financeiro > Caixa',
      despesas: 'Financeiro > Despesas',
      'contas-pagar': 'Financeiro > Contas a pagar',
      documentos: 'Documentos',
      eventos: 'Comunicação > Eventos',
      avisos: 'Comunicação > Avisos',
      relatorios: 'Relatórios',
      usuarios: 'Usuários',
      auditoria: 'Auditoria'
    };

    return 'Você está em: ' + (labels[tabName] || 'Início');
  }

  function updatePrivacyMode() {
    var toggle = byId('privacyToggleBtn');
    var status = byId('statusPrivacy');

    document.body.classList.toggle('privacy-mode', state.privacyMode);

    if (toggle) {
      toggle.textContent = state.privacyMode ? 'Privacidade ativa' : 'Privacidade desativada';
      toggle.setAttribute('aria-pressed', state.privacyMode ? 'true' : 'false');
    }

    if (status) {
      status.textContent = state.privacyMode ? 'Privacidade: ativa' : 'Privacidade: desativada';
    }
  }

  function bindTableRowSelection() {
    qsa('.table-wrap tbody').forEach(function (tbody) {
      tbody.addEventListener('click', function (event) {
        var row = event.target.closest('tr');
        if (!row || !tbody.contains(row)) return;

        Array.prototype.forEach.call(tbody.querySelectorAll('tr'), function (item) {
          item.classList.remove('is-selected');
        });

        row.classList.add('is-selected');
      });
    });
  }

  function stabilizeViewport() {
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;

    if (window.scrollX) {
      window.scrollTo(0, window.scrollY);
    }
  }

  function focusWithoutLayoutJump(elementId) {
    var element = byId(elementId);

    if (!element) return;

    window.setTimeout(function () {
      try {
        element.focus({ preventScroll: true });
      } catch (error) {
        element.focus();
      }

      stabilizeViewport();
    }, 80);
  }


  function updateQuickActions(tabName) {
    var sectionName = currentSectionForTab(tabName);
    var label = byId('quickActionsLabel');
    var breadcrumb = byId('currentBreadcrumb');

    if (label) {
      label.textContent = quickActionsTitle(tabName);
    }

    if (breadcrumb) {
      breadcrumb.textContent = breadcrumbForTab(tabName);
    }

    qsa('.action-cluster').forEach(function (cluster) {
      var screens = String(cluster.getAttribute('data-action-screen') || '').split(/\s+/).filter(Boolean);
      var sections = String(cluster.getAttribute('data-action-section') || '').split(/\s+/).filter(Boolean);
      var visible = screens.indexOf(tabName) >= 0 || (!screens.length && sections.indexOf(sectionName) >= 0);
      cluster.classList.toggle('context-hidden', !visible);
    });

    qsa('.quick-action-btn').forEach(function (button) {
      var screens = String(button.getAttribute('data-action-screen') || '').split(/\s+/).filter(Boolean);
      var sections = String(button.getAttribute('data-action-section') || '').split(/\s+/).filter(Boolean);
      var visible = screens.indexOf(tabName) >= 0 || (!screens.length && (!sections.length || sections.indexOf(sectionName) >= 0));
      button.classList.toggle('context-hidden', !visible);
    });
  }

  function showTab(tabName) {
    var sectionName = currentSectionForTab(tabName);

    state.currentTab = tabName;
    qsa('.tab-btn').forEach(function (button) {
      var current = button.getAttribute('data-tab') === tabName ||
        button.getAttribute('data-section') === sectionName;
      button.classList.toggle('active', current);
    });

    qsa('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });

    qsa('.module-link[data-go-tab], .finance-module-tile[data-go-tab]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-go-tab') === tabName);
    });

    updateQuickActions(tabName);
    stabilizeViewport();
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

    if (!hasPermission('members.read') && state.currentTab === 'historico') {
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

    if (!hasPermission('cash.read') && state.currentTab === 'caixa') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('cash.read') && state.currentTab === 'despesas') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('cash.read') && state.currentTab === 'contas-pagar') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('events.read') && state.currentTab === 'eventos') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('announcements.read') && state.currentTab === 'avisos') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('users.manage') && state.currentTab === 'usuarios') {
      showTab(firstAllowedTab());
      return;
    }

    if (!hasPermission('audit.read') && state.currentTab === 'auditoria') {
      showTab(firstAllowedTab());
      return;
    }

    updateQuickActions(state.currentTab);
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

  function updateCashPeriodVisibility() {
    var monthly = byId('cashTipo').value === 'MENSAL';
    byId('cashDataWrap').classList.toggle('hidden', monthly);
    byId('cashCompetenciaWrap').classList.toggle('hidden', !monthly);
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
    byId('memberFormTitle').textContent = 'Novo associado';
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
    byId('memberFormTitle').textContent = 'Editar associado';
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

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || '');
        resolve(result.indexOf(',') >= 0 ? result.split(',').pop() : result);
      };
      reader.onerror = function () {
        reject(new Error('Falha ao ler o arquivo.'));
      };
      reader.readAsDataURL(file);
    });
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
      select.innerHTML = '<option value="">Nenhum associado disponível</option>';
      return;
    }

    select.innerHTML = activeMembers.map(function (member) {
      return '<option value="' + escapeHtml(member.id) + '">' +
        escapeHtml(member.nome + ' - ' + maskCpf(member.cpf || '')) +
      '</option>';
    }).join('');
  }

  function renderHistoryMemberOptions() {
    var select = byId('historyMemberId');
    var selected = state.selectedHistoryMemberId || select.value;

    if (!state.members.length) {
      select.innerHTML = '<option value="">Nenhum associado cadastrado</option>';
      return;
    }

    select.innerHTML = '<option value="">Selecione um associado</option>' + state.members.map(function (member) {
      return '<option value="' + escapeHtml(member.id) + '">' +
        escapeHtml(member.nome + ' - ' + maskCpf(member.cpf || '')) +
        '</option>';
    }).join('');

    if (selected && state.members.some(function (member) { return member.id === selected; })) {
      select.value = selected;
    }
  }

  function renderMembers() {
    var tbody = byId('membersTableBody');
    var items = filteredMembers();

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum associado encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function (member) {
      var actions = [];

      if (hasPermission('members.write')) {
        actions.push('<button class="btn btn-secondary js-edit-member" data-id="' + escapeHtml(member.id) + '" type="button">Alterar</button>');
      }

      if (hasPermission('members.read')) {
        actions.push('<button class="btn btn-secondary js-history-member" data-id="' + escapeHtml(member.id) + '" type="button">Ficha completa</button>');
      }

      if (hasPermission('members.inactivate') && member.status !== 'INATIVO') {
        actions.push('<button class="btn btn-secondary js-inactivate-member" data-id="' + escapeHtml(member.id) + '" type="button">Inativar</button>');
      }

      if (hasPermission('documents.issue')) {
        actions.push('<button class="btn btn-secondary js-declaration-member" data-id="' + escapeHtml(member.id) + '" type="button">Declaração</button>');
        actions.push('<button class="btn btn-secondary js-profile-member" data-id="' + escapeHtml(member.id) + '" type="button">Ficha</button>');
      }

      return [
        '<tr>',
        '<td><strong>' + escapeHtml(member.nome) + '</strong><div class="muted small">' + escapeHtml(member.email || 'Sem e-mail') + '</div></td>',
        '<td class="privacy-sensitive">' + escapeHtml(maskCpf(member.cpf)) + '</td>',
        '<td>' + escapeHtml(member.empresa || '-') + '</td>',
        '<td class="privacy-sensitive">' + escapeHtml(maskPhone(member.telefone || '')) + '</td>',
        '<td>' + buildBadge(member.status) + '</td>',
        '<td class="members-actions-cell"><div class="actions member-row-actions">' + actions.join('') + '</div></td>',
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
        '<td class="privacy-sensitive">' + escapeHtml(formatCurrency(due.valor)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.vencimento)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.pagoEm)) + '</td>',
        '<td>' + buildBadge(due.status) + '</td>',
        '<td class="members-actions-cell"><div class="actions member-row-actions">' + actions.join('') + '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderReport() {
    var dashboard = state.financialDashboard || {};
    var totals = dashboard.totals || {};
    var monthly = dashboard.arrecadacaoMensal || [];
    var statusItems = dashboard.porStatus || [];
    var inadimplentes = dashboard.inadimplentes || [];
    var maxMonthly = monthly.reduce(function (max, item) {
      return Math.max(max, Number(item.totalPago || 0), Number(item.totalLancado || 0));
    }, 0);
    var taxaPago = totals.totalLancado ? (Number(totals.totalPago || 0) / Number(totals.totalLancado || 1)) * 100 : 0;

    byId('financeLancado').textContent = formatCurrency(totals.totalLancado || 0);
    byId('financePago').textContent = formatCurrency(totals.totalPago || 0);
    byId('financeAberto').textContent = formatCurrency(totals.totalAberto || 0);
    byId('financeAtrasado').textContent = formatCurrency(totals.totalAtrasado || 0);
    byId('financeTaxaPago').textContent = formatPercent(taxaPago);
    byId('financeInadimplentes').textContent = String(inadimplentes.length || 0);

    byId('financeMonthlyBars').innerHTML = monthly.length ? monthly.map(function (item) {
      var paidPercent = maxMonthly ? Math.round((Number(item.totalPago || 0) / maxMonthly) * 100) : 0;
      var launchedPercent = maxMonthly ? Math.round((Number(item.totalLancado || 0) / maxMonthly) * 100) : 0;
      return [
        '<div class="bar-row">',
        '<div class="bar-title"><strong>' + escapeHtml(formatMonth(item.competencia)) + '</strong><span>' + escapeHtml(formatCurrency(item.totalPago || 0)) + '</span></div>',
        '<div class="bar-track"><span class="bar-fill paid" style="width:' + paidPercent + '%"></span><span class="bar-fill launched" style="width:' + launchedPercent + '%"></span></div>',
        '<div class="bar-caption">Lançado: ' + escapeHtml(formatCurrency(item.totalLancado || 0)) + ' · Aberto/atrasado: ' + escapeHtml(formatCurrency(Number(item.totalAberto || 0) + Number(item.totalAtrasado || 0))) + '</div>',
        '</div>'
      ].join('');
    }).join('') : '<p class="muted">Nenhum movimento no período.</p>';

    byId('financeStatusTableBody').innerHTML = statusItems.length ? statusItems.map(function (item) {
      return [
        '<tr>',
        '<td>' + buildBadge(item.status || '-') + '</td>',
        '<td>' + escapeHtml(item.quantidade || 0) + '</td>',
        '<td><strong>' + escapeHtml(formatCurrency(item.total || 0)) + '</strong></td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="3" class="muted">Nenhum status para exibir.</td></tr>';

    byId('financeInadTableBody').innerHTML = inadimplentes.length ? inadimplentes.map(function (item) {
      return [
        '<tr>',
        '<td>' + escapeHtml(item.memberNome) + '</td>',
        '<td>' + escapeHtml(maskCpf(item.memberCpf || '')) + '</td>',
        '<td>' + escapeHtml(item.quantidade || 0) + '</td>',
        '<td>' + escapeHtml(formatMonth(item.ultimaCompetencia)) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.total)) + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="5" class="muted">Nenhum inadimplente no período.</td></tr>';
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
      actions.push('<button class="btn btn-secondary js-edit-user" data-id="' + escapeHtml(user.id) + '" type="button">Alterar</button>');
      actions.push('<button class="btn btn-secondary js-toggle-user" data-id="' + escapeHtml(user.id) + '" type="button">' + escapeHtml(user.status === 'ATIVO' ? 'Inativar' : 'Ativar') + '</button>');

      return [
        '<tr>',
        '<td>' + escapeHtml(user.nome || '-') + '</td>',
        '<td>' + escapeHtml(user.username || '-') + '</td>',
        '<td>' + buildBadge(user.role || '-') + '</td>',
        '<td>' + buildBadge(user.status || '-') + '</td>',
        '<td class="members-actions-cell"><div class="actions member-row-actions">' + actions.join('') + '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderMemberHistory() {
    var data = state.memberHistory || {};
    var member = data.member || null;
    var summary = data.summary || {};
    var dues = data.dues || [];
    var documents = data.documents || [];
    var attachments = data.attachments || [];
    var auditLogs = data.auditLogs || [];

    byId('historyTotalLancado').textContent = formatCurrency(summary.totalLancado || 0);
    byId('historyTotalPago').textContent = formatCurrency(summary.totalPago || 0);
    byId('historyPendente').textContent = formatCurrency(Number(summary.totalAberto || 0) + Number(summary.totalAtrasado || 0));
    byId('historyDocumentos').textContent = String(summary.quantidadeDocumentos || 0);
    byId('historyAnexos').textContent = String(summary.quantidadeAnexos || 0);

    if (!member) {
      byId('historyMemberCard').innerHTML = '<p class="muted">Selecione um associado para consultar o histórico.</p>';
      byId('historyFinanceCard').innerHTML = '<p class="muted">Sem associado selecionado.</p>';
      byId('historyDuesTableBody').innerHTML = '<tr><td colspan="6" class="muted">Nenhuma mensalidade para exibir.</td></tr>';
      byId('historyDocumentsTableBody').innerHTML = '<tr><td colspan="4" class="muted">Nenhum documento para exibir.</td></tr>';
      byId('historyAttachmentsTableBody').innerHTML = '<tr><td colspan="6" class="muted">Nenhum anexo para exibir.</td></tr>';
      byId('historyAuditTableBody').innerHTML = '<tr><td colspan="4" class="muted">Nenhum log relacionado.</td></tr>';
      return;
    }

    byId('historyMemberCard').innerHTML = [
      '<div><strong>' + escapeHtml(member.nome || '-') + '</strong></div>',
      '<div>CPF: ' + escapeHtml(maskCpf(member.cpf || '')) + '</div>',
      '<div>Status: ' + buildBadge(member.status || '-') + '</div>',
      '<div>Empresa: ' + escapeHtml(member.empresa || '-') + '</div>',
      '<div>Cargo: ' + escapeHtml(member.cargo || '-') + '</div>',
      '<div>Telefone: ' + escapeHtml(maskPhone(member.telefone || '')) + '</div>',
      '<div>E-mail: ' + escapeHtml(member.email || '-') + '</div>',
      '<div>Filiação: ' + escapeHtml(formatDate(member.dataFiliacao)) + '</div>'
    ].join('');

    byId('historyFinanceCard').innerHTML = [
      '<div>Mensalidades: <strong>' + escapeHtml(summary.quantidadeMensalidades || 0) + '</strong></div>',
      '<div>Pagas: <strong>' + escapeHtml(summary.quantidadePagas || 0) + '</strong></div>',
      '<div>Em aberto: <strong>' + escapeHtml(summary.quantidadeAbertas || 0) + '</strong></div>',
      '<div>Atrasadas: <strong>' + escapeHtml(summary.quantidadeAtrasadas || 0) + '</strong></div>',
      '<div>Total em aberto: <strong>' + escapeHtml(formatCurrency(summary.totalAberto || 0)) + '</strong></div>',
      '<div>Total em atraso: <strong>' + escapeHtml(formatCurrency(summary.totalAtrasado || 0)) + '</strong></div>'
    ].join('');

    byId('historyDuesTableBody').innerHTML = dues.length ? dues.map(function (due) {
      return [
        '<tr>',
        '<td>' + escapeHtml(formatMonth(due.competencia)) + '</td>',
        '<td class="privacy-sensitive">' + escapeHtml(formatCurrency(due.valor)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.vencimento)) + '</td>',
        '<td>' + escapeHtml(formatDate(due.pagoEm)) + '</td>',
        '<td>' + escapeHtml(due.formaPagamento || '-') + '</td>',
        '<td>' + buildBadge(due.status || '-') + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="6" class="muted">Nenhuma mensalidade encontrada.</td></tr>';

    byId('historyDocumentsTableBody').innerHTML = documents.length ? documents.map(function (doc) {
      return [
        '<tr>',
        '<td><strong>' + escapeHtml(doc.numero || '-') + '</strong></td>',
        '<td>' + escapeHtml(formatDocType(doc.tipo || '-')) + '</td>',
        '<td>' + escapeHtml(doc.competencia ? doc.competencia.length === 4 ? doc.competencia : formatMonth(doc.competencia) : '-') + '</td>',
        '<td>' + escapeHtml(formatDateTime(doc.createdAt)) + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="4" class="muted">Nenhum documento emitido.</td></tr>';

    byId('historyAttachmentsTableBody').innerHTML = attachments.length ? attachments.map(function (item) {
      return [
        '<tr>',
        '<td><strong>' + escapeHtml(item.driveFileName || '-') + '</strong></td>',
        '<td>' + escapeHtml(item.tipo || '-') + '</td>',
        '<td>' + escapeHtml(item.descricao || '-') + '</td>',
        '<td>' + escapeHtml(formatBytes(item.tamanhoBytes)) + '</td>',
        '<td>' + escapeHtml(formatDateTime(item.createdAt)) + '</td>',
        '<td><button class="btn btn-secondary js-download-attachment" data-id="' + escapeHtml(item.id) + '" type="button">Baixar</button></td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="6" class="muted">Nenhum anexo cadastrado.</td></tr>';

    byId('historyAuditTableBody').innerHTML = auditLogs.length ? auditLogs.map(function (item) {
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDateTime(item.timestamp)) + '</td>',
        '<td>' + escapeHtml(item.username || '-') + '</td>',
        '<td>' + escapeHtml(item.action || '-') + '</td>',
        '<td>' + escapeHtml(item.details || '-') + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="4" class="muted">Nenhum log relacionado.</td></tr>';
  }

  function renderCash() {
    var summary = state.cashSummary || {};
    var porForma = summary.porForma || {};
    var pagamentos = summary.pagamentos || [];
    var movimentos = summary.movimentos || [];
    var existing = summary.fechamentoExistente || null;
    var closings = state.cashClosings || [];
    var methods = ['PIX', 'DINHEIRO', 'BOLETO', 'CARTAO', 'TRANSFERENCIA', 'OUTRO'];

    byId('cashTotalEntradas').textContent = formatCurrency(summary.totalEntradas || summary.totalRecebido || 0);
    byId('cashCustosFixos').textContent = formatCurrency(summary.saidasFixas || 0);
    byId('cashCustosVariaveis').textContent = formatCurrency(summary.saidasVariaveis || 0);
    byId('cashSaldoPeriodo').textContent = formatCurrency(summary.saldoPeriodo || 0);
    byId('cashTotalRecebido').textContent = formatCurrency(summary.totalRecebido || 0);
    byId('cashQuantidadePagamentos').textContent = String(summary.quantidadePagamentos || 0);
    byId('cashPeriodo').textContent = summary.periodoInicio ?
      formatDate(summary.periodoInicio) + (summary.periodoFim && summary.periodoFim !== summary.periodoInicio ? ' a ' + formatDate(summary.periodoFim) : '') :
      '-';
    byId('cashStatus').textContent = existing ? 'Fechado' : 'Aberto';
    byId('cashObservacoes').value = existing && existing.observacoes ? existing.observacoes : byId('cashObservacoes').value;

    byId('cashMethodsTableBody').innerHTML = methods.map(function (method) {
      return [
        '<tr>',
        '<td>' + escapeHtml(method) + '</td>',
        '<td><strong>' + escapeHtml(formatCurrency(porForma[method] || 0)) + '</strong></td>',
        '</tr>'
      ].join('');
    }).join('');

    byId('cashMovementsTableBody').innerHTML = movimentos.length ? movimentos.map(function (movement) {
      var valuePrefix = movement.tipo === 'SAIDA' ? '-' : '+';
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDate(movement.data)) + '</td>',
        '<td>' + escapeHtml(formatCashMovementType(movement.tipo)) + '</td>',
        '<td>' + escapeHtml(formatCashClassification(movement.classificacao)) + '</td>',
        '<td>' + escapeHtml(movement.categoria || '-') + '</td>',
        '<td><strong>' + escapeHtml(movement.descricao || '-') + '</strong><div class="muted small">' + escapeHtml(movement.formaPagamento || '-') + '</div></td>',
        '<td><strong>' + escapeHtml(valuePrefix + ' ' + formatCurrency(movement.valor)) + '</strong></td>',
        '<td><button class="btn btn-secondary js-delete-cash-movement" data-id="' + escapeHtml(movement.id) + '" data-permission="cash.close" type="button">Excluir</button></td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="7" class="muted">Nenhum lançamento manual no período.</td></tr>';

    byId('cashPaymentsTableBody').innerHTML = pagamentos.length ? pagamentos.map(function (payment) {
      return [
        '<tr>',
        '<td><strong>' + escapeHtml(payment.memberNome || '-') + '</strong><div class="muted small">' + escapeHtml(maskCpf(payment.memberCpf || '')) + '</div></td>',
        '<td>' + escapeHtml(formatMonth(payment.competencia)) + '</td>',
        '<td>' + escapeHtml(formatDate(payment.pagoEm)) + '</td>',
        '<td>' + escapeHtml(payment.formaPagamento || '-') + '</td>',
        '<td>' + escapeHtml(formatCurrency(payment.valor)) + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="5" class="muted">Nenhum pagamento encontrado no período.</td></tr>';

    byId('cashClosingsTableBody').innerHTML = closings.length ? closings.map(function (closing) {
      return [
        '<tr>',
        '<td>' + escapeHtml(closing.tipo || '-') + '</td>',
        '<td>' + escapeHtml(formatDate(closing.periodoInicio) + (closing.periodoFim !== closing.periodoInicio ? ' a ' + formatDate(closing.periodoFim) : '')) + '</td>',
        '<td><strong>' + escapeHtml(formatCurrency(closing.totalEntradas || closing.totalRecebido || 0)) + '</strong></td>',
        '<td>' + escapeHtml(formatCurrency(closing.totalSaidas || 0)) + '</td>',
        '<td><strong>' + escapeHtml(formatCurrency(closing.saldoPeriodo || 0)) + '</strong></td>',
        '<td>' + escapeHtml(closing.closedBy || '-') + '</td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="6" class="muted">Nenhum fechamento salvo.</td></tr>';

    renderCashMonthlyReport();
    applyPermissions();
  }

  function setStatValue(id, value) {
    var el = byId(id);
    if (!el) return;
    el.textContent = state.statsVisible ? value : '••••';
  }

  function updateStatsPrivacyState() {
    var toggleButton = byId('toggleStatsBtn');
    if (toggleButton) {
      toggleButton.textContent = state.statsVisible ? 'Ocultar valores' : 'Exibir valores';
      toggleButton.setAttribute('aria-pressed', state.statsVisible ? 'true' : 'false');
    }

    qsa('.stats-privacy-card .stat-card').forEach(function (card) {
      card.classList.toggle('is-masked', !state.statsVisible);
    });
  }

  function renderStats() {
    var activeMembers = state.members.filter(function (item) {
      return item.status === 'ATIVO';
    }).length;

    setStatValue('statMembers', String(activeMembers));
    setStatValue('statDues', String(state.dues.length));
    setStatValue('statPaid', formatCurrency((state.report && state.report.totalPago) || 0));
    setStatValue('statLate', formatCurrency((state.report && state.report.totalAtrasado) || 0));
    updateStatsPrivacyState();
  }

  async function loadBootstrap() {
    var response = await api.postApi('bootstrap', {});
    state.bootstrap = response.data;
    byId('unionName').textContent = state.bootstrap.unionName || runtime.UNION_NAME_FALLBACK;
    byId('buildInfo').textContent =
      'Usuário: ' + (state.bootstrap.displayName || state.bootstrap.username || '-') +
      ' · Perfil: ' + (state.bootstrap.role || '-') +
      ' · Versão: ' + (runtime.BUILD_VERSION || '-');

    updateStatusBar();
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
      renderHistoryMemberOptions();
      populateCatalogMemberOptions();
      renderMemberHistory();
      renderStats();
      return;
    }

    var response = await api.postApi('members_list', {});
    state.members = response.data.items || [];
    renderMembers();
    renderMemberOptions();
    renderHistoryMemberOptions();
    populateCatalogMemberOptions();
    renderStats();
  }

  async function loadMemberHistory(memberId) {
    if (!hasPermission('members.read')) {
      state.memberHistory = null;
      renderMemberHistory();
      return;
    }

    memberId = String(memberId || byId('historyMemberId').value || '').trim();
    state.selectedHistoryMemberId = memberId;

    if (!memberId) {
      state.memberHistory = null;
      renderMemberHistory();
      setMessage('historyMessage', 'Selecione um associado.', '');
      return;
    }

    setMessage('historyMessage', 'Carregando histórico...', '');

    var response = await api.postApi('member_history', { memberId: memberId });
    state.memberHistory = response.data || null;
    renderMemberHistory();
    setMessage('historyMessage', 'Histórico carregado.', 'success');
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
      state.financialDashboard = null;
      renderReport();
      renderStats();
      return;
    }

    setMessage('financeMessage', 'Carregando painel financeiro...', '');
    var response = await api.postApi('financial_dashboard', {
      inicio: byId('financialInicio').value,
      fim: byId('financialFim').value,
      status: byId('financialStatusFilter').value,
      search: byId('financialSearch').value.trim()
    });

    state.financialDashboard = response.data || {};
    state.report = (state.financialDashboard && state.financialDashboard.totals) || {};
    renderReport();
    renderStats();
    setMessage('financeMessage', 'Painel financeiro atualizado.', 'success');
  }

  function cashPayload() {
    return {
      tipo: byId('cashTipo').value,
      data: byId('cashData').value,
      competencia: byId('cashCompetencia').value,
      observacoes: byId('cashObservacoes').value.trim()
    };
  }

  async function loadCashSummary() {
    if (!hasPermission('cash.read')) {
      state.cashSummary = null;
      state.cashClosings = [];
      renderCash();
      return;
    }

    setMessage('cashMessage', 'Calculando caixa...', '');
    var response = await api.postApi('cash_closing_summary', cashPayload());
    state.cashSummary = response.data || {};
    renderCash();
    setMessage('cashMessage', 'Caixa calculado.', 'success');
  }

  async function loadCashClosings() {
    if (!hasPermission('cash.read')) {
      state.cashClosings = [];
      renderCash();
      return;
    }

    var response = await api.postApi('cash_closings_list', {
      tipo: byId('cashTipo').value === 'MENSAL' ? 'MENSAL' : '',
      competencia: byId('cashTipo').value === 'MENSAL' ? byId('cashCompetencia').value : '',
      inicio: byId('cashTipo').value === 'DIARIO' ? byId('cashData').value : '',
      fim: byId('cashTipo').value === 'DIARIO' ? byId('cashData').value : ''
    });
    state.cashClosings = response.data.items || [];
    renderCash();
  }

  async function loadCash() {
    await loadCashSummary();
    await loadCashClosings();
    await loadPayables();
    updateStatusBar();
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


  function formatEventType(value) {
    var labels = {
      CURSO: 'Curso',
      PALESTRA: 'Palestra',
      REUNIAO: 'Reunião',
      ASSEMBLEIA: 'Assembleia',
      CAMPANHA: 'Campanha',
      OUTRO: 'Outro'
    };
    return labels[value] || value || '-';
  }

  function yesNoLabel(value) {
    return String(value || '').toUpperCase() === 'SIM' ? 'Sim' : 'Não';
  }


  function populateCatalogMemberOptions() {
    var select = byId('catalogMemberId');

    if (!select) return;

    select.innerHTML = '<option value="">Selecione...</option>' + state.members.map(function (member) {
      var label = (member.empresa || member.nome || 'Associado') + ' — ' + formatCpf(member.cpf || '');
      return '<option value="' + escapeHtml(member.id) + '">' + escapeHtml(label) + '</option>';
    }).join('');
  }

  function catalogPayloadFromForm() {
    return {
      id: byId('catalogId').value,
      memberId: byId('catalogMemberId').value,
      publicName: byId('catalogPublicName').value.trim(),
      category: byId('catalogCategory').value.trim(),
      description: byId('catalogDescription').value.trim(),
      whatsapp: byId('catalogWhatsapp').value.trim(),
      instagram: byId('catalogInstagram').value.trim(),
      address: byId('catalogAddress').value.trim(),
      visible: byId('catalogVisible').value,
      highlight: byId('catalogHighlight').value
    };
  }

  function resetCatalogForm() {
    if (!byId('catalogForm')) return;
    byId('catalogForm').reset();
    byId('catalogId').value = '';
    byId('catalogVisible').value = 'SIM';
    byId('catalogHighlight').value = 'NAO';
    byId('catalogFormTitle').textContent = 'Empresa no catálogo';
    byId('catalogCancelEditBtn').classList.add('hidden');
    setMessage('catalogMessage', '', '');
  }

  function fillCatalogForm(item) {
    byId('catalogId').value = item.id || '';
    byId('catalogMemberId').value = item.memberId || '';
    byId('catalogPublicName').value = item.publicName || '';
    byId('catalogCategory').value = item.category || '';
    byId('catalogDescription').value = item.description || '';
    byId('catalogWhatsapp').value = formatPhone(item.whatsapp || '');
    byId('catalogInstagram').value = item.instagram || '';
    byId('catalogAddress').value = item.address || '';
    byId('catalogVisible').value = item.visible || 'SIM';
    byId('catalogHighlight').value = item.highlight || 'NAO';
    byId('catalogFormTitle').textContent = 'Editar empresa no catálogo';
    byId('catalogCancelEditBtn').classList.remove('hidden');
    showTab('catalogo');
    focusWithoutLayoutJump('catalogPublicName');
  }

  function fillCatalogFromMember(memberId) {
    var member = state.members.find(function (item) {
      return item.id === memberId;
    });

    if (!member || byId('catalogId').value) return;

    byId('catalogPublicName').value = member.empresa || member.nome || '';
    byId('catalogWhatsapp').value = formatPhone(member.telefone || '');
    byId('catalogAddress').value = [member.endereco, member.bairro, member.cidade, member.uf].filter(Boolean).join(', ');
  }

  function filteredCatalogEntries() {
    var search = String((byId('catalogSearch') && byId('catalogSearch').value) || '').trim().toLowerCase();
    var visible = String((byId('catalogVisibleFilter') && byId('catalogVisibleFilter').value) || '').trim();

    return state.catalogEntries.filter(function (item) {
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
    });
  }

  function renderCatalog() {
    var tbody = byId('catalogTableBody');
    var grid = byId('catalogPreviewGrid');
    var items;

    if (!tbody || !grid) return;

    items = filteredCatalogEntries();
    tbody.innerHTML = '';
    grid.innerHTML = '';

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhuma empresa no catálogo.</td></tr>';
      grid.innerHTML = '<article class="catalog-public-card muted">Nenhum item para o filtro atual.</article>';
      return;
    }

    items.forEach(function (item) {
      var row = document.createElement('tr');
      var actionCell = document.createElement('td');
      var editButton = document.createElement('button');

      row.innerHTML = [
        '<td><strong>' + escapeHtml(item.publicName) + '</strong><br><span class="muted small">' + escapeHtml(item.description || '-') + '</span></td>',
        '<td>' + escapeHtml(item.category || '-') + '</td>',
        '<td>' + escapeHtml(formatPhone(item.whatsapp || '')) + '<br><span class="muted small">' + escapeHtml(item.instagram || '-') + '</span></td>',
        '<td>' + escapeHtml(yesNoLabel(item.visible)) + '</td>',
        '<td>' + escapeHtml(yesNoLabel(item.highlight)) + '</td>'
      ].join('');

      editButton.className = 'btn btn-secondary';
      editButton.type = 'button';
      editButton.textContent = 'Editar';
      editButton.setAttribute('data-catalog-edit', item.id);
      editButton.disabled = !hasPermission('catalog.manage');
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);
      tbody.appendChild(row);

      grid.insertAdjacentHTML('beforeend', [
        '<article class="catalog-public-card ' + (item.highlight === 'SIM' ? 'is-highlight' : '') + '">',
        '<span>' + escapeHtml(item.category || 'Associado ACEAP') + '</span>',
        '<strong>' + escapeHtml(item.publicName || '-') + '</strong>',
        '<p>' + escapeHtml(item.description || 'Empresa associada à ACEAP.') + '</p>',
        '<small>' + escapeHtml(formatPhone(item.whatsapp || '')) + (item.instagram ? ' • ' + escapeHtml(item.instagram) : '') + '</small>',
        '</article>'
      ].join(''));
    });
  }

  async function loadCatalog() {
    if (!hasPermission('catalog.read')) {
      state.catalogEntries = [];
      renderCatalog();
      return;
    }

    var response = await api.postApi('catalog_list', {});
    state.catalogEntries = response.data.items || [];
    renderCatalog();
  }

  async function handleCatalogSubmit(event) {
    event.preventDefault();
    setMessage('catalogMessage', 'Salvando catálogo...', '');

    try {
      await api.postApi('catalog_save', catalogPayloadFromForm());
      setMessage('catalogMessage', 'Catálogo salvo com sucesso.', 'success');
      resetCatalogForm();
      await loadCatalog();
    } catch (error) {
      setMessage('catalogMessage', error.message || 'Falha ao salvar catálogo.', 'error');
    }
  }


  function requestStatusLabel(value) {
    var labels = {
      ABERTA: 'Aberta',
      EM_ANALISE: 'Em análise',
      AGUARDANDO_ASSOCIADO: 'Aguardando associado',
      CONCLUIDA: 'Concluída',
      CANCELADA: 'Cancelada'
    };
    return labels[String(value || '').toUpperCase()] || value || '-';
  }

  function requestTypeLabel(value) {
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

  function requestPayloadFromForm() {
    return {
      id: byId('requestId').value,
      status: byId('requestStatus').value,
      response: byId('requestResponse').value.trim(),
      internalNote: byId('requestInternalNote').value.trim()
    };
  }

  function resetRequestForm() {
    if (!byId('requestForm')) return;
    byId('requestForm').reset();
    byId('requestId').value = '';
    byId('requestProtocol').value = '';
    byId('requestStatus').value = 'ABERTA';
    byId('requestFormTitle').textContent = 'Atendimento do protocolo';
    byId('requestCancelEditBtn').classList.add('hidden');
    setMessage('requestMessage', '', '');
  }

  function fillRequestForm(item) {
    byId('requestId').value = item.id || '';
    byId('requestProtocol').value = item.protocol || '';
    byId('requestStatus').value = item.status || 'ABERTA';
    byId('requestResponse').value = item.response || '';
    byId('requestInternalNote').value = item.internalNote || '';
    byId('requestFormTitle').textContent = 'Responder ' + (item.protocol || 'protocolo');
    byId('requestCancelEditBtn').classList.remove('hidden');
    showTab('protocolos');
    focusWithoutLayoutJump('requestResponse');
  }

  function filteredRequests() {
    var search = String((byId('requestSearch') && byId('requestSearch').value) || '').trim().toLowerCase();
    var status = String((byId('requestStatusFilter') && byId('requestStatusFilter').value) || '').trim();

    return state.requests.filter(function (item) {
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
    });
  }

  function renderRequests() {
    var tbody = byId('requestsTableBody');
    var items;

    if (!tbody) return;

    items = filteredRequests();
    tbody.innerHTML = '';

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum protocolo encontrado.</td></tr>';
      return;
    }

    items.forEach(function (item) {
      var row = document.createElement('tr');
      var actionCell = document.createElement('td');
      var editButton = document.createElement('button');

      row.innerHTML = [
        '<td><strong>' + escapeHtml(item.protocol || '-') + '</strong><br><span class="muted small">' + escapeHtml(String(item.message || '').slice(0, 90)) + '</span></td>',
        '<td>' + escapeHtml(item.memberName || '-') + '</td>',
        '<td>' + escapeHtml(requestTypeLabel(item.type)) + '</td>',
        '<td>' + buildBadge(requestStatusLabel(item.status)) + '</td>',
        '<td>' + escapeHtml(formatDate(item.createdAt)) + '</td>'
      ].join('');

      editButton.className = 'btn btn-secondary';
      editButton.type = 'button';
      editButton.textContent = 'Atender';
      editButton.setAttribute('data-request-edit', item.id);
      editButton.disabled = !hasPermission('requests.manage');
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);
      tbody.appendChild(row);
    });
  }

  async function loadRequests() {
    if (!hasPermission('requests.read')) {
      state.requests = [];
      renderRequests();
      return;
    }

    var response = await api.postApi('requests_list', {});
    state.requests = response.data.items || [];
    renderRequests();
  }

  async function handleRequestSubmit(event) {
    event.preventDefault();

    if (!byId('requestId').value) {
      setMessage('requestMessage', 'Selecione um protocolo na tabela.', 'error');
      return;
    }

    setMessage('requestMessage', 'Salvando protocolo...', '');

    try {
      await api.postApi('request_update', requestPayloadFromForm());
      setMessage('requestMessage', 'Protocolo atualizado com sucesso.', 'success');
      resetRequestForm();
      await loadRequests();
    } catch (error) {
      setMessage('requestMessage', error.message || 'Falha ao atualizar protocolo.', 'error');
    }
  }

  function eventPayloadFromForm() {
    return {
      id: byId('eventId').value,
      title: byId('eventTitle').value.trim(),
      type: byId('eventType').value,
      date: byId('eventDate').value,
      time: byId('eventTime').value,
      place: byId('eventPlace').value.trim(),
      description: byId('eventDescription').value.trim(),
      capacity: byId('eventCapacity').value,
      status: byId('eventStatus').value,
      visibleInPortal: byId('eventVisiblePortal').value
    };
  }

  function announcementPayloadFromForm() {
    return {
      id: byId('announcementId').value,
      title: byId('announcementTitle').value.trim(),
      message: byId('announcementMessageText').value.trim(),
      audience: byId('announcementAudience').value,
      status: byId('announcementStatus').value,
      pinned: byId('announcementPinned').value,
      visibleInPortal: byId('announcementVisiblePortal').value,
      publishedAt: byId('announcementPublishedAt').value,
      expiresAt: byId('announcementExpiresAt').value
    };
  }

  function resetEventForm() {
    if (!byId('eventForm')) return;
    byId('eventForm').reset();
    byId('eventId').value = '';
    byId('eventDate').value = today();
    byId('eventStatus').value = 'ATIVO';
    byId('eventVisiblePortal').value = 'SIM';
    byId('eventFormTitle').textContent = 'Novo evento';
    byId('eventCancelEditBtn').classList.add('hidden');
    setMessage('eventMessage', '', '');
  }

  function resetAnnouncementForm() {
    if (!byId('announcementForm')) return;
    byId('announcementForm').reset();
    byId('announcementId').value = '';
    byId('announcementPublishedAt').value = today();
    byId('announcementStatus').value = 'ATIVO';
    byId('announcementPinned').value = 'NAO';
    byId('announcementVisiblePortal').value = 'SIM';
    byId('announcementFormTitle').textContent = 'Novo aviso';
    byId('announcementCancelEditBtn').classList.add('hidden');
    setMessage('announcementMessage', '', '');
  }

  function fillEventForm(eventItem) {
    byId('eventId').value = eventItem.id || '';
    byId('eventTitle').value = eventItem.title || '';
    byId('eventType').value = eventItem.type || 'OUTRO';
    byId('eventDate').value = eventItem.date || today();
    byId('eventTime').value = eventItem.time || '';
    byId('eventPlace').value = eventItem.place || '';
    byId('eventDescription').value = eventItem.description || '';
    byId('eventCapacity').value = eventItem.capacity || '';
    byId('eventStatus').value = eventItem.status || 'ATIVO';
    byId('eventVisiblePortal').value = eventItem.visibleInPortal || 'SIM';
    byId('eventFormTitle').textContent = 'Editar evento';
    byId('eventCancelEditBtn').classList.remove('hidden');
    showTab('eventos');
    focusWithoutLayoutJump('eventTitle');
  }

  function fillAnnouncementForm(item) {
    byId('announcementId').value = item.id || '';
    byId('announcementTitle').value = item.title || '';
    byId('announcementMessageText').value = item.message || '';
    byId('announcementAudience').value = item.audience || 'TODOS';
    byId('announcementStatus').value = item.status || 'ATIVO';
    byId('announcementPinned').value = item.pinned || 'NAO';
    byId('announcementVisiblePortal').value = item.visibleInPortal || 'SIM';
    byId('announcementPublishedAt').value = item.publishedAt || today();
    byId('announcementExpiresAt').value = item.expiresAt || '';
    byId('announcementFormTitle').textContent = 'Editar aviso';
    byId('announcementCancelEditBtn').classList.remove('hidden');
    showTab('avisos');
    focusWithoutLayoutJump('announcementTitle');
  }

  function filteredEvents() {
    var search = String((byId('eventSearch') && byId('eventSearch').value) || '').trim().toLowerCase();
    var month = String((byId('eventDateFilter') && byId('eventDateFilter').value) || '').trim();
    var status = String((byId('eventStatusFilter') && byId('eventStatusFilter').value) || '').trim();

    return state.events.filter(function (item) {
      if (month && String(item.date || '').slice(0, 7) !== month) return false;
      if (status && item.status !== status) return false;
      if (!search) return true;
      return [
        item.title,
        item.type,
        item.place,
        item.description,
        item.status
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  function filteredAnnouncements() {
    var search = String((byId('announcementSearch') && byId('announcementSearch').value) || '').trim().toLowerCase();
    var status = String((byId('announcementStatusFilter') && byId('announcementStatusFilter').value) || '').trim();

    return state.announcements.filter(function (item) {
      if (status && item.status !== status) return false;
      if (!search) return true;
      return [
        item.title,
        item.message,
        item.audience,
        item.status
      ].join(' ').toLowerCase().indexOf(search) >= 0;
    });
  }

  function renderEvents() {
    var tbody = byId('eventsTableBody');
    var grid = byId('eventsCalendarGrid');
    var items;

    if (!tbody || !grid) return;

    items = filteredEvents();
    tbody.innerHTML = '';
    grid.innerHTML = '';

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="muted">Nenhum evento encontrado.</td></tr>';
      grid.innerHTML = '<article class="event-calendar-card muted">Nenhum evento para o filtro atual.</article>';
      return;
    }

    items.forEach(function (eventItem) {
      var row = document.createElement('tr');
      var actionCell = document.createElement('td');
      var editButton = document.createElement('button');

      row.innerHTML = [
        '<td>' + escapeHtml(formatDate(eventItem.date)) + (eventItem.time ? ' às ' + escapeHtml(eventItem.time) : '') + '</td>',
        '<td><strong>' + escapeHtml(eventItem.title) + '</strong><br><span class="muted small">' + escapeHtml(eventItem.description || '-') + '</span></td>',
        '<td>' + escapeHtml(formatEventType(eventItem.type)) + '</td>',
        '<td>' + escapeHtml(eventItem.place || '-') + '</td>',
        '<td>' + buildBadge(eventItem.status) + '</td>',
        '<td>' + escapeHtml(yesNoLabel(eventItem.visibleInPortal)) + '</td>'
      ].join('');

      editButton.className = 'btn btn-secondary';
      editButton.type = 'button';
      editButton.textContent = 'Editar';
      editButton.setAttribute('data-event-edit', eventItem.id);
      editButton.disabled = !hasPermission('events.manage');
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);
      tbody.appendChild(row);

      grid.insertAdjacentHTML('beforeend', [
        '<article class="event-calendar-card">',
        '<span class="event-calendar-date">' + escapeHtml(formatDate(eventItem.date)) + (eventItem.time ? ' • ' + escapeHtml(eventItem.time) : '') + '</span>',
        '<strong>' + escapeHtml(eventItem.title) + '</strong>',
        '<p>' + escapeHtml(eventItem.place || 'Local a definir') + '</p>',
        '<small>' + escapeHtml(formatEventType(eventItem.type)) + ' • ' + escapeHtml(eventItem.status || '-') + '</small>',
        '</article>'
      ].join(''));
    });
  }

  function renderAnnouncements() {
    var tbody = byId('announcementsTableBody');
    var board = byId('announcementsBoard');
    var items;

    if (!tbody || !board) return;

    items = filteredAnnouncements();
    tbody.innerHTML = '';
    board.innerHTML = '';

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Nenhum aviso encontrado.</td></tr>';
      board.innerHTML = '<article class="announcement-card muted">Nenhum aviso para o filtro atual.</article>';
      return;
    }

    items.forEach(function (item) {
      var row = document.createElement('tr');
      var actionCell = document.createElement('td');
      var editButton = document.createElement('button');

      row.innerHTML = [
        '<td><strong>' + escapeHtml(item.title) + '</strong><br><span class="muted small">' + escapeHtml(String(item.message || '').slice(0, 120)) + '</span></td>',
        '<td>' + escapeHtml(item.audience || '-') + '</td>',
        '<td>' + escapeHtml(formatDate(item.publishedAt)) + '</td>',
        '<td>' + buildBadge(item.status) + '</td>',
        '<td>' + escapeHtml(yesNoLabel(item.visibleInPortal)) + '</td>'
      ].join('');

      editButton.className = 'btn btn-secondary';
      editButton.type = 'button';
      editButton.textContent = 'Editar';
      editButton.setAttribute('data-announcement-edit', item.id);
      editButton.disabled = !hasPermission('announcements.manage');
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);
      tbody.appendChild(row);

      board.insertAdjacentHTML('beforeend', [
        '<article class="announcement-card ' + (item.pinned === 'SIM' ? 'is-pinned' : '') + '">',
        '<span>' + (item.pinned === 'SIM' ? 'Fixado • ' : '') + escapeHtml(formatDate(item.publishedAt)) + '</span>',
        '<strong>' + escapeHtml(item.title) + '</strong>',
        '<p>' + escapeHtml(item.message || '') + '</p>',
        '<small>Público: ' + escapeHtml(item.audience || '-') + '</small>',
        '</article>'
      ].join(''));
    });
  }

  async function loadEvents() {
    if (!hasPermission('events.read')) {
      state.events = [];
      renderEvents();
      return;
    }

    var response = await api.postApi('events_list', {});
    state.events = response.data.items || [];
    renderEvents();
  }

  async function loadAnnouncements() {
    if (!hasPermission('announcements.read')) {
      state.announcements = [];
      renderAnnouncements();
      return;
    }

    var response = await api.postApi('announcements_list', {});
    state.announcements = response.data.items || [];
    renderAnnouncements();
  }

  async function handleEventSubmit(event) {
    event.preventDefault();
    setMessage('eventMessage', 'Salvando evento...', '');

    try {
      await api.postApi('event_save', eventPayloadFromForm());
      setMessage('eventMessage', 'Evento salvo com sucesso.', 'success');
      resetEventForm();
      await loadEvents();
    } catch (error) {
      setMessage('eventMessage', error.message || 'Falha ao salvar evento.', 'error');
    }
  }

  async function handleAnnouncementSubmit(event) {
    event.preventDefault();
    setMessage('announcementMessage', 'Salvando aviso...', '');

    try {
      await api.postApi('announcement_save', announcementPayloadFromForm());
      setMessage('announcementMessage', 'Aviso salvo com sucesso.', 'success');
      resetAnnouncementForm();
      await loadAnnouncements();
    } catch (error) {
      setMessage('announcementMessage', error.message || 'Falha ao salvar aviso.', 'error');
    }
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

    if (hasPermission('events.read')) {
      tasks.push(loadEvents());
    }

    if (hasPermission('announcements.read')) {
      tasks.push(loadAnnouncements());
    }

    if (hasPermission('catalog.read')) {
      tasks.push(loadCatalog());
    }

    if (hasPermission('requests.read')) {
      tasks.push(loadRequests());
    }

    if (hasPermission('cash.read')) {
      tasks.push(loadCash());
    }

    if (hasPermission('audit.read')) {
      tasks.push(loadAudit());
    }

    if (hasPermission('users.manage')) {
      tasks.push(loadUsers());
    }

    await Promise.all(tasks);
    updateStatusBar();
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
      setMessage('memberMessage', 'Associado salvo com sucesso.', 'success');
      resetMemberForm();
      await Promise.all([loadMembers(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
    } catch (error) {
      setMessage('memberMessage', error.message || 'Falha ao salvar associado.', 'error');
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
      byId('financialFim').value = competencia;
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
      if (hasPermission('cash.read')) tasks.push(loadCash());
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
      setMessage('documentIssueMessage', 'Selecione um associado.', 'error');
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

  async function handleAttachmentSubmit(event) {
    event.preventDefault();
    clearMessages();

    var memberId = byId('historyMemberId').value;
    var file = byId('attachmentFile').files[0];

    if (!memberId) {
      setMessage('attachmentMessage', 'Selecione um associado no histórico.', 'error');
      return;
    }

    if (!file) {
      setMessage('attachmentMessage', 'Selecione um arquivo.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('attachmentMessage', 'O arquivo deve ter no máximo 10 MB.', 'error');
      return;
    }

    try {
      setMessage('attachmentMessage', 'Enviando anexo...', '');
      await api.postApi('attachment_upload', {
        memberId: memberId,
        tipo: byId('attachmentTipo').value,
        descricao: byId('attachmentDescricao').value.trim(),
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64Content: await fileToBase64(file)
      });

      byId('attachmentDescricao').value = '';
      byId('attachmentFile').value = '';
      setMessage('attachmentMessage', 'Anexo salvo com sucesso.', 'success');
      await loadMemberHistory(memberId);
    } catch (error) {
      setMessage('attachmentMessage', error.message || 'Falha ao salvar anexo.', 'error');
    }
  }


  function updateCashMovementClassificationOptions() {
    var tipoEl = byId('cashMovementTipo');
    var classificacaoEl = byId('cashMovementClassificacao');
    if (!tipoEl || !classificacaoEl) return;

    var previousCategory = byId('cashMovementCategoria') ? byId('cashMovementCategoria').value : '';

    qsa('#cashMovementClassificacao option').forEach(function (option) {
      if (tipoEl.value === 'ENTRADA') {
        option.disabled = option.value !== 'RECEITA_OPERACIONAL';
      } else {
        option.disabled = option.value === 'RECEITA_OPERACIONAL';
      }
    });

    if (tipoEl.value === 'ENTRADA') {
      classificacaoEl.value = 'RECEITA_OPERACIONAL';
    } else if (classificacaoEl.value === 'RECEITA_OPERACIONAL') {
      classificacaoEl.value = 'CUSTO_FIXO';
    }

    populateCashMovementCategories(previousCategory);
    updateCashMovementModeButtons();
  }

  function resetCashMovementForm() {
    var idEl = byId('cashMovementId');
    if (!idEl) return;

    idEl.value = '';
    byId('cashMovementTipo').value = 'SAIDA';
    byId('cashMovementClassificacao').value = 'CUSTO_FIXO';
    byId('cashMovementData').value = byId('cashData').value || today();
    byId('cashMovementValor').value = '';
    byId('cashMovementForma').value = 'PIX';
    byId('cashMovementDescricao').value = '';
    byId('cashMovementObservacoes').value = '';
    if (byId('cashMovementCategoriaOutra')) {
      byId('cashMovementCategoriaOutra').value = '';
    }
    updateCashMovementClassificationOptions();
    populateCashMovementCategories();
    updateCashMovementModeButtons();
  }

  function cashMovementPayload() {
    var selectedCategory = byId('cashMovementCategoria').value;
    var otherCategory = byId('cashMovementCategoriaOutra') ? byId('cashMovementCategoriaOutra').value.trim() : '';
    var category = isOtherCashCategory(selectedCategory) ? otherCategory : selectedCategory;

    return {
      id: byId('cashMovementId').value,
      tipo: byId('cashMovementTipo').value,
      classificacao: byId('cashMovementClassificacao').value,
      data: byId('cashMovementData').value,
      categoria: category.trim(),
      valor: parseCurrencyInput(byId('cashMovementValor').value),
      formaPagamento: byId('cashMovementForma').value,
      descricao: byId('cashMovementDescricao').value.trim(),
      observacoes: byId('cashMovementObservacoes').value.trim()
    };
  }

  async function handleCashMovementSubmit(event) {
    event.preventDefault();
    clearMessages();

    if (!hasPermission('cash.close')) {
      setMessage('cashMessage', 'Você não tem permissão para lançar movimentações.', 'error');
      return;
    }

    var payload = cashMovementPayload();

    if (!payload.data) {
      setMessage('cashMessage', 'Informe a data do lançamento.', 'error');
      return;
    }

    if (!payload.valor || payload.valor <= 0) {
      setMessage('cashMessage', 'Informe um valor maior que zero.', 'error');
      return;
    }

    if (!payload.categoria) {
      setMessage('cashMessage', 'Selecione ou informe a categoria do lançamento.', 'error');
      return;
    }

    if (!payload.descricao) {
      setMessage('cashMessage', 'Informe uma descrição curta.', 'error');
      return;
    }

    try {
      await api.postApi('cash_movement_save', payload);
      setMessage('cashMessage', 'Lançamento salvo no caixa.', 'success');
      resetCashMovementForm();
      await loadCash();
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('cashMessage', error.message || 'Falha ao salvar lançamento.', 'error');
    }
  }

  async function loadCashMonthlyReport() {
    if (!hasPermission('cash.read')) {
      state.monthlyCashReport = null;
      renderCashMonthlyReport();
      return;
    }

    var competencia = byId('cashMonthlyReportCompetencia').value;
    if (!competencia) {
      setMessage('cashMessage', 'Informe a competência do relatório mensal.', 'error');
      return;
    }

    setMessage('cashMessage', 'Gerando relatório mensal do caixa...', '');
    var response = await api.postApi('cash_closing_summary', {
      tipo: 'MENSAL',
      competencia: competencia
    });
    state.monthlyCashReport = response.data || null;
    renderCashMonthlyReport();
    setMessage('cashMessage', 'Relatório mensal gerado.', 'success');
  }

  function buildCashCategoryTotals(movimentos) {
    return (movimentos || []).reduce(function (acc, movement) {
      var key = movement.categoria || 'Sem categoria';
      if (!acc[key]) {
        acc[key] = {
          categoria: key,
          entradas: 0,
          saidas: 0
        };
      }

      if (movement.tipo === 'ENTRADA') {
        acc[key].entradas += Number(movement.valor || 0);
      } else {
        acc[key].saidas += Number(movement.valor || 0);
      }

      return acc;
    }, {});
  }

  function renderCashMonthlyReport() {
    var box = byId('cashMonthlyReportBox');
    if (!box) return;

    var report = state.monthlyCashReport;
    if (!report) {
      box.innerHTML = '<p class="muted small">Selecione a competência e clique em “Gerar”.</p>';
      return;
    }

    var categoryTotals = buildCashCategoryTotals(report.movimentos || []);
    var categoryRows = Object.keys(categoryTotals).sort().map(function (key) {
      var item = categoryTotals[key];
      return [
        '<tr>',
        '<td>' + escapeHtml(item.categoria) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.entradas)) + '</td>',
        '<td>' + escapeHtml(formatCurrency(item.saidas)) + '</td>',
        '</tr>'
      ].join('');
    }).join('');

    if (!categoryRows) {
      categoryRows = '<tr><td colspan="3" class="muted">Nenhum lançamento manual categorizado no mês.</td></tr>';
    }

    box.innerHTML = [
      '<div class="monthly-report-summary">',
      '<div><span>Competência</span><strong>' + escapeHtml(formatMonth(report.competencia)) + '</strong></div>',
      '<div><span>Entradas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalEntradas || 0)) + '</strong></div>',
      '<div><span>Custos fixos</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saidasFixas || 0)) + '</strong></div>',
      '<div><span>Custos variáveis</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saidasVariaveis || 0)) + '</strong></div>',
      '<div><span>Total de saídas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalSaidas || 0)) + '</strong></div>',
      '<div><span>Saldo</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saldoPeriodo || 0)) + '</strong></div>',
      '</div>',
      '<div class="table-wrap mt-12">',
      '<table>',
      '<thead><tr><th>Categoria</th><th>Entradas</th><th>Saídas</th></tr></thead>',
      '<tbody>' + categoryRows + '</tbody>',
      '</table>',
      '</div>'
    ].join('');
  }


  async function loadCashBookReport() {
    if (!hasPermission('cash.read')) {
      state.cashBookReport = null;
      renderCashBookReport();
      return;
    }

    var inicio = byId('cashBookInicio') ? byId('cashBookInicio').value : '';
    var fim = byId('cashBookFim') ? byId('cashBookFim').value : '';

    if (!inicio || !fim) {
      setMessage('financeMessage', 'Informe início e fim para gerar o livro caixa.', 'error');
      return;
    }

    setMessage('financeMessage', 'Gerando livro caixa...', '');

    var response = await api.postApi('cash_book_report', {
      inicio: inicio,
      fim: fim,
      search: byId('cashBookSearch') ? byId('cashBookSearch').value.trim() : ''
    });

    state.cashBookReport = response.data || null;
    renderCashBookReport();
    setMessage('financeMessage', 'Livro caixa gerado.', 'success');
  }

  function buildCashBookTypeBadge(entry) {
    var className = entry.tipo === 'SAIDA' ? 'SAIDA' : 'ENTRADA';
    var label = entry.tipo === 'SAIDA' ? 'Saída' : 'Entrada';
    return '<span class="badge ' + className + '">' + label + '</span>';
  }

  function buildCashBookRows(entries) {
    if (!entries || !entries.length) {
      return '<tr><td colspan="7" class="muted">Nenhum lançamento encontrado no período.</td></tr>';
    }

    return entries.map(function (entry) {
      var entrada = Number(entry.entrada || 0);
      var saida = Number(entry.saida || 0);
      var saldo = Number(entry.saldo || 0);
      return [
        '<tr>',
        '<td>' + escapeHtml(formatDate(entry.data)) + '</td>',
        '<td>' + buildCashBookTypeBadge(entry) + '</td>',
        '<td><strong>' + escapeHtml(entry.descricao || '-') + '</strong><small>' + escapeHtml(entry.origem || '-') + ' · ' + escapeHtml(entry.categoria || '-') + '</small></td>',
        '<td>' + escapeHtml(entry.formaPagamento || '-') + '</td>',
        '<td class="cash-book-money cash-book-in privacy-sensitive">' + (entrada ? escapeHtml(formatCurrency(entrada)) : '-') + '</td>',
        '<td class="cash-book-money cash-book-out privacy-sensitive">' + (saida ? escapeHtml(formatCurrency(saida)) : '-') + '</td>',
        '<td class="cash-book-money cash-book-balance privacy-sensitive ' + (saldo < 0 ? 'is-negative' : 'is-positive') + '">' + escapeHtml(formatCurrency(saldo)) + '</td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderCashBookReport() {
    var box = byId('cashBookReportBox');
    if (!box) return;

    var report = state.cashBookReport;
    if (!report) {
      box.innerHTML = '<p class="muted small">Selecione o período e clique em “Gerar livro caixa”.</p>';
      return;
    }

    box.innerHTML = [
      '<div class="monthly-report-summary cash-book-summary">',
      '<div><span>Período</span><strong>' + escapeHtml(formatDate(report.inicio)) + ' a ' + escapeHtml(formatDate(report.fim)) + '</strong></div>',
      '<div><span>Saldo anterior</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saldoAnterior || 0)) + '</strong></div>',
      '<div><span>Entradas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalEntradas || 0)) + '</strong></div>',
      '<div><span>Saídas</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.totalSaidas || 0)) + '</strong></div>',
      '<div><span>Saldo do período</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saldoPeriodo || 0)) + '</strong></div>',
      '<div><span>Saldo final</span><strong class="privacy-sensitive">' + escapeHtml(formatCurrency(report.saldoFinal || 0)) + '</strong></div>',
      '</div>',
      '<div class="table-wrap mt-12 cash-book-table-wrap">',
      '<table class="cash-book-table">',
      '<thead>',
      '<tr>',
      '<th>Data</th>',
      '<th>Tipo</th>',
      '<th>Histórico</th>',
      '<th>Forma</th>',
      '<th>Entrada</th>',
      '<th>Saída</th>',
      '<th>Saldo</th>',
      '</tr>',
      '</thead>',
      '<tbody>' + buildCashBookRows(report.entries || []) + '</tbody>',
      '</table>',
      '</div>'
    ].join('');

    updatePrivacyMode();
  }

  function buildCashBookPrintHtml(report) {
    var rows = buildCashBookRows(report.entries || []);

    return [
      '<section class="print-report">',
      '<h1>Livro caixa</h1>',
      '<div class="muted">ACEAP · Período: ' + escapeHtml(formatDate(report.inicio)) + ' a ' + escapeHtml(formatDate(report.fim)) + ' · Emitido em: ' + escapeHtml(new Date().toLocaleString('pt-BR')) + '</div>',
      '<div class="print-report-summary">',
      '<div><span>Saldo anterior</span><strong>' + escapeHtml(formatCurrency(report.saldoAnterior || 0)) + '</strong></div>',
      '<div><span>Entradas</span><strong>' + escapeHtml(formatCurrency(report.totalEntradas || 0)) + '</strong></div>',
      '<div><span>Saídas</span><strong>' + escapeHtml(formatCurrency(report.totalSaidas || 0)) + '</strong></div>',
      '<div><span>Saldo final</span><strong>' + escapeHtml(formatCurrency(report.saldoFinal || 0)) + '</strong></div>',
      '</div>',
      '<table class="cash-book-table"><thead><tr><th>Data</th><th>Tipo</th><th>Histórico</th><th>Forma</th><th>Entrada</th><th>Saída</th><th>Saldo</th></tr></thead><tbody>' + rows + '</tbody></table>',
      '</section>'
    ].join('');
  }

  function printCashBookReport() {
    var report = state.cashBookReport;
    if (!report) {
      setMessage('financeMessage', 'Gere o livro caixa antes de imprimir ou salvar em PDF.', 'error');
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildCashBookPrintHtml(report);
    document.body.appendChild(wrapper.firstChild);
    document.body.classList.add('printing-report');

    window.setTimeout(function () {
      window.print();
      window.setTimeout(function () {
        var reportEl = document.querySelector('.print-report');
        if (reportEl) reportEl.remove();
        document.body.classList.remove('printing-report');
      }, 300);
    }, 80);
  }

  async function handleCashSave() {
    clearMessages();

    if (!hasPermission('cash.close')) {
      setMessage('cashMessage', 'Você não tem permissão para salvar fechamento.', 'error');
      return;
    }

    try {
      setMessage('cashMessage', 'Salvando fechamento...', '');
      await api.postApi('cash_closing_save', cashPayload());
      setMessage('cashMessage', 'Fechamento salvo com sucesso.', 'success');
      await loadCash();
      if (hasPermission('audit.read')) {
        await loadAudit();
      }
    } catch (error) {
      setMessage('cashMessage', error.message || 'Falha ao salvar fechamento.', 'error');
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
      documentYear: byId('documentsYearFilter').value.trim(),
      cashTipo: byId('cashTipo').value,
      cashCompetencia: byId('cashCompetencia').value,
      cashInicio: byId('cashData').value,
      cashFim: byId('cashData').value,
      financialInicio: byId('financialInicio').value,
      financialFim: byId('financialFim').value,
      financialStatus: byId('financialStatusFilter').value,
      financialSearch: byId('financialSearch').value.trim(),
      cashBookInicio: byId('cashBookInicio') ? byId('cashBookInicio').value : '',
      cashBookFim: byId('cashBookFim') ? byId('cashBookFim').value : '',
      cashBookSearch: byId('cashBookSearch') ? byId('cashBookSearch').value.trim() : ''
    });

    downloadBase64File(response.data.fileName, response.data.mimeType, response.data.base64Content);
  }

  function bindTableActions() {
    byId('payablesTableBody').addEventListener('click', async function (event) {
      var editBtn = event.target.closest('.js-edit-payable');
      var payBtn = event.target.closest('.js-pay-payable');
      var deleteBtn = event.target.closest('.js-delete-payable');

      if (editBtn) {
        var payable = state.payables.find(function (item) {
          return item.id === editBtn.getAttribute('data-id');
        });
        if (payable) fillPayableForm(payable);
        return;
      }

      if (payBtn) {
        await markPayablePaid(payBtn.getAttribute('data-id'));
        return;
      }

      if (deleteBtn) {
        await deletePayable(deleteBtn.getAttribute('data-id'));
      }
    });

    byId('membersTableBody').addEventListener('click', async function (event) {
      var editBtn = event.target.closest('.js-edit-member');
      var historyBtn = event.target.closest('.js-history-member');
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

      if (historyBtn) {
        byId('historyMemberId').value = historyBtn.getAttribute('data-id');
        showTab('historico');
        loadMemberHistory(historyBtn.getAttribute('data-id')).catch(function (error) {
          setMessage('historyMessage', error.message || 'Falha ao carregar histórico.', 'error');
        });
        return;
      }

      if (inactivateBtn) {
        if (!window.confirm('Deseja inativar este associado?')) return;

        try {
          await api.postApi('member_inactivate', { id: inactivateBtn.getAttribute('data-id') });
          setGlobalMessage('Associado inativado com sucesso.', 'success');
          await Promise.all([loadMembers(), hasPermission('audit.read') ? loadAudit() : Promise.resolve()]);
        } catch (error) {
          setGlobalMessage(error.message || 'Falha ao inativar associado.', 'error');
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

    byId('historyAttachmentsTableBody').addEventListener('click', async function (event) {
      var button = event.target.closest('.js-download-attachment');
      if (!button) return;

      try {
        var response = await api.postApi('attachment_download', { attachmentId: button.getAttribute('data-id') });
        downloadBase64File(response.data.fileName, response.data.mimeType, response.data.base64Content);
      } catch (error) {
        setMessage('attachmentMessage', error.message || 'Falha ao baixar anexo.', 'error');
      }
    });

    byId('cashMovementsTableBody').addEventListener('click', async function (event) {
      var deleteBtn = event.target.closest('.js-delete-cash-movement');
      if (!deleteBtn) return;

      if (!window.confirm('Deseja excluir este lançamento do caixa?')) return;

      try {
        await api.postApi('cash_movement_delete', { id: deleteBtn.getAttribute('data-id') });
        setMessage('cashMessage', 'Lançamento excluído.', 'success');
        await loadCash();
        if (hasPermission('audit.read')) {
          await loadAudit();
        }
      } catch (error) {
        setMessage('cashMessage', error.message || 'Falha ao excluir lançamento.', 'error');
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
    byId('financialInicio').value = month.slice(0, 4) + '-01';
    byId('financialFim').value = month;
    byId('cashData').value = today();
    byId('cashCompetencia').value = month;
    byId('cashMonthlyReportCompetencia').value = month;
    if (byId('cashBookInicio')) byId('cashBookInicio').value = month + '-01';
    if (byId('cashBookFim')) byId('cashBookFim').value = today();
    if (byId('cashBookSearch')) byId('cashBookSearch').value = '';
    if (byId('payablesCompetencia')) byId('payablesCompetencia').value = month;
    if (byId('payablesStatusFilter')) byId('payablesStatusFilter').value = 'PENDENTE';
    if (byId('eventDate')) byId('eventDate').value = today();
    if (byId('eventDateFilter')) byId('eventDateFilter').value = month;
    if (byId('announcementPublishedAt')) byId('announcementPublishedAt').value = today();
    if (byId('cashMovementData')) byId('cashMovementData').value = today();
    byId('paymentDate').value = today();
    byId('documentYear').value = currentYear();
    resetMemberForm();
    resetUserForm();
    clearSelectedDue();
    updateDocumentTypeVisibility();
    updateCashPeriodVisibility();
    resetCashMovementForm();
    resetQuickExpenseForm();
    resetPayableForm();
    resetEventForm();
    resetAnnouncementForm();
    state.cashSummary = null;
    state.cashClosings = [];
    state.monthlyCashReport = null;
    state.cashBookReport = null;
    state.payables = [];
    state.payableAlerts = [];
    state.events = [];
    state.announcements = [];
    renderCash();
    renderCashBookReport();
    renderPayables();
    renderEvents();
    renderAnnouncements();
    state.memberHistory = null;
    state.selectedHistoryMemberId = '';
    renderMemberHistory();
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

    var toggleStatsBtn = byId('toggleStatsBtn');
    if (toggleStatsBtn) {
      toggleStatsBtn.addEventListener('click', function () {
        state.statsVisible = !state.statsVisible;
        renderStats();
      });
    }

    var privacyToggleBtn = byId('privacyToggleBtn');
    if (privacyToggleBtn) {
      privacyToggleBtn.addEventListener('click', function () {
        state.privacyMode = !state.privacyMode;
        updatePrivacyMode();
      });
    }

    bindTableRowSelection();

    byId('memberForm').addEventListener('submit', handleMemberSubmit);
    byId('cancelMemberEditBtn').addEventListener('click', resetMemberForm);
    byId('batchForm').addEventListener('submit', handleBatchSubmit);
    byId('paymentForm').addEventListener('submit', handlePaymentSubmit);
    byId('clearPaymentSelectionBtn').addEventListener('click', clearSelectedDue);
    byId('documentIssueForm').addEventListener('submit', handleDocumentIssue);
    byId('changePasswordForm').addEventListener('submit', handleChangePassword);
    byId('userForm').addEventListener('submit', handleUserSubmit);
    byId('attachmentForm').addEventListener('submit', handleAttachmentSubmit);
    byId('cancelUserEditBtn').addEventListener('click', resetUserForm);

    byId('documentType').addEventListener('change', updateDocumentTypeVisibility);
    byId('cashTipo').addEventListener('change', function () {
      updateCashPeriodVisibility();
      loadCash().catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao carregar caixa.', 'error');
      });
    });
    byId('cashData').addEventListener('change', function () {
      if (byId('cashMovementData')) byId('cashMovementData').value = byId('cashData').value;
      loadCash().catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao carregar caixa.', 'error');
      });
    });
    byId('cashCompetencia').addEventListener('change', function () {
      loadCash().catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao carregar caixa.', 'error');
      });
    });
    byId('cashRefreshBtn').addEventListener('click', function () {
      loadCash().catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao calcular caixa.', 'error');
      });
    });
    byId('cashSaveBtn').addEventListener('click', handleCashSave);
    byId('cashMovementForm').addEventListener('submit', handleCashMovementSubmit);
    byId('cashMovementClearBtn').addEventListener('click', resetCashMovementForm);
    if (byId('quickExpenseForm')) {
      byId('quickExpenseForm').addEventListener('submit', handleQuickExpenseSubmit);
      byId('quickExpenseClassificacao').addEventListener('change', function () {
        populateQuickExpenseCategories(byId('quickExpenseCategoria').value);
      });
    }
    byId('cashNewExpenseBtn').addEventListener('click', function () {
      showTab('despesas');
      setCashMovementMode('expense');
      byId('cashMovementDescricao').focus();
    });
    byId('cashNewIncomeBtn').addEventListener('click', function () {
      showTab('despesas');
      setCashMovementMode('income');
      byId('cashMovementDescricao').focus();
    });
    if (byId('despesasQuickFocusBtn')) {
      byId('despesasQuickFocusBtn').addEventListener('click', function () {
        resetQuickExpenseForm();
        byId('quickExpenseDescricao').focus();
      });
    }
    if (byId('despesasFullExpenseBtn')) {
      byId('despesasFullExpenseBtn').addEventListener('click', function () {
        setCashMovementMode('expense');
        byId('cashMovementDescricao').focus();
      });
    }
    if (byId('despesasIncomeBtn')) {
      byId('despesasIncomeBtn').addEventListener('click', function () {
        setCashMovementMode('income');
        byId('cashMovementDescricao').focus();
      });
    }
    byId('cashExpenseModeBtn').addEventListener('click', function () {
      setCashMovementMode('expense');
    });
    byId('cashIncomeModeBtn').addEventListener('click', function () {
      setCashMovementMode('income');
    });
    byId('cashMovementTipo').addEventListener('change', updateCashMovementClassificationOptions);
    byId('cashMovementClassificacao').addEventListener('change', function () {
      populateCashMovementCategories();
      updateCashMovementModeButtons();
    });
    byId('cashMovementCategoria').addEventListener('change', updateCashMovementCategoryOther);
    byId('cashMonthlyReportBtn').addEventListener('click', function () {
      loadCashMonthlyReport().catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao gerar relatório mensal.', 'error');
      });
    });
    byId('cashMonthlyPrintBtn').addEventListener('click', printCashMonthlyReport);
    byId('cashPayablesFocusBtn').addEventListener('click', function () {
      showTab('contas-pagar');
      if (byId('payableDescricao')) byId('payableDescricao').focus();
    });
    byId('payableForm').addEventListener('submit', handlePayableSubmit);
    byId('payableClearBtn').addEventListener('click', resetPayableForm);
    if (byId('contasNovaBtn')) {
      byId('contasNovaBtn').addEventListener('click', function () {
        resetPayableForm();
        byId('payableDescricao').focus();
      });
    }
    if (byId('contasAtualizarBtn')) {
      byId('contasAtualizarBtn').addEventListener('click', function () {
        loadPayables().catch(function (error) {
          setMessage('payableMessage', error.message || 'Falha ao carregar contas a pagar.', 'error');
        });
      });
    }
    byId('payablesRefreshBtn').addEventListener('click', function () {
      loadPayables().catch(function (error) {
        setMessage('payableMessage', error.message || 'Falha ao carregar contas a pagar.', 'error');
      });
    });
    byId('payablesCompetencia').addEventListener('change', function () {
      loadPayables().catch(function (error) {
        setMessage('payableMessage', error.message || 'Falha ao carregar contas a pagar.', 'error');
      });
    });
    byId('payablesStatusFilter').addEventListener('change', function () {
      loadPayables().catch(function (error) {
        setMessage('payableMessage', error.message || 'Falha ao carregar contas a pagar.', 'error');
      });
    });
    byId('payableClassificacao').addEventListener('change', function () {
      populatePayableCategories();
    });
    byId('payableCategoria').addEventListener('change', updatePayableCategoryOther);

    if (byId('eventForm')) {
      byId('eventForm').addEventListener('submit', handleEventSubmit);
      byId('eventClearBtn').addEventListener('click', resetEventForm);
      byId('eventCancelEditBtn').addEventListener('click', resetEventForm);
      byId('eventsRefreshBtn').addEventListener('click', function () {
        loadEvents().catch(function (error) {
          setMessage('eventMessage', error.message || 'Falha ao carregar eventos.', 'error');
        });
      });
      byId('eventSearch').addEventListener('input', debounce(renderEvents, 250));
      byId('eventDateFilter').addEventListener('change', renderEvents);
      byId('eventStatusFilter').addEventListener('change', renderEvents);
      byId('eventsTableBody').addEventListener('click', function (event) {
        var button = event.target.closest('[data-event-edit]');
        var item;
        if (!button) return;
        item = state.events.find(function (eventItem) {
          return eventItem.id === button.getAttribute('data-event-edit');
        });
        if (item) fillEventForm(item);
      });
    }

    if (byId('announcementForm')) {
      byId('announcementForm').addEventListener('submit', handleAnnouncementSubmit);
      byId('announcementClearBtn').addEventListener('click', resetAnnouncementForm);
      byId('announcementCancelEditBtn').addEventListener('click', resetAnnouncementForm);
      byId('announcementsRefreshBtn').addEventListener('click', function () {
        loadAnnouncements().catch(function (error) {
          setMessage('announcementMessage', error.message || 'Falha ao carregar avisos.', 'error');
        });
      });
      byId('announcementSearch').addEventListener('input', debounce(renderAnnouncements, 250));
      byId('announcementStatusFilter').addEventListener('change', renderAnnouncements);
      byId('announcementsTableBody').addEventListener('click', function (event) {
        var button = event.target.closest('[data-announcement-edit]');
        var item;
        if (!button) return;
        item = state.announcements.find(function (announcementItem) {
          return announcementItem.id === button.getAttribute('data-announcement-edit');
        });
        if (item) fillAnnouncementForm(item);
      });
    }


    if (byId('catalogForm')) {
      byId('catalogForm').addEventListener('submit', handleCatalogSubmit);
      byId('catalogClearBtn').addEventListener('click', resetCatalogForm);
      byId('catalogCancelEditBtn').addEventListener('click', resetCatalogForm);
      byId('catalogRefreshBtn').addEventListener('click', function () {
        loadCatalog().catch(function (error) {
          setMessage('catalogMessage', error.message || 'Falha ao carregar catálogo.', 'error');
        });
      });
      byId('catalogSearch').addEventListener('input', debounce(renderCatalog, 250));
      byId('catalogVisibleFilter').addEventListener('change', renderCatalog);
      byId('catalogMemberId').addEventListener('change', function () {
        fillCatalogFromMember(byId('catalogMemberId').value);
      });
      byId('catalogTableBody').addEventListener('click', function (event) {
        var button = event.target.closest('[data-catalog-edit]');
        var item;
        if (!button) return;
        item = state.catalogEntries.find(function (catalogItem) {
          return catalogItem.id === button.getAttribute('data-catalog-edit');
        });
        if (item) fillCatalogForm(item);
      });
    }


    if (byId('requestForm')) {
      byId('requestForm').addEventListener('submit', handleRequestSubmit);
      byId('requestClearBtn').addEventListener('click', resetRequestForm);
      byId('requestCancelEditBtn').addEventListener('click', resetRequestForm);
      byId('requestsRefreshBtn').addEventListener('click', function () {
        loadRequests().catch(function (error) {
          setMessage('requestMessage', error.message || 'Falha ao carregar protocolos.', 'error');
        });
      });
      byId('requestSearch').addEventListener('input', debounce(renderRequests, 250));
      byId('requestStatusFilter').addEventListener('change', renderRequests);
      byId('requestsTableBody').addEventListener('click', function (event) {
        var button = event.target.closest('[data-request-edit]');
        var item;
        if (!button) return;
        item = state.requests.find(function (requestItem) {
          return requestItem.id === button.getAttribute('data-request-edit');
        });
        if (item) fillRequestForm(item);
      });
    }

    qsa('[data-go-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        var tabName = button.getAttribute('data-go-tab');
        var focusId = button.getAttribute('data-focus');
        var action = button.getAttribute('data-action');
        showTab(tabName);

        if (action === 'quick-expense') {
          resetQuickExpenseForm();
        } else if (action === 'cash-expense') {
          setCashMovementMode('expense');
        } else if (action === 'cash-income') {
          setCashMovementMode('income');
        } else if (action === 'payables' && byId('payablesCompetencia')) {
          byId('payablesCompetencia').value = byId('payablesCompetencia').value || currentMonth();
        } else if (action === 'cash-monthly-report' && byId('cashMonthlyReportCompetencia')) {
          byId('cashMonthlyReportCompetencia').value = byId('cashCompetencia').value || currentMonth();
        } else if (action === 'cash-book-report' && byId('cashBookInicio')) {
          byId('cashBookInicio').value = byId('cashBookInicio').value || currentMonth() + '-01';
          byId('cashBookFim').value = byId('cashBookFim').value || today();
        }

        if (focusId) {
          focusWithoutLayoutJump(focusId);
        }
      });
    });

    byId('memberSearch').addEventListener('input', renderMembers);
    byId('memberStatusFilter').addEventListener('change', renderMembers);
    byId('historyMemberId').addEventListener('change', function () {
      loadMemberHistory(byId('historyMemberId').value).catch(function (error) {
        setMessage('historyMessage', error.message || 'Falha ao carregar histórico.', 'error');
      });
    });
    byId('historyRefreshBtn').addEventListener('click', function () {
      loadMemberHistory(byId('historyMemberId').value).catch(function (error) {
        setMessage('historyMessage', error.message || 'Falha ao atualizar histórico.', 'error');
      });
    });

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
        setMessage('financeMessage', error.message || 'Falha ao atualizar painel financeiro.', 'error');
      });
    });
    byId('financialInicio').addEventListener('change', function () {
      loadReport().catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao atualizar painel financeiro.', 'error');
      });
    });
    byId('financialFim').addEventListener('change', function () {
      loadReport().catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao atualizar painel financeiro.', 'error');
      });
    });
    byId('financialStatusFilter').addEventListener('change', function () {
      loadReport().catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao atualizar painel financeiro.', 'error');
      });
    });
    byId('financialSearch').addEventListener('input', debounce(function () {
      loadReport().catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao atualizar painel financeiro.', 'error');
      });
    }, 300));

    byId('cashBookGenerateBtn').addEventListener('click', function () {
      loadCashBookReport().catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao gerar livro caixa.', 'error');
      });
    });
    byId('cashBookPrintBtn').addEventListener('click', printCashBookReport);
    byId('cashBookExportBtn').addEventListener('click', function () {
      exportCsv('cash_book').catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao exportar livro caixa.', 'error');
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
        setGlobalMessage(error.message || 'Falha ao exportar associados.', 'error');
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
      exportCsv('financial_dashboard').catch(function (error) {
        setMessage('financeMessage', error.message || 'Falha ao exportar painel financeiro.', 'error');
      });
    });

    byId('cashExportBtn').addEventListener('click', function () {
      exportCsv('cash_closings').catch(function (error) {
        setMessage('cashMessage', error.message || 'Falha ao exportar fechamentos.', 'error');
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
    updatePrivacyMode();
    startManagementPhraseRotator();
    restoreSessionIfPossible().catch(function (error) {
      setMessage('loginMessage', error.message || 'Falha ao restaurar sessão.', 'error');
    });
  });
}());
