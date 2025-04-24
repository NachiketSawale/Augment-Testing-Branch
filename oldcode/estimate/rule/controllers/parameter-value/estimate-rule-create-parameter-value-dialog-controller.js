/**
 * Created by lnt on 4/26/2019.
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc controller
	 * @name estimateRuleCreateParameterValueDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estimateRuleCreateParameterValueDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estimateRuleCreateParameterValueDialogController', [
		'$scope', '$translate', '$timeout', '$interval', '$injector', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'estimateRuleParameterValueConfigurationService', 'estimateRuleCreateParameterValueDialogService', 'ruleCreateParamValueDialogValidationService',
		function ($scope, $translate, $timeout, $interval, $injector, platformGridAPI, dialogGridControllerService, parameterValueUIConfigService, parameterValueDialogService, ruleCreateParamValueDialogValidationService) {

			let dataService = parameterValueDialogService.dataService;
			dataService.canCreate = function() {return true;};
			dataService.canDelete = function() {return true;};

			$scope.options = $scope.$parent.modalOptions;
			$scope.item = $scope.options.item;
			$scope.itemValues = $scope.options.itemValues;
			// $scope.isOkDisabled = false; // the ok button

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({ok: true, data: dataService.getDataToSave()});
			};

			$scope.modalOptions.cancel = function onCancel() {
				$scope.$close({ok: false});
			};

			let gridConfig = {
				initCalled: false,
				columns: [],
				cellChangeCallBack: function () {
					let itemList = dataService.getList();
					let result;
					for(let i=0; i<itemList.length; i++){
						result = ruleCreateParamValueDialogValidationService.validateDescription(itemList[i], itemList[i].Description, 'Description', true);
						dataService.setOkbuttonStatus.fire(result.valid);
						if(!result.valid){
							break;
						}
					}
				},
				grouping: false,
				uuid: $scope.options.uuid
			};

			dialogGridControllerService.initListController($scope, parameterValueUIConfigService, dataService, ruleCreateParamValueDialogValidationService, gridConfig);

			dataService.setOkbuttonStatus.register(updateOkButtonStatus);
			function updateOkButtonStatus(isDisable){
				$scope.isOkDisabled = !isDisable;
				dataService.canCreate = function() {return isDisable;};
			}

			$timeout(function () {
				dataService.setList($scope.itemValues); // set the grid list
				dataService.setItemListAsReadonly();
			});

			// Intervals created by this service must be explicitly destroyed when you are finished with them
			$scope.$on('$destroy', function () {
				dataService.setOkbuttonStatus.unregister(updateOkButtonStatus);
			});
		}
	]);
})(angular);
