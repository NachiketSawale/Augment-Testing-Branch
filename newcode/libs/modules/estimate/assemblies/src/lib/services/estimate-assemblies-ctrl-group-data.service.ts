/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { LineItemBaseComplete } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IEstLineitem2CtrlGrpEntity } from '../model/entities/est-lineitem-2ctrl-grp-entity.interface';
import { EstAssemblyCtrlGroupComplete } from '../model/complete/est-assembly-ctrl-group-complete.class';
import { EstimateAssembliesService } from '../containers/assemblies/estimate-assemblies-data.service';

export const ESTIMATE_ASSEMBLIES_CTRL_GROUP_DATA_TOKEN = new InjectionToken<EstimateAssembliesCtrlGroupDataService>('estimateAssembliesCtrlGroupDataToken');

@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesCtrlGroupDataService extends DataServiceFlatNode<IEstLineitem2CtrlGrpEntity, EstAssemblyCtrlGroupComplete, IEstLineItemEntity, LineItemBaseComplete> {
	public estimateAssembliesService = inject(EstimateAssembliesService);
	public constructor(private parentService: EstimateAssembliesService) {
		const options: IDataServiceOptions<IEstLineitem2CtrlGrpEntity> = {
			apiUrl: 'estimate/assemblies/ctrlgrp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstLineitem2CtrlGrpEntity, IEstLineItemEntity, LineItemBaseComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstAssembliesCtrlGrp',
				parent: parentService,
			},
		};

		super(options);
	}

	/**
	 * @brief Provides the payload for loading data.
	 * @return An object containing the main item ID.
	 */
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}

		return {
			mainItemId: -1,
		};
	}

	/**
	 * @brief Handles successful loading of data.
	 *
	 * This method is called when data loading succeeds. It casts the loaded data
	 * to an array of IEstLineitem2CtrlGrpEntity objects and returns it.
	 *
	 * @param loaded The object containing the loaded data.
	 * @return An array of IEstLineitem2CtrlGrpEntity objects.
	 */
	protected override onLoadSucceeded(loaded: object): IEstLineitem2CtrlGrpEntity[] {
		return loaded as IEstLineitem2CtrlGrpEntity[];
	}

	/**
	 * @brief Creates or updates an EstAssemblyCtrlGroupComplete entity.
	 * @param modified The modified IEstLineitem2CtrlGrpEntity object, or null if no modification is provided.
	 * @return A new EstAssemblyCtrlGroupComplete entity.
	 */
	public override createUpdateEntity(modified: IEstLineitem2CtrlGrpEntity | null): EstAssemblyCtrlGroupComplete {
		const complete = new EstAssemblyCtrlGroupComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.EstAssembliesCtrlGrp = [modified];
		}
		return complete;
	}
	
	/**
	 * @brief Extracts modifications from an EstAssemblyCtrlGroupComplete entity.
	 * @return An array of IEstLineitem2CtrlGrpEntity objects containing the modifications.
	 */
	public override getModificationsFromUpdate(complete: EstAssemblyCtrlGroupComplete): IEstLineitem2CtrlGrpEntity[] {
		if (complete.EstAssembliesCtrlGrp) {
			return complete.EstAssembliesCtrlGrp;
		}
		return [];
	}

	/**
	 * onCreateSucceeded
	 * @param created
	 * @protected
	 */
	protected override onCreateSucceeded?(loaded: object): IEstLineitem2CtrlGrpEntity {
		const selectedItem = this.estimateAssembliesService.getSelection()[0];
		const created = loaded as IEstLineitem2CtrlGrpEntity;
		if (selectedItem && selectedItem.Id) {
			created.Id = selectedItem.Id;
			created.EstHeaderFk = selectedItem.EstHeaderFk;
		}
		return created;
	}
	// TODO :  platform-module-manager in activeModule does not have modifications
	// let entityDelete = function(){
	// 	let modState = platformModuleStateService.state(service.getModule());

	// 	let parentState = modState.modifications;
	// 	let itemName = data.itemName + 'ToSave';
	// 	let parentValidation = modState.validation;
	// 	if(parentState  && parentState[itemName]) {
	// 		for(let i =  parentState[itemName].length - 1; i >= 0; i--){
	// 			if (null === serviceContainer.service.getItemById(parentState[itemName][i].MainItemId)){
	// 				parentState[itemName].splice(i);
	// 				modState.modifications.EntitiesCount -= 1;
	// 			}

	// 		}
	// 	}
	// 	// Clear specific validation
	// 	if(parentValidation.issues)
	// 	{
	// 		for(let j =  parentValidation.issues.length - 1; j >= 0; j--)
	// 		{
	// 			if(null === serviceContainer.service.getItemById(parentValidation.issues[j].entity.Id))
	// 			{
	// 				parentValidation.issues.splice(j);
	// 			}
	// 		}
	// 	}
	// };
}
