import { Acompanhamento } from './acompanhamento/acompanhamento.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AcompanhamentosService } from './acompanhamentos.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'salv-acompanhamentos',
    templateUrl: './acompanhamentos.component.html',
    animations: [
        trigger('acompanhamentosAppeared', [
            state('ready', style({ opacity: 1 })),
            transition('void => ready', [
                style({ opacity: 0, transform: 'translate(-30px, -10px)' }),
                animate('500ms 0s ease-in-out')
            ])
        ])
    ]

})
export class AcompanhamentosComponent implements OnInit {

    dateReportForm: FormGroup

    acompanhamentosState = 'ready'

    public searchString: string;
    acompanhamentos: Acompanhamento[]

    public Desativos
    public filter

    constructor(private acompanhamentosService: AcompanhamentosService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private ns: NotificationService, private fb: FormBuilder) { }

    paginaAtual: number = 1;
    ngOnInit() {
        this.spinner.show();
        this.acompanhamentosService.acompanhamentos()
            .subscribe(
                acompanhamentos => {
                    this.acompanhamentos = acompanhamentos
                    console.log('acompanahmentos', this.acompanhamentos)
                    this.spinner.hide()
                })

        this.dateReportForm = this.fb.group({
            dateStart: this.fb.control(null),
            dateFinish: this.fb.control(null)
        })
    }

    reportAcompanhamentos() {
        let dates = this.dateReportForm.value
        this.spinner.show()
        this.acompanhamentosService.reportAcompanhamentos(dates).subscribe(x => {
            var newBlob = new Blob([x], { type: 'application/pdf' })

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob)
                return
            }

            const data = window.URL.createObjectURL(newBlob)
            var link = document.createElement('a')
            link.href = data
            link.download = "Relatório de acompanhamentos.pdf"
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))

            setTimeout(function () {
                window.URL.revokeObjectURL(data)
                link.remove()
            }, 100)
            this.dateReportForm.reset()
            this.spinner.hide()
            this.ns.notify('Relatório emitido com sucesso')
        })
    }

}
