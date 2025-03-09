import { Injectable } from '@angular/core';
import {delay, map, Observable, of} from 'rxjs';
import {Todo} from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos: Todo[] = [
    { id: 1, text: 'Apprendre Angular Signals', completed: false },
    { id: 2, text: 'Lire la documentation NgRx', completed: false },
    { id: 3, text: 'Faire un projet Angular', completed: true },
  ];

  constructor() {}

  // Obtenir la liste des tâches avec un délai simulé pour imiter un backend
  getAll(): Observable<Todo[]> {
    return of(this.todos).pipe(delay(500)); // Simule un appel API
  }

  // Rechercher des tâches en fonction d'une requête
  getByQuery(query: string): Observable<Todo[]> {
    return of(this.todos).pipe(
      delay(500),
      map(todos =>
        todos.filter(todo =>
          todo.text.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // Ajouter une nouvelle tâche
  add(todo: Todo): Observable<Todo> {
    this.todos.push(todo);
    return of(todo).pipe(delay(300)); // Simule un délai de traitement
  }

  // Supprimer une tâche
  remove(id: number): Observable<void> {
    this.todos = this.todos.filter(todo => todo.id !== id);
    return of(undefined).pipe(delay(300)); // Simule une suppression
  }

  // Mettre à jour une tâche (ex: compléter une tâche)
  update(updatedTodo: Todo): Observable<Todo> {
    this.todos = this.todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    return of(updatedTodo).pipe(delay(300)); // Simule un update
  }
}
