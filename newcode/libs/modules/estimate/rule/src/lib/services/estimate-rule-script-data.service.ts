/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EstimateRuleDataService} from './estimate-rule-data.service';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
import {EstRuleComplete} from '../model/est-rule-complete.class';
import {EstimateRuleScriptBaseDataService, EstimateRuleScriptBaseEntity} from '@libs/estimate/shared';

@Injectable({
	providedIn: 'root'
})
export class EstimateRuleScriptDataService extends EstimateRuleScriptBaseDataService<EstimateRuleScriptBaseEntity, IEstRuleEntity, EstRuleComplete >{
	public constructor() {
		super(inject(EstimateRuleDataService),{
			itemNam: 'EstRuleScript'
		});
	}
}



