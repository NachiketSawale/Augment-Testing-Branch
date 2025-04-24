/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportBundleStatusRuleEntity extends IEntityBase, IEntityIdentification {
	BundleStatusFk: number;
	BundleStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
