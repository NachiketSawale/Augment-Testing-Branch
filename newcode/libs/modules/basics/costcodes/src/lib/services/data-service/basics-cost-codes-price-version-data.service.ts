/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { ICostCodeEntity, ICostcodePriceVerEntity } from '@libs/basics/interfaces';
import { IBasicsCostCodesPriceVersionComplete } from '../../model/basics-cost-codes-price-version-complete.interface';
import { ISearchResult } from '@libs/platform/common';

export const BASICS_COST_CODES_PRICE_VERSION_DATA_TOKEN = new InjectionToken<BasicsCostCodesPriceVersionDataService>('basicsCostCodesPriceVersionDataToken');

@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionDataService extends DataServiceFlatRoot<ICostcodePriceVerEntity, IBasicsCostCodesPriceVersionComplete> {
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostcodePriceVerEntity> = {
			apiUrl: 'basics/costcodes/versions',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<ICostcodePriceVerEntity>>{
				role: ServiceRole.Root,
				itemName: 'PriceVersion'
			},
		};

		super(options);
	}

/**
 * @brief Creates an `IBasicsCostCodesPriceVersionComplete` object from the provided modified entity.
 * This method constructs and returns an `IBasicsCostCodesPriceVersionComplete` object using the provided 
 * `modified` entity. If `modified` is `null`, the method sets the `PriceVersion` property to `null`. 
 * The `MainItemId` property is set to the `Id` of the `modified` entity, if available.
 * @param modified An optional `ICostcodePriceVerEntity` that represents the modified entity to be included in the result.
 * @return An `IBasicsCostCodesPriceVersionComplete` object with the following properties:
 *         - `MainItemId`: The `Id` of the `modified` entity, or `undefined` if `modified` is `null`.
 *         - `PriceVersion`: The `modified` entity itself, or `null` if `modified` is `null`.
 */
	public override createUpdateEntity(modified: ICostcodePriceVerEntity | null): IBasicsCostCodesPriceVersionComplete {
		return {
			MainItemId: modified?.Id,
			PriceVersion: modified ?? null
		} as IBasicsCostCodesPriceVersionComplete;
	}

	/**
	 * @brief Processes the result of a successful filter-based load operation and returns a search result object.
	 * @param loaded An object containing the data retrieved from the filter-based load operation.
	 *
	 * @return An `ISearchResult<ICostcodePriceVerEntity>` object that includes:
	 *         - `FilterResult`: An object with details about the filter operation, such as execution info and
	 *           counts of records found and retrieved.
	 *         - `dtos`: An array of `ICostCodeEntity` records obtained from the `loaded` parameter.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICostcodePriceVerEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded as ICostCodeEntity[],
		};
	}

	/**
	 * @brief Extracts modified `ICostcodePriceVerEntity` entities from the provided `IBasicsCostCodesPriceVersionComplete` object.
	 * @param complete An object of type `IBasicsCostCodesPriceVersionComplete` that holds information about the price version.
	 * @return An array of `ICostcodePriceVerEntity` entities. The array will contain the `PriceVersion` entity from
	 *         the `complete` parameter if it is not `null`, or be empty if `PriceVersion` is `null`.
	 */
	public override getModificationsFromUpdate(complete: IBasicsCostCodesPriceVersionComplete): ICostcodePriceVerEntity[] {
		if (complete.PriceVersion === null) {
			return [];
		}
		return [complete.PriceVersion];
	}
}
