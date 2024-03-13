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

export interface PagingSettings {
  page: number;
  pageSize: number;
  searchText: string;
  filter?: string | null;
  sort?: string | null;
}

export const DefaultPage = 1;
export const DefaultPageSize = 10;

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'Application/json' }),
};

export interface GridifyQueryExtend {
  Page: number;
  PageSize: number;
  OrderBy: string | null;
  Filter: string | null;
  Includes: string | null;
  Select: string | null;
}
