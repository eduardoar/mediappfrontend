import { MedicoService } from 'src/app/_service/medico.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from 'src/app/_model/medico';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    private medicoService: MedicoService,
    @Inject(MAT_DIALOG_DATA) private data: Medico
  ) { }

  ngOnInit(): void {
    this.medico = { ...this.data }
  }

  operar() {

    if (this.medico != null && this.medico.idMedico > 0) {
      //MODIFICAR
      this.medicoService.modificar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      }))      
      .subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio("SE MODIFICO");
      });

    } else {
      //REGISTRAR
      this.medicoService.registrar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe(data => {
          this.medicoService.setMedicoCambio(data);
          this.medicoService.setMensajeCambio("SE REGISTRO");
        });
      });
    }
    this.cerrar();

  }

  cerrar() {
    this.dialogRef.close();
  }

}
