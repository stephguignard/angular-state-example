import {Injectable, Signal, signal} from '@angular/core';
import {UserRepositoryService} from './user-repository.service';
import {User} from '../models/user';

@Injectable()
export class UserDetailStateService {

  private _selectedUser = signal<User | null>(null);

  constructor(private userRepositoryService: UserRepositoryService) {}

  getSelectedUserSignal(): Signal<User | null> {
    return this._selectedUser.asReadonly();
  }

  loadUser(id: number) {
    this.userRepositoryService.getUserById(id).subscribe(user => {
      if (user) this._selectedUser.set(user);
    });
  }

  updateUser(updatedUser: User) {
    this._selectedUser.set(updatedUser);
    this.userRepositoryService.updateUser(updatedUser);
  }

  removeUser(updatedUser: User) {
    this._selectedUser.set(null);
    this.userRepositoryService.removeUser(updatedUser);
  }

  clearSelection() {
    this._selectedUser.set(null);
  }
}
