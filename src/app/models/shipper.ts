export interface ShipperDto {
  Id: string;
  Name: string;
  Description: string;
}
export interface CreateShipperRequest {
  Name: string;
  Description: string;
}
export interface UpdateShipperRequest extends CreateShipperRequest {
  Id: string;
}
