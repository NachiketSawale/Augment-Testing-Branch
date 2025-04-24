/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { TimekeepingTimeSymbolsAccountDataService } from '../services/timekeeping-time-symbols-account-data.service';
import { ITimeSymbolAccountEntity } from '@libs/timekeeping/interfaces';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedTimekeepingSurchargeTypeLookupService, BasicsSharedTimekeepingCostGroupLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { TimekeepingTimeSymbolsAccountValidationService } from '../services/timekeeping-time-symbols-account-validation.service';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN, IControllingUnitLookupEntity } from '@libs/controlling/interfaces';


export const TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeSymbolAccountEntity>({
	grid: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbolAccountListTitle'},
	},
	form: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbolAccountDetailTitle' },
		containerUuid: '24979528559e40cf9cfcd22d9e7cc393',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeSymbolsAccountDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeSymbolsAccountValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.TimeSymbols', typeName: 'TimeSymbolAccountDto'},
	permissionUuid: 'f1f173225e0040d8bfd114c90f359e09',
	layoutConfiguration:async ctx=> {
		const controllingUnitLookupProvider = await ctx.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<ITimeSymbolAccountEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['CompanyChargedFk', 'SurchargeTypeFk', 'CostGroupFk', 'ControllingUnitFk', 'CommentText',
						'ControllingGroup1Fk', 'ControllingGroup2Fk', 'ControllingGroup3Fk']
				},
				{
					gid: 'accounts',
					attributes: [
						/*'AccountCostFk',*/ 'ControllingGrpDetail1CostFk', 'NominalDimension1Cost', 'ControllingGrpDetail2CostFk',
						'NominalDimension2Cost', 'ControllingGrpDetail3CostFk', 'NominalDimension3Cost',
						/*'AccountRevFk',*/ 'ControllingGrpDetail1RevFk', 'NominalDimension1Rev', 'ControllingGrpDetail2RevFk',
						'NominalDimension2Rev', 'ControllingGrpDetail3RevFk', 'NominalDimension3Rev',
						/*'AccountICCostFk',*/ 'ControllingGrpDetail1ICCostFk', 'NominalDimension1ICCost', 'ControllingGrpDetail2ICCostFk',
						'NominalDimension2ICCost', 'ControllingGrpDetail3ICCostFk', 'NominalDimension3ICCost',
						/*'AccountICRevFk',*/ 'ControllingGrpDetail1ICRevFk', 'NominalDimension1ICRev', 'ControllingGrpDetail2ICRevFk',
						'NominalDimension2ICRev', 'ControllingGrpDetail3ICRevFk', 'NominalDimension3ICRev'
					]
				}
			],
			overloads: {
				CompanyChargedFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
					})
				},
				SurchargeTypeFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingSurchargeTypeLookupService,
					})
				},
				CostGroupFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingCostGroupLookupService,
					})
				},
				ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
					checkIsAccountingElement: true,
					controllingUnitGetter: e => e.ControllingUnitFk,
					lookupOptions: {
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'scheduling.main.controllingunit.project.context.filter',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, ITimeSymbolAccountEntity>) => {
								return {
									ByStructure: true,
									ExtraFilter: false,
									CompanyFk:  context.entity?.CompanyFk
								};
							},
						}
					}
				}),
				ControllingGroup1Fk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
				ControllingGroup2Fk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
				ControllingGroup3Fk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
				//TODO AccountCostFk: {}
				ControllingGrpDetail1CostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail2CostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail3CostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				//TODO AccountRevFk: {}
				ControllingGrpDetail1RevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail2RevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail3RevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				//TODO AccountICCostFk: {}
				ControllingGrpDetail1ICCostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail2ICCostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail3ICCostFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				//TODO AccountICRevFk: {}
				ControllingGrpDetail1ICRevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail2ICRevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
				ControllingGrpDetail3ICRevFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.',{
					CommentText :{ key: 'entityComment'},
					ControllingUnitFk: {key: 'entityControllingUnit'}

				}),
				...prefixAllTranslationKeys('timekeeping.timesymbols.',{
					SurchargeTypeFk :{ key: 'entitySurchargeTypeFk'},
					CostGroupFk :{ key: 'entityCostGroupFk'},
					NominalDimension1Cost :{ key: 'entityNominalDimensionCost', params:{'p_0': 1}},
					NominalDimension1ICCost :{ key: 'entityNominalDimensionICCost', params:{'p_0': 1}},
					NominalDimension1ICRev :{ key: 'entityNominalDimensionICRev', params:{'p_0': 1}},
					NominalDimension1Rev :{ key: 'entityNominalDimensionRev', params:{'p_0': 1}},
					NominalDimension2Cost :{ key: 'entityNominalDimensionCost', params:{'p_0': 2}},
					NominalDimension2ICCost :{ key: 'entityNominalDimensionICCost', params:{'p_0': 2}},
					NominalDimension2ICRev :{ key: 'entityNominalDimensionICRev', params:{'p_0': 2}},
					NominalDimension3Cost :{ key: 'entityNominalDimensionCost', params:{'p_0': 3}},
					NominalDimension3ICCost :{ key: 'entityNominalDimensionICCost', params:{'p_0': 3}},
					NominalDimension3ICRev :{ key: 'entityNominalDimensionICRev', params:{'p_0': 3}},
					ValuationRate :{ key: 'entityValuationRate'},
					CompanyChargedFk: {key: 'entityCompanyChargedFk'},
					ControllingGroup1Fk: {key: 'entityControllingGroup', params: {'p_0': 1}},
					ControllingGroup2Fk: {key: 'entityControllingGroup', params: {'p_0': 2}},
					ControllingGroup3Fk: {key: 'entityControllingGroup', params: {'p_0': 3}},
					AccountCostFk: {key: 'entityAccountCost'},
					ControllingGrpDetail1CostFk: {key: 'entityControllingGrpDetailCost', params: {'p_0': 1}},
					ControllingGrpDetail2CostFk: {key: 'entityControllingGrpDetailCost', params: {'p_0': 2}},
					ControllingGrpDetail3CostFk: {key: 'entityControllingGrpDetailCost', params: {'p_0': 3}},
					AccountRevFk: {key: 'entityAccountRev'},
					ControllingGrpDetail1RevFk: {key: 'entityControllingGrpDetailRev', params: {'p_0': 1}},
					ControllingGrpDetail2RevFk: {key: 'entityControllingGrpDetailRev', params: {'p_0': 2}},
					ControllingGrpDetail3RevFk: {key: 'entityControllingGrpDetailRev', params: {'p_0': 3}},
					NominalDimension2Rev: {key: 'entityNominalDimensionRev', params: {'p_0': 2}},
					NominalDimension3Rev: {key: 'entityNominalDimensionRev', params: {'p_0': 3}},
					AccountICCostFk: {key: 'entityAccountICCostFk'},
					ControllingGrpDetail1ICCostFk: {key: 'entityControllingGrpDetailICCost', params: {'p_0': 1}},
					ControllingGrpDetail2ICCostFk: {key: 'entityControllingGrpDetailICCost', params: {'p_0': 2}},
					ControllingGrpDetail3ICCostFk: {key: 'entityControllingGrpDetailICCost', params: {'p_0': 3}},
					AccountICRevFk: {key: 'entityAccountICRevFk'},
					ControllingGrpDetail1ICRevFk: {key: 'entityControllingGrpDetailICRev', params: {'p_0': 1}},
					ControllingGrpDetail2ICRevFk: {key: 'entityControllingGrpDetailICRev', params: {'p_0': 2}},
					ControllingGrpDetail3ICRevFk: {key: 'entityControllingGrpDetailICRev', params: {'p_0': 3}}
				})
			}
		};
	}

});