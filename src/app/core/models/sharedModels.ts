import { HttpHeaders } from '@angular/common/http';

export interface SelectOption<T> {
  value: T;
  label: string;
}
export interface BaseResponseWithData<T> extends BaseResponse {
  Data: T;
}
export interface BaseResponse {
  Success: boolean;
  Message: string;
}

export interface PagingContent<T> {
  TotalElements: number;
  Content: T[];
}

export const DefaultPage = 1;
export const DefaultPageSize = 10;

export const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'Application/json' }) };
export const blobOptions = { responseType: 'blob' as 'json' };
