/*
 * Copyright(c) RIB Software GmbH
 */

import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { Injectable } from '@angular/core';
import { IConTransactionEntity } from '../model/entities/con-transaction-entity.interface';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractTransactionDataService extends DataServiceFlatLeaf<IConTransactionEntity, IConHeaderEntity, ContractComplete> {
	protected constructor(protected parentService: ProcurementContractHeaderDataService) {

		const options: IDataServiceOptions<IConTransactionEntity> = {
			apiUrl: 'procurement/contract/transaction',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IConTransactionEntity, IConHeaderEntity, ContractComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ConTransaction',
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

	protected override onLoadSucceeded(loaded: object): IConTransactionEntity[] {
		return loaded as unknown as IConTransactionEntity[];
	}

	protected override provideCreatePayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: parent.Id
		};
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConTransactionEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}
}