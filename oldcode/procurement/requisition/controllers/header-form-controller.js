(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementRequisitionHeaderFormController
	 * @require $scope, procurementRequisitionHeaderDataService, procurementRequisitionHeaderUIStandardService, reqHeaderElementValidationService,  lookupDataService, modelViewerStandardFilterService
	 * @description controller for requisition header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').controller('procurementRequisitionHeaderFormController',
		['$scope', 'procurementRequisitionHeaderDataService', 'platformDetailControllerService', 'procurementRequisitionHeaderUIStandardService',
			'procurementRequisitionHeaderValidationService', 'platformTranslateService',
			'modelViewerStandardFilterService', '$injector', 'basicsCharacteristicDataServiceFactory',
			'platformFormConfigService', '$timeout','procurementCommonCreateButtonBySystemOptionService',

			function ($scope, dataService, platformDetailControllerService, formConfig, validationService, platformTranslateService,
				modelViewerStandardFilterService, $injector, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout,procurementCommonCreateButtonBySystemOptionService/* , procurementCommonHelperService */) {
				let containerInfoService = $injector.get('procurementRequisitionContainerInformationService');
				let gridContainerGuid = '509f8b1f81ea475fbebf168935641489';
				let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 51, gridContainerGuid.toUpperCase(), containerInfoService);
				$scope.change = function (entity, field, column) {
					characterColumnService.fieldChange(entity, field, column);
				};
				let characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 51);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);


				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

				// binding module readOnly handler
				// var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				// moduleReadOnlyStatusHandler.bindFormReadOnlyListener($scope.formOptions.configure);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementRequisitionHeaderDataService');
				procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create']);
			}
		]);
})(angular);