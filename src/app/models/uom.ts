export interface UOMDto {
  Id: string;
  Name: string;
  Description: string;
}
export interface CreateUOMRequest {
  Name: string;
  Description: string;
}
export interface UpdateUOMRequest extends CreateUOMRequest {
  Id: string;
}
