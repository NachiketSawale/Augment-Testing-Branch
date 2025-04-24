/**
 * Created by wui on 4/13/2015.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopInfoPanel', [function () {

		return {
			restrict: 'A',
			scope: {
				model: '=',
				header: '=',
				toolbar: '='
			},
			transclude: true,
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/info-panel.html'
		};

	}]);

})(angular);