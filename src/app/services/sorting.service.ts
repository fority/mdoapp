import { Injectable } from '@angular/core';

import { SType, SortOperator } from '../shared/enum/enum';
import {
  DateTableModel,
  FilterTableModel,
  HeadersSort,
  NormalTableModel,
  SEnumTableModel,
  SortTableModel,
  SortTableModelType,
} from '../shared/enum/sorting';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  activeHeaders = [] as HeadersSort[];
  public sortHeaders = [] as SortTableModelType[];

  constructor() {}

  public LoadSortHeader(): SortTableModelType[] {
    this.sortHeaders = [];
    let sortHeader: SortTableModelType;
    this.activeHeaders.forEach((header) => {
      switch (header.SortingType) {
        case SType.Sort:
          sortHeader = header.NameColumn
            ? new SortTableModel(header.Title, header.NameColumn)
            : new NormalTableModel(header.Title);
          break;
        case SType.Filter:
          sortHeader = header.NameColumn
            ? new FilterTableModel(
                header.Title,
                header.NameColumn,
                header.OperatorType
              )
            : new NormalTableModel(header.Title);
          break;
        case SType.Date:
          sortHeader = header.NameColumn
            ? new DateTableModel(header.Title, header.NameColumn)
            : new NormalTableModel(header.Title);
          break;
        case SType.SEnum:
          sortHeader = header.NameColumn
            ? new SEnumTableModel(
                header.Title,
                header.NameColumn,
                header.FilterOption
              )
            : new NormalTableModel(header.Title);
          break;
        default:
          sortHeader = new NormalTableModel(header.Title);
          break;
      }
      this.sortHeaders.push(sortHeader);
    });
    // console.log(this.sortHeaders);
    return this.sortHeaders;
  }

  public SearchAll(searchText: string) {
    let query = '';
    const temp = [] as string[];
    this.sortHeaders.forEach((sortHeader) => {
      if (
        sortHeader instanceof FilterTableModel &&
        sortHeader.OperatorType === SortOperator.ContainEqual
      ) {
        temp.push(sortHeader.NameColumn);
      }
    });
    query = temp.join('|');
    query = query.concat(SortOperator.ContainEqual, searchText);
    // console.log('🚀 ~ query', query);
    return query;
  }

  public SortByColumn() {
    let query = '';
    const temp = [] as string[];
    this.sortHeaders.forEach((sortHeader) => {
      if (!(sortHeader instanceof NormalTableModel)) {
        if (sortHeader.SortBy) {
          temp.push(sortHeader.SortBy);
        }
      }
    });
    query = temp.join(',');
    // console.log('🚀 ~ query', query);
    return query;
  }

  public FilterByColumn() {
    let query = '';
    const temp = [] as string[];
    this.sortHeaders.forEach((sortHeader) => {
      if (sortHeader instanceof FilterTableModel || SortTableModel) {
        if (sortHeader.FilterBy) {
          temp.push(sortHeader.FilterBy);
        }
      }
    });
    query = temp.join(',');
    // console.log('🚀 ~ query', query);
    return query;
  }

  public ResetHeader(): SortTableModelType[] {
    return this.LoadSortHeader();
  }
}
