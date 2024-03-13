import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  userRoleSubject = new ReplaySubject<string[]>();

  UpdateUserRole(message: string[]) {
    this.userRoleSubject.next(message);
  }
}
