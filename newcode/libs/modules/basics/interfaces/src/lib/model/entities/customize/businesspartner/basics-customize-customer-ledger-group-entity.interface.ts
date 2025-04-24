/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCustomerLedgerGroupEntity extends IEntityBase, IEntityIdentification {
	SubledgerContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	AccountReceivables: string;
	AccountInstallment: string;
	RetentionReceivables: string;
	RetentionInstallment: string;
	BusinessGroup: string;
	DebtorGroup: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
