/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { TransportplanningBundleGridBehavior } from '../behaviors/transportplanning-bundle-grid-behavior.service';
import { IBundleEntity } from './entities/bundle-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedTransportBundleStatusLookupService, BasicsSharedTransportBundleTypeLookupService } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN, IBasicsCustomizeTransportBundleStatusEntity, IBasicsCustomizeTransportBundleTypeEntity } from '@libs/basics/interfaces';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { TransportPlanningBundleValidationService } from '../services/validations/transportplanning-bundle-validation.service';

export const TRANSPORTPLANNING_BUNDLE_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IBundleEntity>({
	grid: {
		title: { key: 'transportplanning.bundle' + '.listBundleTitle' },
		behavior: (ctx) => ctx.injector.get(TransportplanningBundleGridBehavior),
	},
	form: {
		title: { key: 'transportplanning.bundle' + '.detailsBundleTitle' },
		containerUuid: '1145ec1dabcd41b79568c44afdb0f3e0',
	},
	dataService: (ctx) => ctx.injector.get(TransportplanningBundleGridDataService),
	validationService: (ctx) => ctx.injector.get(TransportPlanningBundleValidationService),
	dtoSchemeId: { moduleSubModule: 'TransportPlanning.Bundle', typeName: 'BundleDto' },
	permissionUuid: '8ea8679532ee44869df8dd9e3ae629de',
	layoutConfiguration: async (context) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'TrsBundleTypeFk', 'TrsBundleStatusFk', 'ProjectFk', 'LgmJobFk', 'DescriptionInfo', 'SiteFk', 'DrawingFkOfStack', 'IsLive', 'ProductionOrder', 'Reproduced'],
				},
				{
					gid: 'dimensions',
					attributes: ['Length', 'BasUomLengthFk', 'Width', 'BasUomWidthFk', 'Height', 'BasUomHeightFk', 'Weight', 'BasUomWeightFk'],
				},
				{
					gid: 'transport',
					attributes: ['TrsRequisitionFk', 'TrsRequisitionDate'],
				},

				{
					gid: 'loadingDevice',
					attributes: ['Description', 'ScheduleFk'],
				},
				{
					gid: 'product',
					attributes: [],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],
			overloads: {
				ProjectFk: {
					type: FieldType.Lookup,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								text: 'Project-Name',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				DrawingFkOfStack: {
					readonly: true,
				},

				TrsBundleTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTransportBundleTypeLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: {
							select(item: IBasicsCustomizeTransportBundleTypeEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				TrsBundleStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTransportBundleStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: {
							select(item: IBasicsCustomizeTransportBundleStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				SiteFk: (await context.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),
				BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasUomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Userdefined1: {
					label: {
						text: '*Text1',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '1' },
					},
					type: FieldType.Description,
				},
				Userdefined2: {
					label: {
						text: '*Text1 2',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '2' },
					},
					type: FieldType.Description,
				},
				Userdefined3: {
					label: {
						text: '*Text 3',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '3' },
					},
					type: FieldType.Description,
				},
				Userdefined4: {
					label: {
						text: '*Text 4',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '4' },
					},
					type: FieldType.Description,
				},
				Userdefined5: {
					label: {
						text: '*Text 5',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '5' },
					},
					type: FieldType.Description,
				},
			},

			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
					ProjectFk: { key: 'entityProject' },
					DescriptionInfo: { key: 'entityDescription' },
				}),
				...prefixAllTranslationKeys('transportplanning.bundle.', {
					TrsBundleTypeFk: { key: 'entityBundleType' },
					TrsBundleStatusFk: { key: 'entityBundleStatus' },
					LgmJobFk: { key: 'entityJob' },
					DrawingFkOfStack: { key: 'drawingFkOfStack' },
					Length: { key: 'length' },
					BasUomLengthFk: { key: 'lengthUom' },
					Width: { key: 'width' },
					BasUomWidthFk: { key: 'widthUom' },
					Height: { key: 'height' },
					BasUomHeightFk: { key: 'heightUom' },
					Weight: { key: 'weight' },
					BasUomWeightFk: { key: 'weightUom' },
				}),
				...prefixAllTranslationKeys('basics.site.', {
					SiteFk: { key: 'entitySite' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					ProductionOrder: { key: 'product.productionOrder' },
					Reproduced: { key: 'product.reproduced' },
				}),
				...prefixAllTranslationKeys('transportplanning.requisition.', {
					TrsRequisitionDate: { key: 'entityRequisitionDate' },
					TrsRequisitionFk: { key: 'entityRequisition' },
				}),
			},
		};
	},
});
