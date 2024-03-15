import { MDOStatus } from '../enum/enum';
import { ReasonCodeDto } from './reason-code';
import { RequestByDto } from './requestBy';
import { ShipToDto } from './shipTo';
import { ShipperDto } from './shipper';
import { UOMDto } from './uom';

export interface MDOHeaderDto {
  Id: string;
  RecordId: string;
  Date: Date;
  ShipDate: Date;
  ShipTo: ShipToDto;
  ShipAddress: string;
  Shipper: ShipperDto;
  RequestBy: RequestByDto;
  SORef: string;
  PORef: string;
  ProdRef: string;
  Remark: string;
  Status: number;
  ReasonCode: ReasonCodeDto;
  CollectFrom: boolean;
  MDOLines: MDOLineDto[];
}

export interface MDOLineDto {
  Id: string;
  Item: string;
  ItemDesc: string;
  Qty: number;
  UOM: UOMDto;
  LineStatus: MDOStatus;
  Remark: string;
  LotID: string;
}

export interface MdoRequest {
  Date: Date;
  ShipDate: Date;
  ShipToId: string;
  ShipAddress: string;
  ShipperId: string;
  RequestById: string;
  SORef: string;
  PORef: string;
  ProdRef: string;
  Remark: string;
  ReasonCodeId: string;
}

export interface MDOLineRequest {
  Item: string;
  ItemDesc: string;
  Qty: number;
  UOMId: string;
  LineStatus: number;
  Remark: string;
  LotID: string;
}

export interface CreateMdoHeaderRequest extends MdoRequest {
  MDOLines: CreateMDOLineRequest[];
}

export interface UpdateMdoHeaderRequest extends MdoRequest {
  Id: string;
  MDOLines: UpdateMDOLineRequest[];
}

export interface CreateMDOLineRequest extends MDOLineRequest { }

export interface UpdateMDOLineRequest extends MDOLineRequest {
  Id: string;
}
