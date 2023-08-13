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
                ConnectionStringSettings conn = ConfigurationManager.ConnectionStrings["BancoDeDados"];
                if (conn != null)
                    return conn.ConnectionString;
                else
                    return string.Empty;
            }
        }

        internal SqlConnection GetConnection()
        {
            var connection = new SqlConnection(stringDeConexao);
            return connection;
        }

        internal SqlCommand ProcedureCommand(string procedure, List<SqlParameter> parametros)
        {
            SqlCommand comando = new SqlCommand
            {
                Connection = GetConnection(),
                CommandType = CommandType.StoredProcedure,
                CommandText = procedure,
            };
            foreach (var item in parametros)
                comando.Parameters.Add(item);

            return comando;
        }


        internal int Executar(string nomeProcedure, List<SqlParameter> parametros)
        {
            SqlCommand comando = ProcedureCommand(nomeProcedure, parametros);

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

        internal DataSet Consultar(string nomeProcedure, List<SqlParameter> parametros)
        {
            SqlCommand comando = ProcedureCommand(nomeProcedure, parametros);

            SqlDataAdapter adapter = new SqlDataAdapter(comando);
            DataSet ds = new DataSet();

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
