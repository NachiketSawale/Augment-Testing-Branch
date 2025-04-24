(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.parameter';

	angular.module(moduleName).controller('estimateParameterDialogController', [
		'$scope',
		'estimateParameterDialogUIService',
		'platformTranslateService',
		'$translate',
		'estimateParameterValueAssignmentGridService',
		'estimateParameterDialogDataService',
		'platformFormConfigService',
		function ($scope,
			estimateParameterDialogUIService,
			platformTranslateService,
			$translate,
			estimateParameterValueAssignmentGridService,
			estimateParameterDialogDataService,
			platformFormConfigService) {

			$scope.dataItem = estimateParameterDialogDataService.getCurrentEstParameter();
			$scope.modalOptions = {
				headerText: $translate.instant('basics.customize.estparameter'),
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// handle UI config
			function getFormConfig() {
				let currentEstParameter = estimateParameterDialogDataService.getCurrentEstParameter();
				return estimateParameterDialogUIService.getFormConfig(currentEstParameter.Islookup);
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

			estimateParameterDialogDataService.onValueTypeChangeEvent.register(domainChanged);
			estimateParameterDialogDataService.onIsLookupChangeEvent.register(valueDetailColumnConfigChange);

			function domainChanged() {
				$scope.$broadcast('domainChanged');
			}

			function valueDetailColumnConfigChange(isLookup) {
				$scope.formContainerOptions.formOptions.configure = estimateParameterDialogUIService.getFormConfig(isLookup);
				platformFormConfigService.initialize($scope.formContainerOptions.formOptions, $scope.formContainerOptions.formOptions.configure);
				$scope.$broadcast('form-config-updated', {});
			}

			$scope.hasErrors = function checkForErrors() {
				return estimateParameterValueAssignmentGridService.hasError();
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

			$scope.$on('$destroy', function () {
				estimateParameterDialogDataService.onValueTypeChangeEvent.unregister(domainChanged);
				estimateParameterDialogDataService.onIsLookupChangeEvent.unregister(valueDetailColumnConfigChange);
				estimateParameterValueAssignmentGridService.clearData();
			});

		}]);
})();
