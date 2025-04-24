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
	IDataServiceEndPointOptions
} from '@libs/platform/data-access';

import { IResultEntity, IRuleSetEntity, PpsAccountingRuleSetComplete } from '../model/models';
import { PpsAccountingRulesetDataService } from './pps-accounting-ruleset-data.service';

@Injectable({
	providedIn: 'root'
})

export class PpsAccountingResultDataService extends DataServiceFlatLeaf<IResultEntity, IRuleSetEntity, PpsAccountingRuleSetComplete> {

	public constructor(parentService: PpsAccountingRulesetDataService) {
		const
			options: IDataServiceOptions<IResultEntity> = {
				apiUrl: 'productionplanning/accounting/result',
				readInfo: <IDataServiceEndPointOptions>{
					endPoint: 'getbyruleset',
					usePost: true,
					prepareParam: (ident) => {
						return {
							PKey1: this.getSelectedParent()?.Id
						};
					}
				},
				roleInfo: <IDataServiceChildRoleOptions<IResultEntity, IRuleSetEntity, PpsAccountingRuleSetComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'Results',
					parent: parentService,
				},
			};
		super(options);
	}

	protected override onLoadSucceeded(loaded: object): IResultEntity[] {
		if (loaded) {
			return get(loaded, 'Main')! as IResultEntity[];
		}
		return [];
	}
}

		
			





