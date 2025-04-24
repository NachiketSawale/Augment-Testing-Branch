(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name cloud.desktop.directive:cloudDesktopDesktopLayoutGrid
	 * @element div
	 * @restrict A
	 * @priority default value
	 * @description
	 * Insert a grid for the desktop layout formular
	 */
	angular.module('cloud.desktop').directive('cloudDesktopDesktopLayoutGrid', ['platformGridAPI',
		function (platformGridAPI) {
			return {

				restrict: 'A',
				scope: {
					options: '=',
					gridData: '=ngModel'
				},
				templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/desktop-layout-grid-template.html',
				link: linker
			};

			function linker(scope) {
				function updateState() {
					// To ensure that the toolbar is updated.
					scope.$evalAsync();
				}

				platformGridAPI.events.register(scope.options.gridId, 'onSelectedRowsChanged', updateState);

				scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(scope.options.gridId, 'onSelectedRowsChanged', updateState);
				});
			}
		}]);
})(angular);
