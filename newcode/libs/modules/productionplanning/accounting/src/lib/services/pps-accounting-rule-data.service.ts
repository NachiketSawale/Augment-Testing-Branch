/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable } from '@angular/core';

import {
	DataServiceFlatLeaf,
	IDataServiceOptions,
	ServiceRole,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IEntityList
} from '@libs/platform/data-access';

import { IRuleEntity, IRuleSetEntity, PpsAccountingRuleSetComplete } from '../model/models';
import { PpsAccountingRulesetDataService } from './pps-accounting-ruleset-data.service';

@Injectable({
	providedIn: 'root'
})

export class PpsAccountingRuleDataService extends DataServiceFlatLeaf<IRuleEntity, IRuleSetEntity, PpsAccountingRuleSetComplete> {

	private sourceRules: IRuleEntity[];

	public getSourceRule(): IRuleEntity[] {
		return this.sourceRules;
	}

	public setSourceRule(rules: IRuleEntity[]) {
		this.sourceRules = rules;
	}

	public constructor(parentService: PpsAccountingRulesetDataService) {
		const options: IDataServiceOptions<IRuleEntity> = {
			apiUrl: 'productionplanning/accounting/rule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getbyruleset',
				usePost: true,
				prepareParam: (ident) => {
					return {
						Pkey1: this.getSelectedParent()?.Id
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IRuleEntity, IRuleSetEntity, PpsAccountingRuleSetComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Rules',
				parent: parentService,
			},
		};
		super(options);

		this.sourceRules = [];
	}

	private transferModification2Complete(complete: PpsAccountingRuleSetComplete, modified: IRuleEntity[], deleted: IRuleEntity[]) {
		if (modified && modified.length > 0) {
			complete.RulesToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.RulesToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: PpsAccountingRuleSetComplete, entityList: IEntityList<IRuleEntity>) {
		if (complete && complete.RulesToSave && complete.RulesToSave.length > 0) {
			entityList.updateEntities(complete.RulesToSave);
		}
	}

	protected override onLoadSucceeded(loaded: object): IRuleEntity[] {
		if (loaded) {
			return get(loaded, 'Main')! as IRuleEntity[];
		}
		return [];
	}

	public pasteRule(rule: IRuleEntity){
		const parent = this.getSelectedParent();
		if(rule && parent) {
			rule.RuleSetFk = parent.Id;
		}

		this.append(rule);
		this.select(rule);
		this.setModified(rule);
	}
}
