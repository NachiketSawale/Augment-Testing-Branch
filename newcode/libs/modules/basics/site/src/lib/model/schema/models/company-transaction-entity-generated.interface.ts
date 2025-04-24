/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';

export interface ICompanyTransactionEntityGenerated {
  Account?: string;
  Amount?: number;
  AmountOc?: number;
  BilHeaderFk?: number;
  CompanyTransheaderEntity?: ICompanyTransheaderEntity;
  CompanyTransheaderFk?: number;
  ControllingUnitAssign01?: string;
  ControllingUnitAssign01Desc?: string;
  ControllingUnitAssign02?: string;
  ControllingUnitAssign02Desc?: string;
  ControllingUnitAssign03?: string;
  ControllingUnitAssign03Desc?: string;
  ControllingUnitAssign04?: string;
  ControllingUnitAssign04Desc?: string;
  ControllingUnitAssign05?: string;
  ControllingUnitAssign05Desc?: string;
  ControllingUnitAssign06?: string;
  ControllingUnitAssign06Desc?: string;
  ControllingUnitAssign07?: string;
  ControllingUnitAssign07Desc?: string;
  ControllingUnitAssign08?: string;
  ControllingUnitAssign08Desc?: string;
  ControllingUnitAssign09?: string;
  ControllingUnitAssign09Desc?: string;
  ControllingUnitAssign10?: string;
  ControllingUnitAssign10Desc?: string;
  ControllingUnitCode?: string;
  Currency?: string;
  DocumentType?: string;
  Id?: number;
  InvHeaderFk?: number;
  IsCancel?: boolean;
  NominalDimension?: string;
  NominalDimension2?: string;
  NominalDimension3?: string;
  OffsetAccount?: string;
  OffsetContUnitAssign01?: string;
  OffsetContUnitAssign01Desc?: string;
  OffsetContUnitAssign02?: string;
  OffsetContUnitAssign02Desc?: string;
  OffsetContUnitAssign03?: string;
  OffsetContUnitAssign03Desc?: string;
  OffsetContUnitAssign04?: string;
  OffsetContUnitAssign04Desc?: string;
  OffsetContUnitAssign05?: string;
  OffsetContUnitAssign05Desc?: string;
  OffsetContUnitAssign06?: string;
  OffsetContUnitAssign06Desc?: string;
  OffsetContUnitAssign07?: string;
  OffsetContUnitAssign07Desc?: string;
  OffsetContUnitAssign08?: string;
  OffsetContUnitAssign08Desc?: string;
  OffsetContUnitAssign09?: string;
  OffsetContUnitAssign09Desc?: string;
  OffsetContUnitAssign10?: string;
  OffsetContUnitAssign10Desc?: string;
  OffsetContUnitCode?: string;
  PesHeaderFk?: number;
  PostingArea?: number;
  PostingDate?: string;
  PostingNarritive?: string;
  PrjStockFk?: number;
  PrrHeaderDes?: string;
  PrrHeaderFk?: number;
  PrrItemE2cFk?: number;
  PrrItemFk?: number;
  Quantity?: number;
  TaxCode?: string;
  VoucherDate?: string;
  VoucherNumber?: string;
  WipHeaderFk?: number;
}
