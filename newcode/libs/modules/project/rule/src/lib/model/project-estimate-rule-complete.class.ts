/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {EstimateRuleBaseComplete} from '@libs/estimate/interfaces';
import {EstimateRuleScriptBaseEntity} from '@libs/estimate/shared';

export class ProjectEstimateRulesComplete implements CompleteIdentification<EstimateRuleBaseComplete>{

	/*
     * PrjEstRuleScriptToSave
     */
	public PrjEstRuleScriptToSave: EstimateRuleScriptBaseEntity[] | null = [];
}
