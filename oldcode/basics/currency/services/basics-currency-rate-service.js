/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName= 'basics.currency';
	var currencyModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsCurrencyRateService
	 * @function
	 * @description
	 * basicsCurrencyRateService is the data service for Currency Rate related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	currencyModule.factory('basicsCurrencyRateService', ['basicsCurrencyConversionService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (basicsCurrencyConversionService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
			var basicsCurrencyRateServiceOption = {
				flatLeafItem: {
					module: currencyModule,
					httpCreate: { route: globals.webApiBaseUrl + 'basics/currency/rate/', endCreate: 'create' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/currency/rate/', endRead:'list' },
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/currency/',  endUpdate:'update' },
					entityRole: { leaf: { itemName: 'CurrencyRate', parentService: basicsCurrencyConversionService  } },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CurrencyRateDto',
						moduleSubModule: 'Basics.Currency'
					})],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem =  basicsCurrencyConversionService.getSelected();
								creationData.CurrencyConversionFk = selectedItem.Id;
								creationData.CurrencyHomeFk = selectedItem.CurrencyHomeFk;
								creationData.CurrencyForeignFk = selectedItem.CurrencyForeignFk;
								creationData.Basis = selectedItem.Basis;

							},
							isInitialSorted:true,
							sortOptions: {initialSortColumn: {field: 'CurrencyRateTypeFk', id: 'ratetype'}, isAsc: true}
						}
					}
				} };
			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCurrencyRateServiceOption);

			return serviceContainer.service;
		}
	]);
})(angular);
