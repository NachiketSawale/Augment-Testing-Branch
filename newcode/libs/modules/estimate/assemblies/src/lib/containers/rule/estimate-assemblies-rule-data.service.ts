/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EstimateAssembliesRuleComplete } from '../../model/complete/estimate-assemblies-rule-complete.class';
import {EstimateRuleBaseDataService} from '@libs/estimate/shared';
import {IEstimateAssembliesRuleEntity} from '../../model/entities/estimate-assemblies-rule-entity.interface';
import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';


export const ESTIMATE_ASSEMBLIES_RULE_DATA_TOKEN = new InjectionToken<EstimateAssembliesRuleDataService>('estimateAssembliesRuleDataToken');

@Injectable({
	providedIn: 'root'
})







export class EstimateAssembliesRuleDataService extends EstimateRuleBaseDataService<IEstimateAssembliesRuleEntity, EstimateAssembliesRuleComplete> {

	public constructor() {
		super({
			itemName: 'EstimateRule',
			apiUrl:'estimate/rule/estimaterule',
			readEndPoint: 'tree'
		});
	}
	public override createUpdateEntity(modified: IEstimateAssembliesRuleEntity | null): EstimateAssembliesRuleComplete {
		const complete = new EstimateAssembliesRuleComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstimateAssembliesRuleEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: get(loaded, 'EstimateRuleList')! as IEstimateAssembliesRuleEntity[]
		};
	}

}

