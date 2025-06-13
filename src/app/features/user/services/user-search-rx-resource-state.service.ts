import {computed, inject, Injectable, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {UserRepositoryService} from './user-repository.service';
import {UserQueryFilter} from '../models/user-query-filter';
import {User} from '../models/user';

export interface UserSearchParamsState {
  query: UserQueryFilter;
  page: number;
}

const initialSearchParamsState:UserSearchParamsState = {
  query: { name: '', firstName: '', email: '' },
  page: 1
}

@Injectable()
export class UserSearchRxResourceStateService {

  private readonly userRepositoryService = inject(UserRepositoryService);
  private readonly itemsPerPage = 5;

  // 🔍 Paramètres de recherche (intention utilisateur)
  private readonly userSearchParamsState = signal<UserSearchParamsState>(initialSearchParamsState);

  // 📡 Appel backend automatique via rxResource
  private readonly userStateResource = rxResource<User[], UserSearchParamsState>({
    request: this.userSearchParamsState,
    loader: (filter) =>
      this.userRepositoryService.getUsersPaginated(filter.request.page, this.itemsPerPage, filter.request.query),
    defaultValue: []
  });

  // 📤 Exposition lecture seule
  public readonly users = this.userStateResource.value();
  public readonly loading = this.userStateResource.isLoading;
  public readonly error = computed(() =>
    this.userStateResource.error() ? 'Erreur lors du chargement des utilisateurs.' : null
  );
  public readonly query = computed(() => this.userSearchParamsState().query);
  public readonly page = computed(() => this.userSearchParamsState().page);

  // 🔁 Mise à jour du filtre + page
  setFilters(query: UserQueryFilter, page: number) {
    this.userSearchParamsState.set({ query, page });
  }

  // 🔁 Mise à jour du filtre (reset pagination)
  setQuery(query: UserQueryFilter) {
    this.userSearchParamsState.update(p => ({ ...p, query, page: 1 }));
  }

  // 🔁 Pagination seule
  setPage(page: number) {
    this.userSearchParamsState.update(p => ({ ...p, page }));
  }

  // ❌ Réinitialise l’erreur (si utilisée côté UI)
  clearError() {
    // Pas nécessaire ici, mais on peut ajouter un état d’erreur si besoin
  }
}
