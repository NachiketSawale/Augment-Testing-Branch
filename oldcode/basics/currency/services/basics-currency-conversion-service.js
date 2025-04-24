/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.currency';
	var currencyModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionService
	 * @function
	 * @description
	 * basicsCurrencyConversionService is the data service for Currency Conversion related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	currencyModule.factory('basicsCurrencyConversionService', ['basicsCurrencyMainService', 'platformDataServiceFactory',
		function (basicsCurrencyMainService, platformDataServiceFactory) {

			// The instance of the main service - to be filled with functionality below
			var basicsCurrencyConversionServiceOption = {
				flatNodeItem: {
					module: currencyModule,
					serviceName: 'basicsCurrencyConversionService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/currency/conversion/', endCreate: 'create'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/currency/conversion/', endRead: 'list'},
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/currency/', endUpdate: 'update'},
					entitySelection: {},
					entityRole: {node: {itemName: 'CurrencyConversion', parentService: basicsCurrencyMainService}},
					presenter: {
						list: {
							isInitialSorted: true,
							sortOptions: {
								initialSortColumn: {field: 'CurrencyForeignFk', id: 'CurrencyForeignFk'},
								isAsc: true
							}
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCurrencyConversionServiceOption);

			return serviceContainer.service;
		}]);
})(angular);
