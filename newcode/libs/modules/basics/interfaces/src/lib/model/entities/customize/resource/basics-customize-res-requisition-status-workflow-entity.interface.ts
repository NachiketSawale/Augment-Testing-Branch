/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	RequisitionstatruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
}
