
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.quote').factory('proQuoteUpdateEstimateService', ['platformModalService','$translate','$http','prcCommonUpdateEstimateLogController','prcCommonWizardUpdateEstimateLogService',
		function (platformModalService, $translate, $http, prcCommonUpdateEstimateLogController, prcCommonWizardUpdateEstimateLogService) {

			var service={};
			var msgOptions = {};
			service.providePrcUpdateEstimate =   function providePrcUpdateEstimate(mainService, updateOptions) {
				var selectedQuote = mainService.getSelected();
				if(selectedQuote){

					updateOptions.headerId = selectedQuote.Id;
					updateOptions.sourceType ='Quote';
					updateOptions.ExChanageCurrency = selectedQuote.CurrencyFk;

					return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate', updateOptions).then(function (response) {
						if(response?.data){

							prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, true);

							var modalOptions = {
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
						bodyText:  $translate.instant('procurement.quote.selectedQuote'),
						iconClass: 'ico-info'
					};
					return  platformModalService.showDialog(msgOptions);
				}
			};

			return service;
		}]);
})(angular);