/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementInvoiceContractItemDataService } from './procurement-invoice-contract-item-data.service';
import { ProcurementInvoiceContractItemLayoutService } from './procurement-invoice-contract-item-layout.service';

export const PROCUREMENT_INVOICE_CONTRACT_ITEM_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			key: 'procurement.invoice.title.contract',
		},
	},
	form: {
		containerUuid: '7ab56ca10a254ec3bceed4c8d9561ab2',
		title: {
			key: 'procurement.invoice.title.contractDetail',
		},
	},
	permissionUuid: '75f8704d0eee480ba3dfd2528d99ada1',
	dtoSchemeId: { moduleSubModule: ProcurementModule.Invoice, typeName: 'Inv2ContractDto' },
	layoutConfiguration: async (context) => await context.injector.get(ProcurementInvoiceContractItemLayoutService).generateLayout(context),
	dataService: (context) => context.injector.get(ProcurementInvoiceContractItemDataService),
	prepareEntityContainer: async (context) => {},
});
