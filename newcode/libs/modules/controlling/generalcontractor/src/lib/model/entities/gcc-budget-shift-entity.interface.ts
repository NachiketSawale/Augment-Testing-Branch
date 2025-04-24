/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IGccBudgetShiftEntityGenerated } from './gcc-budget-shift-entity-generated.interface';

export interface IGccBudgetShiftEntity extends IGccBudgetShiftEntityGenerated {
	SourceOrTarget?: string | null;
	PackageBudget: number;
	BudgetInPackNSub: number;
	AvaiBudget: number;
	ShiftBudget: number;
	TotalBudget: number;
	SorurceType?: boolean | null;
	__rt$data?: object | null;
}
