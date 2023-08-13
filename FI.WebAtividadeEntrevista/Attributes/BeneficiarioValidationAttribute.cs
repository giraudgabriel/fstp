using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class BeneficiarioValidationAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return true;

            var beneficiarios = (List<BeneficiarioModel>)value;

            foreach (var beneficiario in beneficiarios)
            {
                var index = beneficiarios.IndexOf(beneficiario);

                foreach (var beneficiarioToCompare in beneficiarios)
                {
                    var indexToCompare = beneficiarios.IndexOf(beneficiarioToCompare);

                    if (indexToCompare == index) continue;

                    if (beneficiario.CPF == beneficiarioToCompare.CPF)
                        return false;
                }
            }

            return true;

        }
    }
}
