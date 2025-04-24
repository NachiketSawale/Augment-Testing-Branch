/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfIStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	RfistatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
	IsLive: boolean;
}
