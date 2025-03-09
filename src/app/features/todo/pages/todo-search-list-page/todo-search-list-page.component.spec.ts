import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSearchListPageComponent } from './todo-search-list-page.component';

describe('TodoSearchListPageComponent', () => {
  let component: TodoSearchListPageComponent;
  let fixture: ComponentFixture<TodoSearchListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSearchListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSearchListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
