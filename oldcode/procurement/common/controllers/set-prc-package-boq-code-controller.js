/**
 * Created by wed on 08/02/2018.
 */
(function (angular) {
	'use strict';

	angular.module('procurement.common').controller('procurementPackageSetPrcBoqCodeDialogController',
		['$scope', '$translate', '$q', 'platformTranslateService', 'procurementCommonPrcBoqValidationService', 'prcBoqMainService', 'procurementCommonPrcBoqService', 'procurementContextService', 'platformRuntimeDataService', 'controllerOptions',
			function ($scope, $translate, $q, platformTranslateService, procurementCommonPrcBoqValidationService, prcBoqMainService, procurementCommonPrcBoqService, moduleContext, platformRuntimeDataService, controllerOptions) {

				var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());
				var dataService = procurementCommonPrcBoqService.getService(moduleContext.getMainService(), boqMainService);
				var validationService = procurementCommonPrcBoqValidationService(dataService);
				let promiseCount = 0;
				$scope.currentItem = {
					PrcBoq: {
						PrcHeaderFk: controllerOptions.defaults.PrcHeaderFk,
						PackageFk: controllerOptions.defaults.PackageFk,
						BasCurrencyFk: controllerOptions.defaults.BasCurrencyFk
					},
					BoqRootItem: {
						Reference: controllerOptions.defaults.Reference,
						BriefInfo: {
							Description: controllerOptions.defaults.OutlineDescription || '',
							Translated: controllerOptions.defaults.OutlineDescription || ''
						}
					}
				};

				promiseCount++;
				validationService.asyncValidateBoqRootItem$Reference($scope.currentItem, $scope.currentItem.BoqRootItem.Reference)
					.then(function (result) {
						promiseCount--;
						platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'BoqRootItem.Reference');
					});

				var formConfig = {
					'fid': 'contract.wizard.setPackageCode',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'procurement.contract.wizards.SetReportingDateHeader',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'reference',
							'gid': 'basicData',
							'label$tr$': 'boq.main.Reference',
							'label': 'Reference',
							'type': 'code',
							'model': 'BoqRootItem.Reference',
							'asyncValidator': referenceValidator
						},
						{
							'rid': 'briefinfo',
							'gid': 'basicData',
							'label$tr$': 'boq.main.BriefInfo',
							'label': 'Brief Info',
							'type': 'translation',
							'model': 'BoqRootItem.BriefInfo'
						}
					]
				};

				// translate form config.
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
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('procurement.common.boq.createDialogTitle')
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.$close($scope.currentItem);
				};
				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				var disableOkWatcher = $scope.$watch(function () {
					return platformRuntimeDataService.hasError($scope.currentItem, 'BoqRootItem.Reference') || !$scope.currentItem.BoqRootItem.Reference || promiseCount !== 0;
				}, function (newValue) {
					$scope.disableOk = newValue;
				});

				$scope.$on('$destroy', function () {
					disableOkWatcher();
				});

				function referenceValidator(entity, value) {
					promiseCount++;
					if (!value) {
						promiseCount--;
						return $q.when({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'procurement.common.boq.wicBoqRefEmptyError'
						})
					}
					return validationService.asyncValidateBoqRootItem$Reference(entity, value)
						.then(function (result) {
							promiseCount--;
							return result;
						});
				}
			}]);
})(angular);