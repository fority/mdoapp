import { TableLazyLoadEvent } from 'primeng/table';

export interface GridifyQueryExtend {
  Page: number;
  PageSize: number;
  OrderBy: string | null;
  Filter: string | null;
  Includes: string | null;
  Select: string | null;
}

export enum FilterOperator {
  'Equals' = '=',
  'NotEquals' = '!=',
  'GreaterThan' = '>',
  'LessThan' = '<',
  'GreaterThanOrEqualTo' = '>=',
  'LessThanOrEqualTo' = '<=',
  'Contains' = '=*',
  'NotContains' = '!*',
  'StartsWith' = '^',
  'NotStartsWith' = '!^',
  'EndsWith' = '$',
  'NotEndsWith' = '!$',
}
export const FilterOperatorSelectOption = [
  { label: 'Equals', value: FilterOperator.Equals },
  { label: 'NotEquals', value: FilterOperator.NotEquals },
  { label: 'GreaterThan', value: FilterOperator.GreaterThan },
  { label: 'LessThan', value: FilterOperator.LessThan },
  { label: 'GreaterThanOrEqualTo', value: FilterOperator.GreaterThanOrEqualTo },
  { label: 'LessThanOrEqualTo', value: FilterOperator.LessThanOrEqualTo },
  { label: 'Contains', value: FilterOperator.Contains },
  { label: 'NotContains', value: FilterOperator.NotContains },
  { label: 'Starts With', value: FilterOperator.StartsWith },
  { label: 'NotStartsWith', value: FilterOperator.NotStartsWith },
  { label: 'EndsWith', value: FilterOperator.EndsWith },
  { label: 'NotEndsWith', value: FilterOperator.NotEndsWith },
];

export const FilterOperatorDateSelectOption = [
  { label: 'Equals', value: FilterOperator.Equals },
  { label: 'NotEquals', value: FilterOperator.NotEquals },
];

export const FilterOperatorTextSelectOption = [
  { label: 'Contains', value: FilterOperator.Contains },
  { label: 'NotContains', value: FilterOperator.NotContains },
  { label: 'Equals', value: FilterOperator.Equals },
  { label: 'NotEquals', value: FilterOperator.NotEquals },
];

export const FilterOperatorNumberSelectOption = [
  { label: 'Equals', value: FilterOperator.Equals },
  { label: 'NotEquals', value: FilterOperator.NotEquals },
  { label: 'GreaterThan', value: FilterOperator.GreaterThan },
  { label: 'LessThan', value: FilterOperator.LessThan },
  { label: 'GreaterThanOrEqualTo', value: FilterOperator.GreaterThanOrEqualTo },
  { label: 'LessThanOrEqualTo', value: FilterOperator.LessThanOrEqualTo },
];

export const BuildSortText = (event: TableLazyLoadEvent): string => {
  let sortText = '';
  if (event.sortField && event.sortOrder) {
    sortText = `${event.sortField} ${event.sortOrder < 0 ? 'desc' : 'asc'}`
  }
  return sortText;
};

export const BuildFilterText = (event: TableLazyLoadEvent): string => {
  let filterText = '';
  if (event.filters) {
    for (let [keys, values] of Object.entries(event.filters)) {
      if (keys && Array.isArray(values) && 'matchMode' in values[0] && 'value' in values[0] && values[0].value) {
        if (values[0].value instanceof Date) {
          //TODO fix this Date>=2024-03-15 00:00:00.0000000,Date<=2024-03-15 23:59:59.0000000
          values[0].value = values[0].value.getFullYear() + '-' + (values[0].value.getMonth() + 1) + '-' + values[0].value.getDate();
        }

        filterText = filterText.concat(`${keys}${values[0].matchMode}${values[0].value}`, ',');
      }
    }
    filterText = filterText.substring(0, filterText.length - 1);
  }
  return filterText;
};
