/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IProjectCostCodesJobRateEntity, PrjCostCodesEntity } from '@libs/project/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';
import { IPrjCostCodeUserDefinedObj } from './project-costcodes-dynamic-user-defined-column.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostcodesJobRateDynamicUserDefinedColumnService {
	//public useDefinedColumnIds = inject(UserDefinedColumnTableIds); // TODO
	private readonly translate = inject(PlatformTranslateService);
	// TODO : dependancy basicsCommonUserDefinedColumnServiceFactor
	public _projectId = -1;
	public fieldSuffix = 'project';
	public moduleName = 'PorjectCostCoeJobRate';

	private columnOptions = {
		columns: {
			idPreFix: 'ProjectCostCode',
			nameSuffix: '(' + this.translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')',
		},
		additionalColumns: true,
		additionalColumnOption: {
			idPreFix: 'ProjectCostCode',
			fieldSuffix: this.fieldSuffix,
			nameSuffix: ' ' + this.translate.instant('basics.common.userDefinedColumn.costUnitSuffix'),
			overloads: {
				readonly: true,
				editor: null,
			},
		},
	};

	private serviceOptions = {
		getRequestData: (item: IProjectCostCodesJobRateEntity) => {
			return {
				Pk1: this._projectId,
				Pk2: item.ProjectCostCodeFk,
			};
		},
		getFilterFn: (tableId: number) => {
			return (e: IPrjCostCodeUserDefinedObj, dto: PrjCostCodesEntity) => {
				return e.TableId === tableId && e.Pk1 === dto.ProjectFk && e.Pk2 === dto.Id;
			};
		},
		getModifiedItem: (tableId: number, item: IProjectCostCodesJobRateEntity) => {
			return {
				TableId: tableId,
				Pk1: this._projectId,
				Pk2: item.ProjectCostCodeFk,
				Pk3: item.LgmJobFk,
			};
		},
		attachExtendDataToColumn: true,
		extendDataColumnOption: {
			fieldSuffix: this.fieldSuffix,
			getRequestData: () => {
				return {
					// TODO TableId : userDefinedColumnTableIds.BasicsCostCode
				};
			},
			getFilterFn: () => {
				return (e: IPrjCostCodeUserDefinedObj, dto: IProjectCostCodesJobRateEntity) => {
					// TODO return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === dto['BasCostCode.Id'];
				};
			},
		},
	};

	// TODO let service = basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesJobRateDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCodeJobRate, 'projectCostCodesJobRateMainService', columnOptions, serviceOptions, moduleName);

	public onJobChanged(item:IProjectCostCodesJobRateEntity) {
		// if(item.LgmJobFk === null) { return; }
		// service.getValueList().then(function (existedValues){
		//   let existedUserDefinedVal = _.find(existedValues, function(e){
		//     return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === _projectId && e.Pk2 === item.ProjectCostCodeFk && e.Pk3 === item.LgmJobFk;
		//   });
		//   let columns = _.filter(service.getDynamicColumns(), function(column){ return !column.isExtend; });
		//   if(existedUserDefinedVal){
		//     _.forEach(columns, function(column){
		//       let field = column.field;
		//       let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
		//       item[field] = existedUserDefinedVal && existedUserDefinedVal[valueField] ? existedUserDefinedVal[valueField] : 0;
		//     });
		//   }else{
		//     service.fieldChange(item, columns[0].field);
		//   }
		// });
	}

	public fieldChange() {
		// if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.LgmJobFk){
		//   return;
		// }
	}

	public handleCreatedItem(newItem: IProjectCostCodesJobRateEntity) {
		// let requestData = {
		//   TableId : userDefinedColumnTableIds.BasicsCostCode,
		//   Pk1 : newItem['BasCostCode.Id']
		// };
		//  service.getValueList(requestData).then(function(existedValues){
		//   let mdcCostCodeUserDefinedVal = _.find(existedValues, function(e){
		//     return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === newItem['BasCostCode.Id'];
		//   });
		//   let columns = service.getDynamicColumns();
		//   if(!columns || columns.length <= 0) { return; }
		//   if(mdcCostCodeUserDefinedVal){
		//     _.forEach(columns, function(column){
		//       let field = column.field;
		//       let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
		//       newItem[field] = mdcCostCodeUserDefinedVal[valueField] ? mdcCostCodeUserDefinedVal[valueField] : 0;
		//     });
		//     projectCostCodesJobRateMainService.gridRefresh();
		//   }else{
		//     service.attachEmptyDataToColumn(newItem);
		//   }
		//   if(newItem.LgmJobFk === null) {  return; }
		//   service.fieldChange(newItem, columns[0].field);
		// });
	}

	public setProjectId(projectId: number) {
		this._projectId = projectId;
	}
}
