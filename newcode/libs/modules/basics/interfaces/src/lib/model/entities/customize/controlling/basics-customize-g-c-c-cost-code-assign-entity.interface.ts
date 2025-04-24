/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeGCCCostCodeAssignEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	ContextFk: number;
	CostCodeCostFk: number;
	CostCodeBudgetFk: number;
	CostCodeBudgetShiftFk: number;
	CostCodeAdditionalExpenseFk: number;
	CommentText: string;
}
