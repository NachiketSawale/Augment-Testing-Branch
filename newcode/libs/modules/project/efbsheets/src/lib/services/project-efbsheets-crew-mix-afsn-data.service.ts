/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { BasicsEfbsheetsCommonService, IBasicsEfbsheetsComplete } from '@libs/basics/efbsheets';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectEfbsheetsCrewMixAfsnComplete } from '../model/project-efbsheets-crew-mix-afsn-complete.interface';
import { childType, IBasicsEfbsheetsEntity, IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';
import { ProjectEfbsheetsDataService } from './project-efbsheets-data.service';

export const PROJECT_EFBSHEETS_CREW_MIX_AFSN_DATA_TOKEN = new InjectionToken<ProjectEfbsheetsCrewMixAfsnDataService>('projectEfbsheetsCrewMixAfsnDataService');

@Injectable({
	providedIn: 'root'
})
export class ProjectEfbsheetsCrewMixAfsnDataService extends DataServiceFlatNode<IEstCrewMixAfsnEntity, IProjectEfbsheetsCrewMixAfsnComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	private projectEfbsheetsProjectDataService = inject(ProjectEfbsheetsDataService);
	private injector = inject(Injector);
	public constructor(parentService: ProjectEfbsheetsDataService) {
		const options: IDataServiceOptions<IEstCrewMixAfsnEntity> = {
			apiUrl: 'basics/efbsheets/crewmixafsn',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: (ident) => {
					const selectedProjectItem = this.projectEfbsheetsProjectDataService.getSelection()[0];
					return { estCrewMixFk: selectedProjectItem?.Id ?? 0 };
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstCrewMixAfsnEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstCrewMixAfsn',
				parent: parentService
			}
		};

		super(options);
	}
	
    /**
	 * @brief Indicates whether the current instance should be registered by method.
	 * This method always returns true, indicating that registration is permitted.
	 * @return `true` if registration by method is allowed; otherwise, `false`.
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * @brief Creates or updates an entity of type `IProjectEfbsheetsCrewMixAfsnComplete`.
	 *
	 * This method constructs and returns an `IProjectEfbsheetsCrewMixAfsnComplete` object
	 * based on the provided modified entity. If the modified entity is null, default values
	 * are used for the properties.
	 */
	public override createUpdateEntity(modified: IEstCrewMixAfsnEntity | null): IProjectEfbsheetsCrewMixAfsnComplete {
		return {
			MainItemId: modified?.Id,
			Id: modified?.Id ?? 0,
			EstCrewMixAfsn: [modified],
		} as IProjectEfbsheetsCrewMixAfsnComplete;
	}

	/**
	 * @brief Registers node modifications to the parent update object.
	 *
	 * This method updates the parent object with modified and deleted crew mix details,
	 * calculates crew mixes and their child relationships, and assigns the selected crew mix
	 * to the parent update object if applicable.
	 *
	 * @param parentUpdate The parent update object of type `IBasicsEfbsheetsComplete` to be updated.
	 * @param modified An array of modified `IProjectEfbsheetsCrewMixAfsnComplete` objects.
	 * @param deleted An array of deleted `IProjectEfbsheetsCrewMixAfsnComplete` objects.
	 */
	public override registerNodeModificationsToParentUpdate(parentUpdate: IBasicsEfbsheetsComplete, modified: IProjectEfbsheetsCrewMixAfsnComplete[], deleted: IProjectEfbsheetsCrewMixAfsnComplete[]) {
		if (modified && modified.length > 0) {
			parentUpdate.EstAverageWageToSave = modified;
		}
		const selectedCreMix = this.projectEfbsheetsProjectDataService.getSelection()[0];
		if (deleted && deleted.length > 0) {
			parentUpdate.EstAverageWageToDelete = deleted;
			const basicsEfbsheetsCommonService = this.injector.get(BasicsEfbsheetsCommonService);
			basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCreMix, childType.CrewmixAFSN);
			parentUpdate.EstCrewMix = selectedCreMix ?? null;
		}
	}

	/**
	 * @brief Determines if the given entity is a child of the specified parent.
	 *
	 * This method checks whether the `EstCrewMixFk` property of the entity matches the `Id` of the parent key.
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IEstCrewMixAfsnEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}
}
