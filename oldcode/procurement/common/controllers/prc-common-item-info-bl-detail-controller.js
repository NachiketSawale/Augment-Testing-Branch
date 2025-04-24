(function(angular){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonItemInfoBlDetailController', procurementCommonItemInfoBlDetailController);

	procurementCommonItemInfoBlDetailController.$inject = ['$scope', 'platformTranslateService', 'platformDetailControllerService', 'procurementCommonPrcItemInfoBlUIStandardService',
		'procurementCommonItemInfoBlDataService', 'procurementContextService', 'procurementCommonPrcItemDataService'];

	function procurementCommonItemInfoBlDetailController($scope, platformTranslateService, platformDetailControllerService, procurementPrcItemInfoBlUIStandardService,
		procurementCommonItemInfoBlDataService, procurementContextService, procurementCommonPrcItemDataService){

		var mainService = procurementContextService.getMainService();
		var parentDataService = procurementCommonPrcItemDataService.getService(mainService);

		var dataService = procurementCommonItemInfoBlDataService.getService(parentDataService);



		platformDetailControllerService.initDetailController($scope, dataService, {},
			procurementPrcItemInfoBlUIStandardService, platformTranslateService);

	}

})(angular);