/**
 * $Id: estimate-main-rule-remove-controller.js 12333 2021-09-28 06:09:04Z lnt $
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainRuleRemoveController', ['$scope','$injector', 'estimateMainRuleRemoveService','estimateMainRuleRemoveDetailService',
		function ($scope, $injector,estimateMainRuleRemoveService,estimateMainRuleRemoveDetailService) {

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
				$scope.dataItem.SelectedRules= estimateMainRuleRemoveDetailService.getList();
				let param2Delete = $injector.get('estimateMainParamRemoveDetailService').getList();
				if(param2Delete && param2Delete.length) {
					param2Delete = _.filter(param2Delete,{'isChecked':true});
					$scope.dataItem.SelectedParams = _.map (param2Delete, 'Code');
				}
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


			$scope.$watch('dataItem.IsRemoveRuleParam', function(newItem) {
				let selectParamGroup = _.find(formConfig.groups,{'gid':'paramStructure'});
				if(selectParamGroup){
					selectParamGroup.visible = newItem;
				}
				if(newItem){
					$injector.get('estimateMainParamRemoveDetailService').listLoaded.fire();
				}
				$scope.$parent.$broadcast('form-config-updated', {});

			});

			$scope.$on('$destroy', function () {
				$injector.get('estimateRuleRemoveLookupService').clear();
			});

		}]);
})(angular);
