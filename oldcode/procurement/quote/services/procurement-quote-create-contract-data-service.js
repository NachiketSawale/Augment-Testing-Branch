/**
 * Created by lst on 1/20/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.quote';

	/**
	 * @ngdoc service
	 * @name procurementQuoteCreateContractDataService
	 * @function
	 * @requires procurementQuoteHeaderDataService
	 *
	 * @description
	 * #
	 * data service
	 */
	angular.module(moduleName).factory('procurementQuoteCreateContractDataService', [
		'platformDataServiceFactory', 'procurementQuoteHeaderDataService',
		function (platformDataServiceFactory, procurementQuoteHeaderDataService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementQuoteCreateContractDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/quote/header/',
					endRead: 'getnewestquotes',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var currentQuoteItem = procurementQuoteHeaderDataService.getSelected();
						readData.Value = currentQuoteItem.Id;
					}
				},
				dataProcessor: [],
				presenter: {list: {}},
				entitySelection: {}
			};

			return platformDataServiceFactory.createNewComplete(serviceOption).service;
		}
	]);
})(angular);
