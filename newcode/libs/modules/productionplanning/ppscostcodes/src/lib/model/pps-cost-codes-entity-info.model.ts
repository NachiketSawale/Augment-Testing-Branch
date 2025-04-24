/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsCostCodesDataService } from '../services/pps-cost-codes-data.service';
import { ICostCodeNewEntity } from './entities/cost-code-new-entity.interface';
import { EntityDomainType } from '@libs/platform/data-access';
import { BasicsCostCodesLayoutService } from '@libs/basics/costcodes';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingTimeSymbolLookupService } from '@libs/timekeeping/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PPS_COST_CODES_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCodeNewEntity>({
	grid: {
		title: { key: 'productionplanning.ppscostcodes.listViewTitle' },
		treeConfiguration: true,
	},
	form: {
		title: { key: 'productionplanning.ppscostcodes.detailViewTitle' },
		containerUuid: 'fad506c0cfc64652b17be82818a14c98',
	},
	dataService: (ctx) => ctx.injector.get(PpsCostCodesDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsCostCodes', typeName: 'CostCodeNewDto' },
	permissionUuid: '9ecb6ca039d54c4194c1901ad329e6ab',
	entitySchema: {
		schema: 'ICostCodeNewEntity',
		properties: {
			ContextFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			CostCodeParentFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Code: {
				domain: EntityDomainType.Code,
				mandatory: true,
			},
			DescriptionInfo: {
				domain: EntityDomainType.Translation,
				mandatory: false,
			},
			Description2Info: {
				domain: EntityDomainType.Translation,
				mandatory: false,
			},
			IsLabour: {
				domain: EntityDomainType.Boolean,
				mandatory: false,
			},
			IsSubcontractor: {
				domain: EntityDomainType.Boolean,
				mandatory: false,
			},
			IsRate: {
				domain: EntityDomainType.Boolean,
				mandatory: false,
			},
			Rate: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			CurrencyFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			UomFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			CostCodeTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			CostCodePortionsFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			CostGroupPortionsFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			AbcClassificationFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			FactorCosts: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			RealFactorCosts: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			PrcStructureFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			FactorQuantity: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			RealFactorQuantity: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			Surcharge: {
				domain: EntityDomainType.Percent,
				mandatory: true,
			},
			Contribution: {
				domain: EntityDomainType.Percent,
				mandatory: true,
			},
			DayWorkRate: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			Remark: {
				domain: EntityDomainType.Remark,
				mandatory: false,
			},
			UserDefined1: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefined2: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefined3: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefined4: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefined5: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			SearchPattern: {
				domain: EntityDomainType.Text,
				mandatory: false,
			},
			InsertedAt: {
				mandatory: true,
				domain: EntityDomainType.Date,
			},
			CostCodeLevel1Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			InsertedBy: {
				mandatory: true,
				domain: EntityDomainType.Integer,
			},
			UpdatedAt: {
				domain: EntityDomainType.Date,
				mandatory: false,
			},
			UpdatedBy: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Version: {
				mandatory: true,
				domain: EntityDomainType.Integer,
			},
			CostCodeLevel6Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			CostCodeLevel7Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			CostCodeLevel8Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			ContrCostCodeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			EstCostTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			FactorHour: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			IsBudget: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			IsCost: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			IsEditable: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			IsProjectChildAllowed: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			EfbType221Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			EfbType222Fk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Co2Source: {
				domain: EntityDomainType.Quantity,
				mandatory: false,
			},
			Co2SourceFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Co2Project: {
				domain: EntityDomainType.Quantity,
				mandatory: false,
			},
			//TODO:
			// IsActive: {
			// 	domain: EntityDomainType.Boolean,
			// 	mandatory: false,
			// },
		},
		mainModule: 'productionplanning.ppscostcodes',
		additionalProperties: {
			'PpsCostCode.NewTksTimeSymbolFk': { domain: EntityDomainType.Integer, mandatory: false },
			'PpsCostCode.UseToCreateComponents': { domain: EntityDomainType.Boolean, mandatory: true },
			'PpsCostCode.UseToUpdatePhaseReq': { domain: EntityDomainType.Boolean, mandatory: true },
			'PpsCostCode.ShowAsSlotOnProduct': { domain: EntityDomainType.Boolean, mandatory: true },
			'PpsCostCode.CommentText': {
				domain: EntityDomainType.Comment,
				mandatory: false,
			},
			'PpsCostCode.UserDefined1': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsCostCode.UserDefined2': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsCostCode.UserDefined3': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsCostCode.UserDefined4': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsCostCode.UserDefined5': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
		},
	},
	layoutConfiguration: async (context) => {
		const costCodeLayout = await context.injector.get(BasicsCostCodesLayoutService).generateConfig();

		const result = {
			groups: [
				...costCodeLayout.groups!,
				{
					gid: 'ppsProperties',
					title: {
						key: 'productionplanning.ppscostcodes.ppsProperties',
						text: '*PPS Properties',
					},
					attributes: [],
					additionalAttributes: [
						'PpsCostCode.NewTksTimeSymbolFk',
						'PpsCostCode.UseToCreateComponents',
						'PpsCostCode.UseToUpdatePhaseReq',
						'PpsCostCode.ShowAsSlotOnProduct',
						'PpsCostCode.CommentText',
						'PpsCostCode.UserDefined1',
						'PpsCostCode.UserDefined2',
						'PpsCostCode.UserDefined3',
						'PpsCostCode.UserDefined4',
						'PpsCostCode.UserDefined5',
					],
				},
			],
			overloads: {
				...costCodeLayout.overloads!,
			},
			additionalOverloads: {
				'PpsCostCode.NewTksTimeSymbolFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingTimeSymbolLookupService,
						showClearButton: true,
					}),
				},
			},

			labels: {
				...costCodeLayout.labels!,
				'PpsCostCode.CommentText': { key: 'cloud.common.entityComment' },
				...prefixAllTranslationKeys('productionplanning.ppscostcodes.', {
					'PpsCostCode.NewTksTimeSymbolFk': { key: 'tksTimeSymbolFk', text: '*Time Symbol' },
					'PpsCostCode.UseToCreateComponents': { key: 'useToCreateComponents', text: '*Use To Create Components' },
					'PpsCostCode.UseToUpdatePhaseReq': { key: 'useToUpdatePhaseReq', text: '*Use To Update Phase Requirement' },
					'PpsCostCode.ShowAsSlotOnProduct': { key: 'showAsSlotOnProduct', text: '*Show As Slot On Product' },
					'PpsCostCode.UserDefined1': { key: 'userDefined1', text: '*Pps Cost Code Text 1' },
					'PpsCostCode.UserDefined2': { key: 'userDefined2', text: '*Pps Cost Code Text 2' },
					'PpsCostCode.UserDefined3': { key: 'userDefined3', text: '*Pps Cost Code Text 3' },
					'PpsCostCode.UserDefined4': { key: 'userDefined4', text: '*Pps Cost Code Text 4' },
					'PpsCostCode.UserDefined5': { key: 'userDefined5', text: '*Pps Cost Code Text 5' },
				}),
			},
		};
		return result as ILayoutConfiguration<ICostCodeNewEntity>;
	},
});
