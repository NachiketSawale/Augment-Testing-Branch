(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('createAdditionalExpenseWizardController',
		['$scope', '$translate','createAdditionalExpenseWizardDialogService','platformTranslateService',
			function ($scope,$translate,createAdditionalExpenseWizardDialogService, platformTranslateService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};

				$scope.DescriptionNotEditable = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.DescriptionNotEditable'),
					iconCol: 1,
					type: 1
				};

				function getFormConfig() {
					let config = createAdditionalExpenseWizardDialogService.getFormConfig();
					return config;
				}

				let formConfig = getFormConfig();

				$scope.onSelectionChanged = function () {
					$scope.$parent.$broadcast('form-config-updated', {});
				};

				function int(){
					$scope.DescriptionNotEditable.show = false;
				}

				int();

				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};

				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: []
				};

				$scope.hasErrors = function checkForErrors () {
					let hasError = false;
					return hasError  || !$scope.dataItem.Code || !$scope.dataItem.Amount || !$scope.dataItem.Description || !createAdditionalExpenseWizardDialogService.getIsUnique();
				};

				$scope.onOK = function () {
					$scope.$close({ok:true, data:$scope.dataItem});
				};

				$scope.onCancel = function () {
					if($scope.dataItem.__rt$data){
						$scope.dataItem.__rt$data.errors = null;
					}
					$scope.$close(false);
				};

				$scope.modalOptions.cancel = function () {
					if($scope.dataItem.__rt$data){
						$scope.dataItem.__rt$data.errors = null;
					}
					$scope.$close(false);
				};

				$scope.onSelectionChanged();

				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);