/**
 * Created by lnt on 04.08.2024
 */

(function () {
	/*global _, angular*/
	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainPlantUiTotalsService
	 * @description
	 */
	angular.module(modulename).factory('estimateMainPlantUiTotalsService',
		['estimateMainCommonUIService', 'estimateCommonDynamicConfigurationServiceFactory',
			function (estimateMainCommonUIService, estimateCommonDynamicConfigurationServiceFactory) {

				let uiService = estimateMainCommonUIService.createUiService(['PlantCode', 'Description']);

				// disable column sorting
				let columns = uiService.getStandardConfigForListView().columns;
				_.each(columns, function (col) {
					col.sortable = false;
				});

				return estimateCommonDynamicConfigurationServiceFactory.getService(uiService);
			}

		]);

})();