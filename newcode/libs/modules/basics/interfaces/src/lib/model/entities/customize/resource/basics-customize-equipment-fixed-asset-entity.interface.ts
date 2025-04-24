/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentFixedAssetEntity extends IEntityBase, IEntityIdentification {
	EquipmentContextFk: number;
	Asset: string;
	Description: string;
	CompanyFk: number;
	Inactive: boolean;
	Blocked: boolean;
	StartDate: Date | string;
	EndDate: Date | string;
}
