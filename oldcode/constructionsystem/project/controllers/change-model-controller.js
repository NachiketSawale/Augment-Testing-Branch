/**
 * Created by lcn on 8/17/2017.
 */
/* global globals */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/* jshint -W072 */ // This function has too many parameters
	angular.module(moduleName).controller('constructionSystemProjectChangeModelController', ['_', '$scope', '$http', 'WizardHandler', '$translate',
		'platformWatchListService', 'constructionSystemProjectInstanceHeaderService', 'constructionSystemProjectCosInstanceGridConfigService', 'platformGridAPI', 'constructionSystemMainApplyLineItemToEstimateWizardService', 'platformModuleNavigationService', 'constructionSystemMainInstanceService', 'basicsCommonDialogGridControllerService', 'platformModalService',
		function (_, $scope, $http, WizardHandler, $translate, platformWatchListService, constructionSystemProjectInstanceHeaderService, constructionSystemProjectCosInstanceGridConfigService,
			platformGridAPI, constructionSystemMainApplyLineItemToEstimateWizardService, naviService, constructionSystemMainInstanceService, basicsCommonDialogGridControllerService, platformModalService) { // jshint ignore:line
			var selectedCosItem;
			$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/componeonChangeStepnts/wizard/partials/wizard-template.html';
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.wizard = $scope.modalOptions.value.wizard;
			$scope.entity = $scope.modalOptions.value.entity;
			$scope.wizardCommands = {
				goToNext: function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					wz.next();
				},
				goToPrevious: function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					wz.previous();
				},
				finish: function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if($scope.currentStep.id === 'updateInstanceStep' || $scope.currentStep.id === 'applyLineItemToEstimateSetp') {
						goToUpdate();
					}
					wz.finish();
				}
			};
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
				stepFinish: $translate.instant('platform.wizard.stepFinish'),
				back: $translate.instant('platform.wizard.back'),
				next: $translate.instant('platform.wizard.next'),
				cancel: $translate.instant('platform.cancelBtn'),
				finish: $translate.instant('platform.wizard.finish'),
				nextStep: $translate.instant('platform.wizard.nextStep')
			};
			// $scope.automatically = false;
			$scope.applyEstimate = false;
			$scope.applyCalculation = false;
			$scope.applySelectionStatement = true;
			$scope.updateOnApply = false;
			$scope.overrideOnApply = false;

			$scope.onOptionChange = function (option, value) {
				$scope[option] = value;

				if (option === 'applyCalculation' && !value) {
					$scope.applyEstimate = false;
				}
				if (option === 'applyEstimate' && value) {
					$scope.applyCalculation = true;
				}
				if (option === 'updateOnApply' && value) {
					$scope.overrideOnApply = false;
				}
				if (option === 'overrideOnApply' && value) {
					$scope.updateOnApply = false;
				}

				var wz = WizardHandler.wizard($scope.wizardName);
				var currentStep = wz.currentStep().stepDefinition;

				if (currentStep.id === 'updateInstanceStep') {
					var steps = $scope.wizard.steps;
					// next
					if ($scope.applyEstimate) {
						var result = {
							id: 'applyLineItemToEstimateSetp',
							title: 'Estimate result apply options',
							disallowBack: true,
							disallowNext: true,
							canFinish: true
						};
						steps.push(result);
						currentStep.disallowNext = false;
						currentStep.canFinish = false;
					}
					// finsih
					else {
						steps.splice(2, 1);
						currentStep.disallowNext = true;
						currentStep.canFinish = true;
					}
				}
			};

			var newModelId = {};

			function change2Dmodel(stepInfo) {
				const step = stepInfo.step;
				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/updateheader2dmodel', {
					ModelId: selectedCosItem.ModelFk,
					NewModelId: stepInfo.model.modelId,
					CosInsHeaderId: selectedCosItem.Id
				}).then(function (res) {
					step.loadingMessage = undefined;
					step.message = 'done';
					step.canFinish = res.data;
				});
			}

			function goToUpdate() {
				var postData = {
					EstimateHeaderId: selectedCosItem.EstimateHeaderFk,
					ModelId: selectedCosItem.ModelFk,
					NewModelId: newModelId,
					CosInsHeaderId: selectedCosItem.Id
				};
				var postData1 = {
					CosInsHeaderId: selectedCosItem.Id,
					ModelId: selectedCosItem.ModelFk,
					NewModelId: newModelId,
					IsAutoApply: $scope.applyEstimate,
					IsAutoCalculate: $scope.applyCalculation,
					IsAutoSelectionStatement: $scope.applySelectionStatement,
					UpdateOnApply: $scope.updateOnApply,
					OverrideOnApply: $scope.overrideOnApply
				};
				// Update automatically -lineitem
				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/updatechangemodel', postData).then(function () {
					// Update automatically -instances
					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/updateinstancesmodel', postData1).then(function (res) {
						if (res.data) {
							constructionSystemProjectInstanceHeaderService.callRefresh();
							var navigator = {moduleName: 'constructionsystem.main'};
							if (constructionSystemMainInstanceService.isSelection(selectedCosItem)) {
								selectedCosItem.ModelFk = newModelId;
								naviService.navigate(navigator, selectedCosItem, 'Code');
							}
						}
						else {
							var modalOptions = {
								headerText: $translate.instant('project.main.projects'),
								bodyText: $translate.instant('constructionsystem.project.runningTaskMessage'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						}
					});
				});


			}

			var gridId = 'B93D6C1B8EAC43EA893CF71C77FE99CF';
			selectedCosItem = constructionSystemProjectInstanceHeaderService.getSelected();

			// eslint-disable-next-line no-unused-vars
			function updateEstimateMakeFlagCountMessage(dataItem) {
				var text = '';
				var icon = '';

				switch (dataItem.Flag) {
					case 0: // without
						text = $translate.instant('model.viewer.changeModelWz.labelChangeModelWithout');
						icon = 'status01';
						break;
					case 1: // changed
						text = $translate.instant('model.viewer.changeModelWz.labelChangeModelChanged');
						icon = 'status25';
						break;
					case 2: // kept
						text = $translate.instant('model.viewer.changeModelWz.labelChangeModelKept');
						icon = 'status44';
						break;
				}

				return '<img src="$$src$$"/><span>$$text$$</span>'
					.replace(/\$\$src\$\$/gm, globals.appBaseUrl + '/cloud.style/content/images/status-icons.svg#ico-' + icon)
					.replace(/\$\$text\$\$/gm, dataItem.Count + ' ' + text);
			}

			function updateInstanceMakeFlagCountMessage(dataItem) {
				var text = '';
				var icon = '';

				/** @namespace dataItem.Flag */
				switch (dataItem.Flag) {
					case 1:
						text = $translate.instant('constructionsystem.project.labelInstanceUpdated');
						icon = 'status25';
						break;
					case 2:
						text = $translate.instant('constructionsystem.project.labelInstanceDeleted');
						icon = 'status01';
						break;
					case 3:
						text = $translate.instant('constructionsystem.project.labelInstanceKept');
						icon = 'status02';
						break;
					case 4:
						text = $translate.instant('constructionsystem.project.labelInstanceNew');
						icon = 'status45';
						break;
					case 5:
						text = $translate.instant('constructionsystem.project.labelObjectWithoutCos');
						icon = 'status44';
						break;
				}

				return '<img src="$$src$$"/><span>$$text$$</span>'
					.replace(/\$\$src\$\$/gm, globals.appBaseUrl + '/cloud.style/content/images/status-icons.svg#ico-' + icon)
					.replace(/\$\$text\$\$/gm, dataItem.Count + ' ' + text);
			}

			$scope.wizard.onChangeStep = function onChangeStep(info) {

				var currentStep = info.step;
				switch (info.step.id) {
					case 'selectorStep':
						currentStep.number = 0;
						break;

					case 'updateInstanceStep':
						if ($scope.wizard.steps.length > 2) {
							$scope.wizard.steps.splice(2, 1);
						}
						currentStep.messages = null;
						currentStep.number = 1;
						newModelId = setAvailByModel(info.model.modelId);
						var postData1 = {
							CosInsHeaderId: selectedCosItem.Id,
							ModelId: selectedCosItem.ModelFk,
							NewModelId: newModelId,
							MdlChangeSetModelFk: info.model.mdlChangeSetModelFk,
							MdlChangeSetFk: info.model.mdlChangeSetFk
						};
						var gridConfig = constructionSystemProjectCosInstanceGridConfigService.provideGridConfig(gridId);
						$scope.gridData = {
							state: gridId,
							config: gridConfig,
							moduleState: {}
						};
						if (!platformGridAPI.grids.exist(gridId)) {
							platformGridAPI.grids.config(gridConfig);
						}
						currentStep.loadingMessage = $translate.instant('model.viewer.changeModelWz.loadingSelectData');
						currentStep.disallowNext = true;
						currentStep.disallowBack = false;
						currentStep.canFinish = true;

						$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/checkmodel', postData1
						).then(function (res) {
								if (!res.data) {
									$scope.wizardCommands.goToPrevious();
									var modalOptions = {
										headerText: $translate.instant('project.main.projects'),
										bodyText: $translate.instant('constructionsystem.project.noAnyObjects'),
										iconClass: 'ico-info'
									};
									platformModalService.showDialog(modalOptions);
								} else {
									$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/updateconstructionsysteminstance', postData1
									).then(function (res) {
											/** @namespace res.data.CosFlags */
											var flags = res.data.CosFlags;
											/** @namespace res.data.CosInstances */
											var cosInstances = res.data.CosInstances;
											if (angular.isArray(flags)) {
												if (flags.length > 0) {
													currentStep.messages = flags.map(updateInstanceMakeFlagCountMessage);
												} else {
													flags.push('<span>' + $translate.instant('constructionsystem.project.noInstanceItem') + '.</span>');
													currentStep.messages = flags;
												}
											}
											if (angular.isArray(cosInstances)) {
												platformGridAPI.items.data(gridId, cosInstances);
											}
											info.scope.$evalAsync(function () {
												currentStep.loadingMessage = null;
												currentStep.disallowBack = false;
											});
										}
									);
								}
							}
						);
						break;

					case 'applyLineItemToEstimateSetp':
						currentStep.number = 2;
						currentStep.disallowBack = false;
						break;
					case 'update2DModelStep':
						change2Dmodel(info);
						break;
				}
			};

			$scope.toggleFilter = function (active) {
				platformGridAPI.filters.showSearch(gridId, active);
			};

			$scope.toggleGroupPanel = function (active) {
				platformGridAPI.grouping.toggleGroupPanel(gridId, active);
			};

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						sort: 1,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							$scope.toggleGroupPanel(this.value);
						},
						disabled: false

					},
					{

						id: 't2',
						sort: 2,
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						iconClass: 'tlb-icons  ico-search',
						fn: function () {
							$scope.toggleFilter(this.value);
						},
						disabled: false
					}
				],
				update: function () {  // dummy function to bypass menulist-directive weak point in line 199!!!!
					angular.noop();
				}
			};

			function setAvailByModel(_modelId) {
				if (!angular.isNumber(_modelId) ) {
					return _.toInteger(_.replace(_modelId, 'R', ''));
				}
				return  _modelId;
			}

		}
	]);

})(angular);
