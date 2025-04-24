/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsMaterialPriceVersionToCompaniesDataService } from './basics-material-price-version-to-companies-data.service';
import { BasicsMaterialPriceVersionToCompaniesValidationService } from './basics-material-price-version-to-companies-validation.service';
import { BasicsMaterialPriceVersionToCompaniesBehaviorService } from './basics-material-price-version-to-companies-behavior.service';
import { IPriceVersionUsedCompanyEntity } from '../model/entities/price-version-used-company-entity.interface';

export const BASICS_MATERIAL_PRICE_VERSION_TO_COMPANIES_ENTITY_INFO = EntityInfo.create<IPriceVersionUsedCompanyEntity>({
	grid: {
		title: { text: 'Price Version to Companies', key: 'basics.materialcatalog.priceVersionToCompanyTitle' },
		treeConfiguration: true,
		behavior: (context) => context.injector.get(BasicsMaterialPriceVersionToCompaniesBehaviorService),
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialPriceVersionToCompaniesDataService),
	validationService: (context) => context.injector.get(BasicsMaterialPriceVersionToCompaniesValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'PriceVersionUsedCompanyDto' },
	permissionUuid: 'ca6906238266404285ede149c192b27b',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['Code', 'CompanyName', 'Checked'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: {
					key: 'entityCode',
					text: 'Code',
				},
				CompanyName: {
					key: 'entityCompanyName',
					text: 'Company Name',
				},
			}),
			...prefixAllTranslationKeys('basics.materialcatalog.', {
				Checked: {
					key: 'checked',
					text: 'Checked',
				},
			}),
		},
		overloads: {
			Code: {
				readonly: true,
			},
			CompanyName: {
				readonly: true,
			},
		},
	},
});
