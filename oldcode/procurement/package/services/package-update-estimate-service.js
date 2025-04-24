(function (angular) {
    'use strict';

    // eslint-disable-next-line no-redeclare
    /* global angular,globals */
    angular.module('procurement.common').factory('packageUpdateEstimateService', ['platformModalService', '$translate', '$http', '$injector', 'prcCommonUpdateEstimateLogController', 'prcCommonWizardUpdateEstimateLogService', 'basicsWorkflowWizardContextService',
        function (platformModalService, $translate, $http, $injector, prcCommonUpdateEstimateLogController, prcCommonWizardUpdateEstimateLogService, basicsWorkflowWizardContextService) {

            var service = {};
            var msgOptions = {};
            service.providePrcUpdateEstimate = function providePrcUpdateEstimate(mainService, updateOptions) {
                var selectedPackage = basicsWorkflowWizardContextService.getContext().entity;
                selectedPackage = selectedPackage ? selectedPackage : mainService.getSelected();
                if (selectedPackage) {
                    updateOptions.PrcPackageId = selectedPackage.Id;
	                return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate', updateOptions).then(function (response) {
		                if (response && response.data) {

			                var jobLookupServ = $injector.get('logisticJobLookupByProjectDataService');
			                if (jobLookupServ) {
				                jobLookupServ.resetCache({lookupType: 'logisticJobLookupByProjectDataService'});
			                }

			                prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, false);
			                var modalOptions = {
				                templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-log.html',
				                controller: ['$scope', '$translate', '$sce', 'platformContextService', 'prcCommonWizardUpdateEstimateLogService', prcCommonUpdateEstimateLogController],
				                backdrop: false,
				                windowClass: 'form-modal-dialog'
			                };
			                return platformModalService.showDialog(modalOptions).then(function () {
				                return response.data;
			                });

		                }
	                });
                } else {
                    msgOptions = {
                        headerText: $translate.instant('procurement.package.updateEstimate'),
                        bodyText: $translate.instant('procurement.package.selectedPackage'),
                        iconClass: 'ico-info'
                    };
                    return platformModalService.showDialog(msgOptions);
                }
            };
            return service;
        }]);
})(angular);