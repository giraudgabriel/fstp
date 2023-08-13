$(document).ready(function () {
  var vm = this;
  vm.beneficiarios = []; // Lista de beneficiários

  /**
   * Formulário de cadastro de clientes
   */
  const FormCliente = {
    Id: "#formCadastro",
    Nome: "#Nome",
    Sobrenome: "#Sobrenome",
    Email: "#Email",
    Nacionalidade: "#Nacionalidade",
    Estado: "#Estado",
    Cidade: "#Cidade",
    Logradouro: "#Logradouro",
    Telefone: "#Telefone",
    CPF: "#CPF",
    CEP: "#CEP",
    btnBeneficiarios: "#btnBeneficiarios",
    el: (id) => $(`${FormCliente.Id} ${id}`),
  };

  /**
   * Mascaras dos campos do formulário de clientes
   * @type {{CPF: string, Telefone: string, CEP: string}}
   * @const
   * @enum {string}
   * @memberOf FormCliente
   */
  const MaskCliente = {
    [FormCliente.CPF]: CPFUtils.mask,
    [FormCliente.Telefone]: "(99) 99999-9999",
    [FormCliente.CEP]: "99999-999",
  };

  function iniciarMascaras() {
    // Adiciona as máscaras aos campos
    Object.keys(MaskCliente).forEach((key) => {
      FormCliente.el(key).mask(MaskCliente[key]);
    });
  }

  async function onOpenModalBeneficiarios(e) {
    e.preventDefault();
    // Abre o modal e espera o retorno dos beneficiários
    vm.beneficiarios = await ModalBeneficiarios(
      "Beneficiários",
      vm.beneficiarios
    );
  }

  function getFormData() {
    return {
      NOME: $(FormCliente.Nome).val(),
      CEP: $(FormCliente.CEP).val(),
      Email: $(FormCliente.Email).val(),
      Sobrenome: $(FormCliente.Sobrenome).val(),
      Nacionalidade: $(FormCliente.Nacionalidade).val(),
      Estado: $(FormCliente.Estado).val(),
      Cidade: $(FormCliente.Cidade).val(),
      Logradouro: $(FormCliente.Logradouro).val(),
      Telefone: $(FormCliente.Telefone).val(),
      CPF: $(FormCliente.CPF).val(),
      Beneficiarios: vm.beneficiarios.map((b) => ({
        CPF: b.CPF,
        Nome: b.Nome,
        Id: b.Id?.toString().includes('new') ? 0 : b.Id,
      })),
    };
  }

  function limparFormulario() {
    $(FormCliente.Id)[0].reset();
    vm.beneficiarios = [];
  }

  if (obj) {
    FormCliente.el(FormCliente.Nome).val(obj.Nome);
    FormCliente.el(FormCliente.CEP).val(obj.CEP);
    FormCliente.el(FormCliente.Email).val(obj.Email);
    FormCliente.el(FormCliente.Sobrenome).val(obj.Sobrenome);
    FormCliente.el(FormCliente.Nacionalidade).val(obj.Nacionalidade);
    FormCliente.el(FormCliente.Estado).val(obj.Estado);
    FormCliente.el(FormCliente.Cidade).val(obj.Cidade);
    FormCliente.el(FormCliente.Logradouro).val(obj.Logradouro);
    FormCliente.el(FormCliente.Telefone).val(obj.Telefone);
    FormCliente.el(FormCliente.CPF).val(obj.CPF);
    FormCliente.el(FormCliente.CPF).attr("readonly", true);
    vm.beneficiarios = obj?.Beneficiarios ?? [];
  }

  function atualizarCliente(e) {
    e.preventDefault();

    $.ajax({
      url: urlPost,
      method: "POST",
      data: getFormData(),
      error: function (r) {
        if (r.status == 400) ModalDialog("Ocorreu um erro", r.responseJSON);
        else if (r.status == 500)
          ModalDialog(
            "Ocorreu um erro",
            "Ocorreu um erro interno no servidor."
          );
      },
      success: function (r) {
        ModalDialog("Sucesso!", r);
        limparFormulario();
        window.location.href = urlRetorno;
      },
    });
  }

  /**
   *  Identifica o CEP e preenche os campos de endereço
   * @returns
   */
  function identificarCEP() {
    const cep = $(FormCliente.CEP).val();
    const filtro = /^\d{5}-\d{3}$/i;
    if (!filtro.test(cep)) {
      alert("CEP inválido!");
      $(FormCliente.CEP).focus();
      $(FormCliente.CEP).val("");
      return false;
    }

    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (dados) {
      if (!("erro" in dados)) {
        FormCliente.el(FormCliente.Logradouro).val(dados.logradouro);
        FormCliente.el(FormCliente.Cidade).val(dados.localidade);
        FormCliente.el(FormCliente.Estado).val(dados.uf);
      } else {
        alert("CEP não encontrado.");
        $(FormCliente.CEP).val("");
      }
    });
  }

  /**
   * Inicia o formulário
   */
  function iniciar() {
    iniciarMascaras();
    $(FormCliente.Id).submit(atualizarCliente.bind(this));
    FormCliente.el(FormCliente.CEP).blur(identificarCEP);
    FormCliente.el(FormCliente.btnBeneficiarios).click(
      onOpenModalBeneficiarios.bind(this)
    );
  }

  iniciar();
});
