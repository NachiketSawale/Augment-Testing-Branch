/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
import {EstimateRuleBaseDataService} from '@libs/estimate/shared';
import {EstRuleComplete} from '../model/est-rule-complete.class';

@Injectable({
	providedIn: 'root'
})

export class EstimateRuleDataService extends EstimateRuleBaseDataService<IEstRuleEntity, EstRuleComplete> {

	public constructor() {
		super({
			itemName: 'EstimateRule',
			apiUrl:'estimate/rule/estimaterule',
			readEndPoint: 'tree',
			canCreate: true,
			canUpdate: true,
			canDelete: true,
			createEndPoint: 'create',
			updateEndPoint: 'update',
			deleteEndPoint: 'delete'
		});

		this.selectionChanged$.subscribe((entities) =>{
			if(entities.length){
				this.masterSelectionChanged();
			}
		});
	}

	public override childrenOf(element: IEstRuleEntity): IEstRuleEntity[] {
		if(element && element.EstRules){
			return element.EstRules as IEstRuleEntity[];
		}
		return [];
	}

	public override parentOf(element: IEstRuleEntity): IEstRuleEntity | null {
		if (element.EstRuleFk == null) {
			return null;
		}

		const parentId = element.EstRuleFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override getModificationsFromUpdate(complete: EstRuleComplete) {
		if (complete.EstimateRule === null) {
			return [];
		}
		return [complete.EstimateRule];
	}

	public override createUpdateEntity(modified: IEstRuleEntity | null): EstRuleComplete {
		const complete = new EstRuleComplete();
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
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstRuleEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: get(loaded, 'EstimateRuleList')! as IEstRuleEntity[]
		};
	}

	private masterSelectionChanged(){
	}
}



