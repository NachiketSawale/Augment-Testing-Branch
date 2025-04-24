/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainOutputController
	 * @function
	 *
	 * @description
	 * Controller for the estimate main rule script output container
	 **/
	angular.module(moduleName).controller('estimateMainOutputController', [
		'_', '$scope', '$injector', 'platformGridControllerService', 'platformGridAPI', 'estimateMainOutputDataService', 'estimateMainOutputUIStandardService',
		'platformModuleNavigationService', 'estimateMainService', '$translate',
		function (
			_, $scope, $injector, platformGridControllerService, platformGridAPI, estimateMainOutputDataService,
			estimateMainOutputUIStandardService, naviService, estimateMainService, $translate) {

			let actionItemsLink = null;
			let actionItemsLinkMessages = null;

			let gridConfig = {
				initCalled: false,
				showGrouping: true,
				columns: [],
				grouping: true
			};

			function reset() {
				estimateMainOutputDataService.reset();

				$scope.status = '0/0';
				$scope.percentage = 0;
				$scope.sequence = 0;
				$scope.hint = '';
				$scope.information = '';

				// updateValuesInList
				updateValueForItem('ps');
				updateValueForItem('seq');
				updateValueForItem('pi');
				updateValueForItem('hint');

				$scope.finished = 0;
				$scope.total = 0;
				$scope.warningAmount = 0;
				$scope.errors = 0;
				$scope.warnings = 0;
				$scope.infos = 0;
				$scope.messages = 0;

				updateValueForMessageItem('messages');
				updateValueForMessageItem('infos');
				updateValueForMessageItem('warnings');
				updateValueForMessageItem('errors');
			}

			reset();

			platformGridControllerService.initListController($scope, estimateMainOutputUIStandardService, estimateMainOutputDataService, null, gridConfig);

			let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
				return item.id === 'create';
			});

			$scope.addTools([
				{
					id: 't11',
					caption: $translate.instant('estimate.main.goToScheduler'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openScheduler() {

						// Then navigate to estimation module
						let navigator = {moduleName: 'services.scheduler'};// , registerService: 'estimateMainService'

						let selectedItem = estimateMainOutputDataService.getRuleResultHeader();

						if (selectedItem && selectedItem.JobFk) {
							naviService.navigate(navigator, {Id: selectedItem.JobFk}, 'Id');
						} else {
							naviService.navigate(navigator);
						}
					},
					disabled: function () {
						return false;
					}
				}
			]);

			$scope.selectedType = 1;

			$scope.tools.items.splice(createBtnIdx, 1);

			$scope.information = '';
			$scope.sequence = 0;
			$scope.hint = '';
			$scope.finished = 0;
			$scope.total = 0;
			$scope.status = '';
			$scope.errors = 0;
			$scope.warnings = 0;
			$scope.infos = 0;
			$scope.messages = 0;
			$scope.percentage = 0;

			$scope.stopProcedure = function () {
				estimateMainOutputDataService.stopProcedure();
			};

			$scope.onItemChanged = function (type) {
				switch (type) {
					case 1 : {
						estimateMainOutputDataService.showInfo(true);
						estimateMainOutputDataService.showWarning(true);
						estimateMainOutputDataService.showError(true);
						break;
					}
					case 2 : {
						estimateMainOutputDataService.showInfo(true);
						estimateMainOutputDataService.showWarning(false);
						estimateMainOutputDataService.showError(false);
						break;
					}
					case 3 : {
						estimateMainOutputDataService.showInfo(false);
						estimateMainOutputDataService.showWarning(true);
						estimateMainOutputDataService.showError(false);
						break;
					}
					case 4 : {
						estimateMainOutputDataService.showInfo(false);
						estimateMainOutputDataService.showWarning(false);
						estimateMainOutputDataService.showError(true);
						break;
					}
				}

				estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();
			};

			function updateEstimateRuleScriptOutput() {
				let selectedItem = estimateMainOutputDataService.getSelected();
				platformGridAPI.items.data($scope.gridId, estimateMainOutputDataService.getList());
				estimateMainOutputDataService.updateSelection(selectedItem);
			}

			function navToProjectRuleMaster() {
				let ruleOutputSelected = estimateMainOutputDataService.getSelected();
				let navigator = naviService.getNavigator('project.main-estimate-rule-script');
				angular.extend(ruleOutputSelected, {Code: ruleOutputSelected.ruleCode});
				naviService.navigate(navigator, null, ruleOutputSelected);
			}

			function updateInformation(ruleResult){
				if (ruleResult.EstRuleResultHeader) {
					switch (ruleResult.EstRuleResultHeader.ExecutionState) {
						case 0: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.readyToStart');
							break;
						}
						case 1: {
							$scope.information = ruleResult.EstRuleResultItem ? $translate.instant('estimate.main.ruleExecutionOutput.executingRule') + ': ' + ruleResult.EstRuleResultItem.RuleCode : $translate.instant('estimate.main.ruleExecutionOutput.waiting');
							break;
						}
						case 2: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.finished');
							break;
						}
						case 3: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.failure');
							break;
						}
						case 4: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.abort');
							break;
						}
						case 5: {
							$scope.information = ruleResult.EstRuleResultItem ? $translate.instant('estimate.main.ruleExecutionOutput.executingRule') + ': ' + ruleResult.EstRuleResultItem.RuleCode : $translate.instant('estimate.main.ruleExecutionOutput.running');
							break;
						}
						case 6: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.deleteOldData');
							break;
						}
						case 7: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.calculateDetail');
							break;
						}
						case 8: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.recalculateLineItems');
							break;
						}
						case 9: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.registerRules');
							break;
						}
						case 10: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.waitingAbort');
							break;
						}
						case 11: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.startTaskFailure');
							break;
						}
						case 12: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.ruleScriptFinish');
							break;
						}
						case 13: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.saving');
							break;
						}
						case 14: {
							$scope.information = $translate.instant('estimate.main.ruleExecutionOutput.calculateRiskEscalation');
							break;
						}
					}
				} else {
					$scope.information = '';
				}
			}

			function updatePercentage(ruleResult){
				if (ruleResult.EstRuleResultHeader) {
					switch (ruleResult.EstRuleResultHeader.ExecutionState) {
						case 0: {
							$scope.percentage = 0;
							break;
						}
						case 2:
						case 3:
						case 4: {
							$scope.percentage = 100;
							break;
						}
						case 6: {
							$scope.percentage = 5;
							break;
						}
						case 7: {
							$scope.percentage = 10;
							break;
						}
						case 8: {
							$scope.percentage = 20;
							break;
						}
						case 9: {
							$scope.percentage = 15;
							break;
						}
						case 12: {
							$scope.percentage = 80;
							break;
						}
						case 13: {
							$scope.percentage = 90;
							break;
						}
					}
				}
			}

			function setActiveMessageLinks(ruleResult) {
				let activeMessageLinks = [];

				$scope.sequence = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.CurrentSequence : 0;
				$scope.hint = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.Message : '';
				_.forEach(estimateMainOutputDataService.getStatus(), function (value, key) {
					if (value === true) {
						activeMessageLinks.push(key);
					}
				});

				updateInformation(ruleResult);

				if (activeMessageLinks.length === 1) {
					switch (activeMessageLinks[0]) {
						case 'showErrors':
							$scope.messageList.activeValue = 'errors';
							break;
						case 'showWarnings':
							$scope.messageList.activeValue = 'warnings';
							break;
						case 'showInfos':
							$scope.messageList.activeValue = 'infos';
							break;
					}
				} else {
					$scope.messageList.activeValue = 'messages';
				}
			}

			function updateRuleResult(ruleResult) {
				// highlight button for the message items(left side)
				if (estimateMainOutputDataService.getList().length > 0) {
					setActiveMessageLinks(ruleResult);
				}

				$scope.status = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.Finished + '/' + ruleResult.EstRuleResultHeader.Total : '0/0';

				$scope.sequence = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.CurrentSequence : 0;

				$scope.hint = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.Message : '';

				updateInformation(ruleResult);
				updatePercentage(ruleResult);

				// updateValuesInList
				updateValueForItem('ps');
				updateValueForItem('seq');
				updateValueForItem('pi');
				updateValueForItem('hint');

				$scope.finished = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.Finished : 0;

				$scope.total = ruleResult.EstRuleResultHeader ? ruleResult.EstRuleResultHeader.Total : 0;

				if (ruleResult.EstRuleResultHeader && ruleResult.EstRuleResultHeader.ExecutionState === 5) {
					let percentage = ruleResult.EstRuleResultHeader && ruleResult.EstRuleResultHeader.Total > 0 && ruleResult.EstRuleResultHeader.Finished > 0 ? ruleResult.EstRuleResultHeader.Finished * 50 / ruleResult.EstRuleResultHeader.Total : 0;

					percentage = 20 + Math.round(percentage);

					if (percentage < 100) {
						$scope.percentage = percentage;
					}
				}

				if (ruleResult.EstRuleResultViews) {
					$scope.warningAmount = ruleResult.EstRuleResultViews.length;
					$scope.errors = _.sumBy(ruleResult.EstRuleResultViews, function (item) {
						return item.ErrorType === 1 || item.ErrorType === 5 ? 1 : 0;
					});
					$scope.warnings = _.sumBy(ruleResult.EstRuleResultViews, function (item) {
						return item.ErrorType === 2 ? 1 : 0;
					});
					$scope.infos = _.sumBy(ruleResult.EstRuleResultViews, function (item) {
						return item.ErrorType === 3 ? 1 : 0;
					});
					$scope.messages = $scope.errors + $scope.warnings + $scope.infos;
				} else {
					$scope.warningAmount = 0;
					$scope.errors = 0;
					$scope.warnings = 0;
					$scope.infos = 0;
					$scope.messages = 0;
				}

				updateValueForMessageItem('messages');
				updateValueForMessageItem('infos');
				updateValueForMessageItem('warnings');
				updateValueForMessageItem('errors');
			}

			function updateValue(id, link) {
				if (link) {
					link.updateFields([{
						id: id,
						caption: getValueById(id)
					}]);
				}
			}

			// update value for Procedure Information
			function updateValueForItem(id) {
				updateValue(id, actionItemsLink);
			}

			function updateValueForMessageItem(id) {
				updateValue(id, actionItemsLinkMessages);
			}

			function getValueById(id) {
				let toReturn = '';
				switch (id) {
					case 'pi':
						toReturn = $translate.instant('estimate.main.ruleExecutionOutput.procedureInformation') + ': ' + $scope.information;
						break;
					case 'seq':
						toReturn = $translate.instant('estimate.main.ruleExecutionOutput.sequence') + ': ' + $scope.sequence;
						break;
					case 'ps':
						toReturn = $translate.instant('estimate.main.ruleExecutionOutput.procedureStatus') + ': ' + $scope.status;
						break;
					case 'hint':
						toReturn = $translate.instant('estimate.main.ruleExecutionOutput.hint') + ': ' + $scope.hint;
						break;
					case 'messages':
						toReturn = $scope.messages + ' ' + $translate.instant('estimate.main.ruleExecutionOutput.messages');
						break;
					case 'infos':
						toReturn = $scope.infos + ' ' + $translate.instant('estimate.main.ruleExecutionOutput.infos');
						break;
					case 'warnings':
						toReturn = $scope.warnings + ' ' + $translate.instant('estimate.main.ruleExecutionOutput.warnings');
						break;
					case 'errors':
						toReturn = $scope.errors + ' ' + $translate.instant('estimate.main.ruleExecutionOutput.errors');
						break;
				}

				return toReturn;
			}

			let ruleResultList = {
				cssClass: 'row-2-groups',
				items: [
					{
						align: 'left',
						cssClass: 'margin-right-ld',
						id: 'pi',
						toolTip: '',
						type: 'text',
						caption: getValueById('pi'),
						visible: true
					},
					{
						align: 'left',
						cssClass: 'margin-right-ld',
						id: 'seq',
						toolTip: '',
						type: 'text',
						caption: getValueById('seq'),
						visible: true
					},
					{
						align: 'left',
						cssClass: 'margin-right-ld',
						id: 'ps',
						toolTip: '',
						type: 'text',
						caption: getValueById('ps'),
						visible: true
					},
					{
						align: 'left',
						cssClass: 'margin-right-ld',
						id: 'hint',
						toolTip: '',
						type: 'text',
						caption: getValueById('hint'),
						visible: true
					},
					{
						cssClass: 'btn btn-default button-md',
						id: 'cancel',
						toolTip: '',
						type: 'item',
						caption: $translate.instant('estimate.main.ruleExecutionOutput.cancel'),
						visible: true,
						fn: function () {
							$scope.stopProcedure();
						}
					}
				]
			};

			$scope.messageList = {
				activeValue: '',
				items: [
					{
						id: 'messages',
						cssClass: 'btn-default jsExecution',
						iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
						type: 'radio',
						caption: getValueById('messages'),
						value: 'messages',
						visible: true,
						fn: function () {
							$scope.onItemChanged(1);
							actionItemsLinkMessages.update();
						}
					},
					{
						id: 'infos',
						cssClass: 'btn-default jsExecution',
						iconClass: 'tlb-icons ico-info',
						type: 'radio',
						caption: getValueById('infos'),
						value: 'infos',
						visible: true,
						fn: function () {
							$scope.onItemChanged(2);
							actionItemsLinkMessages.update();
						}
					},
					{
						id: 'warnings',
						cssClass: 'btn-default jsExecution',
						iconClass: 'tlb-icons ico-warning',
						type: 'radio',
						caption: getValueById('warnings'),
						value: 'warnings',
						visible: true,
						fn: function () {
							$scope.onItemChanged(3);
							actionItemsLinkMessages.update();
						}
					},
					{
						id: 'errors',
						cssClass: 'btn-default jsExecution',
						iconClass: 'tlb-icons ico-error',
						type: 'radio',
						caption: getValueById('errors'),
						value: 'errors',
						visible: true,
						fn: function () {
							$scope.onItemChanged(4);
							actionItemsLinkMessages.update();
						}
					}
				]
			};

			$scope.initActionItemsLink = function (link) {
				actionItemsLink = link;
				link.setFields(ruleResultList);
			};

			$scope.initActionItemsLinkMessages = function (link) {
				actionItemsLinkMessages = link;
				link.setFields($scope.messageList);
			};

			estimateMainOutputDataService.updateSelection();
			estimateMainOutputDataService.estMainRuleOutputResultChanged.register(updateEstimateRuleScriptOutput);
			estimateMainOutputDataService.ruleResultProgress.register(updateRuleResult);

			platformGridAPI.events.register($scope.gridId, 'onDblClick', navToProjectRuleMaster);

			// TODO-Walt: get the rule execution result
			estimateMainOutputDataService.startGetResultList(false, true);
			$scope.$on('$destroy', function () {
				// TODO-Walt: stop to get the rule execution result
				estimateMainOutputDataService.stopGetRuleResult();

				estimateMainOutputDataService.estMainRuleOutputResultChanged.unregister(updateEstimateRuleScriptOutput);
				estimateMainOutputDataService.ruleResultProgress.unregister(updateRuleResult);
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', navToProjectRuleMaster);
			});
		}
	]);

})(angular);
