/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainRiskAssignDialogController', [
		'$scope','estimateMainRiskCalculatorAssignRiskService','estimateMainRiskEventsDataService',
		function ($scope,estimateMainRiskCalculatorAssignRiskService,estimateMainRiskEventsDataService) {
			$scope.path = globals.appBaseUrl;
			$scope.modalTitle = estimateMainRiskCalculatorAssignRiskService.getDialogTitle();
			$scope.dataItem = estimateMainRiskCalculatorAssignRiskService.getDataItem();

			let formConfig = estimateMainRiskCalculatorAssignRiskService.getFormConfiguration();

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.dataItem.selectedRisks = estimateMainRiskEventsDataService.getSelectedEntities();
				// eslint-disable-next-line no-console
				console.log('Results of scope from dialog',$scope);
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close({});
			};

			$scope.onClose = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})(angular);
