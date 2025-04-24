
/**
 * Created by wul on 6/25/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').factory('procurementRequisitionWizardUpdateEstimateService',
		['$q', '$http', '$translate', 'procurementPackageDataService', 'platformModalService','prcRequisitionHeaderUpdateEstimateService','procurementRequisitionHeaderDataService',
			function ($q, $http, $translate, packageDataService, platformModalService,prcRequisitionHeaderUpdateEstimateService, headerDataService) {

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
					if(!updateOptions.ShowPrcBoq){
						updateOptions.LinkToPrcBoq = false;
						updateOptions.UpdateBoqResouce2subitem = false;
						updateOptions.CreateBoqLineItem = false;
						updateOptions.CreateProjectBoq = false;
						updateOptions.TransferNewBoqBudget = false;
						updateOptions.CreateBoqResouce2subitem = false;
					}

					if(!updateOptions.ShowPrcItem){
						updateOptions.LinkToPrcItem = false;
						updateOptions.OverWriteOldResource = false;
						updateOptions.CreateItemLineItem = false;
					}

					updateOptions.Update = updateOptions.LinkToPrcBoq || updateOptions.LinkToPrcItem;
					updateOptions.Create = updateOptions.CreateItemLineItem || updateOptions.CreateBoqLineItem;
					jobCodeTemp = updateOptions.JobCodeTemplate;
					jobDescriptionTemp = updateOptions.JobDescriptionTemplate;
					return prcRequisitionHeaderUpdateEstimateService.providePrcUpdateEstimate(headerDataService, updateOptions);
				};

				return service;
			}]);
})(angular);
