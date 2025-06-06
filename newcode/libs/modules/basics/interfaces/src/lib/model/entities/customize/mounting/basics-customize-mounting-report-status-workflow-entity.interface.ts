/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingReportStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	ClerkFk: number;
	RepStatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
}
