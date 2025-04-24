/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IBoqItemSimpleEntity } from '@libs/boq/main';
import { IWicGroupEntity } from '@libs/boq/wic';
import { EstimateMainWicGroupDataService } from './estimate-main-wic-group-data.service';
import { inject, Injectable } from '@angular/core';
import { ProjectMainDataService } from '@libs/project/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainWicBoqDataService extends DataServiceHierarchicalLeaf<IBoqItemSimpleEntity, IWicGroupEntity, IWicGroupEntity> {
	private parentService: EstimateMainWicGroupDataService;
	private projectService = inject(ProjectMainDataService);
	//private estimateMainFilterService = inject(EstimateMainFilterService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	public constructor(estimateWicGroupDataService: EstimateMainWicGroupDataService) {
		const options: IDataServiceOptions<IBoqItemSimpleEntity> = {
			apiUrl: 'boq/main',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getwicboqtree',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IBoqItemSimpleEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'WicBoq',
				parent: estimateWicGroupDataService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};

		super(options);
		this.parentService = estimateWicGroupDataService;
		//this.estimateMainFilterService.addLeadingStructureFilterSupport(this, 'Id');
	}
	/**
	 * @brief Provides the payload for loading data.
	 * @return An object containing the project ID and WIC group IDs.
	 */
	protected override provideLoadPayload(): object {
		return {
			ProjectId: this.projectService.getSelectedEntity()?.Id,
			WicGroupIds: [this.parentService.getSelectedEntity()?.Id],
		};
	}
	/**
	 * @brief Callback for when data load succeeds.
	 * @param loaded The loaded data.
	 * @return An array of project location entities.
	 */
	public override onLoadSucceeded(loaded: object): IBoqItemSimpleEntity[] {
		return loaded as IBoqItemSimpleEntity[];
	}
	/**
	 * @brief Gets the children of the given BOQ item entity.
	 * @param element The BOQ item entity.
	 * @return An array of child BOQ item entities.
	 */
	public override childrenOf(element: IBoqItemSimpleEntity): IBoqItemSimpleEntity[] {
		return (element.BoqItems as IBoqItemSimpleEntity[]) ?? [];
	}

	/**
	 * @brief Gets the parent of the given BOQ item entity.
	 * @param element The BOQ item entity.
	 * @return The parent BOQ item entity or null if no parent exists.
	 */
	public override parentOf(element: IBoqItemSimpleEntity): IBoqItemSimpleEntity | null {
		if (element.BoqItemFk == null) {
			return null;
		}

		const parentId = element.BoqItemFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
	/**
	 * @brief Updates the parent of the given BOQ item entity.
	 * @param entity The BOQ item entity to update.
	 * @param newParent The new parent BOQ item entity, or null if no parent exists.
	 */
	public override onTreeParentChanged(entity: IBoqItemSimpleEntity, newParent: IBoqItemSimpleEntity | null): void {
		entity.BoqItemFk = newParent?.Id;
	}

	/**
	 * Used when new item is crated
	 * @param e Object from platform
	 * @param item BoqItemSimpleEntity item
	 */
	public creatorItemChanged(e: object, item: IBoqItemSimpleEntity) {
		// TODO   estimateMainCreationService  is not ready
		// if (!_.isEmpty(item)) {
		// 	estimateMainCreationService.addCreationProcessor('estimateMainWicBoqListController', function (creationItem) {
		// 		// BoqLineTypeFk, only assign:
		// 		// Position = 0
		//
		// 		let canAdd = true;
		// 		if (item && item.Id && item.BoqLineTypeFk === 0) {
		// 			// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
		// 			if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
		// 				let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
		// 				if(crbChildrens && crbChildrens.length){
		// 					canAdd = false;
		// 				}
		// 			}
		// 		}
		// 		let boqLineTypes = [0, 11, 200, 201, 202, 203];
		// 		if (boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
		// 			canAdd = false;
		// 		}
		//
		// 		if (canAdd) {
		// 			creationItem.WicBoqItemFk = item.Id >0 ? item.Id :null;
		// 			creationItem.WicBoqHeaderFk = item.BoqHeaderFk;
		// 			creationItem.BoqWicCatFk = item.BoqWicCatFk;
		// 			creationItem.DescriptionInfo = item.BriefInfo;
		// 			// from structure
		// 			if (!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1) {
		// 				creationItem.Quantity = item.Quantity;
		//
		// 				creationItem.WqQuantityTarget = item.Quantity;
		// 				creationItem.WqQuantityTargetDetail = item.Quantity;
		//
		// 				creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
		// 				creationItem.validStructure = true;
		// 				creationItem.QtyTakeOverStructFk = 1;
		// 			}
		// 		}
		// 	});
		//
		// 	// focus on wic boq, to load assembly
		// 	let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
		// 	if(estimateMainWicRelateAssemblyService.getCurrentFilterType() === 'filterByWicBoQ') {
		// 		if (item && item.Id ) {
		// 			estimateMainWicRelateAssemblyService.load();
		// 			// $injector.get('estimateMainWicRelateAssemblyService').activateStrLayout();
		// 		}
		// 		else {
		// 			estimateMainWicRelateAssemblyService.updateList([]);
		// 		}
		// 	}
		// } else {
		// 	estimateMainCreationService.removeCreationProcessor('estimateMainWicBoqListController');
		// }
	}

	private multiSelectFlag = false;
	private allFilterIds: number[] = [];
	/**
	 * Load Activities
	 * @param itemList IBoqItemSimpleEntity[]
	 * @param wicGroupId number
	 */
	public markersChanged(itemList: IBoqItemSimpleEntity[], wicGroupId: number) {
		// let filterKey = 'BOQ_WIC_ITEM';
		// let filterId = 'estimateMainWicBoqListController';

		//let cols = platformGridAPI.columns.configuration(service.getGridId());
		//let filterCol = _.find(cols.current, {id: 'marker'});

		// if (filterCol && filterCol.editorOptions) {
		// 	this.multiSelectFlag = filterCol.editorOptions.multiSelect;
		// }
		//TODD: estimateMainFilterService is not support getFilterObjects and getFilterObjects()
		//let filterIds = this.estimateMainFilterService.getFilterObjects ? this.estimateMainFilterService.getFilterObjects(): null;
		const enabledFilter = true;
		// if(filterIds && filterIds[filterId]){
		// 	enabledFilter = filterIds[filterId].enabled;
		// }
		if (enabledFilter) {
			let wicBoqItemList = this.getList();
			const _temp: IBoqItemSimpleEntity[] = [];

			// let currentwicBoqItems = this.getList();
			//cloudCommonGridService.flatten(currentwicBoqItems, _temp, 'BoqItems');

			wicBoqItemList = wicBoqItemList.concat(_temp);

			// wicBoqItemList = _.uniq(wicBoqItemList, 'Id');

			let wicBoqItemMarkedList = wicBoqItemList.filter((item) => {
				return item; //.IsMarked;
			});

			if (wicGroupId) {
				wicBoqItemMarkedList = wicBoqItemList.filter((item) => {
					return item.BoqWicCatFk !== wicGroupId;
				});
			}

			if (wicBoqItemMarkedList && wicBoqItemMarkedList.length) {
				//service.setWicBoqItemForFilter(wicBoqItemMarkedList);
			}

			// let currentwicBoqItemNoMarkedList = wicBoqItemList.filter((item) => {
			// 	return item; //.IsMarked;
			// });

			//let noMarkedIds = currentwicBoqItemNoMarkedList.map((item) => item.Id);

			//service.removeWicBoqItemForFilter(null, noMarkedIds);

			const filterDatas = this.getWicBoqItemForFilter();

			if ((Array.isArray(itemList) && itemList.length > 0) || filterDatas.length) {
				this.allFilterIds = [];

				if (!this.multiSelectFlag) {
					// when mulit-selection model is false
					this.clearWicBoqItemForFilter();
				}

				if (Array.isArray(itemList) && itemList.length > 0) {
					this.setWicBoqItemForFilter(itemList);
				}
				// get all child boqs (for each item)
				// _.each(filterDatas, function (item) {
				// 	let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'BoqItems'), 'Id');
				// 	this.allFilterIds = this.allFilterIds.concat(Ids);
				// });

				//this.estimateMainFilterService.setFilterIds(filterKey, this.allFilterIds);
				//TODD : estimateMainFilterService not support addFilter()
				// this.estimateMainFilterService.addFilter(filterId, this, function (lineItem) {
				// 	return this.allFilterIds.indexOf(lineItem.WicBoqItemFk) >= 0;
				// }, {
				// 	id: filterKey,
				// 	iconClass: 'tlb-icons  ico-filter-wic-boq',
				// 	captionId: 'filterBoqWic'
				// }, 'WicBoqItemFk');

				/* service.setWicBoqItemForFilter(itemList[0]);
				 service.classByType.fire('tlb-icons ico-filter-off btn-square-26'); */

				// if (wicBoqItemList.length === currentwicBoqItemNoMarkedList.length) {
				// 	//service.classByType.fire('');
				// } else {
				// 	//service.classByType.fire('tlb-icons ico-filter-off btn-square-26');
				// }
			} else {
				//this.estimateMainFilterService.setFilterIds(filterKey, []);
				//TODD : estimateMainFilterService not support removeFilter()
				//this.estimateMainFilterService.removeFilter(filterId);
				// service.removeWicBoqItemForFilter();
				// service.classByType.fire('');
			}
		} else {
			//this.estimateMainFilterService.setFilterIds(filterKey, []);
			//TODD : estimateMainFilterService not support removeFilter()
			//this.estimateMainFilterService.removeFilter(filterId);
			// service.removeWicBoqItemForFilter();
			// service.classByType.fire('');
		}
		//service.filterBoqWicItem.fire();
	}

	/*
	 *Get filtering criteria of WIC BOQ
	 */
	public getWicBoqItemForFilter(): IBoqItemSimpleEntity[] {
		return this.wicBoqItemForFilterList.reduce((wicBoqs: IBoqItemSimpleEntity[], current) => {
			const exists = wicBoqs.findIndex((item) => item.Id === current.Id && item.BoqHeaderFk === current.BoqHeaderFk) === -1;
			if (exists) {
				wicBoqs.push(current);
			}
			return wicBoqs;
		}, []);
	}
	/*
	 *Clear the filtering criteria of WIC BOQ
	 */
	public clearWicBoqItemForFilter() {
		this.wicBoqItemForFilterList = [];
	}

	/*
	 * Sets or updates the highlight filter for WIC BOQ items.
	 *This method is responsible for configuring or updating the highlight state of WIC BOQ items in the filter.
	 */
	public setHightLightFilterWicBoqItem() {
		const filter = this.getWicBoqItemForFilter();
		const wicBoqItem4FilterIds = filter.map((item) => item.Id);

		const wicBoqItemsList = this.getList();
		if (wicBoqItem4FilterIds) {
			wicBoqItemsList.forEach((item) => {
				//item.IsMarked = wicBoqItem4FilterIds.indexOf(item.Id) > -1;
			});

			if (filter && filter.length) {
				// serviceContainer.data.listLoaded.fire();
				// service.expandNodeParent(filter[0]);
				//let gId = service.getGridId();
				//const ids = filter.map((item) => item.Id);
				//let grid = platformGridAPI.grids.element('id', gId);
				//let rows = grid.dataView.mapIdsToRows(ids);
				//grid.instance.setSelectedRows(rows, true);
				//TODD: now not support setSelectedEntities()
				//this.setSelectedEntities(filter);
			}
		}
	}
	public loadWicBoqItem(selecteWicGroupId: number) {
		// if (!lookupData.loadCostGroupPromise) {
		// 	lookupData.loadCostGroupPromise = getWicBoqItem([selecteWicGroupId]);
		// }
		// lookupData.loadCostGroupPromise.then(function () {
		// 	this.setHightLightFilterWicBoqItem();
		// 	lookupData.loadCostGroupPromise = null;
		// });
	}
	private wicBoqItemForFilterList: IBoqItemSimpleEntity[] = [];
	/**
	 * Removes specific WIC BOQ items from the filter for a given WIC Group.
	 * @param wicGroupId The identifier for the WIC Group from which items will be removed.
	 * @param wicBoqItemIds An array of identifiers for the WIC BOQ items to be removed.
	 */
	public removeWicBoqItemForFilter(wicGroupId: number, wicBoqItemIds: number[]) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		let wicBoqItem2Removed: IBoqItemSimpleEntity[] = [];
		let tempList = [];

		if (wicGroupId) {
			wicBoqItem2Removed = this.wicBoqItemForFilterList.filter((item) => item.BoqWicCatFk === wicGroupId);
		}
		if (wicBoqItem2Removed && wicBoqItem2Removed.length) {
			tempList = this.wicBoqItemForFilterList; //angular.copy(wicBoqItemForFilterList);
			this.wicBoqItemForFilterList = [];
			tempList.forEach((item) => {
				const costGrp = wicBoqItem2Removed.filter((wic) => wic.Id === item.Id);
				if (costGrp && !costGrp.length) {
					that.wicBoqItemForFilterList.push(item);
				}
			});
		}

		// if(wicBoqItemIds  && wicBoqItemIds.length){
		// 	wicBoqItem2Removed =  _.filter(this.wicBoqItemForFilterList, function(item){
		// 		if(wicBoqItemIds.indexOf(item.Id)>=0){
		// 			return item;
		// 		}
		// 	});
		// }

		if (wicBoqItem2Removed && wicBoqItem2Removed.length) {
			tempList = this.wicBoqItemForFilterList; //angular.copy(wicBoqItemForFilterList);
			this.wicBoqItemForFilterList = [];

			tempList.forEach((item) => {
				const costGrp = wicBoqItem2Removed.filter((wic) => wic.Id === item.Id);
				if (costGrp && !costGrp.length) {
					that.wicBoqItemForFilterList.push(item);
				}
			});
		}
	}
	/**
	 * Sets the WIC BOQ items for filtering purposes.
	 * @param wicBoqItems An array of WIC BOQ item entities to be used for filtering.
	 * This method is responsible for storing or updating the list of WIC BOQ items that can be used to apply filters.
	 */
	public setWicBoqItemForFilter(wicBoqItems: IBoqItemSimpleEntity[]) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		if (wicBoqItems && wicBoqItems.length > 1) {
			this.wicBoqItemForFilterList = this.wicBoqItemForFilterList.concat(wicBoqItems);
		} else {
			const costGroupFks = this.wicBoqItemForFilterList.filter((item) => item.BoqWicCatFk === wicBoqItems[0].BoqWicCatFk);
			if (costGroupFks && costGroupFks.length) {
				const tempList = this.wicBoqItemForFilterList; //angular.copy(this.wicBoqItemForFilterList);
				this.wicBoqItemForFilterList = [];
				// avoid same wicGroup has many wicBoqItems when filter single wicGroup
				tempList.forEach((item) => {
					if (item.BoqWicCatFk !== wicBoqItems[0].BoqWicCatFk) {
						that.wicBoqItemForFilterList.push(item);
					}
				});
				//this.wicBoqItemForFilterList = this.wicBoqItemForFilterList.concat(wicBoqItems);
			} else {
				//this.wicBoqItemForFilterList = this.wicBoqItemForFilterList.concat(wicBoqItems);
			}
		}

		this.wicBoqItemForFilterList = this.wicBoqItemForFilterList.reduce((wicBoqs: IBoqItemSimpleEntity[], current) => {
			const exists = wicBoqs.findIndex((item) => item.Id === current.Id && item.BoqHeaderFk === current.BoqHeaderFk) === -1;
			if (!exists) {
				wicBoqs.push(current);
			}
			return wicBoqs;
		}, []);
	}
	/**
	 * Retrieves WIC BOQ items associated with specified WIC Group IDs for a given project.
	 * @param selectedWicGroupIds An array of IDs representing the selected WIC Groups.
	 */
	public getWicBoqItem(selecteWicGroupIds: number[]) {
		// const projectId = this.projectService.getSelectedEntity()?.Id;
		// let param = {'ProjectId':0,'WicGroupIds':[]};
		// if (projectId) {
		// 	param.ProjectId = projectId;
		// }
		// param.WicGroupIds = selecteWicGroupIds;

		// let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
		// return this.http.post(this.configService.webApiBaseUrl + 'boq/main/getwicboqtree', param).then(function (response) {
		// 	if (response) {
		// 		serviceContainer.data.itemTree=response.data;
		//
		// 		let result = [];
		// 		cloudCommonGridService.flatten(response.data, result, 'BoqItems');
		//
		// 		_.forEach(result, function (item) {
		// 			boqMainImageProcessor.processItem(item);
		// 		});
		// 		serviceContainer.data.itemList =result;
		//
		// 		serviceContainer.data.listLoaded.fire();
		//
		// 	} else {
		// 		serviceContainer.data.itemTree =[];
		// 		serviceContainer.data.listLoaded.fire();
		// 	}
		//
		// 	if(_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.attachDataToColumn)) {
		// 		_dynamicUserDefinedColumnsService.attachDataToColumn(serviceContainer.data.itemList);
		// 	}
		// });
	}
}
