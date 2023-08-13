CREATE OR ALTER PROC FI_SP_AltBeneficiario
    @Nome          VARCHAR (50) ,
	@CPF           VARCHAR (14),
	@Id           BIGINT
AS
BEGIN
UPDATE BENEFICIARIOS
SET
    NOME = @Nome,
    CPF = @CPF
WHERE ID = @Id
END