import {computed, Injectable, Signal, signal} from '@angular/core';
import { User } from '../models/user';
import { UserRepositoryService } from './user-repository.service';
import { UserQueryFilter } from '../models/user-query-filter';

export interface UserState {
  users: User[];
  loading: boolean;
  query: UserQueryFilter;
  page: number;
}

const initialState: UserState = {
  users: [],
  loading: false,
  query: { name: '', firstName: '', email: '' },
  page: 1
};

@Injectable()
export class UserSearchStateService {
  private state = signal<UserState>(initialState);
  private itemsPerPage = 5;

  constructor(private repository: UserRepositoryService) {}

  setFilters(query: UserQueryFilter, page: number) {
    this.state.set({
      ...this.state(),
      query,
      page
    });
    this.loadUsers();
  }

  private loadUsers() {
    this.setState({ loading: true });

    const { query, page } = this.state();

    this.repository.getUsersPaginated(page, this.itemsPerPage, query).subscribe(users => {
      this.setState({ users, loading: false });
    });
  }

  setQuery(query: UserQueryFilter) {
    this.setState({ query, page: 1 });
    this.loadUsers();
  }

  setPage(page: number) {
    this.setState({ page });
    this.loadUsers();
  }

  private setState(partialState: Partial<UserState>) {
    this.state.set({
      ...this.state(),
      ...partialState
    });
  }

  // ✅ Correction : Utilisation de `computed()` pour exposer les signaux dérivés
  getUsersSignal(): Signal<User[]> {
    return computed(() => this.state().users);
  }

  getLoadingSignal(): Signal<boolean> {
    return computed(() => this.state().loading);
  }

  getQuerySignal(): Signal<UserQueryFilter> {
    return computed(() => this.state().query);
  }

  getPageSignal(): Signal<number> {
    return computed(() => this.state().page);
  }
}
