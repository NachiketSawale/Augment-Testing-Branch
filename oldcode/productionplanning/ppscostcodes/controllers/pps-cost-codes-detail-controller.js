(angular => {
	'use strict';
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName).controller('ppsCostCodesDetailController', ppsCostCodesDetailController);

	ppsCostCodesDetailController.$inject = ['$scope', 'platformContainerControllerService', 'ppsCostCodesConstantValues', 'ppsCostCodesTranslationService', 'ppsCostCodesDataService'];

	function ppsCostCodesDetailController($scope, platformContainerControllerService, ppsCostCodesConstantValues, ppsCostCodesTranslationService, ppsCostCodesDataService) {
		platformContainerControllerService.initController($scope, moduleName, ppsCostCodesConstantValues.uuid.container.costCodeDetail, ppsCostCodesTranslationService);

		$scope.change = function (entity, field) {
			ppsCostCodesDataService.onPropertyChanged(entity, field);
		};
	}
})(angular);