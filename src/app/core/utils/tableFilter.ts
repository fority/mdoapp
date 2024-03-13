import { FilterMetadata, SortMeta } from 'primeng/api';

export enum FilterOperator {
  'Equals' = '==',
  'NotEquals' = '!=',
  'GreaterThan' = '>',
  'LessThan' = '<',
  'GreaterThanOrEqualTo' = '>=',
  'LessThanOrEqualTo' = '<=',
  'Contains' = '@=',
  'StartsWith' = '_=',
}

export const FilterOperatorOptions = [
  { label: 'Starts With', value: FilterOperator.StartsWith },
  { label: 'Contains', value: FilterOperator.Contains },
];

export const GetSortText = (multiSort?: SortMeta[]): string => {
  let sortText = '';
  if (multiSort && multiSort.length > 0) {
    for (let { field, order } of multiSort) {
      sortText = sortText.concat(`${order < 0 ? '-' : ''}${field}`, ',');
    }
  }
  return sortText;
};

export const GetOrderBy = (multiSort?: SortMeta[]): string => {
  let sortText = '';
  if (multiSort && multiSort.length > 0) {
    for (let { field, order } of multiSort) {
      sortText = sortText.concat(`${field} ${order < 0 ? 'desc' : 'asc'}`);
    }
  }
  return sortText;
};

// export const GetOrderBy = (multiSort?: SortMeta[]): string => {
//   let sortText = '';
//   if (multiSort && multiSort.length > 0) {
//     for (let i = 0; i < multiSort.length; i++) {
//       const { field, order } = multiSort[i];
//       sortText = sortText.concat(`${field} ${order < 0 ? ' desc' : ' asc'}`);
//       if (i < multiSort.length - 1) {
//         sortText = sortText.concat(', '); // Add comma between multiple sorting fields
//       }
//     }
//   }
//   return sortText;
// };

export const GetFilterText = (multiFilter?: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }): string => {
  let filterText = '';
  if (multiFilter) {
    for (let [keys, values] of Object.entries(multiFilter)) {
      if (keys && Array.isArray(values) && 'matchMode' in values[0] && 'value' in values[0] && values[0].value) {
        filterText = filterText.concat(`${keys}${values[0].matchMode}${values[0].value}`, ',');
      }
    }
  }
  return filterText;
};

export const GetFilter = (multiFilter?: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }): string => {
  let filterText = '';
  if (multiFilter) {
    for (let [keys, values] of Object.entries(multiFilter)) {
      if (keys && Array.isArray(values) && 'matchMode' in values[0] && 'value' in values[0] && values[0].value) {
        filterText = filterText.concat(`${keys}=*${values[0].value}`);
      }
    }
  }
  return filterText;
};
