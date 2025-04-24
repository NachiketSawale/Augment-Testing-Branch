/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEvaluationStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	EvalstatusruleFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	IsLive: boolean;
	ClerkFk: number;
}
