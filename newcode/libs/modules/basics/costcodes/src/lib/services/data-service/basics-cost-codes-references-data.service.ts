/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { BasicsCostCodesReferencesComplete } from '../../model/basics-cost-codes-references-complete.class';
import { ICostCodesRefrenceEntity } from '@libs/basics/interfaces';
import { ICostCodeCompanyEntity } from '../../model/models';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';

export const BASICS_COST_CODES_REFERENCES_DATA_TOKEN = new InjectionToken<BasicsCostCodesReferencesDataService>('basicsCostCodesReferencesDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 BasicsCostCodesReferencesDataService
 */
export class BasicsCostCodesReferencesDataService extends DataServiceFlatNode<ICostCodesRefrenceEntity, BasicsCostCodesReferencesComplete, ICostCodeCompanyEntity, IBasicsCostCodesComplete> {
	public parentService = inject(BasicsCostCodesDataService);
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostCodesRefrenceEntity> = {
			apiUrl: 'basics/costcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getreferences',
				usePost: false
			},

			roleInfo: <IDataServiceRoleOptions<ICostCodesRefrenceEntity>>{
				role: ServiceRole.Node,
				itemName: 'Refrences',
				parent: parentService
			},
		};

		super(options);
	}

	/**
	 * Creates a `BasicsCostCodesReferencesComplete` entity based on the provided modified cost codes reference entity.
	 * @param modified The modified `ICostCodesRefrenceEntity` to be included in the new complete entity, or `null` to create an empty entity.
	 *
	 * @returns A new `BasicsCostCodesReferencesComplete` object with the `Id` and `Refrences` properties set based on the `modified` entity.
	 */
	public override createUpdateEntity(modified: ICostCodesRefrenceEntity | null): BasicsCostCodesReferencesComplete {
		const complete = new BasicsCostCodesReferencesComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Refrences = [modified];
		}
		return complete;
	}

	/**
	 * Retrieves the list of modified cost codes reference entities from the provided update.
	 * @param complete The `BasicsCostCodesReferencesComplete` object containing the cost codes reference data.
	 *
	 * @returns An array of `ICostCodesRefrenceEntity` representing the modified references.
	 *          If `Refrences` is `null`, returns an empty array.
	 */
	public override getModificationsFromUpdate(complete: BasicsCostCodesReferencesComplete): ICostCodesRefrenceEntity[] {
		if (complete.Refrences === null) {
			return [];
		}
		return complete.Refrences;
	}

	/**
	 * Handles the successful loading of data and processes it into a list of cost codes reference entities.
	 * @param loaded The loaded data as an object. It is expected to be a JSON string that represents an array of cost codes reference entities.
	 *
	 * @returns An array of `ICostCodesRefrenceEntity` with updated `Id` and `Source` properties.
	 */
	protected override onLoadSucceeded(loaded: object): ICostCodesRefrenceEntity[] {
		const data = loaded as unknown as string;
		const loadedData: ICostCodesRefrenceEntity[] = JSON.parse(data);

		loadedData.forEach((item, index) => {
			item.Id = index + 1; // Set the Id based on the index
			item.Source = (item as ICostCodesRefrenceEntity).Source;
		});

		return loadedData;
	}

	/**
	 * Provides the payload for loading data based on the current selection
	 * @returns An object containing the `costcodeId` of the selected item.
	 *
	 * @throws Error If no selection is available (i.e., the selection array is empty).
	 */
	protected override provideLoadPayload(): object {
		const selection = this.parentService.getSelection()[0];
		return { costcodeId: selection.Id };
	}
}
