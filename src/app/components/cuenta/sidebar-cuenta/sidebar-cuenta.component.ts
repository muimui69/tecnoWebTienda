import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { GLOBAL } from '../../../services/GLOBAL';

@Component({
  selector: 'app-sidebar-cuenta',
  templateUrl: './sidebar-cuenta.component.html',
  styleUrl: './sidebar-cuenta.component.css'
})
export class SidebarCuentaComponent {

  public route = ''
  public id = ''
  public toke = localStorage.getItem('token')
  public ventas: Array<any> = []
  public url = GLOBAL.url

  mostrarDetalles: boolean = false;
  public detallesVisibles: { [key: string]: boolean } = {};  // Para co

  constructor(
    private _route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router
  ) { }



  ngOnInit() {
    this._route.params.subscribe(params => {
      this.id = params["id"]
      this.initData()
    }
    )
  }


  initData() {
    this.clienteService.getVentasCliente(this.id, this.toke).subscribe(
      response => {
        this.ventas = response.data
        console.log(this.ventas)
      },
      error => {
        console.log(error)
      }
    )
  }

  toggleDetalles(ventaId: string): void {
    this.detallesVisibles[ventaId] = !this.detallesVisibles[ventaId];
  }


  interpretarEstadoPago(estado: number): string {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Completado';
      default: return 'Desconocido';
    }
  }

  interpretarMetodoPago(metodo: number): string {
    switch (metodo) {
      case 1: return 'Tigo Money';
      case 2: return 'QR';
      case 3: return 'Tarjeta de Crédito';
      case 4: return 'Pago en efectivo';
      default: return 'Método Desconocido';
    }
  }

  interpretarEstadoTransaccion(estado: number): string {
    switch (estado) {
      case 1: return 'Procesado';
      case 2: return 'Completado';
      case 3: return 'Pendiente';
      case 4: return 'Vencido';
      case 5: return 'Cancelado';
      default: return 'Estado Desconocido';
    }
  }



}
