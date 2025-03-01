import {Injectable, signal} from '@angular/core';
import {User} from '../models/user';
import {UserRepositoryService} from './user-repository.service';

@Injectable()
export class UserSearchStateService {

  private _users = signal<User[]>([]);
  private _query = signal<{ name: string; firstName: string; email: string }>({
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

  getUsers(): User[] {
    const { name, firstName, email } = this._query();
    return this._users()
      .filter(user =>
        (name ? user.name.toLowerCase().includes(name.toLowerCase()) : true) &&
        (firstName ? user.firstName.toLowerCase().includes(firstName.toLowerCase()) : true) &&
        (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true)
      )
      .slice((this._page() - 1) * this._itemsPerPage, this._page() * this._itemsPerPage);
  }

  setQuery(query: { name: string; firstName: string; email: string }) {
    this._query.set(query);
    this._page.set(1);
  }

  getPage(): number {
    return this._page();
  }

  setPage(page: number) {
    this._page.set(page);
  }
}
