
(function(angular) {
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureTransferSchedulerTaskController', ['$scope','$translate','$injector','controllingStructureTransferSchedulerTaskService','platformTranslateService','controllingStructureProjectDataService',
		'$timeout','platformGridAPI',
		function ($scope,$translate,$injector,controllingStructureTransferSchedulerTaskService,platformTranslateService,controllingStructureProjectDataService,$timeout,platformGridAPI) {
			$scope.options = $scope.$parent.modalOptions;
			$scope.dataItem = $scope.options.dataItem;
			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			function getFormConfig() {
				let config = controllingStructureTransferSchedulerTaskService.getFormConfig();
				return config;
			}

			let formConfig = getFormConfig();

			platformTranslateService.translateFormConfig(formConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: formConfig
			};

			controllingStructureTransferSchedulerTaskService.afterSetSelectedJobEntities.register(expandAllContainer);
			controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.register(setIsCreateDisabled);
			function setIsCreateDisabled(flag) {
				$scope.dataItem.isCreateDisabled = flag;
			}

			function expandAllContainer(selectJobEntity,isCreate) {
				processDataItm(selectJobEntity,isCreate);
				controllingStructureTransferSchedulerTaskService.setDataItemReadOnly($scope.dataItem, isCreate);
				$scope.formContainerOptions.formOptions.expandAll();
				$timeout(function () {
					platformGridAPI.configuration.refresh('1635bb851c6b4255bc50ae6f884d4966', true);
					platformGridAPI.configuration.refresh('bee917ce51824a8ab6d2a74aee2b6f1d', true);
				});
			}

			function processDataItm(data,isCreate) {
				$scope.dataItem.Name = isCreate ? null : data.Name;
				$scope.dataItem.Description = isCreate ? null : data.Description;
				$scope.dataItem.StartTime = isCreate ? null : data.StartTime;
				$scope.dataItem.Priority = isCreate ? 2 :  data.Priority;
				$scope.dataItem.RepeatUnit = isCreate ? 0 :  data.RepeatUnit;
				$scope.dataItem.RepeatCount = isCreate ? null :  data.RepeatCount;
				$scope.dataItem.LoggingLevel = isCreate ? 0 :  data.LoggingLevel;
				$scope.dataItem.KeepDuration = isCreate ? 0 : data.KeepDuration;
				$scope.dataItem.KeepCount = isCreate ? 0 : data.KeepCount;
				$scope.dataItem.TargetGroup = isCreate ? null : data.TargetGroup;
				$scope.dataItem.isUpdateLineItemQuantityDisabled = !isCreate;
				$scope.dataItem.isUpdateRevenueDisabled = !isCreate;

				$scope.dataItem.updateRevenue = isCreate ? false : data.updateRevenue;
				$scope.dataItem.revenueUpdateFrom = isCreate ? -1 : (data.updateRevenue ? data.revenueUpdateFrom : -1);

				$scope.dataItem.updatePlannedQty = isCreate ? false : data.updatePlannedQty;
				$scope.dataItem.updateInstalledQty = isCreate ? false : data.updateInstalledQty;
				$scope.dataItem.insQtyUpdateFrom = isCreate ? -1 : (data.updateInstalledQty ? data.insQtyUpdateFrom : -1);
				$scope.dataItem.updateBillingQty = isCreate ? false : data.updateBillingQty;
				$scope.dataItem.updateForecastingPlannedQty = isCreate ? false : data.updateForecastingPlannedQty;

				$scope.dataItem.okButtonFlag = isCreate;
				$scope.dataItem.isActive = isCreate;
			}

			$scope.hasErrors = function checkForErrors () {
				return !$scope.dataItem.Name || !$scope.dataItem.StartTime || !$scope.dataItem.okButtonFlag;
			};

			$scope.onCreate = function onCreate() {
				$scope.dataItem.isUpdateLineItemQuantityDisabled = false;
				$scope.dataItem.isUpdateRevenueDisabled = false;
				$scope.dataItem.okButtonFlag = true;
				$scope.dataItem.isActive = true;
				controllingStructureProjectDataService.setIsReadOnly(false);
				controllingStructureTransferSchedulerTaskService.setDataItemReadOnly($scope.dataItem, true);
				let controllingStructureCostGroupAssignmentDataService = $injector.get('controllingStructureCostGroupAssignmentDataService');
				controllingStructureCostGroupAssignmentDataService.setDataReadOnly();
				let selectedProject = controllingStructureProjectDataService.getSelected();
				controllingStructureCostGroupAssignmentDataService.setDefaultCostGroupCatalogs(selectedProject ? selectedProject.Id : null);
			};

			$scope.onOK = function () {
				if($scope.dataItem.__rt$data){
					$scope.dataItem.__rt$data.readonly = null;
				}
				$scope.$close({ok:true, data:$scope.dataItem});
			};

			$scope.onCancel = function () {
				if($scope.dataItem.__rt$data){
					$scope.dataItem.__rt$data.readonly = null;
					$scope.dataItem.__rt$data.errors = null;
				}
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				if($scope.dataItem.__rt$data){
					$scope.dataItem.__rt$data.readonly = null;
					$scope.dataItem.__rt$data.errors = null;
				}
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				controllingStructureTransferSchedulerTaskService.afterSetSelectedJobEntities.unregister(expandAllContainer);
				controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.unregister(setIsCreateDisabled);
				$injector.get('controllingStructureCostGroupAssignmentLookupService').reSetMatchValues();
			});

		}]);
})(angular);
