/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, IProjectLocationEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root',
})
export class PpsProjectLocationFilterService extends DataServiceHierarchicalRoot<IProjectLocationEntity, IProjectComplete> {
	public constructor() {
		const options: IDataServiceOptions<IProjectLocationEntity> = {
			apiUrl: 'project/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},

			updateInfo: {},
			roleInfo: <IDataServiceRoleOptions<IProjectLocationEntity>>{
				role: ServiceRole.Root,
				itemName: 'Locations',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};

		super(options);
	}

	/**
	 * @brief Provides payload for loading data by filter.
	 * @return The payload object.
	 */
	protected override provideLoadByFilterPayload(): object {
		//TODO: Get the pinned project Id
		const projectId = 1015580;
		return {
			projectId: projectId,
		};
	}

	// /**
	//  * @brief Callback for when data load by filter succeeds.
	//  * @param loaded The loaded data.
	//  * @return The search result containing project location entities.
	//  */
	// protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IProjectLocationEntity> {
	// 	return {
	// 		FilterResult: {
	// 			ExecutionInfo: '',
	// 			RecordsFound: 0,
	// 			RecordsRetrieved: 0,
	// 			ResultIds: [],
	// 		},
	// 		dtos: loaded as IProjectLocationEntity[],
	// 	};
	// }

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
	 * @brief Gets the children of the given project location entity.
	 * @param element The project location entity.
	 * @return An array of child project location entities.
	 */
	public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
		return element.Locations ?? [];
	}
}
