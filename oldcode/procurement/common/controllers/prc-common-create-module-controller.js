/**
 * Created by lcn on 1/21/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).controller('procurementCommonCreateModuleDialogController',
		['$scope', '$translate', 'platformTranslateService', 'platformRuntimeDataService', '$injector',
			'basicsLookupdataLookupDataService', 'procurementCommonCreateService',
			function ($scope, $translate, platformTranslateService, platformRuntimeDataService, $injector,
				basicsLookupdataLookupDataService, procurementCommonCreateService) {

				$scope.options = $scope.$parent.modalOptions;
				var _moduleName = $scope.options.moduleName;

				$scope.currentItem = {
					ConfigurationFk: null,
					Code: null,
					Version: 0,
					BusinessPartnerFk: null,
					ContactFk: null,
					SubsidiaryFk: null,
					SupplierFk: null
				};

				$scope.currentSerivce = {
					RubricFk: 0,
					ValidationService: null,
					filterKey: '',
					IsContract: false,
					moduleName: ''
				};

				procurementCommonCreateService.init(_moduleName, $scope);

				var formConfig = procurementCommonCreateService.getFormConfigForDialog($scope);

				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};
				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};
				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.createmodule.createDialogTitle', {module: $scope.currentSerivce.moduleName})
				};
				$scope.modalOptions.ok = function onOK() {
					$scope.currentSerivce.ValidationService.validateDialogCode($scope.currentItem, $scope.currentItem.Code, 'Code').then(function (result) {
						if (result) {
							$scope.isDisabled = true;
							$scope.$close($scope.currentItem);
						}
					});
				};
				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				function isDisabledFn() {
					let code = $scope.currentItem.Code;
					let businessPartnerFk = $scope.currentSerivce.IsContract ? $scope.currentItem.BusinessPartnerFk : -1;
					let hasErrors = false;
					if ($scope.currentItem.__rt$data && $scope.currentItem.__rt$data.errors) {
						let errors = $scope.currentItem.__rt$data.errors;
						for (let prop in errors) {
							hasErrors |= errors[prop] && (angular.isDefined(errors[prop].error) || (angular.isDefined(errors[prop].error$tr$)));
						}
					}
					return code === null || code === '' || businessPartnerFk === null || hasErrors;
				}

				var watchUnregister = $scope.$watchGroup(['currentItem.Code', 'currentItem.BusinessPartnerFk'], function (newValues, oldValues) {
					if (newValues[0] !== oldValues[0]) {
						platformRuntimeDataService.applyValidationResult($scope.currentSerivce.ValidationService.validateDialogCode($scope.currentItem, $scope.currentItem.Code, 'Code'), $scope.currentItem, 'Code').then(function () {
							$scope.isDisabled = isDisabledFn();
						});
					}
					$scope.isDisabled = isDisabledFn();
				});


				$scope.$on('$destroy', function () {
					if (watchUnregister) {
						watchUnregister();
					}
				});
			}
		]);

})(angular);
