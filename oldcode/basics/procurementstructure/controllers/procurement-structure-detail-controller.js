(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementStructureDetailController',
		['$scope', 'basicsProcurementStructureUIStandardService', 'basicsProcurementStructureService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsProcurementStructureValidationService','$injector','basicsCharacteristicDataServiceFactory',
			'platformFormConfigService','$timeout',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService,$injector,basicsCharacteristicDataServiceFactory,
					  platformFormConfigService,$timeout) {
				var containerInfoService = $injector.get('basicsProcurementstructureContainerInformationService');
				var gridContainerGuid = 'a59c90cf86d14abe98df9cb8601b22a0';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 54, gridContainerGuid,containerInfoService);
				$scope.change = function(entity, field, column){
					characterColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 54);

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

			}]);
})(angular);