/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { IIdentificationData} from '@libs/platform/common';
import { BasicsCostCodesPriceVersionRecordComplete } from '../../model/basics-cost-codes-price-version-record-complete.class';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';
import { GridApiService,IGridApi } from '@libs/ui/common';

export const BASICS_COST_CODES_PRICE_VERSION_RECORD_DATA_TOKEN = new InjectionToken<BasicsCostCodesPriceVersionListRecordDataService>('basicsCostCodesPriceVersionRecordDataToken');

/**
 * BasicsCostCodesPriceVersionListRecordDataService
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionListRecordDataService extends DataServiceFlatLeaf<ICostcodePriceListEntity, ICostCodeEntity, IBasicsCostCodesComplete> {
	private gridApiService = inject(GridApiService);
	private parentApi?: IGridApi<ICostcodePriceListEntity>;
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostcodePriceListEntity> = {
			apiUrl: 'basics/costcodes/version/list',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: (ident: IIdentificationData) => {
					return { mainItemId: ident.pKey1 };
				},
				usePost: false
			},

			roleInfo: <IDataServiceChildRoleOptions<ICostcodePriceListEntity, ICostCodeEntity, IBasicsCostCodesComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceVersionListRecord',
				parent: parentService
			},
		};

		super(options);
	}

	/**
	 * Indicates whether the entity should be registered by the method.
	 *
	 * @returns A boolean value `true`, indicating that the registration by method is enabled.
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * Handles the successful creation of a cost code price list entity.
	 * @param loaded The loaded object representing the newly created cost code price list entity.
	 *
	 * @returns The `ICostcodePriceListEntity` with the `CostCodeFk` property potentially set to the selected parent's `Id`.
	 */
	protected override onCreateSucceeded(loaded: object): ICostcodePriceListEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as ICostcodePriceListEntity;
		if (entity && parent) {
			entity.CostCodeFk = parent.Id;
		}
		return entity;
	}

	/**
	 * Registers the modifications and deletions to the parent update object.
	 * @param complete The `IBasicsCostCodesComplete` object representing the parent update.
	 * @param modified An array of `BasicsCostCodesPriceVersionRecordComplete` representing the modified records to be saved.
	 * @param deleted An array of `ICostcodePriceListEntity` representing the records to be deleted.
	 */
	public override registerModificationsToParentUpdate(complete: IBasicsCostCodesComplete, modified: BasicsCostCodesPriceVersionRecordComplete[], deleted: ICostcodePriceListEntity[]) {
		if (modified && modified.length > 0) {
			complete.PriceVersionListRecordToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.PriceVersionListRecordToDelete = deleted;
		}
	}

	// service.fieldChanged = function(item, column){
	// 	let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');   // TODOD  basicsCommonUserDefinedColumnServiceFactory  not ready
	// 	basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.fieldChange(item, column, item[column]);
	// };

	/**
	 * Retrieves the list of saved cost code price list entities from the provided update.
	 * @param complete The `IBasicsCostCodesComplete` object containing the cost code data.
	 *
	 * @returns An array of `ICostcodePriceListEntity` representing the saved price list records.
	 *          Returns an empty array if `PriceVersionListRecordToSave` is `null` or `undefined`.
	 */
	public override getSavedEntitiesFromUpdate(complete: IBasicsCostCodesComplete): ICostcodePriceListEntity[] {
		if (complete && complete.PriceVersionListRecordToSave) {
			return complete.PriceVersionListRecordToSave;
		}

		return [];
	}

	/**
	 * Determines if the given entity is a child of the specified parent.
	 * @param parentKey The `ICostCodeEntity` representing the parent entity.
	 * @param entity The `ICostcodePriceListEntity` to be checked.
	 *
	 * @returns `true` if the `entity` is a child of the `parentKey`, `false` otherwise.
	 */
	public override isParentFn(parentKey: ICostCodeEntity, entity: ICostcodePriceListEntity): boolean {
		return entity.CostCodeFk === parentKey.Id;
	}
}
