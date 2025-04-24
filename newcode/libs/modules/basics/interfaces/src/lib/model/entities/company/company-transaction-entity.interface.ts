/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';

export interface ICompanyTransactionEntity extends IEntityBase {
	Account?: string | null;
	Amount?: number | null;
	AmountOc?: number | null;
	BilHeaderFk?: number | null;
	CompanyTransheaderEntity?: ICompanyTransheaderEntity | null;
	CompanyTransheaderFk?: number | null;
	ControllingUnitAssign01?: string | null;
	ControllingUnitAssign01Desc?: string | null;
	ControllingUnitAssign02?: string | null;
	ControllingUnitAssign02Desc?: string | null;
	ControllingUnitAssign03?: string | null;
	ControllingUnitAssign03Desc?: string | null;
	ControllingUnitAssign04?: string | null;
	ControllingUnitAssign04Desc?: string | null;
	ControllingUnitAssign05?: string | null;
	ControllingUnitAssign05Desc?: string | null;
	ControllingUnitAssign06?: string | null;
	ControllingUnitAssign06Desc?: string | null;
	ControllingUnitAssign07?: string | null;
	ControllingUnitAssign07Desc?: string | null;
	ControllingUnitAssign08?: string | null;
	ControllingUnitAssign08Desc?: string | null;
	ControllingUnitAssign09?: string | null;
	ControllingUnitAssign09Desc?: string | null;
	ControllingUnitAssign10?: string | null;
	ControllingUnitAssign10Desc?: string | null;
	ControllingUnitCode?: string | null;
	Currency?: string | null;
	DocumentType?: string | null;
	Id?: number | null;
	InvHeaderFk?: number | null;
	IsCancel?: boolean | null;
	NominalDimension?: string | null;
	NominalDimension2?: string | null;
	NominalDimension3?: string | null;
	OffsetAccount?: string | null;
	OffsetContUnitAssign01?: string | null;
	OffsetContUnitAssign01Desc?: string | null;
	OffsetContUnitAssign02?: string | null;
	OffsetContUnitAssign02Desc?: string | null;
	OffsetContUnitAssign03?: string | null;
	OffsetContUnitAssign03Desc?: string | null;
	OffsetContUnitAssign04?: string | null;
	OffsetContUnitAssign04Desc?: string | null;
	OffsetContUnitAssign05?: string | null;
	OffsetContUnitAssign05Desc?: string | null;
	OffsetContUnitAssign06?: string | null;
	OffsetContUnitAssign06Desc?: string | null;
	OffsetContUnitAssign07?: string | null;
	OffsetContUnitAssign07Desc?: string | null;
	OffsetContUnitAssign08?: string | null;
	OffsetContUnitAssign08Desc?: string | null;
	OffsetContUnitAssign09?: string | null;
	OffsetContUnitAssign09Desc?: string | null;
	OffsetContUnitAssign10?: string | null;
	OffsetContUnitAssign10Desc?: string | null;
	OffsetContUnitCode?: string | null;
	PesHeaderFk?: number | null;
	PostingArea?: number | null;
	PostingDate?: string | null;
	PostingNarritive?: string | null;
	PrjStockFk?: number | null;
	PrrHeaderDes?: string | null;
	PrrHeaderFk?: number | null;
	PrrItemE2cFk?: number | null;
	PrrItemFk?: number | null;
	Quantity?: number | null;
	TaxCode?: string | null;
	VoucherDate?: string | null;
	VoucherNumber?: string | null;
	WipHeaderFk?: number | null;
}
