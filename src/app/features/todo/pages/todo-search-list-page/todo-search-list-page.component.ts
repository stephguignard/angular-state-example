import { Component } from '@angular/core';
import {TodoComponent} from '../../components/todo/todo.component';

@Component({
  selector: 'app-todo-search-list-page',
  imports: [
    TodoComponent
  ],
  templateUrl: './todo-search-list-page.component.html',
  styleUrl: './todo-search-list-page.component.scss'
})
export class TodoSearchListPageComponent {

}
