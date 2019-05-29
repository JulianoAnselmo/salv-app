
export interface Acompanhamento { 
    CODIGO: number,
    DATA_ACOMPANHAMENTO: string,
    ATIVIDADE: string
    
    
}

export interface Acompanhamento_Funcionario{

    CODIGO_FUNCIONARIO: number,
    ACOMPANHAMENTO_CODIGO:number
}

export interface Acompanhamento_Residente{

    CODIGO_RESIDENTE: number,
    ACOMPANHAMENTO_CODIGO:number
}

export interface AcompanhamentoQuery {
    CODIGO: number,
    DATA_ACOMPANHAMENTO: string,
    ATIVIDADE: string,
    CODIGO_FUNCIONARIO: number,
    RESIDENTE_NOME: string,
    FUNCIONARIO_NOME: string,
    CODIGO_RESIDENTE: number
}

export interface AcompanhamentoFuncionarioQuery {
 
    CODIGO_FUNCIONARIO: number,    
    FUNCIONARIO_NOME: string,
    CARGO: string
}


export interface AcompanhamentoResidenteQuery {
 
    CODIGO_RESIDENTE: number,    
    RESIDENTE_NOME: string

}