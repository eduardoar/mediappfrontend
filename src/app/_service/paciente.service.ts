import { environment } from './../../environments/environment';
import { Paciente } from './../_model/paciente';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();

  private mensajeCambio: Subject<string> = new Subject<string>();

  
  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/pacientes`);    
  }

  //private url : string = `${environment.HOST}/pacientes`;

  //constructor(private http: HttpClient) { }

  /*listar(){
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(idPaciente: number){
    return this.http.get<Paciente>(`${this.url}/${idPaciente}`);
  }

  registrar(paciente: Paciente){
    return this.http.post(this.url, paciente);
  }

  modificar(paciente: Paciente){
    return this.http.put(this.url, paciente);
  }

  eliminar(idPaciente: number){
    return this.http.delete(`${this.url}/${idPaciente}`);
  }*/

  getPacienteCambio(){
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(lista: Paciente[]) {
    this.pacienteCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(texto: string) {
    this.mensajeCambio.next(texto);
  }

}
