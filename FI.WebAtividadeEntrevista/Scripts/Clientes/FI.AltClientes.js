$(document).ready(function () {
  //Mascara cpf para o campo CPF
  $("#formCadastro #CPF").mask("999.999.999-99");
  //Mascara telefone para o campo Telefone
  $("#formCadastro #Telefone").mask("(99) 99999-9999");
  //Mascara CEP para o campo CEP
  $("#formCadastro #CEP").mask("99999-999");
  //Validação do campo CEP
  $("#formCadastro #CEP").blur(function () {
    const cep = $("#CEP").val();
    const filtro = /^\d{5}-\d{3}$/i;
    if (!filtro.test(cep)) {
      alert("CEP inválido!");
      $("#CEP").focus();
      $("#CEP").val("");
      return false;
    }

    if (cep == "") return false;

    if (cep == obj.CEP) return false;

    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (dados) {
      if (!("erro" in dados)) {
        if (dados.logradouro != "") {
          $("#formCadastro #Logradouro").val(dados.logradouro);
        }
        if (dados.localidade != "") {
          $("#formCadastro #Cidade").val(dados.localidade);
        }
        $("#formCadastro #Estado").val(dados.uf);
      } else {
        alert("CEP não encontrado.");
        $("#CEP").val("");
      }
    });
  });

  if (obj) {
    $("#formCadastro #Nome").val(obj.Nome);
    $("#formCadastro #CEP").val(obj.CEP);
    $("#formCadastro #Email").val(obj.Email);
    $("#formCadastro #Sobrenome").val(obj.Sobrenome);
    $("#formCadastro #Nacionalidade").val(obj.Nacionalidade);
    $("#formCadastro #Estado").val(obj.Estado);
    $("#formCadastro #Cidade").val(obj.Cidade);
    $("#formCadastro #Logradouro").val(obj.Logradouro);
    $("#formCadastro #Telefone").val(obj.Telefone);
    $("#formCadastro #CPF").val(obj.CPF);
    $("#formCadastro #CPF").attr("readonly", true);
  }

  $("#formCadastro").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: urlPost,
      method: "POST",
      data: {
        NOME: $(this).find("#Nome").val(),
        CEP: $(this).find("#CEP").val(),
        Email: $(this).find("#Email").val(),
        Sobrenome: $(this).find("#Sobrenome").val(),
        Nacionalidade: $(this).find("#Nacionalidade").val(),
        Estado: $(this).find("#Estado").val(),
        Cidade: $(this).find("#Cidade").val(),
        Logradouro: $(this).find("#Logradouro").val(),
        Telefone: $(this).find("#Telefone").val(),
        CPF: $(this).find("#CPF").val(),
      },
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
        $("#formCadastro")[0].reset();
        window.location.href = urlRetorno;
      },
    });
  });
});

function ModalDialog(titulo, texto) {
  var random = Math.random().toString().replace(".", "");
  var texto =
    '<div id="' +
    random +
    '" class="modal fade">                                                               ' +
    '        <div class="modal-dialog">                                                                                 ' +
    '            <div class="modal-content">                                                                            ' +
    '                <div class="modal-header">                                                                         ' +
    '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
    '                    <h4 class="modal-title">' +
    titulo +
    "</h4>                                                    " +
    "                </div>                                                                                             " +
    '                <div class="modal-body">                                                                           ' +
    "                    <p>" +
    texto +
    "</p>                                                                           " +
    "                </div>                                                                                             " +
    '                <div class="modal-footer">                                                                         ' +
    '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
    "                                                                                                                   " +
    "                </div>                                                                                             " +
    "            </div><!-- /.modal-content -->                                                                         " +
    "  </div><!-- /.modal-dialog -->                                                                                    " +
    "</div> <!-- /.modal -->                                                                                        ";

  $("body").append(texto);
  $("#" + random).modal("show");
}
