// import { OIStatus_Internal } from '../models/orderinstructionModel';
type AllEnumType = TrueFalse;
export { AllEnumType };
export enum MessageBoxType {
  OKOnly,
  YesNo,
}

export enum TrueFalse {
  True = 0,
  False = 1,
}

export enum SType {
  None = 'None',
  Sort = 'Sort',
  Filter = 'Filter',
  Date = 'Date',
  SEnum = 'SEnum',
}

export enum SortOperator {
  ContainEqual = '@=',
  EqualTo = '==',
  GreaterThanEqual = '>=',
  SmallerThanEqual = '<=',
}
