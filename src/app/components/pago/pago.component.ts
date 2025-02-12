import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagoService } from '../../services/pago.service';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  public token = localStorage.getItem('token');
  public venta = JSON.parse(localStorage.getItem('venta')!);
  public user: any = JSON.parse(localStorage.getItem('cliente')!);
  public transaccion = localStorage.getItem('pago_transaccion');
  public qr = localStorage.getItem('pago_qr');
  transaccionId: string = '';
  qrCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private _pagoService: PagoService,
    private toastr: ToastrService,
    private router: Router,
    private _clienteService: ClienteService,
  ) { }

  ngOnInit(): void {
    // Obtener la transacción desde la URL
    this.route.paramMap.subscribe(params => {
      this.transaccionId = params.get('id') || '';

      // Recuperar el QR del localStorage
      this.qrCode = localStorage.getItem('pago_qr') || '';

      if (!this.qrCode) {
        this.toastr.error('No se pudo cargar el QR. Intente nuevamente.');
        this.router.navigate(['/checkout']);
      }
    });
  }

  verificarPago() {
    console.log(this.transaccion, this.transaccionId)
    if (!this.transaccionId && !this.transaccion) {
      this.toastr.error('No hay transacción para verificar.');
      return;
    }

    this._pagoService.verificarPago(parseInt(this.transaccionId! || this.transaccion!), this.token).subscribe(
      response => {
        if (response.data && (response.data.EstadoTransaccion === 2 || response.data.EstadoTransaccion === 5 || response.data.EstadoTransaccion === 1)) {
          this.toastr.success('Pago realizado con éxito');

          // Eliminar datos temporales
          localStorage.removeItem('pago_qr');
          localStorage.removeItem('pago_transaccion');
          localStorage.removeItem('venta');

          console.log(response.data)

          this.pagar(response.data);
        } else {
          this.toastr.error('El pago no fue completado. Intente nuevamente.');
        }
      },
      error => {
        console.error('Error al verificar el pago:', error);
        this.toastr.error('Error al verificar el pago. Intente más tarde.');
      }
    );
  }

  pagar(data: any) {
    this.venta.detallePago = data;
    this._clienteService.createVentaCliente(this.venta, this.token).subscribe(
      response => {

        console.log(response)

        this.toastr.success('Venta realizada con exito')

        this.router.navigate(['/cuenta', this.user._id])
      },
      error => {
        console.log(<any>error)
      }
    )
  }
}
