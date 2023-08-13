using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{
    internal class AcessoDados
    {
        private string stringDeConexao
        {
            get
            {
                var conn = ConfigurationManager.ConnectionStrings["BancoDeDados"];
                return conn != null ? conn.ConnectionString : string.Empty;
            }
        }

        /// <summary>
        /// Retorna a conexão com banco de dados
        /// </summary>
        /// <returns></returns>
        private SqlConnection GetConnection()
        {
            var connection = new SqlConnection(stringDeConexao);
            return connection;
        }

        /// <summary>
        /// Cria um modelo de execução de procedures no sql server
        /// </summary>
        /// <param name="procedure"></param>
        /// <param name="parametros"></param>
        /// <returns></returns>
        private SqlCommand ProcedureCommand(string procedure, List<SqlParameter> parametros)
        {
            var comando = new SqlCommand
            {
                Connection = GetConnection(),
                CommandType = CommandType.StoredProcedure,
                CommandText = procedure,
            };
            foreach (var item in parametros)
                comando.Parameters.Add(item);

            return comando;
        }

        /// <summary>
        /// Executa uma procedure
        /// </summary>
        /// <param name="nomeProcedure"></param>
        /// <param name="parametros"></param>
        /// <returns></returns>
        internal int Executar(string nomeProcedure, List<SqlParameter> parametros)
        {
            var comando = ProcedureCommand(nomeProcedure, parametros);

            using (var conexao = comando.Connection)
            {
                conexao.Open();
                try
                {
                    return comando.ExecuteNonQuery();
                }
                catch
                {
                    return 0;
                }

                finally
                {
                    conexao.Close();
                }
            }
        }

        /// <summary>
        /// Executa uma procedure com retorno
        /// </summary>
        /// <param name="nomeProcedure"></param>
        /// <param name="parametros"></param>
        /// <returns></returns>
        internal DataSet Consultar(string nomeProcedure, List<SqlParameter> parametros)
        {
            var comando = ProcedureCommand(nomeProcedure, parametros);

            var adapter = new SqlDataAdapter(comando);
            var ds = new DataSet();

            using (var conexao = comando.Connection)
            {
                conexao.Open();
                try
                {
                    adapter.Fill(ds);
                }
                finally
                {
                    conexao.Close();
                }
            }
           
            return ds;
        }

    }
}
