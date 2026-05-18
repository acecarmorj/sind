# SINSERMAP - Cadastro de Associados

Aplicativo exclusivo para o **SINSERMAP - Sindicato dos Servidores Públicos Municipais de Além Paraíba**.

O projeto possui dois arquivos separados:

- `index.html`: área interna com login, cadastro de associados, consulta, relatórios e configuração;
- `painel.html`: site público informativo, sem senha, simples e ideal para celular.

O sistema mantém:

- cadastro de associados;
- consulta de associados;
- relatórios por onde trabalha, setor, função/cargo e status;
- configuração com usuários do sistema, listas editáveis e informações do painel público;
- exportação CSV;
- impressão de relatório;
- painel público com agenda, comunicados, documentos, atas, cursos, serviços e contato do sindicato.

## Arquivos principais

```text
index.html
painel.html
assets/
  app.js
  painel.js
  api.js
  runtime-config.js
  styles.css
  sede-sinsermap.jpg
backend/
  Code.gs
  appsscript.json
api.txt
```

Este pacote já está limpo para publicação/uso, sem pasta `.git` e sem imagens antigas não utilizadas.

A API está duplicada em:

- `api.txt`, para copiar e colar rapidamente;
- `backend/Code.gs`, para manter o projeto organizado.

## Banco de dados na mesma planilha

A API foi configurada para criar o banco na mesma planilha em que o código for colado/executado:

```javascript
USE_ACTIVE_SPREADSHEET: true
```

Quando você executar `setupDatabase()` dentro do Apps Script aberto pela própria planilha, serão criadas estas abas:

- `Associados`
- `Usuarios`
- `Config`
- `Auditoria`
- `ListasCadastro`
- `PainelPublico`

## Instalação da API

1. Crie ou abra a planilha que será o banco de dados.
2. Vá em **Extensões > Apps Script**.
3. Apague o conteúdo padrão do editor.
4. Cole o conteúdo de `api.txt` ou de `backend/Code.gs`.
5. Salve o projeto.
6. Execute a função `setupDatabase`.
7. Autorize o acesso quando o Google pedir.
8. Confirme que as abas foram criadas na mesma planilha.

## Publicar como Web App

1. No Apps Script, clique em **Implantar > Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Você**.
4. Quem tem acesso: **Qualquer pessoa com o link** ou a opção disponível na sua conta.
5. Clique em **Implantar**.
6. Copie a URL terminada em `/exec`.

## Configurar o front-end

O arquivo `assets/runtime-config.js` já está apontando para esta URL:

```text
https://script.google.com/macros/s/AKfycbzj8iKNqpwi6V56jTdQN-U96sFaReCHkc6uHWX3h9daVXjkUC28ZidHZr5ugRPX8INoAg/exec
```

Caso você publique uma nova implantação, troque a variável abaixo pela nova URL:

```javascript
var API_URL = 'NOVA_URL_DO_WEB_APP_DO_APPS_SCRIPT';
```

## Painel público sem senha

O `painel.html` é um site público informativo separado do sistema interno. Ele não tem login, não tem botões de sistema e foi montado para funcionar bem no celular.

O painel pode mostrar:

- agenda;
- comunicados;
- documentos;
- atas;
- cursos;
- serviços;
- informações para contato.

As seções vazias não aparecem no site. Por exemplo: se não houver agenda publicada, a seção **Agenda** fica oculta automaticamente.

Contato exibido no painel:

```text
SINSERMAP - Sindicato dos Servidores Públicos Municipais de Além Paraíba
Rua Dr. José Tepedino, 80 - Ilha do Lazareto, Além Paraíba - MG, 36660-000, Brazil
Telefone: (32) 3462-4510
```

As informações públicas são cadastradas na área interna, em **Configuração > Painel público**. Os registros ficam na aba `PainelPublico` da mesma planilha.

## Configuração

A aba **Configuração** permite cadastrar e remover usuários do sistema, cadastrar informações do painel público, além de cadastrar, editar e excluir as opções usadas nos campos:

- Onde trabalha
- Setor
- Função/cargo

Os usuários ficam salvos na aba `Usuarios`. As opções ficam salvas na aba `ListasCadastro` da mesma planilha. Depois de alterar a API, publique uma nova versão da implantação do Apps Script.


### Usuários do sistema

Na tela **Configuração**, qualquer usuário logado pode:

- adicionar novo usuário com nome, usuário e senha;
- remover usuários antigos.

Não foi criada regra de permissão entre usuários. O sistema mantém apenas uma proteção para não remover o último usuário ativo.

## Login inicial

```text
Usuário: admin
Senha: 123456
```

Para alterar a senha inicial, edite `ADMIN_PASSWORD` no começo de `api.txt` ou `backend/Code.gs` antes da primeira execução.

## Campos do associado

O cadastro possui campos para:

- nome;
- CPF;
- RG;
- data de nascimento;
- telefone;
- e-mail;
- endereço;
- onde trabalha;
- setor;
- função/cargo, como motorista, professor etc.;
- matrícula;
- data de associação;
- status;
- observações.
## Painel público no celular

O painel público foi ajustado para celular: cabeçalho compacto, botões maiores, abas com rolagem horizontal e cards em coluna única.



## Arquivos principais

- `index.html`: área interna com login para cadastro, consulta, relatórios e configuração.
- `painel.html`: painel público sem senha para agenda, comunicados, documentos, atas, cursos, serviços e contato.
- `assets/painel.js`: carregamento das informações públicas do painel.
- `api.txt` e `backend/Code.gs`: API do Google Apps Script.

O painel público é alimentado pela tela **Configuração** do `index.html`, na seção **Painel público**.


## Painel público

O arquivo `painel.html` é o site informativo público do SINSERMAP. Ele não exige login e mostra comunicados, agenda, documentos, atas, cursos, serviços e contato.

O arquivo `index.html` continua sendo a área interna do sistema, com login, cadastro, consulta, relatórios e configuração.


## Importação da data de admissão

Este pacote inclui o arquivo:

`dados/importar_data_admissao_extraida.txt`

Ele foi montado a partir das planilhas enviadas e contém 454 associados com data de admissão.

Use em **Configuração > Importar data de admissão**: abra o TXT, copie tudo e cole no campo de importação.
