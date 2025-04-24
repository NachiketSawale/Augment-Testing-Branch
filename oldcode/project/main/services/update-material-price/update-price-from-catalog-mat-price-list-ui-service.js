/**
 * Created by chi on 1/7/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogPriceListUIService', projectMainUpdatePriceFromCatalogPriceListUIService);

	projectMainUpdatePriceFromCatalogPriceListUIService.$inject = [];

	function projectMainUpdatePriceFromCatalogPriceListUIService() {
		var columns = [
			{
				id: 'selected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'project.main.selected',
				editor: 'boolean',
				formatter: 'boolean',
				width: 75,
				headerChkbox: true
			},
			{
				id: 'priceVersion',
				field: 'PriceVersion',
				name: 'Version',
				name$tr$: 'project.main.priceVersion',
				formatter: 'description',
				width: 80
			},
			{
				id: 'priceList',
				field: 'PriceList',
				name: 'Price List',
				name$tr$: 'project.main.priceListTypePriceList',
				formatter: 'description',
				width: 80
			},
			{
				id: 'currencyFk',
				field: 'CurrencyFk',
				name: 'Currency',
				name$tr$: 'cloud.common.entityCurrency',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'currency',
					displayMember: 'Currency'
				},
				width: 100
			},
			{
				id: 'estimatePrice',
				field: 'EstimatePrice',
				name: 'Estimate Price',
				name$tr$: 'project.main.estimatePrice',
				width: 100,
				formatter: 'money',
				sortable: true
			},
			{
				id: 'dayworkRate',
				field: 'DayworkRate',
				name: 'DW/T+M Rate',
				name$tr$: 'project.main.priceListDayworkRate',
				width: 100,
				formatter: 'money',
				sortable: true
			},
			{
				id: 'validFrom',
				field: 'ValidFrom',
				name: 'Valid From',
				name$tr$: 'project.main.validFrom',
				width: 100,
				formatter: 'date'
			},
			{
				id: 'validTo',
				field: 'ValidTo',
				name: 'Valid To',
				name$tr$: 'project.main.validTo',
				width: 100,
				formatter: 'date'
			},
			{
				id: 'weighting',
				field: 'Weighting',
				name: 'Weighting',
				name$tr$: 'project.main.weighting',
				width: 100,
				formatter: 'integer',
				editor: 'integer'
			},
			{
				id: 'factorHour',
				field: 'FactorHour',
				name: 'Factor Hour',
				name$tr$: 'project.main.factorHour',
				formatter: 'factor'
			},
			{
				id: 'Co2Project',
				field: 'Co2Project',
				name: 'CO2/kg (Project)',
				name$tr$: 'procurement.common.entityCo2Project',
				width: 100,
				formatter: 'money',
				readonly: true
			},
			{
				id: 'Co2Source',
				field: 'Co2Source',
				name: 'CO2/kg (Source)',
				name$tr$: 'procurement.common.entityCo2Source',
				width: 100,
				formatter: 'money',
				readonly: true
			},
			{
				id: 'co2SourceFk',
				field: 'Co2SourceFk',
				name: 'CO2/kg (Source Name)',
				name$tr$: 'basics.material.record.entityBasCo2SourceFk',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'co2sourcename',
					displayMember: 'DescriptionInfo.Translated',
					version: 3
				},
				width: 100
			}
		];
		return {
			getStandardConfigForListView: getStandardConfigForListView
		};

		///////////////////////////////////
		function getStandardConfigForListView() {
			return {
				fid: 'project.main.update.price.price.list',
				version: '1.0.0',
				columns: columns,
				addValidationAutomatically: true
			};
		}
	}
})(angular);
