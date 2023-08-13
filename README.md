# FSTP - MVC 5 - JQUERY

# Preview

![Preview do Sistema](/images/fs.gif)

> ## Funcionalidades Extras
  - Busca de dados baseados no CEP
  - Busca de estados do Brasil para preencher
  - Máscara de formatação no telefone
  - Máscara de formatação no CEP
  - Algumas alterações visuais

> ## Requisitos

>> ### CPF no Cliente

- 1 - Na tela de cadastramento/alteração de clientes, incluir um novo campo denominado CPF, que permitirá o cadastramento do CPF do cliente.

  ### Pontos relevantes:
  - [x] O novo campo deverá seguir o padrão visual dos demais campos da tela
  - [x] O cadastramento do CPF será obrigatório
  - [x] Deverá possuir a formatação padrão de CPF (999.999.999-99)
  - [x] Deverá consistir se o dado informado é um CPF válido(conforme o cálculo padrão deverificação do dígito verificador de CPF)
  - [x] Não permitir o cadastramento de um CPF já existente no banco de dados, ou seja, não é permitida a existência de um CPF duplicado
  - [x] Tabela que deverá armazenar o novo campo de CPF: “CLIENTES”
  - [x] O novo campo deverá ser nomeado como “CPF”

>> ## Área de Beneficiários

- 2 - Na tela de cadastramento/alteração de clientes, incluir um novo botão denominado Beneficiários, que permitirá o cadastramento de Beneficiários do cliente, o mesmo deve abrir um pop-up para inclusão do CPF e Nome do beneficiário, além disso deve existir um grid onde será exibido os beneficiários que já foram inclusos, no mesmo será possível realizar a manutenção dos beneficiários cadastrados,alteração e exclusão.

  ### Pontos relevantes:
  - [x] O novo botão e novos campos deverão seguir o padrão visual dos demais botões e campos da
  tela
  - [x] O campo CPF deverá possuir a formatação padrão (999.999.999-99)
  - [x] Deverá consistir se o dado informado é um CPF válido (conforme o cálculo padrão de
  verificação do dígito verificador de CPF)
  - [x] Não permitir o cadastro de mais de um beneficiário com o mesmo CPF para o mesmo cliente
  - [x] O beneficiário será gravado na base de dados quando for acionado o botão Salvar na tela
  Cadastrar Cliente
  No banco de dados será necessário criar uma nova tabela, para a inclusão dos dados do beneficiário,
  ID, CPF, NOME, IDCLIENTE.
  Pontos relevantes:
  - [x] Tabela que deverá armazenar os dados de beneficiário: “BENEFICIARIOS”
  - [x] O novos campos deverão ser nomeados como “ID”, “CPF”, “NOME”, “IDCLIENTE”
