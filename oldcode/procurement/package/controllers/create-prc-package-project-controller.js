/**
 * Created by wwa on 10/8/2015.
 */
(function (angular) {
	'use strict';
	var modulename = 'procurement.package';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('procurementPackageCreateProjectDialogController',
		['$scope', '$translate', 'platformTranslateService', 'platformRuntimeDataService', 'procurementPackageValidationService',
			'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', '_', 'platformUIStandardExtentService','platformDataValidationService',
			'$injector',
			function ($scope, $translate, platformTranslateService, platformRuntimeDataService, validationService,
				basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService, _, platformUIStandardExtentService,platformDataValidationService,
				$injector) {

				$scope.options = $scope.$parent.modalOptions;
				$scope.currentItem = {
					AssetMasterFk: null,
					ProjectFk: $scope.options.defaults.ProjectFk,
					ConfigurationFk: null,
					Description: null,
					StructureFk: $scope.options.defaults.StructureFk || -1,
					BasCurrencyFk: $scope.options.defaults.BasCurrencyFk || null,
					ClerkPrcFk: null, // reference StructureFk
					ClerkReqFk: null, // reference StructureFk
					TaxCodeFk: null, // reference StructureFk
					AssetMasterList: [], // for filter
					packageCreationShowAssetMaster: $scope.options.packageCreationShowAssetMaster, // for chose filter
					Code: null,
					Version: 0,
					isCreateByPackage: $scope.options.defaults.IsCreateByPackage
				};

			//	let config = basicsLookupdataLookupDescriptorService.getData('prcconfigurationbypkg');
				basicsLookupdataLookupDataService.getSearchList('prcconfiguration',' RubricFk=' + 31).then(function (data) {
						if(data){
								let packageConfig = _.sortBy(_.filter(data, function (item) {
									return item.RubricFk === 31;
								}), ['Sorting']);

								if (_.isNil($scope.currentItem.isCreateByPackage)) {
									let configuration = _.find(data, {Id: $scope.options.defaults.ConfigurationFk});
									if (configuration && configuration.PrcConfigHeaderFk) {
										packageConfig = _.filter(packageConfig, function (item) {
											return item.PrcConfigHeaderFk === configuration.PrcConfigHeaderFk;
										});
									}
								}

								if (_.isArray(packageConfig) && packageConfig.length >= 1) {
									let item = _.find(packageConfig, {IsDefault: true});
									if (item) {
										$scope.currentItem.ConfigurationFk = item.Id;
									} else {
										$scope.currentItem.ConfigurationFk = packageConfig[0].Id;
									}
									validationService.validateDialogConfigurationFk($scope.currentItem, $scope.currentItem.ConfigurationFk);
								}
						}
					});

				if ($scope.options.packageCreationShowAssetMaster) {
					basicsLookupdataLookupDataService.getList('AssertMaster').then(function (data) {
						$scope.currentItem.AssetMasterList = data;
					});
				}
				var project = _.find(basicsLookupdataLookupDescriptorService.getData('project'), {Id: $scope.currentItem.ProjectFk});
				if (project) {
					$scope.currentItem.AssetMasterFk = project.AssetMasterFk;
				}

				// var projectLookupDirective = $scope.options.packageCreationShowAssetMaster ?
				// 'basics-lookupdata-assetmaster-project-composite-lookup' : 'basics-lookup-data-project-project-dialog';

				var projectLookupDirective = 'basics-lookup-data-project-project-dialog';
				var formConfig = {
					'fid': 'procurement.package.create.project',  // create project
					'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
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
							'rid': 'projectfk',
							'gid': 'basicData',
							'label$tr$': 'cloud.common.entityProjectName',
							'label': 'Project Name',
							'type': 'directive',
							'model': 'ProjectFk',
							'validator': validateProjectFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': projectLookupDirective,
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'initValueField': 'ProjectNo',
									'lookupKey': 'prc-req-header-project-property',
									'filterKey': 'procurement-package-header-project-assetmasterfk-filter',
									'showClearButton': true
								}
							}
						},
						{
							'rid': 'structurefk',
							'gid': 'basicData',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'label': 'Procurement Structure',
							'type': 'directive',
							'model': 'StructureFk',
							'validator': validationService.validateDialogStructureFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'readOnly': true,
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'StructureCode',
									'showClearButton': true
								}
							}
						},
						{
							'rid': 'configurationfk',
							'gid': 'basicData',
							'label': 'Configuration',
							'label$tr$': 'procurement.package.entityConfiguration',
							'type': 'directive',
							'model': 'ConfigurationFk',
							'validator': validationService.validateDialogConfigurationFk,
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'procurement-package-configuration-filter'
							}
						},
						{
							'rid': 'code',
							'gid': 'basicData',
							'label': 'Code',
							'label$tr$': 'cloud.common.entityCode',
							'validator': validationService.validateDialogCode,
							'type': 'code',
							'model': 'Code'
						},
						{
							'rid': 'description',
							'gid': 'basicData',
							'label': 'Description',
							'label$tr$': 'cloud.common.entityDescription',
							'type': 'description',
							'model': 'Description',
							'domainSchemaProperty': {
								'moduleSubModule': 'Procurement.Package',
								'typeName': 'PrcPackageDto',
								'propertyName': 'Description'
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

				// translate form config.
				platformTranslateService.translateFormConfig(formConfig);
				platformUIStandardExtentService.extendFormConfig(formConfig);
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

				function updateValidation(noSetConfigurationFk) {

					var result1 = validationService.validateProjectFk($scope.currentItem, $scope.currentItem.ProjectFk, 'ProjectFk', true);
					platformRuntimeDataService.applyValidationResult(result1, $scope.currentItem, 'ProjectFk');

					var result2 = validationService.validateDialogStructureFk($scope.currentItem, $scope.currentItem.StructureFk, 'StructureFk', noSetConfigurationFk);
					platformRuntimeDataService.applyValidationResult(result2, $scope.currentItem, 'StructureFk');

					if ($scope.options.packageCreationShowAssetMaster) {
						var result3 = validationService.validateAssetMasterFk($scope.currentItem, $scope.currentItem.AssetMasterFk, 'AssetMasterFk');
						platformRuntimeDataService.applyValidationResult(result3, $scope.currentItem, 'AssetMasterFk');
						return result1 === true && result2 === true && result3 === true;
					}
					return result1 === true && result2 === true;
				}

				updateValidation(true);
				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.package.createDialogTitle')
				};
				$scope.modalOptions.ok = function onOK() {
					if (updateValidation(true)) {
						validationService.validateDialogCode($scope.currentItem, $scope.currentItem.Code, 'Code').then(function (result) {
							var isValid = result === true ? result : result.valid;
							if (!isValid) {
								$scope.isDisabled = true;
							} else {
								$scope.isDisabled = false;
								$scope.$close($scope.currentItem);
							}
						});

					}
				};
				$scope.modalOptions.close = onCancel;
				$scope.modalOptions.cancel = onCancel;

				function onCancel() {
					let dataService=$injector.get('procurementPackageDataService');
					platformDataValidationService.removeFromErrorList($scope.currentItem, 'ProjectFk', validationService, dataService);
					platformDataValidationService.removeFromErrorList($scope.currentItem, 'StructureFk', validationService, dataService);
					platformDataValidationService.removeFromErrorList($scope.currentItem, 'AssetMasterFk', validationService, dataService);
					$scope.$close(false);
				}

				var assetMasterFkPlatformValidation = $scope.$watch('currentItem.AssetMasterFk', function (nvalue, ovalue) {
					if (nvalue !== ovalue) {
						platformRuntimeDataService.applyValidationResult(validationService.validateAssetMasterFk($scope.currentItem, $scope.currentItem.AssetMasterFk, 'AssetMasterFk'), $scope.currentItem, 'AssetMasterFk');
					}
					$scope.isDisabled = isDisabledFn();
				});

				var projectFkPackageValidation = $scope.$watch('currentItem.ProjectFk', function () {

					$scope.isDisabled = isDisabledFn();
				});

				var structureFkPackageValidation = $scope.$watch('currentItem.StructureFk', function () {

					$scope.isDisabled = isDisabledFn();
				});

				// eslint-disable-next-line no-unused-vars
				var codeValidation = $scope.$watch('currentItem.Code', function (nvalue, ovalue) {
					validationService.validateDialogCode($scope.currentItem, $scope.currentItem.Code, 'Code').then(function (result) {
						platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'Code');
						var isValid = result === true ? result : result.valid;
						$scope.isDisabled = !isValid;
					});
					$scope.isDisabled = isDisabledFn();
				});

				function isDisabledFn() {

					var AssetMasterFk = $scope.currentItem.AssetMasterFk;
					var ProjectFk = $scope.currentItem.ProjectFk;
					var StructureFk = $scope.currentItem.StructureFk;
					var Code = $scope.currentItem.Code;

					if ($scope.options.packageCreationShowAssetMaster) {

						return (AssetMasterFk === -1 || ProjectFk === -1 || StructureFk === -1 || AssetMasterFk === null || ProjectFk === null || StructureFk === null || Code === null || Code === '');
					} else {

						return (ProjectFk === -1 || ProjectFk === null || Code === null || Code === '');
					}
				}

				$scope.$on('$destroy', function () {

					if (_.isFunction(assetMasterFkPlatformValidation)) {

						assetMasterFkPlatformValidation();
					}
					if (_.isFunction(projectFkPackageValidation)) {

						projectFkPackageValidation();
					}
					if (_.isFunction(structureFkPackageValidation)) {

						structureFkPackageValidation();
					}
					if (_.isFunction(codeValidation)) {

						codeValidation();
					}
				});

				function validateProjectFk(entity, value, model) {
					return validationService.validateProjectFk(entity, value, model, true);
				}

			}]);

})(angular);
