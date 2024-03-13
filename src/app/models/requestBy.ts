export interface RequestByDto {
  Id: string;
  Name: string;
}
export interface CreateRequestByRequest {
  Name: string;
}
export interface UpdateRequestByRequest extends CreateRequestByRequest {
  Id: string;
}
