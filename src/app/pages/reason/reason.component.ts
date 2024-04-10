import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildFilterText, BuildSortText, DefaultPageSize, GridifyQueryExtend, LoadingService, PagingContent } from 'fxt-core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';

import { ReasonCodeDto } from 'src/app/models/reason-code';
import { ReasonCodeService } from 'src/app/services/mdo.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    SearchboxComponent,
    InputTextModule,
  ],
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.less'],
})
export class ReasonComponent {
  Title: string = 'Reason';
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private reasonCodeService = inject(ReasonCodeService);
  private loadingService = inject(LoadingService);

  @ViewChild('fTable') fTable?: Table;

  ClonedLineData: { [s: string]: ReasonCodeDto } = {};
  NewId: string = '';
  NewReason: string = '';
  NewDescription: string = '';
  isAddEnable: boolean = false;

  PagingSignal = signal<PagingContent<ReasonCodeDto>>(
    {} as PagingContent<ReasonCodeDto>
  );
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  DEFAULT_ORDER: string = 'Reason asc';

  ngOnInit(): void {
    this.SetDefaultQuery();
  }

  SetDefaultQuery() {
    this.Query.Page = 0;
    this.Query.PageSize = DefaultPageSize;
    this.Query.OrderBy = this.DEFAULT_ORDER;
    this.Query.Filter = null;
    this.Query.Includes = null;
    this.Query.Select = null;
  }
  LoadData() {
    this.loadingService.start();
    this.reasonCodeService.GetMany(this.Query).subscribe((x) => {
      this.PagingSignal.set(x);
      this.loadingService.stop();
    });
  }

  Add() {
    this.isAddEnable = true;
    this.NewReason = '';
    this.NewDescription = '';
  }

  SaveClick() {
    this.reasonCodeService
      .Create({ Reason: this.NewReason, Description: this.NewDescription })
      .subscribe((res) => {
        this.PagingSignal.update((x) => ({
          Content: [res, ...x.Content],
          TotalElements: x.TotalElements + 1,
        }));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data have been added successfully',
        });
        this.isAddEnable = false;
        this.NewReason = '';
      });
  }

  Search(data: string) {

    if (this.fTable != null) {
      this.fTable.first = 0; //goto first page (paginator)
      this.fTable.filters = {
        Reason: [
          {
            value: data,
            matchMode: "=*",
            operator: "and",
          },
        ], 'Description': [
          {
            value: data,
            matchMode: "=*",
            operator: "and",
          },
        ]
      }
    }

    const event: TableLazyLoadEvent = {
      first: 0, // Starting index of the data to load
      rows: this.fTable?.rows,  // Number of rows to load per request
      sortField: null,  // Optional: Field to sort by
      sortOrder: null,   // Optional: Sort order (asc/desc)
      filters: {
        Reason: [
          {
            value: data,
            matchMode: "=*",
            operator: "and",
          },
        ], 'Description': [
          {
            value: data,
            matchMode: "=*",
            operator: "and",
          },
        ]
      },
    };
    this.NextPage(event);
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

  onRowEditInit(data: ReasonCodeDto) {
    this.ClonedLineData[data.Id] = { ...data };
  }

  onRowEditSave(index: number, data: ReasonCodeDto) {
    this.reasonCodeService
      .Update({
        Id: data.Id,
        Reason: data.Reason,
        Description: data.Description,
      })
      .subscribe({
        next: () => {
          delete this.ClonedLineData[data.Id];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data have been updated successfully',
          });
        },
        error: () => {
          this.PagingSignal.mutate((res) => {
            res.Content[index] = this.ClonedLineData[data.Id];
          });
          delete this.ClonedLineData[data.Id];
        },
      });
  }

  onRowEditCancel(data: ReasonCodeDto, index: number) {
    this.PagingSignal.mutate(
      (res) => (res.Content[index] = this.ClonedLineData[data.Id])
    );
    delete this.ClonedLineData[data.Id];
  }

  Delete(event: any, data: ReasonCodeDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.reasonCodeService.Delete(data.Id).subscribe(() => {
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

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Query.Page = event.first / event.rows + 1 || 1;
      this.Query.PageSize = event.rows;
    }
    const sortText = BuildSortText(event);
    this.Query.OrderBy = sortText == '' ? this.DEFAULT_ORDER : sortText;
    const filtered = BuildFilterText(event);
    if (filtered === '') this.ResetTable();
    else this.Query.Filter = BuildFilterText(event);
    this.LoadData();
  }
}
