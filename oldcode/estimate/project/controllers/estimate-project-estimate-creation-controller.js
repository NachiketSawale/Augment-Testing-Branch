/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals _ */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateProjectEstimateCreationWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard dialog used to collect the settings and informations to be able to create an estimate
	 **/
	let moduleName = 'estimate.project';
	angular.module(moduleName).controller('estimateProjectEstimateCreationWizardController',
		['$scope',
			'$q',
			'$sce',
			'$http',
			'$translate',
			'$interval',
			'moment',
			'platformGridAPI',
			'platformUtilService',
			'platformGridControllerService',
			'platformDialogService',
			'$timeout',
			'platformTranslateService',
			'platformModuleNavigationService',
			'estimateProjectService',
			'$injector',
			'cloudCommonGridService',
			'basicsLookupdataConfigGenerator',
			'platformModalService',
			'projectMainService',
			'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService',
			'estimateProjectWizardService',
			'WizardHandler',
			'estimateProjectEstimateAttributesUIConfigService',
			'estimateProjectBusinessAttributesUIConfigService',
			'estimateProjectGeneralAssumptionsUIConfigService',
			'estimateProjectLaborMaterialAddersUIConfigService',
			'estimateProjectVintageAttributesUIConfigService',
			'estimateProjectTargetValuesUIConfigService',
			'estimateProjectEstimateCreationValidationService',
			function (
				$scope,// jshint ignore:line
				$q,
				$sce,
				$http,
				$translate,
				$interval,
				moment,
				platformGridAPI,
				platformUtilService,
				platformDialogService,
				platformGridControllerService,
				$timeout,
				platformTranslateService,
				naviService,
				estimateProjectService,
				$injector,
				cloudCommonGridService,
				basicsLookupdataConfigGenerator,
				platformModalService,
				projectMainService,
				basicsLookupdataLookupFilterService,
				basicsLookupdataLookupDescriptorService,
				platformRuntimeDataService,
				estimateProjectWizardService,
				WizardHandler,
				estimateProjectEstimateAttributesUIConfigService,
				estimateProjectBusinessAttributesUIConfigService,
				estimateProjectGeneralAssumptionsUIConfigService,
				estimateProjectLaborMaterialAddersUIConfigService,
				estimateProjectVintageAttributesUIConfigService,
				estimateProjectTargetValuesUIConfigService,
				validateService) {

				$scope.isDisabled = false;
				$scope.path = globals.appBaseUrl;
				$scope.entity = $scope.modalOptions.estimateWizardDto;
				$scope.totalVintage = 0.00;
				$scope.steps = [
					{
						number: 0,
						identifier: 'estimateAttributes',
						name: $translate.instant('estimate.project.estimateCreationWizard.estimateAttributes')
					},
					{
						number: 1,
						identifier: 'businessAttributes',
						name: $translate.instant('estimate.project.estimateCreationWizard.businessAttributes')
					},
					{
						number: 2,
						identifier: 'generalAssumptions',
						name: $translate.instant('estimate.project.estimateCreationWizard.generalAssumptions')
					},
					{
						number: 3,
						identifier: 'laborMaterialAdders',
						name: $translate.instant('estimate.project.estimateCreationWizard.laborMaterialAdders')
					},
					{
						number: 4,
						identifier: 'vintageAttributes',
						name: $translate.instant('estimate.project.estimateCreationWizard.vintageAttributes')
					}
				];
				// //////////////
				// update dates to moment object

				$scope.entity.DateCreated = moment($scope.entity.DateCreated);
				$scope.entity.DateModified = $scope.entity.DateModified === null ? moment() : moment($scope.entity.DateModified);
				if (typeof $scope.entity.EstimateCharacteristicsByCode.SRVCE_DATE !== 'undefined' && typeof $scope.entity.EstimateCharacteristicsByCode.CONST_DATE !== 'undefined') {
					$scope.entity.EstimateCharacteristicsByCode.SRVCE_DATE.Value = $scope.entity.EstimateCharacteristicsByCode.SRVCE_DATE.Value === null ? moment() : moment($scope.entity.EstimateCharacteristicsByCode.SRVCE_DATE.Value);
					$scope.entity.EstimateCharacteristicsByCode.CONST_DATE.Value = $scope.entity.EstimateCharacteristicsByCode.CONST_DATE.Value === null ? moment() : moment($scope.entity.EstimateCharacteristicsByCode.CONST_DATE.Value);
				}
				// //////////////

				let _invalidRequiredFieldsByStep = {
					estimateAttributes: [],
					businessAttributes: [],
					generalAssumptions: [],
					laborMaterialAdders: [],
				};

				// ///////////////////////////////////////////////////////////////////
				//  Page 5 Grid
				// Define standard toolbar Icons and their function on the scope
				// let totalCurrentValue = 0;
				// let totalTargetValue = 0;
				let _vintageAttributesUserInput = {};
				_vintageAttributesUserInput.data = [];

				let _targetValuesUserInput = {};
				_targetValuesUserInput.data = [];
				let commitCell = false;
				let vintageGrid;

				let vintageAttributesGridId = '5bf72693bc3d4accae3bdd883fdcef2a';
				let targetValuesGridId = '72ccc9c3392846089f3f5552503ef6aa';
				$scope.vintageAttributesGridId = vintageAttributesGridId;
				$scope.targetValuesGridId = targetValuesGridId;

				_.forEach($scope.entity.VintageAttributes, function (vintageAttribute) {
					_vintageAttributesUserInput.data.push({
						Id: _vintageAttributesUserInput.data.length + 1,
						plantnoFk: vintageAttribute.FERCAccount_BAS_CHARACTERISTIC_FK,
						plantno: vintageAttribute.FERCAccount,
						generalruidFk: vintageAttribute.GreenfieldRUID_BAS_CHARACTERISTIC_FK,
						generalruid: vintageAttribute.GreenfieldRUID,
						specificruidFk: vintageAttribute.BrownfieldRUID_BAS_CHARACTERISTIC_FK,
						specificruid: vintageAttribute.BrownfieldRUID,
						currentvalue: vintageAttribute.CurrentValue,
						vintageyear: vintageAttribute.VintageYear,
						estimatetype: getFk('RUID-B')
					});
					$scope.totalVintage += vintageAttribute.CurrentValue;
				});

				_.forEach($scope.entity.TargetValues, function (targetValue) {
					_targetValuesUserInput.data.push({
						Id: _targetValuesUserInput.data.length + 1,
						plantnoFk: targetValue.FERCAccount_BAS_CHARACTERISTIC_FK,
						plantno: targetValue.FERCAccount,
						generalruidFk: targetValue.GreenfieldRUID_BAS_CHARACTERISTIC_FK,
						generalruid: targetValue.GreenfieldRUID,
						specificruidFk: targetValue.BrownfieldRUID_BAS_CHARACTERISTIC_FK,
						specificruid: targetValue.BrownfieldRUID,
						targetvalue: targetValue.TargetValue,
						vintageyear: targetValue.VintageYear,
					});
				});

				let refreshGrid = function () {
					platformGridAPI.items.data($scope.vintageAttributesGridId, _vintageAttributesUserInput.data);

					platformGridAPI.events.register($scope.vintageAttributesGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.register($scope.vintageAttributesGridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register($scope.targetValuesGridId, 'onSelectedRowsChanged', onSelectedTargetValueRowsChanged);
				};

				$scope.createItem = function createItem() {
					if ($scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT !== null) {
						let type = $scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value;
						if (type.includes('Removal')) {
							_vintageAttributesUserInput.data.push({
								Id: _vintageAttributesUserInput.data.length + 1,
								plantnoFk: getFk('FERC'),
								plantno: -1,
								generalruidFk: getFk('RUID-G'),
								generalruid: -1,
								specificruidFk: -1,
								specificruid: -1,
								currentvalue: 0,
								targetvalue: 0,
								vintageyear: 0,
								estimatetype: getFk('RUID-B')
								// include: true
							});
							refreshGrid();
						} else {
							platformModalService.showErrorBox('Vintage Attributes may be applied to Removal Estimate ONLY.', 'estimate.project.estimateCreationWizard.error').then(
								function () {
								});
						}
					}
				};

				$scope.deleteItem = function deleteItem() {
					let selectedItems = platformGridAPI.rows.selection({
						gridId: $scope.vintageAttributesGridId,
						wantsArray: true
					});
					if (selectedItems) {
						let allItems = _vintageAttributesUserInput.data;
						angular.forEach(selectedItems, function (item) {
							let index = allItems.findIndex(function (o) {
								return o.Id === item.Id;
							});
							allItems.splice(index, 1);
							$scope.totalVintage -= item.currentvalue;
						});
						refreshGrid();
						let i = 1;
						_.forEach(_vintageAttributesUserInput.data, function (values) {
							values.Id = i++;
						});
						refreshGrid();
					}
				};

				$scope.addTargetItem = function addTargetItem() {
					if ($scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT !== null) {
						let type = $scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value;
						if (type.includes('Removal')) {
							let selectedItems = platformGridAPI.rows.selection({
								gridId: $scope.targetValuesGridId,
								wantsArray: true
							});
							if (selectedItems) {
								angular.forEach(selectedItems, function (item) {
									_vintageAttributesUserInput.data.push({
										Id: _vintageAttributesUserInput.data.length + 1,
										plantnoFk: item.plantnoFk,
										plantno: item.plantno,
										generalruidFk: item.generalruidFk,
										generalruid: item.generalruid,
										specificruidFk: item.specificruidFk,
										specificruid: item.specificruid,
										currentvalue: item.targetvalue,
										vintageyear: 0,
										estimatetype: getFk('RUID-B')
									});
									$scope.totalVintage += item.targetvalue;
								});
								refreshGrid();
							}
						} else {
							platformModalService.showErrorBox('Vintage Attributes may be applied to Removal Estimate ONLY.', 'estimate.project.estimateCreationWizard.error').then(
								function () {
								});
						}
					}
				};

				$scope.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: $scope.createItem,
							disabled: false
						},
						{
							id: 't2',
							sort: 1,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: $scope.deleteItem,
							disabled: false
						},
					]
				};

				$scope.toolsTarget = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: $scope.addTargetItem,
							disabled: false
						}]
				};

				$scope.getVintageAttributesList = function getVintageAttributesList() {
					return platformGridAPI.items.data($scope.vintageAttributesGridId);
				};

				$scope.getTargetValuesList = function getTargetValuesList() {
					return platformGridAPI.items.data($scope.targetValuesGridId);
				};

				function onSelectedRowsChanged() {
					let selectedItems = platformGridAPI.rows.selection({
						gridId: $scope.vintageAttributesGridId,
						wantsArray: true
					});
					if (selectedItems && selectedItems.length > 0) {
						$scope.selectedItem = selectedItems[0];
					}
				}

				function onSelectedTargetValueRowsChanged() {
					let selectedItems = platformGridAPI.rows.selection({
						gridId: $scope.targetValuesGridId,
						wantsArray: true
					});
					if (selectedItems && selectedItems.length > 0) {
						$scope.selectedItem = selectedItems[0];
					}
				}

				function onCellChange(e, args) {
					let col = args.grid.getColumns()[args.cell].field;
					let yearlength = args.item.vintageyear.toString().length;
					let yearstring = '0000';
					if (col === 'vintageyear') {
						if (args.item.vintageyear === '') {
							platformModalService.showErrorBox('Field cannot be empty. Default is 0', 'estimate.project.estimateCreationWizard.error');
							args.item.vintageyear = 0;
						} else if (yearlength !== 4) {
							platformModalService.showErrorBox('Invalid year value. Default is 0', 'estimate.project.estimateCreationWizard.error');
							if (yearlength > 4) {
								args.item.vintageyear = parseInt(args.item.vintageyear.toString().substr(0, 4));
							} else {
								args.item.vintageyear = parseInt(args.item.vintageyear.toString() + yearstring.substr(0, 4 - yearlength));
							}
						}
					}
					if (col === 'currentvalue') {
						if (args.item.currentvalue === '') {
							platformModalService.showErrorBox('Field cannot be empty. Default is 0', 'estimate.project.estimateCreationWizard.error');
							args.item.currentvalue = 0;
						} else {
							$scope.totalVintage = 0;
							_vintageAttributesUserInput.data[args.row].currentvalue = args.item.currentvalue;
						}

						_.forEach(_vintageAttributesUserInput.data, function (values) {
							$scope.totalVintage += values.currentvalue;
						});
					}
					// refresh grid
					platformGridAPI.grids.invalidate($scope.vintageAttributesGridId);
				}

				/* platformGridAPI.events.register($scope.vintageAttributesGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.vintageAttributesGridId, 'onCellChange', onCellChange);
				platformGridAPI.events.register($scope.targetValuesGridId, 'onSelectedRowsChanged', onSelectedTargetValueRowsChanged); */

				let autoCommitCell = $interval(function () {
					vintageGrid = platformGridAPI.grids.element('id', $scope.vintageAttributesGridId);
					if (vintageGrid && vintageGrid.instance) {
						let tmp = vintageGrid.instance.getEditorLock().isActive();
						if (tmp && vintageGrid.instance.getActiveCell() &&
							vintageGrid.instance.getCellEditor()) {
							commitCell = !!vintageGrid.instance.getCellEditor().isValueChanged();
						}
					}
				});

				$scope.$on('$destroy', function () {
					$interval.cancel(autoCommitCell);
					platformGridAPI.events.unregister($scope.vintageAttributesGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.vintageAttributesGridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.targetValuesGridId, 'onSelectedRowsChanged', onSelectedTargetValueRowsChanged);
					platformGridAPI.grids.unregister($scope.vintageAttributesGridId);
					platformGridAPI.grids.unregister($scope.targetValuesGridId);
				});

				$scope.$on('wizard:stepChanged', function (event, data) {
					if (data.step.stepDefinition.id !== $scope.selectStep.identifier) {
						$scope.selectStep = angular.copy($scope.steps[data.index]);
					}
				});

				function initVintageAttributesGrid() {
					let gridOptionsVintageAttributesSettings = estimateProjectVintageAttributesUIConfigService.getVintageAttributesGridConfig();
					gridOptionsVintageAttributesSettings.data = _vintageAttributesUserInput.data;
					platformGridAPI.grids.config(gridOptionsVintageAttributesSettings);
					platformTranslateService.translateGridConfig(gridOptionsVintageAttributesSettings.columns);

					platformGridAPI.events.register($scope.vintageAttributesGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.register($scope.vintageAttributesGridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register($scope.targetValuesGridId, 'onSelectedRowsChanged', onSelectedTargetValueRowsChanged);
				}

				function initTargetValuesGrid() {
					let gridOptionsTargetValuesSettings = estimateProjectTargetValuesUIConfigService.getTargetValuesGridConfig();
					gridOptionsTargetValuesSettings.data = _targetValuesUserInput.data;
					platformGridAPI.grids.config(gridOptionsTargetValuesSettings);
					platformTranslateService.translateGridConfig(gridOptionsTargetValuesSettings.columns);
				}

				function getFk(val) {
					let type = '';
					let fk = -1;
					switch (val) {
						case 'FERC':
							if ($scope.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value !== null) {
								let fercAcct = $scope.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value;
								if (fercAcct === 'Distribution') {
									fk = $scope.entity.VintageAttributesCharacteristics['FERC-D'].Id;
								} else if (fercAcct === 'Generation') {
									fk = $scope.entity.VintageAttributesCharacteristics['FERC-G'].Id;
								} else if (fercAcct === 'Joint') {
									fk = $scope.entity.VintageAttributesCharacteristics['FERC-J'].Id;
								} else if (fercAcct === 'Transmission') {
									type = $scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value;
									if (type.includes('Line')) {
										fk = $scope.entity.VintageAttributesCharacteristics['FERC-T-LIN'].Id;
									} else if (type.includes('Station')) {
										fk = $scope.entity.VintageAttributesCharacteristics['FERC-T-STN'].Id;
									}
								}
							}
							break;

						case 'RUID-G':
							if ($scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT !== null) {
								type = $scope.entity.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value;
								if (type.includes('Station')) {
									fk = $scope.entity.VintageAttributesCharacteristics['RUID-G-STN'].Id;
								} else if (type.includes('Line')) {
									fk = $scope.entity.VintageAttributesCharacteristics['RUID-G-LIN'].Id;
								}
							}
							break;
						case 'RUID-B':
							// fk = $scope.entity.VintageAttributesCharacteristics['RUID-B'].Id;
							if ($scope.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value !== null) {
								fk = $scope.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value;
							}
							break;
					}

					return fk;
				}

				// /////////////////////////////////////////////////////////////////

				$scope.isLoading = false;
				$scope.loadingInfo = '';
				$scope.filterOptions = {};
				$scope.wzStrings = {
					cancel: $translate.instant('platform.cancelBtn'),
					finish: $translate.instant('estimate.project.saveAndClose'),
					nextStep: $translate.instant('platform.wizard.nextStep'),
					stepFinish: $translate.instant('estimate.project.saveAndClose')
				};

				// config view step 0 (Estimate Attributes Setting)
				let formConfigEstimateAttributesSettings = estimateProjectEstimateAttributesUIConfigService.getFormConfig();
				$scope.formOptionsEstimateAttributesSettings = {configure: formConfigEstimateAttributesSettings};

				// config view step 1 (Business Attributes Setting)
				let formConfigBusinessAttributesSettings = estimateProjectBusinessAttributesUIConfigService.getFormConfig();
				$scope.formOptionsBusinessAttributesSettings = {configure: formConfigBusinessAttributesSettings};

				// config view step 2 (General Assumptions Setting)
				let formConfigGeneralAssumptionsSettings = estimateProjectGeneralAssumptionsUIConfigService.getFormConfig();
				$scope.formOptionsGeneralAssumptionsSettings = {configure: formConfigGeneralAssumptionsSettings};

				// config view step 3 (Labor Material Adders Setting)
				let formConfigLaborMaterialAddersSettings = estimateProjectLaborMaterialAddersUIConfigService.getFormConfig();
				$scope.formOptionsLaborMaterialAddersSettings = {configure: formConfigLaborMaterialAddersSettings};

				// config view step 4 (Vintage Attributes Setting in Grid)
				$scope.gridOptionsVintageAttributesSettings = {state: vintageAttributesGridId};

				// config view step 4 (Vintage Attributes Setting in Grid)
				$scope.gridOptionsTargetValuesSettings = {state: targetValuesGridId};

				$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';

				$scope.selectStep = angular.copy($scope.steps[0]);
				$scope.wizardName = $scope.modalOptions.value.wizardName;

				$scope.wizard = $scope.modalOptions.value.wizard;

				$scope.getEnabledSteps = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};
				$scope.stepStack = [];
				$scope.currentStep = angular.copy($scope.steps[0]);

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

				$scope.getNextStep = function getNextStep(titleOnly) {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						let nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
						if (titleOnly) {
							return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
						} else {
							return nextStep;
						}
					}
				};

				$scope.isLastStep = function () {
					return $scope.selectStep.number === $scope.steps.length - 1;
				};

				$scope.isFirstStep = function () {
					if ($scope.isDisabled === false) {
						return $scope.selectStep.number === 0;
					} else {
						return true;
					}
				};

				$scope.previousStep = function () {
					switch ($scope.selectStep.identifier) {
						case 'businessAttributes':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'generalAssumptions':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'laborMaterialAdders':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'vintageAttributes':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						default:
							if (!$scope.isFirstStep()) {
								let previousNumber = $scope.selectStep.number - 1;
								setCurrentStep(previousNumber);
							}
							break;
					}
				};

				$scope.nextStep = function () {
					switch ($scope.selectStep.identifier) {
						case 'estimateAttributes':
							_invalidRequiredFieldsByStep.estimateAttributes = [];
							_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateRequiredCharacteristics($scope.formOptionsEstimateAttributesSettings, $scope.entity.EstimateCharacteristicsByCode);
							_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateEstimateType(_invalidRequiredFieldsByStep.estimateAttributes, $scope.entity.EstimateType);
							_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateDates(_invalidRequiredFieldsByStep.estimateAttributes, $scope.entity.EstimateCharacteristicsByCode);
							if (_invalidRequiredFieldsByStep.estimateAttributes.length === 0) {
								setCurrentStep($scope.selectStep.number + 1);
							} else {
								validateService.showErrorMsg(_invalidRequiredFieldsByStep.estimateAttributes);
							}
							break;
						case 'businessAttributes':
							_invalidRequiredFieldsByStep.businessAttributes = [];
							_invalidRequiredFieldsByStep.businessAttributes = validateService.validateRequiredCharacteristics($scope.formOptionsBusinessAttributesSettings, $scope.entity.EstimateCharacteristicsByCode);
							if (_invalidRequiredFieldsByStep.businessAttributes.length === 0) {
								setCurrentStep($scope.selectStep.number + 1);
							} else {
								validateService.showErrorMsg(_invalidRequiredFieldsByStep.businessAttributes);
							}
							break;
						case 'generalAssumptions':
							_invalidRequiredFieldsByStep.generalAssumptions = [];
							_invalidRequiredFieldsByStep.generalAssumptions = validateService.validateRequiredCharacteristics($scope.formOptionsGeneralAssumptionsSettings, $scope.entity.EstimateCharacteristicsByCode);
							if (_invalidRequiredFieldsByStep.generalAssumptions.length === 0) {
								setCurrentStep($scope.selectStep.number + 1);
							} else {
								validateService.showErrorMsg(_invalidRequiredFieldsByStep.generalAssumptions);
							}
							break;
						case 'laborMaterialAdders':
							_invalidRequiredFieldsByStep.laborMaterialAdders = [];
							_invalidRequiredFieldsByStep.laborMaterialAdders = validateService.validateRequiredCharacteristics($scope.formOptionsLaborMaterialAddersSettings, $scope.entity.EstimateCharacteristicsByCode);
							if (_invalidRequiredFieldsByStep.laborMaterialAdders.length === 0) {
								initVintageAttributesGrid();
								initTargetValuesGrid();
								setCurrentStep($scope.selectStep.number + 1);
							} else {
								validateService.showErrorMsg(_invalidRequiredFieldsByStep.laborMaterialAdders);
							}
							break;
						case 'vintageAttributes':
							setCurrentStep($scope.selectStep.number + 1);
							break;
						default:
							if ($scope.isLastStep()) {
								let nextNumber = $scope.selectStep.number + 1;
								setCurrentStep(nextNumber);
							}
							break;
					}
				};

				function setCurrentStep(step) {
					let currentStepNumber = $scope.selectStep.number;

					$scope.selectStep = angular.copy($scope.steps[step]);

					let wz = WizardHandler.wizard($scope.wizardName);
					let allSteps = wz.getEnabledSteps();
					for (let i = 0; i < step; i++) {
						allSteps[i].completed = true;
					}
					for (let j = allSteps.length - 1; j >= step; j--) {
						allSteps[j].selected = false;
						if ($scope.entity.EstimateId === -1) {
							allSteps[j].completed = false;
						} else {
							allSteps[j].completed = true;
						}
					}
					if ($scope.entity.EstimateId === -1) {
						allSteps[step].completed = currentStepNumber > step;
					}
					wz.goTo(step);
				}

				$scope.goTo = function goTo(step) {
					if ($scope.currentStep) {
						$scope.stepStack.push($scope.currentStep);
					}
					$scope.currentStep = step;
				};

				$scope.getButtonText = function () {
					if ($scope.isLastStep()) {
						return $translate.instant('basics.common.button.ok');
					}

					return $translate.instant('basics.common.button.nextStep');
				};

				$scope.canExecuteNextButton = function () {
					switch ($scope.selectStep.number) {
						case 0: {
							return true;
						}
						case 1:
							return true;
						case 2:
							return true;
						case 3:
							return true;
						case 4:
							return false;
						default:
							return !$scope.isLoading;
					}
				};

				$scope.canCancel = function () {
					if ($scope.isDisabled === true)
						return false;

					if ($scope.isDisabled === false)
						return true;
				};

				$scope.execute = function () {
					if ($scope.selectStep.number !== 4) {
						_invalidRequiredFieldsByStep.estimateAttributes = [];
						_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateRequiredCharacteristics($scope.formOptionsEstimateAttributesSettings, $scope.entity.EstimateCharacteristicsByCode);
						_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateEstimateType(_invalidRequiredFieldsByStep.estimateAttributes, $scope.entity.EstimateType);
						_invalidRequiredFieldsByStep.estimateAttributes = validateService.validateDates(_invalidRequiredFieldsByStep.estimateAttributes, $scope.entity.EstimateCharacteristicsByCode);
						if (_invalidRequiredFieldsByStep.estimateAttributes.length !== 0) {
							validateService.showErrorMsg(_invalidRequiredFieldsByStep.estimateAttributes);
							return false;
						}

						_invalidRequiredFieldsByStep.businessAttributes = [];
						_invalidRequiredFieldsByStep.businessAttributes = validateService.validateRequiredCharacteristics($scope.formOptionsBusinessAttributesSettings, $scope.entity.EstimateCharacteristicsByCode);
						if (_invalidRequiredFieldsByStep.businessAttributes.length !== 0) {
							validateService.showErrorMsg(_invalidRequiredFieldsByStep.businessAttributes);
							return false;
						}

						_invalidRequiredFieldsByStep.generalAssumptions = [];
						_invalidRequiredFieldsByStep.generalAssumptions = validateService.validateRequiredCharacteristics($scope.formOptionsGeneralAssumptionsSettings, $scope.entity.EstimateCharacteristicsByCode);
						if (_invalidRequiredFieldsByStep.generalAssumptions.length !== 0) {
							validateService.showErrorMsg(_invalidRequiredFieldsByStep.generalAssumptions);
							return false;
						}

						_invalidRequiredFieldsByStep.laborMaterialAdders = [];
						_invalidRequiredFieldsByStep.laborMaterialAdders = validateService.validateRequiredCharacteristics($scope.formOptionsLaborMaterialAddersSettings, $scope.entity.EstimateCharacteristicsByCode);
						if (_invalidRequiredFieldsByStep.laborMaterialAdders.length !== 0) {
							validateService.showErrorMsg(_invalidRequiredFieldsByStep.laborMaterialAdders);
							return false;
						}
					}

					let copyData = $scope.entity;

					// disable the back next buttons
					$scope.isDisabled = true;

					copyData.DateModified = '';
					angular.forEach(copyData.EstimateCharacteristicsByCode, function (item) {
						if (item.ValueFk !== 'undefined') {
							if (item.ValueFk === null) {
								item.ValueFk = -1;
							}
						}
					});
					if (copyData.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value.includes('Removal')) {
						if (commitCell && vintageGrid.instance) {
							vintageGrid.instance.getEditorLock().commitCurrentEdit();
						}
						copyData.VintageAttributes = [];
						_.forEach(_vintageAttributesUserInput.data, function (input) {
							copyData.VintageAttributes.push({
								FERCAccount_BAS_CHARACTERISTIC_FK: input.plantnoFk,
								FERCAccount: input.plantno,
								GreenfieldRUID_BAS_CHARACTERISTIC_FK: input.generalruidFk,
								GreenfieldRUID: input.generalruid,
								BrownfieldRUID_BAS_CHARACTERISTIC_FK: input.specificruidFk,
								BrownfieldRUID: input.specificruid,
								CurrentValue: input.currentvalue !== '' ? input.currentvalue : 0,
								VintageYear: input.vintageyear !== '' ? input.vintageyear : 0,
								Include: input.include === true ? 1 : 0
							});
						});
					}
					let prevId = copyData.EstimateId;
					$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/saveestimate', copyData)
						.then(function (response) {
							if (response !== null) {
								let prjId = response.data.projectId;
								let estimateId = response.data.estimateId;
								let name = response.data.estimateName;

								if (prjId !== -1 && estimateId !== -1 && name !== null && prevId === -1) {
									copyData.EstimateId = estimateId;
									copyData.Name = name;
									// run twice for new estimates to allow delete if failure occurs. once for existing
									$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/saveestimate', copyData)
										.then(function (response) {
											if (response !== null) {
												projectMainService.callRefresh();
												$scope.close();
											} else {
												$scope.isDisabled = false;
												// delete estimate
												$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/deleteestimate', estimateId)
													.then(function () {
													});
											}
										});
								} else {
									projectMainService.callRefresh();
									$scope.close();
								}
							}
						},
						function (/* error */) {
							$scope.isDisabled = false;
							let modalOptions = {
								headerText: $translate.instant('estimate.project.estimateCreationWizard.error'),
								bodyText: $translate.instant('estimate.project.estimateCreationWizard.errorOnSave'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions).then();
						});
				};

				$scope.canExecute = function () {

					let canExecute = false;
					if ($scope.entity.EstimateId !== -1 || $scope.selectStep.number === 4) {
						canExecute = true;
					}

					if ($scope.selectStep.number === 4 && $scope.isDisabled === true) {
						canExecute = false;
					}

					return canExecute;
				};

				$scope.close = function () {
					$scope.$parent.$close(false);
				};

				$scope.errorAndClose = function (msg) {
					platformModalService.showErrorBox(msg, 'estimate.project.estimateCreationWizard.error').then(
						function () {
							$scope.close();
						});
				};

				$scope.change = function change(item, model) {
					switch (model) {
						case 'Template':
							updateWizardPages(item);
							break;
					}
				};

				function updateWizardPages(item) {
					// close current dialog
					$scope.close();

					// call object
					estimateProjectWizardService.createOrUpdateEstimateWizard(
						{
							Template: item.Template,
							EstimateId: item.EstimateId,
							Name: item.EstimateCharacteristicsByCode.EST_SHORT_NAME.Value !== null ? item.EstimateCharacteristicsByCode.EST_SHORT_NAME.Value : '', // item.Name
							EstimateType: item.EstimateType !== null ? item.EstimateType : -1,
							EstimateTypeDescription: item.EstimateTypeDescription,
						});
				}

				$scope.configureWizard = function configureWizard(data) {
					// set ReadOnly
					let row;
					let showHide;
					let type;

					// New Estimate (Create) or Existing Estimate (Update)
					if (data.EstimateId === -1) {
						row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'Template'});
						row.readonly = false;

						row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'EstimateType'});
						row.readonly = false;

						row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'EstimateCharacteristicsByCode.EST_SHORT_NAME.Value'});
						row.readonly = false;
					} else {
						row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'Template'});
						row.readonly = true;

						row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'EstimateType'});
						row.readonly = true;

						if (typeof data.EstimateCharacteristicsByCode.TEMPLATE_ID === 'undefined') {
							$scope.errorAndClose('estimate.project.estimateCreationWizard.noWizardError');
						} else if ((data.EstimateCharacteristicsByCode.TEMPLATE_ID.Value === null) || (data.EstimateCharacteristicsByCode.TEMPLATE_ID.Value === '')) {
							row = _.find($scope.formOptionsEstimateAttributesSettings.configure.rows, {'rid': 'EstimateCharacteristicsByCode.EST_SHORT_NAME.Value'});
							row.readonly = true;
						}
					}

					if (typeof data.EstimateCharacteristicsByCode.BASE_TEMP_INT === 'undefined') {
						$scope.errorAndClose('estimate.project.estimateCreationWizard.noTemplateError');
					} else if (typeof data.EstimateCharacteristicsByCode.TEMPLATE_ID === 'undefined') {
						$scope.errorAndClose('estimate.project.estimateCreationWizard.noWizardError');
					} else {
						// Templates
						switch (data.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value) {

							case 'Station+Installation':
							case 'Station+Removal':
							case 'Station+REAM':
								type = 'Station';
								showHide = [
									// hide rows
									{
										wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.TLNE_TYP.ValueFk',
										visible: false,
										sortOrder: 10
									},
									{
										wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.TLNE_PRJTYP.ValueFk',
										visible: false,
										sortOrder: 15
									},
									{
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.groups,
										gid: 'assetAttributesLine',
										visible: false,
										sortOrder: 3
									},
									{
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.groups,
										gid: 'transmissionLineAttributes',
										visible: false,
										sortOrder: 3
									},
								];
								break;

							case 'Line+Installation':
							case 'Line+Removal':
							case 'Line+ROW':
								type = 'Line';
								showHide = [
									// reset all fields
									{
										wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.STATN_TYP.ValueFk',
										visible: false,
										sortOrder: 9
									},
									{
										wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.LAYOUT.ValueFk',
										visible: false,
										sortOrder: 14
									},
									{
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.groups,
										gid: 'assetAttributesStation',
										visible: false,
										sortOrder: 3
									}
								];
								break;
						}
						showHideWizardRows(showHide);
					}

					if (typeof data.EstimateCharacteristicsByCode.WOT === 'undefined') {
						$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkOptionTypeError');
					} else {
						// Work Option Type
						switch (data.EstimateCharacteristicsByCode.WOT.Value) {
							case 'Construction':
								if (typeof data.EstimateCharacteristicsByCode.WOT_CONST === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkOptionTypeConstructionError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_CONST.ValueFk',
											visible: true,
											sortOrder: 6
										},
									];
								}
								if (type === 'Line') {
									showHide.push({
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
										visible: false,
										sortOrder: 7
									});
								}
								break;
							case 'Removal':
								if (typeof data.EstimateCharacteristicsByCode.WOT_RMV === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkTypeRemovalError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_RMV.ValueFk',
											visible: true,
											sortOrder: 6
										},
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.REMOVAL.Value',
											visible: true,
											sortOrder: 6
										},
									];
								}
								if (type === 'Line') {
									showHide.push({
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
										visible: false,
										sortOrder: 7
									});
								}
								break;
							case 'ROW':
								// only Line Row Estimates
								if (typeof data.EstimateCharacteristicsByCode.WOT_ROW === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkTypeRowError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_ROW.ValueFk',
											visible: true,
											sortOrder: 6
										},
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.groups,
											gid: 'workOrderCreationInformation',
											visible: false,
											sortOrder: 3
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.SHLDWIRE1.Value',
											visible: false,
											sortOrder: 2,
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.SHLDWIRE2.Value',
											visible: false,
											sortOrder: 3,
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WIRE_PHASE.Value',
											visible: false,
											sortOrder: 4,
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
											visible: true,
											sortOrder: 7
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.CNDCTR_TYP.ValueFk',
											visible: false,
											sortOrder: 7,
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.BNDLCNDCTR.Value',
											visible: false,
											sortOrder: 8,
										},
										{
											wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.NUM_CIRC.Value',
											visible: false,
											sortOrder: 8,
										}];
								}
								break;
							case 'EstimateDefaults':
								if (typeof data.EstimateCharacteristicsByCode.WOT_EST_DFT === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkTypeEstDftError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_EST_DFT.ValueFk',
											visible: true,
											sortOrder: 6
										},
									];
								}
								if (type === 'Line') {
									showHide.push({
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
										visible: false,
										sortOrder: 7
									});
								}
								break;

							case 'REAM':
								if (typeof data.EstimateCharacteristicsByCode.WOT_REAM === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkTypeReamError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_REAM.ValueFk',
											visible: true,
											sortOrder: 6
										},
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.groups,
											gid: 'workOrderCreationInformation',
											visible: false,
											sortOrder: 3
										},
									];
								}
								break;
							case 'Maintenance':
								if (typeof data.EstimateCharacteristicsByCode.WOT_MAINT === 'undefined') {
									$scope.errorAndClose('estimate.project.estimateCreationWizard.noWorkTypeMaintError');
								} else {
									showHide = [
										{
											wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows,
											rid: 'EstimateCharacteristicsByCode.WOT_MAINT.ValueFk',
											visible: true,
											sortOrder: 6
										},
									];
								}
								if (type === 'Line') {
									showHide.push({
										wizardStep: $scope.formOptionsBusinessAttributesSettings.configure.rows,
										rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
										visible: false,
										sortOrder: 7
									});
								}
								break;
						}
						showHideWizardRows(showHide);
					}
				};

				$scope.configureWizard($scope.entity);

				function showHideWizardRows(rows) {
					// wizardStep: $scope.formOptionsEstimateAttributesSettings.configure.rows
					// rid: 'EstimateCharacteristicsByCode.TLNE_TYP.ValueFk'
					// visible: true or false
					_.each(rows, function (item) {

						if (item.rid !== null && item.rid !== undefined) {
							let row = _.find(item.wizardStep, {'rid': item.rid});
							row.visible = item.visible;
						} else if (item.gid !== null && item.gid !== undefined) {
							let group = _.find(item.wizardStep, {'gid': item.gid});
							group.visible = item.visible;
						}

					});
				}

			}]);
})();
