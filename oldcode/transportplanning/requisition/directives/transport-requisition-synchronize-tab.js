/**
 * Created by anl on 11/28/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).directive('transportplanningRequisitionSynchronizeTab', ['platformGridAPI',
		function (platformGridAPI) {
			return {
				restrict: 'A',
				scope: {
					setting: '='
				},
				templateUrl: globals.appBaseUrl + 'transportplanning.transport/partials/transportplanning-transport-goods-tab.html',
				link: linker
			};

			function linker(scope) {
				function updateState() {
					// To ensure that the toolbar is updated.
					scope.$evalAsync();
				}

				platformGridAPI.events.register(scope.setting.grid.state, 'onSelectedRowsChanged', updateState);

				scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(scope.setting.grid.state, 'onSelectedRowsChanged', updateState);
				});
			}
		}]);
})(angular);