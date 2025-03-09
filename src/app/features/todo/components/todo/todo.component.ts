import {Component, inject, OnInit} from '@angular/core';
import {TodoStore} from '../../store/todo.store';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TodoService} from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  providers: [TodoStore],
})
export class TodoComponent implements OnInit{
  newTodo = '';
  todoStore = inject(TodoStore);

  ngOnInit() {
    this.todoStore.loadByQuery('');
  }

  addTodo() {
    if (this.newTodo.trim()) {
      this.todoStore.addTodo(this.newTodo);
      this.newTodo = '';
    }
  }

  removeTodo(id: number) {
    this.todoStore.removeTodo(id);
  }

  toggleTodo(id: number) {
    this.todoStore.toggleTodo(id);
  }

  updateQuery(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.todoStore.updateQuery(query);
    this.todoStore.loadByQuery(query);
  }
}
