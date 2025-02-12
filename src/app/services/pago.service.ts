import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';  // Asegúrate que esta URL apunte correctamente a tu backend

@Injectable({
    providedIn: 'root'
})
export class PagoService {
    public url = GLOBAL.url;  // URL base del backend

    constructor(private _http: HttpClient) { }

    // Método para iniciar el proceso de pago y generar el QR
    checkout(pedido: any, token: any): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(`${this.url}/pago/checkout`, pedido, { headers });
    }

    // Método para verificar el estado de un pago
    verificarPago(pedidoId: number, token: any): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        const body = { pedidoId };

        return this._http.post(`${this.url}/pago/verificar`, body, { headers });
    }
}
