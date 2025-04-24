/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectGroupStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	GroupStatusRuleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
}
