import { DialogConfirmService } from './dialog-confirm.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResidentesService } from './residentes.service';
import { Residente, Pessoa, Residente_delete } from './residente/residente.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from '../shared/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'salv-residentes',
  templateUrl: './residentes.component.html',
  animations: [
    trigger('residentesAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', [
        style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})
export class ResidentesComponent implements OnInit {

  residentesState = 'ready'

  public searchString: string;

  residentesInativos: Residente[] = []

  residentes: Residente[] = []

  codigoResidenteDeletar: number

  deleteResidenteForm: FormGroup

  public Desativados
  public filter

  constructor(
    private residentesService: ResidentesService,
    private dialogConfirmService: DialogConfirmService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) { }

  paginaAtual: number = 1;
  ngOnInit() {
    this.spinner.show()
    this.residentesService.residentes()
      .subscribe(residentes => {
        this.spinner.hide()
        this.residentes = residentes
        console.log(residentes)
      })
      // limpar os dados armazenados no services toda vez que for inicializado
      this.residentesService.clearDataResidente()

    this.deleteResidenteForm = this.formBuilder.group({
      MOTIVO_DESACOLHIMENTO: this.formBuilder.control(null, [Validators.required]),
      DATA_DESACOLHIMENTO: this.formBuilder.control(null, [Validators.required])
    })

  }

  residentesInativoss() {
    this.residentesService.residentesInativos()
      .subscribe(residentesInativos => {
        this.residentesInativos = residentesInativos
        console.log(residentesInativos)
      })
  }

  deleteResidente(residente_delete: Residente_delete): void {
    this.residentesService.deleteResidente(this.codigoResidenteDeletar, residente_delete)
      .subscribe(result => {
        this.residentesService.residentes()
          .subscribe(residentes => this.residentes = residentes)
        this.deleteResidenteForm.reset()
        this.notificationService.notify(`Residente excluido com sucesso!`)
      })

  }

  getResidenteID(codigoResidente: number) {
    this.codigoResidenteDeletar = codigoResidente
  }

  ativarResidente(id: string): void {
    this.dialogConfirmService.confirm(`Deseja ativar o residente?`)
      .then((isTrue) => {
        if (isTrue) {
          this.residentesService.ativarResidente(id)
            .subscribe(result => {
              this.residentesService.residentesInativos()
                .subscribe(residentes => this.residentesInativos = residentes, residentes => this.residentes = residentes)
              this.notificationService.notify(`Residente ativado com sucesso!`)
            })
        }
      })
  }

  reportResidentes(status) {
    this.spinner.show()
    this.residentesService.reportResidentes(status).subscribe(x => {
      var newBlob = new Blob([x], { type: 'application/pdf' })

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob)
        return
      }

      const data = window.URL.createObjectURL(newBlob)
      var link = document.createElement('a')
      link.href = data
      link.download = "Relatório de residentes.pdf"
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))

      setTimeout(function () {
        window.URL.revokeObjectURL(data)
        link.remove()
      }, 100)
      this.spinner.hide()
      this.notificationService.notify('Relatório emitido com sucesso')
    })
  }

}
