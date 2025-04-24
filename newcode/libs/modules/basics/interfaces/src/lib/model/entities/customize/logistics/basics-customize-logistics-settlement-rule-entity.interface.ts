/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsSettlementRuleEntity extends IEntityBase, IEntityIdentification {
	SettlementstatusFk: number;
	SettlementstatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
