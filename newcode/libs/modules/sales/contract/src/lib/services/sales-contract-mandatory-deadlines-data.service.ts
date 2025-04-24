/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { ISharedMandatoryDeadlinesEntity } from '@libs/sales/shared';
import { SharedWarrantyDeadlinesModel } from '@libs/sales/shared';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractMandatoryDeadlinesDataService extends DataServiceFlatLeaf<ISharedMandatoryDeadlinesEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<ISharedMandatoryDeadlinesEntity> = {
			apiUrl: 'sales/common/ordmandatorydeadline',
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
			roleInfo: <IDataServiceChildRoleOptions<ISharedMandatoryDeadlinesEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'OrdMandatoryDeadline',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: ISharedMandatoryDeadlinesEntity[], deleted: ISharedMandatoryDeadlinesEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.MainItemId = modified[0].OrdHeaderFk ?? 0;
			parentUpdate.OrdMandatoryDeadlineToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MainItemId = modified[0].OrdHeaderFk ?? 0;
			parentUpdate.OrdMandatoryDeadlineToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): ISharedMandatoryDeadlinesEntity[] {
		if (complete && complete.OrdMandatoryDeadlineToSave) {
			return complete.OrdMandatoryDeadlineToSave;
		}
		return [];
	}

	protected override onLoadSucceeded(loaded: SharedWarrantyDeadlinesModel): ISharedMandatoryDeadlinesEntity[] {
		const data = loaded.Main;
		return data;
	}

	public override isParentFn(parentKey: IOrdHeaderEntity, entity: ISharedMandatoryDeadlinesEntity): boolean {
		return entity.OrdHeaderFk === parentKey.Id;
	}

}