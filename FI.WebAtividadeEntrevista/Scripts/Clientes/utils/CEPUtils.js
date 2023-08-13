class CEPUtils {
    static formatarCEP(cep) {
        if (cep) {
            return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return cep;
    }

    static validarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        return cep.length === 8;
    }

    static async buscarCEP(cep) {
        const cepSemMascara = CEPUtils.formatarCEP(cep);
        const url = `https://viacep.com.br/ws/${cepSemMascara}/json/`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    static async identificar(cep) {
        const endereco = await CEPUtils.buscarCEP(cep);
        if (endereco.erro) {
            alert('CEP não encontrado!');
            return;
        }

        return {
            Estado: endereco.uf,
            Cidade: endereco.localidade,
            Logradouro: endereco.logradouro,
        }
    }

    static async buscarEstados() {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
}