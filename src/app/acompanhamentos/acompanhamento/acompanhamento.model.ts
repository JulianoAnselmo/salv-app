
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
    CODIGO_RESIDENTE: number
}