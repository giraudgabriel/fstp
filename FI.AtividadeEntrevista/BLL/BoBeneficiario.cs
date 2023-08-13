using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui um novo beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de Beneficiario</param>
        public Dictionary<string, long> Incluir(List<DML.Beneficiario> beneficiarios)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();

            var results = new Dictionary<string, long>();

            foreach (var beneficiario in beneficiarios)
                results.Add(beneficiario.CPF, ben.Incluir(beneficiario));

            return results;
        }

        public List<DML.Beneficiario> ConsultarPorCliente(long id)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();

            return ben.BuscarPorCliente(id);
        }
    }
}
