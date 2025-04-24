/**
 * Created by lcn on 1/15/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementCommonImportMaterialController',
		['$scope', '$http', '$translate', 'platformModuleNavigationService', 'procurementCommonImportMaterialService', 'platformTranslateService', 'platformGridAPI',
			function ($scope, $http, $translate, naviService, procurementCommonImportMaterialService, platformTranslateService, platformGridAPI) {
				var errorType = {warning: 1, success: 2, error: 3};
				var formConfig = {
					'fid': 'procurement.quote.import',
					'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
					'showGrouping': false,
					'groups': [
						{
							'gid': 'importConfig',
							'header$tr$': 'procurement.common.importD94.header',
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
							'directive': 'common-import-file-lookup ',
							'options': {
								showClearButton: false
							}
						}
					]
				};
				$scope.fileisd94 = false;
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

				$scope.modalOptions = {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('procurement.common.importD94.header'),
					loadingInfo: 'Is importing...',
					columns: [
						{
							id: 'Status',
							field: 'Status',
							name: 'Status',
							name$tr$: 'procurement.common.import.status',
							width: 100,
							formatter: function (row, cell, value) {
								var status = 'Error';
								if (errorType.warning === value) {
									status = 'Warnning';
								}
								else if (errorType.success === value) {
									status = 'Success';
								}
								return status;
							}
						},
						{
							id: 'Message',
							field: 'Message',
							name: 'Message',
							name$tr$: 'procurement.common.importD94.message',
							width: 300
						}
					],
					currentStepId: 0,
					dialogLoading: false,
					canShow: false,
					data: null,
					ImportStauts: errorType.success
				};

				procurementCommonImportMaterialService.analysisFileComplete.register(analysisResponseData);

				function analysisResponseData(data, name) {
					if (_.isString(data)) {
						$scope.fileisd94 = false;
						showError(true, data, errorType.error);
					} else {
						showError(false);
						$scope.fileisd94 = true;
						$scope.filename = name;
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

				$scope.modalOptions.ok = function onOK() {
					$scope.modalOptions.dialogLoading = true;
					if ($scope.modalOptions.currentStepId === 0) {
						procurementCommonImportMaterialService.importMaterial($scope.filename).then(function (res) {
							if (res.Applystatus === false) {
								$scope.modalOptions.dialogLoading = false;
								$scope.$close();
							} else {
								$scope.modalOptions.ImportStauts = res.data.ImportStauts;
								$scope.modalOptions.dialogLoading = false;
								$scope.modalOptions.currentStepId = 1;
								/** @namespace res.data.resultDatas */
								platformGridAPI.items.data($scope.gridId, res.data.resultDatas);
								$scope.modalOptions.data = res.data;
								if (res.data.ImportStauts === errorType.warning) {
									$scope.modalOptions.actionButtonText = 'YES';
								} else {
									$scope.modalOptions.canShow = true;
									$scope.modalOptions.closeButtonText = 'Close';
								}
							}
						});
					} else {
						if ($scope.modalOptions.data) {
							procurementCommonImportMaterialService.importMaterialForWarning($scope.modalOptions.data).then(function (res) {
								$scope.modalOptions.ImportStauts = res.data.ImportStauts;
								$scope.modalOptions.dialogLoading = false;
								$scope.modalOptions.currentStepId = 1;
								/** @namespace res.data.resultDatas */
								platformGridAPI.items.data($scope.gridId, res.data.resultDatas);
								$scope.modalOptions.canShow = true;
								$scope.modalOptions.closeButtonText = 'Close';
							});
						}
						else {
							$scope.modalOptions.dialogLoading = false;
						}
					}
				};

				$scope.modalOptions.close = function onCancel() {
					if ($scope.modalOptions.currentStepId === 0) {
						$scope.$close();
					} else {
						$scope.$close({ok: $scope.modalOptions.ImportStauts === errorType.success});
					}

				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;


				$scope.gridId = '56B3A5A985A44A569C9F033814BFE3CD';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = $scope.modalOptions.columns;

					var grid = {
						columns: showColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.$watch(function () {
					$scope.modalOptions.OKBtnRequirement = $scope.modalOptions.currentStepId === 0 ? !$scope.fileisd94 :
						($scope.modalOptions.ImportStauts !== errorType.warning);
				});

				$scope.$on('$destroy', function () {
					procurementCommonImportMaterialService.analysisFileComplete.unregister(analysisResponseData);
					platformGridAPI.grids.unregister('56B3A5A985A44A569C9F033814BFE3CD');
				});

			}
		]);
})(angular);