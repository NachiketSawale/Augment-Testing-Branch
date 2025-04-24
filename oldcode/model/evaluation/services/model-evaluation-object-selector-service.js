/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.evaluation.modelEvaluationObjectSelectorService
	 * @function
	 *
	 * @description Provides a ruleset-based object selector.
	 */
	angular.module('model.evaluation').factory('modelEvaluationObjectSelectorService',
		modelEvaluationObjectSelectorService);

	modelEvaluationObjectSelectorService.$inject = ['modelViewerSelectorService',
		'platformWizardDialogService', '$translate', '$timeout', '$http', '_',
		'basicsCommonConfigLocationListService', '$q', 'modelViewerModelSelectionService',
		'modelViewerModelIdSetService'];

	function modelEvaluationObjectSelectorService(modelViewerSelectorService,
		platformWizardDialogService, $translate, $timeout, $http, _,
		basicsCommonConfigLocationListService, $q, modelViewerModelSelectionService,
		modelViewerModelIdSetService) {

		const service = {};

		modelViewerSelectorService.registerSelector({
			name: 'model.evaluation.objectSelector.name',
			category: 'general',
			isAvailable: function () {
				return true;
			},
			getObjects: function (settings) {
				const allElementIds = new modelViewerModelIdSetService.MultiModelIdSet();

				const selRuleIds = _.isArray(settings.rules.selectedId) ? settings.rules.selectedId : [];
				selRuleIds.forEach(function (ruleId) {
					const rh = _.find(settings.rules.items, function (item) {
						return item.Id === ruleId;
					});
					if (rh && rh.Objects) {
						allElementIds.assign(rh.Objects);
					}
				});

				return settings.evalForMeshes ? {
					meshIds: allElementIds
				} : {
					objectIds: allElementIds
				};
			},
			createWizardSteps: function (modelPrefix) {
				return [{
					id: 'findRuleSetsStep',
					title: $translate.instant('model.evaluation.objectSelector.loadingRuleSets'),
					loadingMessage: $translate.instant('model.evaluation.objectSelector.loadingRuleSetsMessage'),
					disallowBack: true,
					disallowNext: true,
					canFinish: false,
					prepareStep: function (info) {
						return $q.all({
							rulesets: $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/getall'),
							groups: $http.get(globals.webApiBaseUrl + 'model/evaluation/group/all')
						}).then(function (responses) {
							return {
								rulesets: _.isArray(responses.rulesets.data) ? responses.rulesets.data : [],
								groups: _.isArray(responses.groups.data) ? responses.groups.data : []
							};
						}).then(function (data) {
							const childrenProperty = 'children';

							function createChildItemsForParent(parentGroupId) {
								const groupItems = _.map(_.filter(data.groups, function (grp) {
									return grp.ModelRulesetGroupParentFk === parentGroupId;
								}), function (grp) {
									const result = {
										Id: 'g_' + grp.Id,
										Description: grp.DescriptionInfo
									};
									result[childrenProperty] = createChildItemsForParent(grp.Id);
									return result;
								});

								const rsItems = _.map(_.filter(data.rulesets, function (rs) {
									return rs.ModelRulesetGroupFk === parentGroupId;
								}), function (rs) {
									return {
										Id: _.isNumber(rs.ModelRulesetSuperFk) ? rs.ModelRulesetSuperFk : rs.Id,
										Description: rs.DescriptionInfo,
										accessScope: rs.ScopeLevel,
										image: 'tlb-icons ico-rules',
										HighlightingSchemeFk: rs.HighlightingSchemeFk
									};
								});

								return _.concat(_.filter(groupItems, function (grpItem) {
									return _.isArray(grpItem[childrenProperty]) && (grpItem[childrenProperty].length > 0);
								}), rsItems);
							}

							const ruleSetGroups = createChildItemsForParent(null);

							_.set(info.model, modelPrefix + 'ruleSets.items', _.filter(ruleSetGroups, function (rsg) {
								return !_.isEmpty(rsg.children);
							}));

							info.scope.$evalAsync(function () {
								info.step.disallowNext = false;
								$timeout(function () {
									info.commands.goToNext();
								});
							});
						});
					}
				}, _.assign(platformWizardDialogService.createListStep({
					title: $translate.instant('model.evaluation.objectSelector.selRuleSet'),
					topDescription: $translate.instant('model.evaluation.objectSelector.selRuleSetDesc'),
					model: modelPrefix + 'ruleSets',
					acceptsId: function (id) {
						if (_.isString(id)) {
							return !id.startsWith('g_');
						} else {
							return true;
						}
					}
				}), {
					disallowBack: true
				}), {
					id: 'evalSettingsStep',
					title: $translate.instant('model.evaluation.objectSelector.evalSettings'),
					disallowBack: true,
					form: {
						fid: 'model.evaluation.objectSelector.evalSettings',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'evalForMeshes',
							type: 'boolean',
							label: $translate.instant('model.evaluation.objectSelector.evalForMeshes'),
							model: modelPrefix + 'evalForMeshes',
							visible: true,
							sortOrder: 10
						}]
					}
				}, {
					id: 'findRulesStep',
					title: $translate.instant('model.evaluation.objectSelector.loadingRules'),
					loadingMessage: $translate.instant('model.evaluation.objectSelector.loadingRulesMessage'),
					disallowBack: true,
					disallowNext: true,
					canFinish: false,
					prepareStep: function (info) {
						const selectedRulesetId = _.get(info.model, modelPrefix + 'ruleSets.selectedId');

						const evalForMeshes = !!_.get(info.model, modelPrefix + 'evalForMeshes');
						const evaluationMethod = evalForMeshes ? 'evaluate' : 'evaluateToObjects';

						(function patchColumns() {
							const ruleColumns = _.get(info.model, modelPrefix + 'rules.selectionListConfig.columns');
							const countCol = _.find(ruleColumns, function (c) {
								return c.id === 'objCount';
							});
							countCol.name = $translate.instant('model.evaluation.objectSelector.' + (evalForMeshes ? 'meshCount' : 'objectCount'));
						})();

						return $q.all({
							ruleHeaders: $http.get(globals.webApiBaseUrl + 'model/evaluation/rule/listHeadersByRuleset', {
								params: {
									rulesetFk: selectedRulesetId
								}
							}).then(function (response) {
								return _.map(_.isArray(response.data) ? response.data : [], function (r) {
									return {
										Id: r.Id.PKey1 + '/' + r.Id.Id,
										Description: r.DescriptionInfo
									};
								});
							}),
							ruleResults: $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/' + evaluationMethod, {
								params: {
									modelId: modelViewerModelSelectionService.getSelectedModelId(),
									rulesetId: selectedRulesetId
								}
							}).then(function (response) {
								const result = {};
								if (_.isArray(response.data)) {
									response.data.forEach(function (ruleData) {
										result[ruleData.rs + '/' + ruleData.r] = modelViewerModelIdSetService.createFromCompressedStringWithMaps(ruleData.ids, true).useSubModelIds();
									});
								}
								return result;
							})
						}).then(function (data) {
							const rules = _.map(data.ruleHeaders, function (rh) {
								const rr = data.ruleResults[rh.Id];

								if (rr) {
									rh.Objects = rr;
									rh.ObjectCount = rr.totalCount();
								} else {
									rh.ObjectCount = 0;
								}
								return rh;
							});

							_.set(info.model, modelPrefix + 'rules.items', rules);

							info.scope.$evalAsync(function () {
								info.step.disallowNext = false;
								$timeout(function () {
									info.commands.goToNext();
								});
							});
						});
					}
				}, _.assign(platformWizardDialogService.createListStep({
					title: $translate.instant('model.evaluation.objectSelector.selRules'),
					topDescription: $translate.instant('model.evaluation.objectSelector.selRulesDesc'),
					model: modelPrefix + 'rules'
				}), {
					disallowBack: true
				})];
			},
			createSettings: function () {
				const filterFunc = function (item, text) {
					const str = _.get(item, 'Description.Translated');
					if (_.isString(str)) {
						return str.toLowerCase().includes(text);
					}
					return false;
				};

				return {
					evalForMeshes: false,
					ruleSets: {
						selectionListConfig: {
							idProperty: 'Id',
							childProp: 'children',
							columns: [{
								id: 'desc',
								field: 'Description.Translated',
								name: $translate.instant('cloud.common.entityDescription'),
								formatter: 'description',
								sortable: true,
								width: 250
							}],
							filterItem: filterFunc
						}
					},
					rules: {
						selectionListConfig: {
							idProperty: 'Id',
							columns: [{
								id: 'desc',
								field: 'Description.Translated',
								name: $translate.instant('cloud.common.entityDescription'),
								formatter: 'description',
								sortable: false,
								width: 250
							}, {
								id: 'objCount',
								field: 'ObjectCount',
								formatter: 'integer',
								sortable: false,
								width: 150
							}],
							multiSelect: true,
							filterItem: filterFunc
						}
					}
				};
			}
		});

		return service;
	}
})(angular);
