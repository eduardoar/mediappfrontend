import { Paciente } from './../../_model/paciente';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {


  dataSource: MatTableDataSource<Paciente> = new MatTableDataSource();
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];
  cantidad: number = 0;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.pacienteService.getMensajeCambio().subscribe(texto => {
      this.snackBar.open(texto, 'AVISO', {duration: 2000, horizontalPosition: "right", verticalPosition: "top"});
    });
    
    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.crearTabla(data);
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    }); */

    this.pacienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    })
  }

  eliminar(idPaciente: number) {

    this.pacienteService.eliminar(idPaciente).pipe(switchMap(() => {
      return this.pacienteService.listar();
    })).subscribe(data => {
      this.crearTabla(data);
    });

  }

  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  mostrartMas(e: any) {
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

}
