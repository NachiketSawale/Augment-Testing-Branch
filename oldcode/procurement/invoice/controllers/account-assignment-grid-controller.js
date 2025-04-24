/**
 * Created by jhe on 8/29/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementInvoiceAccountAssignmentGridController', ProcurementInvoiceAccountAssignmentGridController);

	ProcurementInvoiceAccountAssignmentGridController.$inject = ['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceAccountAssignmentDataService',
		'procurementInvoiceAccountAssignmentGetValidationService', 'procurementInvoiceAccountAssignmentUIStandardService', '_'];

	function ProcurementInvoiceAccountAssignmentGridController($scope, gridControllerService, procurementInvoiceAccountAssignmentDataService,
		validationService, gridColumns, _) {

		$scope.containerInfo = {
			conTotalAmount: 0,
			conTotalAmountOc: 0,
			conTotalNet: 0,
			conTotalNetOc: 0,
			conTotalPercent: 0,
			invoiceTotalAmount: 0,
			invoiceTotalAmountOc: 0,
			invoiceTotalNet: 0,
			invoiceTotalNetOc: 0,
			invoiceTotalPercent: 0,
			previousInvoiceNet: 0,
			previousInvoiceNetOc: 0,
			previousInvoiceAmount: 0,
			previousInvoiceAmountOc: 0,
			invCompanyCurrency: '',
			invHeaderCurrency: '',
			conCompanyCurrency: '',
			conHeaderCurrency: '',
			previousInvCompanyCurrency: '',
			previousInvHeaderCurrency: ''
		};

		var gridConfig = {
			initCalled: false,
			columns: []
		};

		gridControllerService.initListController($scope, gridColumns, procurementInvoiceAccountAssignmentDataService.service, validationService, gridConfig);

		procurementInvoiceAccountAssignmentDataService.service.registerContractChangedMessage(registerContractChangedMessage);
		procurementInvoiceAccountAssignmentDataService.service.registerFilters();
		procurementInvoiceAccountAssignmentDataService.service.registerUpdateTools(registerUpdateTools);
		procurementInvoiceAccountAssignmentDataService.service.fireContractChanged();

		function registerContractChangedMessage(contractData) {
			$scope.containerInfo.conTotalAmount = contractData.conTotalAmount;
			$scope.containerInfo.conTotalAmountOc = contractData.conTotalAmountOc;
			$scope.containerInfo.conTotalNet = contractData.conTotalNet;
			$scope.containerInfo.conTotalNetOc = contractData.conTotalNetOc;
			$scope.containerInfo.conTotalPercent = contractData.conTotalPercent;
			$scope.containerInfo.invoiceTotalAmount = contractData.invoiceTotalAmount;
			$scope.containerInfo.invoiceTotalAmountOc = contractData.invoiceTotalAmountOc;
			$scope.containerInfo.invoiceTotalNet = contractData.invoiceTotalNet;
			$scope.containerInfo.invoiceTotalNetOc = contractData.invoiceTotalNetOc;
			$scope.containerInfo.invoiceTotalPercent = contractData.invoiceTotalPercent;
			$scope.containerInfo.previousInvoiceNet = contractData.previousInvoiceNet;
			$scope.containerInfo.previousInvoiceNetOc = contractData.previousInvoiceNetOc;
			$scope.containerInfo.previousInvoiceAmount = contractData.previousInvoiceAmount;
			$scope.containerInfo.previousInvoiceAmountOc = contractData.previousInvoiceAmountOc;
			$scope.containerInfo.invCompanyCurrency = contractData.invCompanyCurrency;
			$scope.containerInfo.invHeaderCurrency = contractData.invHeaderCurrency;
			$scope.containerInfo.conCompanyCurrency = contractData.conCompanyCurrency;
			$scope.containerInfo.conHeaderCurrency = contractData.conHeaderCurrency;
			$scope.containerInfo.previousInvCompanyCurrency = contractData.previousInvCompanyCurrency;
			$scope.containerInfo.previousInvHeaderCurrency = contractData.previousInvHeaderCurrency;
		}

		function registerUpdateTools(isInvAccountChangeable, isUpdateDelete) {
			_.find($scope.tools.items, {id: 'create'}).disabled = !isInvAccountChangeable;
			if (isUpdateDelete) {
				_.find($scope.tools.items, {id: 'delete'}).disabled = !isInvAccountChangeable;
			}
			$scope.tools.update();
		}


		$scope.$on('$destroy', function () {
			procurementInvoiceAccountAssignmentDataService.service.unRegisterContractChangedMessage(registerContractChangedMessage);
			procurementInvoiceAccountAssignmentDataService.service.unRegisterFilters();
			procurementInvoiceAccountAssignmentDataService.service.unRegisterUpdateTools(registerUpdateTools);
		});

	}

})(angular);