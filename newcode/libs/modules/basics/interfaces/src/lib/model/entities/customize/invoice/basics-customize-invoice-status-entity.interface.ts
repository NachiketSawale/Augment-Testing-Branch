/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeInvoiceStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsReadOnly: boolean;
	IsPosted: boolean;
	IsVirtual: boolean;
	IsChained: boolean;
	IsCanceled: boolean;
	IsStock: boolean;
	IsLive: boolean;
	AccessrightDescriptor01Fk: number;
	AccessrightDescriptor02Fk: number;
	AccessrightDescriptor03Fk: number;
	AccessrightDescriptor04Fk: number;
	AccessrightDescriptor05Fk: number;
	IsValidateReference: boolean;
	AccessrightDescriptorFk: number;
	ToBeVerifiedBl: boolean;
	IsVerifedBl: boolean;
	Code: string;
	IsReceiptLedger: boolean;
	AccessrightDescriptor06Fk: number;
	IsRevenueRecognition: boolean;
}
