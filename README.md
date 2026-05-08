# Sistema do Sindicato - Apps Script v3

Versão baseada no mesmo padrão do ACE Campo:

- **frontend estático** em HTML/CSS/JS
- **API** em **Google Apps Script**
- **base** em **Google Sheets**
- **PDF real** salvo no **Google Drive**
- **controle de perfis de usuário**
- **ficha cadastral PDF**
- **declaração de filiação**
- **declaração de quitação anual**
- **recibo de mensalidade**
- **auditoria**
- **exportação CSV**

## Estrutura

- `index.html`
- `assets/runtime-config.js`
- `assets/api.js`
- `assets/app.js`
- `assets/styles.css`
- `backend/Code.gs`
- `backend/appsscript.json`

## Perfis incluídos

- `ADMIN` — acesso total
- `SECRETARIA` — cadastro e documentos cadastrais
- `FINANCEIRO` — mensalidades, pagamentos, relatórios e documentos financeiros
- `CONSULTA` — leitura

## Passo a passo

### 1. Planilha
Você não precisa mais criar a planilha antes.

Se `SIND_SETUP.SPREADSHEET_ID` estiver vazio, a função `setupInitialProject_()` cria uma planilha nova automaticamente e grava o ID nas propriedades do script.

### 2. Criar o projeto Apps Script
Abra o Apps Script e crie um projeto novo.

### 3. Colar o backend
Copie o conteúdo de `backend/Code.gs` para o arquivo principal do Apps Script.

Copie `backend/appsscript.json` para o manifesto do projeto.

### 4. Ajustar `SIND_SETUP`
No topo de `Code.gs`, preencha:

- `SPREADSHEET_ID` opcional
- `PDF_FOLDER_ID` opcional
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `UNION_NAME`

### 5. Executar o setup
No Apps Script, execute manualmente:

```javascript
setupInitialProject_();
```

Isso vai:

- gravar as configurações
- criar as abas:
  - `Sindicalizados`
  - `Mensalidades`
  - `Documentos`
  - `Config`
  - `Auditoria`
  - `Usuarios`
- criar a pasta de PDFs no Drive, se necessário
- criar o usuário administrador inicial

### 6. Publicar como Web App
No Apps Script:

- **Implantar**
- **Nova implantação**
- Tipo: **Aplicativo da Web**
- Executar como: **você**
- Quem tem acesso: **qualquer pessoa com o link** ou o modelo que você preferir

Copie a URL final terminada em `/exec`.

### 7. Apontar o frontend para a API
Abra:

- `assets/runtime-config.js`

O arquivo já vem preenchido com esta URL:

```javascript
var API_URL = 'https://script.google.com/macros/s/AKfycbyprFavoafNGeVUvY3DYfte-3ZP4Mq9APgngotzSMmhKXUvMvUfw9r_YsXNqSqgmY-Y/exec';
```

Só troque se você publicar uma nova implantação diferente.

### 8. Publicar o frontend
Você pode publicar o frontend em:

- GitHub Pages
- Netlify
- Vercel
- ou até abrir localmente para testes simples

## Ações da API

Todas usam:

```json
{
  "action": "nome_da_acao",
  "sessionToken": "token-opcional",
  "payload": {}
}
```

### Ações principais

- `health`
- `login`
- `logout`
- `bootstrap`

### Sindicalizados

- `members_list`
- `member_save`
- `member_inactivate`

### Mensalidades

- `dues_generate_batch`
- `dues_list`
- `due_pay`
- `monthly_report`

### Documentos

- `receipt_issue`
- `member_declaration`
- `member_profile_pdf`
- `annual_clearance_issue`
- `documents_list`
- `document_download`

### Usuários

- `users_list`
- `user_save`
- `user_toggle_status`
- `change_password`

### Auditoria / exportação

- `audit_logs`
- `export_csv`

## Regras de documento

### Recibo de mensalidade
Só é emitido para mensalidade **paga**.

### Declaração de quitação anual
Só é emitida quando:

- o sindicalizado tem mensalidades lançadas no ano
- **todas** as mensalidades do ano estão pagas

## Melhorias desta versão

- perfis reais de usuário com trava no backend
- gerenciamento de usuários na interface
- mudança de senha do próprio usuário
- ficha cadastral PDF
- declaração anual de quitação
- numeração sequencial de documentos por ano e prefixo
- filtros por tipo e ano em documentos

## Observações

- o frontend **não acessa a planilha diretamente**
- a planilha é acessada **somente pelo Apps Script**
- os PDFs ficam no **Google Drive**
- o sistema foi pensado para operação pequena/média, ideal para o seu cenário

## Próximas melhorias naturais

- baixar várias mensalidades de uma vez
- valor individual de mensalidade por sindicalizado
- anexos por sindicalizado
- protocolo oficial com assinatura/imagem do sindicato
- dashboard anual de arrecadação


## Configuração já aplicada neste pacote

- `assets/runtime-config.js` já está com sua URL `/exec`
- `ADMIN_USERNAME` está como `admin`
- `ADMIN_PASSWORD` está como `123456`
- `SPREADSHEET_ID` está vazio para o setup criar a planilha automaticamente

Depois do primeiro login, troque a senha provisória.
