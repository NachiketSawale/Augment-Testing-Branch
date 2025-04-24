import { Injectable } from '@angular/core';
import { BoqCompositeConfigService, BoqCompositeDataService } from '@libs/boq/main';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdBoqCompositeEntity, IOrdHeaderEntity } from '@libs/sales/interfaces';


//TODO-BOQ-Incomplete
@Injectable({providedIn: 'root'})
export class SalesContractBoqDataService extends BoqCompositeDataService<IOrdBoqCompositeEntity, IOrdBoqCompositeEntity, IOrdHeaderEntity, SalesContractContractsComplete> {
	public constructor(private parentService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IOrdBoqCompositeEntity> = {
			apiUrl: 'sales/contract/boq',
			roleInfo: <IDataServiceRoleOptions<IOrdBoqCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'OrdBoqComposite',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
		};
		super(options);
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		return { contractId:this.parentService.getSelectedEntity()?.Id };
	}

	public override isParentFn(ordHeader: IOrdHeaderEntity, ordBoqComposite: IOrdBoqCompositeEntity): boolean {
		return ordHeader.Id == ordBoqComposite.OrdBoq?.OrdHeaderFk;
	}

	public override createUpdateEntity(modifiedOrdBoq: IOrdBoqCompositeEntity): IOrdBoqCompositeEntity {
		return modifiedOrdBoq;
	}

	public override registerNodeModificationsToParentUpdate(complete: SalesContractContractsComplete, modified: IOrdBoqCompositeEntity[], deleted: IOrdBoqCompositeEntity[]) {
		if (modified.length > 0) {
			complete.OrdBoqCompositeToSave = modified;
		}
		if (deleted.length > 0) {
			complete.OrdBoqCompositeToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IOrdBoqCompositeEntity[] {
		return complete.OrdBoqCompositeToSave || [];
	}

	// #endregion
	//  endregion
}

@Injectable({providedIn: 'root'})
export class SalesContractBoqConfigService extends BoqCompositeConfigService<IOrdBoqCompositeEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(),
	};
}
