import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailPageComponent } from './todo-detail-page.component';

describe('TodoDetailPageComponent', () => {
  let component: TodoDetailPageComponent;
  let fixture: ComponentFixture<TodoDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
