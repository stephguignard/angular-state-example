import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {User} from '../../models/user';
import {UserStateService} from '../../services/user-state.service';

@Component({
  selector: 'app-user-table',
  imports: [
    TableModule
  ],
  providers: [UserStateService],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  users!: User[];

  constructor(private userStateService:UserStateService) {
  }

  ngOnInit() {
    this.users=[
      {
        name:'tata',
        firstName:'stephane',
        email:'sguik@gmail.com'
      },
      {
        name:'Guignard',
        firstName:'patrick',
        email:'pauik@gmail.com'
      }
      ]
  }

}
