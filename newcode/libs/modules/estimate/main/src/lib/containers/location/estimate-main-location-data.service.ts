/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IProjectComplete, IProjectLocationEntity, IProjectEntity } from '@libs/project/interfaces';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { ISearchResult } from '@libs/platform/common';
import { IEstimateMainLocation } from '../../model/interfaces/estimate-main-location.interface';
import { EstimateMainService } from '../line-item/estimate-main-line-item-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * @brief Service to manage project locations.
 */
export class EstimateMainLocationDataService extends DataServiceHierarchicalRoot<IProjectLocationEntity, IProjectComplete> {
	private estimateMainService = inject(EstimateMainService);
	public projectId = this.estimateMainService.getSelection()[0];
	public isReadData = false;
	public ruleToDelete = [];
	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor() {
		const options: IDataServiceOptions<IProjectLocationEntity> = {
			apiUrl: 'project/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},

			updateInfo: {},
			roleInfo: <IDataServiceRoleOptions<IProjectEntity>>{
				role: ServiceRole.Root,
				itemName: 'Locations'
			},
		};

		super(options);
	}

	/**
	 * @brief Callback for when data load succeeds.
	 * @param loaded The loaded data.
	 * @return An array of project location entities.
	 */
	public override onLoadSucceeded(loaded: object): IProjectLocationEntity[] {
		const itemList = this.getList();
		if(this.estimateMainService.getHeaderStatus() ||!this.estimateMainService.hasCreateUpdatePermission()){
			if(itemList.length > 0){
				itemList.forEach((item: IProjectLocationEntity) => {
			  
				  this.setEntityReadOnlyFields(item,[{field:'Rule',readOnly:true},{ field:'Param',readOnly:true}]);		
			  });
}              
		   }
  

		return loaded as IProjectLocationEntity[];
	}

	/**
	 * @brief Provides payload for loading data by filter.
	 * @return The payload object.
	 */
	protected override provideLoadByFilterPayload(): object {
		//TODO: 'getSelectedProjectId()' will be added.
		const projectId = 1015580;
		return {
			projectId: projectId,
		};
	}

	/**
	 * @brief Callback for when data load by filter succeeds.
	 * @param loaded The loaded data.
	 * @return The search result containing project location entities.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IProjectLocationEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded as IProjectLocationEntity[],
		};
	}

	// public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
	// 	return element.Locations ?? [];
	// }

	/**
	 * @brief Gets the parent of the given project location entity.
	 * @param element The project location entity.
	 * @return The parent project location entity, or null if none exists.
	 */
	public override parentOf(element: IProjectLocationEntity): IProjectLocationEntity | null {
		if (element.LocationParentFk == null) {
			return null;
		}

		const parentId = element.LocationParentFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * @brief Gets the parent of the given project location entity.
	 * @param element The project location entity.
	 * @return The parent project location entity, or null if none exists.
	 */
	public getRuleToDelete(value: [] | null | undefined) {
		//this.ruleToDelete = value;                           // TODO:   Rule lookup is not implemneted
	}
	/**
	 * @brief Sets the rules to delete.
	 * @param value The value for rules to delete.
	 */
	public setRuleToDelete(value: [] | null | undefined) {
		//this.ruleToDelete = value;                          //TODO:  Rule lookup is not implemneted
	}

	/**
	 * @brief Handles changes in the creator item.
	 * @param e The event object.
	 * @param item The estimate main location item.
	 */
	public creatorItemChanged(e: object, item: IEstimateMainLocation): void {
		// TODO   estimateMainCreationService  is not ready
		// if (!_.isEmpty(item)) {
		// 	estimateMainCreationService.addCreationProcessor('estimateMainLocationListController', function (creationItem) {
		// 		creationItem.PrjLocationFk = item.Id;
		// 		if(creationItem.DescStructure === 3 || !creationItem.validStructure || !creationItem.DescAssigned){
		// 			creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
		// 			if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
		// 			creationItem.DescAssigned = creationItem.DescStructure === 3;
		// 		}
		// 		// from structure
		// 		if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 3){
		// 			// creationItem.DescriptionInfo = item.DescriptionInfo;
		// 			creationItem.Quantity = item.Quantity;
		// 			creationItem.WqQuantityTarget = item.Quantity;
		// 			creationItem.WqQuantityTargetDetail = item.Quantity;
		// 			creationItem.QuantityTarget  = item.Quantity;
		// 			creationItem.QuantityTargetDetail= item.Quantity;
		// 			creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
		// 			creationItem.validStructure = true;
		// 			creationItem.QtyTakeOverStructFk = 3;
		// 		}
		// 	});
		// } else {
		// 	estimateMainCreationService.removeCreationProcessor('estimateMainLocationListController');
		// }
	}

	/**
	 * @brief Updates markers based on the given list of project location entities.
	 * @param itemList The list of project location entities.
	 */
	public markersChanged(itemList: IProjectLocationEntity) {
		//const filterKey = 'PRJ_LOCATION';

		if (Array.isArray(itemList) && itemList.length > 0) {
			// TODO: estimateMainFilterCommon is not ready
			//const allFilterIds: number[] = [];

			// Get all child locations (for each item)
			itemList.forEach((item: IProjectLocationEntity) => {
				//  const Ids = estimateMainFilterCommon.collectItems(item, 'Locations').map(location => location.Id);
				//allFilterIds = allFilterIds.concat(Ids);
			});

			// estimateMainFilterService.setFilterIds(filterKey, allFilterIds);

			//   estimateMainFilterService.addFilter(
			//     'estimateMainLocationListController',
			//     service,
			//     (lineItem: LineItem) => allFilterIds.includes(lineItem.PrjLocationFk),
			//     { id: filterKey, iconClass: 'tlb-icons ico-filter-location', captionId: 'filterLocation' }
			//   );
		} else {
			//   estimateMainFilterService.setFilterIds(filterKey, []);
			//   estimateMainFilterService.removeFilter('estimateMainLocationListController');
		}
	}

	/**
	 * @brief Loads the location based on navigator state.
	 * @param isFromNavigator Indicates if the load is from the navigator.
	 */
	public loadLocation(isFromNavigator: string) {
		if (this.projectId.ProjectFk !== this.selectedProjectId() || this.getList().length <= 0) {
			this.projectId = this.estimateMainService.getSelection()[0];
			// this.filter()   //  TODO
			if (this.projectId.ProjectFk && !this.isReadData) {
				this.refreshAllLoaded();
			}
		} else {
			if (isFromNavigator === 'isForNagvitor') {
				this.refreshAllLoaded();
			}
		}
	}

	//estimateMainFilterService.addLeadingStructureFilterSupport(service, 'PrjLocationFk');     // TODO:  estimateMainFilterService not ready

	/**
	 * @brief Gets the selected project ID.
	 * @return The selected project ID.
	 */
	private selectedProjectId() {
		const selectedProjectId = this.estimateMainService.getSelection()[0];
		return selectedProjectId.ProjectFk;
	}
	/**
	 * @brief Gets the children of the given project location entity.
	 * @param element The project location entity.
	 * @return An array of child project location entities.
	 */
	public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
		return element.Locations ?? [];
	}
}