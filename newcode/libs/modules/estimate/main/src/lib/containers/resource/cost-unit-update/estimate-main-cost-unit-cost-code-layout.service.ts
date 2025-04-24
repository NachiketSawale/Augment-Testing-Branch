/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, IGridConfiguration } from '@libs/ui/common';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import {
	BasicsSharedAbcClassificationLookupService,
	BasicsSharedCostCodePortionLookupService,
	BasicsSharedCostTypeLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedUomLookupService
} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainCostUnitCostCodeLayoutService {
	public static  generateConfig(): IGridConfiguration<PrjCostCodesEntity> {
		return {
			uuid: '678f6d77c77d46638e9f126e6c17aed3',
			columns: [
				{
					id: 'lgmjobfk2',
					model: 'JobCode',
					sortable: true,
					label: {
						text: 'LgmJob',
						key:	'project.costcodes.lgmJobFk'
					},
					type: FieldType.Code,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'LgmJob',
						key:	'project.costcodes.lgmJobFk'
					},
					width: 100,
					visible: true
				},
				{
					id: 'code2',
					model: 'Code',
					sortable: true,
					label: {
						text: 'Code',
						key:'cloud.common.entityCode'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: true,
					tooltip: {
						text: 'Code',
						key:'cloud.common.entityCode'
					},
					width: 100,
					visible: true
				},
				{
					id: 'descriptioninfo2',
					model: 'Description',
					sortable: true,
					label: {
						text: 'Description',
						key:'cloud.common.entityDescription'
					},
					type: FieldType.Description,
					readonly: true,
					searchable: true,
					tooltip: {
						text: 'Description',
						key:'cloud.common.entityDescription'
					},
					width: 100,
					visible: true
				},
				{
					id: 'rate2',
					model: 'Rate',
					sortable: true,
					label: {
						text: 'Rate(Project)',
						key:'project.costcodes.rate'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Rate(Project)',
						key:'project.costcodes.rate'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'uomfk2',
					model: 'UomFk',
					sortable: true,
					label: {
						text: 'UoM(Project',
						key:'project.costcodes.uoM'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'UoM(Project',
						key:'project.costcodes.uoM'
					},
					width: 100,
					visible: true,
					required: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						readonly: true
					})
				},
				{
					id: 'uomfkdescription2',
					model: 'UomFk',
					sortable: true,
					label: {
						text: 'UoM(Project)-Description',
						key:'project.costcodes.uoMDescription'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'UoM(Project)-Description',
						key:'project.costcodes.uoMDescription'
					},
					width: 120,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						readonly: true,
						displayMember: 'DescriptionInfo.Translated',
						isClientSearch: true
					}),
				},
				{
					id: 'currencyfk2',
					model: 'CurrencyFk',
					sortable: true,
					label: {
						text: 'Currency(Project)',
						key:'project.costcodes.currency'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Currency(Project)',
						key:'project.costcodes.currency'
					},
					width: 100,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						readonly: true,
						displayMember: 'Currency'
					})
				},
				{
					id: 'currencyfkdescription2',
					model: 'CurrencyFk',
					sortable: true,
					label: {
						text: 'Currency(Project)-Description',
						key:'project.costcodes.currencyDescription'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Currency(Project)-Description',
						key:'project.costcodes.currencyDescription'
					},
					width: 120,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						readonly: true,
						displayMember: 'DescriptionInfo.Translated'
					})
				},
				{
					id: 'factorcosts2',
					model: 'FactorCosts',
					sortable: true,
					label: {
						text: 'Factor (Project Costs)',
						key:'project.costcodes.factorCosts'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Factor (Project Costs)',
						key:'project.costcodes.factorCosts'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'realfactorcosts2',
					model: 'RealFactorCosts',
					sortable: true,
					label: {
						text: 'RealFactor (Project Costs)',
						key:	'project.costcodes.realFactorCosts'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'RealFactor (Project Costs)',
						key:	'project.costcodes.realFactorCosts'
					},
					width: 100,
					visible: true
				},
				{
					id: 'factorquantity2',
					model: 'FactorQuantity',
					sortable: true,
					label: {
						text: 'Factor (Project Quantity)',
						key:	'project.costcodes.factorQuantity'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Factor (Project Quantity)',
						key:	'project.costcodes.factorQuantity'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'realfactorquantity2',
					model: 'RealFactorQuantity',
					sortable: true,
					label: {
						text: 'RealFactor (Project Quantity)',
						key:	'project.costcodes.realFactorQuantity'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'RealFactor (Project Quantity)',
						key:	'project.costcodes.realFactorQuantity'
					},
					width: 100,
					visible: true
				},
				{
					id: 'dayworkrate2',
					model: 'DayWorkRate',
					sortable: true,
					label: {
						text: 'DW/T+M Rate(Project)',
						key:	'project.costcodes.dayWorkRate'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'DW/T+M Rate(Project)',
						key:	'project.costcodes.dayWorkRate'
					},
					width: 100,
					visible: true
				},
				{
					id: 'israte2',
					model: 'IsRate',
					sortable: true,
					label: {
						text: 'IsRate(Project)',
						key:	'project.costcodes.isRate'
					},
					type: FieldType.Boolean,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'IsRate(Project)',
						key:	'project.costcodes.isRate'
					},
					width: 100,
					visible: true
				},
				{
					id: 'islabour2',
					model: 'IsLabour',
					sortable: true,
					label: {
						text: 'IsLabour(Project)',
						key:	'project.costcodes.isLabour'
					},
					type: FieldType.Boolean,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'IsLabour(Project)',
						key:	'project.costcodes.isLabour'
					},
					width: 100,
					visible: true
				},
				{
					id: 'remark2',
					model: 'Remark',
					sortable: true,
					label: {
						text: 'Remark(Project)',
						key:	'project.costcodes.remark'
					},
					type: FieldType.Text,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Remark(Project)',
						key:	'project.costcodes.remark'
					},
					width: 100,
					visible: true
				},
				{
					id: 'estcosttypefk2',
					model: 'EstCostTypeFk',
					sortable: true,
					label: {
						text: 'Cost Type(Project)',
						key:	'project.costcodes.costType'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Cost Type(Project)',
						key:	'project.costcodes.costType'
					},
					width: 100,
					visible: true,
					lookupOptions:  createLookup({
						dataServiceToken: BasicsSharedCostTypeLookupService,
						readonly: true
					})
				},
				{
					id: 'factorhour2',
					model: 'FactorHour',
					sortable: true,
					label: {
						text: 'Factor (Project Hour)',
						key:	'project.costcodes.factorHour'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Factor (Project Hour)',
						key:	'project.costcodes.factorHour'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'bascostcodetypefk2',
					model: 'CostCodeTypeFk',
					sortable: true,
					label: {
						text: 'Type',
						key:	'cloud.common.entityType'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Type',
						key:	'cloud.common.entityType'
					},
					width: 100,
					visible: true,
					lookupOptions:  createLookup({
						dataServiceToken: BasicsSharedCostTypeLookupService,
						readonly: true
					})
				},
				{
					id: 'bascostcodecostcodeportionsfk2',
					model: 'BasCostCode.CostCodePortionsFk',
					sortable: true,
					label: {
						text: 'Cost Portions',
						key:	'basics.costcodes.costCodePortions'

					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken:BasicsSharedCostCodePortionLookupService,
						readonly: true
					}),
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Cost Portions',
						key:	'basics.costcodes.costCodePortions'
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodecostgroupportionsfk2',
					model: 'BasCostCode.CostGroupPortionsFk',
					sortable: true,
					label: {
						text: 'Cost Group Portions',
						key:	'basics.costcodes.costGroupPortions'
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken:BasicsSharedCostCodePortionLookupService,
						readonly: true
					}),
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Cost Group Portions',
						key:	'basics.costcodes.costGroupPortions'
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeabcclassificationfk2',
					model: 'BasCostCode.AbcClassificationFk',
					sortable: true,
					label: {
						text: 'Abc Classification',
						key:	'basics.costcodes.abcClassification'
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken:BasicsSharedAbcClassificationLookupService,
						readonly: true
					}),
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Abc Classification',
						key:	'basics.costcodes.abcClassification'
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodedescription2info2',
					model: 'BasCostCode.Description2Info',
					sortable: true,
					label: {
						text: 'Further Description',
						key:	'basics.costcodes.description2'
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Further Description',
						key:	'basics.costcodes.description2'
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeuserdefined12',
					model: 'BasCostCode.UserDefined1',
					sortable: true,
					label: {
						text: 'Text 1',
						key:	'cloud.common.entityUserDefText'+1
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Text 1',
						key:	'cloud.common.entityUserDefText'+1
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeuserdefined22',
					model: 'BasCostCode.UserDefined2',
					sortable: true,
					label: {
						text: 'Text 2',
						key:	'cloud.common.entityUserDefText'+2
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Text 2',
						key:	'cloud.common.entityUserDefText'+2
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeuserdefined32',
					model: 'BasCostCode.UserDefined3',
					sortable: true,
					label: {
						text: 'Text 3',
						key:	'cloud.common.entityUserDefText'+3
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Text 3',
						key:	'cloud.common.entityUserDefText'+3
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeuserdefined42',
					model: 'BasCostCode.UserDefined4',
					sortable: true,
					label: {
						text: 'Text 4',
						key:	'cloud.common.entityUserDefText'+4
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Text 4',
						key:	'cloud.common.entityUserDefText'+4
					},
					width: 100,
					visible: true
				},
				{
					id: 'bascostcodeuserdefined52',
					model: 'BasCostCode.UserDefined5',
					sortable: true,
					label: {
						text: 'Text 5',
						key:	'cloud.common.entityUserDefText'+5
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Text 5',
						key:	'cloud.common.entityUserDefText'+5
					},
					width: 100,
					visible: true
				}
			]
		};
	}
}