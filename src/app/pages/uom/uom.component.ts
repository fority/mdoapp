import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import {
  DefaultPage,
  DefaultPageSize,
  GridifyQueryExtend,
  PagingContent,
} from 'src/app/core/models/sharedModels';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UOMDto } from 'src/app/models/uom';
import { UOMService } from 'src/app/services/mdo.service';
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
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.less'],
})
export class UomComponent {
  Title: string = 'UOM';
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private uomService = inject(UOMService);
  private loadingService = inject(LoadingService);

  Page: number = DefaultPage;
  PageSize: number = DefaultPageSize;
  SearchTextNgModel: string = '';

  ClonedLineData: { [s: string]: UOMDto } = {};
  NewId: string = '';
  NewName: string = '';
  NewDescription: string = '';
  isAddEnable: boolean = false;

  AutoCompleteSource$: Observable<string[]> = this.uomService.GetMany();

  PagingSignal = signal<PagingContent<UOMDto>>({} as PagingContent<UOMDto>);
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  LoadData() {
    this.loadingService.start();
    this.Query.Page = this.Page;
    this.Query.PageSize = this.PageSize;
    this.Query.OrderBy = `Name asc`;
    this.Query.Filter = `Name=*${this.SearchTextNgModel}`;
    this.Query.Includes = null;
    this.Query.Select = null;

    this.uomService.GetMany(this.Query).subscribe((x) => {
      this.PagingSignal.set(x);
      this.loadingService.stop();
    });
  }

  Add() {
    this.isAddEnable = true;
    this.NewName = '';
    this.NewDescription = '';
  }

  SaveClick() {
    this.uomService
      .Create({ Name: this.NewName, Description: this.NewDescription })
      .subscribe((res) => {
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
    this.SearchTextNgModel = data;
    this.LoadData();
  }

  ClearSearch() {
    this.SearchTextNgModel = '';
    this.LoadData();
  }

  onRowEditInit(data: UOMDto) {
    this.ClonedLineData[data.Id] = { ...data };
  }

  onRowEditSave(index: number, data: UOMDto) {
    this.uomService
      .Update({ Id: data.Id, Name: data.Name, Description: data.Description })
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

  onRowEditCancel(data: UOMDto, index: number) {
    this.PagingSignal.mutate(
      (res) => (res.Content[index] = this.ClonedLineData[data.Id])
    );
    delete this.ClonedLineData[data.Id];
  }

  Delete(event: any, data: UOMDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.uomService.Delete(data.Id).subscribe(() => {
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
      this.Page = event.first / event.rows + 1 || 1;
      this.PageSize = event.rows;
    }
    this.LoadData();
  }
}
