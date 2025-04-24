/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { BasicsCostCodesPriceListSelectionLookupService, BasicsCostCodesPriceVersionLookupService, BasicsSharedCurrencyLookupService } from '@libs/basics/shared';
import { ColumnDef, FieldType, createLookup } from '@libs/ui/common';
@Injectable({
	providedIn: 'root',
})

export class ProjectCostcodesPriceListRecordUiStandardService {

	public generateGridConfig(): ColumnDef<PrjCostCodesEntity>[] {
		return [
			{
				type: FieldType.Boolean,
				id: 'selected',
				required: true,
				model: 'Selected',
				label: {
					text: 'Checked',
					key: 'project.main.isChecked',
				},
				visible: true,
				sortable: true,
			},
			{
                id: 'priceListFk',
                model: 'PriceListFk',
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCostCodesPriceListSelectionLookupService
                }),
                label: {
                    text: 'Price List',
                    key: 'basics.costcodes.priceList.grid.title'
                },
                width: 120,
                visible: true,
                sortable: false,
                readonly: true
            },
            {
                id:'priceversionfk',
                model:'PriceVersionFk',
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCostCodesPriceVersionLookupService
                }),
                label: {
                    text: 'Price Version',
                    key: 'basics.costcodes.priceVerion.grid.title'
                },
                width: 120,
                visible: true,
                sortable: false,
                readonly: true
            },
			{
                id:'rate',
                model:'Rate',
                type: FieldType.Integer,
                label: {
                    text: 'Rate',
                    key: 'project.costcodes.rate'
                },
                visible: true,
                sortable: false,
                readonly: true,              
            },
            {
                id:'salesprice',
                model:'SalesPrice',
                type: FieldType.Integer,
                sortable: false,
                visible: true,
                label: {
                    text: 'Sales Price',
                    key: 'basics.costcodes.priceList.salesPrice'
                },
                readonly: true
            },
            {
                id:'factorcosts',
                model:'FactorCosts',
                type: FieldType.Integer,
                visible: true,
                label: {
                    text: 'Factor (Project Costs)',
                    key: 'project.costcodes.factorCosts'
                },
                sortable: false,
                readonly: true
            },
            {
                id:'factorquantity',
                model:'FactorQuantity',
                type: FieldType.Integer,
                visible: true,
                label: {
                    text: 'Factor Quantity',
                    key: 'project.costcodes.factorQuantity'
                },
                sortable: false,
                readonly: true
            },
            {
                id:'realfactorcosts',
                model:'RealFactorCosts',
                type: FieldType.Integer,
                visible: true,
                label: {
                    text: 'Real Factor (Project Costs)',
                    key: 'project.costcodes.realFactorCosts'
                },
                sortable: false,
                readonly: true
            },
            {
                id:'realfactorquantity',
                model:'RealFactorQuantity',
                type: FieldType.Integer,
                visible: true,
                label: {
                    text: 'RealFactor (Project Quantity)',
                    key: 'project.costcodes.realFactorQuantity'
                },
                sortable: false,
                readonly: true
            },
            {
                id:'factorhour',
                model:'FactorHour',
                type: FieldType.Integer,
                visible: true,
                label: {
                    text: 'Factor (Project Hour)',
                    key: 'project.costcodes.factorHour'
                },
                sortable: false,
                readonly: true
            },
            {
                id:'currencyfk',
                model:'CurrencyFk',
                readonly: true,
                visible: true,
                type: FieldType.Lookup,
                label: {
                    text: 'Currency',
                    key: 'project.costcodes.currency'
                },
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedCurrencyLookupService,
                }),
                sortable: false,
            },
            {
                id:'validfrom',
                model:'ValidFrom',
                visible: true,
                label: {
                    text: 'Valid From',
                    key: 'basics.costcodes.priceVerion.validfrom'
                },
                type: FieldType.Date,
                sortable: false,
                readonly: true               
            },
            {
                id:'validto',
                model:'ValidTo',
                sortable: false,
                visible: true,
                label: {
                    text: 'Valid To',
                    key: 'basics.costcodes.priceVerion.validTo'
                },
                type: FieldType.Date,
                readonly: true,
            },
            {
                id:'weighting',
                model:'Weighting',
                visible: true,
                label: {
                    text: 'Weighting',
                    key: 'basics.costcodes.priceVerion.weighting'
                },
                type: FieldType.Integer,
                sortable: false           
            },
            {
                id:'co2source',
                model:'Co2Source',
                visible: true,
                type: FieldType.Integer,
                label: {
                    text: 'CO2/kg (Source)',
                    key: 'project.main.updateCostCodeForJob.baseCo2Source'
                },
                readonly: true,
                sortable: false,
            },
            {
                id:'co2project',
                model:'Co2Project',
                visible: true,
                type: FieldType.Integer,
                label: {
                    text: 'CO2/kg (Project)',
                    key: 'project.main.updateCostCodeForJob.baseCo2Project'
                },
                readonly: true,
                sortable: false
            },
            {
                id:'co2sourcefk',
                model:'Co2SourceFk',
                visible: true,
                type: FieldType.Integer,
                label: {
                    text: 'CO2/kg (Source Name)',
                    key: 'project.main.updateCostCodeForJob.baseCo2SourceFk'
                },
                readonly: true,
                sortable: false
            }
		];
	}	
}
