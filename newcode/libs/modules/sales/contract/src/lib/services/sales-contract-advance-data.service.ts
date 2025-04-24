/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { SalesSharedAdvanceModel } from '../model/sales-shared-advance.model';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdAdvanceEntity, IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractAdvanceDataService extends DataServiceFlatLeaf<IOrdAdvanceEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IOrdAdvanceEntity> = {
			apiUrl: 'sales/contract/advance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo:{
				prepareParam: ident => {
					const selection = salesContractContractsDataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IOrdAdvanceEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'OrdAdvance',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IOrdAdvanceEntity[], deleted: IOrdAdvanceEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.OrdAdvanceToSave = modified;
			parentUpdate.MainItemId = modified[0].OrdHeaderFk ?? 0;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.OrdAdvanceToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].OrdHeaderFk ?? 0;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IOrdAdvanceEntity[] {
		if (complete && complete.OrdAdvanceToSave) {
			return complete.OrdAdvanceToSave;
		}
		return [];
	}

	protected override onLoadSucceeded(loaded: SalesSharedAdvanceModel): IOrdAdvanceEntity[] {
		const data = loaded.Main;
		return data;
	}

	public override isParentFn(parentKey: IOrdHeaderEntity, entity: IOrdAdvanceEntity): boolean {
		return entity.OrdHeaderFk === parentKey.Id;
	}
}