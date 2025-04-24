/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { PpsProductionPlaceEntity } from './pps-production-place-entity.class';
import { PpsProductionPlaceBehavior } from '../behaviors/pps-production-place-behavior.service';
import { PpsProductionPlaceDataService } from '../services/pps-production-place-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

export const PPS_PRODUCTION_PLACE_ENTITY_INFO: EntityInfo = EntityInfo.create<PpsProductionPlaceEntity>({
	grid: {
		title: { text: 'Production Places' },
		behavior: (ctx) => ctx.injector.get(PpsProductionPlaceBehavior),
	},
	form: {
		title: { text: 'Production Place Detail' },
		containerUuid: 'c90b8ae405594dfa92b543efbab6918e',
	},
	dataService: (ctx) => ctx.injector.get(PpsProductionPlaceDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductionPlace', typeName: 'PpsProductionPlaceDto' },
	permissionUuid: '7347596478124456a18f0e78983aa34c',
	layoutConfiguration: async (context) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'Description', 'Sorting', 'PpsProdPlaceTypeFk', 'ResResourceFk', 'BasSiteFk', 'PositionX', 'PositionY', 'PositionZ', 'IsLive'],
				},
				{
					gid: 'dimensions',
					attributes: ['BasUomHeightFk', 'BasUomLengthFk', 'BasUomWidthFk', 'Height', 'Length', 'Width'],
				},
			],
			overloads: {
				ResResourceFk: {},
				BasSiteFk: (await context.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),
				BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				PpsProdPlaceTypeFk: BasicsSharedLookupOverloadProvider.providePpsProductPlaceTypeLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('basics.site.', {
					BasSiteFk: { key: 'entitySite' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'entityDescription' },
					Code: { key: 'entityCode' },
					PpsProdPlaceTypeFk: { key: 'entityType' },
				}),
				...prefixAllTranslationKeys('productionplanning.productionplace.', {
					PositionX: { key: 'positionX' },
					PositionY: { key: 'positionY' },
					PositionZ: { key: 'positionZ' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					Length: { key: 'product.length' },
					Width: { key: 'product.width' },
					Height: { key: 'product.height' },
					BasUomLengthFk: { key: 'product.widthUoM' },
					BasUomHeightFk: { key: 'product.heightUoM' },
					BasUomWidthFk: { key: 'product.widthUoM' },
				}),
				...prefixAllTranslationKeys('resource.master.', {
					ResResourceFk: { key: 'entityResource' },
				}),
			},
		};
	},
});
