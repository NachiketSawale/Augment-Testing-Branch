/**
 * Created by Naim on 3/12/2018.
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateChartDialogTreeRootImageProcessor
	 * @function
	 *
	 * @description
	 * estimateChartDialogTreeRootImageProcessor is the data service for cost code dialog
	 */
	angular.module(moduleName).factory('estimateChartDialogTreeRootImageProcessor',
		[function () {

			let service = {};

			service.processItem = function processItem(entity) {
				if (entity) {
					entity.image = 'ico-folder-assemblies';
				}
			};

			return service;
		}
		]);
})();
