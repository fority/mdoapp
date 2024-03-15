import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BaseResponse,
  BaseResponseWithData,
  PagingContent,
  httpOptions,
} from '../core/models/sharedModels';
import { BaseSettingService } from '../core/services/basesetting.service';
import { FxtIdServerUserDto } from '../models/fxtIdServerUserModels';
import {
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UserProfileDto,
} from '../models/userProfile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseSettingService<
  UserProfileDto,
  CreateUserProfileRequest,
  UpdateUserProfileRequest
> {
  constructor() {
    super('api/UserProfile');
  }

  FxtGetUser(): Observable<PagingContent<FxtIdServerUserDto>> {
    return this.httpClient
      .get<BaseResponseWithData<PagingContent<FxtIdServerUserDto>>>(
        `${environment.ApiBaseUrl}/${this.url}/FxtGetUser`,
        httpOptions
      )
      .pipe(
        tap((resp) => this.ShowErrorMessage(resp)),
        map((x) => x.Data || [])
      );
  }

  FxtImportUser(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(
        `${environment.ApiBaseUrl}/${this.url}/FxtImportUser`,
        null,
        { ...httpOptions, params }
      )
      .pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }

  Enable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(
        `${environment.ApiBaseUrl}/${this.url}/Enable`,
        null,
        { ...httpOptions, params }
      )
      .pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }

  Disable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient
      .post<BaseResponse>(
        `${environment.ApiBaseUrl}/${this.url}/Disable`,
        null,
        { ...httpOptions, params }
      )
      .pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }
}