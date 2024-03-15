import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, catchError, map, of } from 'rxjs';
import {
  DefaultPage,
  DefaultPageSize,
  PagingContent,
} from 'src/app/core/models/sharedModels';
import {
  BuildFilterText,
  BuildSortText,
  FilterOperatorDateSelectOption,
  FilterOperatorNumberSelectOption,
  FilterOperatorTextSelectOption,
  GridifyQueryExtend,
} from 'src/app/core/utils/GridifyHelpers';
import { UserProfileDto } from 'src/app/models/userProfile';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';

@Component({
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    DividerModule,
    SearchboxComponent,
    FormsModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    ConfirmPopupModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    TooltipModule,
  ],
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrls: ['./user-listings.component.less'],
})
export class UserListingsComponent {
  private userProfileService = inject(UserProfileService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  @ViewChild('fTable') fTable?: Table;

  isVisible = false;

  FilteredAutoComplete$: Observable<string[]> = of([]);

  DEFAULT_ORDER: string = 'Name asc';
  DateMatchModeOptions = FilterOperatorDateSelectOption;
  TextMatchModeOptions = FilterOperatorTextSelectOption;
  NumberMatchModeOptions = FilterOperatorNumberSelectOption;

  NewId: string = '';
  NewDescription: string = '';
  isAddEnable: boolean = false;

  PagingSignal = signal<PagingContent<UserProfileDto>>(
    {} as PagingContent<UserProfileDto>
  );
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  userSelection$ = this.userProfileService
    .FxtGetUser()
    .pipe(
      map((x) => x.Content.map((x) => ({ label: x.UserName, value: x.Id })))
    );

  userSelected = '';

  ngOnInit(): void {
    this.SetDefaultQuery();
  }

  SetDefaultQuery() {
    this.Query.Page = DefaultPage;
    this.Query.PageSize = DefaultPageSize;
    this.Query.OrderBy = this.DEFAULT_ORDER;
    this.Query.Filter = null;
    this.Query.Includes = null;
    this.Query.Select = null;
  }

  LoadData() {
    this.userProfileService.GetMany(this.Query).subscribe((res) => {
      this.PagingSignal.set(res);
      console.log(res);
    });
  }

  ImportUser() {
    if (!this.userSelected || this.userSelected == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select to import!',
      });
      return;
    }
    this.userProfileService
      .FxtImportUser(this.userSelected)
      .pipe(
        catchError(() => {
          throw new Error('Import failed!');
        })
      )
      .subscribe(() => {
        this.LoadData();
        this.isVisible = false;
        this.userSelected = '';
      });
  }
  //TODO
  ImportClick() {
    this.userProfileService.FxtImportUser(this.userSelected).subscribe((x) => {
      this.isVisible = false;
      this.LoadData();
    });
  }

  EnableDisableUser(event: boolean, id: string) {
    if (event) {
      this.userProfileService.Disable(id).subscribe({
        next: () => {
          this.PagingSignal().Content.forEach((res) => {
            if (res.Id === id) {
              res.IsDisable = !event;
            }
          });
        },
        error: () => {
          this.PagingSignal().Content.forEach((res) => {
            if (res.Id === id) {
              res.IsDisable = !event;
            }
          });
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data have been updated successfully',
          });
        },
      });
    } else {
      this.userProfileService.Enable(id).subscribe(() => {});
    }
  }

  ShowModal() {
    this.isVisible = true;
  }

  CloseModal() {
    this.isVisible = false;
  }

  EditClick(id: string) {
    this.router.navigate([`/user-manager/update/${id}`]);
  }

  Search(data: string) {
    this.Query.Filter = `Name=*${data}`;
    this.LoadData();
  }

  ClearSearch() {
    this.SetDefaultQuery();
    this.ResetTable();
    this.LoadData();
  }

  ResetTable() {
    if (this.fTable) {
      this.fTable.clearFilterValues();
      this.fTable.saveState();
    }
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Query.Page = event.first / event.rows + 1 || 1;
      this.Query.PageSize = event.rows;
    }
    const sortText = BuildSortText(event);
    this.Query.OrderBy = sortText == '' ? this.DEFAULT_ORDER : sortText;
    this.Query.Filter = BuildFilterText(event);
    this.LoadData();
  }

  Delete(event: any, data: UserProfileDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.userProfileService.Delete(data.Id).subscribe(() => {
          this.PagingSignal.update((res) => ({
            ...res,
            Content: res.Content.filter((c) => c.Id !== data.Id),
            TotalElements: res.TotalElements - 1,
          }));
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data have been deleted successfully',
          });
        });
      },
    });
  }
}
