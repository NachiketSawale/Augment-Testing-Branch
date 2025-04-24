/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	MaterialStatusRuleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
	IsLive: boolean;
}
