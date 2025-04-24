/**
 * Created by clv on 10/20/2017.
 */
(function(angular, globals){

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('procurementPackageWizardCreateBoqItemFromEstimateService', procurementPackageWizardCreateBoqItemFromEstimateService);
	procurementPackageWizardCreateBoqItemFromEstimateService.$inject = ['$http', '$translate', 'platformModalService'];
	function procurementPackageWizardCreateBoqItemFromEstimateService($http, $translate, platformModalService){

		var service = {};
		service.showWICError = showWICError;
		service.createBoQ = createBoQ;
		return service;
		function showWICError(errorData, bodyText){
			var modalOptions = {
				templateUrl: globals.appBaseUrl + 'procurement.package/partials/generate-boq-from-wic-boq-error-dialog.html',
				backDrop: false,
				windowClass: 'form-modal-dialog',
				resizeable: true,
				headerTextKey: $translate.instant('procurement.package.wicError.title'),
				bodyTextKey: $translate.instant(bodyText,{length: errorData.length}),
				errorList: errorData
			};
			platformModalService.showDialog(modalOptions);
		}
		function createBoQ(/* select, parameter */){
		}
	}

})(angular, globals);