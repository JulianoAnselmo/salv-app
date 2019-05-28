import { Pessoa } from './../../residentes/residente/residente.model';
import { Component, OnInit, EventEmitter, Input} from '@angular/core';
import { Funcionario, Conta_Bancaria_Funcionario } from './../funcionario.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { FuncionariosService } from './../funcionarios.service'
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { UniqueValuesValidators } from 'src/app/shared/validators/unique-values/unique-values.component';

@Component({
  selector: 'salv-novo-funcionario',
  templateUrl: './novo-funcionario.component.html',
  animations: [
    trigger('novo-funcionarioAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})
export class NovoFuncionarioComponent implements OnInit {
  @Input() funcionario: Funcionario

  novoFuncionarioState = 'ready'
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

  novoFuncionarioForm: FormGroup
  
  conta: Conta_Bancaria_Funcionario
  codigoF 
  

  constructor(private fb: FormBuilder, private fs: FuncionariosService, private router: Router, private ns: NotificationService, private uniqueValidators: UniqueValuesValidators) { }

  ngOnInit() {

   

    this.novoFuncionarioForm = this.fb.group({
      //PESSOA
      PESSOA: this.fb.group({
        NOME: this.fb.control(null, [Validators.required]),
        SOBRENOME: this.fb.control(null, [Validators.required]),
        CPF: this.fb.control(null, [Validators.required, Validators.minLength(11)], this.uniqueValidators.validatePessoaCpf(null)),
        RG: this.fb.control(null, [Validators.required, Validators.minLength(9)], this.uniqueValidators.validatePessoaRG(null)),
        ESTADO_CIVIL: this.fb.control(null, [Validators.required]),
        SEXO: this.fb.control(null, [Validators.required]),
        RELIGIAO: this.fb.control(null, [Validators.required]),
        ESCOLARIDADE: this.fb.control(null, [Validators.required]),
        DATA_NASCIMENTO: this.fb.control(null, [Validators.required]),
      }),
      TELEFONE: this.fb.group({
        DDD: this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
        NUMERO: this.fb.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)])
      }),

      CONTA: this.fb.group({

        BANCO: this.fb.control(null, [Validators.required]),
        AGENCIA: this.fb.control(null, [Validators.required]),
        CONTA: this.fb.control(null, [Validators.required])

      }),
     
      ENDERECO: this.fb.group({
        ENDERECO: this.fb.control(null, [Validators.required]),
        NUMERO: this.fb.control(null, [Validators.required]),
        BAIRRO: this.fb.control(null, [Validators.required]),
        COMPLEMENTO: this.fb.control(null),
        CIDADE: this.fb.control(null, [Validators.required]),
        ESTADO: this.fb.control(null, [Validators.required]),
        CEP: this.fb.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
        REFERENCIA: this.fb.control(null),
      }),
      CARGO: this.fb.control(null, [Validators.required]),
      DATA_ADMISSAO: this.fb.control(null, [Validators.required])
    })
  }
  

  novoFuncionario(funcionario: Funcionario) {
    this.fs.createNewEmployee(funcionario.PESSOA, funcionario.TELEFONE, funcionario.ENDERECO, funcionario)
      .subscribe(res => {
        
        if (res['errors']) {
          res['errors'].forEach(error => {
            console.log('Houve um erro!', error)
            this.ns.notify(`Houve um erro! ${error.message}`)
          })
        } else {
          this.fs.novaContaBancaria(res.CODIGO_FUNCIONARIO, this.novoFuncionarioForm.value.CONTA).subscribe(res =>{
          })
            this.router.navigate([`/funcionarios`])
            this.ns.notify(`Funcionário inserido com sucesso!`)          
        }
      })
  }
 
 /* novaContaBancariaFuncionario(conta){
     this.fs.novaContaBancaria(this.funcionario.CODIGO_FUNCIONARIO, this.novoFuncionarioForm.value.CONTA).subscribe(res =>{
      console.log("dados conta", conta)
      if (res['errors']) {
        res['errors'].forEach(error => {

          console.log('Houve um erro!', error)
          this.ns.notify(`Houve um erro! ${error.message}`)
        })
      } else {
              this.ns.notify(`Funcionário inserido com sucesso!`)
      }

    })
  }
  */
}
