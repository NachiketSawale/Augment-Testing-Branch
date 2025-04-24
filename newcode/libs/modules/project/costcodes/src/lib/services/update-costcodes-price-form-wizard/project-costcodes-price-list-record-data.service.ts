/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root',
})

export class ProjectCostcodesPriceListRecordDataService {

	public incorporateDataRead(responseData:PrjCostCodesEntity[], data:PrjCostCodesEntity) {
		// TODO - Dynamic column service
		// const basCostCodes = responseData.filter((item) =>{
		// 	return item.Id === -1;
		// });	
		
		// let basCostCodesColumnService = inject(ProjectCostCodesPriceListRecordBasCostCodesColumnService);
		// basCostCodesColumnService.attachDataToColumn(basCostCodes).then(function(){
		// 	service.gridRefresh();
		// });

		// const costCodesPriceList = responseData.filter((item) =>{
		// 	return item.Id !== -1;
		// });

		// let dynamicColumnService = $injector.get('projectCostCodesPriceListRecordDynColumnService');
		// dynamicColumnService.attachDataToColumn(costCodesPriceList).then(function(){
		// 	service.gridRefresh();
		// });		
	}
}
