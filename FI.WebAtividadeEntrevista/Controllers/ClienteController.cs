using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        /// <summary>
        /// Incluir um cliente no banco de dados com ou sem beneficiários
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            var bo = new BoCliente();
            var boBeneficiario = new BoBeneficiario();

            if (!ModelState.IsValid)
            {
                var erros = (from item in ModelState.Values
                    from error in item.Errors
                    select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            model.Id = bo.Incluir(new Cliente
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF,
            });

            if (model.Id == 0)
            {
                Response.StatusCode = 409;
                return Json("Já existe um cliente com este CPF!");
            }


            if (model.Beneficiarios == null || model.Beneficiarios.Count <= 0)
                return Json("Cadastro efetuado com sucesso");
            
            var beneficiarios = model.Beneficiarios.Select(x => new Beneficiario
            {
                CPF = x.CPF,
                IdCliente = model.Id,
                Nome = x.Nome,
                Id = 0,
            }).ToList();

            var resultBeneficiario = boBeneficiario.Incluir(beneficiarios);

            if (resultBeneficiario.Any(x => x.Value == 0))
            {
                var erros = (from item in resultBeneficiario.Keys
                        select $"Falha ao salvar beneficiário de CPF: {item}!")
                    .ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            return Json("Cadastro efetuado com sucesso");
        }

        /// <summary>
        /// Alterar um cliente no banco de dados, adicionando, alterando ou excluindo beneficiários
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            var bo = new BoCliente();
            var boBeneficiario = new BoBeneficiario();

            if (!ModelState.IsValid)
            {
                var erros = (from item in ModelState.Values
                    from error in item.Errors
                    select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            bo.Alterar(new Cliente
            {
                Id = model.Id,
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone
            });


            if (model.Beneficiarios != null)
            {
                //beneficiarios para adicionar
                var beneficiariosParaAdicionar = model.Beneficiarios
                    .Where(x => x.Id == 0)
                    .Select(x => new Beneficiario
                    {
                        Id = 0,
                        IdCliente = model.Id,
                        Nome = x.Nome,
                        CPF = x.CPF,
                    }).ToList();

                //beneficiarios para atualizar
                var beneficiariosParaAtualizar = model.Beneficiarios
                    .Where(x => x.Id > 0)
                    .Select(x => new Beneficiario
                    {
                        Id = x.Id,
                        IdCliente = model.Id,
                        Nome = x.Nome,
                        CPF = x.CPF,
                    }).ToList();

                //beneficiarios para excluir
                var beneficiariosParaExcluir = model.Beneficiarios
                    .Where(x => x.ShouldDelete == true)
                    .Select(x => x.Id).ToList();

                boBeneficiario.Incluir(beneficiariosParaAdicionar);
                boBeneficiario.Alterar(beneficiariosParaAtualizar);
                boBeneficiario.Excluir(beneficiariosParaExcluir);
            }
           

            return Json("Cadastro alterado com sucesso");
        }

        /// <summary>
        /// Buscar um cliente para alterar pelo Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [HttpGet]
        public ActionResult Alterar(long id)
        {
            var bo = new BoCliente();
            var boBeneficiario = new BoBeneficiario();

            var cliente = bo.Consultar(id);

            if (cliente == null) return View((ClienteModel) null);
            
            var beneficiarios = boBeneficiario.ConsultarPorCliente(cliente.Id);


            var model = new ClienteModel
            {
                Id = cliente.Id,
                CEP = cliente.CEP,
                Cidade = cliente.Cidade,
                Email = cliente.Email,
                Estado = cliente.Estado,
                Logradouro = cliente.Logradouro,
                Nacionalidade = cliente.Nacionalidade,
                Nome = cliente.Nome,
                Sobrenome = cliente.Sobrenome,
                Telefone = cliente.Telefone,
                CPF = cliente.CPF,
                Beneficiarios = beneficiarios.Select(x => new BeneficiarioModel
                {
                    Id = x.Id,
                    CPF = x.CPF,
                    Nome = x.Nome,
                }).ToList(),
            };

            return View(model);
        }

        /// <summary>
        /// Listagem personalizada de clientes
        /// </summary>
        /// <param name="jtStartIndex"></param>
        /// <param name="jtPageSize"></param>
        /// <param name="jtSorting"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                var campo = string.Empty;
                var crescente = string.Empty;
                if (jtSorting != null)
                {
                    var array = jtSorting.Split(' ');

                    if (array.Length > 0)
                        campo = array[0];

                    if (array.Length > 1)
                        crescente = array[1];
                }

                var clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo,
                    crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out var qtd);

                //Return result to jTable
                return Json(new {Result = "OK", Records = clientes, TotalRecordCount = qtd});
            }
            catch (Exception ex)
            {
                return Json(new {Result = "ERROR", ex.Message});
            }
        }
    }
}