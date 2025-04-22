/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity, IOrdValidationEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractValidationDataService extends DataServiceFlatLeaf<IOrdValidationEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IOrdValidationEntity> = {
			apiUrl: 'sales/contract/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId : ident.pKey1
					};
				}
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
			roleInfo: <IDataServiceChildRoleOptions<IOrdValidationEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'OrdValidation',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IOrdValidationEntity[], deleted: IOrdValidationEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.OrdValidationToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.OrdValidationToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IOrdValidationEntity[] {
		if (complete && complete.OrdValidationToSave) {
			return complete.OrdValidationToSave;
		}
		return [];
	}

	public override canCreate() {
		return false;
	}

	public override canDelete() {
		return false;
	}
}












