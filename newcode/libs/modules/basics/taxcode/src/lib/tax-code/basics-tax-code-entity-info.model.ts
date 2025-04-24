/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsTaxCodeDataService } from './basics-tax-code-data.service';
import { BasicsTaxCodeLayoutService } from './basics-tax-code-layout.service';
import { IMdcTaxCodeEntity } from '@libs/basics/interfaces';
import { BasicsTaxCodeMatrixValidationService } from './basics-tax-code-validation.service';

/**
 * Basics Tax Code Matrix Module Info
 */
export const BASICS_TAX_CODE_ENTITY_INFO = EntityInfo.create<IMdcTaxCodeEntity>({
	grid: {
		title: { text: 'Tax Code', key: 'basics.taxcode.entityTaxCodeTitle' },
	},
	form: {
		containerUuid: '2f8ea0eea20b4a54ab31a3070026fba3',
		title: { text: 'Tax Code Detail', key: 'basics.taxcode.entityTaxCodeDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsTaxCodeDataService),
	validationService: (ctx) => ctx.injector.get(BasicsTaxCodeMatrixValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.TaxCode', typeName: 'MdcTaxCodeDto' },
	permissionUuid: 'c8715262645347a5a16b8e68fbe60bee',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsTaxCodeLayoutService).generateLayout();
	},
});
