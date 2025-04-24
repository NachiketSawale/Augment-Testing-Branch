(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* global _ */
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementContractHeaderFormController
	 * @require $scope, procurementContractHeaderDataService, messengerService, procurementContractHeaderFormConfigurations, contractHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService,
	 *          modelViewerStandardFilterService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').controller('procurementContractHeaderFormController',
		['$scope', 'procurementContractHeaderDataService', 'platformDetailControllerService',
			'contractHeaderElementValidationService', 'procurementContractHeaderUIStandardService', 'platformTranslateService',
			'modelViewerStandardFilterService','basicsCharacteristicDataServiceFactory','$injector','platformFormConfigService','prcContractBillingSchemaDataService','$timeout','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService,
				modelViewerStandardFilterService,basicsCharacteristicDataServiceFactory,$injector,platformFormConfigService,prcContractBillingSchemaDataService,$timeout,procurementCommonCreateButtonBySystemOptionService) {
				var containerInfoService = $injector.get('procurementContractContainerInformationService');
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 46, 'E5B91A61DBDD4276B3D92DDC84470162',containerInfoService);
				$scope.change = function(entity, field, column){
					characterColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 46);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

				prcContractBillingSchemaDataService.registerBillingSchemaChangeEvent();
				prcContractBillingSchemaDataService.registerParentEntityCreateEvent();
				// binding module readOnly handler
				// var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				// moduleReadOnlyStatusHandler.bindFormReadOnlyListener($scope.formOptions.configure); //bind listener

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());
				procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create']);
			}
		]);

})(angular);