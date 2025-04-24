/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import {
	DataServiceHierarchicalNode,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { IEstAllowanceAreaEntity, IEstAllowanceEntity } from '@libs/estimate/interfaces';
import {
	EstimateMainStandardAllowancesComplete
} from '../../model/complete/estimate-main-standard-allowances-complete.class';
import {EstimateMainStandardAllowancesDataService} from '../allowance/estimate-main-standard-allowances-data.service';
import {EstimateMainContextService} from '@libs/estimate/shared';
import {filter, get, isNull, isUndefined, map, sum} from 'lodash';
import {PlatformTranslateService} from '@libs/platform/common';
import {EstimateMainAllowanceAreaTypeEnum} from '../../model/enums/estimate-main-allowance-area-type.enum';
export {EstimateMainStandardAllowancesComplete} from '../../model/complete/estimate-main-allowance-area-complete.class';
@Injectable({
	providedIn: 'root'
})
export class EstimateMainAllowanceAreaDataService extends DataServiceHierarchicalNode<IEstAllowanceAreaEntity,EstimateMainStandardAllowancesComplete,IEstAllowanceEntity, EstimateMainStandardAllowancesComplete>{
	public readonly translate = inject(PlatformTranslateService);
	private readonly contextService = inject(EstimateMainContextService);

	public constructor(estimateMainStandardAllowancesDataService: EstimateMainStandardAllowancesDataService) {
		const options: IDataServiceOptions<IEstAllowanceAreaEntity> = {
			apiUrl: 'estimate/main/allowancearea',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'composite',
				usePost: true
			},
			createInfo:<IDataServiceEndPointOptions>{
				endPoint:'create',
				usePost: true
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint:'update',
				usePost: true
			},
			deleteInfo:<IDataServiceEndPointOptions>{
				endPoint:'delete',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstAllowanceAreaEntity>>{
				role: ServiceRole.Node,
				itemName: 'AllowanceArea',
				parent: estimateMainStandardAllowancesDataService,
			},
		};
		super(options);
	}

	public override childrenOf(element: IEstAllowanceAreaEntity): IEstAllowanceAreaEntity[] {
		if(element && element.Children){
			return element.Children as IEstAllowanceAreaEntity[];
		}
		return [];
	}

	public override parentOf(element: IEstAllowanceAreaEntity): IEstAllowanceAreaEntity | null {
		if (element.ParentFk == null) {
			return null;
		}

		const parentId = element.ParentFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * Replace initReadData methods
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		const selectedAllowance = this.getSelectedParent();
		return {
			EstAllowanceFk: selectedAllowance ? selectedAllowance.Id : null,
			MdcAllowanceTypeFk: selectedAllowance ? selectedAllowance.MdcAllowanceTypeFk : -1,
			projectId: this.contextService.getSelectedProjectId()
		};
	}

	protected override provideCreatePayload(): object {
		const allowanceEntity = this.getSelectedParent();
		const parent = this.getSelectedEntity();

		return {
			MainItemId: isUndefined(allowanceEntity) ? null : allowanceEntity.Id,
			parent: isNull(parent) ? null : parent,
			AreaType: isNull(parent) ? null : this.setAreaType(parent.AreaType)
		};
	}

	// todo
	// function canCreateArea(entity){
	// 	return entity && [1,2,3,4].indexOf(entity.AreaType) > -1 && isAreaWiseBalancing();
	// }
	//
	// function canCreateChildArea(entity){
	// 	return entity && [6,7].indexOf(entity.AreaType) > -1&& isAreaWiseBalancing();
	// }
	//
	// function canDeleteArea(entity){
	// 	return entity && entity && [1,3].indexOf(entity.AreaType) > -1 && isAreaWiseBalancing();
	// }
	//
	// container.data.newEntityValidator = $injector.get('estimateMainAllowanceAreaValidationService');
	//
	// function generateUpdateDoneFunc(container){
	// 	let dataService = container.data;
	// 	return function handleUpdateDone(updateData, response, data){
	// 		if(response.AllowanceAreaToSave){
	// 			let areaToAdd = [];
	// 			let boqAreaAssigmentToSave = [];
	// 			angular.forEach(response.AllowanceAreaToSave, function (item) {
	// 				let area = item.AllowanceArea;
	// 				if(area){
	// 					let oldItem = _.find(dataService.itemList, {Id: area.Id});
	//
	// 					if (oldItem) {
	// 						dataService.mergeItemAfterSuccessfullUpdate(oldItem, area, true, dataService);
	// 						platformDataServiceDataProcessorExtension.doProcessItem(oldItem, dataService);
	// 					}else{
	// 						areaToAdd.push(area);
	// 					}
	// 				}
	//
	// 				if(item.BoqAreaAssigmentToSave){
	// 					boqAreaAssigmentToSave = boqAreaAssigmentToSave.concat(item.BoqAreaAssigmentToSave);
	// 				}
	// 			});
	//
	// 			if(boqAreaAssigmentToSave.length > 0){
	// 				$injector.get('estimateMainAllowanceBoqAreaAssigmentService').handleUpdateDone(boqAreaAssigmentToSave, response, data);
	// 			}
	//
	// 			if(areaToAdd.length > 0){
	// 				let areaStructures = buildAreaTree(areaToAdd);
	// 				dataService.handleReadSucceeded([areaStructures.rootArea], dataService);
	// 				estimateMainAllowanceAreaValueColumnGenerator.refreshColumns();
	// 			}
	//
	// 		}
	// 	};
	// }
	//
	// service.handleUpdateDone = generateUpdateDoneFunc(container);
	//
	// // add updateData when create markup cost code
	// container.data.forceNodeItemCreation = true;

	private isAreaWiseBalancing(){
		const allowanceSelected = this.getSelectedParent();
		return allowanceSelected && allowanceSelected.MdcAllowanceTypeFk === 3;
	}

	private setAreaType(areaType: number) : number{
		if(areaType === EstimateMainAllowanceAreaTypeEnum.NormalRootArea){
			return EstimateMainAllowanceAreaTypeEnum.NormalArea;
		}

		if(areaType === EstimateMainAllowanceAreaTypeEnum.GcRootArea){
			return EstimateMainAllowanceAreaTypeEnum.GcArea;
		}

		return areaType;
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadSucceeded(loaded: EstimateMainStandardAllowancesComplete): IEstAllowanceAreaEntity[] {
		const areaStructures = loaded.Areas;// === null ? [] : this.buildAreaTree(loaded);
		// todo wait estimateMainAllowanceAreaValueService, estimateMainAllowanceAreaValueColumnGenerator and platformDataServiceSelectionExtension
		// estimateMainAllowanceAreaValueService.setEntities(readData.Area2GcAreaValues);
		// estimateMainAllowanceAreaValueColumnGenerator.refreshColumns();
		// if(loaded.Areas !== null){
		// 	platformDataServiceSelectionExtension.doSelectCloseTo(2, data);
		// }

		return loaded.Areas !== null ? get(areaStructures, 'rootArea', []) : [];
	}

	protected override onCreateSucceeded(loaded: object): IEstAllowanceAreaEntity{
		return loaded as IEstAllowanceAreaEntity;

		// todo wait platformDataServiceSelectionExtension
		// var newItems = [];
		// data.flatten([newItem], newItems, data.treePresOpt.childProp);
		// _.forEach(newItems, function (item) {
		// 	platformDataServiceDataProcessorExtension.doProcessItem(item, data);
		// 	data.itemList.push(item);
		// });
		// data.itemList = _.sortBy (data.itemList, ['AreaType', 'Id']);
		// platformDataServiceActionExtension.fireEntityCreated(data, newItem);
		// updateTree(data.itemList);
		//
		// return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
		// 	function () {
		// 		if (data.newEntityValidator) {
		// 			data.newEntityValidator.validate(newItem, container.service);
		// 		}
		// 		data.markItemAsModified(newItem, data);
		// 		return newItem;
		// 	},
		// 	function () {
		// 		data.markItemAsModified(newItem, data);
		// 		return newItem;
		// 	}
		// );
	}

	private buildAreaTree(sourceAreaList: IEstAllowanceAreaEntity[]){
		const selectedAllowance = this.getSelectedParent();

		const allowanceAreaChildren = filter(sourceAreaList, function(item){
			return [1,2].indexOf(item.AreaType) > -1;
		});

		allowanceAreaChildren.forEach(item => {
			if(item.AreaType === EstimateMainAllowanceAreaTypeEnum.NormalRestArea){
				item.Code = this.translate.instant('estimate.main.areaCode.restCode').text;
			}
			item.ParentFk = -2;
		});

		const AllowanceArea: IEstAllowanceAreaEntity = {
			Id : -2,
			EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
			Code : this.translate.instant('estimate.main.areaCode.allowanceAreaCode').text,
			Description: null,
			AreaType : EstimateMainAllowanceAreaTypeEnum.NormalRootArea,
			DjcTotal : sum(map(allowanceAreaChildren, 'DjcTotal')),
			GcTotal : sum(map(allowanceAreaChildren, 'GcTotal')),
			ParentFk : -1,
			Children : allowanceAreaChildren
		};

		const gcAreaChildren = filter(sourceAreaList, function(item){
			return [3,4].indexOf(item.AreaType) > -1;
		});

		gcAreaChildren.forEach(item =>{
			if(item.AreaType === EstimateMainAllowanceAreaTypeEnum.GcRestArea){
				item.Code = this.translate.instant('estimate.main.areaCode.restCode').text;
			}
			item.ParentFk = -3;
		});

		const gcArea: IEstAllowanceAreaEntity = {
			Id : -3,
			EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
			Code : this.translate.instant('estimate.main.areaCode.gcAreaCode').text,
			Description: null,
			AreaType : EstimateMainAllowanceAreaTypeEnum.GcRootArea,
			DjcTotal : 0,
			GcTotal : sum(map(gcAreaChildren, 'GcTotal')),
			ParentFk : -1,
			Children : gcAreaChildren
		};

		const rootArea: IEstAllowanceAreaEntity = {
			Id : -1,
			EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
			Code : this.translate.instant('estimate.main.root').text,
			Description: null,
			AreaType : EstimateMainAllowanceAreaTypeEnum.RootArea,
			DjcTotal : AllowanceArea.DjcTotal,
			GcTotal : AllowanceArea.GcTotal,
			ParentFk : null,
			Children : [AllowanceArea, gcArea]
		};

		return {
			rootArea:rootArea,
			normalArea:AllowanceArea,
			gcArea:gcArea
		};
	}

	// todo wait estimateMainAllowanceAreaValueColumnGenerator
	// private onDeleteDone(deleteParams: IEstAllowanceAreaEntity[]){
	// 	let isHasGcArea = false;
	// 	let estimateMainAllowanceAreaValueColumnGenerator = $injector.get('estimateMainAllowanceAreaValueColumnGenerator');
	// 	if(deleteParams && deleteParams.length){
	// 		deleteParams.forEach(item => {
	// 			if(item.AreaType === EstimateMainAllowanceAreaTypeEnum.GcArea){
	// 				// refresh column
	// 				isHasGcArea = true;
	// 				estimateMainAllowanceAreaValueColumnGenerator.deleteAreaValueColumns(item, true);
	// 			}else if(item.AreaType === EstimateMainAllowanceAreaTypeEnum.NormalArea){
	// 				// reCalculateRest
	// 				estimateMainAllowanceAreaValueColumnGenerator.deleteAreaValueColumns(item, false);
	// 			}
	// 		});
	// 	}
	//
	// 	if(isHasGcArea){
	// 		estimateMainAllowanceAreaValueColumnGenerator.refreshConfigurationColumn();
	// 	}
	// 	originalOnDeleteDone(deleteParams, data, response);
	// }

	public clearData(){
		// let data = container.data;
		// if(data.itemList.length === 0){
		// 	return;
		// }
		// data.itemList.length = 0;
		// data.itemTree.length = 0;
		// if (data.listLoaded) {
		// 	data.listLoaded.fire();
		// }
		this.setList([]);
	}
}








