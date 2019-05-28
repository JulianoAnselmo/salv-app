import { Funcionario } from './../funcionarios/funcionario.model';
import { SALV_API } from './../app.api';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    Acompanhamento,
    AcompanhamentoQuery,
    Acompanhamento_Residente,
    Acompanhamento_Funcionario,
    AcompanhamentoFuncionarioQuery,
    AcompanhamentoResidenteQuery
} from './acompanhamento/acompanhamento.model';


@Injectable()
export class AcompanhamentosService {

    constructor(private http: HttpClient) { }

    acompanhamentos(): Observable<Acompanhamento[]> {
        return this.http.get<Acompanhamento[]>(`${SALV_API}/acompanhamento`)
    }

    acompanhamentoById(id: string): Observable<Acompanhamento> {
        return this.http.get<Acompanhamento>(`${SALV_API}/acompanhamento/${id}`)
    }

    funcionarioAcompanhamento(): Observable<Funcionario[]> {
        return this.http.get<Funcionario[]>(`${SALV_API}/acompanhamento_funcionario`)

    }

    AcompanhamentoQuery(id: string): Observable<AcompanhamentoQuery[]> {
        return this.http.get<AcompanhamentoQuery[]>(`${SALV_API}/acompanhamento/${id}`)

    }

    AcompanhamentoFuncionarioQuery(id: string): Observable<AcompanhamentoFuncionarioQuery[]> {
        return this.http.get<AcompanhamentoFuncionarioQuery[]>(`${SALV_API}/acompanhamento-funcionario/${id}`)

    }

    AcompanhamentoResidenteQuery(id: string): Observable<AcompanhamentoResidenteQuery[]> {
        return this.http.get<AcompanhamentoResidenteQuery[]>(`${SALV_API}/acompanhamento-residente/${id}`)

    }

    updateAcompanhamento(acompanhamento: Acompanhamento, id: number) {
        return this.http.put<Acompanhamento>(`${SALV_API}/acompanhamento-editar/${id}`, acompanhamento)

    }

    createAcompanhamentoFuncionario(acompanhamento_funcionario: Acompanhamento_Funcionario[]) {
        return this.http.post<Acompanhamento_Funcionario[]>(`${SALV_API}/acompanhamento_funcionario`, acompanhamento_funcionario)

    }

    createAcompanhamentoResidente(acompanhamento_residente: Acompanhamento_Residente[]) {
        return this.http.post<Acompanhamento_Residente[]>(`${SALV_API}/acompanhamento_residente`, acompanhamento_residente)

    }

    deleteFuncionarioAcompanhamento(idFuncionario: number, idAcomp: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/acompanhamento_funcionario/${idFuncionario}/${idAcomp}`)
    }

    deleteFuncionarioAllAcompanhamento(idAcomp: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/acompanhamento_funcionarioAll/${idAcomp}`)
    }

    deleteResidenteAllAcompanhamento(idAcomp: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/acompanhamento_residenteAll/${idAcomp}`)
    }

    deleteResidenteAcompanhamento(idResidente: number, idAcompanhamento: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/acompanhamento_residente/${idResidente}/${idAcompanhamento}`)
    }

    filtroDataInicial(dates): Observable<Acompanhamento[]> {
        return this.http.post<Acompanhamento[]>(`${SALV_API}/acompanhamento-data-inicial`, dates)
    }

    filtroDataInicialFinal(dates): Observable<Acompanhamento[]> {
        return this.http.post<Acompanhamento[]>(`${SALV_API}/acompanhamento-data-inicial-final`, dates)
    }

    reportAcompanhamentos(dates): Observable<Blob> {
        return this.http.post(`${SALV_API}/relatorio-acompanhamentos`, dates, { responseType: 'blob' })
    }

    reportAcompanhamento(cod_acomp): Observable<Blob> {
        return this.http.get(`${SALV_API}/relatorio-acompanhamento/${cod_acomp}`, { responseType: 'blob' })
    }

}
