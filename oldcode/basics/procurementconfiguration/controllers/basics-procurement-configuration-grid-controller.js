/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigurationGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfigurationDataService', 'platformToolbarService',
			'basicsProcurementConfigurationValidationService', 'basicsProcurementConfigurationUIStandardService','$injector',
			'platformGridAPI','$timeout',
			function ($scope, gridControllerService, dataService, platformToolbarService, validationService, uiService,$injector,platformGridAPI,
					  $timeout) {
				var containerInfoService = $injector.get('basicsProcurementConfigurationContainerInformationService');
				var gridContainerGuid = 'ecf49aee59834853b0f78ee871676e38';
				var gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 55, gridContainerGuid,containerInfoService);
						if (characterColumnService) {
							var column = arg.grid.getColumns()[arg.cell];
							var field = arg.grid.getColumns()[arg.cell].field;
							characterColumnService.fieldChange(arg.item, field, column);
						}
					}
				};

				platformToolbarService.removeTools($scope.getContainerUUID());

				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);

				//handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 55, gridContainerGuid,containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 55);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

			}]);

})(angular);