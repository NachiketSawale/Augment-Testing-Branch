/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTextModuleTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	HasRubric: boolean;
	HasCompany: boolean;
	HasRole: boolean;
	HasClerk: boolean;
	HasPortalGrp: boolean;
	IsGlobal: boolean;
	TextAreaFk: number;
}
