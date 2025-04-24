/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRequisitionStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	ReqStatusruleFk: number;
	ClerkFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
}
