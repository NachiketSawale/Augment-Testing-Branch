/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { Injectable, InjectionToken } from '@angular/core';
import { ISearchResult } from '@libs/platform/common';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';

export const BASICS_EFBSHEETS_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsDataService>('basicsEfbsheetsDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 * @class BasicsEfbsheetsDataService
* @brief A service class for managing basics EFBSheets entities.
 */
export class BasicsEfbsheetsDataService extends DataServiceFlatRoot<IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsEfbsheetsEntity> = {
			apiUrl: 'basics/efbsheets/crewmixes',

			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IBasicsEfbsheetsEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstCrewMixes'
			}
		};

		super(options);
	}

	/**
	 * @brief Creates an updated entity representation based on the provided modified entity.
	 * @param modified The modified basics EFBSheets entity. Can be null.
	 * @return An IBasicsEfbsheetsComplete object containing the updated values.
	 */
	public override createUpdateEntity(modified: IBasicsEfbsheetsEntity | null): IBasicsEfbsheetsComplete {
		return {
			Id: modified?.Id ?? null,
			EstCrewMix: modified ?? null,
			EstCrewMixAfsnToSave: null,
			EstCrewMixAfsnToDelete: null,
		} as unknown as  IBasicsEfbsheetsComplete;
	}

	/**
	 * Retrieves the list of modified cost code entities from the provided update data.
	 * @param complete The `IBasicsEfbsheetsComplete` object containing the updated data.
	 *
	 * @returns An array of `IBasicsEfbsheetsEntity` objects. If `complete.EstCrewMix` is `null`, returns an empty array;
	 *          otherwise, returns an array with the `EstCrewMix` property as its only element.
	 */
	public override getModificationsFromUpdate(complete: IBasicsEfbsheetsComplete): IBasicsEfbsheetsEntity[] {
		return complete.EstCrewMix ? [complete.EstCrewMix] : [];
	}
	
	/**
	 * @brief Handles the successful loading of data by filter.
	 *
	 * @param loaded The loaded data object, expected to be an array of IBasicsEfbsheetsEntity.
	 * @return An object representing the search result, including filter execution info and the loaded entities.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IBasicsEfbsheetsEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded as IBasicsEfbsheetsEntity[]
	};
}
}
