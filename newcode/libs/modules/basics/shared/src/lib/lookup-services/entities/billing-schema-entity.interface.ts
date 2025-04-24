/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';
export interface IBillingSchemaEntity extends IEntityBase, IEntityIdentification {
	 Id: number;
	 LedgerContextFk: number;
	 Sorting: number;
	 IsDefault: boolean;
	 IsChained: boolean;
	 ValidFrom?: Date | string | null;
	 ValidTo?: Date | string | null;
	 Remark?: string | null;
	 UserDefined1?: string | null;
	 UserDefined2?: string | null;
	 UserDefined3?: string | null;
	 AutoCorrectVatLimit: number;
	 AutoCorrectNetLimit: number;
	 InvStatusOkFk?: number | null;
	 InvStatusErrorFk?: number | null;
	 IsChainedPes: boolean;
	 BilStatusOkFk?: number | null;
	 BilStatusErrorFk?: number | null;
	 Description?: string | null;
	 DescriptionInfo: IDescriptionInfo;
}
