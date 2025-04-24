/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSubsidiaryStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	ClerkFk: number;
	SubsidiaryStatusRuleFk: number;
	IsLive: boolean;
}
