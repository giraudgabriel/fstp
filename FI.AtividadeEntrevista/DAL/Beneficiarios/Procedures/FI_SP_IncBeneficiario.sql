﻿CREATE OR ALTER PROC FI_SP_IncBeneficiario
    @Nome          VARCHAR (50) ,
	@CPF		   VARCHAR (14),
	@IdCliente     bigint
AS
BEGIN
	INSERT INTO BENEFICIARIOS (NOME, CPF, IDCLIENTE) 
	VALUES (@NOME, @CPF, @IdCliente)

	SELECT SCOPE_IDENTITY()
END