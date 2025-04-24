/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingComponentStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	ClerkFk: number;
	CompStatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
}
