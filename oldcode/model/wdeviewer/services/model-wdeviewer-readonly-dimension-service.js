/**
 * readonly 2D viewer dimension service.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerReadonlyDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		function (modelWdeViewerDimensionServiceFactory) {
			var options = {
				readonly: true,
				disableHeaderFilter: true
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

	angular.module(moduleName).factory('modelWdeViewerWdeReadonlyDimensionService', [
		'modelWdeViewerDimensionServiceFactory',
		function (modelWdeViewerDimensionServiceFactory) {
			var options = {
				readonly: true,
				disableHeaderFilter: true
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

})(angular);