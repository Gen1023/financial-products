import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  template: `
    <h2>📝 Crear Producto Financiero</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <label>ID:
        <input formControlName="id" type="text" required />
      </label>
      <label>Nombre:
        <input formControlName="name" type="text" required />
      </label>
      <label>Descripción:
        <textarea formControlName="description" required></textarea>
      </label>
      <label>Logo (URL):
        <input formControlName="logo" type="text" required />
      </label>
      <label>Fecha de lanzamiento:
        <input formControlName="date_release" type="date" required />
      </label>
      <label>Fecha de revisión:
        <input formControlName="date_revision" type="date" required />
      </label>

      <button type="submit" [disabled]="form.invalid">Crear</button>
    </form>
    <p><a routerLink="/products">⬅️ Volver al listado</a></p>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
    }
    button {
      padding: 0.5rem;
      background: #e91e63;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    label {
      font-weight: bold;
    }
  `]
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private router = inject(Router);

  form = this.fb.group({
    id: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', Validators.required],
    date_revision: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    this.service.createProduct(this.form.value as Product).subscribe({
      next: () => {
        alert('Producto creado con éxito 😍');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert('Error al crear producto 💔');
      }
    });
  }
}
