/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';

export interface IPrjCostCodeUserDefinedObj {
	TableId: number;
	Pk1: number;
	Pk2: number;
}

@Injectable({
	providedIn: 'root',
})

/**
 * This service used to get user defined columns for project cost codes
 */
export class ProjectCostCodesDynamicUserDefinedColumnService {
	//public useDefinedColumnIds = inject(UserDefinedColumnTableIds); // TODO
	private readonly translate = inject(PlatformTranslateService);
	
	public _projectId = -1;
	public fieldSuffix = 'project';
	public moduleName = 'PorjectCostCode';

	private columnOptions = {
		columns: {
			idPreFix: 'ProjectCostCode',
			nameSuffix: '(' + this.translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')',
			overloads: {
				readonly: true,
				editor: null
			}
		},
		additionalColumns: true,
		additionalColumnOption: {
			idPreFix: 'ProjectCostCode',
			fieldSuffix: this.fieldSuffix,
			nameSuffix: ' ' + this.translate.instant('basics.common.userDefinedColumn.costUnitSuffix'),
			overloads: {
				readonly: true,
				editor: null
			}
		}
	};

	public serviceOptions = {
		getRequestData: (item: PrjCostCodesEntity) => {
			return {
				Pk1: item.ProjectFk,
			};
		},
		getFilterFn: (tableId: number) => {
			return function (e: IPrjCostCodeUserDefinedObj, dto: PrjCostCodesEntity) {
				return e.TableId === tableId && e.Pk1 === dto.ProjectFk && e.Pk2 === dto.Id;
			};
		},
		getModifiedItem: (tableId: number, item: PrjCostCodesEntity) => {
			return {
				TableId: tableId,
				Pk1: this._projectId,
				Pk2: item.Id,
			};
		},
		attachExtendDataToColumn: true,
		extendDataColumnOption: {
			fieldSuffix: this.fieldSuffix,
			getRequestData: () => {
				return {
					// TODO TableId: userDefinedColumnTableIds.BasicsCostCode
				};
			},
			getFilterFn: () => {
				return function (e: IPrjCostCodeUserDefinedObj, dto: PrjCostCodesEntity) {
					// TODO return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === dto.MdcCostCodeFk;
				};
			},
		},
	};

	// TODO basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCode, 'projectCostCodesMainService', columnOptions, serviceOptions, moduleName);

	/**
	 * Set project id
	 * @param projectId Project id
	 */
	public setProjectId(projectId: number) {
		this._projectId = projectId;
	}
}
