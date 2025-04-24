/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostcodeAssignDetailEntity } from '../est-costcode-assign-detail-entity.interface';
import { IEstTotalsConfigDetailEntity } from '../est-totals-config-detail-entity.interface';
import { IBasicsCustomizeEstTotalsConfigTypeEntity } from '@libs/basics/interfaces';

export interface ITotalsConfigComplete {
	estTolConfigTypeFk?: number | null;
	isEditTolConfigType?: boolean | null;
	estTotalsConfigDesc?: string | null;
	ActivateLeadingStr?: boolean | null;
	LeadingStr?: number | null;
	LeadingStrPrjCostgroup?: string | null;
	LeadingStrEntCostgroup?: number | null;
	EstTotalsConfigDetails?: IEstTotalsConfigDetailEntity[] | null;
	costCodeAssignmentDetails?: IEstCostcodeAssignDetailEntity[] | null;

	/*
	 * EstTotalsConfigType
	 */
	EstTotalsConfigType?: IBasicsCustomizeEstTotalsConfigTypeEntity | null;

	/*
	 * IsUpdTotals
	 */
	IsUpdTotals?: boolean | null;
}
