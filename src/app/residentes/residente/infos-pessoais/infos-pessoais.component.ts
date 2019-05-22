import { Component, OnInit, Input } from '@angular/core';
import { Residente, Certidao_Casamento } from '../residente.model';
import { ResidentesService } from '../../residentes.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pessoa } from 'src/app/funcionarios/funcionario.model';
import { UniqueValuesValidators } from 'src/app/shared/validators/unique-values/unique-values.component';

@Component({
  selector: 'salv-infos-pessoais',
  templateUrl: './infos-pessoais.component.html'
})
export class InfosPessoaisComponent implements OnInit {

  @Input() residente: Residente

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
    { value: "AID", option: "Aposentadoria por Idade" }
  ]

  novoResidenteForm: FormGroup;
  pessoa: Pessoa
  CERTIDAO_NASCIMENTO: Certidao_Casamento
  PESSOA_CODIGO: Number

  constructor(
    private formBuilder: FormBuilder,
    private residentesService: ResidentesService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private uniqueValidators: UniqueValuesValidators
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
    if ((this.residentesService.residente == undefined) && (this.residentesService.pessoa == undefined))
      this.residentesService.residenteById(this.route.snapshot.params['id'])
        .subscribe(res => {
          this.residentesService.residente = res
          this.residentesService.pessoa = res.PESSOA
          this.PESSOA_CODIGO = res.PESSOA_CODIGO
        })

    this.novoResidenteForm = this.formBuilder.group({
      // INFORMAÇÕES PESSOAIS INICIO
      PESSOA: this.formBuilder.group({
        NOME: this.formBuilder.control(null, [Validators.required]),
        SOBRENOME: this.formBuilder.control(null, [Validators.required]),
        CPF: this.formBuilder.control(null, [Validators.minLength(11)], this.uniqueValidators.validatePessoaCpf(this.PESSOA_CODIGO)),
        RG: this.formBuilder.control(null, [Validators.minLength(9)], this.uniqueValidators.validatePessoaRG(this.PESSOA_CODIGO)),
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
      NUMERO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteNumeroCertidao(this.PESSOA_CODIGO)),
      FOLHA_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      LIVRO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      CIDADE_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      ESTADO_CERTIDAO_NASCIMENTO: this.formBuilder.control(null, []),
      //CERTIDAO NASCIMENTO FINAL

      //ELEITORAL INICIO
      TITULO_ELEITOR: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteTituloEleitor(this.PESSOA_CODIGO)),
      ZONA_ELEITORAL: this.formBuilder.control(null, []),
      SECAO_ELEITORAL: this.formBuilder.control(null, []),
      //ELEITORAL FINAL

      //INSS INICIO
      NUMERO_INSS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteNumeroInss(this.PESSOA_CODIGO)),
      BANCO_INSS: this.formBuilder.control(null, []),
      AGENCIA_INSS: this.formBuilder.control(null, []),
      CONTA_INSS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteContaINSS(this.PESSOA_CODIGO)),
      SITUACAO_INSS: this.formBuilder.control(null, []),
      VALOR_INSS: this.formBuilder.control(null, []),
      PROVA_VIDA_INSS: this.formBuilder.control(null, []),
      //INSS FINAL

      //OUTROS INICIO
      CARTAO_SAMS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteCartaoSAMS(this.PESSOA_CODIGO)),
      CARTAO_SUS: this.formBuilder.control(null, [], this.uniqueValidators.validateResidenteCartaoSUS(this.PESSOA_CODIGO)),
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
      // CERTIDAO CASAMENTO FIM
    })
    this.spinner.show()
    setTimeout(() => {
      this.pessoa = this.residentesService.pessoa
      this.residente = this.residentesService.residente
      delete this.pessoa.CODIGO // REMOVE CODIGO PARA INSERCAO NO FORM
      delete this.pessoa['STATUS'] // REMOVE STATUS NAO EXISTENTE NO MODEL
      delete this.residente.CERTIDAO_CASAMENTO.CODIGO_RESIDENTE

      if (this.pessoa != undefined)
        this.novoResidenteForm.controls['PESSOA'].setValue(this.pessoa)
      if (this.residente != undefined) {
        this.novoResidenteForm.patchValue(this.residente)
        this.novoResidenteForm.controls['CERTIDAO_CASAMENTO'].setValue(this.residente.CERTIDAO_CASAMENTO)
        // this.novoResidenteForm.controls['CERTIDAO_CASAMENTO'].patchValue({ESTADO: "SP"})
      }
      this.spinner.hide()
    }, 2250)
  }


  editarResidente(residente: Residente) {
    this.residentesService.pessoa = residente.PESSOA
    this.residentesService.residente = residente

    if (this.novoResidenteForm.valid == true) {
      this.residentesService.updateResidente(residente, this.route.snapshot.params['id'], this.PESSOA_CODIGO)
        .subscribe(res => {
          if (res['errors']) {
            res['errors'].forEach(error => {
              this.notificationService.notify(`Houve um erro! ${error.message}`)
            })
          } else {
            this.residentesService.residenteById(this.route.snapshot.params['id'])
              .subscribe(res => {
                this.notificationService.notify(`Residente atualizado com sucesso!`)
                this.residente = res
              })
          }
        })
    } else {
      this.markAllDirty(this.novoResidenteForm)
      console.log(this.novoResidenteForm.controls)
      this.notificationService.notify(`Preencha os campos obrigatórios!`)
    }
  }

  verificaEstadoCivil() {
    if (this.novoResidenteForm.get('PESSOA.ESTADO_CIVIL').value == 'S' ||
      this.novoResidenteForm.get('PESSOA.ESTADO_CIVIL').value == null)
      return true
    else
      return false
  }


}
