import { Dependente } from './funcionario/infos-dependente/dependente.model';
import { SALV_API } from './../app.api';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import 'rxjs/add/observable/forkJoin'
import { Funcionario, Pessoa, Conta_Bancaria_Funcionario, Telefone, Telefone_Pessoa, Endereco, Endereco_Pessoa, FuncionarioQuery, Usuario} from './funcionario.model';
import { RequestOptions, ResponseContentType } from '@angular/http';


@Injectable()
export class FuncionariosService {
    codF
    constructor(private http: HttpClient) { }

    funcionarios(): Observable<Funcionario[]> {
        return this.http.get<Funcionario[]>(`${SALV_API}/funcionario`)
    }

    funcionariosInativos(): Observable<Funcionario[]> {
        return this.http.get<Funcionario[]>(`${SALV_API}/funcionarioInativo`)
    }


    funcionarioById(id: string): Observable<Funcionario> {
        return this.http.get<Funcionario>(`${SALV_API}/funcionario/${id}`)

    }

    dependenteById(id: string): Observable<Dependente[]> {
        return this.http.get<Dependente[]>(`${SALV_API}/dependente/${id}`)
    }

    telefoneById(id: string): Observable<Telefone[]> {
        return this.http.get<Telefone[]>(`${SALV_API}/telefone_pessoa/${id}`)
    }

    enderecoById(id: string): Observable<Endereco[]> {
        return this.http.get<Endereco[]>(`${SALV_API}/endereco_pessoa/${id}`)
    }

    deleteFuncionario(id: string): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/funcionario/${id}`)
    }

    ativarFuncionario(id: string): Observable<any> {
        return this.http.delete<any>(`${SALV_API}/funcionario-ativar/${id}`)
    }

    funcionarioQuery(id: string): Observable<FuncionarioQuery[]> {
        return this.http.get<FuncionarioQuery[]>(`${SALV_API}/funcionario-full/${id}`)
        
    }

   

    createNewEmployee(pessoa: Pessoa, telefone: Telefone, endereco: Endereco, funcionario: Funcionario ) {
       
        return this.http.post<Pessoa>(`${SALV_API}/pessoa`, pessoa).switchMap(resPessoa => {
            delete funcionario.PESSOA
            return this.http.post<Telefone>(`${SALV_API}/telefone`, telefone).switchMap(resTelefone => {
                delete funcionario.TELEFONE
                let _rel_tel_pes = {
                    PESSOA_CODIGO: resPessoa.CODIGO,
                    TELEFONE_CODIGO: resTelefone.CODIGO
                }
              

                        
                return this.http.post<Telefone_Pessoa>(`${SALV_API}/telefone_pessoa`, _rel_tel_pes).switchMap(resTP => {
                    return this.http.post<Endereco>(`${SALV_API}/endereco`, endereco).switchMap(resEndereco => {
                        delete funcionario.ENDERECO
                        let _rel_end_pes = {
                            PESSOA_CODIGO: resPessoa.CODIGO,
                            ENDERECO_CODIGO: resEndereco.CODIGO
                        }
                        
                        return this.http.post<Endereco_Pessoa>(`${SALV_API}/endereco_pessoa`, _rel_end_pes).switchMap(resEP => {
                            funcionario.PESSOA_CODIGO = resPessoa.CODIGO
                            this.codF = funcionario.PESSOA_CODIGO 
                            return this.http.post<Funcionario>(`${SALV_API}/funcionario`, funcionario)

                         
                        })

                    })


                    })
                })
                
                
            })
      
    }

    // updateEmployee(cod_pes: number, cod_tel: number, cod_end: number, cod_fun: number, pessoa: Pessoa, telefone: Telefone, endereco: Endereco, funcionario: Funcionario) {
    //     return this.http.put<Pessoa>(`${SALV_API}/pessoa/${cod_pes}`, pessoa).switchMap(resP => {
    //         delete funcionario.PESSOA
    //         return this.http.put<Telefone>(`${SALV_API}/telefone/${cod_tel}`, telefone).switchMap(resT => {
    //             delete funcionario.TELEFONE
    //             return this.http.put<Endereco>(`${SALV_API}/endereco/${cod_end}`, endereco).switchMap(resE => {
    //                 delete funcionario.ENDERECO
    //                 return this.http.put<Funcionario>(`${SALV_API}/funcionario/${cod_fun}`, funcionario)
    //             })
    //         })
    //     })
    // }

    editarFuncionario(cod_pes, cod_fun, pessoa: Pessoa, funcionario: Funcionario, conta: Conta_Bancaria_Funcionario) {
        delete funcionario.TELEFONE
        delete funcionario.ENDERECO
        delete funcionario.CONTA
        return this.http.put<Pessoa>(`${SALV_API}/pessoa/${cod_pes}`, pessoa).switchMap(() => {
            delete funcionario.PESSOA
            return this.http.put<Funcionario>(`${SALV_API}/funcionario/${cod_fun}`, funcionario).switchMap(()=>{
             delete funcionario.CONTA
             return this.http.put<Conta_Bancaria_Funcionario>(`${SALV_API}/conta-bancaria-funcionario/${cod_fun}`, conta)
            })
            
           
        })
    }

    novoTelefone(_cod_pes: number, telefone: Telefone) {
        return this.http.post<Telefone>(`${SALV_API}/telefone`, telefone).switchMap(resT => {
            let _rel_tel_pes = {
                PESSOA_CODIGO: _cod_pes,
                TELEFONE_CODIGO: resT.CODIGO
            }
            return this.http.post<Telefone_Pessoa>(`${SALV_API}/telefone_pessoa`, _rel_tel_pes)
        })
    }

    novaContaBancaria(_cod_fun: number, conta: Conta_Bancaria_Funcionario){
      conta.CODIGO_FUNCIONARIO = _cod_fun
      return this.http.post<any>(`${SALV_API}/conta-bancaria-funcionario`, conta)
        
    }

   


    novoEndereco(_cod_pes: number, endereco: Endereco) {
        return this.http.post<Endereco>(`${SALV_API}/endereco`, endereco).switchMap(resE => {
            let _rel_end_pes = {
                PESSOA_CODIGO: _cod_pes,
                ENDERECO_CODIGO: resE.CODIGO
            }
            return this.http.post<Endereco_Pessoa>(`${SALV_API}/endereco_pessoa`, _rel_end_pes)
        })
    }

    novoUsuario(_cod_fun: number, usuario: Usuario) {
        let _newUser = {
            CODIGO_FUNCIONARIO: _cod_fun,
            EMAIL: usuario.EMAIL,
            LOGIN: usuario.LOGIN,
            SENHA: usuario.SENHA
        }
        return this.http.post<Usuario>(`${SALV_API}/usuario`, _newUser)
    }

    novoDependente(_cod_fun: number, dependente: Dependente) {
        let _newDependente = {
            CODIGO_FUNCIONARIO: _cod_fun,
            NOME: dependente.NOME,
            SOBRENOME: dependente.SOBRENOME,
            DATA_NASCIMENTO: dependente.DATA_NASCIMENTO,
            RG: dependente.RG,
            CPF: dependente.CPF,
            NUMERO_CERTIDAO_NASCIMENTO: dependente.NUMERO_CERTIDAO_NASCIMENTO,
            FOLHA_CERTIDAO_NASCIMENTO: dependente.FOLHA_CERTIDAO_NASCIMENTO,
            LIVRO_CERTIDAO_NASCIMENTO: dependente.LIVRO_CERTIDAO_NASCIMENTO,
            CIDADE_CERTIDAO_NASCIMENTO: dependente.CIDADE_CERTIDAO_NASCIMENTO,
            ESTADO_CERTIDAO_NASCIMENTO: dependente.ESTADO_CERTIDAO_NASCIMENTO
        }
        return this.http.post<Dependente>(`${SALV_API}/dependente`, _newDependente)
    }

    deleteTelefone(_cod_pes: number, _cod_tel: number) {
        return this.http.delete<Telefone_Pessoa>(`${SALV_API}/telefone_pessoa/${_cod_pes}/${_cod_tel}`).switchMap(response => {
            return this.http.delete<Telefone>(`${SALV_API}/telefone/${_cod_tel}`)
        })
    }

    deleteEndereco(_cod_pes: number, _cod_end: number) {
        return this.http.delete<Endereco_Pessoa>(`${SALV_API}/endereco_pessoa/${_cod_pes}/${_cod_end}`).switchMap(response => {
            return this.http.delete<Endereco>(`${SALV_API}/endereco/${_cod_end}`)
        })
    }

    deleteDependente(_dep_nome: string, _dep_sobrenome: string) {
        return this.http.delete<Dependente>(`${SALV_API}/dependente/${_dep_nome}/${_dep_sobrenome}`)
    }

    telefoneId(id): Observable<Telefone> {
        return this.http.get<Telefone>(`${SALV_API}/telefone/${id}`)
    }

    updateTelefone(id, telefone: Telefone) {
        return this.http.put<Telefone>(`${SALV_API}/telefone/${id}`, telefone)
    }

    updateContaBancaria(id, conta: Conta_Bancaria_Funcionario){
        return this.http.put<Conta_Bancaria_Funcionario>(`${SALV_API}/conta-bancaria-funcionario/${id}`, conta)
    }

    enderecoId(id): Observable<Endereco> {
        return this.http.get<Endereco>(`${SALV_API}/endereco/${id}`)
    }

    updateEndereco(id, endereco: Endereco) {
        return this.http.put<Endereco>(`${SALV_API}/endereco/${id}`, endereco)
    }

    usuarioId(id): Observable<Usuario> {
        return this.http.get<Usuario>(`${SALV_API}/usuario/${id}`)
    }

    updateUsuario(id, usuario: Usuario) {
        return this.http.put<Usuario>(`${SALV_API}/usuario/${id}`, usuario)
    }

    dependenteId(id, nome, sobrenome): Observable<Dependente> {
        return this.http.get<Dependente>(`${SALV_API}/dependente/${id}/${nome}/${sobrenome}`)
    }

    updateDependente(id, nome, sobrenome, dependente: Dependente) {
        return this.http.put<Dependente>(`${SALV_API}/dependente/${id}/${nome}/${sobrenome}`, dependente)
    }

    reportFuncionarios(status): Observable<Blob> {
        return this.http.get(`${SALV_API}/relatorio-funcionarios/${status}`, { responseType: 'blob' })
    }

    reportFuncionario(cod_pes, cod_func): Observable<Blob> {
        return this.http.get(`${SALV_API}/relatorio-funcionario/${cod_pes}/${cod_func}`, { responseType: 'blob' })
    }
}