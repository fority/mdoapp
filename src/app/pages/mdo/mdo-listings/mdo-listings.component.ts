import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, of } from 'rxjs';
import {
  DefaultPage,
  DefaultPageSize,
  GridifyQueryExtend,
  PagingContent,
} from 'src/app/core/models/sharedModels';
import { MDOHeaderDto } from 'src/app/models/mdo';
import { MdoService } from 'src/app/services/mdo.service';
import { SortingService } from 'src/app/services/sorting.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { SortTableModelType } from 'src/app/shared/enum/sorting';
import { SharedModule } from 'src/app/shared/module/SharedModule/SharedModule.module';

@Component({
  standalone: true,
  selector: 'app-mdo-listings',
  templateUrl: './mdo-listings.component.html',
  styleUrls: ['./mdo-listings.component.less'],
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    SearchboxComponent,
    TooltipModule,
    SharedModule,
  ],
})
export class MdoListingsComponent {
  private mdoService = inject(MdoService);
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

  ClonedLineData: { [s: string]: MDOHeaderDto } = {};

  PagingSignal = signal<PagingContent<MDOHeaderDto>>(
    {} as PagingContent<MDOHeaderDto>
  );
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  listOfData = [] as MDOHeaderDto[];

  DEFAULT_SORT: string = '';

  LoadData() {
    this.Query.Page = this.page;
    this.Query.PageSize = this.pageSize;
    this.Query.OrderBy = `RecordId desc`;
    this.Query.Filter = `RecordId=*${this.SearchTextNgModel}`;
    this.Query.Includes = 'ShipTo,Shipper,RequestBy,ReasonCode,MDOLines';
    this.Query.Select = null;

    this.mdoService.GetMany(this.Query).subscribe((res) => {
      this.PagingSignal.set(res);
      this.listOfData = res.Content;
    });
  }

  AddClick() {
    this.router.navigate([`/mdo/create`]);
  }

  EditClick(id: string) {
    this.router.navigate([`/mdo/update/${id}`]);
  }

  GotoDetails(id: string) {
    this.router.navigate([`/mdo/details/${id}`]);
  }

  CancelClick(id: string) {
    this.mdoService.Cancel(id).subscribe((x) => {
      this.LoadData();
    });
  }

  DownloadPdf(id: string) {
    this.mdoService.DownloadPdf(id).subscribe((data: any) => {
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;

      console.log(this.listOfData);
      const index = this.listOfData.findIndex((item) => item.Id === id);

      link.download = this.listOfData[index].RecordId + '.MDO_FILE.pdf';
      link.click();
    });
  }

  ReturnClick(id: string, mdoLineId: string) {
    this.mdoService.Return(id, mdoLineId).subscribe((x) => {
      this.LoadData();
    });
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

  Delete(event: any, data: MDOHeaderDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.mdoService.Delete(data.Id).subscribe(() => {
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
