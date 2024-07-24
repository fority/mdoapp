import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridifyQueryExtend, DefaultPage, DefaultPageSize } from 'fxt-core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MDOHeaderDto } from 'src/app/models/mdo';
import { MdoService } from 'src/app/services/mdo.service';
import { SharedModule } from 'src/app/shared/module/SharedModule/SharedModule.module';

@Component({
  standalone: true,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  imports: [CommonModule, CardModule, TableModule, SharedModule],
})
export class DetailsComponent implements OnInit {
  private mdoService = inject(MdoService);
  private activatedRoute = inject(ActivatedRoute);
  mdoId: string = '';
  PagingSignal = signal<MDOHeaderDto>({} as MDOHeaderDto);

  ngOnInit() {
    this.mdoId = this.activatedRoute.snapshot.params['id'];

    let query: GridifyQueryExtend = {} as GridifyQueryExtend;

    query.Page = DefaultPage;
    query.PageSize = DefaultPageSize;
    query.OrderBy = null;
    query.Filter = `Id=${this.mdoId}`;
    query.Includes = 'ShipTo,Shipper,RequestBy,ReasonCode,MDOLines.UOM';
    query.Select = null;

    this.mdoService.GetOne(query).subscribe((res) => {
      this.PagingSignal.set(res);
    });
  }
}
