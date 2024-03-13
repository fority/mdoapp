export interface Region {
  Id: string;
  Name: string;
}

export interface CreateRegionRequest {
  Name: string;
}
export interface UpdateRegionRequest extends CreateRegionRequest {
  Id: string;
}
