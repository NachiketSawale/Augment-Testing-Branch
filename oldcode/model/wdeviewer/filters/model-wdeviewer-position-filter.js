/**
 * Created by wui on 3/20/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).filter('modelWdeViewerPositionFilter', [
		function () {
			return function (value) {
				return value.toFixed(4);
			};
		}
	]);

})(angular);