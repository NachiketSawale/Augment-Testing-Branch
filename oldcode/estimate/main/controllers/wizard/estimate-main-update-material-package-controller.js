/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateMainUpdateMaterialPackageWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard dialog used to update package prc item
	 * based on the line items in the estimation
	 **/
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainUpdateMaterialPackageWizardController',
		[   '_',
			'$scope',
			'$translate',
			'platformGridAPI',
			'estimateMainService',
			'estimateMainResourceService',
			'platformDialogService',
			'estimateMainUpdateMaterialPackageService',
			'WizardHandler',
			'platformTranslateService',
			'platformModalService','basicsCommonEstimateLineItemFieldsValue','basicsCommonUniqueFieldsProfileService',
			function (_, $scope,// jshint ignore:line
				$translate,
				platformGridAPI,
				estimateMainService,
				estimateMainResourceService,
				platformDialogService,
				estimateMainUpdateMaterialPackageService,
				WizardHandler,
				platformTranslateService,
				platformModalService,basicsCommonEstimateLineItemFieldsValue,basicsCommonUniqueFieldsProfileService
			) {

				let packageGridId = '0E159038D47E4B51887B472E26B956CF';
				$scope.aggregateProfileFlg = true;
				$scope.hideBoqGeneratePackageFlg = true;
				$scope.updateBudgetForExistedAssignmentFlg=false;
				$scope.isCopyBoqOutline = false;
				$scope.isCopyBoqSpecification= false;
				let lineItemSelectedItems=estimateMainService.getSelectedEntities();
				$scope.noLineItemSelected=lineItemSelectedItems.length>0?false:true;

				let identityName = 'generate.packageitem.from.lineitem';
				let uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName);
				let specialData = [{model: 'DescriptionInfo'}, {model: 'BasUomTargetFk'}];
				uniqueFieldsProfileService.setReadonlyData(specialData);
				$scope.serviceoptions={service:uniqueFieldsProfileService};
				init();
				function init() {
					uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);
					uniqueFieldsProfileService.reset();
				}

				function onSelectItemChanged() {
					let profile = uniqueFieldsProfileService.getSelectedItem();
					$scope.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
				}


				$scope.steps = [
					{number: 0, identifier: 'scopeLineItem', name: $translate.instant('estimate.main.updateMaterialPackageWizard.selectEstimateScope'),skip: false},
					{number: 1, identifier: 'packageUpdate', name: $translate.instant('estimate.main.updateMaterialPackageWizard.updateMaterialPackage'),skip: false}
				];

				$scope.wizard = $scope.options.value.wizard;
				$scope.wizardName = $scope.options.value.wizardName;
				$scope.entity = $scope.options.value.entity;

				$scope.onAggregateProfileFlg=function(value){
					$scope.aggregateProfileFlg=value;
				};

				$scope.onCopyBoqOutline=function(value){
					$scope.isCopyBoqOutline=value;
				};
				$scope.onCopyBoqSpecification=function(value){
					$scope.isCopyBoqSpecification=value;
				};

				$scope.getEnabledSteps = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};

				$scope.getCurrentStepNumber = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.currentStepNumber();
					} else {
						return '';
					}
				};
				$scope.getTotalStepCount = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.totalStepCount();
					} else {
						return '';
					}
				};
				$scope.getCurrentStepTitle = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz && wz.currentStepNumber()) {
						return wz.currentStepTitle();
					} else {
						return '';
					}
				};

				$scope.getNextStep = function getNextStep(titleOnly) {
					let wz = WizardHandler.wizard($scope.wizardName);
					let nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
					if (titleOnly) {
						return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
					} else {
						return nextStep;
					}
				};

				$scope.wzStrings = {
					cancel: $translate.instant('platform.cancelBtn'),
					finish: $translate.instant('estimate.main.createMaterialPackageWizard.resetBtn'),
					nextStep: $translate.instant('platform.wizard.nextStep')
				};

				$scope.entireEstimateValue=1;
				$scope.modeFlg=1;
				// region wizard navigation
				$scope.selectStep = angular.copy($scope.steps[0]);

				$scope.isLastStep = function () {
					if($scope.selectStep){
						return $scope.selectStep.number === $scope.steps.length - 1;
					}else{
						return true;
					}
				};

				$scope.isFirstStep = function () {
					return $scope.selectStep.number === 0;
				};

				$scope.previousStep = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					wz.previous();
					switch ($scope.selectStep.identifier) {
						case 'packageUpdate':
							setCurrentStep($scope.selectStep.number - 1);
							break;
					}
				};


				let currentAllPackages = [];
				function loadPackageGridData(itemData) {
					estimateMainUpdateMaterialPackageService.getPackageByEst(itemData).then(function(result) {
						let packageWithUpdateOptionList = result.data;
						_.forEach(packageWithUpdateOptionList,function(item){
							item.Selected = item.IsMaterial?item.IsMaterial:false;
							item.IsMaterial = _.isBoolean(item.IsMaterial)?String(item.IsMaterial):'';
							item.IsService = _.isBoolean(item.IsService)?String(item.IsService):'';
						});
						currentAllPackages = angular.copy(packageWithUpdateOptionList);
						if ($scope.hideBoqGeneratePackageFlg) {
							packageWithUpdateOptionList = _.filter(packageWithUpdateOptionList, function(p) {
								return !(p.IsMaterial === 'false' && p.IsService === 'true')&&p.ConfigurationIsMaterial;
							});
						}
						platformGridAPI.items.data(packageGridId, packageWithUpdateOptionList);
					});
				}

				$scope.onUpdateBudgetForExistedAssignmentFlg= function(value) {
					$scope.updateBudgetForExistedAssignmentFlg=value;
				};

				$scope.onHideBoqGeneratePackageFlg = function(value) {
					$scope.hideBoqGeneratePackageFlg=value;
					let currentPackageGrid= platformGridAPI.items.data(packageGridId);
					let copyPackageList=angular.copy(currentAllPackages);
					let packages = [];
					let packagesMap=_.keyBy(currentPackageGrid, function(o) {
						return o.Id;
					});
					_.forEach(copyPackageList,function(item){
						if(packagesMap[item.Id]){
							item.Selected=packagesMap[item.Id].Selected;
						}
						if($scope.hideBoqGeneratePackageFlg){
							if(!(item.IsMaterial === 'false' && item.IsService === 'true')&& item.ConfigurationIsMaterial){
								packages.push(item);
							}
						}
						else{
							packages.push(item);
						}
					});
					platformGridAPI.items.data(packageGridId, packages);
				};

				function updatePackageItem() {
					let aggregateProfileFlg = $scope.aggregateProfileFlg;
					let updateBudgetForExistedAssignmentFlg=$scope.updateBudgetForExistedAssignmentFlg;
					let sameItemMergeFlg = 1 === $scope.modeFlg;
					let allProfiles = uniqueFieldsProfileService.getSelectedItem().UniqueFields;
					let uniqueFields = _.filter(allProfiles, {
						isSelect: true
					}).map(function(field) {
						return {
							id: field.id,
							code: field.model
						};
					});
					let selectPackageIds = [];
					let grid = platformGridAPI.grids.element('id', packageGridId);
					let gridRows = grid.dataView.getRows();
					for (let index = 0; index < gridRows.length; index++) {
						let gridData = gridRows[index];
						if (gridData.Selected === true) {
							selectPackageIds.push(gridData.Id);
						}
					}
					if (selectPackageIds.length === 0) {
						platformDialogService.showMsgBox('estimate.main.createMaterialPackageWizard.noItemSelected', '', 'ico-info');
						return;
					}
					$scope.$parent.$close({isOk: true});

					let estimateValue=$scope.entireEstimateValue;
					let filterRequest=estimateMainService.getLastFilter();
					let selectIds=[];
					_.forEach(lineItemSelectedItems,function(item){
						selectIds.push(item.Id);
					});
					// let estLineItemId = estimateMainService.getSelected().Id;
					let paramPost = {
						filterRequest: filterRequest,
						resultSet: estimateValue,
						estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
						prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
						lineItemIds: selectIds,
						aggregateProfileFlg: aggregateProfileFlg,
						sameItemMergeFlg: sameItemMergeFlg,
						uniqueFieldsProfile: uniqueFields,
						updateBudgetForExistedAssignmentFlg:updateBudgetForExistedAssignmentFlg,
						packageIds: selectPackageIds,
						isCopyBoqOutline:$scope.isCopyBoqOutline,
						isCopyBoqSpecification:$scope.isCopyBoqSpecification,
					};
					estimateMainUpdateMaterialPackageService.updatePackage(paramPost).then(function(result) {
						if (result.data === 1) {
							platformModalService.showMsgBox('estimate.main.updateMaterialPackageWizard.updatePackageSuccess', 'cloud.common.informationDialogHeader', 'ico-info');
						}else{
							platformModalService.showMsgBox('estimate.main.updateMaterialPackageWizard.updatePackageFailure', 'cloud.common.informationDialogHeader', 'ico-error');
						}
						estimateMainResourceService.refreshData.fire();
					});
				}

				/** *package grid***/
				$scope.packageGrid = {
					state: packageGridId
				};
				function setTools(tools) {
					$scope.tools = tools || {};
					$scope.tools.update = function() {};
				}


				function setupPackageGrid() {
					let packageGridColumns = [{
						id: 'Selected',
						field: 'Selected',
						editor: 'boolean',
						formatter: 'boolean',
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						width: 70
					}, {

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					}, {
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true
					}, {
						id: 'Status',
						name: 'Status',
						name$tr$: 'estimate.main.createMaterialPackageWizard.status',
						width: 100,
						field: 'PackageStatusFk',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						},
						readonly: true
					}, {
						id: 'Configuration',
						field: 'ConfigurationFk',
						name: 'Configuration',
						name$tr$: 'estimate.main.createMaterialPackageWizard.configuration',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PrcConfiguration',
							'displayMember': 'DescriptionInfo.Translated'
						},
						width: 100,
						readonly: true
					},{
						id: 'IsMaterial',
						field: 'IsMaterial',
						name: 'IsMaterial',
						name$tr$: 'procurement.package.updateOption.isMaterial',
						formatter: 'description',
						width: 150,
						readonly: true
					}, {
						id: 'IsService',
						field: 'IsService',
						name: 'IsService',
						name$tr$: 'procurement.package.updateOption.isService',
						formatter: 'description',
						width: 150,
						readonly: true
					}];
					if (platformGridAPI.grids.exist(packageGridId)) {
						platformGridAPI.grids.unregister(packageGridId);
					}
					if (!platformGridAPI.grids.exist(packageGridId)) {
						for (let i = 0; i < packageGridColumns.length; i++) {
							let col = packageGridColumns[i];
							col.grouping = {
								title: col.name,
								getter: col.field,
								aggregators: [],
								aggregateCollapsed: true
							};
						}

						let packageGridConfig = {
							columns: angular.copy(packageGridColumns),
							data: [],
							id: packageGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								enableDraggableGroupBy: true

							},
							enableConfigSave: false
						};
						platformGridAPI.grids.config(packageGridConfig);
						platformTranslateService.translateGridConfig(packageGridConfig.columns);


						setTools({
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: [{
								id: 't16',
								sort: 10,
								caption: 'cloud.common.taskBarGrouping',
								type: 'check',
								iconClass: 'tlb-icons ico-group-columns',
								fn: function() {
									platformGridAPI.grouping.toggleGroupPanel(packageGridId, this.value);
								},
								value: platformGridAPI.grouping.toggleGroupPanel(packageGridId),
								disabled: false
							}, {
								id: 't4',
								caption: 'cloud.common.toolbarSearch',
								type: 'check',
								value: platformGridAPI.filters.showSearch(packageGridId),
								iconClass: 'tlb-icons ico-search',
								fn: function() {
									platformGridAPI.filters.showSearch(packageGridId, this.value);
								}
							}]
						});
					}
				}
				$scope.nextStep = function() {
					let wz = WizardHandler.wizard($scope.wizardName);
					let goNext=true;
					let estimateValue=$scope.entireEstimateValue;
					let filterRequest=estimateMainService.getLastFilter();
					// let projectId = estimateMainService.getSelectedProjectId();
					let selectIds=[];
					_.forEach(lineItemSelectedItems,function(item){
						selectIds.push(item.Id);
					});
					let _selectedIds=2===estimateValue?selectIds:[];
					switch ($scope.selectStep.number) {
						case 0:
							var itemData = {
								filterRequest: filterRequest,
								resultSet: estimateValue,
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
								lineItemIds: _selectedIds
							};
							setupPackageGrid();
							loadPackageGridData(itemData);
							updateDynamicUniqueFields();
							wz.next();
							break;
						case 1:
							updatePackageItem();
							wz.next();
							break;
						default:
					}
					if(goNext) {
						setCurrentStep($scope.selectStep.number + 1);
					}
				};


				function setCurrentStep(step) {
					$scope.selectStep = angular.copy($scope.steps[step]);
				}

				$scope.getButtonText = function () {
					if ($scope.isLastStep()) {
						return $translate.instant('basics.common.button.ok');
					}

					return $translate.instant('basics.common.button.nextStep');
				};

				// endregion

				// un-register on destroy
				$scope.$on('$destroy', function () {
					uniqueFieldsProfileService.reset();
					uniqueFieldsProfileService.selectItemChanged.unregister(onSelectItemChanged);
					if (platformGridAPI.grids.exist(packageGridId)) {
						platformGridAPI.grids.unregister(packageGridId);
					}
				});

				$scope.close = function () {
					$scope.$parent.$close(false);
				};
				function getUniqueFields(dynamicUniqueFields){
					// let arrModels=['DescriptionInfo','BasUomTargetFk','MdcControllingUnitFk','LicCostGroup1Fk','LicCostGroup2Fk','LicCostGroup3Fk','LicCostGroup4Fk','LicCostGroup5Fk','PrjCostGroup1Fk','PrjCostGroup2Fk','PrjCostGroup3Fk','PrjCostGroup4Fk','PrjCostGroup5Fk'];
					let arrModels=['DescriptionInfo','BasUomTargetFk','MdcControllingUnitFk'];
					let allFileds=angular.copy(basicsCommonEstimateLineItemFieldsValue.getWithDynamicFields(dynamicUniqueFields));
					let packcageFields= _.filter(allFileds,function(item){
						if (item.id) {
							return true;
						}
						if(_.indexOf(arrModels,item.model)>-1) {
							item.isSelect=false;
							if(item.model==='DescriptionInfo'||item.model==='BasUomTargetFk'){
								item.isSelect=true;
							}
							return true;
						}
						return false;
					});
					return packcageFields;
				}

				$scope.entity.uniqueFields=getUniqueFields();

				$scope.onResult=function(value){
					$scope.entireEstimateValue=value;
				};

				$scope.onModeResult = function (value) {
					$scope.modeFlg = value;
				};

				function updateDynamicUniqueFields() {
					let dynamicUniqueFields = [];
					let projectId = estimateMainService.getSelectedProjectId() || -1;
					return estimateMainUpdateMaterialPackageService.getDynamicUniqueFields(projectId).then(function (response) {
						if (!response) {
							return dynamicUniqueFields;
						}
						let lic = response.data.LicCostGroupCats;
						let prjCostGroup = response.data.PrjCostGroupCats;
						if(lic&&prjCostGroup) {
							let allCats = _.concat(lic, prjCostGroup);
							let showCats = [];
							_.forEach(allCats, function (item) {
								showCats.push({
									Id: item.Id,
									Code: item.Code
								});
							});
							dynamicUniqueFields = showCats;
						}
						return dynamicUniqueFields;
					}).finally(function () {
						let fields = getUniqueFields(dynamicUniqueFields);
						$scope.entity.uniqueFields = fields;
						uniqueFieldsProfileService.updateDefaultFields(fields);
						uniqueFieldsProfileService.load();
					});
				}

			}]);
})(angular);
