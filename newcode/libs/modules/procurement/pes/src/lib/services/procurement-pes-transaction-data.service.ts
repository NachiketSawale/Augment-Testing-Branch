/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken} from '@angular/core';
import { IPesHeaderEntity, IPesTransactionEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';



export const PROCUREMENT_PES_TRANSACTION_DATA_TOKEN = new InjectionToken<ProcurementPesTransactionDataService>('procurementPesTransactionDataService');


/**
 * transaction service in pes
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPesTransactionDataService extends DataServiceFlatLeaf<IPesTransactionEntity,IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor(protected parentService:ProcurementPesHeaderDataService) {
		const options: IDataServiceOptions<IPesTransactionEntity> = {
			apiUrl: 'procurement/pes/transaction',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IPesTransactionEntity, IPesHeaderEntity, PesCompleteNew>>{
				role: ServiceRole.Leaf,
				itemName: 'PesTransaction',
				parent: parentService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId:parent.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IPesTransactionEntity[] {
		return loaded as unknown as IPesTransactionEntity[];
	}

	public override isParentFn(parentKey: IPesHeaderEntity, entity: IPesTransactionEntity): boolean {
		return entity.PesHeaderFk === parentKey.Id;
	}
}