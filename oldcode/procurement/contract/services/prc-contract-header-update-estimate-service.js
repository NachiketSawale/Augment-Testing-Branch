(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.contract').factory('prcContractHeaderUpdateEstimateService', ['platformModalService', '$translate', '$http', 'prcCommonUpdateEstimateLogController', 'prcCommonWizardUpdateEstimateLogService', 'basicsWorkflowWizardContextService',
		function (platformModalService, $translate, $http, prcCommonUpdateEstimateLogController, prcCommonWizardUpdateEstimateLogService, basicsWorkflowWizardContextService) {

			var service = {};
			var msgOptions = {};
			service.providePrcUpdateEstimate = function providePrcUpdateEstimate(mainService, updateOptions) {
				let workflowWizardContext = basicsWorkflowWizardContextService.getContext();
				var selectedContract = workflowWizardContext.entity ? workflowWizardContext.entity : mainService.getSelected();
				if (selectedContract) {
					updateOptions.headerId = selectedContract.Id;
					updateOptions.sourceType = 'Contract';
					updateOptions.ExChanageCurrency = selectedContract.BasCurrencyFk;

					return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate', updateOptions).then(function (response) {
						if (response && response.data) {
							prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, true);
							basicsWorkflowWizardContextService.setResult(response.data);

							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-log.html',
								controller: ['$scope', '$translate', '$sce', 'platformContextService', 'prcCommonWizardUpdateEstimateLogService', prcCommonUpdateEstimateLogController],
								backdrop: false,
								windowClass: 'form-modal-dialog'
							};
							return platformModalService.showDialog(modalOptions);
						}
					});
				} else {
					msgOptions = {
						headerText: $translate.instant('procurement.package.updateEstimate'),
						bodyText: $translate.instant('procurement.contract.selectedConract'),
						iconClass: 'ico-info'
					};
					return platformModalService.showDialog(msgOptions);
				}
			};
			return service;
		}]);
})(angular);