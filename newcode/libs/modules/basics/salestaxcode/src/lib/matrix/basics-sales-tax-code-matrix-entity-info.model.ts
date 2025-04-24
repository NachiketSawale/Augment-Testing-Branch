/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSalesTaxCodeMatrixDataService } from './basics-sales-tax-code-matrix-data.service';

import { BasicsSalesTaxCodeMatrixLayoutService } from './basics-sales-tax-code-matrix-layout.service';
import { IMdcSalesTaxMatrixEntity } from '../model/entities/interface/mdc-sales-tax-matrix-entity.interface';

/**
 * Basics Sales Tax Code Module Info
 */
export const BASICS_SALES_TAX_CODE_MATRIX_ENTITY_INFO = EntityInfo.create<IMdcSalesTaxMatrixEntity>({
	grid: {
		title: { text: 'Sales Tax Code Matrix', key: 'basics.salestaxcode.entitySalesTaxMatrixTitle' }
	},
	form: {
		containerUuid: '017CC52186354B86962717649BDF7791',
		title: { text: 'Sales Tax Code Matrix Detail', key: 'basics.salestaxcode.entitySalesTaxMatrixDetailTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsSalesTaxCodeMatrixDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.SalesTaxCode', typeName: 'MdcSalesTaxMatrixDto' },
	permissionUuid: '43677903f8fc4f9bba7f8d066261fb5b',
	layoutConfiguration: context => {
		return context.injector.get(BasicsSalesTaxCodeMatrixLayoutService).generateLayout();
	}
});