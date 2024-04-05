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

  private countryCodeSource = new BehaviorSubject<string>('');
  private phoneNumberSource = new BehaviorSubject<string>('');

  currentMdo = this.mdoSource.asObservable();
  currentCode = this.countryCodeSource.asObservable();
  currentPhoneNumber = this.phoneNumberSource.asObservable();

  setDataInstallation(code: string, phoneNumber: string) {
    this.countryCodeSource.next(code);
    this.phoneNumberSource.next(phoneNumber);
  }
  getDataInstallation(update: boolean, data: UpdateMDOLineRequest | null, index: number) {
    // Change the type here as well
    this.mdoSource.next({ update, data, index });
  }
}
