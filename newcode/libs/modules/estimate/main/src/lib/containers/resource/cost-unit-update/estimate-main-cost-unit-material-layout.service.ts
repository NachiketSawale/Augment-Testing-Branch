/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, IGridConfiguration } from '@libs/ui/common';
import { IPrjMaterialEntity} from '@libs/project/interfaces';
import {
	BasicsSharedCostCodePortionLookupService,
	BasicsSharedCostTypeLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedMaterialDiscountGroupLookupService,
	BasicsSharedUomLookupService
} from '@libs/basics/shared';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root'
})
export class EstimateMainCostUnitMaterialLayoutService {
	public static  generateConfig(): IGridConfiguration<IPrjMaterialEntity>{
		return {
			uuid: '678f6d77c77d46638e9f126e6c13aee3',
			columns: [
				{
					id: 'lgmjobfk1',
					model: 'JobCode',
					sortable: true,
					label: {
						text: 'Job',
						key:	'project.costcodes.lgmJobFk'
					},
					type: FieldType.Code,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Job',
						key:	'project.costcodes.lgmJobFk'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'code1',
					model: 'Code',
					sortable: true,
					label: {
						text: 'Code',
						key:	'cloud.common.entityCode'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: true,
					tooltip: {
						text: 'Code',
						key:	'cloud.common.entityCode'
					},
					width: 100,
					visible: true
				},
				{
					id: 'descriptioninfo1',
					model: 'Description',
					sortable: true,
					label: {
						text: 'Description',
						key:	'cloud.common.entityDescription'
					},
					type: FieldType.Description,
					readonly: true,
					searchable: true,
					tooltip: {
						text: 'Description',
						key:	'cloud.common.entityDescription'
					},
					width: 100,
					visible: true
				},
				{
					id: 'estimateprice1',
					model: 'Rate',
					sortable: true,
					label: {
						text: 'Estimate Price(Project)',
						key:	'project.material.prjEstimatePrice'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Estimate Price(Project)',
						key:	'project.material.prjEstimatePrice'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'uomfk1',
					model: 'UomFk',
					sortable: true,
					label: {
						text: 'project.costcodes.uoM',
						key:	'project.costcodes.uoM'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'UoM(Project',
						key:	'project.costcodes.uoM'
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
					id: 'dayworkrate1',
					model: 'DayWorkRate',
					sortable: true,
					label: {
						text: 'DW/T+M Rate(Project)',
						key:	'project.material.dayWorkRateBas'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'DW/T+M Rate(Project)',
						key:	'project.material.dayWorkRateBas'
					},
					width: 120,
					visible: true
				},
				{
					id: 'currencyfk1',
					model: 'CurrencyFk',
					sortable: true,
					label: {
						text: 'Currency(Project)',
						key:	'project.costcodes.currency'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Currency',
						key:	'project.costcodes.currency'
					},
					width: 100,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						readonly: true,
						displayMember: 'Currency',
					})
				},
				{
					id: 'retailprice1',
					model: 'RetailPrice',
					sortable: true,
					label: {
						text: 'Retail Price(Project)',
						key:	'project.material.prjRetailPrice'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Retail Price(Project)',
						key:	'project.material.prjRetailPrice'
					},
					width: 120,
					visible: true,
				},
				{
					id: 'listprice1',
					model: 'ListPrice',
					sortable: true,
					label: {
						text: 'List Price(Project)',
						key:	'project.material.prjListPrice'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'List Price(Project)',
						key:	'project.material.prjListPrice'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'discount1',
					model: 'Discount',
					sortable: true,
					label: {
						text: 'Discount(Project)',
						key:	'project.material.prjDiscount'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Discount(Project)',
						key:	'project.material.prjDiscount'
					},
					width: 100,
					visible: true
				},
				{
					id: 'charges1',
					model: 'Charges',
					sortable: true,
					label: {
						text: 'Charges(Project)',
						key:	'project.material.prjCharges'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Charges(Project)',
						key:	'project.material.prjCharges'
					},
					width: 100,
					visible: true,
					required: true
				},
				{
					id: 'cost1',
					model: 'Cost',
					sortable: true,
					label: {
						text: 'Cost(Project)',
						key:	'project.material.prjCost'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Cost(Project)',
						key:	'project.material.prjCost'
					},
					width: 100,
					visible: true
				},
				{
					id: 'priceunit1',
					model: 'PriceUnit',
					sortable: true,
					label: {
						text: 'Price Unit(Project)',
						key:	'project.material.prjPriceUnit'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Price Unit(Project)',
						key:	'project.material.prjPriceUnit'
					},
					width: 100,
					visible: true
				},
				{
					id: 'basuompriceunitfk1',
					model: 'BasUomPriceUnitFk',
					sortable: true,
					label: {
						text: 'Uom PriceUnit(Project)',
						key:	'project.material.prjBasUomPriceUnitFk'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Uom PriceUnit(Project)',
						key:	'project.material.prjBasUomPriceUnitFk'
					},
					width: 100,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						readonly: true
					}),
				},
				{
					id: 'priceextra1',
					model: 'PriceExtra',
					sortable: true,
					label: {
						text: 'Price Extra(Project)',
						key:	'project.material.prjPriceExtra'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Price Extra(Project)',
						key:	'project.material.prjPriceExtra'
					},
					width: 100,
					visible: true
				},
				{
					id: 'factorpriceunit1',
					model: 'FactorPriceUnit',
					sortable: true,
					label: {
						text: 'Factor Price Unit(Project)',
						key:	'project.material.prjFactorPriceUnit'
					},
					type: FieldType.Money,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Factor Price Unit(Project)',
						key:	'project.material.prjFactorPriceUnit'
					},
					width: 100,
					visible: true
				},
				{
					id: 'prcpriceconditionfk1',
					model: 'PrcPriceconditionFk',
					sortable: true,
					label: {
						text: 'Prc Price Condition(Project)',
						key:	'project.material.prjPrcPriceConditionFk'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Prc Price Condition(Project)',
						key:	'project.material.prjPrcPriceConditionFk'
					},
					width: 100,
					visible: true,
					lookupOptions:  createLookup({
						dataServiceToken: BasicsSharedCostTypeLookupService,
						readonly: true
					}),
				},
				{
					id: 'materialdiscountgroupfk1',
					model: 'MaterialDiscountGroupFk',
					sortable: true,
					label: {
						text: 'Material Discount Group(Project)',
						key:	'project.material.prjMdcMaterialDiscountGroupFk'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Material Discount Group(Project)',
						key:	'project.material.prjMdcMaterialDiscountGroupFk'
					},
					width: 100,
					visible: true,
					required: true,
					lookupOptions:  createLookup({
						dataServiceToken: BasicsSharedMaterialDiscountGroupLookupService,
						readonly: true
					}),
				},
				{
					id: 'mdctaxcodefk1',
					model: 'MdcTaxCodeFk',
					sortable: true,
					label: {
						text: 'Tax Code(Project)',
						key:	'project.material.prjMdcTaxCodeFk'
					},
					type: FieldType.Lookup,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Tax Code(Project)',
						key:	'project.material.prjMdcTaxCodeFk'
					},
					width: 100,
					visible: true,
					lookupOptions:  createLookup({
						dataServiceToken: BasicsSharedCostCodePortionLookupService,
						readonly: true
					}),
				},
				{
					id: 'commenttext1',
					model: 'CommentText',
					sortable: true,
					label: {
						text: 'Comment(Project)',
						key:	'project.material.prjComment'
					},
					type: FieldType.Comment,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Comment(Project)',
						key:	'project.material.prjComment'
					},
					width: 100,
					visible: true
				},
				{
					id: 'estcosttypefk1',
					model: 'EstCostTypeFk',
					sortable: true,
					label: {
						text: 'Cost Type(Project)',
						key:	'project.costcodes.costType'
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken:BasicsSharedCostTypeLookupService,
						readonly: true
					}),
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Cost Type(Project)',
						key:	'project.costcodes.costType'
					},
					width: 100,
					visible: true
				},
				{
					id: 'factorhour1',
					model: 'FactorHour',
					sortable: true,
					label: {
						text: 'Factor Hour(Project)',
						key:	'project.material.factorHour'
					},
					type: FieldType.Factor,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Factor Hour(Project)',
						key:	'project.material.factorHour'
					},
					width: 100,
					visible: true
				},
				{
					id: 'descriptioninfo2',
					model: 'BasCostCode.descriptioninfo2',
					sortable: true,
					label: {
						text: 'Further Description',
						key:	'basics.material.record.furtherDescription'
					},
					type: FieldType.Description,
					readonly: false,
					searchable: true,
					tooltip: {
						text: 'Further Description',
						key:	'basics.material.record.furtherDescription'
					},
					width: 100,
					visible: true
				}
			]
		};
	}
}