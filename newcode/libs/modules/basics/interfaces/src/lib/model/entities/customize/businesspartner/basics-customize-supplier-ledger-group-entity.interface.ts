/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSupplierLedgerGroupEntity extends IEntityBase, IEntityIdentification {
	SubledgerContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	AccountPayables: string;
	AccountInstallment: string;
	RetentionPayables: string;
	RetentionInstallment: string;
	BusinessGroup: string;
	CreditorGroup: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
