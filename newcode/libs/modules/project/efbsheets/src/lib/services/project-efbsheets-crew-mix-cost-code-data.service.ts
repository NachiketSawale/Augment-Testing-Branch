/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IPrjCrewMix2CostCodeEntity } from '../model/prj-crew-mix-2cost-code-entity.interface';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import {  PlatformHttpService } from '@libs/platform/common';
import { IBasicsEfbsheetsComplete } from '@libs/basics/efbsheets';
import { IProjectComplete } from '@libs/project/interfaces';
import { ProjectEfbsheetsDataService } from './project-efbsheets-data.service';
import { IProjectEfbsheetsCrewMixCostCodeComplete } from '../model/project-efbsheets-crew-mix-cost-code-complete.interface';


export const PROJECT_EFBSHEETS_CREW_MIX_COST_CODE_DATA_TOKEN = new InjectionToken<ProjectEfbsheetsCrewMixCostCodeDataService>('projectEfbsheetsProjectCrewMixCostCodeDataToken');

@Injectable({
	providedIn: 'root',
})

export class ProjectEfbsheetsCrewMixCostCodeDataService extends DataServiceFlatNode<IPrjCrewMix2CostCodeEntity, IProjectEfbsheetsCrewMixCostCodeComplete, IBasicsEfbsheetsEntity, IProjectComplete> {
	private dataList: IPrjCrewMix2CostCodeEntity[] = [];
	private readonly httpService = inject(PlatformHttpService);
	private projectEfbsheetsDataService = inject(ProjectEfbsheetsDataService);
	public constructor(parentService: ProjectEfbsheetsDataService) {
		const options: IDataServiceOptions<IPrjCrewMix2CostCodeEntity> = {
			apiUrl: 'basics/efbsheets/prjcrewmixcostcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
                prepareParam: (ident) => {
					const selectedProjectItem = this.projectEfbsheetsDataService.getSelection()[0];
					return { estCrewMixFk: selectedProjectItem?.Id ?? 0 };
				},
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrjCrewMix2CostCodeEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'PrjCrewMix2CostCode',
				parent: parentService,
			},
		};

		super(options);
	}

	/**
 	* @brief Provides the payload for creating a new entity.
 	* 
 	* This method generates the payload for creating a new entity by retrieving the selected parent entity 
 	* and extracting its `Id` to set the `EstCrewMixFk` in the returned payload. If no parent entity is selected, 
 	* an empty object is returned. The method also contains a commented-out section that is intended for future 
	 * implementation when the `estimateMainLookupService` is ready.
	 * 
 	* @returns An object representing the payload for creating a new entity. 
	 *         If a parent entity is selected, it includes `EstCrewMixFk`. Otherwise, an empty object is returned.
	 */
	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				EstCrewMixFk : parentSelection.Id
			};

			// let projectItem =  $injector.get('projectMainService').getSelected();         // TODD:  estimateMainLookupService   not ready
			// 					$injector.get('estimateMainLookupService').setSelectedProjectId(projectItem.Id);
			// 					let selectedCrewmix2CostCodeItem = serviceContainer.service.getSelected();
			// 					if (selectedCrewmix2CostCodeItem && selectedCrewmix2CostCodeItem.Id > 0) {
			// 						creationData.estCrewMixFk = selectedCrewmix2CostCodeItem.EstCrewMixFk;
		}

		return {};
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

	public override createUpdateEntity(modified: IPrjCrewMix2CostCodeEntity | null): IProjectEfbsheetsCrewMixCostCodeComplete {
		return {
			MainItemId: modified?.Id,
			PrjCrewMix2CostCode: modified ?? null,
		} as unknown as IProjectEfbsheetsCrewMixCostCodeComplete;
	}

	/**
    * @brief Registers modifications to the parent update object for EFB sheets.
	* This method updates the `parentUpdate` object with the modified and deleted
	* crew mix cost code entities. It sets `EstCrewMixToSave` if there are modifications
 	* and `EstCrewMixToDelete` if there are deletions.
 	* @param parentUpdate The parent update object of type `IBasicsEfbsheetsComplete
	* to which the modifications are to be registered.
	* @param modified An array of modified `IProjectEfbsheetsCrewMixCostCodeComplete` entities.
 	* If provided and not empty, it is assigned to `parentUpdate.EstCrewMixToSave`.
 	* @param deleted An array of deleted `IPrjCrewMix2CostCodeEntity` entities.
 	* If provided and not empty, it is assigned to `parentUpdate.EstCrewMixToDelete`.
 	*/
	public override registerNodeModificationsToParentUpdate(parentUpdate:IProjectComplete, modified: IProjectEfbsheetsCrewMixCostCodeComplete[], deleted: IPrjCrewMix2CostCodeEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.EstCrewMixToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.EstCrewMixToDelete = deleted;
		}
	}
  
   /**
 	* @brief Retrieves the saved entities from the update data.
	 * 
 	* This method checks if the `complete` object contains the `EstCrewMixToSave` property.
 	* If it exists, it filters out entities with a `null` or `undefined` `Id` and maps the entities to ensure
 	* that the `Id` is explicitly cast to a `number`. It returns an array of `IPrjCrewMix2CostCodeEntity` entities.
	 * @returns An array of `IPrjCrewMix2CostCodeEntity` objects that have valid `Id` values.
 	*/
	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IPrjCrewMix2CostCodeEntity[] {
		if (complete && complete.EstCrewMixToSave) {
			return complete.EstCrewMixToSave
				.filter((entity): entity is IBasicsEfbsheetsEntity & { Id: number } => entity.Id !== null)
				.map((entity) => ({
					...entity,
					Id: entity.Id as number,
				})) as IPrjCrewMix2CostCodeEntity[];
		}
		return [];
	}

	/**
 	* @brief Adds items to the data list, ensuring unique entries and refreshing the state.
	 * 
	* This method updates the `dataList` property by adding items from the provided array.
 	* If `fromUpdate` is true, the `dataList` is replaced entirely with the new items.
	 * Otherwise, the method ensures that only unique items, determined by the `Id` property,
	 * are added to the existing `dataList`. The method also handles null or undefined input 
 	* by clearing the `dataList`. After updating, it invokes the `refresh` method to update the UI.
 	*/
	private addItems(items: IPrjCrewMix2CostCodeEntity[], fromUpdate: boolean) {
		if (fromUpdate) {
			this.dataList = [...items];
		}
		if (!items) {
			this.dataList = [];
			return;
		}

		this.dataList = this.dataList || [];
		items.forEach((item: IPrjCrewMix2CostCodeEntity) => {
			const matchItem = this.dataList.find((existingItem) => existingItem.Id === item.Id);
			if (!matchItem) {
				this.dataList.push(item);
			}
		});
		this.refresh();
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
 	* @brief Updates the cost codes by sending a request to the server with the updated data.
	 * 
 	* This method gathers the necessary data from the current selection and constructs an object
	 * to be sent in an HTTP POST request. It includes information about the crew mix, selected entities, 
 	* and cost codes. The request is sent to the specified endpoint URL for updating the cost codes.
 	* 
 	* If the request is successful, the updated result is returned. If an error occurs, an error message
 	* is logged and the method returns `null`.
 	* 
	 * @returns A promise that resolves to the updated `IPrjCrewMix2CostCodeEntity` if successful, or `null` if there is an error.
 	*/
	public updateCostCodes(): Promise<IPrjCrewMix2CostCodeEntity | null> {
		const parentUpdate: IBasicsEfbsheetsComplete = {} as IBasicsEfbsheetsComplete;
		const updateData = parentUpdate;
		updateData.EstCrewMix = this.projectEfbsheetsDataService.getSelectedEntity();

		updateData.EstCrewMixes = this.projectEfbsheetsDataService.getSelection() || null;
		updateData.MainItemId = updateData.EstCrewMix?.Id ?? null;

		const selectedCostCodeEntity = this.getSelectedEntity();
		updateData.EstCrewMix2CostCode = selectedCostCodeEntity ? [selectedCostCodeEntity] : [];

		const endPointURL = 'basics/efbsheets/prjcrewmixcostcodes/update';

		// Send HTTP POST request
		return this.httpService
			.post<IPrjCrewMix2CostCodeEntity>(endPointURL, updateData)
			.then((result) => {
				if (result) {
					// $injector.get('estimateMainLookupService').clearCache();                                             // estimateMainLookupService is not defined
					// // $injector.get('estimateMainLookupService').setSelectedProjectId(selectedProjectItem.Id);
					// $injector.get('estimateMainLookupService').getPrjCostCodesTree().then( function(result) {

					// 	let list =[];
					// 	$injector.get('cloudCommonGridService').flatten(result, list, 'ProjectCostCodes');
					// 	// $injector.get('basicsLookupdataLookupDescriptorService').updateData('costcode', list);

					// 	updatePromise = null;
					// 	let title = $translate.instant('basics.efbsheets.crewMixToCostCodes'),
					// 		msg = $translate.instant('basics.efbsheets.crewMixToCostCodesSuccess');
					// 	platformModalService.showMsgBox(msg, title, 'info').then(function (response) {  if (response.ok === true) {
					// 		service.gridRefresh();
					// 	}
				}
				return result;
			})
			.catch((error) => {
				console.error('Error updating cost codes:', error);
				return null;
			});
	}
     
   
	/**
	 * @brief Checks if the given entity is related to the parent entity.
	 * 
 	* This method compares the `EstCrewMixFk` property of the `entity` with the `Id` of the `parentKey`.
 	* If the two values match, the method returns `true`, indicating that the `entity` is associated
	 * 
	 * @returns `true` if the `entity` is associated with the `parentKey`; otherwise, `false`.
 	*/
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IPrjCrewMix2CostCodeEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}


}
