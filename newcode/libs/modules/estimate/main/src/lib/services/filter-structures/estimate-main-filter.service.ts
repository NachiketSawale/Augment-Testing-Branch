/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateCommonFilterService } from '@libs/estimate/common';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * @name EstimateMainFilterService
 * @description
 * EstimateMainFilterService for filtering e.g. line items container by combination of several filters.
 */
export class EstimateMainFilterService {
	private estimateCommonFilterServ = inject(EstimateCommonFilterService);
	private estimateMainServ = inject(EstimateMainService);
	 private structure2FilterIds: unknown[] = [];
	 private filterRequest: unknown;

	/**
	 * @name setFilterIds
	 * @methodOf EstimateMainFilterService
	 * @description sets selected filter Ids of from leading structures
	 * @param {string} key filter structure name
	 * @param {array number} ids filter structure name
	 */
	public setFilterIds(key: unknown, ids: number[]) {
		//this.structure2FilterIds[key] = ids;
		//const dataService = this.estimateCommonFilterServ.getServiceToBeFiltered();
		// if (dataService != null && typeof dataService.load === 'function') {
		//     dataService.load();
		// }
	}

	/**
	 * @name getAllFilterIds
	 * @methodOf EstimateMainFilterService
	 * @description get all filter Ids from selected leading structures
	 * @return {Array} leading structure2 filter Ids
	 */
	public getAllFilterIds() {
		return this.structure2FilterIds;
	}

	/**
	 * @name addLeadingStructureFilterSupport
	 * @methodOf EstimateMainFilterService
	 * @description activate support for filtering the leading structure on given property
	 * @param {object} leadingStructureDataService selected leading structure data service
	 * @param {string} propertyName selected property name
	 */
	public addLeadingStructureFilterSupport(leadingStructureDataService: unknown, propertyName: string) {
		// const dataService = this.estimateCommonFilterServ.getServiceToBeFiltered() || this.estimateMainServ;
		// // if (dataService != null && typeof dataService.getList === 'function') {
		// //     leadingStructureDataService.setItemFilter(function (item: any) {
		// //        // let ids = uniq(compact(map(dataService.getList(), propertyName)));
		// //         //return ids.indexOf(item.Id) >= 0;
		// //     });
		// // }
	}

	/**
	 * @name getFilterRequest
	 * @methodOf EstimateMainFilterService
	 * @description get filterRequest from selected leading structures
	 * @return {Array} filterRequest
	 */
	public getFilterRequest() {
		return this.filterRequest;
	}

	/**
	 * @name setFilterRequest
	 * @methodOf EstimateMainFilterService
	 * @description set filterRequest from selected leading structures
	 */
	public setFilterRequest(_filterRequest: unknown) {
		this.filterRequest = _filterRequest;
	}
}
