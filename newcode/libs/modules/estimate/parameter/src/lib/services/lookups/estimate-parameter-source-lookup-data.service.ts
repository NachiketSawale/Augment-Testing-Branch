/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EstimateMainParamStructureConstant } from '@libs/estimate/main';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';

interface IEstimateParameterSourceLookup {
	Id: number;
	DescriptionInfo: {
		Description: string;
		Translated: string;
	};
	Code: string;
}

@Injectable({
	providedIn: 'root'
})

/**
 * This service used to get data for Source column of Estimate Parameter complex lookup
 */
export class EstimateParameterSourceLookupDataService extends UiCommonLookupItemsDataService<IEstimateParameterSourceLookup> {
	public constructor() {
		super([], {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}

	public strctContextItems = [
		{
			Id: EstimateMainParamStructureConstant.ProjectParam,
			Code: 'Project',
			DescriptionInfo: {
				Description: 'ProjectParam',
				Translated: 'estimate.parameter.projectParam',
			},
		},
		{
			Id: EstimateMainParamStructureConstant.GlobalParam,
			Code: 'Global',
			DescriptionInfo: {
				Description: 'GlobalParam',
				Translated: 'estimate.parameter.globalParam',
			},
		},
		{
			Id: EstimateMainParamStructureConstant.RuleParameter,
			Code: 'Rule',
			DescriptionInfo: {
				Description: 'RuleParameter',
				Translated: 'estimate.parameter.ruleParameter',
			},
		},
	];

	/**
	 * This function used to get data synchronously
	 */
	public getListSync(): IEstimateParameterSourceLookup[] {
		return this.strctContextItems;
	}

	/**
	 * This function used to get data asynchronously
	 */
	public getFilteredList(): Promise<IEstimateParameterSourceLookup[]> {
		return new Promise((resolve) => {
			resolve(this.strctContextItems);
		});
	}

	/**
	 * This function used to get data synchronously
	 */
	public async getListAsync(): Promise<IEstimateParameterSourceLookup[]> {
    const filteredItems = await this.getFilteredList();
    return filteredItems;
}

	/**
	 * This function used to get data based on value provided
	 */
	public getItemByVal(value: number) : IEstimateParameterSourceLookup | undefined {
		const item = this.strctContextItems.find((item) => item.Id === value);
		return item;
	}

	/**
	 * This function used to get data asynchronously based on value provided
	 */
	public getItemByIdAsync(value: number) : IEstimateParameterSourceLookup | undefined {
		return this.getItemByVal(value);
	}
}
