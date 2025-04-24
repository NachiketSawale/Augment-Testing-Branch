/**
 * Created by jhe on 8/8/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractAccountAssignmentGridController', ProcurementContractAccountAssignmentGridController);

	ProcurementContractAccountAssignmentGridController.$inject = ['$scope', 'platformContainerControllerService', 'procurementContractAccountAssignmentDataService', '_'];

	function ProcurementContractAccountAssignmentGridController($scope, platformContainerControllerService, procurementContractAccountAssignmentDataService, _) {

		$scope.containerInfo = {
			currentContractTotalNet: 0,
			totalPercent: 0,
			totalAmount: 0,
			currentContractTotalNetOc: 0,
			totalAmountOc: 0,
			conCurrency: '',
			conCurrencyOc: ''
		};

		platformContainerControllerService.initController($scope, moduleName, '1C5E0A69E0A343EEB3E9F9E700F171EB');

		procurementContractAccountAssignmentDataService.service.registerContractChangedMessage(registerContractChangedMessage);
		procurementContractAccountAssignmentDataService.service.registerParentUpdateDone();
		procurementContractAccountAssignmentDataService.service.registerFilters();
		procurementContractAccountAssignmentDataService.service.registerCreateButtonStatusChange(createButtonStatusChange);

		procurementContractAccountAssignmentDataService.service.fireContractChanged();

		function registerContractChangedMessage(contractData) {
			$scope.containerInfo.currentContractTotalNet = contractData.currentContractTotalNet;
			$scope.containerInfo.totalPercent = contractData.totalPercent;
			$scope.containerInfo.totalAmount = contractData.totalAmount;
			$scope.containerInfo.currentContractTotalNetOc = contractData.currentContractTotalNetOc;
			$scope.containerInfo.totalAmountOc = contractData.totalAmountOc;
			$scope.containerInfo.conCurrency = contractData.conCurrency;
			$scope.containerInfo.conCurrencyOc = contractData.conCurrencyOc;
		}

		function createButtonStatusChange(isCanCreate) {
			var item = _.find($scope.tools.items, {id: 'create'});
			if (item) {
				item.disabled = !isCanCreate;
				$scope.tools.update();
			}
		}

		$scope.$on('$destroy', function () {
			procurementContractAccountAssignmentDataService.service.unRegisterContractChangedMessage(registerContractChangedMessage);
			procurementContractAccountAssignmentDataService.service.unRegisterFilters();
			procurementContractAccountAssignmentDataService.service.unRegisterCreateButtonStatusChange(createButtonStatusChange);
		});

	}

})(angular);