import { Medico } from 'src/app/_model/medico';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico>{

  private medicoCambio = new Subject<Medico[]>();

  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/medicos`);

  }

  getMedicoCambio(){
    return this.medicoCambio.asObservable();
  }

  setMedicoCambio(lista: Medico[]) {
    this.medicoCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(texto: string) {
    this.mensajeCambio.next(texto);
  }


}
