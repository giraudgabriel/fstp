using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using WebAtividadeEntrevista.Attributes;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficiarioModel
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }
        
        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [CpfValidation(ErrorMessage = "Digite um CPF válido!")]
        public string CPF { get; set; }

        /// <summary>
        /// Variavel utilizada para excluir ou não ao alterar
        /// </summary>
        public bool? ShouldDelete { get; set; } = false;

    }
}