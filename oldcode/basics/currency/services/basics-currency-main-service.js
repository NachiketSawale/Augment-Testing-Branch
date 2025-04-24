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
	 * @name basicsCurrencyMainService
	 * @function
	 *
	 * @description
	 * basicsCurrencyMainService is the data service for all currency related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection

	currencyModule.factory('basicsCurrencyMainService', ['platformDataServiceFactory',
		function (platformDataServiceFactory) {

			// The instance of the main service - to be filled with functionality below
			var basicsCurrencyMainServiceOptions = {
				flatRootItem: {
					module: currencyModule,
					serviceName: 'basicsCurrencyMainService',
					httpCRUD: {route: globals.webApiBaseUrl + 'basics/currency/'},
					entityRole: {
						root:
							{
								rootForModule: moduleName,
								codeField: 'Currency',
								descField: 'Description',
								itemName: 'Currency',
								moduleName: 'cloud.desktop.moduleDisplayNameCurrency',
								addToLastObject: true,
								lastObjectModuleName: 'estimate.main'
							}
					},
					entitySelection: {},
					presenter: {
						list: {
							isInitialSorted: true,
							sortOptions: {initialSortColumn: {field: 'Currency', id: 'currency'}, isAsc: true}
						}
					},
					translation: {
						uid: 'basicsCurrencyMainService',
						title: 'basics.currency.Currency',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'CurrencyDto', moduleSubModule: 'Basics.Currency' }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCurrencyMainServiceOptions);

			serviceContainer.service.load();

			return serviceContainer.service;
		}]);
})(angular);
