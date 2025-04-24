/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBaselineSpecEntity extends IEntityBase, IEntityIdentification {
	Description: string;
	Remark: string;
	CompanyFk: number;
	Sorting: number;
	IsLive: boolean;
}
