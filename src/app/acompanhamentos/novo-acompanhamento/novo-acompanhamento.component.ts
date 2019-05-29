import { Funcionario } from './../../funcionarios/funcionario.model';
import { NovoAcompanhamentoService } from './novo-acompanhamento.service';
import { Acompanhamento, Acompanhamento_Funcionario, Acompanhamento_Residente } from './../acompanhamento/acompanhamento.model';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, transition, style, animate } from '@angular/animations';




let i
declare var $: any;
@Component({
  selector: 'salv-novo-acompanhamento',
  templateUrl: './novo-acompanhamento.component.html',
  animations: [
    trigger('novo-acompanhamentoAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})

export class NovoAcompanhamentoComponent implements OnInit {

  ACOMPANHAMENTO_CODIGOi = 1
  ACOMPANHAMENTO_CODIGO
  public maxATIVIDADELength


  novoacompanhamentoState = 'ready'

  myForm: FormGroup
  //Variable Declare
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  residentes: any = []
  funcionarios: any = []
  selectedResidentes: any = []
  selectedFuncionarios: any = []
  dropdownSettings: any = []
  dropdownSettings2: any = []


  novoAcompanhamentoForm: FormGroup




  constructor(private formBuilder: FormBuilder, private NovoAcompanhamentoService: NovoAcompanhamentoService, private router: Router, private ns: NotificationService, private spinner: NgxSpinnerService) { }

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
    //Formulário Novo Acompanhamento
    this.novoAcompanhamentoForm = this.formBuilder.group({
      DATA_ACOMPANHAMENTO: this.formBuilder.control(null, [Validators.required]),
      ATIVIDADE: this.formBuilder.control(null, [Validators.required]),
      residentes: this.formBuilder.control(null, [Validators.required]),
      funcionarios: this.formBuilder.control(null, [Validators.required])



    })



    //Residentes List    

    this.NovoAcompanhamentoService.residentes()
      .subscribe(residentes => {

        this.residentes = residentes
        console.log('residentes', residentes)
      })

    //funcionarios List
    this.NovoAcompanhamentoService.funcionarios()
      .subscribe(funcionarios => {
        this.spinner.hide();
        this.funcionarios = funcionarios
        
       
        console.log('funcionario', funcionarios)
      })

   
      this.NovoAcompanhamentoService.codigoAcompanhamento().subscribe(codigo => {
      this.ACOMPANHAMENTO_CODIGO = codigo

      if (this.ACOMPANHAMENTO_CODIGO[0].ACOMPANHAMENTO_CODIGO == null) {

        this.ACOMPANHAMENTO_CODIGO[0] = { "ACOMPANHAMENTO_CODIGO": "1" }
      }
      console.log('Codigo acompanhamento', this.ACOMPANHAMENTO_CODIGO)
    })






    this.dropdownSettings = {

      enableSearch: true,
      displayAllSelectedText: true,
      singleSelection: false,
      idField: 'CODIGO_RESIDENTE',
      textField: 'NOME',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar por nome',
    }

    this.dropdownSettings2 = {

      enableSearch: true,
      displayAllSelectedText: true,
      singleSelection: false,
      idField: 'CODIGO_FUNCIONARIO',
      textField: 'FNOME' ,      
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar por nome',
    }

  }


  novoAcompanhamento(acompanhamento: Acompanhamento) {

    this.NovoAcompanhamentoService.createAcompanhamento(acompanhamento).subscribe(res => {
      if (res['errors']) {
        res['errors'].forEach(error => {
          console.log('Houve um erro!', error)
          this.ns.notify(`Houve um erro! ${error.message}`)
        })
      } else {

        i = 1
        console.log("re", this.NovoAcompanhamentoResidente)
        this.ns.notify(`Acompanhamento inserido com sucesso!`)
        let acompanhamento = res.CODIGO
        this.router.navigate([`/acompanhamentos/${acompanhamento}`])
      }
      if (this.novoAcompanhamentoForm.valid == true && this.NovoAcompanhamentoResidente && this.NovoAcompanhamentoFuncionario) {
        let acompanhamento = res.CODIGO

        this.ns.notify(`Acompanhamento inserido com sucesso!`)
        this.router.navigate([`/acompanhamentos/${acompanhamento}`])


      } else {
        this.markAllDirty(this.novoAcompanhamentoForm)
        console.log(this.novoAcompanhamentoForm.controls)
        this.ns.notify(`Preencha os campos obrigatórios!`)
      }

    })


  }




  NovoAcompanhamentoFuncionario(acompanhamento_funcionario: Acompanhamento_Funcionario[]) {

    for (let index = 0; index < this.novoAcompanhamentoForm.value.funcionarios.length; index++) {

      acompanhamento_funcionario = [Object.assign(this.novoAcompanhamentoForm.value.funcionarios[index], this.ACOMPANHAMENTO_CODIGO[0])]
      this.NovoAcompanhamentoService.createAcompanhamentoFuncionario(acompanhamento_funcionario).subscribe(res => {

        console.log('acompanhamento funcionario', acompanhamento_funcionario)
      })


    }
  }
  NovoAcompanhamentoResidente(acompanhamento_residente: Acompanhamento_Residente[]) {


    for (let index = 0; index < this.novoAcompanhamentoForm.value.residentes.length; index++) {

      acompanhamento_residente = [Object.assign(this.novoAcompanhamentoForm.value.residentes[index], this.ACOMPANHAMENTO_CODIGO[0])]
      this.NovoAcompanhamentoService.createAcompanhamentoResidente(acompanhamento_residente).subscribe(res => {

        console.log('acompanhamento residente', acompanhamento_residente)
      })

    }



  }


  onResidenteSelect(residente: any) {
    console.log('onResidenteSelect', residente['CODIGO_RESIDENTE'])
  }

  onFuncionarioSelect(funcionarios: any) {
    console.log('onFuncionarioSelect', funcionarios['CODIGO_FUNCIONARIO'])
  }

}