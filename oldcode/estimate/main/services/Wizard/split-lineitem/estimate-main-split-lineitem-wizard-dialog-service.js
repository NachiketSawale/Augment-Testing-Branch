/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _, globals */

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainSplitLineItemWizardDialogService
	 * @function
	 *
	 * @description
	 * This is the configuration service to split LineItem.
	 */
	angular.module(moduleName).factory('estimateMainSplitLineItemWizardDialogService', EstimateMainSplitLineItemWizardDialogService);

	function EstimateMainSplitLineItemWizardDialogService($http, $timeout, $injector, $translate, platformDialogService, estimateMainService, platformWizardDialogService, estimateMainScopeSelectionService) {
		let self = this;

		self.splitLineItem = function splitLineItem() {
			let locationModel = {
				name: 'location',
				selectedItems: null,
				selectedId: null,
				items: null,
				selectionListConfig: {
					// uuid: '7B32F91B55AD4D3391734712DEA59409',
					multiSelect: true,
					idProperty: 'Id',
					childProp: 'Locations',
					parentProp: 'LocationParentFk',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							width: 100,
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					lazyInit: true,
					options: {
						tree: true,
						childProp: 'Locations',
						skipPermissionCheck: true,
						parentProp: 'LocationParentFk',
						iconClass: 'control-icons',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					}
				}
			};
			let entity = {
				estimateScope: 2,
				splitMethod: 4,
				doSplitAsReference: false,
				splitLineItems: [],
				applySplitResultTo: 'QuantityTarget',
				location: locationModel,
				resourceSplitType: 1,
				noRelation: true
			};
			let canSplitLineItemByQty = true;
			const splitByResourcesOptions = {
				noCriteria: {
					value: 1,
					label: 'estimate.main.splitLineItemWizard.noCriteria'
				},
				costPortions: {
					value: 2,
					label: 'estimate.main.splitLineItemWizard.costPortions'
				}
			};

			let splitQtyStep = {
				id: 'splitQuantityForm',
				title$tr$: $translate.instant('estimate.main.splitLineItemWizard.splitByPercentAndQuantity'),
				bottomDescription: $translate.instant('estimate.main.splitLineItemWizard.applySplitResult'),
				form: getSplitByQuantityForm(),
				canFinish: false,
				disallowNext: false,
				disallowBack: false
			};

			let steps = [{
				id: 'splitMethodsForm',
				title$tr$: 'estimate.main.splitLineItemMethodsForm',
				bottomDescription: getNoteText(entity.splitMethod),
				form: getSplitMethodsForm(),
				canFinish: false,
				disallowNext: false,
				disallowBack: true
			},
			splitQtyStep,
			{
				id: 'completionStep',
				title$tr$: 'estimate.main.splitLineItemWizard.completion',
				message: $translate.instant('estimate.main.splitLineItemWizard.completionSplitByQuantity'),
				disallowBack: true,
				canFinish: true
			}];

			function getSplitMethodsForm() {
				let splitMethodsForm = getFormConfigStub();

				let estimateScopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();

				if (estimateScopeRow) {
					estimateScopeRow.gid = 'baseGroup';
					estimateScopeRow.sortOrder = 1;
				}

				let splitMethodsLookup = {
					gid: 'baseGroup',
					sortOrder: 2,
					rid: 'splitMethods',
					model: 'splitMethod',
					type: 'directive',
					directive: 'estimate-main-split-line-item-methods-dialog-lookup',
					label$tr$: 'estimate.main.splitLineItemWizard.splitmethod'
				};

				splitMethodsForm.rows.push(estimateScopeRow);
				splitMethodsForm.rows.push(splitMethodsLookup);

				return splitMethodsForm;
			}

			function getSplitByObjectLocationForm() {
				let splitByObjectLocationForm = getFormConfigStub();

				splitByObjectLocationForm.rows = [
					{
						directive: 'platform-wizard-selection-list',
						gid: 'baseGroup',
						model: locationModel.name,
						rid: 'list',
						sortOrder: 20,
						type: 'directive'
					}
				];

				return splitByObjectLocationForm;
			}

			function getSplitByQuantityForm() {
				let splitByQuantityForm = getFormConfigStub();

				splitByQuantityForm.rows = [
					{
						gid: 'baseGroup',
						sortOrder: 1,
						rid: 'lineitemReference',
						model: 'doSplitAsReference',
						type: 'boolean',
						label$tr$: 'estimate.main.splitLineItemWizard.createLineItemReference',
						isChecked: false
					},
					{
						gid: 'baseGroup',
						sortOrder: 2,
						rid: 'splitByQty',
						model: 'splitLineItems',
						type: 'directive',
						directive: 'estimate-main-split-line-item-quantity-dialog',
						label$tr$: 'estimate.main.splitLineItemWizard.selectedItems'
					},
					{
						gid: 'baseGroup',
						sortOrder: 3,
						rid: 'lineitemReference',
						model: 'applySplitResultTo',
						type: 'radio',
						label$tr$: 'estimate.main.splitLineItemWizard.applySplitResultTo',
						change: function (result) {
							$injector.get('estimateMainSplitLineItemQuantityDialogService').recalculateItems(result);
						},
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'applySplitResultToConfig',
							items: [
								{
									Id: 0,
									Description: $translate.instant('estimate.main.splitLineItemWizard.splitQuantity'),
									Value: 'Quantity'
								},
								{
									Id: 1,
									Description: $translate.instant('estimate.main.splitLineItemWizard.splitQuantityItem'),
									Value: 'QuantityTarget'
								}
							]
						}
					},
					{
						gid: 'baseGroup',
						sortOrder: 4,
						rid: 'entityNoRelation',
						model: 'noRelation',
						type: 'boolean',
						label$tr$: 'estimate.main.splitLineItemWizard.entityNoRelation',
						isChecked: true,
						visible: entity.applySplitResultTo === 'QuantityTarget'
					}
				];

				return splitByQuantityForm;
			}

			function getSplitByResourcesForm() {
				let splitByResourcesForm = getFormConfigStub();

				splitByResourcesForm.rows = [
					{
						gid: 'baseGroup',
						sortOrder: 1,
						rid: 'resourcesSplitOptions',
						model: 'resourceSplitType',
						type: 'radio',
						label: $translate.instant('estimate.main.splitLineItemWizard.splitByResourcesTypes'),
						label$tr$: 'estimate.main.splitLineItemWizard.splitByResourcesTypes',
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'splitByResourcesConfig',
							items: [
								{
									Id: 1,
									Description: $translate.instant(splitByResourcesOptions.noCriteria.label),
									Value: splitByResourcesOptions.noCriteria.value
								},
								{
									Id: 2,
									Description: $translate.instant(splitByResourcesOptions.costPortions.label),
									Value: splitByResourcesOptions.costPortions.value
								}
							]
						}
					}
				];

				return splitByResourcesForm;
			}

			function getNoteText(method) {
				return method === 1 || method === 2 ? $translate.instant('estimate.main.splitLineItemWizard.noteOption')
					: method === 4 ? $translate.instant('estimate.main.splitLineItemWizard.lineItemSplitByPercentNoteOptions') : '';
			}



			function showWarning(title, message) {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant(message),
					iconClass: 'warning'
				};
				return platformDialogService.showDialog(modalOptions);
			}

			function getSplitByObjectLocationSteps(wizard) {
				_.find(wizard.steps, {id: 'completionStep'}).message = $translate.instant('estimate.main.splitLineItemWizard.completionByObjLocation');
				let matchedItem = _.find(wizard.steps, {id: 'splitByObjectLocationForm'});
				if (!matchedItem) {
					wizard.steps.splice(1, 0, {
						id: 'splitByObjectLocationForm',
						title$tr$: 'estimate.main.splitLineItemWizard.',
						loadingMessage$tr$: 'estimate.main.splitLineItemWizard.',
						bottomDescription: $translate.instant('estimate.main.splitLineItemWizard.'),
						form: getSplitByObjectLocationForm(),
						canFinish: false,
						disallowNext: true
					});
				}
			}

			function getSplitByObjectsSteps(wizard) {
				_.find(wizard.steps, {id: 'completionStep'}).message = $translate.instant('estimate.main.splitLineItemWizard.completionByObjects');
			}

			function getSplitByQtySteps(wizard) {
				_.find(wizard.steps, {id: 'completionStep'}).message = $translate.instant('estimate.main.splitLineItemWizard.completionSplitByQuantity');
				let matchedItem = _.find(wizard.steps, {id: 'splitQuantityForm'});
				if (!matchedItem) {
					wizard.steps.splice(1, 0, splitQtyStep);
				}
			}

			function getSplitByResourcesSteps(wizard) {
				_.find(wizard.steps, {id: 'completionStep'}).message = $translate.instant('estimate.main.splitLineItemWizard.completionSplitByResources');
				let matchedItem = _.find(wizard.steps, {id: 'splitByResourcesForm'});
				if (!matchedItem) {
					wizard.steps.splice(1, 0, {
						id: 'splitByResourcesForm',
						title$tr$: $translate.instant('estimate.main.splitLineItemWizard.splitByResources'),
						form: getSplitByResourcesForm(),
						canFinish: false,
						disallowNext: false,
						disallowBack: false
					});
				}
			}

			function executeSplitByResources(data) {
				let postData = {
					estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
					prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
					filterRequest: estimateMainService.getLastFilter(),
					resultSet: data.estimateScope,
					lineItems: estimateMainService.getSelectedEntities(),
					splitMethod: data.splitMethod,
					DoSplitByCostPortions: data.resourceSplitType === splitByResourcesOptions.costPortions.value
				};

				// Show loading indicator
				let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				estMainStandardDynamicService.showLoadingOverlay();

				$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/executesplitbyresources', postData).then(function (response) {
					let result = response.data;
					let lineItems = result.lineItems;
					let resWithoutCostCodePortions = result.resourcesWithoutCostCodePortions;
					estMainStandardDynamicService.hideLoadingOverlay();
					if (lineItems && lineItems.length) {
						estimateMainService.addList(lineItems);
						estimateMainService.fireListLoaded();
						$injector.get('estimateMainLineItem2MdlObjectService').callRefresh();
						estimateMainService.callRefresh();
						if (resWithoutCostCodePortions && resWithoutCostCodePortions.length) {
							return $injector.get('platformGridDialogService').showDialog({
								columns: [
									{
										id: 'code',
										field: 'Code',
										name: 'Code',
										formatter: 'code',
										name$tr$: 'cloud.common.entityCode',
										width: 100
									},
									{
										id: 'desc',
										field: 'DescriptionInfo.Description',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										formatter: 'description',
										width: 100
									}
								],
								headerText$tr$: 'estimate.main.splitLineItemWizard.title',
								topText: $translate.instant('estimate.main.splitLineItemWizard.noCostCodePortionsResources'),
								items: resWithoutCostCodePortions,
								idProperty: 'Id',
								tree: false,
								isReadOnly: true
							});
						} else {
							$injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage($translate.instant('estimate.main.splitLineItemWizard.splitMessage'));
						}
					} else {
						let modalOptions = {
							headerText: $translate.instant('estimate.main.splitLineItemWizard.title'),
							bodyText: $translate.instant('estimate.main.splitLineItemWizard.noResourcesAssigned'),
							iconClass: 'warning'
						};
						return $injector.get('platformDialogService').showDialog(modalOptions);
					}
				});
			}




			function showDialog() {
				platformWizardDialogService.showDialog(wizardConfig, entity).then(function (result) {
					if (result.success) {
						let data = result.data;
						if (data.splitMethod === 1 || data.splitMethod === 2) {
							let itemData = {
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
								filterRequest: estimateMainService.getLastFilter(),
								resultSet: entity.estimateScope,
								LineItems: estimateMainService.getSelectedEntities(),
								selectLocationIds: locationModel.selectedId,
								splitMethod: data.splitMethod,

							};

							// Show loading indicator
							let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							estMainStandardDynamicService.showLoadingOverlay();

							$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/savelocation', itemData).then(function (response) {
								let abort = response.data;
								estMainStandardDynamicService.hideLoadingOverlay();
								if (abort === 0) {
									$injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage($translate.instant('estimate.main.splitLineItemWizard.splitMessage'));
									estimateMainService.load();
								} else if (abort === 1) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoObjects');
								} else if (abort === 2) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoQuantity');
								} else if (abort === 4) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoResources');
								}
							});
						}

						if (data.splitMethod === 3) {
							let itemData = {
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
								filterRequest: estimateMainService.getLastFilter(),
								resultSet: data.estimateScope,
								lineItems: estimateMainService.getSelectedEntities(),
								splitMethod: data.splitMethod
							};

							// Show loading indicator
							let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							estMainStandardDynamicService.showLoadingOverlay();

							$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/savecommissioningresources', itemData).then(function (response) {
								let abort = response.data;
								estMainStandardDynamicService.hideLoadingOverlay();
								if (abort === 0) {
									$injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage($translate.instant('estimate.main.splitLineItemWizard.splitMessage'));
								} else if (abort === 4) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoResources');
								}
							});
						}

						if (data.splitMethod === 4) {
							let qtyDialogService = $injector.get('estimateMainSplitLineItemQuantityDialogService');
							qtyDialogService.processDataToUpdate(data);

							// Show loading indicator
							let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							estMainStandardDynamicService.showLoadingOverlay();
							estimateMainService.updateAndExecute(qtyDialogService.saveSplitLineItems);
							$timeout(function () {
								estMainStandardDynamicService.hideLoadingOverlay();
							}, 400); // backdrop overlay has animation of 300, so we wait 300 and more
						}

						if (data.splitMethod === 5) {
							executeSplitByResources(data, function (result) {
								$timeout(function () {
									estimateMainService.updateAndExecute(result);
								}, 0);
							});
						}
					}
				});
			}

			let wizardConfig = {
				id: 'est-main-line-item-split-step',
				title: $translate.instant('estimate.main.splitLineItemWizard.title'),
				steps: steps,
				watches: [{
					expression: 'splitMethod',
					fn: function (info) {
						let splitMethodStep = _.find(info.wizard.steps, { id: 'splitMethodsForm' });
						splitMethodStep.bottomDescription = getNoteText(info.newValue);
						switch (info.newValue) {
							case 1: // Split by Object Location
								entity.estimateScope = 0;
								splitMethodStep.canFinish = false;
								splitMethodStep.disallowNext = false;
								platformWizardDialogService.removeSteps(info.wizard, 'splitQuantityForm', 'splitByObjectsForm', 'splitByResourcesForm');
								getSplitByObjectLocationSteps(info.wizard);
								handleScopeRowUpdate(splitMethodStep, info.scope);
								// add steps for Split by Object Location (info.wizard.steps)
								break;
							case 2:// Split by Objects
								entity.estimateScope = 0;
								splitMethodStep.canFinish = false;
								splitMethodStep.disallowNext = false;
								platformWizardDialogService.removeSteps(info.wizard, 'splitQuantityForm', 'splitByObjectLocationForm', 'splitByResourcesForm');
								getSplitByObjectsSteps(info.wizard);
								handleScopeRowUpdate(splitMethodStep, info.scope);
								// add steps for Split by Objects (info.wizard.steps)
								break;
							case 3: // Split by Commissioning Resources
								splitMethodStep.canFinish = true;
								splitMethodStep.disallowNext = true;
								handleScopeRowUpdate(splitMethodStep, info.scope);
								break;
							case 4: // Split by % and Quantity
								splitMethodStep.canFinish = false;
								splitMethodStep.disallowNext = !canSplitLineItemByQty;
								platformWizardDialogService.removeSteps(info.wizard, 'splitByObjectsForm', 'splitByObjectLocationForm', 'splitByResourcesForm');
								getSplitByQtySteps(info.wizard);
								handleScopeRowUpdate(splitMethodStep, info.scope, true);
								break;
							case 5: // Split by Resources
								splitMethodStep.canFinish = false;
								splitMethodStep.disallowNext = false;
								platformWizardDialogService.removeSteps(info.wizard, 'splitQuantityForm', 'splitByObjectLocationForm', 'splitByObjectsForm');
								getSplitByResourcesSteps(info.wizard);
								handleScopeRowUpdate(splitMethodStep, info.scope);
								break;
							default:
								break;
						}
					}
				}, {
					expression: 'location.selectedId',
					fn: function () {
						let step = _.find(steps, {id: 'splitByObjectLocationForm'});

						if (step) {
							step.disallowNext = !(locationModel.selectedId && locationModel.selectedId.length);
						}
					}
				},{
					expression: 'applySplitResultTo',
					fn: function (info) {
						let step = _.find(info.wizard.steps, {id: 'splitQuantityForm'});
						let row = _.find(step.form.rows, {rid:'entityNoRelation'});
						if(row){
							row.visible = info.scope.entity.applySplitResultTo === 'QuantityTarget';
						}
						info.scope.$broadcast('form-config-updated');
					}
				}],
				onChangeStep: function (info) {
					if (info.model.splitMethod === 4 && info.previousStepIndex === 0) {
						let canSplitPromise = $injector.get('estimateMainSplitLineItemQuantityDialogService').canSplitSelected();
						canSplitPromise.then(function (canSplitMessage) {
							if (_.isString(canSplitMessage)) {
								canSplitLineItemByQty = false;
								info.step.disallowNext = true;
								info.step.canFinish = false;
								info.step.disallowBack = false;
								info.previousStep.disallowNext = true;
								info.previousStep.canFinish = false;
								showWarning('estimate.main.splitLineItemWizard.title', canSplitMessage).then(function () {
									info.commands.goToPrevious();
								});
							} else {
								canSplitLineItemByQty = true;
							}
						});
					}

					if (info.model.splitMethod === 1 && info.step.id === 'splitByObjectLocationForm') {
						if (!info.model[locationModel.name].items) {
							let itemData = {
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
								filterRequest: estimateMainService.getLastFilter(),
								resultSet: entity.estimateScope,
								lineItems: estimateMainService.getSelectedEntities(),
								selectLocationIds: [],
								splitMethod: info.model.splitMethod
							};

							info.step.loadingMessage = $translate.instant('estimate.main.splitLineItemWizard.loadingLocation');

							$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getlocation', itemData).then(function (response) {
								let abort = response.data.abort;

								if (abort === 0) {
									let items = response.data.resources;
									info.model[locationModel.name].items = items;
								} else if (abort === 1) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoObjects');
								} else if (abort === 2) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoQuantity');
								} else if (abort === 3) {
									showWarning('estimate.main.splitLineItemWizard.title', 'estimate.main.splitLineItemWizard.abortNoLocation');
								}
								info.step.loadingMessage = null;
							});
						}
					}

					if (info.model.splitMethod === 5 && info.step.id === 'splitByResourcesForm') {
						info.step.disallowNext = true;
						info.step.canFinish = true;
						info.step.disallowBack = false;
					}
				},
			};



			platformWizardDialogService.translateWizardConfig(wizardConfig);
			let canSplitPromise = $injector.get('estimateMainSplitLineItemQuantityDialogService').canSplitSelected();
			canSplitPromise.then(function (canSplitMessage) {
				let methodStep = _.find(wizardConfig.steps, {id: 'splitMethodsForm'});
				if (_.isString(canSplitMessage)) {
					canSplitLineItemByQty = false;
					methodStep.disallowNext = !canSplitLineItemByQty;
					methodStep.canFinish = false;
					methodStep.disallowBack = true;
					showWarning('estimate.main.splitLineItemWizard.title', canSplitMessage).then(function () {
						showDialog();
					});

				} else {
					canSplitLineItemByQty = true;
					return showDialog();
				}
			});

		};

		function getFormConfigStub() {
			return {
				fid: '',
				version: '0.0.1',
				showGrouping: false,
				skipPermissionsCheck: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: []
					}
				],
				rows: []
			};
		}

		// This function replaces the estimate scope row in the split method step form with a new one
		function replaceEstimateScopeRow(splitMethodStep, scopeRow, scope) {
			scopeRow.gid = 'baseGroup';
			scopeRow.sortOrder = 1;
			scopeRow.visible = true;

			// Remove the old scope row if it exists and add the new one
			splitMethodStep.form.rows = [
				...splitMethodStep.form.rows.filter(row => row.rid !== 'scope'),
				scopeRow
			];

			scope.$broadcast('form-config-updated');
		}

		// This function handles the update of the scope row in the split method step form
		function handleScopeRowUpdate(splitMethodStep, scope, isHighLighted = false) {
			// row is the new scope row to be added
			const row = isHighLighted
				? estimateMainScopeSelectionService.getHighlightScopeFormRow()
				: estimateMainScopeSelectionService.getAllScopeFormRow();

			replaceEstimateScopeRow(splitMethodStep, row, scope);
		}

		return self;
	}

	EstimateMainSplitLineItemWizardDialogService.$inject = ['$http', '$timeout', '$injector', '$translate', 'platformDialogService', 'estimateMainService', 'platformWizardDialogService', 'estimateMainScopeSelectionService'];
})();