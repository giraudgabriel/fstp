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
        public bool Incluir(List<DML.Beneficiario> beneficiarios)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();

            foreach (var beneficiario in beneficiarios)
            {
                //if (ben.VerificarExistencia(beneficiario.CPF)) return 0;

                //return ben.Incluir(beneficiario);
            }

            return true;
        }
    }
}
