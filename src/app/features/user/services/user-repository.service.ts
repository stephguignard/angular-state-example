import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {
  private users: User[] = [
    { id: 1, name: 'Doe', firstName: 'John', email: 'john.doe@example.com' },
    { id: 2, name: 'Smith', firstName: 'Jane', email: 'jane.smith@example.com' },
    { id: 3, name: 'Brown', firstName: 'Mike', email: 'mike.brown@example.com' },
    { id: 4, name: 'Johnson', firstName: 'Emily', email: 'emily.johnson@example.com' },
    { id: 5, name: 'Taylor', firstName: 'Chris', email: 'chris.taylor@example.com' },
    { id: 6, name: 'Anderson', firstName: 'Emma', email: 'emma.anderson@example.com' },
    { id: 7, name: 'Thomas', firstName: 'Liam', email: 'liam.thomas@example.com' },
    { id: 8, name: 'Jackson', firstName: 'Olivia', email: 'olivia.jackson@example.com' },
    { id: 9, name: 'White', firstName: 'Noah', email: 'noah.white@example.com' },
    { id: 10, name: 'Harris', firstName: 'Sophia', email: 'sophia.harris@example.com' },
    { id: 11, name: 'Martin', firstName: 'Lucas', email: 'lucas.martin@example.com' },
    { id: 12, name: 'Thompson', firstName: 'Mia', email: 'mia.thompson@example.com' },
    { id: 13, name: 'Garcia', firstName: 'Ethan', email: 'ethan.garcia@example.com' },
    { id: 14, name: 'Martinez', firstName: 'Charlotte', email: 'charlotte.martinez@example.com' },
    { id: 15, name: 'Robinson', firstName: 'Mason', email: 'mason.robinson@example.com' },
    { id: 16, name: 'Clark', firstName: 'Amelia', email: 'amelia.clark@example.com' },
    { id: 17, name: 'Rodriguez', firstName: 'Logan', email: 'logan.rodriguez@example.com' },
    { id: 18, name: 'Lewis', firstName: 'Harper', email: 'harper.lewis@example.com' },
    { id: 19, name: 'Walker', firstName: 'Alexander', email: 'alexander.walker@example.com' },
    { id: 20, name: 'Hall', firstName: 'Evelyn', email: 'evelyn.hall@example.com' },
    { id: 21, name: 'Allen', firstName: 'Daniel', email: 'daniel.allen@example.com' },
    { id: 22, name: 'Young', firstName: 'Avery', email: 'avery.young@example.com' },
    { id: 23, name: 'King', firstName: 'David', email: 'david.king@example.com' },
    { id: 24, name: 'Wright', firstName: 'Scarlett', email: 'scarlett.wright@example.com' },
    { id: 25, name: 'Lopez', firstName: 'James', email: 'james.lopez@example.com' },
    { id: 26, name: 'Hill', firstName: 'Lily', email: 'lily.hill@example.com' },
    { id: 27, name: 'Scott', firstName: 'Benjamin', email: 'benjamin.scott@example.com' },
    { id: 28, name: 'Green', firstName: 'Hannah', email: 'hannah.green@example.com' },
    { id: 29, name: 'Adams', firstName: 'Joseph', email: 'joseph.adams@example.com' },
    { id: 30, name: 'Baker', firstName: 'Zoey', email: 'zoey.baker@example.com' },
    { id: 31, name: 'Gonzalez', firstName: 'Samuel', email: 'samuel.gonzalez@example.com' },
    { id: 32, name: 'Nelson', firstName: 'Stella', email: 'stella.nelson@example.com' },
    { id: 33, name: 'Carter', firstName: 'Henry', email: 'henry.carter@example.com' },
    { id: 34, name: 'Mitchell', firstName: 'Aurora', email: 'aurora.mitchell@example.com' },
    { id: 35, name: 'Perez', firstName: 'Jack', email: 'jack.perez@example.com' },
    { id: 36, name: 'Roberts', firstName: 'Madison', email: 'madison.roberts@example.com' },
    { id: 37, name: 'Turner', firstName: 'Sebastian', email: 'sebastian.turner@example.com' },
    { id: 38, name: 'Phillips', firstName: 'Grace', email: 'grace.phillips@example.com' },
    { id: 39, name: 'Campbell', firstName: 'Owen', email: 'owen.campbell@example.com' },
    { id: 40, name: 'Parker', firstName: 'Riley', email: 'riley.parker@example.com' },
    { id: 41, name: 'Evans', firstName: 'Caleb', email: 'caleb.evans@example.com' },
    { id: 42, name: 'Edwards', firstName: 'Nora', email: 'nora.edwards@example.com' },
    { id: 43, name: 'Collins', firstName: 'Isaac', email: 'isaac.collins@example.com' },
    { id: 44, name: 'Stewart', firstName: 'Lillian', email: 'lillian.stewart@example.com' },
    { id: 45, name: 'Sanchez', firstName: 'Gabriel', email: 'gabriel.sanchez@example.com' },
    { id: 46, name: 'Morris', firstName: 'Ellie', email: 'ellie.morris@example.com' },
    { id: 47, name: 'Rogers', firstName: 'Julian', email: 'julian.rogers@example.com' },
    { id: 48, name: 'Reed', firstName: 'Violet', email: 'violet.reed@example.com' },
    { id: 49, name: 'Cook', firstName: 'Ezra', email: 'ezra.cook@example.com' },
    { id: 50, name: 'Morgan', firstName: 'Bella', email: 'bella.morgan@example.com' }
  ];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id));
  }

  updateUser(updatedUser: User): void {
    this.users = this.users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
  }
}
