/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IInvHeaderLookupVEntityGenerated {
	/*
	 * AmountGross
	 */
	AmountGross: number;

	/*
	 * AmountNet
	 */
	AmountNet: number;

	/*
	 * AmountNetContract
	 */
	AmountNetContract: number;

	/*
	 * AmountNetContractOc
	 */
	AmountNetContractOc: number;

	/*
	 * AmountNetOther
	 */
	AmountNetOther: number;

	/*
	 * AmountNetOtherOc
	 */
	AmountNetOtherOc: number;

	/*
	 * AmountNetPes
	 */
	AmountNetPes: number;

	/*
	 * AmountNetPesOc
	 */
	AmountNetPesOc: number;

	/*
	 * AmountNetReject
	 */
	AmountNetReject: number;

	/*
	 * AmountNetRejectOc
	 */
	AmountNetRejectOc: number;

	/*
	 * AmountVatContract
	 */
	AmountVatContract: number;

	/*
	 * AmountVatContractOc
	 */
	AmountVatContractOc: number;

	/*
	 * AmountVatOther
	 */
	AmountVatOther: number;

	/*
	 * AmountVatOtherOc
	 */
	AmountVatOtherOc: number;

	/*
	 * AmountVatPes
	 */
	AmountVatPes: number;

	/*
	 * AmountVatPesOc
	 */
	AmountVatPesOc: number;

	/*
	 * AmountVatReject
	 */
	AmountVatReject: number;

	/*
	 * AmountVatRejectOc
	 */
	AmountVatRejectOc: number;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * DateInvoiced
	 */
	DateInvoiced: Date | string;

	/*
	 * DateReceived
	 */
	DateReceived: Date | string;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Icon
	 */
	Icon: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvStatusFk
	 */
	InvStatusFk: number;

	/*
	 * InvTypeFk
	 */
	InvTypeFk: number;

	/*
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/*
	 * IsChained
	 */
	IsChained: boolean;

	/*
	 * IsPosted
	 */
	IsPosted: boolean;

	/*
	 * IsProgress
	 */
	IsProgress: boolean;

	/*
	 * IsReadonly
	 */
	IsReadonly: boolean;

	/*
	 * IsVirtual
	 */
	IsVirtual: boolean;

	/*
	 * NetTotal
	 */
	NetTotal?: number | null;

	/*
	 * NetTotalOc
	 */
	NetTotalOc?: number | null;

	/*
	 * Period
	 */
	Period: number;

	/*
	 * PeriodOc
	 */
	PeriodOc?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * Reference
	 */
	Reference?: string | null;

	/*
	 * Result2
	 */
	Result2?: number | null;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/*
	 * StatusDescriptionInfo
	 */
	StatusDescriptionInfo?: IDescriptionInfo | null;

	/*
	 * TotalPerformedGross
	 */
	TotalPerformedGross: number;

	/*
	 * TotalPerformedNet
	 */
	TotalPerformedNet: number;

	/*
	 * TypeDescriptionInfo
	 */
	TypeDescriptionInfo?: IDescriptionInfo | null;

	/*
	 * VersionNo
	 */
	VersionNo: number;
}
