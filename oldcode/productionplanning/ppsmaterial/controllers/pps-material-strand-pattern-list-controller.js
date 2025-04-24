

(function(angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';

	angular.module(moduleName).controller('ppsMaterialStrandPatternListController', PpsMaterialStrandPatternListController);

	PpsMaterialStrandPatternListController.$inject = ['$scope', 'platformGridControllerService', 'ppsMaterialStrandPatternDataService', 'ppsMaterialStrandPatternReadOnlyUIStandardService'];

	function PpsMaterialStrandPatternListController($scope, gridControllerService,
		dataService,
		uiStandardService) {

		var gridConfig = { initCalled: false, columns: [] };

		gridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);

		$scope.$on('$destroy', function() {

		});
	}

})(angular);