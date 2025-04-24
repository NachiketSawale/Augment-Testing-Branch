(function () {
	'use strict';
	var moduleName = 'procurement.contract';
	angular.module(moduleName).controller('procurementContractProjectChangeController', PrcContractProjectChangeController);

	PrcContractProjectChangeController.$inject = ['$scope', 'platformGridControllerService', 'changeMainContractChangeDataService',
		'changeMainConfigurationService', 'changeMainValidationService'];

	function PrcContractProjectChangeController($scope, platformGridControllerService, dataService, columnsService, validationService) {
		platformGridControllerService.initListController($scope, columnsService, dataService, validationService, {});
	}
})();
