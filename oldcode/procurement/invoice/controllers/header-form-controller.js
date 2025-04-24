(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceHeaderFormController
	 * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceHeaderFormController',
		['$scope', 'procurementInvoiceHeaderDataService', 'procurementInvoiceDetailControllerService',
			'invoiceHeaderElementValidationService', 'procurementInvoiceUIStandardService', 'platformTranslateService', '$translate','$injector',
			'basicsCharacteristicDataServiceFactory','platformFormConfigService','$timeout', 'basicsCharacteristicColumnUpdateService','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, translateService, $translate, $injector,
				basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout, basicsCharacteristicColumnUpdateService,procurementCommonCreateButtonBySystemOptionService) {

				var containerInfoService = $injector.get('procurementInvoiceContainerInformationService');
				var gridContainerGuid = 'da419bc1b8ee4a2299cf1dde81cf1884';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 47, gridContainerGuid,containerInfoService);
				$scope.change = function(entity, field, column){
					characterColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 47);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, translateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				basicsCharacteristicColumnUpdateService.attachToForm($scope, characterColumnService, characteristicDataService);

				$scope.formContainerOptions.customButtons = [
					{
						id: 'create',
						caption: $translate.instant('procurement.invoice.toolbarNewByCopy'),
						disabled: false,
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new-copy',
						fn: dataService.createItem,
						permission: '#c'
					},
					{
						id: 'createBlank',
						caption: $translate.instant('cloud.common.taskBarNewRecord'),
						disabled: false,
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: dataService.createBlankItem,
						permission: '#c'
					}];
				 procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create','createBlank']);
			}

		]);

})(angular);