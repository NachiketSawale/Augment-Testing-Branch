(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).filter('modelWdeViewerLegendFilter', [
		function () {
			return function (legend) {
				let result = legend.value.toFixed(2);

				if (legend.uom) {
					result += ' ' + legend.uom.toLocaleString();
				}

				return result;
			};
		}
	]);

})(angular);