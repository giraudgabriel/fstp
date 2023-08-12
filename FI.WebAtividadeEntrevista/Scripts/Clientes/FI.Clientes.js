﻿/**
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
 * Modal de beneficiários (lista de beneficiários)
 */
const ModalBeneficiario = {
  Id: "#modalBeneficiarios",
  Nome: "#BeneficiarioNome",
  CPF: "#BeneficiarioCPF",
  BtnAlterar: "#btnAlterarBeneficiario",
  BtnAdicionar: "#btnAddBeneficiario",
  BtnRemover: "#btnRemoveBeneficiario",
  Grid: "#gridBeneficiarios",
  el: (id) => $(`${ModalBeneficiario.Id} ${id}`),
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

const MaskBeneficiario = {
  [ModalBeneficiario.CPF]: CPFUtils.mask,
};

$(document).ready(function () {
  var vm = this;
  vm.beneficiarios = []; // Lista de beneficiários

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
      Beneficiarios: vm.beneficiarios,
    };
  }

  function limparFormulario() {
    $(FormCliente.Id)[0].reset();
    vm.beneficiarios = [];
  }

  function cadastrarCliente(e) {
    e.preventDefault();

    const data = getFormData();

    if (CPFUtils.validarCPF(data.CPF) == false) {
      alert("CPF inválido.");
      FormCliente.el(FormCliente.CPF).focus();
      FormCliente.el(FormCliente.CPF).val("");
      return;
    }

    $.ajax({
      url: urlPost,
      method: "POST",
      data,
      error: function (r) {
        if (r.status == 400 || r.status == 409)
          ModalDialog("Ocorreu um erro", r.responseJSON);
        else if (r.status == 500)
          ModalDialog(
            "Ocorreu um erro",
            "Ocorreu um erro interno no servidor."
          );
      },
      success: function (r) {
        ModalDialog("Sucesso!", r);
        limparFormulario();
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
    $(FormCliente.Id).submit(cadastrarCliente.bind(this));
    FormCliente.el(FormCliente.CEP).blur(identificarCEP);
    FormCliente.el(FormCliente.btnBeneficiarios).click(
      onOpenModalBeneficiarios.bind(this)
    );
  }

  iniciar();
});

function ModalDialog(titulo, texto) {
  const random = Math.random().toString().replace(".", "");

  const texto = `
    <div id="${random}" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-hidden="true"
                    >
                        ×
                    </button>
                    <h4 class="modal-title">${titulo}</h4>
                </div>

                <div class="modal-body">
                    <p>${texto}</p>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-default"
                        data-dismiss="modal"
                    >
                      Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

  $("body").append(texto);
  $("#" + random).modal("show");
}

async function ModalBeneficiarios(titulo, beneficiarios) {
  function onRemoveBeneficiario(e) {
    e.preventDefault();
    const id = $(this).attr("data");

    if (!id) return;

    const beneficiario = beneficiarios.find((b) => b.Id == id);

    if (!beneficiario) return;

    if (!confirm(`Deseja remover o beneficiário de CPF: ${beneficiario.CPF} ?`))
      return;

    removerBeneficiario(id);
    $(this).closest("tr").remove();
  }

  function limparFormulario() {
    ModalBeneficiario.el(ModalBeneficiario.CPF).val("");
    ModalBeneficiario.el(ModalBeneficiario.Nome).val("");
  }

  function onUpdateBeneficiario(e) {
    e.preventDefault();
    const id = ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).attr(
      "data"
    );

    if (!id) return;

    const beneficiario = beneficiarios.find((b) => b.Id == id);

    if (!beneficiario) return;

    const data = getFormData();

    if (!data) return;
    removerBeneficiario(id);

    ModalBeneficiario.el(`#beneficiario-${id}`)?.remove();

    beneficiarios.push({
      Id: id,
      CPF: data.CPF,
      Nome: data.Nome,
    });
    adicionaBeneficiario(id, data.CPF, data.Nome);

    $(ModalBeneficiario.Id).off("click", ModalBeneficiario.BtnAdicionar);
    $(ModalBeneficiario.Id).on(
      "click",
      ModalBeneficiario.BtnAdicionar,
      onAddBeneficiario.bind(this)
    );

    ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).text("Incluir");
    limparFormulario();
  }

  function onEditBeneficiario(e) {
    e.preventDefault();
    const id = $(this).attr("data");

    if (!id) return;

    const beneficiarioIndex = beneficiarios.findIndex((b) => b.Id == id);
    if (beneficiarioIndex == -1) return;

    const beneficiario = beneficiarios[beneficiarioIndex];
    ModalBeneficiario.el(ModalBeneficiario.CPF).val(beneficiario.CPF);
    ModalBeneficiario.el(ModalBeneficiario.Nome).val(beneficiario.Nome);
    ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).attr("data", id);
    ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).text("Alterar");
    $(ModalBeneficiario.Id).off("click", ModalBeneficiario.BtnAdicionar);
    $(ModalBeneficiario.Id).on(
      "click",
      ModalBeneficiario.BtnAdicionar,
      onUpdateBeneficiario
    );
  }

  function removerBeneficiario(id) {
    const index = beneficiarios.findIndex((b) => b.Id == id);
    if (index >= 0) beneficiarios.splice(index, 1);
  }

  const getFormData = () => {
    const cpf = ModalBeneficiario.el(ModalBeneficiario.CPF).val();
    const nome = ModalBeneficiario.el(ModalBeneficiario.Nome).val();

    if (cpf == "" || nome == "") {
      alert("Informe o CPF e o nome do beneficiário.");
      return;
    }

    if (CPFUtils.validarCPF(cpf) == false) {
      alert("CPF inválido.");
      ModalBeneficiario.el(ModalBeneficiario.CPF).focus();
      return;
    }

    return {
      CPF: cpf,
      Nome: nome,
    };
  };

  function onAddBeneficiario(e) {
    e.preventDefault();

    const data = getFormData();

    if (!data) return;

    const beneficiario = {
      ...data,
      Id: new Date().getTime().toString(),
    };

    if (beneficiarios.find((b) => b.CPF == beneficiario.CPF)) {
      alert("CPF já adicionado.");
      return;
    }

    limparFormulario();

    beneficiarios.push(beneficiario);
    adicionaBeneficiario(beneficiario.Id, beneficiario.CPF, beneficiario.Nome);
  }

  function adicionaBeneficiario(id, cpf, nome) {
    const linha = `
            <tr id="beneficiario-${id}">
                <td>${cpf}</td>
                <td>${nome}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" data="${id}" id="btnAlterarBeneficiario">
                        <span class="glyphicon glyphicon-pencil"></span>
                    </button>

                    <button type="button" class="btn btn-danger btn-sm" data="${id}" id="btnRemoveBeneficiario">
                       <span class="glyphicon glyphicon-trash"></span>
                    </button>
                </td>
            </tr>
        `;

    ModalBeneficiario.el(ModalBeneficiario.Grid + " tbody").append(linha);
  }

  const id = ModalBeneficiario.Id.replace("#", "").trim();

  const modal = `
        <div id="${id}" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> 
                            <h4 class="modal-title">${titulo}</h4>
                    </div>
                    
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-5">
                                <div class="form-group">
                                    <label for="CPF">CPF:</label>
                                    <input type="text" class="form-control" id="BeneficiarioCPF" name="BeneficiarioCPF" placeholder="CPF" maxlength="14" required>
                                </div>
                            </div>

                            <div class="col-sm-5">
                                <div class="form-group">
                                    <label for="Nome">Nome:</label>
                                    <input type="text" class="form-control" id="BeneficiarioNome" name="BeneficiarioNome" placeholder="Nome" maxlength="50" required>
                                </div>
                            </div>

                            <div class="col-sm-2">
                                <div class="form-group" style="margin-top: 24px">
                                    <button type="button" class="btn btn-success" id="btnAddBeneficiario" name="btnAddBeneficiario">Incluir</button>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                          <div class="col-sm-12">
                            <table class="table table-hover" id="gridBeneficiarios">
                              <thead>
                                <tr>
                                  <th>CPF</th>
                                  <th>Nome</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                              </tbody>
                            </table>
                          </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                    </div>

                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div> <!-- /.modal -->
    `;

  async function retornarBeneficiarios() {
    const promiseBeneficiarios = new Promise((resolve) => {
      $(ModalBeneficiario.Id).on("hidden.bs.modal", function () {
        resolve(beneficiarios);
      });
    });
    const result = await promiseBeneficiarios;

    unRegisterEvents();

    return result;
  }

  function unRegisterEvents() {
    $(ModalBeneficiario.Id).off(
      "click",
      ModalBeneficiario.BtnAdicionar,
      onAddBeneficiario
    );

    $(ModalBeneficiario.Id).off(
      "click",
      ModalBeneficiario.BtnAdicionar,
      onUpdateBeneficiario
    );

    $(ModalBeneficiario.Id).off(
      "click",
      ModalBeneficiario.BtnAlterar,
      onEditBeneficiario
    );

    $(ModalBeneficiario.Id).off(
      "click",
      ModalBeneficiario.BtnRemover,
      onRemoveBeneficiario
    );

    ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).text("Incluir");

    limparFormulario();
  }

  function registerEvents() {
    $(ModalBeneficiario.Id).on(
      "click",
      ModalBeneficiario.BtnAdicionar,
      onAddBeneficiario
    );

    $(ModalBeneficiario.Id).on(
      "click",
      ModalBeneficiario.BtnAlterar,
      onEditBeneficiario
    );

    $(ModalBeneficiario.Id).on(
      "click",
      ModalBeneficiario.BtnRemover,
      onRemoveBeneficiario
    );
  }

  async function iniciar() {
    $("body").append(modal);
    $(ModalBeneficiario.Id).modal("show");

    registerEvents();
    ModalBeneficiario.el(ModalBeneficiario.CPF).mask(CPFUtils.mask);
    ModalBeneficiario.el(ModalBeneficiario.BtnAdicionar).text("Incluir");

    return await retornarBeneficiarios();
  }

  return await iniciar();
}

class CPFUtils {
  static mask = "999.999.999-99";

  static validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf == "") return false;
    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    )
      return false;
    // Valida 1o digito
    var add = 0;
    for (var i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
  }
}
