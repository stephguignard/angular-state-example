import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { TodoStore } from './todo.store';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

const todo = (id: number, text: string, completed = false): Todo => ({ id, text, completed });

describe('TodoStore', () => {
  let serviceMock: {
    getByQuery: jest.Mock;
    add: jest.Mock;
    remove: jest.Mock;
    update: jest.Mock;
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        TodoStore,
        { provide: TodoService, useValue: serviceMock },
      ],
    });
    return TestBed.inject(TodoStore);
  };

  beforeEach(() => {
    serviceMock = {
      getByQuery: jest.fn().mockReturnValue(of([])),
      add: jest.fn((t: Todo) => of(t)),
      remove: jest.fn().mockReturnValue(of(undefined)),
      update: jest.fn((t: Todo) => of(t)),
    };
  });

  it('exposes the initial state', () => {
    const store = setup();

    expect(store.todos()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.filter()).toEqual({ query: '', order: 'asc' });
  });

  describe('computed signals', () => {
    it('todosCount reflects the number of todos', () => {
      serviceMock.add = jest.fn((t: Todo) => of(t));
      const store = setup();

      expect(store.todosCount()).toBe(0);
      store.addTodo('first');
      expect(store.todosCount()).toBe(1);
    });

    it('sortedTodos orders by text according to the filter order', fakeAsync(() => {
      serviceMock.getByQuery.mockReturnValue(of([todo(1, 'banana'), todo(2, 'apple'), todo(3, 'cherry')]));
      const store = setup();

      store.loadByQuery('');
      tick(300);

      expect(store.sortedTodos().map((t) => t.text)).toEqual(['apple', 'banana', 'cherry']);

      store.updateOrder('desc');
      expect(store.sortedTodos().map((t) => t.text)).toEqual(['cherry', 'banana', 'apple']);
    }));

    it('hasError is false until an error is recorded', fakeAsync(() => {
      serviceMock.getByQuery.mockReturnValue(throwError(() => new Error('boom')));
      const store = setup();

      expect(store.hasError()).toBe(false);

      store.loadByQuery('x');
      tick(300);

      expect(store.hasError()).toBe(true);
      expect(store.error()).toBe('Erreur de chargement');
      expect(store.isLoading()).toBe(false);
    }));
  });

  describe('filter mutations', () => {
    it('updateQuery patches only the query', () => {
      const store = setup();
      store.updateQuery('signals');
      expect(store.filter()).toEqual({ query: 'signals', order: 'asc' });
    });

    it('updateOrder patches only the order', () => {
      const store = setup();
      store.updateOrder('desc');
      expect(store.filter()).toEqual({ query: '', order: 'desc' });
    });
  });

  describe('loadByQuery', () => {
    it('debounces, toggles isLoading and stores the result', fakeAsync(() => {
      const result = [todo(1, 'Apprendre Angular Signals')];
      serviceMock.getByQuery.mockReturnValue(of(result));
      const store = setup();

      store.loadByQuery('angular');
      expect(serviceMock.getByQuery).not.toHaveBeenCalled();

      tick(300);

      expect(serviceMock.getByQuery).toHaveBeenCalledWith('angular');
      expect(store.todos()).toEqual(result);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    }));

    it('ignores a repeated identical query (distinctUntilChanged)', fakeAsync(() => {
      serviceMock.getByQuery.mockReturnValue(of([]));
      const store = setup();

      store.loadByQuery('a');
      tick(300);
      store.loadByQuery('a');
      tick(300);

      expect(serviceMock.getByQuery).toHaveBeenCalledTimes(1);
    }));
  });

  describe('addTodo', () => {
    it('appends the todo returned by the service', () => {
      const store = setup();

      store.addTodo('Nouvelle tâche');

      expect(serviceMock.add).toHaveBeenCalledTimes(1);
      expect(store.todos()).toHaveLength(1);
      expect(store.todos()[0]).toMatchObject({ text: 'Nouvelle tâche', completed: false });
    });

    it('records an error when the service fails', () => {
      serviceMock.add.mockReturnValue(throwError(() => new Error('nope')));
      const store = setup();

      store.addTodo('KO');

      expect(store.todos()).toEqual([]);
      expect(store.error()).toBe("Erreur lors de l'ajout");
    });
  });

  describe('removeTodo', () => {
    it('drops the matching todo', fakeAsync(() => {
      serviceMock.getByQuery.mockReturnValue(of([todo(1, 'a'), todo(2, 'b')]));
      const store = setup();
      store.loadByQuery('');
      tick(300);

      store.removeTodo(1);

      expect(serviceMock.remove).toHaveBeenCalledWith(1);
      expect(store.todos().map((t) => t.id)).toEqual([2]);
    }));
  });

  describe('toggleTodo', () => {
    it('flips the completed flag of the matching todo', fakeAsync(() => {
      serviceMock.getByQuery.mockReturnValue(of([todo(1, 'a', false)]));
      const store = setup();
      store.loadByQuery('');
      tick(300);

      store.toggleTodo(1);

      expect(serviceMock.update).toHaveBeenCalledWith({ id: 1, text: 'a', completed: true });
      expect(store.todos()[0].completed).toBe(true);
    }));

    it('does nothing when the id is unknown', fakeAsync(() => {
      const store = setup();
      store.toggleTodo(999);
      expect(serviceMock.update).not.toHaveBeenCalled();
    }));
  });
});
