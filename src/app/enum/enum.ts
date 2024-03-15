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
