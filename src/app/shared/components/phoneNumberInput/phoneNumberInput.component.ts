import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { InputTextModule } from 'primeng/inputtext';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule],
  selector: 'app-phoneNumberInput',
  templateUrl: './phoneNumberInput.component.html',
  styleUrls: ['./phoneNumberInput.component.css'],
})
export class PhoneNumberInputComponent implements OnInit {
  @Input() phoneNumber: string | undefined;

  @Output() phoneNumberChanged = new EventEmitter<{
    phoneNumber: string;
    isValid: boolean;
  }>();

  private dataSharingService = inject(DataSharingService);

  valid: boolean = false;
  errorMessage: string = '';
  selectedCountryCode: CountryCode | { defaultCountry?: CountryCode } = {
    defaultCountry: 'US',
  };

  formGroup!: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      PhoneNumber: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit() {
    this.dataSharingService.currentPhoneNumber.subscribe((phoneNum) => {
      this.formGroup.get('PhoneNumber')?.patchValue(phoneNum);
      // Initialize phone input only after receiving the phone number
      try {
        const phoneInput = document.querySelector('#phone') as HTMLInputElement;
        if (phoneInput) {
          this.initializePhoneNumberInput(phoneInput);
        }
      } catch (error) {
        console.error('An error occurred during initialization:', error);
      }
    });

    // Subscribe to currentCode separately if needed
    this.dataSharingService.currentCode.subscribe((countryCode) => {
      this.selectedCountryCode = countryCode as CountryCode;
    });
  }

  private initializePhoneNumberInput(phoneInput: HTMLInputElement) {
    const iti = intlTelInput(phoneInput, {
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@20.3.0/build/js/utils.js',
      nationalMode: true,
      autoPlaceholder: 'polite',
      formatOnDisplay: true,
      placeholderNumberType: 'MOBILE',
      initialCountry: 'auto', // Set initial country to auto detect
    });

    phoneInput.addEventListener('countrychange', () => {
      this.formGroup.get('PhoneNumber')?.patchValue('');
      const countryCode = iti.getSelectedCountryData().iso2;
      const code = countryCode?.toUpperCase();
      this.selectedCountryCode = code as CountryCode;
    });
  }

  onPhoneNumberChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && 'value' in target) {
      const value = target.value;

      let valid1 = false;
      let valid2 = false;

      if (!this.selectedCountryCode) {
        this.errorMessage = 'Please select country code';
        valid1 = false;
        return;
      } else {
        valid1 = true;
      }
      if (value.length < 2) {
        this.errorMessage = 'Too short. Invalid length';
        valid2 = false;
        return;
      } else {
        valid2 = true;
      }

      const phoneNumber = parsePhoneNumber(value, this.selectedCountryCode as CountryCode);
      const isValidPhoneNumber =
        phoneNumber && phoneNumber.isValid() && phoneNumber.country === this.selectedCountryCode;

      if (!isValidPhoneNumber) {
        this.errorMessage = 'Invalid Phone Number';
        if (!phoneNumber.isValid()) {
          this.errorMessage = 'Invalid format or length for the selected country';
        } else if (phoneNumber.country !== this.selectedCountryCode) {
          this.errorMessage = 'Phone number does not match selected country';
        }
      } else {
        this.errorMessage = '';
      }

      if (isValidPhoneNumber && valid1 && valid2) {
        this.valid = true;
      }
      this.phoneNumberChanged.emit({
        phoneNumber: isValidPhoneNumber ? phoneNumber.number : '',
        isValid: this.valid,
      });
    }
  }
}
