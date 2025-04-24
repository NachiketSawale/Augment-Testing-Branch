import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractRelatedBillDataService extends DataServiceFlatLeaf<IBillHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IBillHeaderEntity> = {
			apiUrl: 'sales/billing',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'billsByContractId',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBillHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilHeader',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}


	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IBillHeaderEntity[], deleted: IBillHeaderEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.BilHeaderToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.BilHeaderToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IBillHeaderEntity[] {
		if (complete && complete.BilHeaderToSave) {
			return complete.BilHeaderToSave;
		}
		return [];
	}

	public override canCreate(): boolean {
		return false;
	}

	public override canDelete(): boolean {
		return false;
	}
}
