import { Familiar, Telefone } from './../../residente/infos-familiar/familiar.model';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'
import { ResidentesService } from '../../residentes.service';
import { Endereco } from 'src/app/funcionarios/funcionario.model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'salv-familiar-residente',
  templateUrl: './familiar-residente.component.html',
  animations: [
    trigger('familiar-residenteAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})
export class FamiliarResidenteComponent implements OnInit {

  familiarresidenteState = 'ready'

  estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
    "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
    "RR", "SC", "SP", "SE", "TO"
  ];

  familiarResidenteForm: FormGroup;

  familiar: Familiar
  endereco: Endereco
  telefone: Telefone[]

  telefonesArray: FormArray

  constructor(
    private formBuilder: FormBuilder,
    private residentesService: ResidentesService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  markAllDirty(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      control.markAsDirty()
      let ctrl = <any>control;
      for (let inner in ctrl.controls)
        this.markAllDirty(ctrl.controls[inner] as AbstractControl);
    }
    else
      (<FormControl>(control)).markAsDirty();
  }

  ngOnInit() {
    this.endereco = this.residentesService.endereco
    this.telefone = this.residentesService.telefones
    this.familiar = this.residentesService.familiar

    this.familiarResidenteForm = this.formBuilder.group({
      NOME: this.formBuilder.control(null, [Validators.required]),
      SOBRENOME: this.formBuilder.control(null, [Validators.required]),
      PARENTESCO: this.formBuilder.control(null, [Validators.required]),
      ENDERECOS: this.formBuilder.group({
        ENDERECO: this.formBuilder.control(null, []),
        NUMERO: this.formBuilder.control(null, []),
        BAIRRO: this.formBuilder.control(null, []),
        CIDADE: this.formBuilder.control(null, []),
        ESTADO: this.formBuilder.control(null, []),
        CEP: this.formBuilder.control(null, []),
        COMPLEMENTO: this.formBuilder.control(null, []),
        REFERENCIA: this.formBuilder.control(null, []),
      }),
      TELEFONES: this.formBuilder.array([this.createTelefones()])
    })

    if (this.endereco != undefined)
      this.familiarResidenteForm.controls['ENDERECOS'].setValue(this.endereco)

    if (this.telefone != undefined)
      this.telefone.forEach(() => this.addTelefones())

    if (this.familiar != undefined)
      this.familiarResidenteForm.patchValue(this.familiar)
  }

  createTelefones(): FormGroup {
    return this.formBuilder.group({
      DDD: this.formBuilder.control(null, [Validators.required, Validators.minLength(2)]),
      NUMERO: this.formBuilder.control(null, [Validators.required, Validators.minLength(8)])
    });
  }

  get telefones() {
    return this.familiarResidenteForm.get('TELEFONES') as FormArray
  }

  addTelefones() {
    this.telefonesArray = this.familiarResidenteForm.get('TELEFONES') as FormArray;
    this.telefonesArray.push(this.createTelefones());
  }

  removeTelefone(index) {
    if (this.telefonesArray.length != 1) {
      this.telefonesArray = this.familiarResidenteForm.get('TELEFONES') as FormArray;
      this.telefonesArray.removeAt(index)
    }
  }

  addDataServiceFamiliar(familiar: Familiar) {
    this.residentesService.endereco = familiar.ENDERECOS
    this.residentesService.telefones = this.telefones.value
    this.residentesService.familiar = familiar
  }

  familiarResidente(familiar: Familiar) {
    if (this.familiarResidenteForm.valid == true) {
      this.addDataServiceFamiliar(familiar)
      this.router.navigate(['/convenio-residente'])
    }
    else {
      this.markAllDirty(this.familiarResidenteForm)
      //console.log(this.familiarResidenteForm.controls)
      this.notificationService.notify(`Preencha os campos obrigatórios!`)
    }
  }

  voltarResidente(familiar: Familiar) {
    this.addDataServiceFamiliar(familiar)
  }

}
