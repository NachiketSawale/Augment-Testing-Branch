// prc-comparison-update-estimate-service.js
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.pricecomparison').factory('prcComparisonUpdateEstimateService', ['platformModalService', '$translate', '$http', 'prcCommonUpdateEstimateLogController', 'prcCommonWizardUpdateEstimateLogService',
		function (platformModalService, $translate, $http, prcCommonUpdateEstimateLogController, prcCommonWizardUpdateEstimateLogService) {

			var service = {};
			service.providePrcUpdateEstimate = function providePrcUpdateEstimate(headerIds, updateOptions) {
				updateOptions.qtnHeaderIds = headerIds;
				updateOptions.sourceType = 'PriceComparison';
				return $http.post(globals.webApiBaseUrl + 'estimate/main/header/prcupdateestimate', updateOptions).then(function (response) {
					if (response && response.data) {
						prcCommonWizardUpdateEstimateLogService.setResultEntity(response.data, true);

						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-log.html',
							controller: ['$scope', '$translate', '$sce', 'platformContextService', 'prcCommonWizardUpdateEstimateLogService', prcCommonUpdateEstimateLogController],
							backdrop: false,
							windowClass: 'form-modal-dialog'
						};

						return platformModalService.showDialog(modalOptions);
					}
				});
			};
			return service;
		}]);
})(angular);