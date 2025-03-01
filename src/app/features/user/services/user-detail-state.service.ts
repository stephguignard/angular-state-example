import {Injectable, signal} from '@angular/core';
import {UserRepositoryService} from './user-repository.service';
import {User} from '../models/user';

@Injectable()
export class UserDetailStateService {

  private _selectedUser = signal<User | null>(null);

  constructor(private userRepositoryService: UserRepositoryService) {}

  getSelectedUser(): User | null {
    return this._selectedUser();
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
}
