import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryCode } from 'libphonenumber-js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { GridifyQueryExtend } from 'src/app/core/utils/GridifyHelpers';
import { ValidateAllFormFields } from 'src/app/core/utils/helpers';
import { UserProfileDto } from 'src/app/models/userProfile';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { PhoneNumberInputComponent } from 'src/app/shared/components/phoneNumberInput/phoneNumberInput.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    InputSwitchModule,
    ToolbarModule,
    MessageModule,
    ButtonModule,
    ReactiveFormsModule,
    PhoneNumberInputComponent,
  ],
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.less'],
})
export class UpdateUserComponent {
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private userProfileService = inject(UserProfileService);
  private dataSharingService = inject(DataSharingService);
  private messageService = inject(MessageService);

  createFormGroup: FormGroup;
  listOfData = [] as UserProfileDto[];
  user = {} as UserProfileDto;
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  userId: string = '';
  phoneNum: string = '';
  countryCode: string = '';

  selectedCountryCode: CountryCode | { defaultCountry?: CountryCode } = {
    defaultCountry: 'US',
  };

  constructor() {
    this.createFormGroup = new FormGroup({
      Id: new FormControl<string>('', [Validators.required]),
      Name: new FormControl<string>('', [Validators.required]),
      PhoneNumber: new FormControl<string>(''),
      Email: new FormControl<string>('', [Validators.required, Validators.email]),
      Address: new FormControl<string | null>(null),
    });
    if (this.activatedRoute.snapshot.params['id']) {
      this.userId = this.activatedRoute.snapshot.params['id'];
      this.LoadForm();
    }
  }

  LoadForm() {
    this.Query.Page = 0;
    this.Query.PageSize = 0;
    this.Query.OrderBy = null;
    this.Query.Filter = `Id=${this.userId}|Name=${this.userId}`;
    this.Query.Includes = null;
    this.Query.Select = null;

    this.userProfileService.GetOne(this.Query).subscribe((respond) => {
      this.createFormGroup.patchValue(respond);

      // Parse the phone number to extract the country code
      if (respond.PhoneNumber) {
        if (this.countryCode) {
          this.phoneNum = respond.PhoneNumber;
          this.countryCode = this.countryCode;
        } else {
          this.phoneNum = respond.PhoneNumber;
          this.countryCode = 'MY';
        }
      } else {
        // Set default values
        this.phoneNum = respond.PhoneNumber || '';
        this.countryCode = 'MY';
      }

      // Update the data sharing service
      this.dataSharingService.setDataInstallation(this.countryCode, this.phoneNum);
    });
  }

  onPhoneNumberChange(phoneNumber: string, isValid: boolean) {
    this.createFormGroup.get('PhoneNumber')?.patchValue(phoneNumber);
    if (isValid) {
      this.createFormGroup.get('PhoneNumber')?.setErrors(null);
    } else {
      this.createFormGroup.get('PhoneNumber')?.setErrors({ invalidPhoneNumber: true });
    }
  }

  SaveUpdateClick() {
    if (this.createFormGroup.valid) {
      this.userProfileService.Update(this.createFormGroup.value).subscribe(() => {
        this.CancelClick();
      });
    }
    ValidateAllFormFields(this.createFormGroup);
  }

  CancelClick() {
    this.location.back();
  }
}
