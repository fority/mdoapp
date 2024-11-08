import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FilterOperatorDateSelectOption,
  FilterOperatorTextSelectOption,
  FilterOperatorNumberSelectOption,
  PagingContent,
  GridifyQueryExtend,
  DefaultPage,
  DefaultPageSize,
  BuildSortText,
  BuildFilterText,
} from 'fxt-core';
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

  PagingSignal = signal<PagingContent<UserProfileDto>>({} as PagingContent<UserProfileDto>);
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  userSelection$ = this.userProfileService.FxtGetUser().pipe(map((x) => x.Content.map((x) => ({ label: x.UserName, value: x.Id }))
  //jiawei add 4 Nov 2024
  .filter(user => user.label !== null)
  .sort((a, b) => a.label!.localeCompare(b.label!))));

  userSelected: string = '';

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

  //jiawei add new 5 Nov 2024
  EnableDisableUser(event: boolean, id: string) {
    if (event) { 
      this.userProfileService.Disable(id).subscribe({
        next: () => {
          if (Array.isArray(this.PagingSignal().Content)) {
            this.PagingSignal().Content.forEach((res) => {
              if (res.Id === id) {
                res.IsDisable = true;
                console.log(`User with ID ${id} has been disabled successfully.`);
              }
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to disable the user',
          });
        },
      });
    } else { 
      this.userProfileService.Enable(id).subscribe({
        next: () => {
          if (Array.isArray(this.PagingSignal().Content)) {
            this.PagingSignal().Content.forEach((res) => {
              if (res.Id === id) {
                res.IsDisable = false; 
                console.log(`User with ID ${id} has been enabled successfully.`);
              }
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to enable the user',
          });
        },
      });
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
