/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
	StatusruleFk: number;
	IsLive: boolean;
}
