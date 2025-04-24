(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for rfq header form container (leading detail container).
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRfqMainService', 'procurementRfqHeaderUIStandardService', 'platformTranslateService', 'procurementRfqHeaderValidationService',
			'modelViewerStandardFilterService', '$injector', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, myInitService, dataService, columnsService, translateService, validationService,
				modelViewerStandardFilterService, $injector, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout,procurementCommonCreateButtonBySystemOptionService) {

				var containerInfoService = $injector.get('procurementRfqContainerInformationService');
				var gridContainerGuid = '037c70c17687481a88c726b1d1f82459';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 52, gridContainerGuid.toUpperCase(), containerInfoService);
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 52);

				myInitService.initDetailController($scope, dataService, validationService(dataService), columnsService, translateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementRfqMainService');
				procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create']);
			}
		]);
})(angular);