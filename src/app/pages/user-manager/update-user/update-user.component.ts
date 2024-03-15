import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { UserProfileService } from 'src/app/services/userProfile.service';

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
  ],
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.less'],
})
export class UpdateUserComponent {
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private userProfileService = inject(UserProfileService);

  createFormGroup: FormGroup;
  listOfData = [] as UserProfileDto[];
  user = {} as UserProfileDto;
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  userId: string = '';

  constructor() {
    this.createFormGroup = new FormGroup({
      Id: new FormControl<string>('', [Validators.required]),
      Name: new FormControl<string>('', [Validators.required]),
      PhoneNumber: new FormControl<string>(''),
      Email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
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
    this.Query.Filter = `Id=${this.userId}`;
    this.Query.Includes = null;
    this.Query.Select = null;

    this.userProfileService.GetOne(this.Query).subscribe((respond) => {
      this.createFormGroup.patchValue(respond);
    });
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
