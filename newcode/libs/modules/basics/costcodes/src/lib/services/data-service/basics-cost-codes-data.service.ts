/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalRoot, EntityArrayProcessor, IEntityList, PlatformDataAccessListUtility } from '@libs/platform/data-access';

import { IDragDropTarget, ISearchResult, PlatformConfigurationService, PlatformLazyInjectorService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsCostcodesDailogConfigurationService } from '../lookups/basics-cost-codes-dailog-configuration.service';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';
import { BasicsCostCodesDynamicUserDefinedColumnService } from './basics-costcodes-dynamic-user-defined-column.service';
import { BasicsCostCodesAssingnControllingCostCodes } from './basics-cost-codes-assingn-controlling-cost-code.service';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IDragDropData } from '@libs/ui/business-base';
import { HttpClient } from '@angular/common/http';
import { BasicsCostCodesImageProcessor } from '../processor/basics-costcodes-image-processor.service';
export const BASICS_COST_CODES_DATA_TOKEN = new InjectionToken<BasicsCostCodesDataService>('basicsCostCodesDataToken');
@Injectable({
	providedIn: 'root'
})
/**
 * Basics Cost Codes Data Service
 */
export class BasicsCostCodesDataService extends DataServiceHierarchicalRoot<ICostCodeEntity, IBasicsCostCodesComplete> {
	private factorFieldsToRecalculate: { [key: string]: string } = {
		FactorCosts: 'RealFactorCosts',
		FactorQuantity: 'RealFactorQuantity'
	};
	private basicsCostCodesDynamicUserDefinedColumnService = inject(BasicsCostCodesDynamicUserDefinedColumnService);
	private basicsCostCodesAssingnControllingCostCodes = inject(BasicsCostCodesAssingnControllingCostCodes);
	public basicsCostcodesDailogConfigurationService = inject(BasicsCostcodesDailogConfigurationService);
	private readonly http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public messageBoxService = inject(UiCommonMessageBoxService);
	public translateService = inject(PlatformTranslateService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public readonly readonlyProcessor = new BasicsCostCodesImageProcessor();
	public showPreserverSelection = true;
	public isOverwrite = true;
	public isAssignToChildren = true;
	public isPreserveSelection = false;
	public isLoad = true;
	public companyCostCodes = null;
	public constructor() {
		const options: IDataServiceOptions<ICostCodeEntity> = {
			apiUrl: 'basics/costcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},

			roleInfo: <IDataServiceRoleOptions<ICostCodeEntity>>{
				role: ServiceRole.Root,
				itemName: 'CostCodes'
			},
			entityActions: { createSupported: true, deleteSupported: true },
			processors: [new EntityArrayProcessor<ICostCodeEntity>(['CostCodes'])]
		};
		super(options);
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	/**
	 * Creates an update entity for the provided cost code entity.
	 * @param modified The `ICostCodeEntity` to include in the update entity. If `null`, `CostCodes` will be set to `null`.
	 *
	 * @returns An `IBasicsCostCodesComplete` object containing:
	 *          - `MainItemId`: The ID of the `modified` entity, or `undefined` if `modified` is `null`.
	 *          - `CostCodes`: The `modified` entity, or `null` if `modified` is `null`.
	 */
	public override createUpdateEntity(modified: ICostCodeEntity | null): IBasicsCostCodesComplete {
		return {
			CostCodes: modified ? [modified] : null
		} as IBasicsCostCodesComplete;
	}

	/**
	 * Provides the payload data required for creating a new entity.
	 * @returns An object containing the creation payload. If no entity is selected or no parent is found,
	 *          returns an empty object. Otherwise, returns an object with the parent’s ID as `PKey1`.
	 */
	protected override provideCreatePayload(): object {
		const selected = this.getSelectedEntity();

		if (selected === null) {
			return {};
		}

		const parent = this.parentOf(selected);
		if (parent) {
			return {
				PKey1: parent.Id
			};
		} else {
			return {};
		}
	}

	/**
	 * Provides the payload data required for creating a child entity.
	 * @returns An object containing the data necessary for creating a child entity, including:
	 *          - `MainItemId`: The ID of the parent entity.
	 *          - `ParentCostCode`: The selected parent cost code, if available.
	 *          - `parent`: Alias for `ParentCostCode`.
	 *          - `parentId`: The ID of the selected parent cost code, if available.
	 *          - `projectId`: The ID of the parent entity.
	 */
	protected override provideCreateChildPayload(): object {
		const parent = this.getSelectedEntity();
		const ParentCostCode = this.getSelection().length > 0 ? this.getSelection()[0] : null;

		const creationData = {
			MainItemId: parent?.Id,
			ParentCostCode: ParentCostCode,
			parent: ParentCostCode,
			parentId: ParentCostCode?.Id,
			projectId: parent?.Id,
			realFactorCost: parent?.RealFactorCosts,
			realFactorQuantity: parent?.RealFactorQuantity,
			costCodeTypeFk: parent?.CostCodeTypeFk,
			costGroupPortionsFk: parent?.CostGroupPortionsFk,
			costCodePortionsFk: parent?.CostCodePortionsFk,
			abcClassificationFk: parent?.AbcClassificationFk,
			prcStructureFk: parent?.PrcStructureFk,
			contrCostCodeFk: parent?.ContrCostCodeFk
		};

		return creationData;
	}

	protected takeOverUpdatedFromComplete(complete: IBasicsCostCodesComplete, entityList: IEntityList<ICostCodeEntity>) {
		if (complete && complete.CostCodes && complete.CostCodes.length > 0) {
			entityList.updateEntities(complete.CostCodes);
			this.clearCompanyCostCodes();
		}
	}

	/**
	 * Processes the successful creation of a cost code entity.
	 * @param created The object representing the newly created cost code entity.
	 *
	 * @returns The `ICostCodeEntity` that was created.
	 */
	protected override onCreateSucceeded(entity: object): ICostCodeEntity {
		// basicsCostCodesDynamicUserDefinedColumnService.attachEmptyDataToColumn(entity);   // TODO :   basicsCommonUserDefinedColumnServiceFactory is not ready
		return entity as ICostCodeEntity;
	}

	/**
	 * Determines whether a child cost code can be created or manipulated.
	 * @returns A boolean value indicating whether a child cost code can be created or manipulated.
	 *          The method currently always returns `true`.
	 */

	public override canCreateChild(): boolean {
		return this.getSelectedEntity()?.IsEditable ?? false;
	}

	public getIsLoad(): boolean {
		return this.isLoad;
	}

	public setIsLoad() {
		this.isLoad = false;
	}

	public setSelectedCostCode(selectedCostCode: ICostCodeEntity) {
		if (selectedCostCode && selectedCostCode.Id) {
			this.setModified(selectedCostCode);
		}
	}

	/**
	 * Retrieves the list of modified cost code entities from the provided update data.
	 * @param complete The `IBasicsCostCodesComplete` object containing the updated data.
	 *
	 * @returns An array of `ICostCodeEntity` objects. If `complete.CostCodes` is `null`, returns an empty array;
	 *          otherwise, returns an array with the `CostCodes` property as its only element.
	 */
	public override getModificationsFromUpdate(complete: IBasicsCostCodesComplete): ICostCodeEntity[] {
		if (complete.CostCodes == null) {
			return [];
		}
		return complete.CostCodes;
	}

	/**
	 * Handles changes to a specific field of a cost code entity and performs necessary actions.
	 * @param item The `ICostCodeEntity` whose field has changed.
	 * @param column The name of the field that has changed. This determines the action to be taken.
	 */
	public fieldChanged(item: ICostCodeEntity, column: string) {
		const updatedItems: ICostCodeEntity[] = [];
		if (column === 'ContrCostCodeFk') {
			this.assignControllingCostCodeInternal(item, item.ContrCostCodeFk);
		} else if (this.factorFieldsToRecalculate[column]) {
			this.recalculateFactorValues(item, column as keyof ICostCodeEntity, null, updatedItems);
			updatedItems.push(item);
			this.setModified(updatedItems);
		}
	}

	public assignControllingCostCode(costCode: ICostCodeEntity, contrCostCodeId: number) { }
	public setCompanyCostCodes(includeChild: boolean): void {
		let companyCostCodes: ICostCodeEntity[] = [];
		const selectedEntities = this.getSelectedEntity();
		if (includeChild) {
			if (selectedEntities && Array.isArray(selectedEntities)) {
				selectedEntities.forEach((item) => {
					companyCostCodes.push(item);

					const children: ICostCodeEntity[] = PlatformDataAccessListUtility.getAllChildren(item, this.getChildren.bind(this));
					companyCostCodes = companyCostCodes.concat(children);
				});
			}
		} else {
			companyCostCodes = JSON.parse(JSON.stringify(this.getSelectedEntity()));
		}
	}

	private getChildren(children: ICostCodeEntity): ICostCodeEntity[] {
		return children.CostCodes || [];
	}

	/**
	 * Navigates to a specified cost code entity by refreshing the data and locating the item in the list.
	 * @param item The `ICostCodeEntity` to which the navigation is performed. This item is used to locate
	 *             the corresponding entry in the list of cost codes.
	 */
	public navigateTo(item: ICostCodeEntity) {
		this.refreshAll();
		const list = this.getList();

		const selectItem = list && list.length ? list.find((e) => e.Id === item.Id) : undefined;
		if (selectItem) {
			this.setModified(selectItem);
		}
	}

	/**
	 * Clears the company cost codes by setting the `companyCostCodes` property to `null`..
	 */
	public clearCompanyCostCodes() {
		this.clearModifications();
	}

	/**
	 *  Checks if the creation of entities is allowed.
	 */
	protected override checkCreateIsAllowed(entities: ICostCodeEntity[] | ICostCodeEntity | null): boolean {
		return false;
	}

	/**
	 * Prepares the internal process for assigning a controlling cost code to the specified cost code entity.
	 * @param costCode The `ICostCodeEntity` to which the controlling cost code will be assigned.
	 * @param contrCostCodeId The ID of the controlling cost code to be assigned.
	 *
	 * @returns A promise representing the asynchronous operation of assigning the controlling cost code, though
	 *          the actual assignment logic is not implemented in this method.
	 */
	public async assignControllingCostCodeInternal(costCode: ICostCodeEntity, contrCostCodeId: number): Promise<boolean> {
		let showAssignToChildren = false;
		let showOverwrite = false;

		if (Array.isArray(costCode.CostCodes) && costCode.CostCodes.length > 0) {
			showAssignToChildren = true;
			showOverwrite = true;
		}

		let costCodes: ICostCodeEntity[] = [];

		try {
			if (showAssignToChildren || showOverwrite) {
				if (!this.isPreserveSelection) {
					const result = await this.basicsCostCodesAssingnControllingCostCodes.controllingCostCodes();
					if (result) {
						costCodes = await this.assignControllingCostCodeResponse(contrCostCodeId, costCode, result.IsOverwrite ?? false, result.IsAssignToChildren ?? false);
					}
				} else {
					costCodes = await this.assignControllingCostCodeResponse(contrCostCodeId, costCode, this.isOverwrite, this.isAssignToChildren);
				}
			} else {
				costCodes = await this.assignControllingCostCodeResponse(contrCostCodeId, costCode, true, false);
			}

			if (costCodes.length > 0) {
				this.setModified(costCodes);
				return true;
			}

			return false;
		} catch (error) {
			console.error('Error assigning controlling cost code:', error);
			return false;
		}
	}


	/**
	 * Assigns a controlling cost code to the specified cost code and its children, if applicable.
	 * @param contrCostCodeId The ID of the controlling cost code to be assigned.
	 * @param costCode The `ICostCodeEntity` to which the controlling cost code will be assigned.
	 * @param isOverwrite A boolean flag indicating whether to overwrite existing controlling cost code assignments.
	 * @param isAssignToChildren A boolean flag indicating whether to assign the controlling cost code to child cost codes.
	 *
	 * @returns A `Promise` that resolves to an array of `ICostCodeEntity` objects that were modified.
	 *          If no cost codes are modified, the promise is rejected with an error message.
	 */
	public assignControllingCostCodeResponse(contrCostCodeId: number, costCode: ICostCodeEntity, isOverwrite: boolean, isAssignToChildren: boolean): Promise<ICostCodeEntity[]> {
		return new Promise<ICostCodeEntity[]>((resolve, reject) => {
			const costCodesToUpdate: ICostCodeEntity[] = [];

			if (!costCode.ContrCostCodeFk || isOverwrite) {
				costCodesToUpdate.push(costCode);
			}

			if (isAssignToChildren) {
				// // Commented above code and added new logic to get cost code ids recursively
				this.getCostCodeChildrenToAssign(costCode, isOverwrite, costCodesToUpdate);
			}

			if (costCodesToUpdate.length > 0) {
				const costCodesToBeModified: ICostCodeEntity[] = [];
				costCodesToUpdate.forEach((cc) => {
					// cc = serviceContainer.service.getItemById(cc.Id);
					if ((!cc.ContrCostCodeFk || isOverwrite) && cc.ContrCostCodeFk !== contrCostCodeId) {
						cc.ContrCostCodeFk = contrCostCodeId;
						costCodesToBeModified.push(cc);
					}
				});
				resolve(costCodesToBeModified);
			} else {
				reject('No controlling cost code to update');
			}
		});
	}

	/**
	 * Recursively retrieves and assigns the child cost codes of a given cost code entity.
	 * @param costCode The `ICostCodeEntity` whose children are to be retrieved and assigned.
	 * @param isOverwrite A boolean flag indicating whether to overwrite existing entries (unused in this method).
	 * @param costCodesToUpdate An array of `ICostCodeEntity` to which the retrieved child cost codes will be added.
	 *
	 * @returns The updated `costCodesToUpdate` array containing all child cost codes.
	 */
	public getCostCodeChildrenToAssign(costCode: ICostCodeEntity, isOverwrite: boolean, costCodesToUpdate: ICostCodeEntity[]) {
		if (costCode.CostCodes) {
			costCode.CostCodes.forEach((cc) => {
				costCodesToUpdate.push(cc);
				this.getCostCodeChildrenToAssign(cc, isOverwrite, costCodesToUpdate);
			});
		}
		return costCodesToUpdate;
	}

	/**
	 * Processes the successful loading of cost code entities filtered by specific criteria.
	 * @param loaded The loaded object containing the filtered cost code entities.
	 *
	 * @returns An `ISearchResult<ICostCodeEntity>` object containing the filtered cost code entities and default filter results.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICostCodeEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: loaded as ICostCodeEntity[],
		};
	}

	/**
	 * Retrieves the parent cost code entity of a given cost code entity.
	 * @param element The `ICostCodeEntity` whose parent is to be retrieved.
	 *
	 * @returns The parent `ICostCodeEntity` if found, or `null` if no parent exists or the parent cannot be found.
	 */
	public override parentOf(element: ICostCodeEntity): ICostCodeEntity | null {
		if (element.CostCodeParentFk == null) {
			return null;
		}

		const parentId = element.CostCodeParentFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * Retrieves the child cost code entities of a given cost code entity.
	 * @param element The `ICostCodeEntity` whose child cost codes are to be retrieved.
	 *
	 * @returns An array of `ICostCodeEntity` representing the child cost codes.
	 *          If `CostCodes` is `null` or `undefined`, an empty array is returned.
	 */
	public override childrenOf(element: ICostCodeEntity): ICostCodeEntity[] {
		return element.CostCodes ?? [];
	}

	public recalculateFactorValues(item: ICostCodeEntity, column: keyof ICostCodeEntity, parentItem: ICostCodeEntity | null, updatedItems: ICostCodeEntity[]) {
		const realFactorColumn = this.factorFieldsToRecalculate[column as string] as keyof ICostCodeEntity;

		const getValue = <T extends keyof ICostCodeEntity>(obj: ICostCodeEntity, key: T): ICostCodeEntity[T] => {
			return obj[key];
		};

		const setValue = <T extends keyof ICostCodeEntity>(obj: ICostCodeEntity, key: T, value: ICostCodeEntity[T]): void => {
			obj[key] = value;
		};

		const columnValue = getValue(item, column);

		if (!item.CostCodeParentFk) {
			if (getValue(item, realFactorColumn) !== columnValue) {
				setValue(item, realFactorColumn, columnValue);
				updatedItems.push(item);
			}
		} else {
			if (parentItem) {
				const parentValue = getValue(parentItem, realFactorColumn);
				if (typeof parentValue === 'number' && typeof columnValue === 'number') {
					const newFactor = parentValue * columnValue;
					if (getValue(item, realFactorColumn) !== newFactor) {
						setValue(item, realFactorColumn, newFactor);
						updatedItems.push(item);
					}
				}
			}
		}

		if (Array.isArray(item.CostCodes) && item.CostCodes.length > 0) {
			item.CostCodes.forEach((cc) => {
				this.recalculateFactorValues(cc, column, item, updatedItems);
			});
		}
	}

	public addList(items: ICostCodeEntity[]) {
		if (items && items.length) {
			const list = this.getList();
			items.forEach((d) => {
				const item = list.find(item => item.Id === d.Id);
				if (item) {
					Object.assign(item, d);
				} else {
					this.append(d);
				}
			});
		}
		return items;
	}

	public async dropCostCodeRecord(source: IDragDropData<ICostCodeEntity>, target: IDragDropTarget<ICostCodeEntity>): Promise<void> {

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: false,
			headerText: this.translateService.instant('basics.costcodes.dialogTitle').text,
			bodyText: this.translateService.instant('basics.costcodes.dialogMsg').text,
		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			const targetItem = target !== null && Array.isArray(target.data) && target.data.length > 0 ? target.data[0] : { Id: 0 };
			const sourceCostCodeIds: number[] = source.data.map((item: { Id: number }) => item.Id);
			this.http.post<ICostCodeEntity[]>(`${this.configService.webApiBaseUrl}basics/costcodes/saverequestcostcode?selectedItem=${targetItem.Id}`, sourceCostCodeIds).subscribe((response: ICostCodeEntity[]) => {
				this.addList(response);
				if (targetItem.Id > 0) {
					this.setSelectedCostCode(targetItem as ICostCodeEntity);
				} else {
					const selItem = response.filter(item => sourceCostCodeIds.includes(item.Id));
					this.setSelectedCostCode(selItem[0]);
				}
				this.refreshAll();
			});
		}
	}

}
