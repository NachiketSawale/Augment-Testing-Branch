(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/**
     * @ngdoc controller
     * @name procurementInvoiceValidationGridController
     * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
     * @description controller for contract header
     */
	angular.module(moduleName).controller('procurementInvoiceValidationGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceValidationDataService',
			'procurementInvoiceValidationValidationService', 'procurementInvoiceValidationUIStandardService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);


				dataService.updateAll();

				$scope.$on('$destroy', function () {
					dataService.isUpdateValidation = false;
				});

				// To Register validation EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('262674E898604462BA7D3ABCCA3579EE', 'procurement.invoice', false,
					function getSelectedModelId() {
						let invoiceValidationDataService = $injector.get('procurementInvoiceValidationDataService');
						let selectedValidationEntity = invoiceValidationDataService.getSelected();
						if (selectedValidationEntity) {
							return selectedValidationEntity.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let invoiceValidationDataService = $injector.get('procurementInvoiceValidationDataService');
						let items = invoiceValidationDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (validationEntity) {
							return validationEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);
			}]
	);
})(angular);