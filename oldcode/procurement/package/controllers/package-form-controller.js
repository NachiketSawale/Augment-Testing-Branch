/**
 * Created by wwa on 8/11/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageFormController',
		['$scope', 'platformDetailControllerService', 'procurementPackageDataService', 'procurementPackageValidationService', 'procurementPackageUIStandardExtendedService', 'platformTranslateService',
			'modelViewerStandardFilterService', '$injector', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService,
				modelViewerStandardFilterService, $injector, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout,procurementCommonCreateButtonBySystemOptionService) {

				uiService.extendExtraColumns();
				uiService.extendExtraRows();

				var containerInfoService = $injector.get('procurementPackageContainerInformationService');
				var gridContainerGuid = '1d58a4da633a485981776456695e3241';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 48, gridContainerGuid.toUpperCase(), containerInfoService);
				// $scope.change = function(entity, field, column){
				// characterColumnService.fieldChange(entity, field, column);
				// };
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 48);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);


				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementPackageDataService');
				procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create']);
			}]);

})(angular);