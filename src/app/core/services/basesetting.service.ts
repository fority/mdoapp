import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, tap } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { environment } from 'src/environments/environment';
import { GridifyQueryExtend } from '../utils/GridifyHelpers';
import { BaseResponse, BaseResponseWithData, PagingContent, httpOptions } from './../models/sharedModels';

@Injectable({
  providedIn: 'root',
})
export class BaseSettingService<T, C, U> {
  public url: string;
  public httpClient = inject(HttpClient);
  public messageService = inject(MessageService);
  public loadingService = inject(LoadingService);


  constructor(@Inject('apiUrl') apiUrl: string) {
    this.url = apiUrl ?? '';
  }

  get ApiUrl() {
    return `${environment.ApiBaseUrl}/${this.url}`;
  }

  Create(data: C | FormData): Observable<T> {
    return this.httpClient.post<BaseResponseWithData<T>>(`${this.ApiUrl}/Create`, data, httpOptions).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  }

  Update(data: U | FormData): Observable<T> {
    return this.httpClient.put<BaseResponseWithData<T>>(`${this.ApiUrl}/Update`, data, httpOptions).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  }

  Delete(data: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient.delete<BaseResponse>(`${this.ApiUrl}/Delete`, { ...httpOptions, params }).pipe(tap(this.ShowErrorMessage));
  };

  GetMany(data: GridifyQueryExtend): Observable<PagingContent<T>> {
    let params = new HttpParams().append('Page', data.Page).append('PageSize', data.PageSize);
    if (data.OrderBy) params = params.append('OrderBy', data.OrderBy);
    if (data.Filter) params = params.append('Filter', data.Filter);
    if (data.Includes) params = params.append('Includes', data.Includes);
    if (data.Select) params = params.append('Select', data.Select);

    return this.httpClient.get<BaseResponseWithData<PagingContent<T>>>(`${this.ApiUrl}/GetMany`, { ...httpOptions, params }).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  }

  GetOne(data: GridifyQueryExtend): Observable<T> {
    let params = new HttpParams().append('Page', data.Page).append('PageSize', data.PageSize);
    if (data.OrderBy) params = params.append('OrderBy', data.OrderBy);
    if (data.Filter) params = params.append('Filter', data.Filter);
    if (data.Includes) params = params.append('Includes', data.Includes);
    if (data.Select) params = params.append('Select', data.Select);

    return this.httpClient.get<BaseResponseWithData<T>>(`${this.ApiUrl}/GetOne`, { ...httpOptions, params }).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  }

  ShowErrorMessage = (respond: { Success: boolean; Message: string } | any) => {
    if (!respond?.Success) {
      this.messageService.add({ severity: 'error', summary: 'Apps', detail: respond.Message });
      this.loadingService.stop();
      throw new Error('App return false');
    }
  };
}
