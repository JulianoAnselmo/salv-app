import { SALV_API } from './../app.api';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Residente, Pessoa, Residente_Convenio, Certidao_Casamento } from './residente/residente.model';
import { Familiar, Endereco, Telefone } from './residente/infos-familiar/familiar.model';
import { Convenio } from './residente/infos-convenio/convenio.model';
import { Beneficio } from './residente/infos-beneficios/beneficio.model';

@Injectable()
export class ResidentesService {

    residente: Residente
    pessoa: Pessoa
    familiar: Familiar
    endereco: Endereco
    telefones: Telefone
    residenteConvenio: Residente_Convenio
    codigoResidente

    constructor(private http: HttpClient) { }

    clearDataResidente() {
        this.residente = null
        this.pessoa = null
        this.familiar = null
        this.endereco = null
        this.telefones = null
        this.residenteConvenio = null
    }

    residentes(): Observable<Residente[]> {
        return this.http.get<Residente[]>(`${SALV_API}/residente`)
    }

    residentesInativos(): Observable<Residente[]> {
        return this.http.get<Residente[]>(`${SALV_API}/residente-inativos`)
    }

    residenteById(id: string): Observable<Residente> {
        return this.http.get<Residente>(`${SALV_API}/residente/${id}`)
    }

    familiarById(id: string): Observable<Familiar[]> {
        return this.http.get<Familiar[]>(`${SALV_API}/residente_familiar/${id}`)
    } // remover

    telefoneFamiliarByID(id: number): Observable<Telefone[]> {
        return this.http.get<Telefone[]>(`${SALV_API}/telefone_familiar/${id}`)
    }

    convenioById(id: string): Observable<Convenio[]> {
        return this.http.get<Convenio[]>(`${SALV_API}/residente_convenio/${id}`)
    } // remover

    beneficiosById(id: number): Observable<Beneficio[]> {
        return this.http.get<Beneficio[]>(`${SALV_API}/beneficio/${id}`)
    }

    beneficiosByIdName(id: number, nome: string): Observable<Beneficio> {
        return this.http.get<Beneficio>(`${SALV_API}/beneficio/${id}/${nome}`)
    }

    convenioOneByID(id: number): Observable<Residente_Convenio> {
        return this.http.get<Residente_Convenio>(`${SALV_API}/residente_convenio/one/${id}`)
    }

    familiarByID(id: number): Observable<Familiar> {
        return this.http.get<Familiar>(`${SALV_API}/familiar/${id}`)
    }

    telefoneById(id: number): Observable<Telefone> {
        return this.http.get<Telefone>(`${SALV_API}/telefone/${id}`)
    }

    enderecoByID(id: number): Observable<Endereco> {
        return this.http.get<Endereco>(`${SALV_API}/endereco/${id}`)
    }

    deleteTelefoneFamiliar(idTelefone: number, idFamiliar: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/telefone_familiar/${idTelefone}/${idFamiliar}`)
    }

    deleteFamiliar(idResidente: number, idFamiliar: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/residente_familiar/${idResidente}/${idFamiliar}`)
    }

    deleteResidenteConvenio(numeroConvenio: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/residente_convenio/${numeroConvenio}`)
    }

    deleteResidente(id: number, residente_delete): Observable<any> {
        return this.http.post<any>(`${SALV_API}/residente-inativar/${id}`, residente_delete)
    }

    ativarResidente(id: string): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/residente-ativar/${id}`)
    }

    deleteBeneficio(nome: string, id: number): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/beneficio/${id}/${nome}`)
    }

    convenios(): Observable<Residente_Convenio[]> {
        return this.http.get<Residente_Convenio[]>(`${SALV_API}/convenio`)
    }

    createNewResidente(residente: Residente) {
        return this.http.post<Pessoa>(`${SALV_API}/pessoa`, residente.PESSOA).switchMap(resPessoa => {
            residente.PESSOA_CODIGO = resPessoa.CODIGO

            if (residente.PESSOA.ESTADO_CIVIL == 'S' || residente.PESSOA.ESTADO_CIVIL == null) {
                delete residente.PESSOA
                delete residente.CERTIDAO_CASAMENTO
                return this.http.post<Residente>(`${SALV_API}/residente`, residente)
            } else {
                return this.http.post<Residente>(`${SALV_API}/residente`, residente).switchMap(resResidente => {
                    delete residente.PESSOA
                    residente.CERTIDAO_CASAMENTO.CODIGO_RESIDENTE = resResidente.CODIGO_RESIDENTE
                    return this.http.post<Certidao_Casamento>(`${SALV_API}/certidao_casamento`, residente.CERTIDAO_CASAMENTO)
                })
            }
        })
    }

    updateResidente(dataForm: Residente, idResidente, idPessoa) {
        return this.http.put<Pessoa>(`${SALV_API}/pessoa/${idPessoa}`, dataForm.PESSOA).switchMap(res => {
            if (dataForm.PESSOA.ESTADO_CIVIL == 'S' || dataForm.PESSOA.ESTADO_CIVIL == null && dataForm.PESSOA.ESTADO_CIVIL != undefined) {
                delete dataForm.PESSOA
                delete dataForm.CERTIDAO_CASAMENTO
                return this.http.put<Residente>(`${SALV_API}/residente/${idResidente}`, dataForm)
            } else {
                return this.http.put<Residente>(`${SALV_API}/residente/${idResidente}`, dataForm).switchMap(resResidente => {
                    delete dataForm.PESSOA
                    return this.http.put<Certidao_Casamento>(`${SALV_API}/certidao_casamento/${idResidente}`, dataForm.CERTIDAO_CASAMENTO)
                })
            }
        })
    }

    createNewFamiliar(familiar: Familiar, codigoResidente) {
        return this.http.post<Familiar>(`${SALV_API}/familiar`, familiar).switchMap(resFamiliar => {
            let RESIDENTE_FAMILIAR = {
                FAMILIAR_CODIGO: resFamiliar.CODIGO,
                RESIDENTE_CODIGO: codigoResidente
            }
            return this.http.post<any>(`${SALV_API}/residente_familiar`, RESIDENTE_FAMILIAR).switchMap(resResidenteFamiliar => {
                return this.http.post<Endereco>(`${SALV_API}/endereco`, familiar.ENDERECOS).switchMap(resEndereco => {
                    let ENDERECO_FAMILIAR = {
                        FAMILIAR_CODIGO: resFamiliar.CODIGO,
                        ENDERECO_CODIGO: resEndereco.CODIGO
                    }
                    return this.http.post<any>(`${SALV_API}/endereco_familiar`, ENDERECO_FAMILIAR).switchMap(resEnderecoFamiliar => {
                        return this.http.post<any>(`${SALV_API}/telefone`, familiar.TELEFONE).switchMap(resTelefone => {
                            let TELEFONES_FAMILIARES = {
                                FAMILIAR_CODIGO: resFamiliar.CODIGO,
                                TELEFONE_CODIGO: resTelefone.CODIGO
                            }
                            return this.http.post<any>(`${SALV_API}/telefone_familiar`, TELEFONES_FAMILIARES)
                        })
                    })
                })
            })
        })
    }

    updateFamiliar(dataForm: Familiar, CODIGO_FAMILIAR, ENDERECO_CODIGO) {
        return this.http.put<Endereco>(`${SALV_API}/endereco/${ENDERECO_CODIGO}`, dataForm.ENDERECOS).switchMap(res => {
            delete dataForm.ENDERECOS
            delete dataForm.TELEFONE
            return this.http.put<Familiar>(`${SALV_API}/familiar/${CODIGO_FAMILIAR}`, dataForm)
        })
    }

    createNewConvenio(residenteConvenio: Residente_Convenio, codigoResidente) {
        residenteConvenio.RESIDENTE_CODIGO = codigoResidente
        return this.http.post<any>(`${SALV_API}/residente_convenio`, residenteConvenio)
    }

    updateConvenio(convenio_codigo: any, residenteConvenio: Residente_Convenio) {
        return this.http.put<Residente_Convenio>(`${SALV_API}/residente_convenio/${convenio_codigo}`, residenteConvenio)
    }

    createNewTelefoneFamiliar(telefone: Telefone, CODIGO_FAMILIAR) {
        return this.http.post<any>(`${SALV_API}/telefone`, telefone).switchMap(resTelefone => {
            let TELEFONES_FAMILIARES = {
                FAMILIAR_CODIGO: CODIGO_FAMILIAR,
                TELEFONE_CODIGO: resTelefone.CODIGO
            }
            return this.http.post<any>(`${SALV_API}/telefone_familiar`, TELEFONES_FAMILIARES)
        })
    }

    updateTelefone(telefone: Telefone, codigoTelefone) {
        return this.http.put<Telefone>(`${SALV_API}/telefone/${codigoTelefone}`, telefone)
    }

    createNewBeneficio(beneficio: Beneficio, codigoResidente) {
        beneficio.CODIGO_RESIDENTE = codigoResidente
        return this.http.post<any>(`${SALV_API}/beneficio`, beneficio)
    }

    updateBeneficio(beneficio: Beneficio, NOME_BENEFICIO, CODIGO_RESIDENTE) {
        return this.http.put<any>(`${SALV_API}/beneficio/${CODIGO_RESIDENTE}/${NOME_BENEFICIO}`, beneficio)
    }

    reportResidentes(status): Observable<Blob> {
        return this.http.get(`${SALV_API}/relatorio-residentes/${status}`, { responseType: 'blob' })
    }

    reportResidente(cod_pes, cod_res): Observable<Blob> {
        return this.http.get(`${SALV_API}/relatorio-residente/${cod_pes}/${cod_res}`, { responseType: 'blob' })
    }

}
