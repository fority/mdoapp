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

export enum MDOStatus {
  None = 0,
  POSTED = 10,
  RETURNED = 20,
  CANCELED = 90,
}
export enum MDOAction {
  RETURNED = 20,
  CANCELED = 90,
}

export enum UserType {
  STAFF = 0,
  CUSTOMER = 1,
}
