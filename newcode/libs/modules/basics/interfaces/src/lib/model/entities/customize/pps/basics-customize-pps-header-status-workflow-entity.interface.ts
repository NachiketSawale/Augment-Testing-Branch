/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsHeaderStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	ClerkFk: number;
	HeaderStatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	IsLive: boolean;
}
