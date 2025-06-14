import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  template: `
    <h2>📋 Productos Financieros</h2>
    <p><a routerLink="/products/create" class="btn-create">➕ Crear Producto</a></p>

    <input
      type="text"
      [(ngModel)]="searchTerm"
      (input)="filterProducts()"
      placeholder="🔎 Buscar por nombre o ID"
      class="search-input"
    />

    <label class="limit-selector">
      Mostrar:
      <select [(ngModel)]="itemsPerPage" (change)="updatePagination()">
        <option *ngFor="let option of pageOptions" [value]="option">{{ option }}</option>
      </select>
      productos por página
    </label>

    <div *ngIf="loading()">Cargando productos...</div>
    <div *ngIf="!loading() && paginatedProducts().length === 0">No hay productos.</div>

    <div class="grid" *ngIf="!loading() && paginatedProducts().length > 0">
      <div class="card" *ngFor="let p of paginatedProducts()">
        <img [src]="p.logo" alt="logo" />
        <h3>{{ p.name }}</h3>
        <p>{{ p.description }}</p>
        <small>ID: {{ p.id }}</small><br />
        <small>Lanzado: {{ p.date_release }}</small><br />
        <small>Revisión: {{ p.date_revision }}</small><br />
        <button (click)="edit(p.id)">✏️ Editar</button>
        <button class="delete" (click)="delete(p.id)">🗑️ Eliminar</button>
      </div>
    </div>

    <div *ngIf="totalPages > 1" class="pagination">
      <button (click)="prevPage()" [disabled]="currentPage === 1">⬅️ Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button (click)="nextPage()" [disabled]="currentPage === totalPages">Siguiente ➡️</button>
    </div>
  `,
  styles: [`
    h2 {
      margin-bottom: 1rem;
    }
    .btn-create {
      display: inline-block;
      padding: 0.5rem 1rem;
      background:rgb(26, 233, 19);
      color: white;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
    }
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
    }
    .limit-selector {
      display: block;
      margin-bottom: 1rem;
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .card {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 1rem;
      width: 300px;
      background: #fff3f7;
      position: relative;
    }
    img {
      width: 100%;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
    button {
      margin-top: 0.5rem;
      padding: 0.3rem 0.8rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .delete {
      background: #f44336;
      color: white;
      margin-left: 0.5rem;
    }
    .pagination {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class ProductList {
  private service = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  filtered = signal<Product[]>([]);
  paginatedProducts = computed(() => {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filtered().slice(start, start + this.itemsPerPage);
  });

  loading = signal(true);
  searchTerm = '';
  itemsPerPage = 5;
  pageOptions = [5, 10, 15, 20];
  currentPage = 1;
  totalPages = 1;

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.service.getProducts().subscribe({
      next: res => {
        this.products.set(res.data);
        this.filtered.set(res.data);
        this.updatePagination();
        this.loading.set(false);
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.products.set([]);
        this.filtered.set([]);
        this.loading.set(false);
      }
    });
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    const result = this.products().filter(p =>
      p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
    this.filtered.set(result);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filtered().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  edit(id: string) {
    this.router.navigate(['/products/edit', id]);
  }

  delete(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este producto? 🗑️');
    if (!confirmDelete) return;

    this.service.deleteProduct(id).subscribe({
      next: () => {
        alert('Producto eliminado exitosamente 💥');
        this.loadProducts();
      },
      error: err => {
        console.error('Error al eliminar', err);
        alert('Error al eliminar producto ❌');
      }
    });
  }
}

