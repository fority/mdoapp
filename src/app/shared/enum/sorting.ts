import { AllEnumType, SType, SortOperator } from './enum';

type SortTableType =
  | NormalTableModel<string>
  | FilterTableModel<string>
  | SortTableModel<string>
  | DateTableModel<string>
  | SEnumTableModel<string>;
export { SortTableType as SortTableModelType };

export interface HeadersSort {
  Title: string;
  NameColumn?: string;
  SortingType?: SType;
  OperatorType?: SortOperator;
  /**
   * @param {Enum} AllEnumType
   */
  FilterOption?: any;
  Flag?: boolean;
  SortBy?: 'asc' | 'desc';
}

export class Sorting<T> {
  Title: string = '';
  NameColumn: string = '';
  SortingType: SType = SType.None;
  SortBy: string = '';
  SortByFlag: string | 'asc' | 'desc' = '';
  FilterBy: string = '';
  SearchFilter: string = '';
  Flag: boolean = false;
  AlignFlag: boolean = false;
  FilterOption: any;
  OperatorType: SortOperator = SortOperator.ContainEqual;
  value: T | undefined;

  constructor(title: string) {
    this.Title = title;
  }

  public toString(searchText: string): string {
    return searchText;
  }

  public assignSortBy(_sort: string) {
    this.SortByFlag = _sort;
    this.SortBy = `${_sort == 'asc' ? '' : '-'}${this.NameColumn}`;
  }

  public assignFilterBy(searchText: string) {
    if (searchText !== '') {
      this.SearchFilter = searchText;
      this.FilterBy = this.toString(searchText);
    }
  }

  public clear() {}
}

export class NormalTableModel<T> extends Sorting<T> {
  override AlignFlag = true;
}

export class SortTableModel<T> extends Sorting<T> {
  override SortingType = SType.Sort;

  constructor(title: string, nameColumn: string) {
    super(title);
    this.NameColumn = nameColumn;
  }
}

export class FilterTableModel<T> extends Sorting<T> {
  override SortingType = SType.Filter;

  constructor(
    title: string,
    nameColumn: string,
    operatorType = SortOperator.ContainEqual
  ) {
    super(title);
    this.NameColumn = nameColumn;
    // this.SearchFilter = `${nameColumn}${operatorType}`;
    this.OperatorType = operatorType;
  }

  public override toString(searchText: string): string {
    const result = '';
    return result.concat(this.NameColumn, this.OperatorType, searchText);
  }
}

export class DateTableModel<T> extends Sorting<T> {
  override SortingType = SType.Date;

  constructor(title: string, nameColumn: string) {
    super(title);
    this.NameColumn = nameColumn;
  }
}

export class SEnumTableModel<T> extends Sorting<T> {
  override SortingType = SType.SEnum;
  override OperatorType = SortOperator.EqualTo;

  constructor(title: string, nameColumn: string, filterOption: AllEnumType) {
    super(title);
    this.NameColumn = nameColumn;
    this.FilterOption = filterOption;
  }

  public override toString(searchText: string): string {
    const result = '';
    return result.concat(this.NameColumn, this.OperatorType, searchText);
  }
}
