/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerCombinedFilterDialogService
	 * @function
	 *
	 * @description Provides a dialog box for configuring a combined model filter.
	 */
	angular.module('model.viewer').factory('modelViewerCombinedFilterDialogService',
		modelViewerCombinedFilterDialogService);

	modelViewerCombinedFilterDialogService.$inject = ['_', '$q', '$http', '$translate',
		'platformListSelectionDialogService', 'modelViewerFixedModuleConfigurationService',
		'mainViewService', 'basicsCommonConfigLocationListService',
		'modelViewerStandardFilterService', 'basicsLookupdataConfigGenerator',
		'modelSimulationFilterService', 'modelEvaluationRulesetDataService'];

	function modelViewerCombinedFilterDialogService(_, $q, $http, $translate,
		platformListSelectionDialogService, modelViewerFixedModuleConfigurationService,
		mainViewService, basicsCommonConfigLocationListService,
		modelViewerStandardFilterService, basicsLookupdataConfigGenerator,
		modelSimulationFilterService, modelEvaluationRulesetDataService) {

		const service = {};

		const childrenProperty = 'children';

		function retrieveFilters() {
			let filters = modelViewerStandardFilterService.getFiltersForCurrentModule();

			filters = _.map(_.filter(filters, function (f) {
				return !f.isDisabledFilter;
			}), function (f) {
				return {
					id: 'f-' + f.id,
					name: f.getDisplayName(),
					type: 'filter',
					filterId: f.id,
					image: 'ico-filter'
				};
			});
			return $q.when(filters);
		}

		function retrieveSimulationFilters() {
			return $q.when(_.map(modelSimulationFilterService.getAllFilters(), function (f) {
				return {
					id: 'sim-' + f.timeline.id,
					name: f.timeline.getDisplayName(),
					type: 'simulation',
					timelineId: f.timeline.id,
					image: 'tlb-icons ico-timeline2'
				};
			}));
		}

		function retrieveRulesets() {
			const moduleName = mainViewService.getCurrentModuleName();
			return $q.all({
				rulesets: $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/getbymodule', {
					params: (function generateCallParams() {
						const paramsObj = {
							moduleName: moduleName
						};
						paramsObj.projectId = modelEvaluationRulesetDataService.getRulesetRelevantActiveProjectId();
						return paramsObj;
					})()
				}),
				groups: $http.get(globals.webApiBaseUrl + 'model/evaluation/group/all')
			}).then(function (responses) {
				return {
					rulesets: _.isArray(responses.rulesets.data) ? responses.rulesets.data : [],
					groups: _.isArray(responses.groups.data) ? responses.groups.data : []
				};
			}).then(function (data) {
				function createChildItemsForParent(parentGroupId) {
					const groupItems = _.map(_.filter(data.groups, function (grp) {
						return grp.ModelRulesetGroupParentFk === parentGroupId;
					}), function (grp) {
						const result = {
							id: 'ruleset-group-' + grp.Id,
							name: grp.DescriptionInfo.Translated
						};
						result[childrenProperty] = createChildItemsForParent(grp.Id);
						return result;
					});

					const rsItems = _.map(_.filter(data.rulesets, function (rs) {
						return rs.ModelRulesetGroupFk === parentGroupId;
					}), function (rs) {
						const actualRsId = _.isNumber(rs.ModelRulesetSuperFk) ? rs.ModelRulesetSuperFk : rs.Id;
						return {
							id: 'rs-' + actualRsId,
							name: rs.DescriptionInfo.Translated,
							type: 'ruleset',
							rulesetId: actualRsId,
							HighlightingSchemeFk: rs.HighlightingSchemeFk,
							image: 'tlb-icons ico-rules'
						};
					});

					return _.concat(_.filter(groupItems, function (grpItem) {
						return _.isArray(grpItem[childrenProperty]) && (grpItem[childrenProperty].length > 0);
					}), rsItems);
				}

				return createChildItemsForParent(null);
			});
		}

		function retrieveAvailableItems() {
			return $q.all({
				filters: retrieveFilters(),
				timelineFilters: retrieveSimulationFilters(),
				rulesets: retrieveRulesets()
			}).then(function (availableData) {
				const result = [];

				if ((availableData.filters.length > 0) || (availableData.timelineFilters.length > 0)) {
					const filterRootItem = {
						id: 'filterRoot',
						name: $translate.instant('model.viewer.combinedFilter.filtersGroup')
					};
					result.push(filterRootItem);

					const filterItems = availableData.filters;
					if (availableData.timelineFilters.length > 0) {
						const simulationRootItem = {
							id: 'simulationRoot',
							name: $translate.instant('model.viewer.combinedFilter.simulationGroup')
						};

						simulationRootItem[childrenProperty] = availableData.timelineFilters;

						filterItems.push(simulationRootItem);
					}
					filterRootItem[childrenProperty] = filterItems;
				}

				if (availableData.rulesets.length > 0) {
					const rulesetRootItem = {
						id: 'rulesetRoot',
						name: $translate.instant('model.viewer.combinedFilter.rulesetsGroup')
					};
					result.push(rulesetRootItem);

					rulesetRootItem[childrenProperty] = availableData.rulesets;
				}

				return result;
			});
		}

		service.showDialog = function (initialCombinedFilter) {
			return retrieveAvailableItems().then(function (avItems) {
				const hlSchemeLookup = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'modelAdministrationHlSchemeLookupDataService',
					filter: function provideRulesetIdFilter(item) {
						switch (item.type) {
							case 'ruleset':
								return item.rulesetId;
							default:
								return null;
						}
					},
					gridLess: true
				});

				const dlgConfig = {
					dialogTitle: $translate.instant('model.viewer.combinedFilter.dialogTitle'),
					allItems: avItems,
					value: initialCombinedFilter,
					acceptItems: function (items) {
						return items.length > 0;
					},
					childrenProperty: childrenProperty,
					selectedColumns: [{
						id: 'description',
						formatter: 'description',
						name: 'Item',
						name$tr$: 'platform.listselection.item',
						field: 'name',
						width: 200
					}, _.assign({
						id: 'hlSchemeFk',
						name: 'Highlighting Scheme',
						name$tr$: 'model.administration.hlScheme',
						field: 'HighlightingSchemeFk',
						width: 150
					}, hlSchemeLookup)],
					copyItemProperties: function (from, to) {
						if (_.isNumber(from.HighlightingSchemeFk)) {
							to.HighlightingSchemeFk = from.HighlightingSchemeFk;
						}
					}
				};

				return platformListSelectionDialogService.showDialog(dlgConfig).then(function (result) {
					if (result.success) {
						return result.value;
					} else {
						return false;
					}
				});
			});
		};

		return service;
	}
})(angular);
