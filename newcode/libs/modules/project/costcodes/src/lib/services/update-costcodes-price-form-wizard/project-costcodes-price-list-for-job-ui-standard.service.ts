/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { BasicsSharedCurrencyLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
//import { BasicsSharedCurrencyLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, UiCommonGridDialogService, createLookup } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostcodesPriceListForJobUiStandardService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public generateGridConfig(): ColumnDef<PrjCostCodesEntity>[] {
		return [
			{
				type: FieldType.Boolean,
				id: 'selected',
				required: true,
				model: 'IsChecked',
				label: {
					text: 'Checked',
					key: 'project.main.isChecked',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Integer,
				id: 'lgmJobFk',
				required: false,
				model: 'LgmJobFk',
				label: {
					text: 'Job',
					key: 'project.costcodes.lgmJobFk',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Integer,
				id: 'jobdescription',
				required: false,
				model: 'JobDescription',
				label: {
					text: 'Job Description',
					key: 'project.costcodes.lgmJobDescription',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Integer,
				id: 'mdcpricelistfk',
				required: false,
				model: 'MdcPriceListFk',
				label: {
					text: 'Price List',
					key: 'basics.costcodes.priceList.grid.title',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Integer,
				id: 'jobcostcodepriceversionfk',
				required: false,
				model: 'JobCostCodePriceVersionFk',
				label: {
					text: 'Price Version',
					key: 'basics.costcodes.priceVerion.grid.title',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Code,
				id: 'code',
				required: true,
				model: 'Code',
				maxLength: 16,
				label: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Translation,
				id: 'Description',
				required: false,
				model: 'Description',
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				visible: true,
				sortable: true,
			},
			{
				type: FieldType.Code,
				id: 'bascode',
				required: false,
				model: 'BasCode',
				label: {
					text: 'Code(Base)',
					key: 'project.main.updateCostCodeForJob.baseCode',
				},
				visible: true,
				sortable: true,
			},
			// {
			// 	type: FieldType.Translation,
			// 	id: 'basdescriptioninfo',
			// 	required: false,
			// 	model: 'BasDescriptioninfo',
			// 	label: {
			// 		text: 'Description(Base)',
			// 		key: 'project.main.updateCostCodeForJob.baseDescription',
			// 	},
			// 	visible: true,
			// 	sortable: true,
			// },
			{
				type: FieldType.Code,
				id: 'newcode',
				required: false,
				model: 'Newcode',
				label: {
					text: 'Code - New',
					key: 'project.main.updateCostCodeForJob.newCode',
				},
				visible: true,
				sortable: true,
			},
			// {
			// 	type: FieldType.Translation,
			// 	id: 'newdescription',
			// 	required: false,
			// 	model: 'NewDescription',
			// 	label: {
			// 		text: 'Description - New',
			// 		key: 'project.main.updateCostCodeForJob.newDescription',
			// 	},
			// 	visible: true,
			// 	sortable: true,
			// },
			{
				id: 'newrate',
				model: 'NewRate',
				type: FieldType.Integer,
				label: {
					text: 'Rate(New)',
					key: 'project.main.updateCostCodeForJob.newRate',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'dayworkrate',
				model: 'DayWorkRate',
				type: FieldType.Integer,
				label: {
					text: 'DW/T+M Rate(Project)',
					key: 'project.costcodes.dayWorkRate',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'newdayworkrate',
				model: 'NewDayWorkRate',
				type: FieldType.Integer,
				label: {
					text: 'DW/T+M Rate(New)',
					key: 'project.main.updateCostCodeForJob.newDayWorkRate',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'factorcosts',
				model: 'FactorCosts',
				type: FieldType.Integer,
				label: {
					text: 'Factor (Project Costs)',
					key: 'project.costcodes.factorCosts',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'basfactorcosts',
				model: 'BasFactorCosts',
				type: FieldType.Integer,
				label: {
					text: 'Factor(Base Costs)',
					key: 'project.main.updateCostCodeForJob.baseFactorCosts',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'newfactorcosts',
				model: 'NewFactorCosts',
				type: FieldType.Integer,
				label: {
					text: 'FactorCosts(New)',
					key: 'project.main.updateCostCodeForJob.newFactorCosts',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'basrealfactorcosts',
				model: 'BasRealFactorCosts',
				type: FieldType.Integer,
				label: {
					text: 'RealFactorCosts(Base)',
					key: 'project.main.updateCostCodeForJob.baseRealFactorCosts',
				},
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'realfactorcosts',
				model: 'RealFactorCosts',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'Real Factor (Project Costs)',
					key: 'project.costcodes.realFactorCosts',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'newrealfactorcosts',
				model: 'NewRealFactorCosts',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'RealFactorCosts - New',
					key: 'project.main.updateCostCodeForJob.newRealFactorCosts',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'factorquantity',
				model: 'FactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'Factor (Project Quantity)',
					key: 'project.main.updateCostCodeForJob.baseFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'basfactorquantity',
				model: 'BasFactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'FactorQuantity(Base)',
					key: 'project.main.updateCostCodeForJob.baseFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'newfactorquantity',
				model: 'NewFactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'FactorQuantity(New)',
					key: 'project.main.updateCostCodeForJob.newFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'realfactorquantity',
				model: 'RealFactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'RealFactor (Project Quantity)',
					key: 'project.costcodes.realFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'basrealfactorquantity',
				model: 'BasRealFactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'RealFactorQuantity(Base)',
					key: 'project.main.updateCostCodeForJob.baseRealFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'newrealfactorquantity',
				model: 'NewRealFactorQuantity',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'RealFactorQuantity - New',
					key: 'project.main.updateCostCodeForJob.newRealFactorQuantity',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'factorhour',
				model: 'FactorHour',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'Factor (Project Hour)',
					key: 'project.costcodes.factorHour',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'basfactorhour',
				model: 'BasFactorHour',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'FactorHour(Base)',
					key: 'project.main.updateCostCodeForJob.baseFactorHour',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'newfactorhour',
				model: 'NewFactorHour',
				type: FieldType.Integer,
				visible: true,
				label: {
					text: 'FactorHour - New',
					key: 'project.main.updateCostCodeForJob.newFactorHour',
				},
				sortable: false,
				readonly: true,
			},
			{
				id: 'currencyfk',
				model: 'CurrencyFk',
				readonly: true,
				visible: true,
				type: FieldType.Lookup,
				label: {
					text: 'Currency(Project)',
					key: 'project.costcodes.currency',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
				}),
				sortable: false,
			},
			{
				id: 'bascurrencyfk',
				model: 'BasCurrencyFk',
				readonly: true,
				visible: true,
				type: FieldType.Lookup,
				label: {
					text: 'Currency(Base)',
					key: 'project.main.updateCostCodeForJob.baseCurrency',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
				}),
				sortable: false,
			},
			{
				id: 'newcurrencyfk',
				model: 'NewCurrencyFk',
				readonly: true,
				visible: true,
				type: FieldType.Lookup,
				label: {
					text: 'Currency - New',
					key: 'project.main.updateCostCodeForJob.newCurrency',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
				}),
				sortable: false,
			},
			{
				id: 'uomfk',
				model: 'UomFk',
				readonly: true,
				visible: true,
				type: FieldType.Lookup,
				label: {
					text: 'UoM(Project)',
					key: 'project.costcodes.uoM',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				sortable: false,
			},
			{
				id: 'islabour',
				model: 'IsLabour',
				readonly: true,
				visible: true,
				type: FieldType.Boolean,
				label: {
					text: 'IsLabour(Project)',
					key: 'project.costcodes.isLabour',
				},
				sortable: false,
			},
			{
				id: 'israte',
				model: 'IsRate',
				readonly: true,
				visible: true,
				type: FieldType.Boolean,
				label: {
					text: 'IsRate(Project)',
					key: 'project.costcodes.isRate',
				},
				sortable: false,
			},
			{
				id: 'co2source',
				model: 'Co2Source',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Source)',
					key: 'project.main.updateCostCodeForJob.baseCo2Source',
				},
				readonly: true,
				sortable: false,
			},
			{
				id: 'co2project',
				model: 'Co2Project',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Project)',
					key: 'project.main.updateCostCodeForJob.baseCo2Project',
				},
				readonly: true,
				sortable: false,
			},
			{
				id: 'co2sourcefk',
				model: 'Co2SourceFk',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Source Name)',
					key: 'project.main.updateCostCodeForJob.baseCo2SourceFk',
				},
				readonly: true,
				sortable: false,
			},
			{
				id: 'newco2source',
				model: 'NewCo2Source',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Source) - New',
					key: 'project.main.updateCostCodeForJob.newCo2Source',
				},
				readonly: true,
				sortable: false,
			},
			{
				id: 'newco2project',
				model: 'NewCo2Project',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Project) - New',
					key: 'project.main.updateCostCodeForJob.newCo2Project',
				},
				readonly: true,
				sortable: false,
			},
			{
				id: 'newco2sourcefk',
				model: 'NewCo2SourceFk',
				visible: true,
				type: FieldType.Integer,
				label: {
					text: 'CO2/kg (Source Name) - New',
					key: 'project.main.updateCostCodeForJob.newCo2SourceFk',
				},
				readonly: true,
				sortable: false,
			},
		];
	}
}
