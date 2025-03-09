import { computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {TodoService} from '../services/todo.service';
import {Todo} from '../models/todo.model';


type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

export const TodoStore = signalStore(
  withState(initialState),

  withComputed(({ todos, filter, error }) => ({
    todosCount: computed(() => todos().length),

    sortedTodos: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      // ✅ Correction de `toSorted()` en utilisant `slice().sort()`
      return [...todos()].sort((a: Todo, b: Todo) =>
        direction * a.text.localeCompare(b.text)
      );
    }),

    // ✅ Ajout de `error` comme computed signal
    hasError: computed(() => !!error()),
  })),

  withMethods((store, todoService = inject(TodoService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },

    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    loadByQuery: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((query) =>
          todoService.getByQuery(query).pipe(
            tapResponse({
              next: (todos) => patchState(store, { todos }),
              error: (err) => patchState(store, { error: 'Erreur de chargement' }),
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),

    addTodo(text: string) {
      const newTodo: Todo = { id: Date.now(), text, completed: false };

      todoService.add(newTodo).pipe(
        tapResponse({
          next: (todo) => patchState(store, (state) => ({ todos: [...state.todos, todo] })),
          error: (err) => patchState(store, { error: 'Erreur lors de l\'ajout' }),
        })
      ).subscribe();
    },

    removeTodo(id: number) {
      todoService.remove(id).pipe(
        tapResponse({
          next: () => patchState(store, (state) => ({
            todos: state.todos.filter(todo => todo.id !== id)
          })),
          error: (err) => patchState(store, { error: 'Erreur lors de la suppression' }),
        })
      ).subscribe();
    },

    toggleTodo(id: number) {
      const todo = store.todos().find(t => t.id === id);
      if (!todo) return;

      todoService.update({ ...todo, completed: !todo.completed }).pipe(
        tapResponse({
          next: (updatedTodo) => patchState(store, (state) => ({
            todos: state.todos.map(t => (t.id === id ? updatedTodo : t))
          })),
          error: (err) => patchState(store, { error: 'Erreur lors de la mise à jour' }),
        })
      ).subscribe();
    }
  }))
);
