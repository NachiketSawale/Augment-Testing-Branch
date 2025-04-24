/**
 * Created by lcn on 3/5/2019.
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCommonImportDataController',
		['$scope', '$http', '$translate', 'platformModuleNavigationService', 'basicsCommonImportDataService', 'platformTranslateService', 'platformGridAPI', '_',
			function ($scope, $http, $translate, naviService, basicsCommonImportDataService, platformTranslateService, platformGridAPI, _) {

				const errorType = {warning: 1, success: 2, error: 3};
				const formConfig = {
					'fid': 'basics.common.import',
					'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
					'showGrouping': false,
					'groups': [
						{
							'gid': 'importConfig',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'fileName',
							'gid': 'importConfig',
							'label$tr$': 'basics.common.importXML.FileName',
							'label': 'File Name',
							'model': 'ResponseData.FileName',
							'type': 'directive',
							'directive': 'basics-common-import-file-lookup ',
							'options': {
								showClearButton: false
							}
						}
					]
				};
				/* var styleOption = [
					{id: 1, value: $translate.instant('basics.costgroups.costGroup.costGroupTitle1')},
					{id: 2, value: $translate.instant('basics.costgroups.costGroup.costGroupTitle2')},
					{id: 3, value: $translate.instant('basics.costgroups.costGroup.costGroupTitle3')},
					{id: 4, value: $translate.instant('basics.costgroups.costGroup.costGroupTitle4')},
					{id: 5, value: $translate.instant('basics.costgroups.costGroup.costGroupTitle5')}
				]; */
				$scope.fileisxml = false;
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
					closeButtonText: $translate.instant('cloud.common.close'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('basics.common.importXML.header', {'header': $scope.$parent.modalOptions.headerName}),
					loadingInfo: 'Is importing...',
					columns: [
						{
							id: 'Status',
							field: 'Status',
							name: 'Status',
							name$tr$: 'basics.common.import.status',
							width: 100,
							formatter: function (row, cell, value) {
								let status = 'Error';
								if (errorType.warning === value) {
									status = 'Warnning';
								} else if (errorType.success === value) {
									status = 'Success';
								}
								return status;
							}
						},
						{
							id: 'Message',
							field: 'Message',
							name: 'Message',
							name$tr$: 'basics.common.import.message',
							width: 300
						}
					],
					currentStepId: 0,
					dialogLoading: false,
					canShow: false,
					data: null,
					ImportSucess: false,
					styleOption: $scope.$parent.modalOptions.styleOption,
					style: '1',
					canShowStyle: $scope.$parent.modalOptions.showStyle
				};

				basicsCommonImportDataService.analysisFileComplete.register(analysisResponseData);

				function analysisResponseData(data, name) {
					if (_.isString(data)) {
						$scope.fileisxml = false;
						showError(true, data, errorType.error);
					} else {
						showError(false);
						$scope.fileisxml = true;
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
						basicsCommonImportDataService.importData($scope.filename, $scope.modalOptions.style).then(function (res) {
							$scope.modalOptions.canShow = true;
							$scope.modalOptions.dialogLoading = false;
							$scope.modalOptions.currentStepId = 1;
							/** @namespace res.data.resultDatas */
							platformGridAPI.items.data($scope.gridId, res.data);
							$scope.modalOptions.ImportSucess = _.filter(res.data, {Status: 2}).length > 0;

						});
					}
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$close({ok: $scope.modalOptions.ImportSucess});
				};

				$scope.gridId = '9C3A16FA8DB747B3B3177F672CAD6B86';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const showColumns = $scope.modalOptions.columns;

					const grid = {
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
					$scope.modalOptions.OKBtnRequirement = $scope.modalOptions.currentStepId === 0 && !$scope.fileisxml;
				});

				$scope.$on('$destroy', function () {
					basicsCommonImportDataService.analysisFileComplete.unregister(analysisResponseData);
					platformGridAPI.grids.unregister('9C3A16FA8DB747B3B3177F672CAD6B86');
				});

			}
		]);
})(angular);