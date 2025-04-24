/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	StatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	IsLive: boolean;
	Sorting: number;
	ClerkFk: number;
}
