function ModalDialog(titulo, texto) {
  const random = Math.random().toString().replace(".", "");

  const modalDialog = `
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

  $("body").append(modalDialog);
  $("#" + random).modal("show");
}
