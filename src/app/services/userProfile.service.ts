import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FxtIdServerUserDto } from '../models/fxtIdServerUserModels';
import { CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileDto } from '../models/userProfile';
import { BaseResponse, BaseResponseWithData, BaseSettingService, httpOptions, PagingContent } from 'fxt-core';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseSettingService<UserProfileDto, CreateUserProfileRequest, UpdateUserProfileRequest> {
  userProfileSubject = new ReplaySubject<UserProfileDto>();
  constructor() {
    super(`${environment.ApiBaseUrl}/api/UserProfile`);
  }

  UpdateUserProfile(message: UserProfileDto) {
    this.userProfileSubject.next(message);
  }

  FxtGetUser(): Observable<PagingContent<FxtIdServerUserDto>> {
    return this.httpClient.get<BaseResponseWithData<PagingContent<FxtIdServerUserDto>>>(`${this.ApiUrl}/FxtGetUser`, httpOptions).pipe(
      tap((resp) => this.ShowErrorMessage(resp)),
      map((x) => x.Data || [])
    );
  }

  FxtImportUser(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient.post<BaseResponse>(`${this.ApiUrl}/FxtImportUser`, null, { ...httpOptions, params }).pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }

  Enable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient.post<BaseResponse>(`${this.ApiUrl}/Enable`, null, { ...httpOptions, params }).pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }

  Disable(id: string): Observable<BaseResponse> {
    let params = new HttpParams().append('Id', id);
    return this.httpClient.post<BaseResponse>(`${this.ApiUrl}/Disable`, null, { ...httpOptions, params }).pipe(tap((resp) => this.ShowErrorMessage(resp)));
  }
}
