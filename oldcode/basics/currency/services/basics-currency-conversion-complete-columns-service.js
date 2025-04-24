/**
 * Created by joshi on 24.11.2014.
 */
(function (angular) {
	'use strict';

	var modulename = 'basics.currency';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionColumnsService
	 * @description basicsCurrencyConversionColumnsService defines clolumns of currency conversion grid
	 */
	angular.module(modulename).factory('basicsCurrencyConversionColumnsService', [function () {

		var service = {};

		var gridCols = [
			{
				id: 'CurrencyHomeFk',
				field: 'CurrencyHomeFk',
				name$tr$: 'basics.currency.HomeCurrency',
				formatter: Slick.Formatters.LookupFormatter,
				formatterOptions: {
					lookupType: 'currencyconversionlookup',
					displayMember: 'Currency'
				},
				width: 80
			},
			{
				id: 'CurrencyHomeNameFk',
				field: 'CurrencyHomeFk',
				name$tr$: 'basics.currency.HomeCurrencyName',
				formatter: Slick.Formatters.LookupFormatter,
				formatterOptions: {
					lookupType: 'currencyconversionlookup',
					displayMember: 'DescriptionInfo.Translated'
				},
				width: 150
			},
			{
				id: 'CurrencyForeignFk',
				field: 'CurrencyForeignFk',
				name$tr$: 'basics.currency.ForeignCurrency',
				formatter: Slick.Formatters.LookupFormatter,
				formatterOptions: {
					lookupType: 'currencyconversionlookup',
					displayMember: 'Currency'
				},
				width: 80
			},
			{
				id: 'CurrencyForeignNameFk',
				field: 'CurrencyForeignFk',
				name$tr$: 'basics.currency.ForeignCurrencyName',
				formatter: Slick.Formatters.LookupFormatter,
				formatterOptions: {
					lookupType: 'currencyconversionlookup',
					displayMember: 'DescriptionInfo.Translated'
				},
				width: 150
			},
			{
				id: 'basis',
				field: 'Basis',
				name: 'Basis',
				name$tr$: 'basics.currency.Basis',
				editor: Slick.Editors.InputNumber,
				width: 70
			},
			{
				id: 'comment',
				field: 'Comment',
				name: 'Comment',
				name$tr$: 'cloud.common.entityComment',
				editor: Slick.Editors.TextInput,
				width: 200
			}
		];

		service.getStandardConfigForListView = function () {

			return {columns: gridCols};

		};
		return service;
	}
	]);

})(angular);

