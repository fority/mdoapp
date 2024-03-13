export interface ReasonCodeDto {
  Id: string;
  Reason: string;
  Description: string;
}
export interface CreateReasonCodeRequest {
  Reason: string;
  Description: string;
}
export interface UpdateReasonCodeRequest extends CreateReasonCodeRequest {
  Id: string;
}
