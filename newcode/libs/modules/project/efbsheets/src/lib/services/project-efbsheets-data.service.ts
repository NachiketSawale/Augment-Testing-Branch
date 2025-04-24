/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { IBasicsEfbsheetsComplete } from '@libs/basics/efbsheets';

export const BASICS_EFBSHEETS_PROJECT_DATA_TOKEN = new InjectionToken<ProjectEfbsheetsDataService>('projectEfbsheetsProjectDataToken');

@Injectable({
	providedIn: 'root',
})
export class ProjectEfbsheetsDataService extends DataServiceFlatNode<IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete, IProjectEntity, IProjectComplete> {
	public constructor() {
		const projectMainService = inject(ProjectMainDataService);
		const options: IDataServiceOptions<IBasicsEfbsheetsEntity> = {
			apiUrl: 'basics/efbsheets/crewmixes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyproject',
				usePost: true,
				prepareParam: (ident) => {
					const selectedProjectItem = projectMainService.getSelection()[0];
					return { ProjectFk: selectedProjectItem?.Id ?? 0 };
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			createInfo: {
				prepareParam: () => {
					const selectedProjectItem = projectMainService.getSelection()[0];
					return { ProjectFk: selectedProjectItem?.Id ?? 0 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsEfbsheetsEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Root,
				itemName: 'EstCrewMix',
				parent: projectMainService,
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
	 * @brief Generates a payload object for creating a new item.
	 *
	 * This method checks for a selected parent and uses its `Id` to populate the
	 * `ProjectFk` field in the payload. If no parent is selected, it returns an empty object.
	 *
	 * @return {object} The payload object for creation. Includes `ProjectFk` if a parent is selected, otherwise an empty object.
	 */
	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				ProjectFk: parentSelection.Id
			};
		}

		return {};
	}

    /**
	 * This method constructs an `IBasicsEfbsheetsComplete` object based on the provided 
	 * `IBasicsEfbsheetsEntity`. It assigns the `Id` of the modified entity to the `MainItemId` property 
 	 * and includes the entire modified entity as `EstCrewMix`. If the input is `null`, `EstCrewMix` is set to `null`.	
	 * @param {IBasicsEfbsheetsEntity | null} modified - The modified entity to be transformed into 
 	 * an `IBasicsEfbsheetsComplete` object, or `null` if no entity is provided.
 	 * @return {IBasicsEfbsheetsComplete} A complete entity object, containing the `MainItemId` and `EstCrewMix` properties.
 	 */
    public override createUpdateEntity(modified: IBasicsEfbsheetsEntity | null): IBasicsEfbsheetsComplete {
		return {
			MainItemId: modified?.Id,
			EstCrewMix: modified ?? null
		} as unknown as IBasicsEfbsheetsComplete;
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
	public override registerNodeModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IBasicsEfbsheetsComplete[], deleted: IBasicsEfbsheetsEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.EstCrewMixToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.EstCrewMixToDelete = deleted;
		}
	}

	/**
    * @brief Retrieves the saved entities from the update process. 
    * This method extracts the `EstCrewMixToSave` property from the `complete` parameter 
    * if it exists; otherwise, it returns an empty array.
     */
	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IBasicsEfbsheetsEntity[] {
		return complete && complete.EstCrewMixToSave ? complete.EstCrewMixToSave : [];
	}

	public override isParentFn(parentKey: IProjectEntity, entity: IBasicsEfbsheetsEntity): boolean {
		return entity.ProjectFk === parentKey.Id;
	}

	// service.copyMasterCrewMix = function copyMasterCrewMix(){                             // TODO basicsEfbsheetsCopyMasterCrewMixService  not ready
	// 	let selectedProjectItem = projectMainService.getSelected();
	// 	if(selectedProjectItem){
	// 		$injector.get('basicsEfbsheetsCopyMasterCrewMixService').showMasterCrewMixDialog(selectedProjectItem);
	// 	}
	// };
}
