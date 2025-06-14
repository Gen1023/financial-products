import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule],
  template: `
    <h1>Bienvenido al ejercicio practico hecho por Gen Arce para el puesto de trabajo,</h1>
    <p>¡Nuestro proyecto de productos financieros ha comenzado! pulse en ver productos financieros 👉 para continuar</p>
    <p>
      <a routerLink="/products">Ver productos financieros 👉</a>
    </p>
  `,
  styles: [`
    h1 {
      color: #e91e63;
      font-size: 2.5rem;
    }
    p {
      font-size: 1.2rem;
    }
    a {
      color: #d81b60;
      font-weight: bold;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class Home {}
