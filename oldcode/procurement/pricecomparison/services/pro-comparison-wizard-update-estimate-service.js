// pro-comparison-wizard-update-estimate-service.js

/**
 * Created by wul on 6/25/2018.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.pricecomparison').factory('proComparisonWizardUpdateEstimateService',
		['$q', '$http', '$translate', 'procurementPackageDataService', 'platformModalService', 'prcComparisonUpdateEstimateService',
			function ($q, $http, $translate, packageDataService, platformModalService, prcComparisonUpdateEstimateService) {

				var service = {};

				var jobCodeTemp = '',
					jobDescriptionTemp = '',
					qtnHeaderIds = [];
				service.getJobCodeTemp = function () {
					return jobCodeTemp;
				};

				service.getJobDescriptionTemp = function () {
					return jobDescriptionTemp;
				};

				service.setQtnHeaderIds = function (ids) {
					qtnHeaderIds = ids;
				};


				service.getQtnHeaderIds = function (/* id */) {
					return qtnHeaderIds;
				};
				service.getUpdateOption = function () {
					return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/getoptionofupdatequtities');
				};

				service.updateEstimate = function (updateOptions) {
					/* jobCodeTemp = updateOptions.JobCodeTemplate;
					jobDescriptionTemp = updateOptions.JobDescriptionTemplate; */
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
					var qtnHeaderIds = service.getQtnHeaderIds();
					return prcComparisonUpdateEstimateService.providePrcUpdateEstimate(qtnHeaderIds, updateOptions);
				};

				return service;
			}]);
})(angular);
