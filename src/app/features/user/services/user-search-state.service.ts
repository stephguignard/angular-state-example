import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { UserRepositoryService } from './user-repository.service';
import { UserQueryFilter } from '../models/user-query-filter';
import { catchError, of } from 'rxjs';

export interface UserState {
  users: User[];
  loading: boolean;
  query: UserQueryFilter;
  page: number;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  query: { name: '', firstName: '', email: '' },
  page: 1,
  error: null
};

@Injectable()
export class UserSearchStateService {
  private readonly state = signal<UserState>(initialState);
  private itemsPerPage = 5;

  public readonly users = computed(() => this.state().users);
  public readonly loading = computed(() => this.state().loading);
  public readonly query = computed(() => this.state().query);
  public readonly page = computed(() => this.state().page);
  public readonly error = computed(() => this.state().error);

  constructor(private repository: UserRepositoryService) {}


  setFilters(query: UserQueryFilter, page: number) {
    this.setState({ query, page, loading: true, error: null });

    this.repository.getUsersPaginated(page, this.itemsPerPage, query).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.setState({ error: 'Une erreur est survenue lors du chargement des utilisateurs.', loading: false });
        return of([]);
      })
    ).subscribe(users => {
      this.setState({ users, loading: false });
    });
  }

  private loadUsers() {
    this.setState({ loading: true, error: null });

    const { query, page } = this.state();

    this.repository.getUsersPaginated(page, this.itemsPerPage, query).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.setState({ error: 'Impossible de récupérer les utilisateurs.', loading: false });
        return of([]);
      })
    ).subscribe(users => {
      this.setState({ users, loading: false });
    });
  }

  setQuery(query: UserQueryFilter) {
    this.setState({ query, page: 1, error: null });
    this.loadUsers();
  }

  setPage(page: number) {
    this.setState({ page, error: null });
    this.loadUsers();
  }

  clearError() {
    this.setState({ error: null });
  }

  private setState(partialState: Partial<UserState>) {
    this.state.set({
      ...this.state(),
      ...partialState
    });
  }
}
