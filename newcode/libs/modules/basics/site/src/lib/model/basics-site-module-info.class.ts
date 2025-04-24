/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';

import { PpsProdPlaceChildrenEntity } from './pps-prod-place-children-entity.class';
import { PPS_PROD_PLACE_CHILDREN_BEHAVIOR_TOKEN } from '../behaviors/pps-prod-place-children-behavior.service';

import { PpsProdPlaceChildrenDataService } from '../services/pps-prod-place-children-data.service';

import { PpsCommonCalendarSiteEntity } from './pps-common-calendar-site-entity.class';
import { PPS_COMMON_CALENDAR_SITE_BEHAVIOR_TOKEN } from '../behaviors/pps-common-calendar-site-behavior.service';

import { PpsCommonCalendarSiteDataService } from '../services/pps-common-calendar-site-data.service';

import { BasicSite2ClerkEntity } from './basic-site2-clerk-entity.class';

import { BasicSite2ClerkDataService } from '../services/basic-site2-clerk-data.service';

import { BasicsSite2TksShiftEntity } from './basics-site2-tks-shift-entity.class';
import { BASICS_SITE2_TKS_SHIFT_BEHAVIOR_TOKEN } from '../behaviors/basics-site2-tks-shift-behavior.service';

import { BasicsSite2TksShiftDataService } from '../services/basics-site2-tks-shift-data.service';

import { BasicsSite2ExternalEntity } from './basics-site2-external-entity.class';
import { BASICS_SITE2_EXTERNAL_BEHAVIOR_TOKEN } from '../behaviors/basics-site2-external-behavior.service';

import { BasicsSite2ExternalDataService } from '../services/basics-site2-external-data.service';

import { BasicsSite2StockEntity } from './basics-site2-stock-entity.class';
import { BASICS_SITE2_STOCK_BEHAVIOR_TOKEN } from '../behaviors/basics-site2-stock-behavior.service';

import { BasicsSite2StockDataService } from '../services/basics-site2-stock-data.service';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, createLookup } from '@libs/ui/common';

import { ProductionplanningChildrenLookupService } from '../services/lookups/productionplace-children-lookup.service';
import { BasicsSharedClerkLookupService, BasicsSharedClerkRoleLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { SchedulingCalendarLookup } from '@libs/scheduling/shared';
import { BasicsSiteShiftValidationService } from '../services/validations/basics-site-shift-validation.service';
import { BasicsSiteExternalValidationservice } from '../services/validations/basics-site-external-validation.service';
import { BasicsSiteClerkValidationService } from '../services/validations/basics-site-clerk-validation.service';
import { BasicsSiteStockValidationService } from '../services/validations/basics-site-stock-validation.service';
import { TimekeepingShiftLookupService } from '@libs/timekeeping/shared';
import { BASICS_SITE_GRID_ENTITY_INFO } from './basics-site-entity-info-model';
import { PPS_PRODUCTION_PLACE_ENTITY_INFO } from './pps-production-place-entity-Info-model';

export class BasicsSiteModuleInfo extends BusinessModuleInfoBase {
	private readonly productionplanningModuleSubmodule: string = 'ProductionPlanning.Common';
	private readonly productionPlanningSubmodule: string = 'ProductionPlanning.ProductionPlace';
	public static readonly instance = new BasicsSiteModuleInfo();

	private constructor() {
		super();
	}
	public override get internalModuleName(): string {
		return 'basics.site';
	}

	private get moduleSubModule(): string {

		return 'Basics.Site';
	}

	
	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [

			BASICS_SITE_GRID_ENTITY_INFO,
			this.ppsProdPlaceChildrenEntityInfo,
			this.basicsSite2StockEntityInfo,
			this.basicsSite2ExternalEntityInfo,
			this.basicsSite2TksShiftEntityInfo,
			PPS_PRODUCTION_PLACE_ENTITY_INFO,
			this.basicSite2ClerkEntityInfo,
			this.ppsCommonCalendarSiteEntityInfo,
		];
	}

	/**
	 * Loads the translation file used for basics site
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'cloud.common',
			'basics.customize',
			'basics.company',
			'basics.material',
			'basics.clerk',
			'estimate.main',
			'project.stock',
			'procurement.inventory',
			'logistic.job',
			'productionplanning.drawing',
			'logistic.plantsupplier',
			'procurement.stock',
			'procurement.common',
			'timekeeping.shiftmodel',
			'productionplanning.productionplace',
			'productionplanning.common',
			'resource.master',
			'productionplanning.accounting',
			'productionplanning.product',
			'basics.site'

		];

	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : 'e40fdef629324924a71ad7fe16ad11ab',
			title: { key: 'basics.site.entityTranslation' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}


	private readonly basicsSite2StockEntityInfo:  EntityInfo = EntityInfo.create({
		grid: {
			title: { text: 'Stocks' },
			behavior: BASICS_SITE2_STOCK_BEHAVIOR_TOKEN,
		},
		dataService: (ctx) => ctx.injector.get(BasicsSite2StockDataService),
		validationService:(ctx) => ctx.injector.get(BasicsSiteStockValidationService),
		dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'Site2StockDto' },
		permissionUuid: '0891dc9128174b5bb41ed6246819119f',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PrjStockFk', 'PrjStockLocationFk','IsDefault', 'IsProductionStock', 'IsComponentMaterialStock', 'IsActualStock', 'CommentText'],
				}
			],
			overloads: {
				PrjStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload(),
				PrjStockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationOptionLookupOverload()
			},
			labels: {
			...prefixAllTranslationKeys('basics.site.', {
				IsProductionStock:           { key: 'isProductionStock'},
				IsActualStock: {key: 'isActualStock'},
				IsComponentMaterialStock: {key: 'isComponentMaterialStock'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				IsDefault: {key: 'entityIsDefault'},
				CommentText:           { key: 'entityCommentText'}
			}),
			...prefixAllTranslationKeys('procurement.common.transaction.', {
				PrjStockFk:           { key: 'prjStockFk'},
				PrjStockLocationFk:           { key: 'prjStocklocationFk'}
			})
		}
		},
	}  as IEntityInfo<BasicsSite2StockEntity>);

	private readonly basicsSite2ExternalEntityInfo:  EntityInfo = EntityInfo.create({
				grid: {
					title: { text: 'External Resources' },
					behavior: BASICS_SITE2_EXTERNAL_BEHAVIOR_TOKEN,
				},
				dataService: (ctx) => ctx.injector.get(BasicsSite2ExternalDataService),
				validationService: (ctx) => ctx.injector.get(BasicsSiteExternalValidationservice),
				dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'Site2ExternalDto' },
				permissionUuid: '7ac185d7d77040cfadcc63e95e7048d3',
				layoutConfiguration: {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['BasExternalsourceFk','ExtCode','ExtDescription','CommentText','Sorting','IsDefault','ProductionRelease'],
						}
					],
					overloads: {
						Id: { label: { text: 'Id', key: 'basics.customize.id' }, visible: true },
						DescriptionInfo: { label: { text: 'DescriptionInfo', key: 'basics.customize.DescriptionInfo' }, visible: true },
						BasExternalsourceFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalSourceLookupOverload(true),

						InsertedAt: {},
						InsertedBy: {},
						UpdatedAt: {},
						UpdatedBy: {},
						Version: {},
					},
					labels: {
						...prefixAllTranslationKeys('basics.site.', {
							ExtCode:           { key: 'extCode'},
							ExtDescription:  {key:'extDescription'},
							ProductionRelease : {key: 'productionRelease'}
						}),
					...prefixAllTranslationKeys('basics.customize.', {
						BasExternalsourceFk:           { key: 'externalsourcefk'}
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						IsDefault: {key: 'entityIsDefault'},
						CommentText:           { key: 'entityCommentText'}
					})
				}

				},
		}  as IEntityInfo<BasicsSite2ExternalEntity>);


	private readonly basicsSite2TksShiftEntityInfo:  EntityInfo = EntityInfo.create({
				grid: {
					title: { text: 'Shift Models' },
					behavior: BASICS_SITE2_TKS_SHIFT_BEHAVIOR_TOKEN,
				},
				dataService: (ctx) => ctx.injector.get(BasicsSite2TksShiftDataService),
				validationService: (ctx) => ctx.injector.get(BasicsSiteShiftValidationService),
				dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'Site2TksShiftDto' },
				permissionUuid: 'dee5249511c14645a2c91cb84ecab0ad',
				layoutConfiguration: {
					groups: [
						{
							gid: 'default',
							attributes: ['TksShiftFk','IsLive'],
						}
					],
					overloads: {
						TksShiftFk:{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: TimekeepingShiftLookupService,
							}),
						}
					},
					labels: {
						...prefixAllTranslationKeys('timekeeping.shiftmodel.', {
							TksShiftFk:           { key: 'entityShift'}
						})
					}
				},
	}  as IEntityInfo<BasicsSite2TksShiftEntity>);

	private readonly basicSite2ClerkEntityInfo: EntityInfo = EntityInfo.create({
				grid: {
					title: { text: 'Site To Clerk' },
				},
				dataService: (ctx) => ctx.injector.get(BasicSite2ClerkDataService),
				validationService: (ctx) => ctx.injector.get(BasicsSiteClerkValidationService),
				dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'Site2ClerkDto' },
				permissionUuid: 'a1ece6519d2e4eaebdab53b98c7094cf',
				layoutConfiguration: {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['ClerkRoleFk','ClerkFk','ValidFrom','ValidTo','CommentText'],
						}
					],
					overloads: {
						ClerkFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedClerkLookupService,
								showDescription: true,
								showClearButton: true,
								descriptionMember: 'Description',
							}),
						},
						ClerkRoleFk: {
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedClerkRoleLookupService,
								showDescription: true,
								descriptionMember: 'Description',
							}),
						},
						Id: { label: { text: 'Id', key: 'basics.customize.id' }, visible: true },
						DescriptionInfo: { label: { text: 'DescriptionInfo', key: 'basics.customize.DescriptionInfo' }, visible: true },

						InsertedAt: {},
						InsertedBy: {},
						UpdatedAt: {},
						UpdatedBy: {},
						Version: {},
					},
					labels: {
						...prefixAllTranslationKeys('cloud.common.', {
							ClerkRoleFk:           { key: 'entityClerkRole'},
							ClerkFk: {key: 'entityClerk'},
							CommentText: {key: 'entityCommentText'}

						}),
						...prefixAllTranslationKeys('basics.clerk.', {
							ValidFrom:           { key: 'entityValidFrom'},
							ValidTo: {key: 'entityValidTo'}
						})
					}
				},
	} as IEntityInfo<BasicSite2ClerkEntity>);

	private readonly ppsCommonCalendarSiteEntityInfo: EntityInfo = EntityInfo.create( {
				grid: {
					title: { text: 'Calendar For Site' },
					behavior: PPS_COMMON_CALENDAR_SITE_BEHAVIOR_TOKEN,
				},
				dataService: (ctx) => ctx.injector.get(PpsCommonCalendarSiteDataService),
				dtoSchemeId: { moduleSubModule: this.productionplanningModuleSubmodule, typeName: 'PpsCalendarForSiteDto' },
				permissionUuid: '9032e39a67e84d27978c9c076990d61a',
				layoutConfiguration: {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['PpsEntityFk', 'CalCalendarFk', 'CommentText'],
						}
					],
					overloads:{
						PpsEntityFk:BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(false),
						CalCalendarFk:{
							type: FieldType.Lookup,
							visible: true,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarLookup
							}),
							additionalFields:[
								{
									displayMember: 'DescriptionInfo.Description',
									label: {
										text: 'Calendar Description',
									},
									column: true,
									singleRow: true,
								}
							],
							width: 100,
						}
					},
					labels: {
						...prefixAllTranslationKeys('basics.customize.', {
							PpsEntityFk:           { key: 'ppsentity'},
						}),
						...prefixAllTranslationKeys('cloud.common.', {
							CommentText: {key:'entityComment'},
							CalCalendarFk: {key:'entityCalCalendarFk'}
						})
					}
				}
			} as IEntityInfo<PpsCommonCalendarSiteEntity>);

	private readonly ppsProdPlaceChildrenEntityInfo: EntityInfo = EntityInfo.create( {
				grid: {
					title: { text: 'Production Place: Production Places' },
					behavior: PPS_PROD_PLACE_CHILDREN_BEHAVIOR_TOKEN,
				},
				dataService: (ctx) => ctx.injector.get(PpsProdPlaceChildrenDataService),
				dtoSchemeId: { moduleSubModule: this.productionPlanningSubmodule, typeName: 'PpsProdPlaceToProdPlaceDto' },
				permissionUuid: '63072b5509ee4672a185d351bcc584e8',
				layoutConfiguration: {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['PpsProdPlaceChildFk','Timestamp'],
						}
					],
					overloads: {
						PpsProdPlaceChildFk:{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: ProductionplanningChildrenLookupService
							})
						}

					},
					labels: {
						...prefixAllTranslationKeys('productionplanning.product.', {
							PpsProdPlaceChildFk:           { key: 'productionPlace.productionPlace'},
						}),
						...prefixAllTranslationKeys('productionplanning.common.', {
							Timestamp:           { key: 'timeStamp'},
						})
					}

				}
	} as IEntityInfo<PpsProdPlaceChildrenEntity>);
 }