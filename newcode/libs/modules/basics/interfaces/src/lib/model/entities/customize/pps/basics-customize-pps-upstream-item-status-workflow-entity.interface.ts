/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsUpstreamItemStatusWorkflowEntity extends IEntityBase, IEntityIdentification {
	UpstreamItemStatusRuleFk: number;
	ClerkFk: number;
	TemplateFk: number;
	IsBeforeStatus: boolean;
	IsMandatory: boolean;
	Sorting: number;
	IsLive: boolean;
}
