(function (angular) {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemCopyProjectLocationController', controller);
	controller.$inject = ['$scope', 'platformGridAPI', 'productionplanningItemCopyProjectLocationService'];

	function controller($scope, platformGridAPI, copyProjectLocationService) {
		copyProjectLocationService.initial($scope);

		let gridId = $scope.gridOptions.locationGrid.id;
		platformGridAPI.events.register(gridId, 'onInitialized', copyProjectLocationService.onInitialized);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister(gridId, 'onInitialized', copyProjectLocationService.onInitialized);
		});
	}
})(angular);