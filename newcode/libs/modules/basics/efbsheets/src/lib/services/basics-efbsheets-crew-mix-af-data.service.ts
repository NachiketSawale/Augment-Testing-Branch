/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { BasicsEfbsheetsCrewMixAfComplete } from '../model/entities/basics-efbsheets-crew-mix-af-complete.class';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { IBasicsEfbsheetsEntity, IEstCrewMixAfEntity } from '@libs/basics/interfaces';

export const BASICS_EFBSHEETS_CREW_MIX_AF_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsCrewMixAfDataService>('basicsEfbsheetsCrewMixAfDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 * @class BasicsEfbsheetsCrewMixAfDataService
 * @extends DataServiceFlatNode
 * 
 * @brief A service for handling crew mix AF data within the basics EFBSheets context.
 * 
 * This class extends the DataServiceFlatNode to manage operations related to 
 * IEstCrewMixAfEntity objects, including data retrieval and updates.
 */
export class BasicsEfbsheetsCrewMixAfDataService extends DataServiceFlatNode<IEstCrewMixAfEntity, BasicsEfbsheetsCrewMixAfComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	public constructor(basicsEfbsheetsDataService: BasicsEfbsheetsDataService) {
		const options: IDataServiceOptions<IEstCrewMixAfEntity> = {
			apiUrl: 'basics/efbsheets/crewmixaf',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: () => {
					const selection = basicsEfbsheetsDataService.getSelectedEntity();
					return {
						estCrewMixFk: selection?.Id ?? 0,
						filter: ''
					};
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstCrewMixAfEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstCrewMixAf',
				parent: basicsEfbsheetsDataService
			}
		};

		super(options);
	}

	/**
	 * @brief Indicates whether the current instance should be registered by method.
	 *
	 * This method always returns true, indicating that registration is permitted.
	 *
	 * @return `true` if registration by method is allowed; otherwise, `false`.
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * @brief Creates an update entity based on the provided modified crew mix entity.
	 *
	 * This method initializes a new `BasicsEfbsheetsCrewMixAfComplete` instance.
	 * If a modified entity is provided (not null), it sets the `MainItemId`
	 * and initializes the `EstCrewMixAf` property with the modified entity.
	 *
	 * @param modified The modified crew mix entity of type IEstCrewMixAfEntity or null.
	 * @return A new instance of BasicsEfbsheetsCrewMixAfComplete containing the update information.
	 */
	public override createUpdateEntity(modified: IEstCrewMixAfEntity | null): BasicsEfbsheetsCrewMixAfComplete {
		const complete = new BasicsEfbsheetsCrewMixAfComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.EstCrewMixAf = [modified];
		}

		return complete;
	}

	/**
	 * @brief Retrieves the modifications from the provided complete crew mix entity.
	 *
	 * This method checks if the `EstCrewMixAf` property of the complete entity is null; if so, it initializes it as an empty array.
	 * It then returns the `EstCrewMixAf` property.
	 *
	 * @param complete The complete crew mix entity of type BasicsEfbsheetsCrewMixAfComplete.
	 * @return An array of IEstCrewMixAfEntity representing the modifications.
	 */
	public override getModificationsFromUpdate(complete: BasicsEfbsheetsCrewMixAfComplete): IEstCrewMixAfEntity[] {
		if (complete.EstCrewMixAf === null) {
			complete.EstCrewMixAf = [];
		}

		return complete.EstCrewMixAf;
	}

	/**
	 * @brief Registers modifications to the parent update for the specified complete entity.
	 *
	 * This method updates the `EstCrewMixAfsnToSave` and `EstCrewMixAfsnToDelete` properties
	 * of the provided complete entity based on the modified and deleted arrays.
	 *
	 * @param complete The complete entity of type IBasicsEfbsheetsComplete to be updated.
	 * @param modified An array of modified crew mix entities to be saved.
	 * @param deleted An array of crew mix entities to be deleted.
	 */
	public override registerNodeModificationsToParentUpdate(complete: IBasicsEfbsheetsComplete, modified: BasicsEfbsheetsCrewMixAfComplete[], deleted: IEstCrewMixAfEntity[]) {
		if (modified && modified.length > 0) {
			complete.EstCrewMixAfToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.EstCrewMixAfToDelete = deleted;
		}
	}

	/**
	 * @brief Provides the payload for loading data based on the selected parent.
	 *
	 * This method constructs an object containing the foreign key of the selected parent and an empty filter string.
	 * It throws an error if no parent is selected.
	 *
	 * @return An object containing the `estCrewMixFk` and `filter` properties.
	 * @throws Error if no parent is selected.
	 */
	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();

		if (parent) {
			return {
				estCrewMixFk: parent.Id,
				filter: ''
			};
		} else {
			throw new Error('There should be a selected parent');
		}
	}

	/**
	 * @brief Handles the successful load operation by casting the loaded object to an array of IEstCrewMixAfEntity.
	 *
	 * @param loaded The object returned from the load operation.
	 * @return An array of IEstCrewMixAfEntity after casting the loaded object.
	 */
	protected override onLoadSucceeded(loaded: object): IEstCrewMixAfEntity[] {
		return loaded as IEstCrewMixAfEntity[];
	}

	/**
	 * @brief Determines if the given entity is a child of the specified parent entity.
	 *
	 * @param parentKey The parent entity of type IBasicsEfbsheetsEntity.
	 * @param entity The entity of type IEstCrewMixAfEntity to be checked.
	 * @return `true` if the entity is a child of the parentKey, `false` otherwise.
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IEstCrewMixAfEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}	
}
