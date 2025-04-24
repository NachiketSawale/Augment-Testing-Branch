/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelEvaluationModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRuleset2HlSchemeMappingMenuService
	 * @function
	 *
	 * @description
	 * Creates a menu for selecting dynamic highlighting schemes that rules from model rule sets can be mapped to.
	 */
	modelEvaluationModule.factory('modelEvaluationRuleset2HlSchemeMappingMenuService',
		modelEvaluationRuleset2HlSchemeMappingMenuService);

	modelEvaluationRuleset2HlSchemeMappingMenuService.$inject = ['_',
		'basicsCommonConfigLocationListService', 'modelEvaluationRuleset2HlSchemeMappingDataService',
		'modelEvaluationRulesetDataService'];

	function modelEvaluationRuleset2HlSchemeMappingMenuService(_,
		basicsCommonConfigLocationListService, modelEvaluationRuleset2HlSchemeMappingDataService,
		modelEvaluationRulesetDataService) {

		const service = {};

		service.createToolItem = function (scope) {
			modelEvaluationRuleset2HlSchemeMappingDataService.addUsingContainer(scope.getContainerUUID());

			const result = {
				toolItem: {
					id: 'hlSchemeMappingItem',
					caption: 'model.evaluation.editedHlScheme',
					type: 'dropdown-btn',
					iconClass: 'ico-view-ods',
					disabled: function () {
						return !modelEvaluationRulesetDataService.getSelected();
					},
					list: {
						showImages: true
					}
				}
			};

			function updateSelection(itemId, item) {
				if (item && item.mappingItem) {
					modelEvaluationRuleset2HlSchemeMappingDataService.setSelected(item.mappingItem);
				} else {
					modelEvaluationRuleset2HlSchemeMappingDataService.setSelected(null);
				}
			}

			result.menu = basicsCommonConfigLocationListService.createMenuItems(prepareItems(), {
				asRadio: true,
				clickFunc: updateSelection
			});

			result.toolItem.list.items = [result.menu.menuItem];

			function prepareItems() {
				const items = modelEvaluationRuleset2HlSchemeMappingDataService.getList();
				if (_.isArray(items)) {
					return _.map(items, function (item) {
						return {
							id: item.HighlightingScheme.Id,
							caption: item.HighlightingScheme.DescriptionInfo.Translated,
							scopeLevel: item.HighlightingScheme.ScopeLevel,
							rulesetId: item.ModelRulesetFk,
							hlSchemeId: item.HighlightingScheme.Id,
							mappingItem: item
						};
					});
				} else {
					return [];
				}
			}

			function updateItems() {
				result.menu.updateItems(prepareItems());
				result.toolItem.list.items = [result.menu.menuItem];

				const selRuleset = modelEvaluationRulesetDataService.getSelected();
				if (selRuleset && selRuleset.HighlightingSchemeFk) {
					result.menu.setSelection(selRuleset.HighlightingSchemeFk);
				} else {
					result.menu.setSelection(null);
				}
				updateScopeTools();
			}

			function updateScopeTools() {
				if (scope.tools && _.isFunction(scope.tools.update)) {
					scope.tools.update();
				}
			}

			modelEvaluationRulesetDataService.registerSelectionChanged(updateScopeTools);

			modelEvaluationRuleset2HlSchemeMappingDataService.registerListLoaded(updateItems);

			function mappingSelectionChanged() {
				const selMapping = modelEvaluationRuleset2HlSchemeMappingDataService.getSelected();
				scope.$evalAsync(function () {
					result.menu.setSelection(selMapping ? selMapping.HighlightingScheme.Id + '' : null);
				});
			}

			modelEvaluationRuleset2HlSchemeMappingDataService.registerSelectionChanged(mappingSelectionChanged);

			result.destroy = function () {
				modelEvaluationRuleset2HlSchemeMappingDataService.unregisterSelectionChanged(mappingSelectionChanged);
				modelEvaluationRuleset2HlSchemeMappingDataService.removeUsingContainer(scope.getContainerUUID());
				modelEvaluationRuleset2HlSchemeMappingDataService.unregisterListLoaded(updateItems);
				modelEvaluationRulesetDataService.unregisterSelectionChanged(updateScopeTools);
			};

			return result;
		};

		return service;
	}
})(angular);
