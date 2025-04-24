/**
 * Created by Naim on 11.12.2017.
 */

/* global globals */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeChartDataService
	 * @function
	 *
	 * @description
	 * estimateMainCostCodeChartDataService is the data service for cost code functionality.
	 */
	angular.module(moduleName).factory('estimateMainCostCodeChartDataService', ['platformDataServiceFactory',
		function (platformDataServiceFactory) {

			let estimateMainCostCodeChartValidationServiceOptions = {
				module: estimateMainModule,
				serviceName: 'estimateMainCostCodeChartValidationService',
				entityNameTranslationID: 'estimate.main.costCodeContainer',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/costcodes/',
					endRead: 'getparents'
				},
				entitySelection: {supportsMultiSelection: true},
				dataProcessor: [{
					processItem: function (item) {
						item.Color = 705623; // Default green
					}
				}],
				presenter: {
					list: {
						isInitialSorted: true,
						sortOptions: {initialSortColumn: {field: 'DescriptionInfo', id: 'descriptioninfo'}, isAsc: true}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainCostCodeChartValidationServiceOptions);

			let service = serviceContainer.service;


			return service;
		}]);
})();
