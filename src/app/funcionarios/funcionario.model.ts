export interface Funcionario {
    CODIGO_FUNCIONARIO: number,
    CARGO: string,
    DATA_ADMISSAO: string,
    DATA_DEMISSAO: string,
    PESSOA_CODIGO: number,
    PESSOA: {
        CODIGO: number,
        NOME: string,
        SOBRENOME: string,
        RG: string,
        CPF: string,
        SEXO: string,
        ESTADO_CIVIL: string,
        DATA_NASCIMENTO: string,
        RELIGIAO: string,
        ESCOLARIDADE: string
    },
    USUARIO: {
        CODIGO_FUNCIONARIO: number,
        EMAIL: string,
        LOGIN: string,
        SENHA: string
    },
    TELEFONE: {
        CODIGO: number,
        DDD: string,
        NUMERO: string
    },
    ENDERECO: {
        CODIGO: number,
        ENDERECO: string,
        NUMERO: number,
        BAIRRO: string,
        COMPLEMENTO: string,
        CIDADE: string,
        ESTADO: string,
        CEP: string,
        REFERENCIA: string
    },
    
}

export interface Pessoa {
    CODIGO: number,
    NOME: string,
    SOBRENOME: string,
    RG: string,
    CPF: string,
    SEXO: string,
    ESTADO_CIVIL: string,
    DATA_NASCIMENTO: string,
    RELIGIAO: string,
    ESCOLARIDADE: string
}

export interface Usuario {
    CODIGO_FUNCIONARIO: number,
    EMAIL: string,
    LOGIN: string,
    SENHA: string
}

export interface Telefone {
    CODIGO: number,
    DDD: string,
    NUMERO: string
}

export interface Telefone_Pessoa {
    PESSOA_CODIGO: number,
    TELEFONE_CODIGO: number
}

export interface Endereco {
    CODIGO: number,
    ENDERECO: string,
    NUMERO: number,
    BAIRRO: string,
    COMPLEMENTO: string,
    CIDADE: string,
    ESTADO: string,
    CEP: string,
    REFERENCIA: string
}

export interface Endereco_Pessoa {
    PESSOA_CODIGO: number,
    ENDERECO_CODIGO: number
}

export interface Conta_Bancaria_Funcionario{

    CODIGO_FUNCIONARIO: number,
    BANCO: string,
    AGENCIA: string,
    CONTA: string
}

export interface FuncionarioQuery {
    COD_PES: number,
    NOME: string,
    SOBRENOME: string,
    RG: string,
    CPF: string,
    SEXO: string,
    ESTADO_CIVIL: string,
    DATA_NASCIMENTO: string,
    RELIGIAO: string,
    ESCOLARIDADE: string,
    COD_TEL: number,
    DDD: string,
    NUM_TEL: string,
    COD_END: number,
    ENDERECO: string,
    NUMERO: string,
    BAIRRO: string,
    COMPLEMENTO: string,
    CIDADE: string,
    ESTADO: string,
    CEP: string,
    REFERENCIA: string,
    COD_FUN: number,
    CARGO: string,
    DATA_ADMISSAO: string
}