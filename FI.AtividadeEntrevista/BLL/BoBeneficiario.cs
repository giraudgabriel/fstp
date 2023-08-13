using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui novos beneficiarios
        /// </summary>
        /// <param name="beneficiarios"></param>
        public Dictionary<string, long> Incluir(IEnumerable<Beneficiario> beneficiarios)
        {
            var ben = new DAL.DaoBeneficiario();

            return beneficiarios.ToDictionary(beneficiario => beneficiario.CPF, beneficiario => ben.Incluir(beneficiario));
        }
        
        /// <summary>
        /// Alterar beneficiarios
        /// </summary>
        /// <param name="beneficiarios"></param>
        public void Alterar(IEnumerable<Beneficiario> beneficiarios)
        {
            var ben = new DAL.DaoBeneficiario();

            foreach (var beneficiario in beneficiarios)
            {
                ben.Alterar(beneficiario);
            }
        }

        /// <summary>
        /// Busca beneficiarios por um cliente
        /// </summary>
        /// <param name="idCliente"></param>
        /// <returns></returns>
        public IEnumerable<Beneficiario> ConsultarPorCliente(long idCliente)
        {
            var ben = new DAL.DaoBeneficiario();

            return ben.BuscarPorCliente(idCliente);
        }

        /// <summary>
        /// Excluir beneficiarios por id
        /// </summary>
        /// <param name="beneficiariosParaExcluir"></param>
        public void Excluir(List<long> beneficiariosParaExcluir)
        {
            var ben = new DAL.DaoBeneficiario();

            foreach (var id in beneficiariosParaExcluir)
            {
                ben.Excluir(id);
            }
        }
    }
}
