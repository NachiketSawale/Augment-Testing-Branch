/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainRuleRemoveController', ['$scope', 'estimateMainRuleRemoveService','estimateMainRuleRemoveDetailService',
		function ($scope, estimateMainRuleRemoveService,estimateMainRuleRemoveDetailService) {

			$scope.path = globals.appBaseUrl;
			$scope.modalOptions.headerText = estimateMainRuleRemoveService.getDialogTitle();
			$scope.dataItem = estimateMainRuleRemoveService.getDataItem();

			let formConfig = estimateMainRuleRemoveService.getFormConfiguration();

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.dataItem.selectedRules= estimateMainRuleRemoveDetailService.getList();
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
