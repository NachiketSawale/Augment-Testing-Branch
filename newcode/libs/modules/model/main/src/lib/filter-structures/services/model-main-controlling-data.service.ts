/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IControllingUnitEntity } from '@libs/basics/shared';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions }
	from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

export class ModelMainControllingDataService extends DataServiceHierarchicalRoot<IControllingUnitEntity, ''> {

	public constructor() {
		const options: IDataServiceOptions<IControllingUnitEntity> = {
			apiUrl: 'controlling/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IControllingUnitEntity>>{
				role: ServiceRole.Root,
				itemName: 'ControllingUnits',
			}
		};

		super(options);
	}

	/**
	 * @brief Provides the payload for loading data by filter.
	 * This method constructs and returns an object that serves as a filter
	 * payload for loading data based on the selected project in the model main service.
	 * @return An object containing the filter criteria.
	 */
	protected override provideLoadByFilterPayload(): object {
		const filter = {
			// mainItemId: this.projectId.ProjectFk
		};
		return filter;
	}

	/**
		Retrieves the parent of the specified controlling unit entity.
	  *
	*/
	public override parentOf(element: IControllingUnitEntity): IControllingUnitEntity | null {
		if (element.ControllingunitFk == null) {
			return null;
		}

		const parentId = element.ControllingunitFk;
		return parentId === undefined ? null : parentId;
	}

	/**
	 * @brief Gets the children of the given project location entity.
	 * @param element The project location entity.
	 * @return An array of child project location entities.
	 */
	public override childrenOf(element: IControllingUnitEntity): IControllingUnitEntity[] {
		if(element.Controllingunits == null) {
			return [];
		}
		return element.Controllingunits ?? [];
	}


	/**
 * @brief Updates markers based on the given list of project location entities.
 * @param itemList The list of project location entities.
 */
	public markersChanged(itemList: IControllingUnitEntity) {

		//modelMainFilterService  TODO modelMainFilterService
		// if (_.isArray(itemList) && _.size(itemList) > 0) {
		// 	modelMainFilterService.addFilter('modelMainControllingListController', service, function (objectItem) {
		// 		var allIds = [];
		// 		// get all child controlling units (for each item)
		// 		_.each(itemList, function (item) {
		// 			var Ids = _.map(modelMainFilterCommon.collectItems(item, 'ControllingUnits'), 'Id');
		// 			allIds = allIds.concat(Ids);
		// 		});
		// 		return allIds.indexOf(objectItem.ControllingUnitFk) >= 0;
		// 	}, {id: 'filterControlling', iconClass: 'tlb-icons ico-filter-controlling'}, 'MdcControllingUnitFk');
		// } else {
		// 	modelMainFilterService.removeFilter('modelMainControllingListController');
		// }
	}

	protected override onLoadSucceeded(loaded: IControllingUnitEntity[]): IControllingUnitEntity[] {
		return loaded;
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedEntity();
		return { mainItemId : parent};
	}


}



