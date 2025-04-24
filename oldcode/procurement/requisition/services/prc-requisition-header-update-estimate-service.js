(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.requisition').factory('prcRequisitionHeaderUpdateEstimateService', ['platformModalService','$translate','$http','prcCommonUpdateEstimateLogController','prcCommonWizardUpdateEstimateLogService',
		function (platformModalService, $translate, $http, prcCommonUpdateEstimateLogController, prcCommonWizardUpdateEstimateLogService) {

			let service={};
			let msgOptions = {};
			service.providePrcUpdateEstimate =   function providePrcUpdateEstimate(mainService,updateOptions) {
				let selectedrequisition = mainService.getSelected();
				if(selectedrequisition){

					updateOptions.headerId = selectedrequisition.Id;
					updateOptions.sourceType ='Requisition';
					updateOptions.ExChanageCurrency = selectedrequisition.BasCurrencyFk;
					return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate',updateOptions).then(function (response) {
						if(response?.data){

							prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, true);

							let modalOptions = {
								templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-log.html',
								controller: ['$scope',  '$translate', '$sce', 'platformContextService', 'prcCommonWizardUpdateEstimateLogService', prcCommonUpdateEstimateLogController],
								backdrop: false,
								windowClass: 'form-modal-dialog'
							};

							return platformModalService.showDialog(modalOptions);
						}
					});
				}else{
					msgOptions = {
						headerText: $translate.instant('procurement.package.updateEstimate'),
						bodyText:  $translate.instant('procurement.requisition.selectedRequisition'),
						iconClass: 'ico-info'
					};
					return  platformModalService.showDialog(msgOptions);
				}
			};
			return service;
		}]);
})(angular);