


(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).controller('ppsDrawingPickComponentsController', controller);
	controller.$inject = ['$scope', '$options', 'ppsDrawingPickComponentsService', 'platformGridAPI', 'platformToolbarBtnService'];

	function controller($scope, $options, ppsItemCreateSubPUsService, platformGridAPI, platformToolbarBtnService) {

		ppsItemCreateSubPUsService.initial($scope, $options); //set grid to $scope
		$scope.gridId = $scope.grid.id; //set gridId for tools' function
		$scope.toggleFilter = function (active, clearFilter) {
			platformGridAPI.filters.showSearch($scope.gridId, active, clearFilter);
		};

		$scope.$on('$destroy', function () {

		});

		setTimeout(function () {
			platformGridAPI.grids.resize($scope.grid.state);
		}, 200);
	}

})(angular);