/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRulesetGroupTreeController
	 * @function
	 *
	 * @description
	 * Controller for the group tree in the list of rule sets.
	 **/

	angular.module(moduleName).controller('modelEvaluationRulesetGroupTreeController',
		ModelEvaluationRulesetGroupTreeController);

	ModelEvaluationRulesetGroupTreeController.$inject = ['_', '$scope', '$translate',
		'$injector', 'platformContainerControllerService', 'platformGridControllerService',
		'modelEvaluationRulesetGroupConfigurationService', 'modelEvaluationRulesetGroupDataService',
		'modelEvaluationRulesetDataService', 'platformModalService', 'modelEvaluationRulesetGroupValidationService',
		'platformGridAPI'];

	function ModelEvaluationRulesetGroupTreeController(_, $scope, $translate, $injector, platformContainerControllerService, platformGridControllerService,
		modelEvaluationRulesetGroupConfigurationService, modelEvaluationRulesetGroupDataService,
		modelEvaluationRulesetDataService, platformModalService,
		modelEvaluationRulesetGroupValidationService, platformGridAPI) {

		$scope.gridId = '65f1734387984362b1d6e916ecf9aef9';

		const parentTools = $scope.tools;

		$scope.setTools = function extractRelevantToolsForParent(config) {
			if (_.isObject(config) && _.isArray(config.items)) {
				const insertRootGroupItem = _.find(config.items, {id: 'create'});
				const insertGroupItem = _.find(config.items, {id: 'createChild'});
				const createIdx = _.findIndex(parentTools.items, {id: 'create'});
				if (insertRootGroupItem && insertGroupItem && _.isNumber(createIdx)) {
					const rsCreateItem = parentTools.items[createIdx];
					rsCreateItem.caption = $translate.instant('model.evaluation.newRuleset');
					modelEvaluationRulesetDataService.addProjectWarningToCreation(rsCreateItem);

					if (modelEvaluationRulesetDataService.isInMasterModule()) {
						_.assign(insertGroupItem, {
							caption: $translate.instant('model.evaluation.newRulesetGroupChild'),
							disabled: function () {
								return false;
							},
							fn: insertRootGroupItem.fn
						});

						const insertGroupSiblingItem = {
							id: 'createGroupSibling',
							caption: 'model.evaluation.newRulesetGroupSibling',
							type: 'item',
							iconClass: 'tlb-icons ico-fld-ins-below',
							fn: function () {
								platformGridAPI.grids.commitAllEdits();
								modelEvaluationRulesetGroupDataService.createItem({
									asSibling: true
								});
							},
							disabled: function () {
								const selGroup = modelEvaluationRulesetGroupDataService.getSelected();
								return !selGroup || !selGroup.ModelRulesetGroupParentFk;
							}
						};

						parentTools.items.splice(createIdx, 0, insertGroupItem, insertGroupSiblingItem);
					}
				}

				const deleteGroupItem = _.find(config.items, {id: 'delete'});
				const deleteRulesetItemIndex = _.findIndex(parentTools.items, {id: 'delete'});
				if (deleteGroupItem && _.isNumber(deleteRulesetItemIndex)) {
					const deleteRulesetItem = parentTools.items[deleteRulesetItemIndex];
					const commonDeleteItem = {
						type: 'item',
						caption: $translate.instant('model.evaluation.deleteRulesetOrGroup'),
						id: 'delete',
						iconClass: 'tlb-icons ico-delete',
						fn: function () {
							let deletionInfo = null;

							const selRuleSet = modelEvaluationRulesetDataService.getSelected();
							if (selRuleSet) {
								deletionInfo = {
									confirmationText: $translate.instant('model.evaluation.reallyDelRuleset', {
										name: _.get(selRuleSet, 'DescriptionInfo.Translated')
									}),
									delete: function () {
										return modelEvaluationRulesetDataService.deleteSelection();
									}
								};
							} else {
								const selGroup = modelEvaluationRulesetGroupDataService.getSelected();
								if (selGroup) {
									deletionInfo = {
										confirmationText: $translate.instant('model.evaluation.reallyDelRulesetGroup', {
											name: _.get(selGroup, 'DescriptionInfo.Translated')
										}),
										delete: function () {
											return modelEvaluationRulesetGroupDataService.deleteSelection();
										}
									};
								}
							}

							if (deletionInfo) {
								return platformModalService.showYesNoDialog(deletionInfo.confirmationText, 'model.evaluation.reallyDelTitle', 'no').then(function (result) {
									if (result.yes) {
										return deletionInfo.delete();
									}
								});
							}
						},
						disabled: function () {
							return (deleteGroupItem.disabled || modelEvaluationRulesetGroupDataService.getSelected().isRoot) && deleteRulesetItem.disabled;
						}
					};
					parentTools.items.splice(deleteRulesetItemIndex, 1, commonDeleteItem);
				}

				const groupSettingsItem = _.find(config.items, {id: 't111'});
				const rulesetSettingsItemIndex = _.findIndex(parentTools.items, {id: 't111'});
				if (groupSettingsItem && _.isNumber(rulesetSettingsItemIndex)) {
					const rulesetSettingsItem = parentTools.items[rulesetSettingsItemIndex];
					const commonSettingsItem = {
						type: 'dropdown-btn',
						caption: groupSettingsItem.caption,
						id: 't111',
						iconClass: groupSettingsItem.iconClass,
						list: {
							showImages: false,
							items: [{
								type: 'item',
								id: 'groupSettings',
								caption: $translate.instant('model.evaluation.rulesetGroupGridLayout'),
								fn: groupSettingsItem.fn
							}, {
								type: 'item',
								id: 'rulesetSettings',
								caption: $translate.instant('model.evaluation.rulesetGridLayout'),
								fn: rulesetSettingsItem.fn
							}]
						}
					};
					parentTools.items.splice(rulesetSettingsItemIndex, 1, commonSettingsItem);
				}

				let groupingItemIndex;

				const pjOverridesMenu = modelEvaluationRulesetDataService.createProjectOverridesMenu();
				if (pjOverridesMenu.menuItem) {
					groupingItemIndex = _.findIndex(parentTools.items, {id: 't12'});
					if (_.isNumber(groupingItemIndex)) {
						if ((groupingItemIndex - 1 >= 0) && (parentTools.items[groupingItemIndex - 1].type === 'divider')) {
							groupingItemIndex--;
							parentTools.items.splice(groupingItemIndex, 1);
						}
						parentTools.items.splice(groupingItemIndex, 0, pjOverridesMenu.menuItem);
					}
				}
				$scope.$on('$destroy', function () {
					pjOverridesMenu.destroy();
				});

				let updateToolBar;

				groupingItemIndex = _.findIndex(parentTools.items, {id: 't12'});
				if (_.isNumber(groupingItemIndex)) {
					if ((groupingItemIndex - 1 >= 0) && (parentTools.items[groupingItemIndex - 1].type === 'divider')) {
						groupingItemIndex--;
						parentTools.items.splice(groupingItemIndex, 1);
					}
					parentTools.items.splice(groupingItemIndex, 0, {
						id: 'additionalCommandsGroup',
						type: 'sublist',
						list: {
							showTitles: true,
							items: [{
								id: 'reevaluate',
								caption: $translate.instant('model.evaluation.reevalRulesets'),
								type: 'item',
								iconClass: 'tlb-icons ico-reset',
								fn: function (itemId, item) {
									item.disabled = true;
									try {
										modelEvaluationRulesetDataService.forceReevaluation().then(function () {
											item.disabled = false;
											updateToolBar();
										}, function forcedReEvaluationFailed() {
											item.disabled = false;
											updateToolBar();
										});
									} catch (error) {
										item.disabled = false;
										updateToolBar();
									}
								}
							}]
						}
					});
				}

				updateToolBar = function updateToolBar() {
					parentTools.update();
				};
				modelEvaluationRulesetGroupDataService.registerSelectionChanged(updateToolBar);
				$scope.$on('$destroy', function () {
					modelEvaluationRulesetGroupDataService.unregisterSelectionChanged(updateToolBar);
				});

				parentTools.update();
			}
		};

		let cfgService = modelEvaluationRulesetGroupConfigurationService;
		if (!$scope.getContentValue('isMasterContainer')) {
			cfgService = {};
			Object.keys(modelEvaluationRulesetGroupConfigurationService).forEach(function (propName) {
				const val = modelEvaluationRulesetGroupConfigurationService[propName];
				if (_.isFunction(val)) {
					switch (propName) {
						case 'getStandardConfigForListView':
							cfgService.getStandardConfigForListView = function () {
								const result = _.cloneDeep(modelEvaluationRulesetGroupConfigurationService.getStandardConfigForListView());
								result.columns.forEach(function (column) {
									delete column.editor;
									delete column.editorOptions;
								});
								return result;
							};
							break;
						default:
							(function () {
								const fnName = propName;
								cfgService[fnName] = function () {
									return modelEvaluationRulesetGroupConfigurationService[fnName].apply(modelEvaluationRulesetGroupConfigurationService, arguments);
								};
							})();
							break;
					}
				} else {
					cfgService[propName] = val;
				}
			});
		}
		platformGridControllerService.initListController($scope, cfgService, modelEvaluationRulesetGroupDataService, modelEvaluationRulesetGroupValidationService, {
			initCalled: false,
			grouping: true,
			parentProp: 'ModelRulesetGroupParentFk',
			childProp: 'Children'
		});

		if (!modelEvaluationRulesetGroupDataService.isDataLoaded()) {
			modelEvaluationRulesetGroupDataService.load();
		}
	}
})(angular);
