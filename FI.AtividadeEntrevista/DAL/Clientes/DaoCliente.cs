using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using FI.AtividadeEntrevista.DAL.Clientes.Procedures;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Cliente
    /// </summary>
    internal class DaoCliente : AcessoDados
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>

        internal long Incluir(Cliente cliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", cliente.Nome),
                new SqlParameter("Sobrenome", cliente.Sobrenome),
                new SqlParameter("Nacionalidade", cliente.Nacionalidade),
                new SqlParameter("CEP", cliente.CEP),
                new SqlParameter("Estado", cliente.Estado),
                new SqlParameter("Cidade", cliente.Cidade),
                new SqlParameter("Logradouro", cliente.Logradouro),
                new SqlParameter("Email", cliente.Email),
                new SqlParameter("Telefone", cliente.Telefone),
                new SqlParameter("CPF", cliente.CPF),
            };

            DataSet ds = Consultar(ClienteProcedureEnum.Incluir, parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal Cliente Consultar(long Id)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter(nameof(Id), Id)
            };

            DataSet ds = Consultar(ClienteProcedureEnum.Consultar, parametros);
            List<Cliente> cli = Converter(ds);

            return cli.FirstOrDefault();
        }

        internal bool VerificarExistencia(string CPF)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", CPF)
            };

            DataSet ds = Consultar(ClienteProcedureEnum.ExisteCPF, parametros);

            return ds.Tables[0].Rows.Count > 0;
        }

        internal List<Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("iniciarEm", iniciarEm),
                new SqlParameter("quantidade", quantidade),
                new SqlParameter("campoOrdenacao", campoOrdenacao),
                new SqlParameter("crescente", crescente)
            };

            DataSet ds = Consultar(ClienteProcedureEnum.Pesquisar, parametros);
            List<Cliente> cli = Converter(ds);

            int iQtd = 0;

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                int.TryParse(ds.Tables[1].Rows[0][0].ToString(), out iQtd);

            qtd = iQtd;

            return cli;
        }

        /// <summary>
        /// Lista todos os clientes
        /// </summary>
        internal List<Cliente> Listar()
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", 0)
            };

            DataSet ds = Consultar(ClienteProcedureEnum.Consultar, parametros);
            List<Cliente> cli = Converter(ds);

            return cli;
        }

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal void Alterar(DML.Cliente cliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", cliente.Nome),
                new SqlParameter("Sobrenome", cliente.Sobrenome),
                new SqlParameter("Nacionalidade", cliente.Nacionalidade),
                new SqlParameter("CEP", cliente.CEP),
                new SqlParameter("Estado", cliente.Estado),
                new SqlParameter("Cidade", cliente.Cidade),
                new SqlParameter("Logradouro", cliente.Logradouro),
                new SqlParameter("Email", cliente.Email),
                new SqlParameter("Telefone", cliente.Telefone),
                new SqlParameter("ID", cliente.Id)
            };

            Executar(ClienteProcedureEnum.Alterar, parametros);
        }


        /// <summary>
        /// Excluir Cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        internal void Excluir(long Id)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", Id)
            };

            Executar(ClienteProcedureEnum.Excluir, parametros);
        }

        private List<Cliente> Converter(DataSet ds)
        {
            List<Cliente> lista = new List<DML.Cliente>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Cliente cli = new Cliente()
                    {
                        Id = row.Field<long>("Id"),
                        CEP = row.Field<string>("CEP"),
                        Cidade = row.Field<string>("Cidade"),
                        Email = row.Field<string>("Email"),
                        Estado = row.Field<string>("Estado"),
                        Logradouro = row.Field<string>("Logradouro"),
                        Nacionalidade = row.Field<string>("Nacionalidade"),
                        Nome = row.Field<string>("Nome"),
                        Sobrenome = row.Field<string>("Sobrenome"),
                        Telefone = row.Field<string>("Telefone"),
                        CPF = row.Field<string>("CPF"),
                    };
                    lista.Add(cli);
                }
            }

            return lista;
        }
    }
}
