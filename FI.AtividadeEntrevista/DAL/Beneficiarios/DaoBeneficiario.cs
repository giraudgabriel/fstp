using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DAL.Clientes.Procedures;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Beneficiario
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        /// <summary>
        /// Inclui um novo Beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de Beneficiario</param>
        internal long Incluir(DML.Beneficiario  beneficiario)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", beneficiario.Nome),
                new SqlParameter("CPF", beneficiario.CPF),
                new SqlParameter("IdCliente", beneficiario.IdCliente),
            };

            var ds = Consultar(BeneficiarioProcedureEnum.Incluir, parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Busca beneficiarios por Cliente
        /// </summary>
        /// <param name="idCliente"></param>
        /// <returns></returns>
        internal IEnumerable<Beneficiario> BuscarPorCliente(long idCliente)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", idCliente),
            };

            var ds = Consultar(BeneficiarioProcedureEnum.BuscarPorCliente, parametros);
            var beneficiarios = Converter(ds);
            return beneficiarios;
        }

        /// <summary>
        /// Altera um beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal void Alterar(DML.Beneficiario beneficiario)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", beneficiario.Nome),
                new SqlParameter("CPF", beneficiario.CPF),
                new SqlParameter("Id", beneficiario.Id),
            };

            Executar(BeneficiarioProcedureEnum.Alterar, parametros);
        }
        
        private static IEnumerable<Beneficiario> Converter(DataSet ds)
        {
            var lista = new List<Beneficiario>();
            if (ds?.Tables == null || ds.Tables.Count <= 0 || ds.Tables[0].Rows.Count <= 0) return lista;
            foreach (DataRow row in ds.Tables[0].Rows)
            {
                var beneficiario = new Beneficiario
                {
                    Id = row.Field<long>("ID"),
                    CPF = row.Field<string>("CPF"),
                    Nome = row.Field<string>("NOME"),
                    IdCliente = row.Field<long>("IDCLIENTE")
                };
                lista.Add(beneficiario);
            }

            return lista;
        }
    }
}
