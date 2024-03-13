import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, retry, shareReplay, tap } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { environment } from 'src/environments/environment';
import { DefaultPage, DefaultPageSize, GridifyQueryExtend, PagingContent, httpOptions } from '../models/sharedModels';
import { BaseResponse, BaseResponseWithData } from './../models/sharedModels';

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

  Get(page = DefaultPage, pageSize = DefaultPageSize, searchText = ''): Observable<PagingContent<T>> {
    const params = new HttpParams().append('Page', page).append('PageSize', pageSize).append('SearchText', searchText);
    return this.httpClient.get<BaseResponseWithData<PagingContent<T>>>(`${this.ApiUrl}/Get`, { ...httpOptions, params, }).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  };

  AdvancedFilter(page: number = DefaultPage, pageSize: number = DefaultPageSize, filters: string = '', sorts: string = ''): Observable<PagingContent<T>> {
    let params = new HttpParams().append('Page', page).append('PageSize', pageSize).append('Filters', filters).append('Sorts', sorts);
    return this.httpClient.get<BaseResponseWithData<PagingContent<T>>>(`${environment.ApiBaseUrl}/${this.url}/AdvancedFilter`, { ...httpOptions, params, }).pipe(
      retry(1),
      tap((resp) => this.ShowErrorMessage(resp)),
      map((resp) => resp.Data)
    );
  };

  GetById(data: string): Observable<T> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient.get<BaseResponseWithData<T>>(`${this.ApiUrl}/GetById`, { ...httpOptions, params, }).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  };

  Delete(data: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', data);
    return this.httpClient.delete<BaseResponse>(`${this.ApiUrl}/Delete`, { ...httpOptions, params }).pipe(tap(this.ShowErrorMessage));
  };

  AutoCompleteList(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.ApiUrl}/AutoCompleteList`, httpOptions).pipe(
      map((resp) => resp || []),
      shareReplay(1)
    );
  }

  GetMany(data: GridifyQueryExtend): Observable<PagingContent<T>> {
    let params = new HttpParams().append('Page', data.Page).append('PageSize', data.PageSize);
    if (data.OrderBy !== null) {
      params = params.append('OrderBy', data.OrderBy);
    }
    if (data.Filter !== null) {
      params = params.append('Filter', data.Filter);
    }
    if (data.Includes !== null) {
      params = params.append('Includes', data.Includes);
    }
    if (data.Select !== null) {
      params = params.append('Select', data.Select);
    }

    return this.httpClient.get<BaseResponseWithData<PagingContent<T>>>(`${this.ApiUrl}/GetMany`, { ...httpOptions, params }).pipe(
      retry(1),
      tap(this.ShowErrorMessage),
      map((resp) => resp.Data)
    );
  }

  GetOne(data: GridifyQueryExtend): Observable<T> {
    let params = new HttpParams().append('Page', data.Page).append('PageSize', data.PageSize);
    if (data.OrderBy !== null) {
      params = params.append('OrderBy', data.OrderBy);
    }
    if (data.Filter !== null) {
      params = params.append('Filter', data.Filter);
    }
    if (data.Includes !== null) {
      params = params.append('Includes', data.Includes);
    }
    if (data.Select !== null) {
      params = params.append('Select', data.Select);
    }
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
