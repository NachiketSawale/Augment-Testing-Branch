/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSiteGridEntity } from './basics-site-grid-entity.class';
import { BasicsSiteGridBehavior } from '../behaviors/basics-site-grid-behavior.service';
import { BasicsSiteGridDataService } from '../services/basics-site-grid-data.service';
import { createLookup, FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedSiteTypeLookupService } from '@libs/basics/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicSiteGridValidationService } from '../services/validations/basic-site-grid-validation.service';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN, IBasicsCustomizeSiteTypeEntity } from '@libs/basics/interfaces';
import { BasicsSiteTypeIconService } from '../services/basics-site-type-icon.service';

export const BASICS_SITE_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<BasicsSiteGridEntity>({
	grid: {
		title: { text: 'Sites' },
		behavior: (ctx) => ctx.injector.get(BasicsSiteGridBehavior),
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: BasicsSiteGridEntity) {
					const service = ctx.injector.get(BasicsSiteGridDataService);
					return service.parentOf(entity);
				},
				children: function (entity: BasicsSiteGridEntity) {
					const service = ctx.injector.get(BasicsSiteGridDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<BasicsSiteGridEntity>;
		},
	},

	form: {
		title: { text: 'SitesDetail' },
		containerUuid: 'd7d2e8cf9d9b47999e7a391ead0d3e01',
	},

	dataService: (ctx) => ctx.injector.get(BasicsSiteGridDataService),
	validationService: (ctx) => ctx.injector.get(BasicSiteGridValidationService),

	dtoSchemeId: { moduleSubModule: 'Basics.Site', typeName: 'SiteDto' },
	permissionUuid: 'd7d2e8cf9d9b47999e7a391ead0d3e00',
	layoutConfiguration: async (ctx) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'DescriptionInfo', 'AddressFk', 'SiteTypeFk', 'ClerkMgrFk', 'ClerkVicemgrFk', 'ResourceFk', 'AccessRightDescriptorFk', 'Remark', 'IsLive', 'LgmJobProdAreaFk'],
				},
				{
					gid: 'trsportConfigGroup',
					attributes: ['Isdisp', 'ProjectAdmFk', 'LgmJobAdrFk', 'BasSiteStockFk'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],

			overloads: {
				AddressFk: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),

				Userdefined1: {},
				Userdefined2: {},
				Userdefined3: {},
				Userdefined4: {},
				Userdefined5: {},
				SiteTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<BasicsSiteGridEntity, IBasicsCustomizeSiteTypeEntity>({
						dataServiceToken: BasicsSharedSiteTypeLookupService,
						showGrid: false,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: ctx.injector.get(BasicsSiteTypeIconService),
						clientSideFilter: {
							execute: (item: IBasicsCustomizeSiteTypeEntity, context) => {
								return item.IsDefault && item.IsLive;
							},
						},
					}),
				},
				ClerkMgrFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				ClerkVicemgrFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),

				Isdisp: {
					grid: {
						width: 90,
					},
				},
				IsLive: { readonly: true },
				ProjectAdmFk: {
					type: FieldType.Lookup,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								text: 'Administrative Project-Name Description',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				//To DO ResourceFk,LgmJobAdrFk,LgmJobProdAreaFk
				LgmJobAdrFk: {},
				LgmJobProdAreaFk: {},
				ResourceFk: {},
				BasSiteStockFk: (await ctx.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('basics.site.', {
					AddressFk: { key: 'AddressFk' },
					SiteTypeFk: { key: 'SiteTypeFk' },
					ClerkMgrFk: { key: 'ClerkMgrFk' },
					ClerkVicemgrFk: { key: 'ClerkVicemgrFk' },
					LgmJobProdAreaFk: { key: 'lgmJobProdAreaFk' },
					Isdisp: { key: 'Isdisp' },
					ProjectAdmFk: { key: 'projectAdmFk' },
					LgmJobAdrFk: { key: 'lgmJobAdrFk' },
					BasSiteStockFk: { key: 'stock' },
					Userdefined1: { key: 'userdefined1' },
					Userdefined2: { key: 'userdefined2' },
					Userdefined3: { key: 'userdefined3' },
					Userdefined4: { key: 'userdefined4' },
					Userdefined5: { key: 'userdefined5' },
					trsportConfigGroup: { key: 'trsportConfigGroup' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					ResourceFk: { key: 'resourcefk' },
					AccessRightDescriptorFk: { key: 'accessRightDescriptorFk' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					userDefTextGroup: { key: 'UserdefTexts' },
					entityLanguageFk: { text: 'Language', key: 'entityLanguageFk' },
				}),
				...prefixAllTranslationKeys('basics.company.', {
					entitylanguagefk: { text: 'Language', key: 'entityLanguageFk' },
				}),
				...prefixAllTranslationKeys('basics.clerk.', {
					entityTitle: { key: 'entityTitle' },
				}),
				...prefixAllTranslationKeys('productionplanning.drawing.', {
					entityDrawing: { text: 'Drawing', key: 'entityDrawing' },
				}),
				...prefixAllTranslationKeys('logistic.job.', {
					actualJob: { text: 'Actual Job', key: 'actualJob' },
					jobType: { text: 'Job Type', key: 'jobType' },
				}),
			},
		};
	},
});
