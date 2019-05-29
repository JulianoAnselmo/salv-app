import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funcionario, Telefone, Endereco, Usuario, Conta_Bancaria_Funcionario } from './../../funcionario.model';
import { Component, OnInit, Input } from '@angular/core';
import { FuncionariosService } from '../../funcionarios.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogConfirmService } from 'src/app/residentes/dialog-confirm.service';
import { ActivatedRoute } from '@angular/router';
import { UniqueValuesValidators } from 'src/app/shared/validators/unique-values/unique-values.component';
@Component({
    selector: 'salv-infos-funcionario',
    templateUrl: './infos-funcionario.component.html'
})
export class InfosFuncionarioComponent implements OnInit {
    
    @Input() funcionario: Funcionario
    @Input() telefones: Telefone[] = []
    @Input() enderecos: Endereco[]
   
    novoTelefoneForm: FormGroup
    // novoEnderecoForm: FormGroup
    novoUsuarioForm: FormGroup
    updateTelefoneForm: FormGroup
    updateEnderecoForm: FormGroup
    updateUsuarioForm: FormGroup
    updateFuncionarioForm: FormGroup
    formContaBancaria: FormGroup
    codigoTelefone: number
    codigoEndereco: number

    estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
    estadosCivil = [
        { value: "S", option: "Solteiro" },
        { value: "C", option: "Casado" },
        { value: "D", option: "Divorciado" },
        { value: "V", option: "Viúvo" }
    ];
    sexos = [
        { value: "M", option: "Masculino" },
        { value: "F", option: "Feminino" }
    ];
    religioes = [
        { value: "CAT", option: "Católico" },
        { value: "EVG", option: "Evangélico" },
        { value: "ESP", option: "Espírita" },
        { value: "UBC", option: "Umbanda e Candomblé" },
        { value: "OUT", option: "Outras religiões" },
        { value: "SRG", option: "Sem Religião" },
        { value: "NEC", option: "Não Especificado" },
    ];
    escolaridades = [
        { value: "FI", option: "Fundamental Incompleto" },
        { value: "FC", option: "Fundamental Completo" },
        { value: "MI", option: "Médio Incompleto" },
        { value: "MC", option: "Médio Completo" },
        { value: "SI", option: "Superior Incompleto" },
        { value: "SC", option: "Superior Completo" },
        { value: "NE", option: "Não Especificado" },
    ];

    constructor(private fs: FuncionariosService, private fb: FormBuilder, private ns: NotificationService, private dcs: DialogConfirmService, private route: ActivatedRoute, private uniqueValidators: UniqueValuesValidators) { }

    ngOnInit(): void {

        

        this.novoTelefoneForm = this.fb.group({
            DDD: this.fb.control(null, []),
            NUMERO: this.fb.control(null, [])
        })
        // this.novoEnderecoForm = this.fb.group({
        //     ENDERECO: this.fb.control(null, []),
        //     NUMERO: this.fb.control(null, []),
        //     BAIRRO: this.fb.control(null, []),
        //     COMPLEMENTO: this.fb.control(null, []),
        //     CIDADE: this.fb.control(null, []),
        //     ESTADO: this.fb.control('Selecione', []),
        //     CEP: this.fb.control(null, []),
        //     REFERENCIA: this.fb.control(null, []),
        // })
        this.novoUsuarioForm = this.fb.group({
            EMAIL: this.fb.control(null, [Validators.required], this.uniqueValidators.validateUsuarioEmail(null)),
            LOGIN: this.fb.control(null, [Validators.required], this.uniqueValidators.validateUsuarioLogin(null)),
            SENHA: this.fb.control(null, [Validators.required])
        })
        this.updateTelefoneForm = this.fb.group({
            DDD: this.fb.control(null, []),
            NUMERO: this.fb.control(null, [])
        })
        this.updateEnderecoForm = this.fb.group({
            ENDERECO: this.fb.control(null, [Validators.required]),
            NUMERO: this.fb.control(null, [Validators.required]),
            BAIRRO: this.fb.control(null, [Validators.required]),
            COMPLEMENTO: this.fb.control(null, []),
            CIDADE: this.fb.control(null, [Validators.required]),
            ESTADO: this.fb.control(null, [Validators.required]),
            CEP: this.fb.control(null, [Validators.required]),
            REFERENCIA: this.fb.control(null, [])
        })
        this.updateUsuarioForm = this.fb.group({
            EMAIL: this.fb.control(null, [Validators.required], this.uniqueValidators.validateUsuarioEmail(this.route.snapshot.params['id'])),
            LOGIN: this.fb.control(null, [Validators.required], this.uniqueValidators.validateUsuarioLogin(this.route.snapshot.params['id']))
        })
        this.updateFuncionarioForm = this.fb.group({
            //PESSOA
            PESSOA: this.fb.group({
                NOME: this.fb.control(null, [Validators.required]),
                SOBRENOME: this.fb.control(null, [Validators.required]),
                CPF: this.fb.control(null, [Validators.required, Validators.minLength(11)], this.uniqueValidators.validatePessoaCpf(this.route.snapshot.params['id'])),
                RG: this.fb.control(null, [Validators.required, Validators.minLength(9)], this.uniqueValidators.validatePessoaRG(this.route.snapshot.params['id'])),
                ESTADO_CIVIL: this.fb.control(null, []),
                SEXO: this.fb.control(null, [Validators.required]),
                RELIGIAO: this.fb.control(null, []),
                ESCOLARIDADE: this.fb.control(null, []),
                DATA_NASCIMENTO: this.fb.control(null, []),
                
            }),
           
            CONTA: this.fb.control(null, [Validators.required]),
            BANCO: this.fb.control(null, [Validators.required]),
            AGENCIA: this.fb.control(null, [Validators.required]),
        
            CARGO: this.fb.control(null, [Validators.required]),
            DATA_ADMISSAO: this.fb.control(null, [Validators.required]),
           
        })

        

    }

    novoTelefone(telefone: Telefone) {
        this.fs.novoTelefone(this.funcionario.PESSOA_CODIGO, telefone).subscribe((res) => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!', error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.fs.telefoneById(this.funcionario.PESSOA_CODIGO.toString()).subscribe(res => {
                    this.telefones = res
                    this.novoTelefoneForm.reset()
                    this.ns.notify('Telefone inserido com sucesso!')
                })
            }
        })
    }

    // novoEndereco(endereco: Endereco) {
    //     this.fs.novoEndereco(this.funcionario.PESSOA_CODIGO, endereco).subscribe(res => {
    //         if (res['errors']) {
    //             res['errors'].forEach(error => {
    //                 console.log('Houve um erro!', error)
    //                 this.ns.notify(`Houve um erro! ${error.message}`)
    //             })
    //         } else {
    //             this.fs.enderecoById(this.funcionario.PESSOA_CODIGO.toString()).subscribe(res => {
    //                 this.enderecos = res
    //                 this.novoEnderecoForm.reset()
    //                 this.ns.notify('Endereço inserido com sucesso!')
    //             })
    //         }
    //     })
    // }

    novoUsuario(usuario: Usuario) {
        this.fs.novoUsuario(this.funcionario.CODIGO_FUNCIONARIO, usuario).subscribe(res => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!', error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.funcionario.USUARIO = res
                this.novoUsuarioForm.reset()
                this.ns.notify('Usuário inserido com sucesso!')
            }
        })
    }

    haveLogin() {
        if (this.funcionario.USUARIO) {
            return true
        } else {
            return false
        }
    }

    deleteTelefone(_cod_pes: number, _cod_tel: number): void {
        this.dcs.confirm(`Deseja excluir o telefone?`).then((isTrue) => {
            if (isTrue) {
                this.fs.deleteTelefone(_cod_pes, _cod_tel).subscribe(() => {
                    this.fs.telefoneById(this.funcionario.PESSOA.CODIGO.toString()).subscribe(response => {
                        this.telefones = response
                        this.ns.notify('Telefone excluído com sucesso!')
                    })
                })
            }
        })
    }

    // deleteEndereco(_cod_pes: number, _cod_end: number): void {
    //     this.dcs.confirm(`Deseja exluir o endereço?`).then((isTrue) => {
    //         if (isTrue) {
    //             this.fs.deleteEndereco(_cod_pes, _cod_end).subscribe(() => {
    //                 this.fs.enderecoById(this.funcionario.PESSOA.CODIGO.toString()).subscribe(response => {
    //                     this.enderecos = response
    //                     this.ns.notify('Endereço excluído com sucesso!')
    //                 })
    //             })
    //         }
    //     })
    // }

    buscaTelefone(codTelefone) {
        this.fs.telefoneId(codTelefone).subscribe(telefone => {
            this.codigoTelefone = telefone.CODIGO
            this.updateTelefoneForm.patchValue({
                DDD: telefone.DDD,
                NUMERO: telefone.NUMERO
            })
        })
    }

    updateTelefone(telefoneAtualizado) {
        this.fs.updateTelefone(this.codigoTelefone, telefoneAtualizado).subscribe(res => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!', error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.fs.telefoneById(this.funcionario.PESSOA_CODIGO.toString()).subscribe(response => {
                    this.telefones = response
                    this.updateTelefoneForm.reset()
                    this.ns.notify('Telefone atualizado com sucesso!')
                })
            }
        })
    }

    

    buscaEndereco(codEndereco) {
        this.fs.enderecoId(codEndereco).subscribe(endereco => {
            this.codigoEndereco = endereco.CODIGO
            this.updateEnderecoForm.patchValue({
                ENDERECO: endereco.ENDERECO,
                NUMERO: endereco.NUMERO,
                BAIRRO: endereco.BAIRRO,
                COMPLEMENTO: endereco.COMPLEMENTO,
                CIDADE: endereco.CIDADE,
                ESTADO: endereco.ESTADO,
                CEP: endereco.CEP,
                REFERENCIA: endereco.REFERENCIA
            })
        })
    }

    updateEndereco(enderecoAtualizado) {
        this.fs.updateEndereco(this.codigoEndereco, enderecoAtualizado).subscribe(res => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!', error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.fs.enderecoById(this.funcionario.PESSOA_CODIGO.toString()).subscribe(response => {
                    this.enderecos = response
                    this.updateEnderecoForm.reset()
                    this.ns.notify('Endereço atualizado com sucesso!')
                })
            }
        })
    }

    buscaUsuario() {
        this.fs.usuarioId(this.funcionario.CODIGO_FUNCIONARIO.toString()).subscribe(usuario => {
            this.updateUsuarioForm.patchValue({
                EMAIL: usuario[0].EMAIL,
                LOGIN: usuario[0].LOGIN
            })
        })
    }

    
  
    
  

    updateUsuario(usuarioAtualizado) {
        this.fs.updateUsuario(this.funcionario.CODIGO_FUNCIONARIO.toString(), usuarioAtualizado).subscribe(res => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!', error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.fs.usuarioId(this.funcionario.CODIGO_FUNCIONARIO.toString()).subscribe(response => {
                    this.funcionario.USUARIO = response[0]
                    this.updateUsuarioForm.reset()
                    this.ns.notify('Usuário atualizado com sucesso')
                })
            }
            
        })
    }

    buscaFuncionario() {
        this.fs.funcionarioQuery(this.funcionario.CODIGO_FUNCIONARIO.toString()).subscribe(funcionario => {
            this.updateFuncionarioForm.patchValue({
                PESSOA: {
                    COD_PES: funcionario[0].COD_PES,
                    NOME: funcionario[0].NOME,
                    SOBRENOME: funcionario[0].SOBRENOME,
                    RG: funcionario[0].RG,
                    CPF: funcionario[0].CPF,
                    SEXO: funcionario[0].SEXO,
                    ESTADO_CIVIL: funcionario[0].ESTADO_CIVIL,
                    DATA_NASCIMENTO: funcionario[0].DATA_NASCIMENTO,
                    RELIGIAO: funcionario[0].RELIGIAO,
                    ESCOLARIDADE: funcionario[0].ESCOLARIDADE,
                },
                
                CONTA: funcionario[0].CONTA,
                BANCO: funcionario[0].BANCO,
                AGENCIA: funcionario[0].AGENCIA,           
                CARGO: funcionario[0].CARGO,
                DATA_ADMISSAO: funcionario[0].DATA_ADMISSAO
            })
            console.log(funcionario)
        })
    }

    updateFuncionario(funcionarioAtualizado) {
        this.fs.editarFuncionario(this.funcionario.PESSOA_CODIGO.toString(), this.funcionario.CODIGO_FUNCIONARIO.toString(), funcionarioAtualizado.PESSOA, funcionarioAtualizado, funcionarioAtualizado.CONTA.toString()).subscribe(res => {
            if (res['errors']) {
                res['errors'].forEach(error => {
                    console.log('Houve um erro!' + error)
                    this.ns.notify(`Houve um erro! ${error.message}`)
                })
            } else {
                this.fs.funcionarioById(this.route.snapshot.params['id']).subscribe(response => {
                    this.funcionario = response
                    console.log(response)
                    this.updateFuncionarioForm.reset()
                    this.ns.notify('Funcionário atualizado com sucesso!')
                })
            }
        })
    }

   
}
