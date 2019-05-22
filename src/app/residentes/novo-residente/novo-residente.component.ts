import { Residente, Pessoa } from './../residente/residente.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, AsyncValidatorFn } from '@angular/forms';

import { ResidentesService } from '../residentes.service';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Route, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidatorService } from 'src/app/shared/validators/validator.service';
import { UniqueValuesValidators } from 'src/app/shared/validators/unique-values/unique-values.component';
import { DialogConfirmService } from '../dialog-confirm.service';

@Component({
  selector: 'salv-novo-residente',
  templateUrl: './novo-residente.component.html',
  animations: [
    trigger('novo-residenteAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})
export class NovoResidenteComponent implements OnInit {

  novoresidenteState = 'ready'

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

  situacoesInss = [
    { value: "BPC", option: "Benefício de Prestação Continuada" },
    { value: "AIV", option: "Aposentadoria por Invalidez" },
    { value: "AID", option: "Aposentadoria por Idade" },
    { value: "NEC", option: "Não especificado" }
  ]

  novoResidenteForm: FormGroup;
  pessoa: Pessoa
  residente: Residente

  public verificaEstadoCivil$: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private residentesService: ResidentesService,
    private router: Router,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService,
    private uniqueValidators: UniqueValuesValidators,
    private dialogConfirmService: DialogConfirmService
  ) { }

  markAllDirty(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      control.markAsDirty() // mark group
      let ctrl = <any>control;
      for (let inner in ctrl.controls) {
        this.markAllDirty(ctrl.controls[inner] as AbstractControl);
      }
    }
    else {
      (<FormControl>(control)).markAsDirty();
    }
  }

  ngOnInit() {

    this.spinner.show()
    this.pessoa = this.residentesService.pessoa
    this.residente = this.residentesService.residente

    this.novoResidenteForm = this.formBuilder.group({
      // INFORMAÇÕES PESSOAIS INICIO
      PESSOA: this.formBuilder.group({
        NOME: this.formBuilder.control(null, [Validators.required]),
        SOBRENOME: this.formBuilder.control(null, [Validators.required]),
        CPF: this.formBuilder.control(null, [Validators.minLength(11)], this.uniqueValidators.validatePessoaCpf(null)),
        RG: this.formBuilder.control(null, [Validators.minLength(9)], this.uniqueValidators.validatePessoaRG(null)),
        ESTADO_CIVIL: this.formBuilder.control(null, []),
        SEXO: this.formBuilder.control(null, []),
        RELIGIAO: this.formBuilder.control(null, []),
        ESCOLARIDADE: this.formBuilder.control(null, []),
        DATA_NASCIMENTO: this.formBuilder.control(null, []),

      }),
      // INFORMAÇÕES PESSOAIS FINAL
      APELIDO: this.formBuilder.control(null, []),
      PROFISSAO: this.formBuilder.control(null, []),
      // CERTIDAO NASCIMENTO INICIO
      NUMERO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteNumeroCertidao(null)),
      FOLHA_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      LIVRO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      CIDADE_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      ESTADO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      //CERTIDAO NASCIMENTO FINAL

      //ELEITORAL INICIO
      TITULO_ELEITOR: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteTituloEleitor(null)),
      ZONA_ELEITORAL: this.formBuilder.control(null, []),
      SECAO_ELEITORAL: this.formBuilder.control(null, []),
      //ELEITORAL FINAL

      //INSS INICIO
      NUMERO_INSS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteNumeroInss(null)),
      BANCO_INSS: this.formBuilder.control(null, []),
      AGENCIA_INSS: this.formBuilder.control(null, []),
      CONTA_INSS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteContaINSS(null)),
      SITUACAO_INSS: this.formBuilder.control(null, []),
      VALOR_INSS: this.formBuilder.control(null, []),
      PROVA_VIDA_INSS: this.formBuilder.control(null, []),
      //INSS FINAL

      //OUTROS INICIO
      CARTAO_SAMS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteCartaoSAMS(null)),
      CARTAO_SUS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteCartaoSUS(null)),
      DATA_ACOLHIMENTO: this.formBuilder.control(null, [Validators.required]),
      //OUTROS FINAL

      // CERTIDOA CASAMENTO INICIO
      CERTIDAO_CASAMENTO: this.formBuilder.group({
        FOLHA: this.formBuilder.control(null, []),
        LIVRO: this.formBuilder.control(null, []),
        REGISTRO: this.formBuilder.control(null, []),
        CIDADE: this.formBuilder.control(null, []),
        ESTADO: this.formBuilder.control(null, []),
        CONJUGE: this.formBuilder.control(null, []),
      })
    })

    if (this.pessoa != undefined)
      this.novoResidenteForm.controls['PESSOA'].setValue(this.pessoa)
    this.spinner.hide()
    if (this.residente != undefined)
      this.novoResidenteForm.patchValue(this.residente)
  }

  verificaEstadoCivil() {
    if (this.novoResidenteForm.get('PESSOA.ESTADO_CIVIL').value == 'S' ||
      this.novoResidenteForm.get('PESSOA.ESTADO_CIVIL').value == null)
      return true
    else
      return false
  }

  novoResidente(residente: Residente) {
    this.residentesService.createNewResidente(residente)
      .subscribe(res => {
        if (res['errors']) {
          res['errors'].forEach(error => {
            console.log('Houve um erro!', error)
            this.notificationService.notify(`Houve um erro! ${error.message}`)
          })
        } else {
          this.dialogConfirmService.confirm(`Deseja cadastrar um familiar para o residente?`)
            .then((isTrue) => {
              if (isTrue) {
                this.residentesService.codigoResidente = res.CODIGO_RESIDENTE
                this.router.navigate(['/residentes/familiar-residente'])
              } else {
                this.dialogConfirmService.confirm(`Deseja cadastrar um convênio para o residente?`)
                  .then((isTrue) => {
                    if (isTrue) {
                      this.residentesService.codigoResidente = res.CODIGO_RESIDENTE
                      this.router.navigate(['/residentes/convenio-residente'])
                    }
                  })
              }
            })
          this.notificationService.notify(`Residente inserido com sucesso!`)
          this.router.navigate([`/residentes/${res.CODIGO_RESIDENTE}`])
        }
      })
  }



}
