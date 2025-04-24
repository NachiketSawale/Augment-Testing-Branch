/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { EntityDomainType } from '@libs/platform/data-access';
import { ProjectCostCodesDataService } from '../../services/project-cost-codes-data.service';
import { ProjectCostCodesBehavior } from '../../behaviors/project-cost-codes-behavior.service';
import { createLookup, FieldType, IGridTreeConfiguration, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCo2SourceLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN } from '../interfaces/project-costcodes-lookup-provider.interface';

/**
 * Configuration for the project cost codes entity.
 */
export const PROJECT_COST_CODES_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrjCostCodesEntity>({
	grid: {
		title: { text: 'Cost Codes' },
		behavior: (ctx) => ctx.injector.get(ProjectCostCodesBehavior),
		treeConfiguration: (ctx) => {
			return {
				rootEntities: () => {
					const service = ctx.injector.get(ProjectCostCodesDataService);
					const data = service.getList();
					return data;
				},
				parent: function (entity: IPrjCostCodesEntity): IPrjCostCodesEntity | null {
					const service = ctx.injector.get(ProjectCostCodesDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IPrjCostCodesEntity) {
					const service = ctx.injector.get(ProjectCostCodesDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IPrjCostCodesEntity>;
		},
	},
	form: {
		title: { text: 'Cost Codes Details' },
		containerUuid: 'bafa6a50e41f11e4b5710800200c9a66',
	},
	entitySchema: {
		schema: 'IPrjCostCodesEntity',
		properties: {
			Code: { domain: EntityDomainType.Code, mandatory: false },
			Description: { domain: EntityDomainType.Description, mandatory: false },
			Description2: { domain: EntityDomainType.Description, mandatory: false },
			FactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			RealFactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			FactorHour: { domain: EntityDomainType.Factor, mandatory: false },
			FactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			RealFactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			Rate: { domain: EntityDomainType.Money, mandatory: false },
			DayWorkRate: { domain: EntityDomainType.Money, mandatory: false },
			CurrencyFk: { domain: EntityDomainType.Integer, mandatory: false },
			UomFk: { domain: EntityDomainType.Integer, mandatory: false },
			Remark: { domain: EntityDomainType.Comment, mandatory: false },
			IsRate: { domain: EntityDomainType.Boolean, mandatory: false },
			IsLabour: { domain: EntityDomainType.Integer, mandatory: false },
			EstCostTypeFk: { domain: EntityDomainType.Integer, mandatory: false },
			CostCodeTypeFk: { domain: EntityDomainType.Integer, mandatory: false },
			IsChildAllowed: { domain: EntityDomainType.Boolean, mandatory: false },
			IsDefault: { domain: EntityDomainType.Boolean, mandatory: false },
			IsEditable: { domain: EntityDomainType.Boolean, mandatory: false },
			IsBudget: { domain: EntityDomainType.Boolean, mandatory: false },
			IsCost: { domain: EntityDomainType.Boolean, mandatory: false },
			Co2Source: { domain: EntityDomainType.Quantity, mandatory: false },
			Co2Project: { domain: EntityDomainType.Quantity, mandatory: false },
			Co2SourceFk: { domain: EntityDomainType.Integer, mandatory: false },
			CostCodePortionsFk: { domain: EntityDomainType.Integer, mandatory: false },
			CostGroupPortionsFk: { domain: EntityDomainType.Integer, mandatory: false },
			AbcClassificationFk: { domain: EntityDomainType.Integer, mandatory: false },
			PrcStructureFk: { domain: EntityDomainType.Integer, mandatory: false },
			ContrCostCodeFk: { domain: EntityDomainType.Integer, mandatory: false },
			EfbType221Fk: { domain: EntityDomainType.Integer, mandatory: false },
			EfbType222Fk: { domain: EntityDomainType.Integer, mandatory: false },
			UserDefined1: { domain: EntityDomainType.Description, mandatory: false },
			UserDefined2: { domain: EntityDomainType.Description, mandatory: false },
			UserDefined3: { domain: EntityDomainType.Description, mandatory: false },
			UserDefined4: { domain: EntityDomainType.Description, mandatory: false },
			UserDefined5: { domain: EntityDomainType.Description, mandatory: false },
		},
		additionalProperties: {
			'BasCostCode.FactorCosts': { domain: EntityDomainType.Factor, mandatory: false },
			'BasCostCode.RealFactorCosts': { domain: EntityDomainType.Factor, mandatory: false },
			'BasCostCode.FactorHour': { domain: EntityDomainType.Factor, mandatory: false },
			'BasCostCode.FactorQuantity': { domain: EntityDomainType.Factor, mandatory: false },
			'BasCostCode.RealFactorQuantity': { domain: EntityDomainType.Factor, mandatory: false },
			'BasCostCode.Rate': { domain: EntityDomainType.Money, mandatory: false },
			'BasCostCode.DayWorkRate': { domain: EntityDomainType.Money, mandatory: false },
			'BasCostCode.CurrencyFk': { domain: EntityDomainType.Integer, mandatory: false },
			'BasCostCode.UomFk': { domain: EntityDomainType.Integer, mandatory: false },
			'BasCostCode.Remark': { domain: EntityDomainType.Comment, mandatory: false },
			'BasCostCode.IsRate': { domain: EntityDomainType.Boolean, mandatory: false },
			'BasCostCode.IsLabour': { domain: EntityDomainType.Integer, mandatory: false },
			'BasCostCode.EstCostTypeFk': { domain: EntityDomainType.Integer, mandatory: false },
			'BasCostCode.CostCodeTypeFk': { domain: EntityDomainType.Integer, mandatory: false },
			'BasCostCode.IsProjectChildAllowed': { domain: EntityDomainType.Boolean, mandatory: false },
		},
	},
	dataService: (ctx: IInitializationContext) => {
		return ctx.injector.get(ProjectCostCodesDataService);
	},
	permissionUuid: 'c9b63a888cfb4fb9b856e8f00bb57391',
	layoutConfiguration: async ctx => {
		const LookupProvider = await ctx.lazyInjector.inject(PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN);
		const result = {
			groups: [
				{
					gid: 'basicData',
					attributes: [
						'Code',
						'Description',
						'Description2',
						'RealFactorCosts',
						'FactorCosts',
						'FactorHour',
						'FactorQuantity',
						'RealFactorQuantity',
						'Rate',
						'DayWorkRate',
						'CurrencyFk',
						'UomFk',
						'IsLabour',
						'IsRate',
						'IsDefault',
						'IsEditable',
						'Remark',
						'CostCodeTypeFk',
						'EstCostTypeFk',
						'IsBudget',
						'IsCost',
						'IsChildAllowed',
						'Co2Source',
						'Co2Project',
					],
					additionalAttributes: [
						'BasCostCode.FactorCosts',
						'BasCostCode.RealFactorCosts',
						'BasCostCode.FactorQuantity',
						'BasCostCode.RealFactorQuantity',
						'BasCostCode.Rate',
						'BasCostCode.DayWorkRate',
						'BasCostCode.CurrencyFk',
						'BasCostCode.UomFk',
						'BasCostCode.Remark',
						'BasCostCode.IsRate',
						'BasCostCode.IsLabour',
						'BasCostCode.EstCostTypeFk',
						'BasCostCode.CostCodeTypeFk',
						'BasCostCode.IsProjectChildAllowed',
						'BasCostCode.FactorHour'],
				},
				{
					gid: 'Assignments',
					attributes: ['CostCodePortionsFk', 'CostGroupPortionsFk', 'AbcClassificationFk', 'PrcStructureFk', 'ContrCostCodeFk', 'EfbType221Fk', 'EfbType222Fk', 'Co2SourceFk'],
				},
				{
					gid: 'UserDefText',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					Co2Source: { key: 'sustainabilty.entityCo2Source' },
					Co2Project: { key: 'sustainabilty.entityCo2Project' },
					Co2SourceFk: { key: 'sustainabilty.entityBasCo2SourceFk' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
					Description: { key: 'entityDescription' },
					PrcStructureFk: { key: 'entityStructureCode' },
					UserDefined1: {
						key: 'entityUserDefText',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefText',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefText',
						params: { p_0: '3' },
					},
					UserDefined4: {
						key: 'entityUserDefText',
						params: { p_0: '4' },
					},
					UserDefined5: {
						key: 'entityUserDefText',
						params: { p_0: '5' },
					},
				}),
				...prefixAllTranslationKeys('project.costcodes.', {
					'FactorQuantity': { key: 'factorQuantity' },
					'Rate': { key: 'rate' },
					'DayWorkRate': { key: 'dayWorkRate' },
					'FactorCosts': { key: 'factorCosts' },
					'RealFactorCosts': { key: 'realFactorCosts' },
					'RealFactorQuantity': { key: 'realFactorQuantity' },
					'Remark': { key: 'remark' },
					'CostCodeTypeFk': { key: 'entityType' },
					'EstCostTypeFk': { key: 'costType' },
					'IsLabour': { key: 'isLabour' },
					'IsRate': { key: 'isRate' },
					'BasCostCode.IsProjectChildAllowed': { key: 'isPrjChildAllowed' },
					'BasCostCode.Remark': { key: 'remark' },
					'CurrencyFk': { key: 'currency' },
					'IsDefault': { key: 'isDefault' },
					'FactorHour': { key: 'factorHour' },
					'UomFk': { key: 'uoM' },
					'BasRate': { key: 'priceListRate' },
					'IsEditable': { key: 'isEditable' },
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					'Description2': { key: 'description2' },
					'BasCostCode.EstCostTypeFk': { key: 'costType' },
					'BasCostCode.FactorCosts': { key: 'factorCosts' },
					'BasCostCode.RealFactorCosts': { key: 'realFactorCosts' },
					'BasCostCode.FactorHour': { key: 'factorHour' },
					'BasCostCode.FactorQuantity': { key: 'factorQuantity' },
					'BasCostCode.RealFactorQuantity': { key: 'realFactorQuantity' },
					'BasCostCode.DayWorkRate': { key: 'dayWorkRate' },
					'BasCostCode.CostCodeTypeFk': { key: 'entityType' },
					'BasCostCode.IsRate': { key: 'isRate' },
					'BasCostCode.Rate': { key: 'rate' },
					'BasCostCode.IsLabour': { key: 'isLabour' },
					'BasCostCode.CurrencyFk': { key: 'currency' },
					'BasCostCode.UomFk': { key: 'uoM' },
					'IsBudget': { key: 'isBudget' },
					'IsCost': { key: 'isCost' },
					'CostCodePortionsFk': { key: 'costCodePortions' },
					'CostGroupPortionsFk': { key: 'costGroupPortions' },
					'AbcClassificationFk': { key: 'abcClassification' },
					'ContrCostCodeFk': { key: 'controllingCostCode' },
					'EfbType221Fk': { key: 'efbType221' },
					'EfbType222Fk': { key: 'efbType222' },
					'IsChildAllowed': { key: 'isChildAllowed' },
				}),
			},
			overloads: {
				RealFactorCosts: {
					readonly: true,
				},
				RealFactorQuantity: {
					readonly: true,
				},
				Rate: {
					readonly: true,
				},
				FactorHour: {
					readonly: true,
				},
				FactorQuantity: {
					readonly: true,
				},
				DayWorkRate: {
					readonly: true,
				},
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				EstCostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),
				CostCodePortionsFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostCodePortionLookupOverload(true),
				CostGroupPortionsFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostGroupPortionLookupOverload(true),
				AbcClassificationFk: BasicsSharedCustomizeLookupOverloadProvider.provideAbcClassificationLookupOverload(true),
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				EfbType221Fk: BasicsSharedCustomizeLookupOverloadProvider.provideEfbTypeLookupOverload(true),
				EfbType222Fk: BasicsSharedCustomizeLookupOverloadProvider.provideEfbTypeLookupOverload(true),
				CostCodeTypeFk:LookupProvider.provideProjectCostcodesCostTypeLookupOverload({showClearButton: true}),
				ContrCostCodeFk:LookupProvider.provideProjectCostcodesControllingLookupOverload({showClearButton: true}),
				Co2Project: {
					readonly: true,
				},
				Co2Source: {
					readonly: true,
				},
				Co2SourceFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCo2SourceLookupService,
					}),
				},
			},
			additionalOverloads: {
				'BasCostCode.FactorCosts': {
					readonly: true,
				},
				'BasCostCode.UomFk': BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
				'BasCostCode.CurrencyFk': BasicsSharedLookupOverloadProvider.provideCurrencyReadonlyLookupOverload(),
				'BasCostCode.CostCodeTypeFk': BasicsSharedCustomizeLookupOverloadProvider.provideCostCodeTypeReadonlyLookupOverload(),
				'BasCostCode.EstCostTypeFk': BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeReadonlyLookupOverload(),
			},
			transientFields: [
				{
					id: 'ContrCostCodeFk',
					model: 'ContrCostCodeFk',
					type: FieldType.Lookup,
				},
				{
					id: 'PrcStructureFk',
					model: 'PrcStructureFk',
					type: FieldType.Lookup,
				},
			],
		};
		return result as ILayoutConfiguration<IPrjCostCodesEntity>;
	}
});