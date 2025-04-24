/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { ICostCodeUserDefinedObj } from '../../model/interfaces/basics-cost-codes-user-defined.interface';

@Injectable({
	providedIn: 'root'
})

/**
 basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService
 */
export class basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService {
	private readonly translate = inject(PlatformTranslateService);

	public _projectId = -1;
	public fieldSuffix = 'project';
	public moduleName = 'PorjectCostCode';

	private columnOptions = {
		columns: {
			idPreFix: 'BasicsCostCodePriceList'
		}
	};

	public serviceOptions = {
		getRequestData: (item: ICostcodePriceListEntity) => {
			return {
				pk1: item.CostCodeFk,
			};
		},
		getFilterFn: (tableId: number) => {
			return function (e: ICostCodeUserDefinedObj, dto: ICostcodePriceListEntity) {
				return e.TableId === tableId && e.Pk1 === dto.CostCodeFk && e.Pk2 == dto.Id;
			};
		},
		getModifiedItem: (tableId: number, item: ICostcodePriceListEntity) => {
			return {
				TableId: tableId,
				Pk1: item.CostCodeFk,
				pk2: item.Id,
				pk3: null
			};
		},
	};

	// TODO basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCode, 'projectCostCodesMainService', columnOptions, serviceOptions, moduleName);
}
