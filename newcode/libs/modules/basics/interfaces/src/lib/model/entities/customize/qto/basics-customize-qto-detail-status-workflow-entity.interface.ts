/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoDetailStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	DetailStatusRuleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	IsLive: boolean;
	Sorting: number;
	ClerkFk: number;
}
