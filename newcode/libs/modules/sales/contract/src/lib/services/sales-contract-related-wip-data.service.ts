import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractRelatedWipDataService extends DataServiceFlatLeaf<IWipHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IWipHeaderEntity> = {
			apiUrl: 'sales/wip',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'wipsByContractId',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IWipHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WipHeader',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}


	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IWipHeaderEntity[], deleted: IWipHeaderEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.WipHeaderToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.WipHeaderToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IWipHeaderEntity[] {
		if (complete && complete.WipHeaderToSave) {
			return complete.WipHeaderToSave;
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
