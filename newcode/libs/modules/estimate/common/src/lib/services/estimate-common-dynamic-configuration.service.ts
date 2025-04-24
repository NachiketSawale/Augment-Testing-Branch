/*
 * Copyright(c) RIB Software GmbH
 */

// TODO this service is will be completely implemented in future

import { Injectable, Injector } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { IEstimateCommonDynamicData } from '../model/interfaces/estimate-common-dynamic-data.interface';
//import { PlatformMessenger } from 'path-to-platform-messenger';
//import { MainViewService } from 'path-to-main-view-service';
//import { PlatformGridAPI } from 'path-to-platform-grid-api';
//import { PlatformGridControllerService } from 'path-to-platform-grid-controller-service';
//import { BasicsCostGroupAssignmentService } from 'path-to-basics-cost-group-assignment-service';
//import { BasicsCommonChangeColumnConfigService } from 'path-to-basics-common-change-column-config-service';

@Injectable({
	providedIn: 'root',
})
export class EstimateCommonDynamicConfigurationService {
	private data: IEstimateCommonDynamicData;

	public constructor(
		// private platformMessenger: PlatformMessenger,
		// private mainViewService: MainViewService,
		// private platformGridAPI: PlatformGridAPI,
		//private platformGridControllerService: PlatformGridControllerService,
		private platformTranslateService: PlatformTranslateService,
		//private basicsCostGroupAssignmentService: BasicsCostGroupAssignmentService,
		//private basicsCommonChangeColumnConfigService: BasicsCommonChangeColumnConfigService,
		private injector: Injector,
	) {
		this.data = {
			ParentScope: {},
			IsInitialized: false,
			Uuid: null,
			GroupName: 'assignments',
			//onConfigLayoutChange: new PlatformMessenger(),
			AllColumns: [],
			DynamicColDictionaryForList: {},
			DynamicColDictionaryForDetail: {},
			IsDynamicColumnConfigChanged: false, // Added to track dynamic column config changes
		};
	}

	public createNewComplete(standardConfigurationService: string | unknown, validationService: string | unknown, options: IEstimateCommonDynamicData) {
		
		Object.assign(this.data, options);

		const baseConfigurationService = typeof standardConfigurationService === 'string' ? this.injector.get(standardConfigurationService) : standardConfigurationService;

		//const baseValidationService = typeof validationService === 'string' ? this.injector.get(validationService) : validationService;

		const service = {
			isExtendService: true,
			// registerSetConfigLayout: this.registerSetConfigLayout.bind(this),
			unregisterSetConfigLayout: this.unregisterSetConfigLayout.bind(this),
			fireRefreshConfigLayout: this.fireRefreshConfigLayout.bind(this),
			fireRefreshConfigData: this.fireRefreshConfigData.bind(this),
			applyToGridId: this.applyToGridId.bind(this),
			baseConfigurationService: baseConfigurationService,
			attachData: this.attachData.bind(this),
			detachData: this.detachData.bind(this),
			detachDataItemByKey: this.detachDataItemByKey.bind(this),
			attachDataForDetail: this.attachDataForDetail.bind(this),
			detachDataForDetail: this.detachDataForDetail.bind(this),
			appendData: this.appendData.bind(this),
			getDynamicCols: this.getDynamicCols.bind(this),
			attachCostGroup: this.attachCostGroup.bind(this),
			attachCostGroupColumnsForList: this.attachCostGroupColumnsForList.bind(this),
			getDtoScheme: this.getDtoScheme.bind(this),
			getStandardConfigForListView: this.getStandardConfigForListView.bind(this),
			getStandardConfigForDetailView: this.getStandardConfigForDetailView.bind(this),
			getStandardConfigForLineItemStructure: this.getStandardConfigForLineItemStructure.bind(this),
			showLoadingOverlay: this.showLoadingOverlay.bind(this),
			hideLoadingOverlay: this.hideLoadingOverlay.bind(this),
			//resolveColumns: this.resolveColumns.bind(this),
			//setIsDynamicColumnConfigChanged: this.setIsDynamicColumnConfigChanged.bind(this)
		};

		return service;
	}

	private attachData(dataDictionary: Record<string, unknown[]>, dataObject: Record<string, unknown[]> | null | undefined) {
		if (!dataObject || typeof dataObject !== 'object') {
			return;
		}

		for (const prop in dataObject) {
			if (Object.prototype.hasOwnProperty.call(dataObject, prop)) {
				const dataObjectList = dataObject[prop];
				dataObjectList.forEach((dataObjectItem: unknown) => {
					// dataObjectItem.isCustomDynamicCol = true; // Flag as dynamic column
				});
				dataDictionary[prop] = dataObjectList;
			}
		}
	}

	private attachDataForList(dataObject: unknown) {
		// const dynamicColDictionaryForList = this.data.dynamicColDictionaryForList;
		// this.attachData(dynamicColDictionaryForList, dataObject);
	}

	private attachDataForDetail(dataObject: unknown) {
		// this.attachData(this.data.dynamicColDictionaryForDetail, dataObject);
	}

	private appendData(dataDictionary:Record<string, unknown[]>, dataObject:Record<string, unknown[]>) {
		if (!dataObject || typeof dataObject !== 'object') {
			return;
		}

		for (const prop in dataObject) {
			if (Object.prototype.hasOwnProperty.call(dataObject, prop)) {
				if (!Object.prototype.hasOwnProperty.call(dataDictionary, prop)) {
					dataDictionary[prop] = [];
				}
				dataObject[prop].forEach((propDataObject: unknown) => {
					// if (!dataDictionary[prop].some((item: unknown) => item.id === propDataObject.id)) {
					//  // propDataObject.isCustomDynamicCol = true; // Flag as dynamic column
					//   dataDictionary[prop].push(propDataObject);
					// }
				});
			}
		}
	}

	// private appendDataForList(dataObject: unknown) {
	//   this.appendData(this.data.dynamicColDictionaryForList, dataObject);
	// }

	private getDynamicCols() {
		//let cols: unknown[] = [];
		// if (this.data.dynamicColDictionaryForList.costGroup) {
		//   cols = cols.concat(this.data.dynamicColDictionaryForList.costGroup);
		// }
		//return cols;
	}

	private detachData(dataDictionary:Record<string, unknown[]>, dataObjectKey: string) {
		if (Object.prototype.hasOwnProperty.call(dataDictionary, dataObjectKey)) {
			delete dataDictionary[dataObjectKey];
		}
	}

	private detachDataItemByKey(dataObjectKey: string, dataItemKey: unknown) {
		// if (Object.prototype.hasOwnProperty.call(this.data.dynamicColDictionaryForList, dataObjectKey)) {
		//   const index = this.data.dynamicColDictionaryForList[dataObjectKey].findIndex((item: unknown) => item.id === dataItemKey);
		//   if (index !== -1) {
		//     this.data.dynamicColDictionaryForList[dataObjectKey].splice(index, 1);
		//   }
		// }
	}

	private showLoadingOverlay() {
		// this.data.parentScope.isLoading = true;
	}

	private hideLoadingOverlay() {
		// this.data.parentScope.isLoading = false;
	}

	private detachDataForList(dataObjectKey: string) {
		//this.detachData(this.data.dynamicColDictionaryForList, dataObjectKey);
	}

	private detachDataForDetail(dataObjectKey: string) {
		//this.detachData(this.data.dynamicColDictionaryForDetail, dataObjectKey);
	}

	private attachCostGroup(costGroupCats: unknown, costGroupDataService: unknown) {
		// let costGroupColumnsForList = this.basicsCostGroupAssignmentService.createCostGroupColumns(costGroupCats, false);
		// if (costGroupColumnsForList && Array.isArray(costGroupColumnsForList) && costGroupColumnsForList.length > 0) {
		//   this.attachDataForList({ costGroup: costGroupColumnsForList });
		// }
		// let costGroupColumnsForDetail = this.basicsCostGroupAssignmentService.createCostGroupColumnsForDetail(costGroupCats, costGroupDataService);
		// if (costGroupColumnsForDetail && Array.isArray(costGroupColumnsForDetail) && costGroupColumnsForDetail.length > 0) {
		//   this.initializeCostGroupForDetail(costGroupColumnsForDetail);
		//   this.attachDataForDetail({ costGroup: costGroupColumnsForDetail });
		// }
		// return {
		//   costGroupColumnsForList: costGroupColumnsForList,
		//   costGroupColumnsForDetail: costGroupColumnsForDetail
		// };
	}

	private attachCostGroupColumnsForList(costGroupColumnsForList: unknown) {
		this.attachDataForList({ costGroup: costGroupColumnsForList });
	}

	private initializeCostGroupForDetail(columns: unknown) {
		// let sortOrder = 1000;
		// columns.forEach((costGroupColumn: unknown) => {
		//   Object.assign(costGroupColumn, {
		//     gid: this.data.groupName, // Add to assignments group
		//     sortOrder: sortOrder++
		//   });
		// });
	}

	private getExtendColumns(dataDictionary: unknown) {
		//let columnsToAttachForList: unknown[] = [];
		// for (let prop in dataDictionary) {
		//   if (dataDictionary.hasOwnProperty(prop)) {
		//     columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
		//   }
		// }
		// return columnsToAttachForList;
	}

	private getCostGroupColumns() {
		// if (!this.data || !this.data.dynamicColDictionaryForList || !this.data.dynamicColDictionaryForList.costGroup) {
		//   return [];
		// }
		//  return this.data.dynamicColDictionaryForList.costGroup;
	}

	private getDtoScheme() {
		// let baseDtoScheme = this.data.baseConfigurationService.getDtoScheme();
		// let extendColumns = this.getExtendColumns(this.data.dynamicColDictionaryForList);
		// extendColumns.forEach((column: any) => {
		//   if (column.costGroupCatId) {
		//     baseDtoScheme[column.field] = {
		//       domain: 'integer',
		//       groupings: [{ groupcolid: 'Basics.CostGroups.CostGroup:' + column.costGroupCatCode + ':' + column.costGroupCatId }]
		//     };
		//   }
		// });
		// return baseDtoScheme;
	}

	private getStandardConfigForListView(gridId?: string) {
		// let columnsToAttachForList = this.getExtendColumns(this.data.dynamicColDictionaryForList);

		//let configForListCopy: unknown = {};
		if (gridId) {
			// configForListCopy.columns = JSON.parse(JSON.stringify(this.platformGridAPI.columns.configuration(gridId).current));
		} else {
			// configForListCopy = JSON.parse(JSON.stringify(this.data.baseConfigurationService.getStandardConfigForListView()));
		}

		// configForListCopy.columns = this.mergeDynamicCol(configForListCopy.columns, columnsToAttachForList);

		// if (configForListCopy.addValidationAutomatically && this.data.baseValidationService) {
		//   // this.platformGridControllerService.addValidationAutomatically(configForListCopy.columns, this.data.baseValidationService);
		// }

		// if (!configForListCopy.isTranslated) {
		//   // this.platformTranslateService.translateGridConfig(configForListCopy.columns);
		//   configForListCopy.isTranslated = true;
		// }

		// return configForListCopy;
	}

	private mergeDynamicCol(cols: unknown[], dyCols: unknown[]) {
		if (dyCols && Array.isArray(dyCols)) {
			//let copyCols = JSON.parse(JSON.stringify(cols));
			// remove the old Dynamic column
			// copyCols = copyCols.filter((e: unknown) => !e.isCustomDynamicCol);
			//cols = copyCols.concat(dyCols);
		}
		return cols;
	}

	private getStandardConfigForLineItemStructure() {
		// let costGroupColumns = this.getCostGroupColumns();
		// if (!costGroupColumns) {
		//   return this.data.baseConfigurationService.getStandardConfigForListView();
		// }
		// UDP columns
		//let updColumns = this.data.dynamicColDictionaryForList.userDefinedConfig || [];
		//let configForListCopy = JSON.parse(JSON.stringify(this.data.baseConfigurationService.getStandardConfigForListView()));
		// configForListCopy.columns = configForListCopy.columns.concat(costGroupColumns).concat(updColumns);
		// configForListCopy.columns = configForListCopy.columns.filter((column: any) => column.id !== 'assemblytype');
		// if (configForListCopy.addValidationAutomatically && this.data.baseValidationService) {
		//   // this.platformGridControllerService.addValidationAutomatically(configForListCopy.columns, this.data.baseValidationService);
		// }
		// if (!configForListCopy.isTranslated) {
		//   // this.platformTranslateService.translateGridConfig(configForListCopy.columns);
		//   configForListCopy.isTranslated = true;
		// }
		// return configForListCopy;
	}

	private getStandardConfigForDetailView() {
		// add the extend columns to config for detail
		// let columnsToAttachForList = this.getExtendColumns(this.data.dynamicColDictionaryForDetail);
		//this.initializeCostGroupForDetail(columnsToAttachForList);
		//let configForDetailCopy = JSON.parse(JSON.stringify(this.data.baseConfigurationService.getStandardConfigForDetailView()));
		// configForDetailCopy.rows = configForDetailCopy.rows.concat(columnsToAttachForList);
		// return configForDetailCopy;
	}

	// Other private methods can be defined here

	// private registerSetConfigLayout(callBackFn: any) {
	//   this.data.onConfigLayoutChange.register(callBackFn);
	// }

	private unregisterSetConfigLayout(callBackFn: unknown) {
		//this.data.onConfigLayoutChange.unregister(callBackFn);
	}

	private fireRefreshConfigLayout(): void {
		// this.data.onConfigLayoutChange.fire(arguments);
		// this.refreshGridLayout(this.data);
	}

	private fireRefreshConfigData() {
		// this.data.onConfigLayoutChange.fire(arguments);
	}

	private applyToGridId(scope: unknown) {
		// this.data.parentScope = scope;
		// this.data.uuid = scope.gridId;
	}

	public refreshGridLayout(data: unknown): void {
		// if (data && data.uuid) {
		//   const gridId = data.uuid;
		/*const grid = this.platformGridAPI.grids.element('id', gridId);
      if (grid && grid.instance) {
        data.allColumns = this.resolveColumns(gridId);

        if (data.isInitialized) {
          const requestCols = this.getStandardConfigForListView().columns;
          const requestColDyn = requestCols.filter(col => col.isCustomDynamicCol);

          const gridColConfig = this.platformGridAPI.columns.configuration(gridId);
          const gridColDyn = gridColConfig.current.filter(col => col.isCustomDynamicCol);

          let isDynamicColumnConfigChanged = false;
          if (requestColDyn.length !== gridColDyn.length) {
            isDynamicColumnConfigChanged = true;
          }

          if (data.isDynamicColumnConfigChanged) {
            isDynamicColumnConfigChanged = true;
          }

          if (gridId === 'bedd392f0e2a44c8a294df34b1f9ce44' && data.allColumns.some(column => column.isOldResourceShortKeyField)) {
            isDynamicColumnConfigChanged = true;
          }

          if (!isDynamicColumnConfigChanged) {
            for (let requestColDynIdx = 0; requestColDynIdx < requestColDyn.length - 1; requestColDynIdx++) {
              const requestColDynamic = requestColDyn[requestColDynIdx];
              const gridColumnIdx = gridColDyn.findIndex(col => col.id === requestColDynamic.id);
              if (gridColumnIdx === -1) {
                isDynamicColumnConfigChanged = true;
                break;
              }
              const gridColDynamic = gridColDyn[gridColumnIdx];
              if (
                requestColDynamic.name !== gridColDynamic.name ||
                requestColDynamic.userLabelName !== gridColDynamic.userLabelName
              ) {
                isDynamicColumnConfigChanged = true;
                break;
              }
            }
          }

          if (isDynamicColumnConfigChanged) {
            //this.platformGridAPI.columns.configuration(gridId, JSON.parse(JSON.stringify(data.allColumns)));
          }
        } else {
          data.isInitialized = true;
          //this.platformGridAPI.columns.configuration(gridId, JSON.parse(JSON.stringify(data.allColumns)));
        }

        //this.platformGridAPI.grids.refresh(gridId);
        //this.platformGridAPI.grids.invalidate(gridId);
      }
      */
	}

	/* private resolveColumns(gridId: string, dynamicColumns?: any[]): any[] {

    const columns = dynamicColumns ? dynamicColumns : this.getStandardConfigForListView(gridId).columns;

    //let cols = this.basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, columns);

  const treeColumn = cols.find(col => col.id === 'tree');
    if (treeColumn && treeColumn.hidden) {
      treeColumn.hidden = false;
    }

    cols = cols.filter(col => col !== undefined);

    return cols;
    
  }

  setIsDynamicColumnConfigChanged(data: any, value: boolean): void {
    data.isDynamicColumnConfigChanged = value;
    */
}
