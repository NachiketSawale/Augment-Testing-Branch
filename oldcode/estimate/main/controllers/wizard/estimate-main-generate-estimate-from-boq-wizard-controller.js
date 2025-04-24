/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainGenerateEstimateFromBoqWizardController', ['$scope', 'estimateMainGenerateEstimateFromBoqWizardService',
		'estimateMainGenerateEstimateFromBoqWizardDetailService',
		function ($scope, estimateMainGenerateEstimateFromBoqWizardService,estimateMainGenerateEstimateFromBoqWizardDetailService) {

			$scope.path = globals.appBaseUrl;
			$scope.modalOptions.headerText = estimateMainGenerateEstimateFromBoqWizardService.getDialogTitle();
			$scope.dataItem = estimateMainGenerateEstimateFromBoqWizardService.getDataItem();

			let formConfig = estimateMainGenerateEstimateFromBoqWizardService.getFormConfiguration();

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.dataItem.sourceBoqItems= estimateMainGenerateEstimateFromBoqWizardDetailService.getList();
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close({});
			};

			$scope.modalOptions.cancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);
