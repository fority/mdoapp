import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { BaseResponse, httpOptions } from '../core/models/sharedModels';
import { BaseSettingService } from '../core/services/basesetting.service';
import { CreateMdoHeaderRequest, MDOHeaderDto, UpdateMDOLineRequest } from '../models/mdo';
import { CreateReasonCodeRequest, ReasonCodeDto, UpdateReasonCodeRequest } from '../models/reason-code';
import {
  CreateRequestByRequest,
  RequestByDto,
  UpdateRequestByRequest,
} from '../models/requestBy';
import {
  CreateShipToRequest,
  ShipToDto,
  UpdateShipToRequest,
} from '../models/shipTo';
import {
  CreateShipperRequest,
  ShipperDto,
  UpdateShipperRequest,
} from '../models/shipper';
import { CreateUOMRequest, UOMDto, UpdateUOMRequest } from '../models/uom';

const blobOptions = { responseType: 'blob' as 'json' };

@Injectable({ providedIn: 'root' })
export class MdoService extends BaseSettingService<
  MDOHeaderDto,
  CreateMdoHeaderRequest,
  UpdateMDOLineRequest
> {
  constructor() {
    super('api/Mdo');
  }
  urlCreator = 'api/Mdo';

  Return(Id: string, LineId: string): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', Id).append('LineId', LineId);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Return`, undefined, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap((res) => this.ShowErrorMessage(res))
      );
  }

  Cancel(Id: string): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', Id);
    return this.httpClient
      .post<BaseResponse>(`${this.ApiUrl}/Cancel`, undefined, {
        ...httpOptions,
        params,
      })
      .pipe(
        retry(1),
        tap((res) => this.ShowErrorMessage(res))
      );
  }

  DownloadPdf(id: string): Observable<BaseResponse> {
    const params = new HttpParams().append('Id', id);
    return this.httpClient.get<BaseResponse>(`${this.ApiUrl}/DownloadPdf`, {
      params,
      ...blobOptions,
    });
  }

  ExportToExcel() {
    return this.httpClient.get<string[]>(
      `${this.ApiUrl}/ExportToExcel`,
      blobOptions
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ReasonCodeService extends BaseSettingService<
  ReasonCodeDto,
  CreateReasonCodeRequest,
  UpdateReasonCodeRequest
> {
  constructor() {
    super('api/ReasonCode');
  }
}

@Injectable({
  providedIn: 'root',
})
export class RequestByService extends BaseSettingService<
  RequestByDto,
  CreateRequestByRequest,
  UpdateRequestByRequest
> {
  constructor() {
    super('api/RequestBy');
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShipperService extends BaseSettingService<
  ShipperDto,
  CreateShipperRequest,
  UpdateShipperRequest
> {
  constructor() {
    super('api/Shipper');
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShipToService extends BaseSettingService<
  ShipToDto,
  CreateShipToRequest,
  UpdateShipToRequest
> {
  constructor() {
    super('api/ShipTo');
  }
}

@Injectable({
  providedIn: 'root',
})
export class UOMService extends BaseSettingService<
  UOMDto,
  CreateUOMRequest,
  UpdateUOMRequest
> {
  constructor() {
    super('api/UOM');
  }
}
