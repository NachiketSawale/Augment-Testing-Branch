/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsTaxCodeMatrixDataService } from './basics-tax-code-matrix-data.service';
import { BasicsTaxCodeMatrixLayoutService } from './basics-tax-code-matrix-layout.service';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { BasicsTaxCodeMatrixValidationService } from './basics-tax-code-matrix-validation.service';

/**
 * Basics Tax Code Matrix Module Info
 */
export const BASICS_TAX_CODE_MATRIX_ENTITY_INFO = EntityInfo.create<IMdcTaxCodeMatrixEntity>({
	grid: {
		title: { text: 'Tax Code Matrix', key: 'basics.taxcode.entityTaxCodeMatrixTitle' },
	},
	form: {
		containerUuid: '2ac94de2e2a64203bdd2f823bd5cf295',
		title: { text: 'Tax Code Matrix Detail', key: 'basics.taxcode.entityTaxCodeMatrixDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsTaxCodeMatrixDataService),
	validationService: (ctx) => ctx.injector.get(BasicsTaxCodeMatrixValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.TaxCode', typeName: 'MdcTaxCodeMatrixDto' },
	permissionUuid: '1bcb4336007741fb819abc782b2538d9',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsTaxCodeMatrixLayoutService).generateLayout();
	},
});
