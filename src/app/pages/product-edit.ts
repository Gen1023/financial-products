import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  template: `
    <h2>✏️ Editar Producto</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="formLoaded" novalidate>
      <label>ID:
        <input formControlName="id" type="text" />
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

      <button type="submit" [disabled]="form.invalid">Guardar Cambios</button>
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
      background: #4caf50;
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
export class ProductEdit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ProductService);

  formLoaded = false;

  form = this.fb.group({
    id: [{ value: '', disabled: true }, Validators.required],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', Validators.required],
    date_revision: ['', Validators.required]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getProductById(id).subscribe({
      next: (product) => {
        this.form.setValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release.split('T')[0],
          date_revision: product.date_revision.split('T')[0]
        });
        this.formLoaded = true;
      },
      error: (err) => {
        console.error('Error cargando producto', err);
        alert('No se pudo cargar el producto');
        this.router.navigate(['/products']);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const product: Product = {
      id: raw.id ?? '', // obtiene el ID aunque esté disabled
      name: raw.name ?? '',
      description: raw.description ?? '',
      logo: raw.logo ?? '',
      date_release: raw.date_release ?? '',
      date_revision: raw.date_revision ?? ''
    };

    this.service.updateProduct(product).subscribe({
      next: () => {
        alert('Producto actualizado exitosamente ✅');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('Error al actualizar producto ❌');
      }
    });
  }
}
