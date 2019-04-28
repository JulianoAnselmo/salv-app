import { Convenio } from './infos-convenio/convenio.model';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResidentesService } from '../residentes.service';
import { ActivatedRoute } from '@angular/router';
import { Residente, Residente_Convenio } from './residente.model';
import { Familiar, Telefone } from './infos-familiar/familiar.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as jspdf from 'jspdf'
import { Telefone_Pessoa } from 'src/app/funcionarios/funcionario.model';
import { FormArray, Validators, FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxSpinnerService } from 'ngx-spinner'
import { Beneficio } from './infos-beneficios/beneficio.model';

@Component({
  selector: 'salv-residente',
  templateUrl: './residente.component.html',
  animations: [
    trigger('residenteAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})
export class ResidenteComponent implements OnInit {

  residenteState = 'ready'

  estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
    "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
    "RR", "SC", "SP", "SE", "TO"
  ];

  residente: Residente
  familiares: Familiar[]
  convenios: Convenio[]
  beneficios: Beneficio[]
  residenteConvenios: Residente_Convenio[]

  familiarResidenteForm: FormGroup
  convenioResidenteForm: FormGroup

  telefonesArray: FormArray

  constructor(
    private residentesService: ResidentesService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show()
    this.residentesService.residenteById(this.route.snapshot.params['id'])
      .subscribe(residente => {

        this.residente = residente
      })

    this.residentesService.convenios()
      .subscribe(convenio => {
        this.spinner.hide()
        this.residenteConvenios = convenio
      })

    this.getFamiliar()

    this.getConvenio()

    this.getBeneficio()


    this.familiarResidenteForm = this.formBuilder.group({
      NOME: this.formBuilder.control(null, [Validators.required]),
      SOBRENOME: this.formBuilder.control(null, [Validators.required]),
      PARENTESCO: this.formBuilder.control(null, [Validators.required]),
      ENDERECOS: this.formBuilder.group({
        ENDERECO: this.formBuilder.control(null, [Validators.required]),
        NUMERO: this.formBuilder.control(null, [Validators.required]),
        BAIRRO: this.formBuilder.control(null, [Validators.required]),
        CIDADE: this.formBuilder.control(null, [Validators.required]),
        ESTADO: this.formBuilder.control(null, [Validators.required]),
        CEP: this.formBuilder.control(null, [Validators.required]),
        COMPLEMENTO: this.formBuilder.control(null, []),
        REFERENCIA: this.formBuilder.control(null, []),
      }),
      TELEFONE: this.formBuilder.group({
        DDD: this.formBuilder.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
        NUMERO: this.formBuilder.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)])
      })
    })

    this.convenioResidenteForm = this.formBuilder.group({
      NUMERO_CONVENIO: this.formBuilder.control(null, [Validators.required]),
      TITULAR_CONVENIO: this.formBuilder.control(null, [Validators.required]),
      PARENTESCO_TITULAR: this.formBuilder.control(null, []),
      CONVENIO_CODIGO: this.formBuilder.control(null, [Validators.required]),
    })

  }

  getFamiliar() {
    this.residentesService.familiarById(this.route.snapshot.params['id'])
      .subscribe(familiar => this.familiares = familiar)
  }

  getConvenio() {
    this.residentesService.convenioById(this.route.snapshot.params['id'])
      .subscribe(convenio => this.convenios = convenio)
  }

  getBeneficio(){
    this.residentesService.beneficiosById(this.route.snapshot.params['id'])
    .subscribe(beneficio => this.beneficios = beneficio)
  }


  familiarResidente(familiar: Familiar) {
    this.residentesService.createNewFamiliar(familiar, this.route.snapshot.params['id'])
      .subscribe(res => {
        if (res['errors']) {
          res['errors'].forEach(error => {
            this.notificationService.notify(`Houve um erro! ${error.message}`)
          })
        } else {
          this.notificationService.notify(`Familiar adicionado com sucesso!`)
          this.familiarResidenteForm.reset()
          this.getFamiliar()
        }
      })
  }
  convenioResidente(residenteConvenio: Residente_Convenio) {
    this.residentesService.createNewConvenio(residenteConvenio, this.route.snapshot.params['id'])
      .subscribe(res => {
        if (res['errors']) {
          res['errors'].forEach(error => {
            this.notificationService.notify(`Houve um erro! ${error.message}`)
          })
        } else {
          this.notificationService.notify(`Convenio adicionado com sucesso!`)
          this.convenioResidenteForm.reset()
          this.getConvenio()
        }
      })
  }

  reportResidente() {
    this.residentesService.reportResidente(this.residente.CODIGO_RESIDENTE.toString()).subscribe(res => {
      this.notificationService.notify('Relatório emitido com sucesso!')
    })
  }

}
