import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UpdateMDOLineRequest } from '../models/mdo';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private mdoSource = new BehaviorSubject<{
    update: boolean;
    data: UpdateMDOLineRequest | null;
    index: number; // Change the type to accept nullable MDOLineDto
  }>({ update: false, data: null, index: 0 }); // Change the initial value to null
  currentMdo = this.mdoSource.asObservable();

  getDataInstallation(
    update: boolean,
    data: UpdateMDOLineRequest | null,
    index: number
  ) {
    // Change the type here as well
    this.mdoSource.next({ update, data, index });
  }
}
