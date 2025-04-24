/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { IInv2ContractEntity } from '../entities';
import { ProcurementInvoiceContractItemDataService } from '../../contractitem/procurement-invoice-contract-item-data.service';


export const PROCUREMENT_INVOICE_CONTROLLING_GROUP_CONTRACT_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: '304308041ef7432cab36fe2c269e5c4f',
	grid: {title: {text: 'Controlling Group Set By Contract Items', key: 'procurement.invoice.title.InvGrpSetDTLByContractGridTitle'}},
	form: {
		containerUuid: 'a2b4c694e5d14bfe970d5527bcbb627c',
		title: {text: 'Controlling Group Set Details By Contract Items', key: 'procurement.invoice.title.InvGrpSetDTLByContractFormTitle'},
	},
	parentService: ProcurementInvoiceContractItemDataService,
	getBasItemTypeId: (parent: IInv2ContractEntity) => parent.BasItemTypeFk
});
