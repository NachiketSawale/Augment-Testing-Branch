(function(angular){

	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonItemInfoBlGridController', procurementCommonItemInfoBlGridController);

	procurementCommonItemInfoBlGridController.$inject = ['$scope', 'platformGridControllerService', 'procurementContextService', 'procurementCommonPrcItemDataService',
		'procurementCommonItemInfoBlDataService', 'procurementCommonPrcItemInfoBlUIStandardService'];

	function procurementCommonItemInfoBlGridController($scope, platformGridControllerService, procurementContextService, procurementCommonPrcItemDataService,
		procurementCommonItemInfoBlDataService, procurementPrcItemInfoBlUIStandardService){

		var mainService = procurementContextService.getMainService();
		var parentDataService = procurementCommonPrcItemDataService.getService(mainService);

		var dataService = procurementCommonItemInfoBlDataService.getService(parentDataService);


		var myGridConfig = {
			initCalled: false,
			columns: []
		};

		platformGridControllerService.initListController($scope, procurementPrcItemInfoBlUIStandardService, dataService, {}, myGridConfig);

	}

})(angular);