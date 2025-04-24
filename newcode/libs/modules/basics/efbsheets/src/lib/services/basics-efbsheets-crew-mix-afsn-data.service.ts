/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { IBasicsEfbsheetsCrewMixAfsnComplete } from '../model/entities/basics-efbsheets-crew-mix-afsn-complete.interface';
import { IBasicsEfbsheetsEntity, IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';

export const BASICS_EFBSHEETS_CREW_MIX_AFSN_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsCrewMixAfsnDataService>('basicsEfbsheetsCrewMixAfsnDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsEfbsheetsCrewMixAfsnDataService extends DataServiceFlatNode<IEstCrewMixAfsnEntity, IBasicsEfbsheetsCrewMixAfsnComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	private basicsEfbsheetsDataService = inject(BasicsEfbsheetsDataService);
	public constructor(basicsEfbsheetsDataService: BasicsEfbsheetsDataService) {
		const options: IDataServiceOptions<IEstCrewMixAfsnEntity> = {
			apiUrl: 'basics/efbsheets/crewmixafsn',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',

				prepareParam: () => {
					const selection = basicsEfbsheetsDataService.getSelectedEntity();
					return {
						estCrewMixFk: selection?.Id ?? 0,
					};
				},
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstCrewMixAfsnEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstCrewMixAfsn',
				parent: basicsEfbsheetsDataService,
			},
		};

		super(options);
	}

	/**
	 * @brief Creates an update entity for a given modified crew mix entity.
	 *
	 * @param modified The modified crew mix entity of type `IEstCrewMixAfsnEntity`, or `null` if no modifications are present.
	 *
	 * @return An object of type `IBasicsEfbsheetsCrewMixAfsnComplete`, which includes the `MainItemId`
	 *         and the modified crew mix entity.
	 *
	 * @details If `modified` is not null, its `Id` is assigned to `MainItemId`,
	 *          and the `modified` entity itself is assigned to `EstCrewMixAfsn`.
	 */
	public override createUpdateEntity(modified: IEstCrewMixAfsnEntity | null): IBasicsEfbsheetsCrewMixAfsnComplete {
		return {
			MainItemId: modified?.Id,
			EstCrewMixAfsn: modified ?? null,
		} as unknown as IBasicsEfbsheetsCrewMixAfsnComplete;
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
	 * @brief Registers modifications to be saved and deletions to be removed for a given parent entity.
	 *
	 * @param complete The parent entity of type `IBasicsEfbsheetsComplete` to update.
	 * @param modified An array of modified `IBasicsEfbsheetsCrewMixAfsnComplete` entities to save.
	 * @param deleted An array of `IEstCrewMixAfsnEntity` entities to delete.
	 *
	 * @details If `modified` contains elements, assigns it to `complete.EstCrewMixAfsnToSave`.
	 *          If `deleted` contains elements, assigns it to `complete.EstCrewMixAfsnToDelete`.
	 */
	public override registerNodeModificationsToParentUpdate(complete: IBasicsEfbsheetsComplete, modified: IBasicsEfbsheetsCrewMixAfsnComplete[], deleted: IEstCrewMixAfsnEntity[]) {
		if (modified && modified.length > 0) {
			complete.EstCrewMixAfsnToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.EstCrewMixAfsnToDelete = deleted;
		}
	}

	/**
	 * @brief Determines if the given entity is a child of the specified parent key.
	 *
	 * @param parentKey The parent key object of type `IBasicsEfbsheetsEntity`.
	 * @param entity The entity object of type `IEstCrewMixAfsnEntity`.
	 *
	 * @return `true` if `entity.EstCrewMixFk` matches `parentKey.Id`, indicating
	 *         the entity is a child of the parent; `false` otherwise.
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IEstCrewMixAfsnEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}

	public override getSavedEntitiesFromUpdate(complete: IBasicsEfbsheetsComplete): IEstCrewMixAfsnEntity[] {
		if (complete && complete.EstCrewMixAfToSave) {
			return complete.EstCrewMixAfToSave;
		}

		return [];
	}
}
