/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICostCodeEntity } from '../../model/models';
import { ICostCodeUserDefinedObj } from '../../model/interfaces/basics-cost-codes-user-defined.interface';

@Injectable({
	providedIn: 'root'
})

/**
 BasicsCostCodesDynamicUserDefinedColumnService
 */
export class BasicsCostCodesDynamicUserDefinedColumnService {
	public _projectId = -1;
	public fieldSuffix = 'project';
	public moduleName = 'BasicsCostCode';

	private columnOptions = {
		columns: {
			idPreFix: 'BasicsCostCode'
		},
		additionalColumns: true
	};

	public serviceOptions = {
		getRequestData: (item: ICostCodeEntity) => {
			return {};
		},
		getFilterFn: (tableId: number) => {
			return function (e: ICostCodeUserDefinedObj, dto: ICostCodeEntity) {
				return e.TableId === tableId && e.Pk1 === dto.Id;
			};
		},
		getModifiedItem: (tableId: number, item: ICostCodeEntity) => {
			return {
				TableId: tableId,
				Pk1: item.Id
			};
		},
	};

	// TODO basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCode, 'projectCostCodesMainService', columnOptions, serviceOptions, moduleName);
}
