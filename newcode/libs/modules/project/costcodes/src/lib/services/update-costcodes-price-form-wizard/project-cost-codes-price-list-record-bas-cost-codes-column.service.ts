/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostCodesPriceListRecordBasCostCodesColumnService {
	// private readonly basCommmonUseDefinedColumnService = inject(BasicsCommonUserDefinedColumnServiceFactory);
	// private readonly userDefinedColumnTableIds = inject(UserDefinedColumnTableIds);

	public constructor() {
		// TODO: basicsCommonUserDefinedColumnServiceFactory is not ready
		// const columnOptions = {
		// 	columns: {
		// 		idPreFix: 'Record',
		// 		overloads: {
		// 			readonly: true,
		// 			editor: null,
		// 		},
		// 	},
		// };

		// const serviceOptions = {
		// 	getRequestData: (item: any) => {
		// 		return {
		// 			Pk1: item.CostCodeFk,
		// 		};
		// 	},
		// 	getFilterFn: (tableId: number) => {
		// 		return (e: any, dto: any) => {
		// 			return e.TableId === tableId && e.Pk1 === dto.CostCodeFk;
		// 		};
		// 	},
		// };

		// TODO this.basCommmonUseDefinedColumnService.getService(ProjectCostcodesPriceListRecordDynamicConfigurationService, this.userDefinedColumnTableIds.BasicsCostCode, 'ProjectCostcodesPriceListRecordDataService', columnOptions, serviceOptions);
	}
}
