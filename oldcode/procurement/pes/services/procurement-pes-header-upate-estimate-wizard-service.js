
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').factory('procurementPesUpdateEstimateWizardService',
		['$q', '$http', '$translate', 'procurementPesHeaderService', 'platformModalService','prcCommonWizardUpdateEstimateLogService','prcCommonUpdateEstimateLogController',
			function ($q, $http, $translate, procurementPesHeaderService, platformModalService, prcCommonWizardUpdateEstimateLogService, prcCommonUpdateEstimateLogController) {

				var service = {};

				var jobCodeTemp = '',
					jobDescriptionTemp = '';

				service.getJobCodeTemp = function(){
					return jobCodeTemp;
				};

				service.getJobDescriptionTemp = function(){
					return jobDescriptionTemp;
				};

				service.getUpdateOption = function () {
					return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/getoptionofupdatequtities');
				};

				service.updateEstimate = function (updateOptions) {
					updateOptions.LinkToPrcBoq = false;
					updateOptions.UpdateBoqResouce2subitem = false;

					if(!updateOptions.ShowPrcBoq){
						updateOptions.CreateBoqLineItem = false;
						updateOptions.CreateProjectBoq = false;
						updateOptions.TransferNewBoqBudget = false;
						updateOptions.CreateBoqResouce2subitem = false;
					}

					updateOptions.LinkToPrcItem = false;
					updateOptions.OverWriteOldResource = false;
					if(!updateOptions.ShowPrcItem){
						updateOptions.LinkToPrcItem = false;
						updateOptions.OverWriteOldResource = false;
						updateOptions.CreateItemLineItem = false;
					}

					updateOptions.Update = false;
					updateOptions.Create = updateOptions.CreateItemLineItem || updateOptions.CreateBoqLineItem;
					jobCodeTemp = updateOptions.JobCodeTemplate;
					jobDescriptionTemp = updateOptions.JobDescriptionTemplate;
					return providePrcUpdateEstimate(procurementPesHeaderService, updateOptions);
				};

				function providePrcUpdateEstimate(mainService,updateOptions) {
					var selectedPes = mainService.getSelected();
					if(selectedPes){

						updateOptions.headerId = selectedPes.Id;
						updateOptions.sourceType ='Pes';
						updateOptions.ExChanageCurrency = selectedPes.BasCurrencyFk;

						return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate',updateOptions).then(function (response) {
							if(response && response.data){

								prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, true);

								var modalOptions = {
									templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-log.html',
									controller: ['$scope',  '$translate', '$sce', 'platformContextService', 'prcCommonWizardUpdateEstimateLogService', prcCommonUpdateEstimateLogController],
									backdrop: false,
									windowClass: 'form-modal-dialog'
								};

								return platformModalService.showDialog(modalOptions);
							}
							// return platformModalService.showDialog(msgOptions);
						});
					}else{
						var msgOptions = {
							headerText: $translate.instant('procurement.package.updateEstimate'),
							bodyText:  $translate.instant('procurement.pes.wizard.selectedPes'),
							iconClass: 'ico-info'
						};
						return  platformModalService.showDialog(msgOptions);
					}
				}

				return service;
			}]);
})(angular);