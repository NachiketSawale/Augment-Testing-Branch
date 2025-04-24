/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { ICostCode2ResTypeEntity } from '../../model/entities/cost-code-2res-type-entity.interface';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';
import { IBasicsCostCodesResTypeComplete } from '../../model/basics-cost-codes-res-type-complete.interface';

export const BASICS_COST_CODES_RES_TYPE_DATA_TOKEN = new InjectionToken<BasicsCostCodesResTypeDataService>('basicsCostCodesResTypeDataToken');

@Injectable({
	providedIn: 'root'
})
/**
 BasicsCostCodesResTypeDataService
 */
export class BasicsCostCodesResTypeDataService extends DataServiceFlatNode<ICostCode2ResTypeEntity, IBasicsCostCodesResTypeComplete, ICostCodeEntity, IBasicsCostCodesComplete> {
	public parentService = inject(BasicsCostCodesDataService);
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostCode2ResTypeEntity> = {
			apiUrl: 'basics/costcodes/restype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',

				prepareParam: (ident) => {
					const selection = this.parentService.getSelection()[0];
					return {
						mainItemId: selection.Id
					};
				},
				usePost: false
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'basics/costcodes/update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				prepareParam: (ident) => {
					const selection = this.parentService.getSelection()[0];
					return {
						mainItemId: selection.Id
					};
				},
			},
			roleInfo: <IDataServiceRoleOptions<ICostCode2ResTypeEntity>>{
				role: ServiceRole.Node,
				itemName: 'CostCodes2ResType',
				parent: parentService
			},
		};

		super(options);
	}

	/**
	 * Provides the payload for creating a new entity.
	 * @returns An object containing the `mainItemId` of the selected parent.
	 *
	 * @throws Error If no parent is selected, an error is thrown with a message to select a material record.
	 */
	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		throw new Error('please select a material record first');
	}

	/**
	 * Handles the successful creation of an entity by casting and returning it.
	 *
	 * This method takes the `created` object, casts it to an `ICostCode2ResTypeEntity`, and returns it.
	 *
	 * @param created The object representing the created entity. It is expected to be of type `ICostCode2ResTypeEntity`.
	 *
	 * @returns The cast `ICostCode2ResTypeEntity` object.
	 */
	protected override onCreateSucceeded(created: object): ICostCode2ResTypeEntity {
		const entity = created as ICostCode2ResTypeEntity;

		return entity;
	}

	/**
	 * Determines whether a new entity can be created based on the current state.
	 * @returns `true` if a new entity can be created, `false` otherwise.
	 */
	public override canCreate(): boolean {
		// enable disable
		const list = this.getList();
		const parentItem = this.parentService.getSelectedEntity();
		return !!parentItem && !(list && list.length > 0);
	}

	/**
	 * Indicates whether the entity should be registered by method.
	 *
	 * This method always returns `true`, indicating that registration by method is enabled.
	 *
	 * @returns `true`, indicating that the entity should be registered by method.
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * Determines if the given entity is a child of the specified parent.
	 * @param parentKey The `ICostCodeEntity` representing the parent entity.
	 * @param entity The `ICostCode2ResTypeEntity` to be checked.
	 *
	 * @returns `true` if the `entity` is a child of the `parentKey`, `false` otherwise.
	 */
	public override isParentFn(parentKey: ICostCodeEntity, entity: ICostCode2ResTypeEntity): boolean {
		return entity.CostCodeFk === parentKey.Id;
	}

	/**
	 * Creates a `IBasicsCostCodesResTypeComplete` entity based on the provided modified cost code to resource type entity.
	 *
	 * This method constructs and returns a new `IBasicsCostCodesResTypeComplete` object.
	 * The `CostCodes2ResType` property of the returned object is set to the provided `modified` entity.
	 * If `modified` is `null` or `undefined`, `CostCodes2ResType` is set to `null`.
	 *
	 * @param modified The modified `ICostCode2ResTypeEntity` to be included in the new complete entity.
	 *
	 * @returns A new `IBasicsCostCodesResTypeComplete` object with the `CostCodes2ResType` property set to the `modified` entity or `null`.
	 */
	public override createUpdateEntity(modified: ICostCode2ResTypeEntity): IBasicsCostCodesResTypeComplete {
		return {
			CostCodes2ResType: modified ?? null
		} as IBasicsCostCodesResTypeComplete;
	}

	/**
	 * Registers modifications and deletions of cost code to resource type entities in the provided update.
	 * @param complete The `IBasicsCostCodesComplete` object to update with the modifications and deletions.
	 * @param modified An array of `ICostCode2ResTypeEntity` representing the modified entities to be saved.
	 * @param deleted An array of `ICostCode2ResTypeEntity` representing the entities to be deleted.
	 */
	public override registerNodeModificationsToParentUpdate(complete: IBasicsCostCodesComplete, modified: ICostCode2ResTypeEntity[], deleted: ICostCode2ResTypeEntity[]) {
		if (modified && modified.length > 0) {
			complete.CostCodes2ResTypeToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.CostCodes2ResTypeToDelete = deleted;
		}
	}

	/**
	 * Retrieves the saved cost code to resource type entities from the provided update.
	 *
	 * This method checks if the `complete` object and its `CostCodes2ResTypeToSave` property are defined.
	 * If both are present, the method returns the `CostCodes2ResTypeToSave` array.
	 * If either is missing or `null`, it returns an empty array.
	 *
	 * @param complete The `IBasicsCostCodesComplete` object containing the cost code data.
	 *
	 * @returns An array of `ICostCode2ResTypeEntity` representing the saved entities, or an empty array if none are found.
	 */
	public override getSavedEntitiesFromUpdate(complete: IBasicsCostCodesComplete): ICostCode2ResTypeEntity[] {
		if (complete && complete.CostCodes2ResTypeToSave) {
			return complete.CostCodes2ResTypeToSave;
		}

		return [];
	}
}
