﻿CREATE OR ALTER PROC FI_SP_VerificaCliente
	@CPF VARCHAR(14)
AS
BEGIN
	SELECT 1 FROM CLIENTES WITH(NOLOCK) WHERE CPF = @CPF
END