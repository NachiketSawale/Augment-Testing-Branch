
(function (angular) {
	'use strict';

	angular.module('estimate.main').controller('estimateAllowanceDialogController',
		['_','$http','globals', '$log', '$timeout', '$scope', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'estimateMainAllowanceDialogUIService','estimateAllowanceMarkUp2CostCodeAssignmentGridService','estimateMdcAllowanceAreaService','platformFormConfigService',
			function (_,$http,globals, $log, $timeout, $scope, $injector, $translate, platformDataValidationService, platformRuntimeDataService, platformTranslateService, estimateMainAllowanceDialogUIService,estimateAllowanceMarkUp2CostCodeAssignmentGridService,estimateMdcAllowanceAreaService,platformFormConfigService) {


				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;
				// $scope.CostCodes = $scope.options.dataItem.markup2CostCodes;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};


				// set readonly rows and unvisbile rows
				function getFormConfig() {
					let dataItem = $scope.dataItem;
					let isAddArea = dataItem.AllowanceTypeFk ? dataItem.AllowanceTypeFk === 3 : false;
					return  estimateMainAllowanceDialogUIService.getFormConfig(isAddArea);
				}

				// translate form config.
				let formConfig = getFormConfig();

				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};

				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: []
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};
				$injector.get('estimateAllowanceDialogDataService').afterChangeAllowanceTypeFk.register(setAreaVisiable);
				function setAreaVisiable(isVisiable) {
					$scope.formContainerOptions.formOptions.configure = estimateMainAllowanceDialogUIService.getFormConfig(isVisiable);
					platformFormConfigService.initialize($scope.formContainerOptions.formOptions, $scope.formContainerOptions.formOptions.configure);
					$scope.$broadcast('form-config-updated', {});
					estimateMdcAllowanceAreaService.clearData();
					estimateAllowanceMarkUp2CostCodeAssignmentGridService.clearData([]);
				}

				function int(){

					if($scope.dataItem.MasterContextFk){
						$injector.get('platformRuntimeDataService').readonly($scope.dataItem, [{field: 'MasterContextFk', readonly: true}]);
					}
				}

				$scope.hasErrors = function checkForErrors() {
					return !$scope.dataItem.MasterContextFk || !$scope.dataItem.AllowanceTypeFk || !$scope.dataItem.MarkupCalcTypeFk || !$scope.dataItem.QuantityTypeFk || estimateMdcAllowanceAreaService.hasError($scope.dataItem.AllowanceTypeFk);
				};

				$scope.onOK = function () {
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

				// function collectCostCode(items) {
				//    $scope.CostCodes = items;
				// }

				int();

				// estimateAllowanceMarkUp2CostCodeAssignmentGridService.setDataList($scope.CostCodes);
				// estimateAllowanceMarkUp2CostCodeAssignmentGridService.onUpdateList.register(collectCostCode);

				$scope.$on('$destroy', function () {
					$injector.get('estimateAllowanceDialogDataService').afterChangeAllowanceTypeFk.unregister(setAreaVisiable);
					// estimateAllowanceMarkUp2CostCodeAssignmentGridService.onUpdateList.unregister(collectCostCode);
					estimateAllowanceMarkUp2CostCodeAssignmentGridService.clearData([]);
					estimateMdcAllowanceAreaService.clearData();
					$injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').setIsLoadOnMdcAllowance(false);
				});
			}
		]
	);
})(angular);
