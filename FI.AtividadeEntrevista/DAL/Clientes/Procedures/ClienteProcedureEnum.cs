namespace FI.AtividadeEntrevista.DAL.Clientes.Procedures
{
    /// <summary>
    /// Enum de procedures disponíveis para o modelo Cliente
    /// </summary>
    public static class ClienteProcedureEnum
    {
        public static string Alterar = "FI_SP_AltCliente";
        public static string Consultar = "FI_SP_ConsCliente";
        public static string Incluir = "FI_SP_IncClienteV2";
        public static string Excluir = "FI_SP_DelCliente";
        public static string Pesquisar = "FI_SP_PesqCliente";
        public static string ExisteCPF = "FI_SP_VerificaCliente";
    }
}
