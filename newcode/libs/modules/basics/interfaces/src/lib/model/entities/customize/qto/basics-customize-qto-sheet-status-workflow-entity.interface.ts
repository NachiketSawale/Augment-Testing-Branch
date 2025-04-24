/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoSheetStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	SheetStatusRuleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	IsLive: boolean;
	Sorting: number;
	ClerkFk: number;
}
