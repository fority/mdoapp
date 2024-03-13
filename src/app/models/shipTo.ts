export interface ShipToDto {
  Id: string;
  Name: string;
  Address: string;
}
export interface CreateShipToRequest {
  Name: string;
  Address: string;
}
export interface UpdateShipToRequest extends CreateShipToRequest {
  Id: string;
}
