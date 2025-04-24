/*
 * Copyright(c) RIB Software GmbH
 */

import {
	DataServiceHierarchicalRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { IWicGroupEntity } from '@libs/boq/wic';
import { Injectable } from '@angular/core';
import { ISearchResult } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainWicGroupDataService extends DataServiceHierarchicalRoot<IWicGroupEntity,IWicGroupEntity>{

	public constructor() {
		const options: IDataServiceOptions<IWicGroupEntity> = {
			apiUrl: 'boq/wic/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},

			updateInfo: {},
			roleInfo: <IDataServiceRoleOptions<IWicGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'WicGroups',
			},
		};

		super(options);
	}
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IWicGroupEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},

			dtos: this.getDisplaytext(loaded! as IWicGroupEntity[])
		};
	}
	/**
	 * @brief Callback for when data load succeeds.
	 * @param loaded The loaded data.
	 * @return An array of project location entities.
	 */
	public override onLoadSucceeded(loaded: object): IWicGroupEntity[] {

		return loaded as IWicGroupEntity[];
	}
	/**
	 * @brief Gets the children of the given WIC group entity.
	 * @param element The WIC group entity.
	 * @return An array of child WIC group entities.
	 */
	public override childrenOf(element: IWicGroupEntity): IWicGroupEntity[] {
		return element.WicGroups as IWicGroupEntity[] ?? [];
	}

	/**
	 * @brief Gets the parent of the given WIC group entity.
	 * @param element The WIC group entity.
	 * @return The parent WIC group entity or null if no parent exists.
	 */
	public override parentOf(element: IWicGroupEntity): IWicGroupEntity | null {
		if (element.WicGroupFk == null) {
			return null;
		}

		const parentId = element.WicGroupFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
	/**
	 * @brief Updates the parent of the given WIC group entity.
	 * @param entity The WIC group entity to update.
	 * @param newParent The new parent WIC group entity, or null if no parent exists.
	 */
	public override onTreeParentChanged(entity: IWicGroupEntity, newParent: IWicGroupEntity | null): void {
		entity.WicGroupFk = newParent?.Id;
	}
	/**
	 * @brief Recursively appends translated descriptions to the code of WIC group entities.
	 * @param data An array of WIC group entities to process.
	 * This method constructs a display text by concatenating the Code and the translated DescriptionInfo of each entity.
	 * If an entity has child groups (WicGroups), the method is called recursively to process these children.
	 * @returns The original data array is returned with updated Code properties for each entity.
	 */
	private getDisplaytext(data:IWicGroupEntity[]):IWicGroupEntity[]{
		data.forEach(item=>{
			item.Code = item.Code +' - '+ item.DescriptionInfo?.Translated;
			if(item.WicGroups){
				this.getDisplaytext(item.WicGroups);
			}
		});
		return data;
	}


}