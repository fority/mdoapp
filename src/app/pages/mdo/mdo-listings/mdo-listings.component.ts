import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService, PagingContent, GridifyQueryExtend, FilterOperatorDateSelectOption, FilterOperatorTextSelectOption, FilterOperatorNumberSelectOption, FilterOperatorStatusSelectOption, DefaultPage, DefaultPageSize, DownloadFile, BuildSortText, BuildFilterText } from 'fxt-core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, map } from 'rxjs';
import { MDOHeaderDto } from 'src/app/models/mdo';
import { MdoService } from 'src/app/services/mdo.service';
import { SearchboxComponent } from 'src/app/shared/components/searchbox/searchbox.component';
import { SharedModule } from 'src/app/shared/module/SharedModule/SharedModule.module';

@Component({
  standalone: true,
  selector: 'app-mdo-listings',
  templateUrl: './mdo-listings.component.html',
  styleUrls: ['./mdo-listings.component.less'],
  imports: [CommonModule, DropdownModule, CardModule, TableModule, ButtonModule, SearchboxComponent, DividerModule,
    TooltipModule, SharedModule,],
})
export class MdoListingsComponent {
  private mdoService = inject(MdoService);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  @ViewChild('fTable') fTable?: Table;

  isVisible = false;

  PagingSignal = signal<PagingContent<MDOHeaderDto>>({} as PagingContent<MDOHeaderDto>);
  Query: GridifyQueryExtend = {} as GridifyQueryExtend;
  listOfData = [] as MDOHeaderDto[];

  DEFAULT_ORDER: string = 'RecordId desc';
  DateMatchModeOptions = FilterOperatorDateSelectOption;
  TextMatchModeOptions = FilterOperatorTextSelectOption;
  NumberMatchModeOptions = FilterOperatorNumberSelectOption;
  StatusMatchModeOptions = FilterOperatorStatusSelectOption;

  AutoCompleteSource$: Observable<string[]> = this.mdoService.GetMany({
    OrderBy: `RecordId`,
    Select: `RecordId`,
    Page: 1,
    PageSize: 1000000,
    Filter: null,
    Includes: null
  }).pipe(map((x) => x.Content.map((x: any) => x.RecordId || "")));

  ngOnInit(): void {
    this.SetDefaultQuery();
  }


  //TODO WIP Custome Status Filter
  // onFilter(data: any) {
  //   if (this.fTable != null) {
  //     this.fTable.first = 0; //goto first page (paginator)
  //     this.fTable.filters = {
  //       Status: [
  //         {
  //           value: data.value,
  //           matchMode: "=",
  //           operator: "and",
  //         },
  //       ]
  //     }
  //   }

  //   const event: TableLazyLoadEvent = {
  //     first: 0, // Starting index of the data to load
  //     rows: this.fTable?.rows,  // Number of rows to load per request
  //     sortField: null,  // Optional: Field to sort by
  //     sortOrder: null,   // Optional: Sort order (asc/desc)
  //     filters: {
  //       Status: [
  //         {
  //           value: data.value,
  //           matchMode: "=",
  //           operator: "and",
  //         },
  //       ]
  //     }
  //   };
  //   this.NextPage(event);
  // }


  SetDefaultQuery() {
    this.Query.Page = DefaultPage;
    this.Query.PageSize = DefaultPageSize;
    this.Query.OrderBy = this.DEFAULT_ORDER;
    this.Query.Filter = null;
    this.Query.Includes = null;
    this.Query.Select = `Id,RecordId,Date,ShipDate,Remark,Status,ShipTo.Name as ShipTo,Shipper.Name as Shipper,RequestBy.Name as RequestBy,ReasonCode.Reason as ReasonCode,MDOLines.Select(new(Id,Item as Items,ItemDesc,LotID,LineStatus,Qty,Remark,UOM.Name as UOM)) as MDOLines`;
  }

  LoadData() {
    this.loadingService.start();
    this.mdoService.GetMany(this.Query).subscribe((res) => {
      this.PagingSignal.set(res);
      this.listOfData = res.Content;
      this.loadingService.stop();
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

  CancelClick(event: any, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to cancel?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.mdoService.Cancel(id).subscribe(() => {
          this.LoadData();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data have been cancelled successfully',
          });
        });
      },
    });
  }

  DownloadPdf(id: string) {
    this.mdoService.DownloadPdf(id).subscribe((data: any) => {
      DownloadFile(data, 'MDO.pdf');
    });
  }

  ReturnClick(event: any, id: string, mdoLineId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to return?',
      icon: 'pi pi-exclamation-triangle',
      dismissableMask: true,
      accept: () => {
        this.mdoService.Return(id, mdoLineId).subscribe(() => {
          this.LoadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data have been cancelled successfully' });
        });
      },
    });
  }


  Search(data: string) {
    const filter = {
      RecordId: [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ],
      'ShipTo.Name': [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ], 'Shipper.Name': [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ], 'RequestBy.Name': [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ], 'ReasonCode.Reason': [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ], 'Remark': [
        {
          value: data,
          matchMode: "=*",
          operator: "and",
        },
      ],
    }
    if (this.fTable != null) {
      this.fTable.first = 0; //goto first page (paginator)
      this.fTable.filters = filter;
    }

    const event: TableLazyLoadEvent = {
      first: 0, // Starting index of the data to load
      rows: this.fTable?.rows,  // Number of rows to load per request
      sortField: null,  // Optional: Field to sort by
      sortOrder: null,   // Optional: Sort order (asc/desc)
      filters: filter
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
      this.Query.Filter = '';
      this.fTable.clearFilterValues();
      this.fTable.saveState();
    }
  }

  NextPage(event: TableLazyLoadEvent) {
    if ((event?.first || event?.first === 0) && event?.rows) {
      this.Query.Page = event.first / event.rows + 1 || 1;
      this.Query.PageSize = event.rows;
    }
    const sortText = BuildSortText(event)
    this.Query.OrderBy = sortText == '' ? this.DEFAULT_ORDER : sortText;
    const filtered = BuildFilterText(event);
    if (filtered === '')
      this.ResetTable();
    else
      this.Query.Filter = BuildFilterText(event);
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
            severity: 'success', summary: 'Success', detail: 'Data have been deleted successfully',
          });
        });
      },
    });
  }
}
