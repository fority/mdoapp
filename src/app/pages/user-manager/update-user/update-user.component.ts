import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridifyQueryExtend, ValidateAllFormFields } from 'fxt-core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { UserProfileDto } from 'src/app/models/userProfile';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
//jiawei adding
import { PagingContent } from 'fxt-core';
import { PhonenumberinputComponent } from 'fxt-input-phone-num';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

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
    PhonenumberinputComponent,
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

  //jiawei copy from the user-listing.component.ts 5 Nov 2024
  PagingSignal = signal<PagingContent<UserProfileDto>>({
    Content: [],          
    TotalElements: 0,     
  });
  
  userId: string = '';
  // phoneNum: string = '';
  // countryCode: string = '';

  // selectedCountryCode: CountryCode | { defaultCountry?: CountryCode } = {
  //   defaultCountry: 'US',
  // };

  constructor() {
    this.createFormGroup = new FormGroup({
      Id: new FormControl<string>('', [Validators.required]),
      Name: new FormControl<string>('', [Validators.required]),
      PhoneNumber: new FormControl<string>('', [Validators.required]),
      Email: new FormControl<string>('', [Validators.required, Validators.email]),
      Address: new FormControl<string | null>(null),
      IsDisable: new FormControl<boolean>(false),
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

      // // Parse the phone number to extract the country code
      // if (respond.PhoneNumber) {
      //   if (this.countryCode) {
      //     this.phoneNum = respond.PhoneNumber;
      //     this.countryCode = this.countryCode;
      //   } else {
      //     this.phoneNum = respond.PhoneNumber;
      //     this.countryCode = 'MY';
      //   }
      // } else {
      //   // Set default values
      //   this.phoneNum = respond.PhoneNumber || '';
      //   this.countryCode = 'MY';
      // }

      // // Update the data sharing service
      // this.dataSharingService.setDataInstallation(this.countryCode, this.phoneNum);
    });
  }

  //jiawei 7 Nov 2024
  SaveUpdateClick() {
  if (this.createFormGroup.valid) {
    const phoneUtil = PhoneNumberUtil.getInstance();
    //Format Phone Number before send
    if (this.createFormGroup.get('PhoneNumber')?.value) {
      let phoneNumber = (this.createFormGroup.get('PhoneNumber')?.value as string).startsWith('+') ? this.createFormGroup.get('PhoneNumber')?.value : '+' + this.createFormGroup.get('PhoneNumber')?.value;

      let parsedInput = phoneUtil.parseAndKeepRawInput(phoneNumber);

      if (phoneUtil.isValidNumber(parsedInput)) {
        const parsedNumber = phoneUtil.format(parsedInput, PhoneNumberFormat.E164);
        if (this.createFormGroup.get('PhoneNumber')?.value !== parsedNumber) this.createFormGroup.get('PhoneNumber')?.setValue(parsedNumber);
      }
    }
  }
  
    //user disable and enable
    if (this.createFormGroup.valid) {
      this.userProfileService.Update(this.createFormGroup.value).subscribe({
        next: (response) => {
          const isDisabled = this.createFormGroup.get('IsDisable')?.value;
  
          if (isDisabled) {
            this.userProfileService.Disable(this.userId).subscribe({
              next: () => {
                console.log('Disable operation success!');
                if (Array.isArray(this.PagingSignal().Content)) {
                  this.PagingSignal().Content.forEach((res) => {
                    if (res.Id === this.userId) {
                      res.IsDisable = true;
                      console.log(`User with ID ${this.userId} has been disabled successfully.`);
                    }
                  });
                }
              },
              error: () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to disable the user.',
                });
              }
            });
          } else {
            this.userProfileService.Enable(this.userId).subscribe({
              next: () => {
                console.log('Enable operation success!');
                if (Array.isArray(this.PagingSignal().Content)) {
                  this.PagingSignal().Content.forEach((res) => {
                    if (res.Id === this.userId) {
                      res.IsDisable = false;
                      console.log(`User with ID ${this.userId} has been enabled successfully.`);
                    }
                  });
                }
              },
              error: () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to enable the user.',
                });
              }
            });
          }
          this.CancelClick();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update the user.',
          });
        }
      });
    } else {
      ValidateAllFormFields(this.createFormGroup);
    }
  }
  
  CancelClick() {
    this.location.back();
  }
}
