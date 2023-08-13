namespace FI.AtividadeEntrevista.DAL.Clientes.Procedures
{
    /// <summary>
    /// Enum de procedures disponíveis para o modelo Beneficiario
    /// </summary>
    public static class BeneficiarioProcedureEnum
    {
        public static string Alterar = "FI_SP_AltBeneficiario";
        public static string Incluir = "FI_SP_IncBeneficiario";
        public static string Excluir = "FI_SP_DelBeneficiario";
        public static string Pesquisar = "FI_SP_PesqBeneficiario";
        public static string BuscarPorCliente = "FI_SP_BuscarBeneficiarioPorCliente";
        public static string ExisteCPF = "FI_SP_VerificaBeneficiario";
    }
}
