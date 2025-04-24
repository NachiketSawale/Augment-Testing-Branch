/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN, childType, IBasicsEfbsheetsEntity, IEstCrewMixAfEntity } from '@libs/basics/interfaces';
import { ProjectEfbsheetsDataService } from './project-efbsheets-data.service';
import {  BasicsEfbsheetsCrewMixAfComplete,IBasicsEfbsheetsComplete } from '@libs/basics/efbsheets';
import {  PlatformLazyInjectorService } from '@libs/platform/common';

export const PROJECT_EFBSHEETS_CREW_MIX_AF_DATA_TOKEN = new InjectionToken<ProjectEfbsheetsCrewMixAfDataService>('projectEfbsheetsProjectCrewMixAfDataToken');
@Injectable({
	providedIn: 'root',
})
export class ProjectEfbsheetsCrewMixAfDataService extends DataServiceFlatNode<IEstCrewMixAfEntity, BasicsEfbsheetsCrewMixAfComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private projectEfbsheetsProjectDataService = inject(ProjectEfbsheetsDataService);
	private projectEfbsheetstDataService = inject(ProjectEfbsheetsDataService);
	public constructor(parentService: ProjectEfbsheetsDataService) {
		const options: IDataServiceOptions<IEstCrewMixAfEntity> = {
			apiUrl: 'basics/efbsheets/crewmixaf',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
                prepareParam: (ident) => {
					const selectedProjectItem = this.projectEfbsheetstDataService.getSelection()[0];
					return { estCrewMixFk: selectedProjectItem?.Id ?? 0 };
				},
				usePost: true
			},

			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: {

				prepareParam: () => {
					const selection = this.projectEfbsheetstDataService.getSelectedEntity();
					return {
						estCrewMixFk: selection?.Id ?? 0
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstCrewMixAfEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstCrewMixAf',
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
	 * @brief Creates an update entity for EstCrewMixAf modifications.
	 * This method creates and returns a `BasicsEfbsheetsCrewMixAfComplete` object based on the provided modified entity.
	 * If the `modified` entity is not null, it sets the `MainItemId` and assigns the modified entity
	 * to the `EstCrewMixAf` property of the `BasicsEfbsheetsCrewMixAfComplete` object.
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
	 * @brief Registers modifications to the parent update object for EstCrewMixAf entities.
	 * This method updates the `parentUpdate` object with the modified and deleted EstCrewMixAf entities.
	 * If the `modified` array contains items, it assigns them to the `EstCrewMixAfToSave` property.
	 * If the `deleted` array contains items, it assigns them to the `EstCrewMixAfToDelete` property.
	 */
	public override async registerNodeModificationsToParentUpdate(parentUpdate: IBasicsEfbsheetsComplete, modified: BasicsEfbsheetsCrewMixAfComplete[], deleted: IEstCrewMixAfEntity[]) {
		const selectedCreMix = this.projectEfbsheetsProjectDataService.getSelection()[0];
		if (modified && modified.length > 0) {
			parentUpdate.EstCrewMixAfToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.EstCrewMixAfToDelete = deleted;
			const basicsCommonToken=this.lazyInjector.inject(BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN);
			(await basicsCommonToken).calculateCrewmixesAndChilds(selectedCreMix, childType.AverageWage);
			(await basicsCommonToken).calculateCrewmixesAndChilds(selectedCreMix, childType.CrewmixAFSN);
			this.projectEfbsheetsProjectDataService.setModified(selectedCreMix);
			this.refresh();
		}
		
	}

	/**
 	* @brief Refreshes the data by reloading it from the parent selection.
 	* 
 	* This method checks if there is a selected parent entity. If a parent is selected, 
	 * it triggers a reload of the data by calling the `load` method with an object containing
 	* an `id` of `0`. This method is typically used to ensure that the latest data is
 	* loaded when the parent entity is available.
 	* 
 	* @note If there is no parent selection, no action is taken.
 	*/
	 public refresh() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			this.load({ id: 0 });
		}
	}
    
	/**
	 * @brief Determines if the given entity is a child of the specified parent.
	 * This method compares the `EstCrewMixFk` property of the entity to the `Id` of the parent key
	 * to determine if the entity is associated with the parent.
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IEstCrewMixAfEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}
}
