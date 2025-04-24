/*
 * Copyright(c) RIB Software GmbH
 */
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';
import { IAssemblyReferencesEntity, IEstLineItemEntity } from '../../model/models';
import { LineItemBaseComplete } from '@libs/estimate/shared';
import { EstimateAssembliesService } from '../assemblies/estimate-assemblies-data.service';

/**
 * Estimate Assemblies References Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesReferencesDataService extends DataServiceFlatLeaf<IAssemblyReferencesEntity, IEstLineItemEntity, LineItemBaseComplete> {
	/**
	 * Estimate Assemblies References Data Service Constructor
	 * @param estimateAssembliesService
	 */
	public constructor(estimateAssembliesService: EstimateAssembliesService) {
		const options: IDataServiceOptions<IAssemblyReferencesEntity> = {
			apiUrl: 'estimate/assemblies',
			roleInfo: <IDataServiceChildRoleOptions<IAssemblyReferencesEntity, IEstLineItemEntity, LineItemBaseComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EstAssemblyReference',
				parent: estimateAssembliesService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getmasterassemblyreferences',
				usePost: false,
				prepareParam: ident => {
					return { assemblyId: ident.id };
				}
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
	}

	/**
	 * Register By Method
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	protected override onLoadSucceeded(loaded: IAssemblyReferencesEntity[]): IAssemblyReferencesEntity[] {
		let i = 1;
		loaded.forEach((item: IAssemblyReferencesEntity) => {
			item.EstLineItemId = i++;
		});
		return loaded;
	}

	/**
	 * Register Modifications To Parent Update
	 * @param parentUpdate 
	 * @param modified 
	 * @param deleted 
	 */
	public override registerModificationsToParentUpdate(parentUpdate: LineItemBaseComplete,
		modified: IAssemblyReferencesEntity[],
		deleted: IAssemblyReferencesEntity[]) {
	}

	/**
	 * Get Saved Entities From Update
	 * @param complete 
	 * @returns 
	 */
	public override getSavedEntitiesFromUpdate(complete: LineItemBaseComplete): IAssemblyReferencesEntity[] {
		return [];
	}
}