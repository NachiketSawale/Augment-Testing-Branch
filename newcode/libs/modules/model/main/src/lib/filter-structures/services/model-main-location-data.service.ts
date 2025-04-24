/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions }
	from '@libs/platform/data-access';
import { IProjectComplete, IProjectLocationEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ModelMainLocationDataService extends DataServiceHierarchicalRoot<IProjectLocationEntity, IProjectComplete> {

	public constructor() {
		const options: IDataServiceOptions<IProjectLocationEntity> = {
			apiUrl: 'project/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IProjectLocationEntity>>{
				role: ServiceRole.Root,
				itemName: 'Locations',
			}
		};

		super(options);
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
	 * @brief Gets the children of the given project location entity.
	 * @param element The project location entity.
	 * @return An array of child project location entities.
	 */
	public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
		return element.Locations ?? [];
	}

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
	 * @brief Updates markers based on the given list of project location entities.
	 * @param itemList The list of project location entities.
	 */
	public markersChanged(itemList: IProjectLocationEntity) {
		//modelMainFilterService  TODO modelMainFilterService
		if (Array.isArray(itemList) && itemList.length > 0) {
			itemList.forEach((item: IProjectLocationEntity) => { });

		} else { /* empty */ }
	}
}



