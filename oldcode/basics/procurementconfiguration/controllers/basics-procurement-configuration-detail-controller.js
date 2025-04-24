/**
 * Created by wuj on 9/1/2015.
 */
(function (angular) {

	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).controller('basicsProcurementConfigurationFormController',
		['$scope','platformDetailControllerService', 'basicsProcurementConfigurationDataService',
			'basicsProcurementConfigurationValidationService', 'basicsProcurementConfigurationUIStandardService',
			'platformTranslateService','$injector','platformFormConfigService','basicsCharacteristicDataServiceFactory','$timeout',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService,
					  $injector,platformFormConfigService,basicsCharacteristicDataServiceFactory,$timeout) {
				var containerInfoService = $injector.get('basicsProcurementConfigurationContainerInformationService');
				var gridContainerGuid = 'ecf49aee59834853b0f78ee871676e38';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 55, gridContainerGuid,containerInfoService);
				$scope.change = function(entity, field, column){
					characterColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 55);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);
			}]);
})(angular);
