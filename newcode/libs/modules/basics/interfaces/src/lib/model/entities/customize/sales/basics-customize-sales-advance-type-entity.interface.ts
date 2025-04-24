/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSalesAdvanceTypeEntity extends IEntityBase, IEntityIdentification {
	LedgerContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Account1Fk: number;
	Account2Fk: number;
	TaxCodeFk: number;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Userdefined4: string;
	Userdefined5: string;
}
