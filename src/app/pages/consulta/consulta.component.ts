import { ConsultaListaExamenDTO } from './../../_model/consultaListaExamenDTO';
import { Consulta } from './../../_model/consulta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Examen } from './../../_model/examen';
import { DetalleConsulta } from './../../_model/detalleConsulta';
import { Especialidad } from './../../_model/especialidad';
import { Medico } from './../../_model/medico';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import * as moment from 'moment';
import { ConsultaService } from 'src/app/_service/consulta.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes$: Observable<Paciente[]>;
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>;

  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idExamenSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  constructor(
    private pacienteService : PacienteService,
    private medicoService : MedicoService,
    private especialidadService: EspecialidadService,
    private examenService : ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.pacientes$ = this.pacienteService.listar();
    this.medicos$ = this.medicoService.listar();
    this.especialidades$ = this.especialidadService.listar();
    this.examenes$ = this.examenService.listar();
  }

  agregar(){
    let det = new DetalleConsulta();
    det.diagnostico = this.diagnostico;
    det.tratamiento = this.tratamiento;

    this.detalleConsulta.push(det);
  }

  removerDiagnostico(index: number){
    this.detalleConsulta.splice(index, 1);    
  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
          this.examenesSeleccionados.push(data);
        });

      }
    }
  }

  removerExamen(index: number){
    this.examenesSeleccionados.slice(index, 1);
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 || this.idPacienteSeleccionado === 0);
  }

  aceptar() {
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;


    let consulta = new Consulta();
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.especialidad = especialidad;
    consulta.numConsultorio = "C1";

    /*let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();*/

    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;

    let dto: ConsultaListaExamenDTO = new ConsultaListaExamenDTO();
    dto.consulta = consulta;
    dto.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(dto).subscribe(data => {
      this.snackBar.open("SE REGISTRO", 'AVISO', { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }

}
