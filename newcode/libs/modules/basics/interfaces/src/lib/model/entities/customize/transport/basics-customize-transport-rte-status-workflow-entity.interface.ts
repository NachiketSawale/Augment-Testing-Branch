/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRteStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	RteStatusruleFk: number;
	ClerkFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
}
