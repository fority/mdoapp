import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  DefaultPage,
  DefaultPageSize,
  PagingContent,
} from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/core/services/loading.service';
import {
  BuildFilterText,
  BuildSortText,
  GridifyQueryExtend,
} from 'src/app/core/utils/GridifyHelpers';
import { RequestByDto } from 'src/app/models/requestBy';
import { RequestByService } from 'src/app/services/mdo.service';
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
  selector: 'app-requestBy',
  templateUrl: './requestBy.component.html',
  styleUrls: ['./requestBy.component.less'],
})
export class RequestByComponent {
  Title: string = 'Request By';
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private requestService = inject(RequestByService);
  private loadingService = inject(LoadingService);

  @ViewChild('fTable') fTable?: Table;

  ClonedLineData: { [s: string]: RequestByDto } = {};
  NewId: string = '';
  NewName: string = '';
  isAddEnable: boolean = false;

  PagingSignal = signal<PagingContent<RequestByDto>>(
    {} as PagingContent<RequestByDto>
  );
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  DEFAULT_ORDER: string = 'Name asc';

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
    this.loadingService.start();
    this.requestService.GetMany(this.Query).subscribe((x) => {
      this.PagingSignal.set(x);
      this.loadingService.stop();
    });
  }

  Add() {
    this.isAddEnable = true;
    this.NewName = '';
  }

  SaveClick() {
    this.requestService.Create({ Name: this.NewName }).subscribe((res) => {
      this.PagingSignal.update((x) => ({
        Content: [...x.Content, res],
        TotalElements: x.TotalElements + 1,
      }));
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data have been added successfully',
      });
      this.isAddEnable = false;
      this.NewName = '';
    });
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
  onRowEditInit(data: RequestByDto) {
    this.ClonedLineData[data.Id] = { ...data };
  }

  onRowEditSave(index: number, data: RequestByDto) {
    this.requestService.Update({ Id: data.Id, Name: data.Name }).subscribe({
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

  onRowEditCancel(data: RequestByDto, index: number) {
    this.PagingSignal.mutate(
      (res) => (res.Content[index] = this.ClonedLineData[data.Id])
    );
    delete this.ClonedLineData[data.Id];
  }

  Delete(event: any, data: RequestByDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.requestService.Delete(data.Id).subscribe(() => {
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
    this.Query.Filter = BuildFilterText(event);
    this.LoadData();
  }
}
