(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageCreatePackageFromTemplateWizardController',
		['$scope', '$http', '$translate', 'procurementPackageDataService', 'procurementPackageValidationService', 'platformRuntimeDataService', 'platformDialogService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', '_', 'platformModuleStateService', '$injector',
			function ($scope, $http, $translate, packageDataService, validationService, platformRuntimeDataService, platformDialogService, basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService, _, platformModuleStateService, $injector) {

				$scope.options = $scope.$parent.modalOptions;

				// init current item.
				$scope.currentItem = {
					AssetMasterFk: null,
					ProjectFk: $scope.options.ProjectFk || null,
					PrcPackageTemplateFk: $scope.options.PrcPackageTemplateFk || null,
					ClerkReqFk: $scope.options.ClerkReqFk || null,
					ClerkPrcFk: $scope.options.ClerkPrcFk || null,
					AssetMasterList: [], // for filter
					packagereationShowAssetMaster: $scope.options.packageCreationShowAssetMaster// for chose filterC
				};

				$scope.options.headerText = $translate.instant('procurement.package.wizard.createPackageFromTemplate.caption');

				$scope.options.dialogLoading = false;
				$scope.options.loadingInfo = '';

				basicsLookupdataLookupDataService.getList('AssertMaster').then(function (data) {
					$scope.currentItem.AssetMasterList = data;
				});
				var project = _.find(basicsLookupdataLookupDescriptorService.getData('project'), {Id: $scope.currentItem.ProjectFk});
				if (project) {
					$scope.currentItem.AssetMasterFk = project.AssetMasterFk;
				}
				// var projectLookupDirective = $scope.options.packageCreationShowAssetMaster ?
				// 'basics-lookupdata-assetmaster-project-composite-lookup' : 'basics-lookup-data-project-project-dialog';

				var projectLookupDirective = 'procurement-project-lookup-dialog';

				var formConfig = {
					'fid': 'procurement.package.create.package',
					'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'procurement.package.wizard.createPackageFromTemplate.caption',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'projectfk',
							'gid': 'basicData',
							'label$tr$': 'cloud.common.entityProjectNo',
							'label': 'Project No.',
							'type': 'directive',
							'model': 'ProjectFk',
							'validator': validationService.validateProjectFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': projectLookupDirective,
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'initValueField': 'ProjectNo',
									'lookupKey': 'prc-req-header-project-property',
									// 'filterKey': 'procurement-package-header-project-filter',
									'filterKey': 'procurement-package-header-project-assetmasterfk-filter',
									'readOnly': false,
									'disableInput': false,
									'showClearButton': true,
									'showEditButton': true
								}
							}
						},
						{
							'rid': 'templatefk',
							'gid': 'basicData',
							'label$tr$': 'test',// todo:modify
							'label': 'Package Template',
							'type': 'directive',
							'model': 'PrcPackageTemplateFk',
							'validator': validationService.validatePrcPackageTemplateFk,
							'directive': 'package-template-combobox',
							'options': {
								'showClearButton': false
							}
						},
						{
							'rid': 'clerkreqfk',
							'gid': 'basicData',
							'label$tr$': 'cloud.common.entityRequisitionOwner',
							'label': 'Requisition Owner',
							'type': 'directive',
							'model': 'ClerkReqFk',
							// 'validator': validationService.validateStructureFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionField': 'ClerkReqDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'ClerkReqCode',
									'readOnly': false,
									'disableInput': false,
									'showClearButton': true,
									'showEditButton': true
								}
							}
						},
						{
							'rid': 'clerkprcfk',
							'gid': 'basicData',
							'label$tr$': 'cloud.common.entityResponsible',
							'label': 'Responsible',
							'type': 'directive',
							'model': 'ClerkPrcFk',
							// 'validator': validationService.validateStructureFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionField': 'ClerkPrcDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'ClerkPrcCode',
									'readOnly': false,
									'disableInput': false,
									'showClearButton': true,
									'showEditButton': true
								}
							}
						}

					]
				};

				if ($scope.options.packageCreationShowAssetMaster) {
					var assetmasterfk = {
						'rid': 'assetmasterfk',
						'gid': 'basicData',
						'label$tr$': 'procurement.package.entityAssetMaster',
						'label': 'Assert Master',
						'type': 'directive',
						'model': 'AssetMasterFk',
						// 'validator': validationService.validateAssetMasterFk,
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'readOnly': true,
							'lookupDirective': 'basics-asset-master-dialog',
							'descriptionMember': 'Description',
							'lookupOptions': {
								'filterKey': 'basics-asset-master-dialog-filter',
								'initValueField': 'AssertMasterFk',
								'showClearButton': true
							}
						}
					};

					// #85728 Changing the order of Asset Master and Project name in the popup dialog for creating a new package.
					formConfig.rows.splice(1, 0, assetmasterfk);
				}

				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				var assetMasterFkPlatformValidation = $scope.$watch('currentItem.AssetMasterFk', function (nvalue, ovalue) {
					if (nvalue !== ovalue) {
						platformRuntimeDataService.applyValidationResult(validationService.validateAssetMasterFk($scope.currentItem, $scope.currentItem.AssetMasterFk, 'AssetMasterFk'), $scope.currentItem, 'AssetMasterFk');
					}
					$scope.isDisabled = isDisabledFn(); // add validation for create-package-template.html
				});

				// add validation for create-package-template.html
				var projectFkPackageValidation = $scope.$watch('currentItem.ProjectFk', function () {

					$scope.isDisabled = isDisabledFn();
				});

				var prcPackageTemplateFkPackageValidation = $scope.$watch('currentItem.PrcPackageTemplateFk', function () {
					validationService.validatePrcPackageTemplateFk($scope.currentItem, $scope.currentItem.PrcPackageTemplateFk, 'PrcPackageTemplateFk').then(function (result) {
						var validResult = true;
						if (result.valid === undefined) {
							validResult = result;
						} else {
							validResult = result.valid;
						}
						$scope.isDisabled = isDisabledFn() || !validResult;
					});
				});

				function isDisabledFn() {

					var AssetMasterFk = $scope.currentItem.AssetMasterFk;
					var ProjectFk = $scope.currentItem.ProjectFk;
					var PrcPackageTemplateFk = $scope.currentItem.PrcPackageTemplateFk;

					if ($scope.options.packageCreationShowAssetMaster) {

						return (AssetMasterFk === -1 || ProjectFk === -1 || AssetMasterFk === null || ProjectFk === null || PrcPackageTemplateFk === null || PrcPackageTemplateFk === -1);
					} else {

						return (ProjectFk === -1 || ProjectFk === null || PrcPackageTemplateFk === null || PrcPackageTemplateFk === -1);
					}
				}

				$scope.$on('$destroy', function () {

					if (_.isFunction(assetMasterFkPlatformValidation)) {

						assetMasterFkPlatformValidation();
					}
					if (_.isFunction(projectFkPackageValidation)) {

						projectFkPackageValidation();
					}
					if (_.isFunction(prcPackageTemplateFkPackageValidation)) {

						prcPackageTemplateFkPackageValidation();
					}
				});

				function updateValidation() {
					var result1 = validationService.validateProjectFk($scope.currentItem, $scope.currentItem.ProjectFk, 'ProjectFk');
					platformRuntimeDataService.applyValidationResult(result1, $scope.currentItem, 'ProjectFk');

					var result2 = validationService.validatePrcPackageTemplateFk($scope.currentItem, $scope.currentItem.PrcPackageTemplateFk, 'PrcPackageTemplateFk');
					platformRuntimeDataService.applyValidationResult(result2, $scope.currentItem, 'PrcPackageTemplateFk');

					if ($scope.options.packageCreationShowAssetMaster) {
						var result3 = validationService.validateAssetMasterFk($scope.currentItem, $scope.currentItem.AssetMasterFk, 'AssetMasterFk');
						platformRuntimeDataService.applyValidationResult(result3, $scope.currentItem, 'AssetMasterFk');

						return result1 === true && result2 === true && result3 === true;
					}
					return result1 === true && result2 === true;
				}

				// after init validation .

				updateValidation();

				angular.extend($scope.options, {
					body: {
						okBtnText: 'okBtnText'
					},
					onOK: function () {
						if ($scope.currentItem && ($scope.currentItem.ProjectFk || 0) > 0 && $scope.currentItem.PrcPackageTemplateFk &&
							(!$scope.options.packageCreationShowAssetMaster || ($scope.options.packageCreationShowAssetMaster && ($scope.currentItem.AssetMasterFk || 0) > 0))) {
							var number;
							var config = {
								// route: globals.webApiBaseUrl + 'procurement/package/package/list'
								route: globals.webApiBaseUrl + 'procurement/package/package/getpackagebyprojectfk?projectfk=' + $scope.currentItem.ProjectFk
							};
							// control ok btn .when waiting request.
							$scope.options.dialogLoading = true;

							$http({method: 'get', url: config.route, data: {}}).then(function (reloadData) {
								// for list
								// var items = _.filter(reloadData.data.Main, function (item) {
								// return item.ProjectFk === $scope.currentItem.ProjectFk;
								// });
								// number = items.length || 0;

								// for getpackagebyprojectfk ,Optimized for Check record.
								// console.log(reloadData.data);

								number = reloadData.data || 0;
								if (number === 0) {
									$scope.$close($scope.currentItem);
								} else {
									var bodyText = 'procurement.package.wizard.createPackageFromTemplate.warningMsg';
									if (number > 1) {
										bodyText = $translate.instant('procurement.package.wizard.createPackageFromTemplate.warningMsg')
											.replace('(number)', number).replace('(s)', 's').replace('(isORare)', 'are');
									} else {
										bodyText = $translate.instant('procurement.package.wizard.createPackageFromTemplate.warningMsg')
											.replace('(number)', number).replace('(s)', '').replace('(isORare)', 'is');
									}
									var headerTextKey = $translate.instant('procurement.package.wizard.createPackageFromTemplate.caption');
									var modalOptions = {
										headerText: headerTextKey,
										bodyText: bodyText,
										showYesButton: true,
										showNoButton: true,
										iconClass: 'ico-question',
										id: $injector.get('procurementContextService').showDialogTemp.createPackageFromTemplateDialogId,
										dontShowAgain: true
									};
									// restore ok btn .when return something.
									$scope.options.dialogLoading = false;

									$injector.get('procurementContextService').showDialogAndAgain(modalOptions).then(function (result) {
										if (result.yes) {
											$scope.$close($scope.currentItem);
										}
									});
								}
							});

						} else {
							platformRuntimeDataService.applyValidationResult(validationService.validateProjectFk($scope.currentItem, $scope.currentItem.ProjectFk, 'ProjectFk'), $scope.currentItem, 'ProjectFk');
							platformRuntimeDataService.applyValidationResult(validationService.validateAssetMasterFk($scope.currentItem, $scope.currentItem.AssetMasterFk, 'AssetMasterFk'), $scope.currentItem, 'AssetMasterFk');
							platformRuntimeDataService.applyValidationResult(validationService.validatePrcPackageTemplateFk($scope.currentItem, $scope.currentItem.PrcPackageTemplateFk, 'PrcPackageTemplateFk'), $scope.currentItem, 'PrcPackageTemplateFk');
						}
					},
					onCancel: function () {
						// clean module validation errors
						var modState = platformModuleStateService.state(packageDataService.getModule());
						modState.validation.issues = [];
						$scope.modalOptions.cancel();

					}
				});
			}]);
})(angular);
