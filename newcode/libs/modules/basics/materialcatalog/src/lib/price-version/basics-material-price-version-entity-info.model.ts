/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsMaterialPriceVersionDataService } from './basics-material-price-version-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsMaterialPriceVersionValidationService } from './basics-material-price-version-validation.service';
import { IMaterialPriceVersionEntity } from '../model/entities/material-price-version-entity.interface';

export const BASICS_MATERIAL_PRICE_VERSION_ENTITY_INFO = EntityInfo.create<IMaterialPriceVersionEntity>({
	grid: {
		title: { text: 'Price Versions', key: 'basics.materialcatalog.priceVersions' },
		//behavior: ctx => ctx.injector.get(BasicsCompany2MaterialCatalogBehavior),
	},
	form: {
		containerUuid: 'c69805ec77924333b3014d95c229f5a7',
		title: { text: 'Price Versions Detail', key: 'basics.materialcatalog.priceVersionDetail' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialPriceVersionDataService),
	validationService: (context) => context.injector.get(BasicsMaterialPriceVersionValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialPriceVersionDto' },
	permissionUuid: '3689be8afa314258af208f52a267ffcc',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['DescriptionInfo', 'PriceListFk', 'ValidFrom', 'ValidTo', 'DataDate', 'Weighting'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {
					key: 'entityDescription',
					text: 'Description',
				},
			}),
			...prefixAllTranslationKeys('basics.materialcatalog.', {
				PriceListFk: {
					key: 'entityPriceList',
					text: 'Price List',
				},
				ValidFrom: {
					key: 'validFrom',
					text: 'Valid From',
				},
				ValidTo: {
					key: 'validTo',
					text: 'Valid To',
				},
				DataDate: {
					key: 'entityPriceVersionDataDate',
					text: 'Record Date',
				},
				Weighting: {
					key: 'entityWeighting',
					text: 'Weighting',
				},
			}),
		},
		overloads: {
			PriceListFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceListLookupOverload(false),
		},
	},
});
