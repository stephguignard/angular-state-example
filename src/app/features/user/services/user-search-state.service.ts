import {computed, effect, Injectable, Signal, signal} from '@angular/core';
import {User} from '../models/user';
import {UserRepositoryService} from './user-repository.service';
import {UserQueryFilter} from '../models/user-query-filter';

const initQueryFilter: UserQueryFilter = {
  name: '',
  firstName: '',
  email: ''
}

@Injectable()
export class UserSearchStateService {

  private users = signal<User[]>([]);
  private loading = signal<boolean>(false);
  private query = signal<UserQueryFilter>(initQueryFilter);
  private page = signal<number>(1);
  private itemsPerPage = 5;

  constructor(private repository: UserRepositoryService) {
  }

  setFilters(query: UserQueryFilter, page: number) {
    this.query.set(query);
    this.page.set(page);
    this.loadUsers();
  }

  private loadUsers() {
    this.loading.set(true);
    const query = this.query();
    const page = this.page();

    this.repository.getUsersPaginated(page, this.itemsPerPage, query).subscribe(users => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  setQuery(query: UserQueryFilter) {
    this.query.set(query);
    this.page.set(1);
  }

  setPage(page: number) {
    this.page.set(page);
  }

  // Exposition des signaux en lecture seule
  getUsersSignal(): Signal<User[]> {
    return this.users.asReadonly();
  }

  getLoadingSignal(): Signal<boolean> {
    return this.loading.asReadonly();
  }

  getQuerySignal() {
    return this.query.asReadonly();
  }

  getPageSignal() {
    return this.page.asReadonly();
  }

}
