/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStock2MaterialStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	TemplateFk: number;
	Stock2MaterialStatusRuleFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
	IsLive: boolean;
}
