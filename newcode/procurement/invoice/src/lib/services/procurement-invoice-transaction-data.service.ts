/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IInvHeaderEntity, IInvTransactionEntity } from '../model/entities';
import { InvComplete, InvOtherComplete, InvTransactionComplete } from '../model';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';

@Injectable({
	providedIn: 'root',
})
/**
 *  todo//This is only temporary for the use of group-set-transaction, please arrange developers to improve it
 */
export class ProcurementInvoiceTransactionDataService extends DataServiceFlatNode<IInvTransactionEntity, InvTransactionComplete, IInvHeaderEntity, InvComplete> {
	public constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvTransactionEntity> = {
			apiUrl: 'procurement/invoice/transaction',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvTransactionEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Node,
				itemName: 'InvTransaction',
				parent: parentService,
			},
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: InvComplete, modified: InvOtherComplete[], deleted: IInvTransactionEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.InvTransactionToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.InvTransactionDelete = deleted;
		}
	}
}
