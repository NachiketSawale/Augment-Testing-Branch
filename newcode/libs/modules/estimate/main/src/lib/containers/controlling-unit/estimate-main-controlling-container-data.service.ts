/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalRoot } from '@libs/platform/data-access';

import { EstimateMainControllingContainerComplete } from './estimate-main-controlling-container-complete.class';
import { ISearchResult, PlatformConfigurationService } from '@libs/platform/common';
import { EstimateMainService } from '../line-item/estimate-main-line-item-data.service';
import { HttpClient } from '@angular/common/http';
import { IControllingUnitEntity } from '@libs/basics/shared';


export const ESTIMATE_MAIN_CONTROLLING_CONTAINER_DATA_TOKEN = new InjectionToken<EstimateMainControllingContainerDataService>('estimateMainControllingContainerDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 * @name controllingStructureMainService
 *
 * @description
 * controllingStructureMainService is the data service for all structure related functionality.
 */
export class EstimateMainControllingContainerDataService extends DataServiceHierarchicalRoot<IControllingUnitEntity, EstimateMainControllingContainerComplete> {
	public estimateMainService = inject(EstimateMainService);
	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	public projectId = this.estimateMainService.getSelection()[0];
	public isReadData = false;
	public constructor() {
		const options: IDataServiceOptions<IControllingUnitEntity> = {
			apiUrl: 'controlling/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},

			updateInfo: <IDataServiceEndPointOptions>{
				// Todo : incorporateDataRead
				endPoint: 'estimate/main/lineitem',
			},

			roleInfo: <IDataServiceRoleOptions<IControllingUnitEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstCtu'
			},
		};

		super(options);
	}                                                                                        

	/**
	 *  Creates or updates an EstimateMainControllingContainerComplete entity.
	 * @param modified The modified IControllingUnitEntity object. Can be null.
	 * @return A new instance of EstimateMainControllingContainerComplete.
	 */
	// public override createUpdateEntity(modified: IControllingUnitEntity | null): EstimateMainControllingContainerComplete {
	// 	// let complete = new EstimateMainControllingContainerComplete();
	// 	if (modified !== null) {
	// 		///complete.Id = modified.Id;      																							// id is not present  IControllingUnitEntity
	// 		//complete.EstCtu = [modified];
	// 	}

	// 	//return complete;
	// }

	/**
	 * @brief Provides the payload for loading data by filter.
	 * This method constructs and returns an object that serves as a filter
	 * payload for loading data based on the selected project in the estimate main service.
	 * @return An object containing the filter criteria.
	 */
	protected override provideLoadByFilterPayload(): object {
		const filter = {
			mainItemId: this.projectId.ProjectFk
		};
		return filter;
	}

	/**
	 * @brief Handles the successful loading of data by filter.
	 * This method processes the loaded data and constructs a search result object
	 * containing the filter result and the data transfer objects (DTOs).
	 * @param loaded The loaded data as an object.
	 * @return An ISearchResult<IControllingUnitEntity> object containing the filter result and the DTOs.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IControllingUnitEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded as IControllingUnitEntity[],
		};
	}

	/**
  	Retrieves the children of the specified controlling unit entity.
 	*
	*/
	// public override childrenOf(element: IControllingUnitEntity): IControllingUnitEntity[] {
	// 	return element.ControllingUnitChildren ?? [];                                                      // ControllingUnitChildren not present entity 
	// } 

	/**
  	Retrieves the parent of the specified controlling unit entity.
 	*
	*/
	public override parentOf(element: IControllingUnitEntity): IControllingUnitEntity | null {
		return null;
	}

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
	 * @brief Handles changes to the creator item.
	 *
	 * This method is intended to process changes to a controlling unit entity item.
	 */
	public creatorItemChanged(e: object, item: IControllingUnitEntity): void {
																							// TODO   estimateMainCreationService  is not ready
		// if (!_.isEmpty(item)) {
		// 			estimateMainCreationService.addCreationProcessor('estimateMainControllingListController', function (creationItem) {
		// 				creationItem.MdcControllingUnitFk = item.Id;
		// 				if(creationItem.DescStructure === 4 || !creationItem.validStructure || !creationItem.DescAssigned){
		// 					creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
		// 					if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
		// 					creationItem.DescAssigned = creationItem.DescStructure === 4;
		// 				}
		// 				// from structure
		// 				if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 4){
		// 					creationItem.Quantity = item.Quantity;
		// 					creationItem.WqQuantityTarget = item.Quantity;
		// 					creationItem.WqQuantityTargetDetail = item.Quantity;
		// 					creationItem.QuantityTarget  = item.Quantity;
		// 					creationItem.QuantityTargetDetail= item.Quantity;
		// 					creationItem.BasUomTargetFk = creationItem.BasUomFk = item.UomFk;
		// 					creationItem.validStructure = true;
		// 					creationItem.QtyTakeOverStructFk = 4;
		// 				}
		// 			});
	}

	/**
	 * @brief Updates markers based on the given list of project location entities.
	 * @param itemList The list of project location entities.
	 */
	public markersChanged(itemList: IControllingUnitEntity) {
		//const filterKey = 'MDC_CONTROLLINGUNIT';

		if (Array.isArray(itemList) && itemList.length > 0) {
																							// TODO: estimateMainFilterCommon is not ready
			//let allFilterIds: number[] = [];

			// // Get all child locations (for each item)
			// itemList.forEach((item: IControllingUnitEntity) => {
			// 	//  const Ids = estimateMainFilterCommon.collectItems(item, 'ControllingUnits').map(ControllingUnits => ControllingUnits.Id);
			// 	//allFilterIds = allFilterIds.concat(Ids);
			// });
			// if (_.isArray(itemList) && _.size(itemList) > 0) {
			// 	allFilterIds = [];

			// 	// get all child controlling units (for each item)
			// 	_.each(itemList, function (item) {
			// 		let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'ControllingUnits'), 'Id');
			// 		allFilterIds = allFilterIds.concat(Ids);
			// 	});
			// 	estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
			// 	estimateMainFilterService.addFilter('estimateMainControllingListController', service, function (lineItem) {
			// 		return allFilterIds.indexOf(lineItem.MdcControllingUnitFk) >= 0;
			// 	}, { id: filterKey, iconClass: 'tlb-icons ico-filter-controlling', captionId: 'filterControlling'}, 'MdcControllingUnitFk');
			// } else {
			// 	estimateMainFilterService.setFilterIds(filterKey, []);
			// 	estimateMainFilterService.removeFilter('estimateMainControllingListController');
			// }
		}
	}

	/**
	 * @brief Loads the location based on navigator state.
	 * @param isFromNavigator Indicates if the load is from the navigator.
	 */
	public loadControlling(isFromNavigator: string) {
		if (this.projectId.ProjectFk !== this.selectedProjectId() || this.getList().length <= 0) {
			this.projectId = this.estimateMainService.getSelection()[0];
			//  	service.setFilter('mainItemId=' + projectId);   														 // TODO
			if (this.projectId.ProjectFk && !this.isReadData) {
				this.refreshAllLoaded();
			}
		} else {
			if (isFromNavigator === 'isForNagvitor') {
				this.refreshAllLoaded();
			}
		}
	}

	/**
	 * @brief Gets the selected project ID.
	 * @return The selected project ID.
	 */
	private selectedProjectId() {
		const selectedProjectId = this.estimateMainService.getSelection()[0];
		return selectedProjectId.ProjectFk;
	}

	/**
	 *  Retrieves a controlling unit by its ID.
	 * @return A subscription to the HTTP POST request, which can be used to handle the response asynchronously.
	 */
	public getControllingUnitById(mainItemId: number) {
		return this.http.post(this.configurationService.webApiBaseUrl + 'controlling/structure/getcontrollingunit?Id=', +mainItemId).subscribe((response) => {
			if (response) {
				return response;
			} else {
				return '';
			}
		});
	}
}
