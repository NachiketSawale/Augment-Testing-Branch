/**
 * Created by bh on 09.03.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name schedulingMainCreateResourceRequisitionWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard dialog used to collect the settings and information to be able to create a resource requisition
	 **/
	var moduleName = 'scheduling.main';
	angular.module(moduleName).controller('schedulingMainCreateResourceRequisitionWizardController',
		[
			'_',
			'$scope',
			'$http',
			'$q',
			'$translate',
			'platformGridAPI',
			'$timeout',
			'schedulingMainService',
			'platformModalService',
			'schedulingMainRequisitionCreationService',
			'schedulingMainGenerateRequisitionService',
			'WizardHandler',
			'procurementContextService',
			'platformTranslateService',
			'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService',
			function (_,
				$scope,// jshint ignore:line
				$http,
				$q,
				$translate,
				platformGridAPI,
				$timeout,
				schedulingMainService,
				platformModalService,
				schedulingMainRequisitionCreationService,
				schedulingMainGenerateRequisitionService,
				WizardHandler,
				moduleContext,
				platformTranslateService,
				basicsLookupdataLookupFilterService,
				platformRuntimeDataService) {

				$scope.path = globals.appBaseUrl;

				$scope.selections = {
					reqStructure: 'Requisition Structure',
					costType: 'Cost Type',
					materialCatalog: 'Material Catalog & Group',
					material: 'Material & Cost Code'
				};


				$scope.steps = [
					{
						number: 0,
						identifier: 'basicSetting',
						name: $translate.instant('scheduling.main.generateRequisitionWizard'),
						skip: false
					},
					{
						number: 1,
						identifier: 'resourceFilter',
						name: $translate.instant('scheduling.main.requisitionResourceFilter'),
						skip: false
					},
					{
						number: 2,
						identifier: 'selection',
						name: $translate.instant('scheduling.main.requisitionSelection'),
						skip: false
					},
					{
						number: 3,
						identifier: 'costtype2resourcetype',
						name: $translate.instant('scheduling.main.costtype2resourcetypeSelection'),
						skip: false
					}
				];

				$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';
				$scope.wizardName = $scope.modalOptions.value.wizardName;
				$scope.wizard = $scope.modalOptions.value.wizard;
				$scope.entity = $scope.modalOptions.value.entity;

				$scope.getEnabledSteps = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};

				$scope.getCurrentStepNumber = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.currentStepNumber();
					} else {
						return '';
					}
				};
				$scope.getTotalStepCount = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.totalStepCount();
					} else {
						return '';
					}
				};
				$scope.getCurrentStepTitle = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz && wz.currentStepNumber()) {
						return wz.currentStepTitle();
					} else {
						return '';
					}
				};

				$scope.getNextStep = function getNextStep(titleOnly) {
					var wz = WizardHandler.wizard($scope.wizardName);
					var nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
					if (titleOnly) {
						return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
					} else {
						return nextStep;
					}
				};

				$scope.wzStrings = {
					cancel: $translate.instant('platform.cancelBtn'),
					finish: $translate.instant('scheduling.main.resetBtn'),
					nextStep: $translate.instant('platform.wizard.nextStep')
				};

				$scope.eachMaterialCatalogFlg = false;


				$scope.selectedItem = $scope.selections.reqStructure;

				var criteriaGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							var html = '';
							if (value === true) {
								html = '<input type="checkbox" checked />';
							}
							else if (value === 'unknown') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input type="checkbox"/>';
							}
							else {
								html = '<input type="checkbox" />';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						editor: 'directive',
						editorOptions: {
							directive: 'material-group-checkbox'
						},
						validator: 'isCheckedValueChange',
						width: 30
					},
					{

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true
					}
				];

				var criteriaGridId = 'e732837a84be4b71945d6f22e2c00612';

				$scope.selectItemForRequistion = {
					state: criteriaGridId
				};

				function setupCriteriaGrid() {
					if (!platformGridAPI.grids.exist(criteriaGridId)) {
						var criteriaGridConfig = {
							columns: angular.copy(criteriaGridColumns),
							data: [],
							id: criteriaGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(criteriaGridConfig);
						platformTranslateService.translateGridConfig(criteriaGridConfig.columns);
					}
				}

				function updateCriteriaGrid(selectedData) {
					platformGridAPI.grids.invalidate(criteriaGridId);
					platformGridAPI.items.data(criteriaGridId, selectedData);
				}
				/** *****************cost type***************/
				var costCodeSelectionGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							var html = '';
							if (value === true) {
								html = '<input type="checkbox" checked />';
							}
							else if (value === 'unknown') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input type="checkbox"/>';
							}
							else {
								html = '<input type="checkbox" />';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						editor: 'directive',
						editorOptions: {
							directive: 'material-group-checkbox'
						},
						validator: 'isCheckedValueChange',
						width: 50
					},
					{

						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 100,
						formatter: 'description'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true
					}
				];

				var costTypeSelectionGridId = '8c1368a28fac4562a90de5e5c4efc2c8';

				function setupCostCodeSelectionGrid() {
					if (!platformGridAPI.grids.exist(costTypeSelectionGridId)) {
						var costTypeSelectionGridConfig = {
							columns: angular.copy(costCodeSelectionGridColumns),
							data: [],
							id: costTypeSelectionGridId,
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
						platformGridAPI.grids.config(costTypeSelectionGridConfig);
						platformTranslateService.translateGridConfig(costTypeSelectionGridConfig.columns);
					}
				}

				function updateCostTypeSelectionGrid(selectedData) {
					platformGridAPI.grids.invalidate(costTypeSelectionGridId);
					platformGridAPI.items.data(costTypeSelectionGridId, selectedData);
				}
				/** ****************materialGroup***************/
				var materialGroupGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							var html = '';
							if (value === true) {
								html = '<input type="checkbox" checked />';
							}
							else if (value === 'unknown') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input type="checkbox"/>';
							}
							else {
								html = '<input type="checkbox" />';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						editor: 'directive',
						editorOptions: {
							directive: 'material-group-checkbox'
						},
						validator: 'isCheckedValueChange',
						width: 50
					},
					{

						id: 'Code1',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 90
					},
					{
						id: 'Description1',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120,
						readonly: true
					}
				];

				var materialGroupGridId = '305a0be881fb4781a497ca7dd2c45a5d';

				function setupMaterialGroupGrid() {
					if (!platformGridAPI.grids.exist(materialGroupGridId)) {
						var materialGroupGridConfig = {
							columns: angular.copy(materialGroupGridColumns),
							data: [],
							id: materialGroupGridId,
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
						platformGridAPI.grids.config(materialGroupGridConfig);
						platformTranslateService.translateGridConfig(materialGroupGridConfig.columns);
					}
				}

				function updateMaterialGroupGrid(selectedData) {
					platformGridAPI.grids.invalidate(materialGroupGridId);
					platformGridAPI.items.data(materialGroupGridId, selectedData);
				}

				function doItemCheck(item) {
					if (item.resultChildren && item.resultChildren.length) {
						var checkedItems = [], unCheckedItems = [];

						item.resultChildren.forEach(function (item) {
							var isChecked = doItemCheck(item);

							if (isChecked === true) {
								checkedItems.push(item);
							}
							else if (isChecked !== 'unknown') {
								unCheckedItems.push(item);
							}
						});
						if (checkedItems.length === item.resultChildren.length) {
							item.Selected = true;
						}
						else if (unCheckedItems.length === item.resultChildren.length) {
							item.Selected = false;
						}
						else {
							item.Selected = 'unknown';
						}
					}
					return item.Selected;
				}

				$scope.isCheckedValueChange = function isCheckedValueChange(selectItem, newValue) {
					checkChildren(selectItem, newValue);
					var allItems = platformGridAPI.items.data(selectedGridId);
					allItems.forEach(doItemCheck);
					platformGridAPI.grids.invalidate(selectedGridId);
					platformGridAPI.grids.refresh(selectedGridId);
					return {apply: false, valid: true, error: ''};
				};

				/** ****************material*************/
				var materialGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						editor: 'boolean',
						formatter: 'boolean',
						width: 30
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 150,
						readonly: true
					},
					{

						id: 'MdcGroupCode',
						field: 'MdcGroupCode',
						name: 'Material Group Code',
						name$tr$: 'scheduling.main.materialGroupCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'MdcGroupDescription',
						field: 'MdcGroupDescription',
						name: 'Material Group Description',
						name$tr$: 'scheduling.main.materialGroupDescription',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'StructureCode',
						field: 'StructureCode',
						name: 'Structure Code',
						name$tr$: 'scheduling.main.structureCode',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'StructureDescription',
						field: 'StructureDescription',
						name: 'Structure Description',
						name$tr$: 'scheduling.main.structureDescription',
						readonly: true,
						width: 90,
						formatter: 'description'
					}
				];

				var materialGridId = '31b8386f49a44ba4896b235ec064bd4e';

				function setupMaterialGrid() {

					if (!platformGridAPI.grids.exist(materialGridId)) {
						var materialGridConfig = {
							columns: angular.copy(materialGridColumns),
							data: [],
							id: materialGridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(materialGridConfig);
						platformTranslateService.translateGridConfig(materialGridConfig.columns);
					}
				}

				function updateMaterialGrid(selectedData) {
					platformGridAPI.grids.invalidate(materialGridId);
					platformGridAPI.items.data(materialGridId, selectedData);
				}

				/** ****************simulation*************/
				var simulationGridColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'New',
						name$tr$: 'estimate.main.createMaterialPackageWizard.new',
						editor: 'boolean',
						formatter: 'boolean',
						width: 75
					},
					{
						id: 'Matchness',
						field: 'Matchness',
						name: 'Matchness',
						name$tr$: 'estimate.main.createMaterialPackageWizard.matchness',
						readonly: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'StructureCode',
						field: 'Code',
						name: 'Structure Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
						readonly: true
					},
					{
						id: 'StructureDescription',
						name: 'Structure Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
						width: 150,
						field: 'Description',
						readonly: true
					},
					{
						id: 'Status',
						name: 'Status',
						name$tr$: 'estimate.main.createMaterialPackageWizard.Status',
						width: 100,
						field: 'PackageStatusFk',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						}
					},
					{
						id: 'PackageDescription',
						name: 'Package Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.packageDescription',
						width: 100,
						'editor': 'dynamic',
						formatter: 'dynamic',
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							var domain;
							if ('New' !== item.Matchness) {
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
							}
							else {
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
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							var domain;
							if ('New' !== item.Matchness) {
								domain = 'lookup';
								column.field = 'SubPackageFk';
								column.editorOptions = {
									lookupDirective: 'procurement-package-package2-header-combobox',
									'filterKey': 'sub-package-filter'
								};
								// column.editorOptions = {
								//    lookupDirective: 'procurement-package-package2-header-combobox'
								// };
								column.formatterOptions = {
									lookupType: 'prcpackage2header',
									valMember: 'Id',
									displayMember: 'Description'
								};
							}
							else {
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
						width: 100
					}, {
						id: 'Responsible',
						field: 'ClerkPrcFk',
						name: 'Responsible',
						name$tr$: 'estimate.main.createMaterialPackageWizard.responsible',
						editor: 'lookup',
						editorOptions: {
							'directive': 'cloud-clerk-clerk-dialog',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'clerk',
							'displayMember': 'Code'
						},
						width: 100
					}
				];

				$scope.packageDescriptionValueChange = function (selectItem, newValue, field) {
					if ('PackageDescription' === field) {
						selectItem.PackageDescription = newValue;
					}
					else if ('SubPackage' === field) {
						selectItem.SubPackage = newValue;
					}
					// tempFirstData
					var onePackageFlg = $scope.onePackageFlg;
					if (onePackageFlg && selectItem.Matchness === 'New') {
						var simulationGridData = platformGridAPI.items.data(simulationGridId);
						var newData = _.filter(simulationGridData, {'Matchness': 'New'});
						if (onePackageFlg && newData.length > 1) {
							var firstNewData = newData[0];
							_.forEach(newData, function (item) {
								item.PackageDescription = firstNewData.PackageDescription;
								item.SubPackage = firstNewData.SubPackage;
							});
							platformGridAPI.grids.invalidate(simulationGridId);
							platformGridAPI.items.data(simulationGridId, simulationGridData);
							platformGridAPI.grids.refresh(simulationGridId);
						}

					}
				};

				var simulationGridId = '17060CA12C09451FA5D20AF9608083A8';
				$scope.simulation = {
					state: simulationGridId
				};

				function setupSimulationGrid() {
					// $scope.selectedItem
					if (platformGridAPI.grids.exist(simulationGridId)) {
						platformGridAPI.events.unregister(simulationGridId, 'onCellChange');
						platformGridAPI.grids.unregister(simulationGridId);

					}
					var simulationGridConfig = {
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

				var tempSimulationData = [];

				function updateSimulationGrid(simulationData) {
					// reset data by new
					var newData = _.filter(simulationData, {'Matchness': 'New'});
					var onePackageFlg = $scope.onePackageFlg;
					if (newData.length > 0) {
						if (!(onePackageFlg && newData.length > 1)) {
							_.forEach(newData, function (item) {
								if (0 !== item.Id) {
									item.PackageDescription = item.Description;
									item.SubPackage = item.Description;
								}
							});
						}
						else {
							var firstNewData = newData[0];
							_.forEach(newData, function (item, index) {
								item.PackageDescription = firstNewData.Description;
								item.SubPackage = firstNewData.Description;
								if (index > 0) {
									setReadOnly(item, 'PackageDescription', true);
									setReadOnly(item, 'SubPackage', true);
								}
							});
						}
					}


					platformGridAPI.grids.invalidate(simulationGridId);
					// load list
					_.each(simulationData, function (item) {
						if ('New' === item.Matchness) {
							// item.Checked=true;
							item.Selected = true;
							setReadOnly(item, 'Selected', true);
							setReadOnly(item, 'ConfigurationFk', false);
							setReadOnly(item, 'ClerkPrcFk', false);
						}
						else {
							setReadOnly(item, 'ConfigurationFk', true);
							setReadOnly(item, 'ClerkPrcFk', true);
						}

					});
					tempSimulationData = angular.copy(simulationData);
					platformGridAPI.items.data(simulationGridId, simulationData);
				}

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
					var wz = WizardHandler.wizard($scope.wizardName);
					wz.previous();
					$scope.$parent.$parent.$parent.options.width = '650px';
					switch ($scope.selectStep.identifier) {
						case 'criteriaSelection':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'packageAssignment':
							var prevData = schedulingMainGenerateRequisitionService.getPreviousGridData();
							var flag = schedulingMainGenerateRequisitionService.getCreationFlag();
							if (flag === 0) {
								setupCriteriaGrid();
								updateCriteriaGrid(prevData);
								selectedGridId = criteriaGridId;
							} else if (flag === 1) {
								setupCostCodeSelectionGrid();
								updateCostTypeSelectionGrid(prevData);
								selectedGridId = costTypeSelectionGridId;
							} else if (flag === 2) {
								setupMaterialGroupGrid();
								updateMaterialGroupGrid(prevData);
								selectedGridId = materialGroupGridId;
							} else if (flag === 3) {
								$scope.$parent.$parent.$parent.options.width = '1040px';
								setupMaterialGrid();
								updateMaterialGrid(prevData);
								selectedGridId = materialGridId;
							}
							setCurrentStep($scope.selectStep.number - 1);
							break;
					}
				};

				function checkChildren(item, flg) {
					if (item.resultChildren !== null && item.resultChildren.length > 0) {
						for (var i = 0; i < item.resultChildren.length; i++) {
							checkChildren(item.resultChildren[i], flg);
						}
					}
					item.Selected = flg;
				}
				// reset
				$scope.reset = function () {
					if (platformGridAPI.grids.exist(simulationGridId)) {
						platformGridAPI.grids.invalidate(simulationGridId);
						var firstSimulationData = angular.copy(tempSimulationData);
						platformGridAPI.items.data(simulationGridId, firstSimulationData);
						platformGridAPI.grids.refresh(simulationGridId);
					}
				};
				var selectedGridId = criteriaGridId;
				$scope.nextStep = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					var goNext = true;
					var scheduleValue = $scope.entireScheduleValue === 1;
					// var filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
					var scheduleId = schedulingMainService.getSelectedSchedule();
					// filterRequest.PageNumber = 0;
					// filterRequest.PageSize = 100;
					$scope.$parent.$parent.$parent.options.width = '650px';
					switch ($scope.selectStep.number) {
						case 0:
							wz.next();
							break;
						case 1:
							var selectFlag = schedulingMainGenerateRequisitionService.getCreationFlag();
							var grid = platformGridAPI.grids.element('id', selectedGridId);
							var gridData = grid.dataView.getRows();
							var selectedItems = [];
							var selectCostItems = [];
							if (selectedItems.length === 0 && selectCostItems.length === 0) {
								platformModalService.showMsgBox($translate.instant('scheduling.main.noItemSelected'), '', 'ico-info'); // jshint ignore:line
								goNext = false;
								break;
							}
							var matchItems = {
								scheduleId: scheduleId,
								flag: selectFlag,
								resultSet: scheduleValue,
								selectIds: selectedItems,
							};
							$scope.$parent.$parent.$parent.options.width = '1040px';
							setupSimulationGrid();
							schedulingMainGenerateRequisitionService.getSimulation(matchItems).then(function (result) {

								updateSimulationGrid(result.data);

							});
							wz.next();
							break;
						case 2:
							grid = platformGridAPI.grids.element('id', simulationGridId);
							gridData = grid.dataView.getRows();
							var updateCreateData = {
								gridDatas: gridData,
								oneRequisitionFlg: $scope.oneRequisitionFlg
							};
							schedulingMainGenerateRequisitionService.updateOrCreateRequisition(updateCreateData).then(function (result) {
								var dialogOptions = {
									templateUrl: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-main-create-resource-requisition-step3.html',
									backdrop: false,
									width: '800px',
									windowClass: 'form-modal-dialog',
									headerTextKey: 'requisition assignment result',
									resizeable: true
								};
								schedulingMainGenerateRequisitionService.setResultData(result.data);
								platformModalService.showDialog(dialogOptions).then(function () {
								});
							});

							wz.next();
							break;
						default:
					}
					if (goNext) {
						setCurrentStep($scope.selectStep.number + 1);
					}
				};


				function onBeforeEditCell(e, args) {
					var currentItem = args.item;
					if (!currentItem) {
						return;
					}
					if ('PackageDescription' === args.column.id) {
						if ('New' !== currentItem.Matchness) {
							return false;
						}
					}
					return true;
				}

				function resetNewSimulationGrid() {
					var simulationData = platformGridAPI.items.data(simulationGridId);
					var newData = _.filter(simulationData, {'Matchness': 'New'});
					if (newData.length > 0) {
						var firstNewData = newData[0];

						_.forEach(newData, function (item, index) {
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


				function onCellModified(e, arg) {
					if (!arg.cell) {
						return false;
					}
					var propertyName = platformGridAPI.columns.configuration(simulationGridId).visible[arg.cell].field;
					var selected = platformGridAPI.rows.selection({
						gridId: simulationGridId
					});
					var checked = selected.Selected;
					var onpackageFlg = $scope.onePackageFlg;
					if ('Selected' === propertyName) {
						if (checked) {
							selected.Matchness = 'New';
							selected.PackageCodeFk = 0;
							selected.SubPackageFk = 0;
							if (!onpackageFlg) {
								selected.PackageDescription = selected.Description;
								selected.SubPackage = selected.Description;
							}
							else {
								resetNewSimulationGrid();
							}
							setReadOnly(selected, 'ConfigurationFk', false);
							setReadOnly(selected, 'ClerkPrcFk', false);
						}
						else {
							var firstData = angular.copy(_.find(tempSimulationData, {'Id': selected.Id}));
							selected.Matchness = firstData.Matchness;
							selected.PackageCodeFk = firstData.PackageCodeFk;
							selected.SubPackageFk = firstData.SubPackageFk;
							setReadOnly(selected, 'ConfigurationFk', true);
							setReadOnly(selected, 'ClerkPrcFk', true);
						}

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
				});
				$scope.close = function () {
					$scope.$parent.$close(false);
				};

				$scope.optioincheck = 0;
				$scope.onSamePackage = function (checkobj) {
					$scope.onePackageFlg = checkobj.onePackageFlg;
					if (checkobj.onePackageFlg) {
						$scope.eachMaterialCatalogFlg = false;
						checkobj.eachMaterialCatalogFlg = false;
					}

				};

				$scope.onEachMaterialCatalog = function (checkobj) {
					$scope.eachMaterialCatalogFlg = checkobj.eachMaterialCatalogFlg;
					if (checkobj.eachMaterialCatalogFlg) {
						$scope.onePackageFlg = false;
						checkobj.onePackageFlg = false;
					}
				};


				$scope.onResult = function (value) {
					$scope.entireScheduleValue = value;
				};
				$scope.onSelectChanged = function (selectedItem) {
					$scope.selectedItem = selectedItem;
				};

				var filters = [{
					key: 'create-package-configuration-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + moduleContext.packageRubricFk;
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
				},
				{
					key: 'sub-package-filter',
					serverKey: 'sub-package-filter',
					serverSide: true,
					fn: function (dataContext) {
						if (angular.isDefined(dataContext) && dataContext.PackageCodeFk !== null && dataContext.PackageCodeFk !== undefined) {
							return {ProjectFk: moduleContext.loginProject, PrcPackageFk: dataContext.PackageCodeFk};
						}
					}
				},
				{
					key: 'procurement-package-clerk-filter',
					serverSide: true,
					fn: function () {
						return 'IsLive=true';
					}
				}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);
			}]);
})(angular);
