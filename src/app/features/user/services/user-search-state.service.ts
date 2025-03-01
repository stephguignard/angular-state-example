import {computed, effect, Injectable, Signal, signal} from '@angular/core';
import {User} from '../models/user';
import {UserRepositoryService} from './user-repository.service';
import {UserQueryFilter} from '../models/user-query-filter';

@Injectable()
export class UserSearchStateService {

  private _users = signal<User[]>([]);
  private _query = signal<UserQueryFilter>({
    name: '',
    firstName: '',
    email: ''
  });
  private _page = signal<number>(1);
  private _itemsPerPage = 5;

  constructor(private repository: UserRepositoryService) {
    this.loadUsers();
  }

  private loadUsers() {
    this.repository.getUsers().subscribe(users => this._users.set(users));
  }

  // Filtrage dynamique basé sur `_query`
  private filteredUsers = computed(() => {
    console.log("⚡ Exécution du filtre...");
    const { name, firstName, email } = this._query();
    console.log(this._page());

    const result = this._users().filter(user =>
      (name ? user.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (firstName ? user.firstName.toLowerCase().includes(firstName.toLowerCase()) : true) &&
      (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true)
    );
    console.log(result);
    return result;
  });

  // Utilisateurs paginés dynamiquement
  private paginatedUsers = computed(() => {
    console.log("📌 Application de la pagination...",this._query());
    const startIndex = (this._page() - 1) * this._itemsPerPage;
    const resultUsers = this.filteredUsers().slice(startIndex, startIndex + this._itemsPerPage);
    return resultUsers;
  });

  // Exposition des signaux en lecture seule
  getUsersSignal(): Signal<User[]> {
    return this.paginatedUsers;
  }

  getQuerySignal() {
    return this._query.asReadonly();
  }

  getPageSignal() {
    return this._page.asReadonly();
  }

  // Actions pour modifier l'état
  setQuery(query: UserQueryFilter) {
    console.log("📌 Mise à jour de la requête :", query);
    this._query.set({...query});
    //this._query.set(Object.assign({}, query));
    this._page.set(1);
  }

  setPage(page: number) {
    this._page.set(page);
  }
}
