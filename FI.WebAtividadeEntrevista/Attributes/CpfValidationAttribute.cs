using System;
using System.ComponentModel.DataAnnotations;

namespace WebAtividadeEntrevista.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class CpfValidationAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return true; 

            string cpf = value.ToString();
            cpf = cpf.Replace(".", "").Replace("-", ""); 

            if (cpf.Length != 11 || !IsDigitsOnly(cpf))
            {
                return false;
            }

            int[] digits = new int[11];
            for (int i = 0; i < 11; i++)
            {
                digits[i] = int.Parse(cpf[i].ToString());
            }

            if (AreAllDigitsEqual(digits))
            {
                return false;
            }

            int calculatedDigit1 = CalculateDigit(digits, 10);
            int calculatedDigit2 = CalculateDigit(digits, 11);

            return digits[9] == calculatedDigit1 && digits[10] == calculatedDigit2;
        }

        private bool IsDigitsOnly(string value)
        {
            foreach (char c in value)
            {
                if (!char.IsDigit(c))
                {
                    return false;
                }
            }
            return true;
        }

        private bool AreAllDigitsEqual(int[] digits)
        {
            int firstDigit = digits[0];
            foreach (int digit in digits)
            {
                if (digit != firstDigit)
                {
                    return false;
                }
            }
            return true;
        }

        private int CalculateDigit(int[] digits, int factor)
        {
            int sum = 0;
            for (int i = 0; i < factor - 1; i++)
            {
                sum += digits[i] * (factor - i);
            }
            int remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        }
    }
}
