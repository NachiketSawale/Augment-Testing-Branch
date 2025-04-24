/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IFilterDefinitionInfo } from '@libs/basics/interfaces';

interface FilterDictionary {
	[key: string]: IFilterDefinitionInfo | null;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonFilterDataService {
	private filterDic: FilterDictionary = {};

	/**
	 * get filter.
	 */
	public getSelectedFilter(key: string) {
		return this.filterDic && Object.prototype.hasOwnProperty.call(this.filterDic, key) ? this.filterDic[key] : null;
	}

	/**
	 * set filter.
	 */
	public setSelectedFilter(key: string, filterDto: IFilterDefinitionInfo) {
		this.filterDic[key] = filterDto;
	}

	/**
	 * clear selected filter.
	 */
	public clearSelectedFilter(key: string) {
		this.filterDic[key] = null;
	}

	/**
	 * clear all filter.
	 */
	public clearAllFilter() {
		this.filterDic = {};
	}
}
