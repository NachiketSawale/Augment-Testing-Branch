/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSalesTaxCodeDataService } from './basics-sales-tax-code-data.service';
import { BasicsSalesTaxCodeLayoutService } from './basics-sales-tax-code-layout.service';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

/**
 * Basics Sales Tax Code Module Info
 */
export const BASICS_SALES_TAX_CODE_ENTITY_INFO = EntityInfo.create<IMdcSalesTaxCodeEntity>({
	grid: {
		title: { text: 'Sales Tax Code', key: 'basics.salestaxcode.entitySalesTaxCodeTitle' }
	},
	form: {
		containerUuid: '6557e5f68da64a00a34d0e83e925672d',
		title: { text: 'Sales Tax Code Detail', key: 'basics.salestaxcode.entitySalesTaxCodeDetailTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsSalesTaxCodeDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.SalesTaxCode', typeName: 'MdcSalesTaxCodeDto' },
	permissionUuid: '750cee99c27c4285a40bad1c68ad86bb',
	layoutConfiguration: context => {
		return context.injector.get(BasicsSalesTaxCodeLayoutService).generateLayout();
	}
});