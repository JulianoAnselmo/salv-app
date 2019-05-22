export interface Residente {
    CODIGO_RESIDENTE: number,
    APELIDO: string,
    PROFISSAO: string,
    TITULO_ELEITOR: string,
    ZONA_ELEITORAL: string,
    SECAO_ELEITORAL: string,
    NUMERO_CERTIDAO_NASCIMENTO: string,
    FOLHA_CERTIDAO_NASCIMENTO: string,
    LIVRO_CERTIDAO_NASCIMENTO: string,
    CIDADE_CERTIDAO_NASCIMENTO: string,
    ESTADO_CERTIDAO_NASCIMENTO: string,
    CARTAO_SAMS: string,
    CARTAO_SUS: string,
    NUMERO_INSS: string,
    BANCO_INSS: string,
    AGENCIA_INSS: string,
    CONTA_INSS: string,
    VALOR_INSS: number,
    SITUACAO_INSS: string,
    PROVA_VIDA_INSS: string,
    DATA_ACOLHIMENTO: string,
    DATA_DESACOLHIMENTO: string,
    MOTIVO_DESACOLHIMENTO: string,
    PESSOA_CODIGO: number,
    PESSOA: {
        CODIGO: number,
        NOME: string,
        SOBRENOME: string,
        RG: string,
        CPF: string,
        SEXO: string,
        ESTADO_CIVIL: string
        DATA_NASCIMENTO: string
        RELIGIAO: string,
        ESCOLARIDADE: string
    },
    CERTIDAO_CASAMENTO: {
        CODIGO_RESIDENTE: number,
        FOLHA: string,
        LIVRO: string,
        REGISTRO: string,
        CIDADE: string,
        ESTADO: string,
        CONJUGE: string
    }
}

export interface Pessoa {
    CODIGO: number,
    NOME: string,
    SOBRENOME: string,
    RG: string,
    CPF: string,
    SEXO: string,
    ESTADO_CIVIL: string
    DATA_NASCIMENTO: string
    RELIGIAO: string,
    ESCOLARIDADE: string
}

export interface Residente_Convenio {
    NUMERO_CONVENIO: number,
    RESIDENTE_CODIGO: number,
    TITULAR_CONVENIO: string,
    PARENTESCO_TITULAR: string,
    CONVENIO_CODIGO: number
}

export interface Residente_delete {
    MOTIVO_DESACOLHIMENTO: string,
    DATA_DESACOLHIMENTO: string
}

export interface Certidao_Casamento {
    CODIGO_RESIDENTE: number,
    FOLHA: string,
    LIVRO: string,
    REGISTRO: string,
    CIDADE: string,
    ESTADO: string,
    CONJUGE: string
}