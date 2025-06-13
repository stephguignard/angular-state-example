import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core';
import { User } from '../models/user';
import { UserRepositoryService } from './user-repository.service';
import { UserQueryFilter } from '../models/user-query-filter';
import { catchError, of } from 'rxjs';


export interface UserSearchParamsState {
  query: UserQueryFilter;
  page: number;
}

const initialSearchParamsState:UserSearchParamsState = {
  query: { name: '', firstName: '', email: '' },
  page: 1
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialUserState: UserState = {
    users: [],
    loading: false,
    error: null
}

@Injectable()
export class UserSearchStateService {
  private readonly userRepositoryService = inject(UserRepositoryService);
  private readonly itemsPerPage = 5;

  // 📥 État de recherche (déclencheurs)
  private readonly userSearchParamsState = signal<UserSearchParamsState>(initialSearchParamsState);

  // 📦 Résultat de recherche
  private readonly userState = signal<UserState>(initialUserState);

  // 📤 Exposition publique
  public readonly users = computed(() => this.userState().users);
  public readonly loading = computed(() => this.userState().loading);
  public readonly error = computed(() => this.userState().error);
  public readonly query = computed(() => this.userSearchParamsState().query);
  public readonly page = computed(() => this.userSearchParamsState().page);

  constructor() {
    effect(() => {
      this.loadData();
    });
  }

  private loadData() {
    const {query, page} = this.userSearchParamsState();

    this.userState.update(userSearchResult => ({...userSearchResult, loading: true, error: null}));

    this.userRepositoryService.getUsersPaginated(page, this.itemsPerPage, query).pipe(
      catchError(error => {
        console.error('Erreur chargement utilisateurs :', error);
        this.userState.update(userSearchResult => ({
          ...userSearchResult,
          loading: false,
          error: 'Erreur lors du chargement des utilisateurs.'
        }));
        return of([]);
      })
    ).subscribe(users => {
      this.userState.update(userSearchResult => ({...userSearchResult, users, loading: false}));
    });
  }

  setFilters(query: UserQueryFilter, page: number) {
    this.userSearchParamsState.set({ query, page });
  }

  setQuery(query: UserQueryFilter) {
    this.userSearchParamsState.update(p => ({ ...p, query, page: 1 }));
  }

  setPage(page: number) {
    this.userSearchParamsState.update(p => ({ ...p, page }));
  }

  clearError() {
    this.userState.update(r => ({ ...r, error: null }));
  }
}
