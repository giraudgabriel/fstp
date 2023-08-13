/**
 *
 * @param {string} titulo
 * @param {{ CPF: string; Nome: string; Id: number | string;} [] } beneficiarios
 * @returns  { CPF: string; Nome: string; Id: number | string;} []
 */
async function ModalBeneficiarios(titulo, beneficiariosParam) {
  let beneficiarios = beneficiariosParam || [];
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
      Id: "new" + new Date().getTime().toString(),
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

                        <div class="row table-responsive">
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

    beneficiarios = beneficiariosParam || [];

    ModalBeneficiario.el(ModalBeneficiario.Grid + " tbody").empty();

    beneficiarios.forEach((b) => {
      adicionaBeneficiario(b.Id, b.CPF, b.Nome);
    });

    return await retornarBeneficiarios();
  }

  return await iniciar();
}
