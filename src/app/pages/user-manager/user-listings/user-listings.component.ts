import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, catchError, map, of } from 'rxjs';
import {
  DefaultPage,
  DefaultPageSize,
  GridifyQueryExtend,
  PagingContent,
} from 'src/app/core/models/sharedModels';
import { UserProfileDto } from 'src/app/models/userProfile';
import { SortingService } from 'src/app/services/sorting.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { SortTableModelType } from 'src/app/shared/enum/sorting';

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
  private sortingService = inject(SortingService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  isVisible = false;
  page = DefaultPage;
  pageSize = DefaultPageSize;
  SearchTextNgModel: string = '';
  FilteredAutoComplete$: Observable<string[]> = of([]);

  ClonedLineData: { [s: string]: UserProfileDto } = {};
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
  DEFAULT_SORT = '';

  LoadData() {
    this.Query.Page = this.page;
    this.Query.PageSize = this.pageSize;
    this.Query.OrderBy = `Name asc`;
    this.Query.Filter = `Name=*${this.SearchTextNgModel}`;
    this.Query.Includes = null;
    this.Query.Select = null;

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

  //#region Search
  searchFilterText = '';
  searchSortText = this.DEFAULT_SORT;

  SortByColumn(header: SortTableModelType, $event: string) {
    this.page = DefaultPage;
    header.assignSortBy($event);
    this.searchSortText = this.sortingService.SortByColumn();
    this.LoadData();
  }

  FilterByColumn(header: SortTableModelType, $event: string) {
    this.page = DefaultPage;
    header.assignFilterBy($event);
    this.searchFilterText = this.sortingService.FilterByColumn();
    this.LoadData();
  }

  Search(data: string) {
    this.SearchTextNgModel = data;
    this.LoadData();
  }

  ClearSearch() {
    this.SearchTextNgModel = '';
    this.LoadData();
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.page = event.first / event.rows + 1 || 1;
      this.pageSize = event.rows;
    }
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
