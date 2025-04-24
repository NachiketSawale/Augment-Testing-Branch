/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _,$ */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateMainBidCreationWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard dialog used to collect the settings and informations to be able to create a bid
	 * based on the current status of the line items in the estimation
	 **/
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainCreateMaterialPackageWizardController',
		['$scope',
			'$http',
			'$q',
			'$injector',
			'$translate',
			'platformGridAPI',
			'$timeout',
			'estimateMainService',
			'platformDialogService',
			'estimateMainCreateMaterialPackageService',
			'WizardHandler',
			'procurementContextService',
			'platformTranslateService',
			'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService',
			'estimateMainPrcPackage2HeaderLookupDataService',
			'cloudDesktopSidebarService',
			'estimateMainFilterCommon',
			'basicsCommonEstimateLineItemFieldsValue',
			'basicsCommonUniqueFieldsProfileService',
			'procurementPackageNumberGenerationSettingsService',
			'basicsLookupdataLookupDescriptorService',
			'packageOptionsProfileService',
			'cloudCommonGridService',
			'estimateMainCreatePackageMatchnessTypeConstant',
			'estimateMainCreatePackageModeConstant',
			function ($scope,// jshint ignore:line
				$http,
				$q,
				$injector,
				$translate,
				platformGridAPI,
				$timeout,
				estimateMainService,
				platformDialogService,
				estimateMainCreateMaterialPackageService,
				WizardHandler,
				moduleContext,
				platformTranslateService,
				basicsLookupdataLookupFilterService,
				platformRuntimeDataService,
				estimateMainPrcPackage2HeaderLookupDataService,
				cloudDesktopSidebarService,
				estimateMainFilterCommon,
				basicsCommonEstimateLineItemFieldsValue,
				basicsCommonUniqueFieldsProfileService,
				procurementPackageNumberGenerationSettingsService,
				basicsLookupdataLookupDescriptorService,
				packageOptionsProfileService,
				cloudCommonGridService,
				matchnessTypeConstant,
				modeConstant
			) {
				let filters =[];
				let simulationGridId = '17060CA12C09451FA5D20AF9608083A8';
				let tempSimulationData = [];
				$scope.path = globals.appBaseUrl;
				let lineItemSelectedItems = estimateMainService.getSelectedEntities();
				const typesOfCriteria = {
					costCode: { mdcCostCode: 0, prjCostCode: 1 },
					mdcCatalogNGroup: { mdcGroup: 0, mdcCatalog: 1 },
					materialNCostCode: { material: 0, mdcCostCode: 1, prjCostCode: 2 },
				};
				$scope.noLineItemSelected = lineItemSelectedItems.length <= 0;
				$scope.isSelectedReferenceLineItem = true;
				$scope.isSelectMultiPackageAssignmentModel=false;
				$scope.isAllResultTobeChosen=false;
				$scope.isLoading = false;
				$scope.selections = {
					valueMember: 'value',
					displayMember: 'name',
					items: [
						{
							name: $translate.instant('estimate.main.createMaterialPackageWizard.procurementStr'),
							value: 'Procurement Structure'
						},
						{
							name: $translate.instant('estimate.main.createMaterialPackageWizard.costCode'),
							value: 'Cost Code'
						},
						{
							name: $translate.instant('estimate.main.createMaterialPackageWizard.materialCatalogAndGroup'),
							value: 'Material Catalog & Group'
						},
						{
							name: $translate.instant('estimate.main.createMaterialPackageWizard.materialCostCode'),
							value: 'Material & Cost Code'
						}
					]
				};


				let identityName = 'generate.packageitem.from.lineitem';
				let uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName);
				let specialData = [{model: 'DescriptionInfo'}, {model: 'BasUomTargetFk'}];
				uniqueFieldsProfileService.setReadonlyData(specialData);
				$scope.serviceoptions = {service: uniqueFieldsProfileService};
				let optionsProfileService=packageOptionsProfileService;


				init();

				function init() {
					uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);
					uniqueFieldsProfileService.reset();
					optionsProfileService.selectItemChanged.register(onSelectOptionItemChanged);
					optionsProfileService.reset();
				}

				function onSelectItemChanged() {
					let profile = uniqueFieldsProfileService.getSelectedItem();
					$scope.updateOptions.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
				}

				const unwatch =$scope.$watch('hasNewItem', function (newValue) {
					let profile = optionsProfileService.getSelectedItem();
					if(profile){
						let propertyconfig = profile.PropertyConfig;
						if(propertyconfig){
							let optionItem = JSON.parse(propertyconfig);
							if(newValue){
								$scope.updateOptions.onePackageFlg = optionItem.onePackageFlg;
								$scope.updateOptions.eachMaterialCatalogFlg=optionItem.eachMaterialCatalogFlg;
							}
							else{
								$scope.updateOptions.onePackageFlg =false;
								$scope.updateOptions.eachMaterialCatalogFlg=false;
							}
						}
					}
				});

				const unwatchPackageDescription = $scope.$watch('packageOption.description', function (newValue) {
					$scope.packageOption.subpackageDescription=newValue;
				});

				const unwatchOnePackage = $scope.$watch('updateOptions.onePackageFlg', function (newValue) {
					setDefaultStructure();
					packageOptionPanelShowOrNot();
				});

				function updatePackageOptionByStructureId(structureId){
					setConfiguration(structureId);
					let structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: structureId});
					if (structure) {
						$scope.packageOption.subpackageDescription = structure.DescriptionInfo.Translated;
						$scope.packageOption.description = structure.DescriptionInfo.Translated;
					} else {
						basicsLookupdataLookupDescriptorService.getItemByKey('prcstructure', structureId).then(function (structureItem) {
							if (structureItem) {
								$scope.packageOption.subpackageDescription = structureItem.DescriptionInfo.Translated;
								$scope.packageOption.description = structureItem.DescriptionInfo.Translated;
							}
						});
					}
				}

				function setDefaultStructure() {
					if ($scope.updateOptions.onePackageFlg) {
						let gridDatas = platformGridAPI.items.data(simulationGridId);
						let selectedData = _.filter(gridDatas, function (item) {
							return item.Selected && item.StructureCodeFk > 0;
						});
						let structureIds = _.uniq(_.map(selectedData, 'StructureCodeFk'));
						if (structureIds.length === 1) {
							const structureId=structureIds[0];
							$scope.packageOption.procurementstructureId = structureId;
							updatePackageOptionByStructureId(structureId);
						} else {
							$scope.packageOption.procurementstructureId = null;
						}
					} else {
						$scope.packageOption.procurementstructureId = null;
					}
					//cause by structure ui not refresh immediately
					$timeout(function () {
						$scope.$apply();
					});
				}

				function onSelectOptionItemChanged() {
					let profile = optionsProfileService.getSelectedItem();
					if(profile) {
						$scope.updateOptions.optionProfile =optionsProfileService.getDescription(profile);
						let propertyconfig = profile.PropertyConfig;
						let changeUniqueProfile=null;
						if (propertyconfig) {
							let optionItem = JSON.parse(propertyconfig);
							if($scope.hasNewItem) {
								$scope.updateOptions.onePackageFlg = optionItem.onePackageFlg;
								$scope.updateOptions.eachMaterialCatalogFlg = optionItem.eachMaterialCatalogFlg;
							}
							else{
								$scope.updateOptions.onePackageFlg =false;
								$scope.updateOptions.eachMaterialCatalogFlg =false;
							}

							$scope.updateOptions.generateItemFlg = optionItem.generateItemFlg;
							$scope.updateOptions.aggregateProfileFlg = optionItem.aggregateProfileFlg;
							$scope.updateOptions.generateCostcodeFlg = optionItem.generateCostcodeFlg;
							$scope.updateOptions.freeQuantityFlg = optionItem.freeQuantityFlg;
							$scope.updateOptions.isCopyBoqOutline = optionItem.isCopyBoqOutline;
							$scope.updateOptions.isCopyBoqSpecification = optionItem.isCopyBoqSpecification;
							if (optionItem.uniqueFieldsProfile && optionItem.uniqueFieldsProfile.length > 0) {
								changeUniqueProfile = optionItem.uniqueFieldsProfile;
							} else {
								const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
								resetToDefaultSetting();
								changeUniqueProfile= newProfileName;
							}
						}
						else{
							const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
							resetToDefaultSetting();
							changeUniqueProfile = newProfileName;
						}
						if(changeUniqueProfile) {
							uniqueFieldsProfileService.setSelectedItemDesc(changeUniqueProfile);
							var exist = uniqueFieldsProfileService.getSelectedItem();
							if (!exist) {
								const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
								resetToDefaultSetting();
								changeUniqueProfile= newProfileName;
								uniqueFieldsProfileService.setSelectedItemDesc(changeUniqueProfile);
							}
						}
					}
				}

				function resetToDefaultSetting(){
					$scope.updateOptions.onePackageFlg=false;
					$scope.updateOptions.eachMaterialCatalogFlg=false;
					$scope.updateOptions.generateItemFlg=true;
					$scope.updateOptions.generateCostcodeFlg=false;
					$scope.updateOptions.aggregateProfileFlg=true;
					$scope.updateOptions.freeQuantityFlg=false;
				}


				$scope.steps = [
					{
						number: 0,
						identifier: 'basicSeting',
						name: $translate.instant('estimate.main.createMaterialPackageWizard.createMaterialPackage'),
						skip: false
					},
					{
						number: 1,
						identifier: 'criteriaSelection',
						name: $translate.instant('estimate.main.createMaterialPackageWizard.criteriaSelection'),
						skip: false
					},
					{
						number: 2,
						identifier: 'packageAssignment',
						name: $translate.instant('estimate.main.createMaterialPackageWizard.packageAssignment'),
						skip: false
					}
				];

				// $scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';
				// $scope.wizard = $scope.modalOptions.value.wizard;
				$scope.wizard = $scope.options.value.wizard;
				$scope.wizardName = $scope.options.value.wizardName;
				$scope.entity = $scope.options.value.entity;

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

				$scope.entireEstimateValue = 1;
				$scope.rootLevelDisable = true;
				$scope.rootLevelFlg = false;
				$scope.updateOptions = {
					onePackageFlg: false,
					eachMaterialCatalogFlg: false,
					generateItemFlg: true,
					generateCostcodeFlg: false,
					aggregateProfileFlg: true,
					freeQuantityFlg: false,
					isCopyBoqOutline: false,
					isCopyBoqSpecification: false
				};

				$scope.serviceoptions1 = {
					service: optionsProfileService,
					type: 'material'
				};

				$scope.modeFlg = modeConstant.InclusiveMode;
				$scope.selectedItem = $scope.selections.items[0].value;
				$scope.includeMarkUpCostFlg = false;
				$scope.includeMaterial=true;
				$scope.includeDirectCost=true;
				$scope.includeInDirectCost=true;
				$scope.packageOption ={
					procurementstructureId:null,
					configurationId:null,
					responsibleId:null,
					code:'',
					reference:'',
					subpackageDescription:''
				};
				$scope.config={};
				$scope.config.rt$readonly=function(){
					return !$scope.updateOptions.onePackageFlg;
				};
				$scope.prcStructureLookupOptions = {
					lookupDirective:'basics-procurementstructure-structure-dialog',
					lookupOptions:{
						showClearButton: true,
						// readOnly:!$scope.updateOptions.onePackageFlg,
						'events': [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem) {
									let structureId = args.selectedItem.Id;
									updatePackageOptionByStructureId(structureId);
								}
							}
						}]
					},
					descriptionMember:'DescriptionInfo.Translated'
				};
				$scope.clerkLookupOptions={
					lookupDirective:'cloud-clerk-clerk-dialog',
					lookupOptions:{
						showClearButton: true
					},
					descriptionMember:'Description'
				};
				$scope.configurationChange=function(){
					validateConfigurationFk();
				};
				function setConfiguration(strValue){
					let filter='';
					if(strValue){
						filter='structureId='+strValue+'&';
					}
					filter=filter+'rubricId=31&isMaterial=true';
					$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getByStructure?' + filter).then(function (response) {
						$scope.packageOption.configurationId = response.data;
						validateConfigurationFk();
					});
				}
				$scope.codeReadOnly=false;
				function validateConfigurationFk(){
					var code=$scope.packageOption.code;
					var value=$scope.packageOption.configurationId;
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					if(config) {
						$scope.codeReadOnly = procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
						$scope.packageOption.code = procurementPackageNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, code);
					}
				}
				function loadResponsible(){
					$http.get(globals.webApiBaseUrl + 'basics/clerk/clerkByClient').then(function (response) {
						if(response.data) {
							$scope.packageOption.responsibleId = response.data.Id;
						}
					});
				}

				function loadPrcConfiguration() {
					let defer = $q.defer();
					let prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
					if (prcConfigurations && prcConfigurations.length) {
						defer.resolve(true);
					}
					else {
						basicsLookupdataLookupDescriptorService.loadData('prcconfiguration').then(function () {
							defer.resolve(true);
						});
					}
					return defer.promise;
				}

				let criteriaGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						editor: 'boolean',
						formatter: 'boolean',
						width: 70
					},
					{

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 90,
						formatter: 'description',
						sortable: true
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true,
						sortable: true
					},
					{
						id: 'Type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'cloud.common.entityType',
						width: 100,
						formatter: 'lookup',
						sortable: true,
						formatterOptions: {
							lookupType: 'PrcStructureType',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'basicsProcurementStructureImageProcessor'
						}
					}
				];

				let criteriaGridId = 'AA6AC85D1D3F4BAD86CF56B7CE1A2E9D';
				let selectedGridId = criteriaGridId;
				$scope.selectItemForPackage = {
					state: criteriaGridId
				};

				function setupSelectedGrid(gridId, columns) {
					if (platformGridAPI.grids.exist(selectedGridId)) {
						platformGridAPI.events.unregister(selectedGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						platformGridAPI.events.unregister(selectedGridId, 'onCellChange', onCellChange);
						platformGridAPI.grids.unregister(selectedGridId);
					}
					selectedGridId = gridId;
					if (!platformGridAPI.grids.exist(selectedGridId)) {
						let selectedGridConfig = {
							columns: angular.copy(columns),
							data: [],
							id: selectedGridId,
							lazyInit: true,
							options: {
								tree: true,
								parentProp: 'ParentFk',
								childProp: 'resultChildren',
								hierarchyEnabled: true,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(selectedGridConfig);
						platformTranslateService.translateGridConfig(selectedGridConfig.columns);
						platformGridAPI.events.register(selectedGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						platformGridAPI.events.register(selectedGridId, 'onCellChange', onCellChange);
					}
				}

				function gridCheckReadOnlyOrNot(objData) {
					let selectedData = objData.gridData;
					let ids = objData.ids;
					if (ids && modeConstant.DistinctMode === $scope.modeFlg) {
						setItemReadOnlyOrNot(selectedData, ids);
					}
				}

				function setItemReadOnlyOrNot(data, ids, defaultSelected) {
					_.forEach(data, function (item) {
						if (!_.isNil(defaultSelected)) {
							item.Selected = defaultSelected;
						}
						if (modeConstant.DistinctMode === $scope.modeFlg && ids.indexOf(item.Id) <= -1 && item.Id !== -1) {
							item.Selected = 'readonly';
							setReadOnly(item, 'Selected', true);
						} else {
							setReadOnly(item, 'Selected', false);
						}
						if (item.resultChildren && item.resultChildren.length > 0) {
							setItemReadOnlyOrNot(item.resultChildren, ids, defaultSelected);
						}
					});
				}

				function updateSelectedGrid(selectedData) {
					platformGridAPI.grids.invalidate(selectedGridId);
					platformGridAPI.items.data(selectedGridId, selectedData);
					platformGridAPI.items.sort(selectedGridId, 'Code', 'sort-asc');
				}

				/** *****************cost code***************/
				let costCodeSelectionGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						headerChkbox: true,
						toolTip: 'Select',
						focusable: false,
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						editor: 'boolean',
						formatter: 'boolean',
						width: 70
					},
					{

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 100,
						sortable: true,
						formatter: 'description'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true,
						sortable: true
					}, {
						id: 'CostCodeTypeFk',
						field: 'CostCodeTypeFk',
						name: 'CostCodeTypeFk',
						name$tr$: 'cloud.common.entityType',
						width: 100,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.costcodes.costcodetype',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						sortable: true
					}
				];

				let costCodeSelectionGridId = '19EE5456F085450F8A5BAE37A43E1B64';

				function updateCostCodeSelectionGrid(selectedData) {
					if (!$scope.includeMarkUpCostFlg) {
						selectedData = filterMarkUpCostItem(selectedData);
					}
					updateSelectedGrid(selectedData);
				}

				/** ****************materialGroup***************/
				let materialGroupGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						editor: 'boolean',
						formatter: 'boolean',
						width: 70
					},
					{

						id: 'Code1',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						sortable: true,
						width: 90
					},
					{
						id: 'Description1',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120,
						readonly: true,
						sortable: true
					}
				];

				let materialGroupGridId = '9087D34E3CFC49DE86A55A2577100609';

				function doItemCheck(item) {
					if (item.resultChildren && item.resultChildren.length) {
						let checkedItems = [], unCheckedItems = [];

						item.resultChildren.forEach(function (item) {
							let isChecked = doItemCheck(item);

							if (isChecked === true) {
								checkedItems.push(item);
							} else {
								unCheckedItems.push(item);
							}
						});
						if (checkedItems.length === item.resultChildren.length) {
							item.Selected = true;
						} else if (unCheckedItems.length === item.resultChildren.length) {
							item.Selected = false;
						} else {
							item.Selected = false;
						}
					}
					return item.Selected;
				}

				function onCellChange(e, arg) {
					let propertyName = platformGridAPI.columns.configuration(selectedGridId).visible[arg.cell].field;
					let selectItem = platformGridAPI.rows.selection({
						gridId: selectedGridId
					});
					let checked = selectItem.Selected;
					if ('Selected' === propertyName) {
						checkChildren(selectItem, checked);
						if (modeConstant.InclusiveMode === $scope.modeFlg && !checked) {
							let allitems = platformGridAPI.items.data(selectedGridId);
							allitems.forEach(doItemCheck);
						}
						platformGridAPI.grids.invalidate(selectedGridId);
						platformGridAPI.grids.refresh(selectedGridId);
						isRootLevelSelected();
						$scope.$apply();
					}
				}

				function isRootLevelSelected() {
					let grid = platformGridAPI.grids.element('id', selectedGridId);
					let gridDatas = grid.dataView.getRows();
					let findChild = _.find(gridDatas, function (item) {
						if (item.ParentFk !== -1 && item.Selected) {
							return true;
						}
					});
					if (modeConstant.InclusiveMode === $scope.modeFlg) {
						if (_.isEmpty(findChild)) {
							$scope.rootLevelDisable = true;
						} else {
							$scope.rootLevelDisable = false;
						}
						$scope.rootLevelFlg = false;
					}
				}

				function onHeaderCheckboxChange(e) {
					let data = platformGridAPI.items.data(selectedGridId);
					let isChecked = e.target.checked;
					_.forEach(data, function (item) {
						item.IsSelected = isChecked;
						checkChildren(item, isChecked);
					});
					isRootLevelSelected();
					platformGridAPI.grids.invalidate(selectedGridId);
					platformGridAPI.grids.refresh(selectedGridId);
					$scope.$apply();
				}


				/** ****************material*************/
				let materialGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						editor: 'boolean',
						formatter: 'boolean',
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						width: 60
					},
					{

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'description'
					},
					{

						id: 'Type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'cloud.common.entityType',
						readonly: true,
						width: 70,
						formatter: function (row, cell, value) {
							let imgSrc = value >= 1 ? 'ico-ccode02' : 'ico-resource18';
							let imgPath = '<img src="cloud.style/content/images/type-icons.svg#' + imgSrc + '"/>';
							let txt = value >= 1 ? $translate.instant('estimate.main.createMaterialPackageWizard.costCode') : $translate.instant('estimate.main.createMaterialPackageWizard.material');
							return imgPath + '<span class="pane-r">' + txt + '</span>';
						}
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						sortable: true,
						width: 150,
						readonly: true
					},
					{
						id: 'Description2',
						field: 'Description2',
						name: 'Description2',
						name$tr$: 'estimate.main.createMaterialPackageWizard.entityFurtherDescription',
						formatter: 'description',
						sortable: true,
						width: 130,
						readonly: true
					},
					{

						id: 'MdcGroupCode',
						field: 'MdcGroupCode',
						name: 'Material Group Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.materialGroupCode',
						readonly: true,
						sortable: true,
						width: 70,
						formatter: 'description'
					},
					{
						id: 'MdcGroupDescription',
						field: 'MdcGroupDescription',
						name: 'Material Group Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.materialGroupDescription',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'description'
					},
					{

						id: 'StructureCode',
						field: 'StructureCode',
						name: 'Structure Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
						readonly: true,
						sortable: true,
						width: 80,
						formatter: 'description'
					},
					{
						id: 'StructureDescription',
						field: 'StructureDescription',
						name: 'Structure Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'BusinessPartner',
						field: 'BusinessPartnerFk',
						name: 'Business Partner',
						name$tr$: 'estimate.main.createMaterialPackageWizard.businessPartner',
						sortable: true,
						width: 100,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.lookup.businesspartner',
							displayMember: 'BP_NAME1',
							valueMember: 'Id'
						}
					},{
						id: 'IndirectCost',
						field: 'InDirectCost',
						name: 'Indirect Cost',
						name$tr$: 'estimate.main.isIndirectCost',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'boolean'
					},
					{
						id: 'IsCost',
						field: 'IsCost',
						name: 'Is Cost',
						name$tr$: 'estimate.main.isCost',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'boolean'
					}
				];

				let materialGridId = '55C2B8E88DDF4742BBF8AD28E2B8A272';

				function setTools(tools) {
					$scope.tools = tools || {};
					$scope.tools.update = function () {
					};
				}

				function setupMaterialGrid() {
					if (platformGridAPI.grids.exist(materialGridId)) {
						platformGridAPI.events.unregister(materialGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						platformGridAPI.grids.unregister(materialGridId);
					}
					if (!platformGridAPI.grids.exist(materialGridId)) {
						for (let i = 0; i < materialGridColumns.length; i++) {
							let col = materialGridColumns[i];
							col.grouping = {
								title: col.name,
								getter: col.field,
								aggregators: [],
								aggregateCollapsed: true
							};
						}

						let materialGridConfig = {
							columns: angular.copy(materialGridColumns),
							data: [],
							id: materialGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								enableDraggableGroupBy: true,
								enableColumnSort:true
							},
							enableConfigSave: false
						};
						platformGridAPI.grids.config(materialGridConfig);
						platformTranslateService.translateGridConfig(materialGridConfig.columns);

						setTools(
							{
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								items: [
									{
										id: 't4',
										caption: 'cloud.common.toolbarSearch',
										type: 'check',
										value: platformGridAPI.filters.showSearch(materialGridId),
										iconClass: 'tlb-icons ico-search',
										fn: function () {
											platformGridAPI.filters.showSearch(materialGridId, this.value);
										}
									},
									{
										id: 't16',
										sort: 10,
										caption: 'cloud.common.taskBarGrouping',
										type: 'check',
										iconClass: 'tlb-icons ico-group-columns',
										fn: function () {
											platformGridAPI.grouping.toggleGroupPanel(materialGridId, this.value);
										},
										value: platformGridAPI.grouping.toggleGroupPanel(materialGridId),
										disabled: false
									}
								]
							});
					}
				}

				function updateMaterialGrid(selectedData) {
					if (!$scope.includeMarkUpCostFlg) {
						selectedData = _.filter(selectedData, function (item) {
							return (0 === item.TypeFk) || (item.TypeFk > 0 && item.IsCost);
						});
					}
					platformGridAPI.grids.invalidate(materialGridId);
					platformGridAPI.items.data(materialGridId, selectedData);
				}

				/** ****************simulation*************/
				let simulationGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'New',
						sortable: true,
						name$tr$: 'estimate.main.createMaterialPackageWizard.new',
						editor: 'boolean',
						formatter: 'boolean',
						width: 35
					},
					{
						id: 'Merge',
						field: 'Merge',
						name: 'Merge Update',
						name$tr$: 'estimate.main.createMaterialPackageWizard.mergeUpdate',
						editor: 'boolean',
						sortable: true,
						formatter: 'boolean',
						width: 70
					},
					{
						id: 'Matchness',
						field: 'Matchness',
						name: 'Matchness',
						name$tr$: 'estimate.main.createMaterialPackageWizard.matchness',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'StructureCode',
						field: 'Code',
						name: 'Structure Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
						readonly: true,
						sortable: true
					},
					{
						id: 'StructureDescription',
						name: 'Structure Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
						width: 140,
						field: 'Description',
						readonly: true,
						sortable: true
					},
					{
						id: 'Status',
						name: 'Status',
						name$tr$: 'estimate.main.createMaterialPackageWizard.status',
						width: 90,
						field: 'PackageStatusFk',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						},
						sortable: true
					},
					{
						id: 'PackageCode',
						name: 'Package Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.packageCode',
						width: 90,
						editor: 'dynamic',
						formatter: 'dynamic',
						sortable: true,
						domain: function (item, column) {
							let disableInput = matchnessTypeConstant.New === item.MatchnessType;
							let domain;
							domain = 'lookup';
							column.field = 'PackageCodeFk';
							column.editorOptions = {
								// procurementPackagePackageWithOptionLookupDialogNew
								lookupDirective: 'procurement-package-package-with-option-lookup-dialog-new',
								'disableInput': disableInput,
								lookupOptions: {
									// 'filterKey': 'prc-package-filter',
									'events': [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												let selectedItem = args.selectedItem;
												if (selectedItem) {
													if (disableInput) {// new
														args.entity.Selected = false;
														setReadOnly(args.entity, 'Selected', false);
														setReadOnly(args.entity, 'ClerkPrcFk', true);
														setReadOnly(args.entity, 'ConfigurationFk', true);
													}
													args.entity.ConfigurationFk = args.selectedItem.ConfigurationFk;
													args.entity.ClerkPrcFk = args.selectedItem.ClerkPrcFk;
													args.entity.PackageDescriptionFk = args.selectedItem.Id;
													args.entity.PackageCodeFk = args.selectedItem.Id;
													args.entity.PackageStatusFk = args.selectedItem.PackageStatusFk;
													args.entity.StructureCodeFk =args.selectedItem.StructureFk;
													let firstData = angular.copy(_.find(tempSimulationData, {'Id': args.entity.Id}));
													if(firstData.PackageCodeFk!==args.entity.PackageCodeFk) {
														args.entity.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.userSpecified');
														args.entity.MatchnessType= matchnessTypeConstant.UserSpecified;
													}
													else if(!disableInput){
														args.entity.Matchness = firstData.Matchness;
														args.entity.StructureCodeFk=firstData.MatchnessType;
													}

													if (!args.selectedItem.ClerkPrcFk) {
														estimateMainCreateMaterialPackageService.getClerkPrc(args.selectedItem).then(function (rep) {
															args.entity.ClerkPrcFk = rep.data;
														});
													}

													let filterString = estimateMainPrcPackage2HeaderLookupDataService.getFilterString({
														projectId: selectedItem.ProjectFk,
														prcPackageId: selectedItem.Id
													});
													estimateMainPrcPackage2HeaderLookupDataService.readData(filterString).then(function (response) {
														let subPackages = _.get(response, 'data');
														args.entity.SubPackageFk = _.some(subPackages) ? _.first(subPackages).Id : null;
													});
													if(args.entity.Merge) {
														updateSimulationGridByMerge();
													}
												}
											}
										}
									]
								}

							};
							column.formatterOptions = {
								lookupType: 'PrcPackage',
								displayMember: 'Code'
							};
							return domain;
						}
					},
					{
						id: 'PackageDescription',
						name: 'Package Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.packageDescription',
						width: 100,
						sortable: true,
						'editor': 'dynamic',
						formatter: 'dynamic',
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							let domain;
							if (matchnessTypeConstant.New !== item.MatchnessType) {
								domain = 'lookup';
								column.field = 'PackageDescriptionFk';
								column.editorOptions = {
									lookupDirective: 'procurement-common-package-lookup'
								};
								column.formatterOptions = {
									lookupType: 'PrcPackage',
									displayMember: 'Description'
								};
								column.readonly = true;
							} else {
								domain = 'description';
								column.field = 'PackageDescription';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.readonly = false;
							}
							return domain;
						}

					},
					{
						id: 'SubPackage',
						name: 'Sub Package',
						name$tr$: 'estimate.main.createMaterialPackageWizard.subPackage',
						editor: 'dynamic',
						formatter: 'dynamic',
						sortable: true,
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							let domain;
							if (matchnessTypeConstant.New !== item.MatchnessType) {
								domain = 'lookup';
								column.field = 'SubPackageFk';
								column.editorOptions = {
									lookupDirective: 'procurement-package-package2-header-combobox',
									lookupOptions: {
										'filterKey': 'sub-package-filter'
									}
								};
								column.formatterOptions = {
									lookupType: 'prcpackage2header',
									valMember: 'Id',
									displayMember: 'Description'
								};
							} else {
								domain = 'description';
								column.field = 'SubPackage';
								column.editorOptions = null;
								column.formatterOptions = null;
							}
							return domain;
						},
						width: 100
					},
					{
						id: 'Configuration',
						field: 'ConfigurationFk',
						name: 'Configuration',
						name$tr$: 'estimate.main.createMaterialPackageWizard.configuration',
						sortable: true,
						editor: 'lookup',
						editorOptions: {
							'directive': 'basics-configuration-configuration-combobox',
							'lookupOptions': {
								'filterKey': 'create-package-configuration-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PrcConfiguration',
							'displayMember': 'DescriptionInfo.Translated'
						},
						width: 80
					}, {
						id: 'Responsible',
						field: 'ClerkPrcFk',
						name: 'Responsible',
						name$tr$: 'estimate.main.createMaterialPackageWizard.responsible',
						sortable: true,
						editor: 'lookup',
						editorOptions: {
							'directive': 'cloud-clerk-clerk-dialog-without-teams',
							'lookupOptions': {
								'filterKey': 'procurement-package-clerk-filter',
								'showClearButton': true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'clerk',
							'displayMember': 'Code'
						},
						width: 80
					}
				];


				$scope.simulation = {
					state: simulationGridId
				};

				function setupSimulationGrid() {
					// $scope.selectedItem
					if (platformGridAPI.grids.exist(simulationGridId)) {
						platformGridAPI.events.unregister(simulationGridId, 'onCellChange');
						platformGridAPI.grids.unregister(simulationGridId);

					}

					if (simulationGridColumns.length > 5) {
						simulationGridColumns=_.filter(simulationGridColumns,function(item){
							return item.field!=='StructureCodeFk'||item.field==='MaterialFurtherDescription';
						});
						let code = simulationGridColumns[3];
						let des = simulationGridColumns[4];
						let structureColumns=[{
							id: 'ShowStructureCode',
							field: 'StructureCodeFk',
							name: 'Structure Code',
							name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
							formatter: 'lookup',
							formatterOptions: {
								'lookupType': 'Prcstructure',
								'displayMember': 'Code'
							},
							readonly: true,
							sortable: true
						},
							{
								id: 'ShowStructureDescription',
								name: 'Structure Description',
								name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
								width: 140,
								field: 'StructureCodeFk',
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'Prcstructure',
									'displayMember': 'DescriptionInfo.Translated'
								},
								readonly: true,
								sortable: true
							}];
						switch ($scope.selectedItem) {
							case 'Procurement Structure':
								code.name = 'Structure Code';
								code.name$tr$ = 'estimate.main.createMaterialPackageWizard.structureCode';
								des.name = 'Structure Description';
								des.name$tr$ = 'estimate.main.createMaterialPackageWizard.structureDescription';
								break;
							case 'Cost Code':
								code.name = 'Cost Code';
								code.name$tr$ = 'estimate.main.createMaterialPackageWizard.costCode';
								des.name = 'Cost Code Description';
								des.name$tr$ = 'estimate.main.createMaterialPackageWizard.costCodeDescription';
								simulationGridColumns=simulationGridColumns.concat(structureColumns);
								break;
							case 'Material Catalog & Group':
								code.name = 'Material Catalog | Group Code';
								code.name$tr$ = 'estimate.main.createMaterialPackageWizard.materialCatalogGroupCode';
								des.name = 'Material Catalog | Group Description';
								des.name$tr$ = 'estimate.main.createMaterialPackageWizard.materialCatalogGroupDescription';
								simulationGridColumns=simulationGridColumns.concat(structureColumns);
								break;
							case 'Material & Cost Code':
								code.name = 'Code';
								code.name$tr$ = 'cloud.common.entityCode';
								des.name = 'Description';
								des.name$tr$ = 'cloud.common.entityDescription';
								var furtherDescriptionCoulumn = {
									id: 'MaterialFurtherDescription',
									name: 'Further Description',
									name$tr$: 'basics.costcodes.description2',
									width: 80,
									field: 'MaterialFurtherDescription',
									readonly: true
								};
								simulationGridColumns.push(furtherDescriptionCoulumn);
								simulationGridColumns=simulationGridColumns.concat(structureColumns);
								break;
						}
					}
					let simulationGridConfig = {
						columns: angular.copy(simulationGridColumns),
						data: [],
						id: simulationGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(simulationGridConfig);
					platformTranslateService.translateGridConfig(simulationGridConfig.columns);
					platformGridAPI.events.register(simulationGridId, 'onCellChange', onCellModified);
					platformGridAPI.events.register(simulationGridId, 'onBeforeEditCell', onBeforeEditCell);
				}




				function updateSimulationGrid(simulationData) {
					// reset data by new
					let newDatas = _.filter(simulationData, {'MatchnessType': matchnessTypeConstant.New});
					let onePackageFlg = $scope.updateOptions.onePackageFlg;
					if (newDatas.length > 0) {
						if (onePackageFlg && newDatas.length > 1) {
							let firstNewData = newDatas[0];
							_.forEach(newDatas, function (item, index) {
								item.PackageDescription = null !== firstNewData.PackageDescription ? firstNewData.PackageDescription : firstNewData.Description;
								item.SubPackage = null !== firstNewData.SubPackage ? firstNewData.SubPackage : firstNewData.Description;
								if (index > 0) {
									setReadOnly(item, 'PackageDescription', true);
									setReadOnly(item, 'SubPackage', true);
								}
							});
						} else {
							_.forEach(newDatas, function (item) {
								if (0 !== item.Id) {
									item.PackageDescription = null !== item.PackageDescription ? item.PackageDescription : item.Description;
									item.SubPackage = null !== item.SubPackage ? item.SubPackage : item.Description;
								}
								setReadOnly(item, 'PackageDescription', true);
								setReadOnly(item, 'SubPackage', true);
							});
						}
					}


					platformGridAPI.grids.invalidate(simulationGridId);
					// load list
					_.each(simulationData, function (item) {
						if (matchnessTypeConstant.New === item.MatchnessType) {
							item.Selected = true;
							setReadOnly(item, 'Selected', true);
							setReadOnly(item, 'ConfigurationFk', false);
							setReadOnly(item, 'ClerkPrcFk', false);
							setReadOnly(item, 'Merge', true);
						} else {
							setReadOnly(item, 'ConfigurationFk', true);
							setReadOnly(item, 'ClerkPrcFk', true);
						}

					});
					tempSimulationData = _.cloneDeep(simulationData);
					platformGridAPI.items.data(simulationGridId, simulationData);
				}

				$scope.packageDescriptionValueChange = function (selectItem, newValue, field) {
					if ('PackageDescription' === field) {
						selectItem.PackageDescription = newValue;
					} else if ('SubPackage' === field) {
						selectItem.SubPackage = newValue;
					}
					// tempFirstData
					let onePackageFlg = $scope.updateOptions.onePackageFlg;
					if (onePackageFlg && selectItem.MatchnessType === matchnessTypeConstant.New) {
						let simulationGridData = platformGridAPI.items.data(simulationGridId);
						let newDatas = _.filter(simulationGridData, {'MatchnessType': matchnessTypeConstant.New});
						if (onePackageFlg && newDatas.length > 1) {
							let firstNewData = newDatas[0];
							_.forEach(newDatas, function (item) {
								item.PackageDescription = firstNewData.PackageDescription;
								item.SubPackage = firstNewData.SubPackage;
							});
							platformGridAPI.grids.invalidate(simulationGridId);
							platformGridAPI.items.data(simulationGridId, simulationGridData);
							platformGridAPI.grids.refresh(simulationGridId);
						}

					}
				};

				function setReadOnly(item, model, flg) {
					platformRuntimeDataService.readonly(item, [{
						field: model,
						readonly: flg
					}]);
				}

				// region wizard navigation
				$scope.selectStep = angular.copy($scope.steps[0]);

				$scope.isLastStep = function () {
					if ($scope.selectStep) {
						return $scope.selectStep.number === $scope.steps.length - 1;
					} else {
						return true;
					}
				};

				$scope.isFirstStep = function () {
					return $scope.selectStep.number === 0;
				};

				$scope.previousStep = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					wz.previous();
					if($scope.selectedItem==='Material & Cost Code'&&$scope.isAllResultTobeChosen){
						setCurrentStep(0);
						return;
					}
					switch ($scope.selectStep.identifier) {
						case 'criteriaSelection':
							$scope.modeFlg=modeConstant.InclusiveMode;
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'packageAssignment':
							setCurrentStep($scope.selectStep.number - 1);

							var prevData = estimateMainCreateMaterialPackageService.getTempGridData();
							var flag = estimateMainCreateMaterialPackageService.getCreationFlag();
							if (flag === 0) {
								setupSelectedGrid(criteriaGridId, criteriaGridColumns);
								gridCheckReadOnlyOrNot(prevData);
								$timeout(function () {
									updateSelectedGrid(prevData.gridData);
								});
							} else if (flag === 1) {
								setupSelectedGrid(costCodeSelectionGridId, costCodeSelectionGridColumns);
								gridCheckReadOnlyOrNot(prevData);
								$timeout(function () {
									updateCostCodeSelectionGrid(prevData.gridData);
								});
							} else if (flag === 2) {
								setupSelectedGrid(materialGroupGridId, materialGroupGridColumns);
								gridCheckReadOnlyOrNot(prevData);
								$timeout(function () {
									updateSelectedGrid(prevData.gridData);
								});
							} else if (flag === 3) {
								setupMaterialGrid();
								$timeout(function () {
									updateMaterialGrid(prevData);
								},100);
								selectedGridId = materialGridId;
							}

							break;
					}
				};

				function checkChildren(item, flg) {
					if (item.resultChildren !== null && item.resultChildren.length > 0) {
						for (let i = 0; i < item.resultChildren.length; i++) {
							checkChildren(item.resultChildren[i], flg);
						}
					}
					if(modeConstant.DistinctMode === $scope.modeFlg&&platformRuntimeDataService.isReadonly(item, 'Selected')){
						item.Selected ='readonly';
					}
					else {
						item.Selected = flg;
					}
				}

				function mergefn(entity, item) {
					if (!item.resultChildren) {
						return entity;
					}
					let obj = entity.resultChildren;
					let src = item.resultChildren;

					if (null !== obj && null !== src && src.length > 0) {
						let isExist = _.find(obj, {Id: src[0].Id});
						if (isExist) {
							mergefn(isExist, src[0]);
						} else {
							obj = obj.concat(src);
						}
					} else if (null === obj && null !== src) {
						obj = src;
					}

					entity.resultChildren = obj;

					return entity;
				}


				function disData(data) {
					let gdata = _.groupBy(data, 'Id');
					let resultData = [];
					_.each(gdata, function (items) {
						let entity = {};
						if (items.length > 1) {
							entity = items[0];
							_.each(items, function (item, index) {
								if (0 !== index) {
									entity = mergefn(entity, item);
								}
							});
							entity.ParentFk = -1;
							resultData.push(entity);
						} else if (1 === items.length) {
							entity = items[0];
							entity.ParentFk = -1;
							resultData.push(entity);
						}
					});
					return resultData;
				}


				function setCriteriaName() {
					let selectName = $scope.selectedItem;
					let selectCriteriaName = '';
					switch (selectName) {
						case 'Procurement Structure':
							selectCriteriaName = $translate.instant('estimate.main.createMaterialPackageWizard.procurementStructure');
							break;
						case 'Cost Code':
							selectCriteriaName = $translate.instant('estimate.main.createMaterialPackageWizard.selectCostCode');
							break;
						case 'Material Catalog & Group':
							selectCriteriaName = $translate.instant('estimate.main.createMaterialPackageWizard.materialCatalog');
							break;
						case 'Material & Cost Code':
							selectCriteriaName = $translate.instant('estimate.main.createMaterialPackageWizard.materialCostCode');
							break;
					}
					$scope.selectCriteriaName = selectCriteriaName;
				}


				// reset
				$scope.reset = function () {
					if (platformGridAPI.grids.exist(simulationGridId)) {
						platformGridAPI.grids.invalidate(simulationGridId);
						let firstSimulationData = _.cloneDeep(tempSimulationData);
						platformGridAPI.items.data(simulationGridId, firstSimulationData);
						platformGridAPI.grids.refresh(simulationGridId);
					}
				};

				function resetIdData(datas) {
					for (let i = 0; i < datas.length; i++) {
						let data = datas[i];
						data.ItemId = angular.copy(data.Id);
						data.Id = data.TypeFk + '_' + angular.copy(data.Id);
						if (null !== data.resultChildren) {
							resetIdData(data.resultChildren);
						}
					}
				}


				$scope.nextStep = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					let goNext = true;
					let estimateValue = $scope.entireEstimateValue;
					let filterRequest = estimateMainService.getLastFilter();
					let readData=estimateMainService.getEstiamteReadData();
					let filterRecords =0;
					if(readData) {
						let filterResult = readData.FilterResult;
						filterRecords = filterResult ? filterResult.RecordsFound : 0;
					}
					var currentLineItems = estimateMainService.getList();
					let lineItemIds=[];
					if(filterRecords===0) {
						_.forEach(currentLineItems, function (item) {
							lineItemIds.push(item.Id);
						});
					}
					let selectIds = [];
					let isSelectedReferenceLineItem = $scope.isSelectedReferenceLineItem;
					let isSelectMultiPackageAssignmentModel=$scope.isSelectMultiPackageAssignmentModel;
					_.forEach(lineItemSelectedItems, function (item) {
						selectIds.push(item.Id);
					});
					let _selectedIds = 2 === estimateValue ? selectIds : [];
					var estHeaderId = estimateMainService.getSelectedEstHeaderId();

					let pinningContext = $injector.get('cloudDesktopSidebarService').getFilterRequestParams().PinningContext;
					let pinningPrjMain = _.find(pinningContext, {token: 'project.main'});
					let prjIdFromPinning = pinningPrjMain ? pinningPrjMain.id : -1;
					let estSelectedPrjId = estimateMainService.getSelectedProjectId() || -1;
					let projectId = (estSelectedPrjId && estSelectedPrjId > 0) ? estSelectedPrjId : prjIdFromPinning;
					switch ($scope.selectStep.number) {
						case 0:

							var itemData = {
								flag: 0,
								filterRequest: filterRequest ? filterRequest : {PinningContext: pinningContext},
								resultSet: estimateValue,
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: projectId,
								selectedLineItemIds: _selectedIds,
								lineItemIds:lineItemIds,
								isSelectedReferenceLineItem: isSelectedReferenceLineItem,
								isSelectMultiPackageAssignmentModel:isSelectMultiPackageAssignmentModel
							};
							setCriteriaName();
							$scope.isLoading = true;
							switch ($scope.selectedItem) {
								case 'Procurement Structure':
									$scope.selectItemForPackage = {state: criteriaGridId};
									setupSelectedGrid(criteriaGridId, criteriaGridColumns);
									estimateMainCreateMaterialPackageService.getSelections(itemData).then(function (result) {
										if (result.data) {
											let ids = result.data.ids;
											let data = result.data.datas;
											let resultDisData = disData(data);
											let resultObj = {gridData: resultDisData, ids: ids};
											gridCheckReadOnlyOrNot(resultObj);
											updateSelectedGrid(resultDisData);
											estimateMainCreateMaterialPackageService.setCreationFlag(0);
											estimateMainCreateMaterialPackageService.setTempGridData(resultObj);
										}
										$scope.isLoading = false;
									});
									break;
								case 'Cost Code':
									$scope.includeMarkUpCostFlg = false;
									$scope.updateOptions.eachMaterialCatalogFlg = false;
									$scope.selectItemForPackage = {state: costCodeSelectionGridId};
									setupSelectedGrid(costCodeSelectionGridId, costCodeSelectionGridColumns);
									itemData.flag = 1;
									estimateMainCreateMaterialPackageService.getSelections(itemData).then(function (result) {
										let ids = result.data.ids;
										let prjIds = result.data.prjIds;
										let Data = result.data.datas;
										for (let i = 0; i < ids.length; i++) {
											ids[i] = '0_' + ids[i];
										}
										for (let x = 0; x < prjIds.length; x++) {
											prjIds[x] = '1_' + prjIds[x];
										}
										for (let j = 0; j < Data.length; j++) {
											let data = Data[j];
											data.ItemId = angular.copy(data.Id);
											data.Id = data.TypeFk + '_' + angular.copy(data.Id);
											if (null !== data.resultChildren) {
												resetIdData(data.resultChildren);
											}
										}
										let resultDisData = disData(Data);
										let allIds = ids.concat(prjIds);
										let resultObj = {gridData: resultDisData, ids: allIds};
										gridCheckReadOnlyOrNot(resultObj);
										estimateMainCreateMaterialPackageService.setTempGridData(resultObj);
										let gridData = angular.copy(resultDisData);
										updateCostCodeSelectionGrid(gridData);
										estimateMainCreateMaterialPackageService.setCreationFlag(1);
										$scope.isLoading = false;
									});
									break;
								case 'Material Catalog & Group':
									$scope.updateOptions.eachMaterialCatalogFlg = false;
									$scope.selectItemForPackage = {state: materialGroupGridId};
									setupSelectedGrid(materialGroupGridId, materialGroupGridColumns);
									itemData.flag = 2;
									estimateMainCreateMaterialPackageService.getSelections(itemData).then(function (result) {
										if (result.data) {
											estimateMainCreateMaterialPackageService.setCreationFlag(2);
											let ids = result.data.ids;
											for (let i = 0; i < ids.length; i++) {
												ids[i] = '0_' + ids[i];
											}
											let Data = result.data.datas;
											for (let j = 0; j < Data.length; j++) {
												let data = Data[j];
												data.ItemId = angular.copy(data.Id);
												data.Id = data.TypeFk + '_' + angular.copy(data.Id);
												// data.Icon=null;
												data.image = 'ico-folder-assemblies';
												if (null !== data.resultChildren) {
													resetIdData(data.resultChildren);
												}
											}
											let resultObj = {gridData: Data, ids: ids};
											gridCheckReadOnlyOrNot(resultObj);
											updateSelectedGrid(Data);
											estimateMainCreateMaterialPackageService.setTempGridData(resultObj);
										}
										$scope.isLoading = false;
									});
									break;
								case 'Material & Cost Code':
									if (!$scope.isAllResultTobeChosen) {
										$scope.includeMarkUpCostFlg = false;

										$scope.selectItemForPackage = {state: materialGridId};
										itemData.flag = 3;
										setupMaterialGrid();
										estimateMainCreateMaterialPackageService.getMaterialSelections(itemData).then(function (result) {
											let materiaSelections = [];
											for (let i = 0, len = result.data.length; i < len; i++) {
												let item = result.data[i];
												let materialGrid = {
													Id: item.Type + '_' + item.Id + '_' + item.InDirectCost,
													ItemId: item.Id,
													TypeFk: item.Type,
													Selected: false,
													Code: item.Code,
													Description: item.Description,
													Description2: item.Description2,
													MdcGroupCode: item.MaterialGroupCode,
													MdcGroupDescription: item.MaterialGroupDescription,
													StructureCode: item.StructureCode,
													StructureDescription: item.StructureDescription,
													BusinessPartnerFk: item.BusinessPartnerFk,
													IsCost: item.IsCost,
													InDirectCost: item.InDirectCost
												};
												materiaSelections.push(materialGrid);
											}

											$timeout(function () {
												updateMaterialGrid(materiaSelections);
												estimateMainCreateMaterialPackageService.setCreationFlag(3);
												// let tempData=angular.copy(platformGridAPI.items.data(materialGridId));
												let tempData = angular.copy(materiaSelections);
												estimateMainCreateMaterialPackageService.setTempMaterialAndCostCodeData(tempData);
												selectedGridId = materialGridId;
												filterByOption();
												$scope.isLoading = false;
											}, 200);
										});
									}
									else{
										$scope.isLoading = false;
										$scope.selectStep.number=$scope.selectStep.number+1;
										var matchItems = {
											prjId: projectId,
											estHeaderId: estHeaderId,
											filterRequest: filterRequest ? filterRequest : {PinningContext: pinningContext},
											flag: 3,
											resultSet: estimateValue,
											prcStructureIds: [],
											materialIds: [],
											mdcCatalogIds: [],
											mdcGroupIds: [],
											mdcCostCodeIds: [],
											IndirectCostCodes:[],
											prjCostCodeIds: [],
											selectedItemsNum: 0,
											selectedLineItemIds: _selectedIds,
											lineItemIds:lineItemIds,
											modeFlg: $scope.modeFlg,
											isAllResultTobeChosen:true,
											isSelectedReferenceLineItem: $scope.isSelectedReferenceLineItem,
											isSelectMultiPackageAssignmentModel:isSelectMultiPackageAssignmentModel
										};
										loadSimulationPage(matchItems);
									}
									break;
							}
							wz.next();

							break;
						case 1:
							let selectFlag = estimateMainCreateMaterialPackageService.getCreationFlag();
							var gridDatas=platformGridAPI.items.data(selectedGridId);
							var flattenGridDatas =[];
							cloudCommonGridService.flatten(gridDatas, flattenGridDatas, 'resultChildren');
							flattenGridDatas = _.uniqBy(flattenGridDatas, 'Id');
							selectIds = [];
							var prcStructureIds = [];
							var materialIds = [];
							var mdcCatalogIds = [];
							var mdcGroupIds = [];
							var mdcCostCodeIds = [];
							var IndirectCostCodes = [];
							var prjCostCodeIds = [];
							var rootLevelDisable = $scope.rootLevelDisable;
							var rootLevelFlg = $scope.rootLevelFlg && !rootLevelDisable;
							var selectedItemsNum = 0;
							for (let index = 0; index < flattenGridDatas.length; index++) {
								let gridData = flattenGridDatas[index];
								if (gridData.Selected === true) {
									if (rootLevelFlg && gridData.ParentFk === -1 && gridData.Code !== 'N/A') {
										continue;
									}
									let type = gridData.TypeFk;
									if ($scope.selectedItem === 'Material Catalog & Group') {
										if (type === typesOfCriteria.mdcCatalogNGroup.mdcGroup) {
											mdcGroupIds.push(gridData.ItemId);
										} else if (type === typesOfCriteria.mdcCatalogNGroup.mdcCatalog) {
											mdcCatalogIds.push(gridData.ItemId);
										}
									}
									else if ($scope.selectedItem === 'Material & Cost Code') {
										if (type === typesOfCriteria.materialNCostCode.material) {
											materialIds.push(gridData.ItemId);
										} else if (type === typesOfCriteria.materialNCostCode.mdcCostCode||type === typesOfCriteria.materialNCostCode.prjCostCode) {
											IndirectCostCodes.push({Id:gridData.ItemId,IndirectCost:gridData.InDirectCost,Type:type});
										}
									}
									else if ($scope.selectedItem === 'Cost Code') {
										if (type === typesOfCriteria.costCode.mdcCostCode) {
											mdcCostCodeIds.push(gridData.ItemId);
										} else if (type === typesOfCriteria.costCode.prjCostCode) {
											prjCostCodeIds.push(gridData.ItemId);
										}
									} else {
										prcStructureIds.push(gridData.Id);
									}
									// selectedItems.push({Id:gridData.Id,TypeFk:gridData.TypeFk});
								}
							}
							selectedItemsNum = prcStructureIds.length + materialIds.length + mdcCatalogIds.length + mdcGroupIds.length + mdcCostCodeIds.length + prjCostCodeIds.length+IndirectCostCodes.length;
							if (selectedItemsNum === 0) {
								platformDialogService.showMsgBox('estimate.main.createMaterialPackageWizard.noItemSelected', '', 'ico-info'); // jshint ignore:line
								goNext = false;
								break;
							}
							var matchItems = {
								prjId: projectId,
								estHeaderId: estHeaderId,
								filterRequest: filterRequest ? filterRequest : {PinningContext: pinningContext},
								flag: selectFlag,
								resultSet: estimateValue,
								prcStructureIds: prcStructureIds,
								materialIds: materialIds,
								mdcCatalogIds: mdcCatalogIds,
								mdcGroupIds: mdcGroupIds,
								mdcCostCodeIds: mdcCostCodeIds,
								IndirectCostCodes:IndirectCostCodes,
								prjCostCodeIds: prjCostCodeIds,
								selectedItemsNum: selectedItemsNum,
								selectedLineItemIds: _selectedIds,
								lineItemIds:lineItemIds,
								modeFlg: $scope.modeFlg,
								isAllResultTobeChosen:false,
								isSelectedReferenceLineItem: $scope.isSelectedReferenceLineItem,
								isSelectMultiPackageAssignmentModel:isSelectMultiPackageAssignmentModel
							};
							loadSimulationPage(matchItems);
							wz.next();

							break;
						case 2:
							var grid1 = platformGridAPI.grids.element('id', simulationGridId);
							var gridDatas1 = grid1.dataView.getRows();
							var allProfiles = uniqueFieldsProfileService.getSelectedItem().UniqueFields;
							var uniqueFields = _.filter(allProfiles, {isSelect: true}).map(function (field) {
								return {
									id: field.id,
									code: field.model
								};
							});
							var selectFlag1 = estimateMainCreateMaterialPackageService.getCreationFlag();
							var updateCreateDatas = {
								flag: selectFlag1,
								resultSet: estimateValue,
								prjId: projectId,
								estHeaderId: estHeaderId,
								gridDatas: gridDatas1,
								onePackageFlg: $scope.updateOptions.onePackageFlg,
								eachMaterialCatalogFlg: $scope.updateOptions.eachMaterialCatalogFlg,
								generateItemFlg: $scope.updateOptions.generateItemFlg,
								aggregateProfileFlg: $scope.updateOptions.aggregateProfileFlg,
								generateCostcodeFlg: $scope.updateOptions.generateCostcodeFlg,
								freeQuantityFlg: $scope.updateOptions.freeQuantityFlg,
								isCopyBoqOutline: $scope.updateOptions.isCopyBoqOutline,
								isCopyBoqSpecification: $scope.updateOptions.isCopyBoqSpecification,
								uniqueFieldsProfile: uniqueFields,
								filterRequest: filterRequest ? filterRequest : {PinningContext: pinningContext},
								selectedLineItemIds: _selectedIds,
								lineItemIds:lineItemIds,
								isSelectedReferenceLineItem: $scope.isSelectedReferenceLineItem,
								isSelectMultiPackageAssignmentModel:isSelectMultiPackageAssignmentModel,
								packageOption:$scope.packageOption
							};

							createPackage(updateCreateDatas);

							wz.finish();
							break;
						default:
					}
					if (goNext) {
						setCurrentStep($scope.selectStep.number + 1);
					}
				};


				function loadSimulationPage(matchItems){
					loadResponsible();
					loadPrcConfiguration().then(function () {
						setConfiguration(null);
					});

					setupSimulationGrid();
					updateDynamicUniqueFields().then(function () {
						optionsProfileService.load();
					});
					$scope.isLoading = true;
					estimateMainCreateMaterialPackageService.getSimulation(matchItems).then(function (result) {
						updateSimulationGrid(result.data);
						checkHasNewItem(result.data);
						$scope.isLoading = false;
					});
				}

				function createPackage(updateCreateDatas) {
					if (updateCreateDatas && updateCreateDatas.gridDatas && updateCreateDatas.gridDatas.length) {
						_.forEach(updateCreateDatas.gridDatas, function (item) {
							delete item.__rt$data;
						});
					}
					estimateMainCreateMaterialPackageService.updateOrCreatePackage(updateCreateDatas).then(function (result) {

						let dialogOptions = {
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/wizard/estimate-main-create-material-package-step3.html',
							topDescription: {
								iconClass: 'tlb-icons ico-info',
								text$tr$: 'estimate.main.createMaterialPackageWizard.assignmentResultTip'
							},
							width: '800px',
							resizeable: true
						};

						estimateMainCreateMaterialPackageService.setResultData(result.data);

						platformDialogService.showDialog(dialogOptions);
					});
				}

				function onBeforeEditCell(e, args) {
					let currentItem = args.item;
					if (!currentItem) {
						return;
					}
					if ('PackageDescription' === args.column.id) {
						if (matchnessTypeConstant.New !== currentItem.MatchnessType) {
							return false;
						}
					}
					return true;
				}

				function resetNewSimulationGrid() {
					let simulationData = platformGridAPI.items.data(simulationGridId);
					let newDatas = _.filter(simulationData, {'MatchnessType': matchnessTypeConstant.New});
					if (newDatas.length > 0) {
						let firstNewData = newDatas[0];

						_.forEach(newDatas, function (item, index) {
							item.PackageDescription = firstNewData.Description;
							item.SubPackage = firstNewData.Description;
							if (index > 0) {
								setReadOnly(item, 'PackageDescription', true);
								setReadOnly(item, 'SubPackage', true);
							}
						});

						platformGridAPI.grids.invalidate(simulationGridId);
						platformGridAPI.items.data(simulationGridId, simulationData);
						platformGridAPI.grids.refresh(simulationGridId);

					}
				}

				function updateSimulationGridByMerge(){
					let simulationData = platformGridAPI.items.data(simulationGridId);
					var mergeItems=_.filter(simulationData,function(item){ return item.Merge; });
					var mergeCount = mergeItems.length;
					if (mergeCount >= 1) {
						var firstMergeItem = mergeItems[0];
						_.forEach(mergeItems, function (item) {
							if (item.Id !== firstMergeItem.Id && mergeCount > 1) {
								setReadOnly(item, 'PackageCodeFk', true);
							} else {
								setReadOnly(item, 'PackageCodeFk', false);
							}
							item.PackageCodeFk = firstMergeItem.PackageCodeFk;

							let firstData = angular.copy(_.find(tempSimulationData, {'Id': item.Id}));
							if(firstData.PackageCodeFk!==item.PackageCodeFk) {
								item.MatchnessType=matchnessTypeConstant.UserSpecified;
								item.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.userSpecified');
							}
							else if(!item.Selected){
								item.Matchness =firstData.Matchness;
							}
						});
						let grid = platformGridAPI.grids.element('id', simulationGridId);
						let selectedRows = [];
						if (grid && grid.instance && _.isFunction(grid.instance.getSelectedRows)) {
							selectedRows = grid.instance.getSelectedRows();
						}
						platformGridAPI.grids.invalidate(simulationGridId);
						platformGridAPI.items.data(simulationGridId, simulationData);
						platformGridAPI.grids.refresh(simulationGridId);
						if (selectedRows && selectedRows.length && _.isFunction(grid.instance.setSelectedRows)) {
							grid.instance.setSelectedRows(selectedRows);
						}
					}
				}


				function onCellModified(e, arg) {
					if (!arg.cell) {
						return false;
					}
					let propertyName = platformGridAPI.columns.configuration(simulationGridId).visible[arg.cell].field;
					let selections = platformGridAPI.rows.selection({
						gridId: simulationGridId,
						wantsArray: true
					});
					let newChecked = arg.item.Selected;
					if (selections && selections.length) {
						let onePackageFlg = $scope.updateOptions.onePackageFlg;
						_.forEach(selections, function (selected) {
							let firstData = angular.copy(_.find(tempSimulationData, {'Id': selected.Id}));
							let isReadonlyItem = platformRuntimeDataService.isReadonly(firstData, 'Selected');
							if (!isReadonlyItem) {
								if ('Selected' === propertyName) {
									if (newChecked) {
										selected.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.new');
										selected.MatchnessType=matchnessTypeConstant.New;
										selected.PackageCodeFk = 0;
										selected.SubPackageFk = 0;
										selected.PackageStatusFk = 0;
										selected.Merge = false;
										selected.Selected = newChecked;
										selected.StructureCodeFk = firstData.BasicStructureCodeFk;
										if (0 !== firstData.StructureConfigurationFk) {
											selected.ConfigurationFk = firstData.StructureConfigurationFk;
										}
										if (!onePackageFlg) {
											selected.PackageDescription = selected.Description;
											selected.SubPackage = selected.Description;
										}
									}
									else {
										selected.Matchness = firstData.Matchness;
										selected.MatchnessType=firstData.MatchnessType;
										selected.PackageCodeFk = firstData.PackageCodeFk;
										selected.SubPackageFk = firstData.SubPackageFk;
										selected.ConfigurationFk = firstData.ConfigurationFk;
										selected.PackageStatusFk = firstData.PackageStatusFk;
										selected.StructureCodeFk = firstData.StructureCodeFk;
										selected.Selected = newChecked;
									}
									setReadOnly(selected, 'ConfigurationFk', !newChecked);
									setReadOnly(selected, 'ClerkPrcFk', !newChecked);
									setReadOnly(selected, 'Merge', newChecked);
									setDefaultStructure();
								}
								else if('Merge' === propertyName){
									if (!newChecked) {
										setReadOnly(selected, 'PackageCodeFk', false);
										selected.PackageCodeFk = firstData.PackageCodeFk;
										selected.StructureCodeFk = firstData.StructureCodeFk;
										selected.Matchness=firstData.Matchness;
										selected.MatchnessType=firstData.MatchnessType;
									}
									selected.Merge = arg.item.Merge;
								}
							}
						});

						if ('Selected' === propertyName && newChecked && onePackageFlg) {
							resetNewSimulationGrid();
						}
						updateSimulationGridByMerge();
						checkHasNewItem();
					}
				}


				function setCurrentStep(step) {
					$scope.selectStep = angular.copy($scope.steps[step]);
				}

				// object holding translated strings
				$scope.translate = {};

				$scope.getButtonText = function () {
					if ($scope.isLastStep()) {
						return $translate.instant('basics.common.button.ok');
					}

					return $translate.instant('basics.common.button.nextStep');
				};

				// endregion

				// un-register on destroy
				$scope.$on('$destroy', function () {
					unwatch();
					unwatchOnePackage();
					unwatchPackageDescription();
					uniqueFieldsProfileService.reset();
					uniqueFieldsProfileService.selectItemChanged.unregister(onSelectItemChanged);
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					optionsProfileService.reset();
					optionsProfileService.selectItemChanged.unregister(onSelectOptionItemChanged);

					if (platformGridAPI.grids.exist(selectedGridId)) {
						platformGridAPI.events.unregister(selectedGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						platformGridAPI.events.unregister(selectedGridId, 'onCellChange');
						platformGridAPI.grids.unregister(selectedGridId);
					}

					if (platformGridAPI.grids.exist(materialGridId)) {
						platformGridAPI.events.unregister(materialGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						platformGridAPI.grids.unregister(materialGridId);
					}
					if (platformGridAPI.grids.exist(simulationGridId)) {
						platformGridAPI.events.unregister(simulationGridId, 'onCellChange');
						platformGridAPI.events.unregister(simulationGridId, 'onBeforeEditCell');
						platformGridAPI.grids.unregister(simulationGridId);
					}
				});

				$scope.close = function () {
					$scope.$parent.$close(false);
				};


				$scope.onRootLevelFlg = function (value) {
					$scope.rootLevelFlg = value;
				};

				$scope.onIncludeMaterial=function(value){
					$scope.includeMaterial = value;
					filterByOption();
				};
				$scope.onIncludeDirectCost=function(value){
					$scope.includeDirectCost = value;
					filterByOption();
				};
				$scope.onIncludeInDirectCost=function(value){
					$scope.includeInDirectCost = value;
					filterByOption();
				};
				$scope.onIncludeMarkUpCost = function (value) {
					$scope.includeMarkUpCostFlg = value;
					filterByOption();
				};

				function filterByOption(){
					if ($scope.selectedItem === 'Material & Cost Code') {
						let items = [];
						let allMaterialCostCodeItems = estimateMainCreateMaterialPackageService.getTempMaterialAndCostCodeData();
						if(allMaterialCostCodeItems) {
							let allItems = angular.copy(allMaterialCostCodeItems);
							let currentItemGrid = platformGridAPI.items.data(materialGridId);
							let itemsMap = _.keyBy(currentItemGrid, function (o) {
								return o.Id;
							});
							let itemMap = {};
							_.forEach(allItems, function (item) {
								let Id = item.Id;
								if (itemsMap[item.Id]) {
									item.Selected = itemsMap[item.Id].Selected;
								}
								if (($scope.includeMaterial && item.TypeFk === 0) && !itemMap[Id]) {
									items.push(item);
									itemMap[Id] = item;
								}
								if (item.TypeFk === 1 || item.TypeFk === 2) {
									if ((!item.IsCost) && $scope.includeMarkUpCostFlg && !itemMap[Id]) {
										items.push(item);
										itemMap[Id] = item;
									}
									if (item.IsCost && $scope.includeDirectCost && !itemMap[Id] && !item.InDirectCost) {
										items.push(item);
										itemMap[Id] = item;
									}
									if (item.IsCost && $scope.includeInDirectCost && !itemMap[Id] && item.InDirectCost) {
										items.push(item);
										itemMap[Id] = item;
									}
								}
							});
							itemMap = {};
							platformGridAPI.items.data(materialGridId, items);
							estimateMainCreateMaterialPackageService.setTempGridData(items);
						}
					} else {
						var allCostCodeData = estimateMainCreateMaterialPackageService.getTempGridData();
						if (allCostCodeData.gridData) {
							var allCostCodeItems = angular.copy(allCostCodeData.gridData);
							if (!$scope.includeMarkUpCostFlg) {
								allCostCodeItems = filterMarkUpCostItem(allCostCodeItems);
							}
							platformGridAPI.items.data(costCodeSelectionGridId, allCostCodeItems);
							var grid = platformGridAPI.grids.element('id', costCodeSelectionGridId);
							if(grid) {
								platformGridAPI.items.sort(grid.id, grid.scope.sortColumn.field, grid.scope.sortColumn.ascending ? 'sort-asc' : 'sort-desc');
							}
						}
					}

				}

				function filterMarkUpCostItem(data) {
					let newData = _.filter(data, function (item) {
						return item.IsCost;
					});
					_.forEach(newData, function (item) {
						if (item.resultChildren && item.resultChildren.length > 0) {
							item.resultChildren = filterMarkUpCostItem(item.resultChildren);
						}
					});
					return newData;
				}

				$scope.hasNewItem=false;
				function checkHasNewItem(data){
					let simulationData = data||platformGridAPI.items.data(simulationGridId);
					let newItems=_.filter(simulationData,function(item){ return item.Selected; });
					$scope.hasNewItem=newItems&&newItems.length>0;
				}

				function packageOptionPanelShowOrNot(){
					if($('#createMaterialPackagePage2').data('kendoSplitter')) {
						if ($scope.updateOptions.onePackageFlg&&$scope.hasNewItem) {
							$('#createMaterialPackagePage2').data('kendoSplitter').expand('#ui-layout-east');
						} else {
							$('#createMaterialPackagePage2').data('kendoSplitter').collapse('#ui-layout-east');
						}
					}
				}

				$scope.disableMaterialCatalogFlg=function(){
					var selectedItem=$scope.selectedItem;
					var hasNewItem=!!$scope.hasNewItem;
					return !((selectedItem==='Procurement Structure'||selectedItem==='Material & Cost Code')&&hasNewItem);
				};

				$scope.onSamePackage = function () {
					if ($scope.updateOptions.onePackageFlg) {
						$scope.updateOptions.eachMaterialCatalogFlg = false;
					}
				};

				$scope.onGenerateItemFlg = function () {
					if (!$scope.updateOptions.generateItemFlg) {
						$scope.updateOptions.generateCostcodeFlg = false;
						$scope.updateOptions.aggregateProfileFlg = false;
						$scope.updateOptions.freeQuantityFlg = false;
					} else {
						$scope.updateOptions.aggregateProfileFlg = true;
					}
				};

				$scope.onEachMaterialCatalog = function () {
					if ($scope.updateOptions.eachMaterialCatalogFlg) {
						$scope.updateOptions.onePackageFlg = false;
					}
				};

				$scope.onModeResult = function (value) {
					$scope.modeFlg = value;
					let gridDatas = platformGridAPI.items.data(selectedGridId);
					let tempGridData = estimateMainCreateMaterialPackageService.getTempGridData();
					if (modeConstant.DistinctMode === value) {
						$scope.rootLevelDisable = true;
					}
					setItemReadOnlyOrNot(gridDatas, tempGridData.ids, false);
					platformGridAPI.grids.invalidate(selectedGridId);
					platformGridAPI.items.data(selectedGridId, gridDatas);
					platformGridAPI.grids.refresh(selectedGridId);
				};

				function getUniqueFields(dynamicUniqueFields) {
					// let arrModels=['DescriptionInfo','BasUomTargetFk','MdcControllingUnitFk','LicCostGroup1Fk','LicCostGroup2Fk','LicCostGroup3Fk','LicCostGroup4Fk','LicCostGroup5Fk','PrjCostGroup1Fk','PrjCostGroup2Fk','PrjCostGroup3Fk','PrjCostGroup4Fk','PrjCostGroup5Fk'];
					let arrModels = ['DescriptionInfo', 'BasUomTargetFk', 'MdcControllingUnitFk'];
					let allFileds = angular.copy(basicsCommonEstimateLineItemFieldsValue.getWithDynamicFields(dynamicUniqueFields));
					let packcageFields = _.filter(allFileds, function (item) {
						if (item.id) {
							return true;
						}
						if (_.indexOf(arrModels, item.model) > -1) {

							item.isSelect = item.model === 'DescriptionInfo' || item.model === 'BasUomTargetFk';
							return true;
						}
						return false;
					});
					return packcageFields;
				}

				$scope.entity.uniqueFields = getUniqueFields();

				$scope.onResult = function (value) {
					$scope.entireEstimateValue = value;
				};

				$scope.onSelectChanged = function (selectedItem) {
					$scope.selectedItem = selectedItem;
				};

				$scope.onSelectedReferenceLineItem = function (isSelectedReferenceLineItem) {
					$scope.isSelectedReferenceLineItem = isSelectedReferenceLineItem;
				};

				$scope.onSelectedMultiPackageAssignmentModel = function (isSelectMultiPackageAssignmentModel) {
					$scope.isSelectMultiPackageAssignmentModel = isSelectMultiPackageAssignmentModel;
				};

				$scope.onSelectedAllResultTobeChosen=function(isAllResultTobeChosen){
					$scope.isAllResultTobeChosen = isAllResultTobeChosen;
				};

				filters = [{
					key: 'create-package-configuration-filter',
					serverSide: true,
					fn: function () {
						return 'IsMaterial=true && RubricFk = ' + moduleContext.packageRubricFk;
					}
				}, {
					key: 'prc-package-filter',
					serverSide: true,
					fn: function () {
						return {
							ProjectFk: moduleContext.loginProject,
							IsLive: true
						};
					}
				}, {
					key: 'sub-package-filter',
					serverKey: 'sub-package-filter',
					serverSide: true,
					fn: function (dataContext) {
						if (angular.isDefined(dataContext) && dataContext.PackageCodeFk !== null && dataContext.PackageCodeFk !== undefined) {
							return {PrcPackageFk: dataContext.PackageCodeFk};
						}
					}
				}, {
					key: 'procurement-package-clerk-filter',
					serverSide: true,
					fn: function () {
						return 'IsLive=true';
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				function updateDynamicUniqueFields() {
					let dynamicUniqueFields = [];
					let projectId = estimateMainService.getSelectedProjectId();
					return estimateMainCreateMaterialPackageService.getDynamicUniqueFields(projectId).then(function (response) {
						if (!response) {
							return dynamicUniqueFields;
						}
						let lic = response.data.LicCostGroupCats;
						let prjCostGroup = response.data.PrjCostGroupCats;
						let allCats = _.concat(lic, prjCostGroup);
						let showCats = [];
						_.forEach(allCats, function (item) {
							showCats.push({Id: item.Id, Code: item.Code});
						});
						dynamicUniqueFields = showCats;
						return dynamicUniqueFields;
					}).finally(function () {
						let fields = getUniqueFields(dynamicUniqueFields);
						$scope.entity.uniqueFields = fields;
						uniqueFieldsProfileService.updateDefaultFields(fields);
						return uniqueFieldsProfileService.load();
					});
				}

			}]);
})(angular);
