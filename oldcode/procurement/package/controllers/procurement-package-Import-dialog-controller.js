/**
 * Created by chk on 7/20/2016.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.package';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageImportDialogController',
		['$scope', '$state', '$timeout', '$translate', 'platformGridAPI', 'platformTranslateService', 'procurementPackageImportWizardService', 'platformModalService', 'procurementPackageDataService',
			function ($scope, $state, $timeout, $translate, platformGridAPI, platformTranslateService, procurementPackageImportWizardService, platformModalService,dataService) {

				$scope.options = $scope.$parent.modalOptions;
				var errorType = {info: 1, error: 3};

				$scope.currentItem = {
					ResponseData: {
						PrjProjectFk: null,
						StructureFk: null,
						ConfigurationFk: null
					}
				};


				var formConfig = {
					'fid': 'procurement.package.import',
					'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
					'showGrouping': false,
					'groups': [
						{
							'gid': 'importConfig',
							'header$tr$': 'procurement.package.wizard.import.header',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'fileName',
							'gid': 'importConfig',
							'label$tr$': 'FileName',
							'label': 'FileName',
							'model': 'ResponseData.FileName',
							'type': 'directive',
							// 'validator':,
							'directive': 'package-import-file-lookup',
							'options': {
								showClearButton: false
							}
						},
						{
							'rid': 'projectfk',
							'gid': 'importConfig',
							'label$tr$': 'cloud.common.entityProjectName',
							'label': 'Project Name',
							'type': 'directive',
							'model': 'ResponseData.PrjProjectFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookup-data-project-project-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'initValueField': 'ProjectNo',
									'lookupKey': 'prc-req-header-project-property',
									'filterKey': 'prc-pac-header-project-filter'
								}
							}
						},
						{
							'rid': 'structurefk',
							'gid': 'importConfig',
							'label': 'Procurement Structure',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'type': 'directive',
							'model': 'ResponseData.StructureFk',
							'directive': 'basics-procurementstructure-structure-dialog',
							'validator': procurementPackageImportWizardService.validateDialogStructureFk,
							'options': {
								'descriptionField': 'StructureDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'StructureCode',
									'showClearButton': true
								}
							}
						},
						{
							'rid': 'configurationfk',
							'gid': 'importConfig',
							'label': 'Configuration',
							'label$tr$': 'procurement.package.entityConfiguration',
							'type': 'directive',
							'model': 'ResponseData.ConfigurationFk',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'procurement-package-configuration-filter'
							}
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

				procurementPackageImportWizardService.analysisFileComplete.register(analysisResponseData);

				function analysisResponseData(data) {
					if (_.isString(data)) {
						showError(true, data, errorType.error);
					} else {
						var structFk = $scope.currentItem.ResponseData.StructureFk;
						var configurationFk = $scope.currentItem.ResponseData.ConfigurationFk;
						angular.extend($scope.currentItem, data);
						$scope.currentItem.ResponseData.StructureFk = structFk;
						$scope.currentItem.ResponseData.ConfigurationFk = configurationFk;
						showMessage(data);
						procurementPackageImportWizardService.validateProjectFk($scope.currentItem, 'ResponseData.PrjProjectFk');
					}
				}

				function showMessage(data){
					var warningMsg = data.PackageImportEntity.WarningMessages;
					if (data.PackageImportEntity.ErrorMessage) {
						showError(true, data.PackageImportEntity.ErrorMessage, errorType.error);
					} else if (_.isArray(warningMsg) && warningMsg.length > 0) {
						var msg = warningMsg.length > 1 ? warningMsg.join(';') : warningMsg;
						showError(true, msg, errorType.info);
					} else {
						showError(false);
					}
				}

				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}


				$scope.modalOptions = {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('procurement.package.wizard.import.header'),
					loadingInfo: 'Is importing...'
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.modalOptions.dialogLoading = true;
					procurementPackageImportWizardService.importPackage($scope.currentItem).then(function () {
						closeCurrentDialog();
						platformModalService.showDialog(procurementPackageImportWizardService.modalOptions).then(function () {
							if (procurementPackageImportWizardService.modalOptions.result) {
								var res = procurementPackageImportWizardService.modalOptions.result;
								if (res.length > 0) {
									var packageDto = procurementPackageImportWizardService.modalOptions.result[0].PrcPackageDto;
									if (packageDto && packageDto.Id) {
										dataService.setList([packageDto]);
										dataService.setSelected(packageDto);
									}
								}
							}
						});
					}, function () {
						closeCurrentDialog();
					});

					function closeCurrentDialog() {
						$scope.modalOptions.dialogLoading = false;
						$scope.$close($scope.currentItem);
					}
				};

				$scope.$watch(function () {
					if ($scope.currentItem.PackageImportEntity && $scope.currentItem.PackageImportEntity.ErrorMessage) {
						$scope.modalOptions.OKBtnRequirement = $scope.currentItem.PackageImportEntity.ErrorMessage.length > 0;
					} else {
						$scope.modalOptions.OKBtnRequirement = !angular.isDefined($scope.currentItem.FileName) ||
							$scope.currentItem.ResponseData.PrjProjectFk <= 0 ||
							$scope.currentItem.ResponseData.StructureFk <= 0 ||
							$scope.currentItem.ResponseData.ConfigurationFk <= 0;
					}

				});

				$scope.$watch('currentItem.ResponseData.PrjProjectFk', function (newVal) {
					if (newVal > 0) {
						/** @namespace $scope.currentItem.PackageImportEntity */
						$scope.currentItem.PackageImportEntity.WarningMessages = [];
						showMessage($scope.currentItem);
					}
				});

				$scope.modalOptions.close = onCancel;
				$scope.modalOptions.cancel = onCancel;

				$scope.$on('$destroy', function () {
					procurementPackageImportWizardService.analysisFileComplete.unregister(analysisResponseData);
				});

				function onCancel() {
					$scope.$close(false);
				}
			}]);
})(angular);