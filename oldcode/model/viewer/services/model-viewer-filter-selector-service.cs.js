/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFilterSelectorService
	 * @function
	 *
	 * @description Provides object selectors related to model filtering.
	 */
	angular.module('model.viewer').factory('modelViewerFilterSelectorService', ['_', 'modelViewerSelectorService',
		'modelViewerModelSelectionService', '$translate', 'modelViewerStandardFilterService', '$q', '$http',
		'modelSimulationFilterService',
		function (_, modelViewerSelectorService, modelViewerModelSelectionService, $translate,
		          modelViewerStandardFilterService, $q, $http, modelSimulationFilterService) {
			var service = {};

			function updateWizardForFilter(wizardSteps, loadedFilterResults, getModelFilterId, model, modelPrefix, scope) {
				var filterStep = _.find(wizardSteps, {
					id: 'filterSelectionStep'
				});
				filterStep.disallowNext = true;

				var dataPromises = {};

				if (!loadedFilterResults.statesPromise) {
					loadedFilterResults.statesPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/modelfilterstate/list').then(function (response) {
						return response.data;
					});
				}
				dataPromises.states = loadedFilterResults.statesPromise;

				var filter = _.find(loadedFilterResults.filters, function (f) {
					return f.id === getModelFilterId();
				});
				dataPromises.results = filter.prepareMeshStates().then(function () {
					return filter.getMeshStates();
				});

				$q.all(dataPromises).then(function resultsPrepared(data) {
					if (!loadedFilterResults.states) {
						loadedFilterResults.states = data.states;
						_.set(model, modelPrefix + 'stateDefs', data.states);
					}
					if (!loadedFilterResults.byFilterId[filter.id]) {
						loadedFilterResults.byFilterId[filter.id] = {
							values: data.results,
							count: data.results.countByValue()
						};
					}

					if (getModelFilterId() === filter.id) {
						var results = loadedFilterResults.byFilterId[filter.id];

						var stateStep = _.find(wizardSteps, {
							id: 'filterStateSelectionStep'
						});
						stateStep.form.rows = _.map(_.filter(data.states, function (state) {
							return results.count[state.Code] > 0;
						}), function (state) {
							return {
								gid: 'default',
								rid: 'state_' + state.Id,
								type: 'boolean',
								label: $translate.instant('model.viewer.selectors.filterState.filterStateWithCount', {
									state: state.DescriptionInfo.Translated,
									count: results.count[state.Code]
								}),
								model: modelPrefix + 'states.state_' + state.Id
							};
						});

						_.set(model, modelPrefix + 'results', results);

						scope.$evalAsync(function () {
							filterStep.disallowNext = false;
						});
					}
				});
			}

			modelViewerSelectorService.registerSelector({
				name: 'model.viewer.selectors.filterState.name',
				category: 'general',
				isAvailable: function () {
					return true;
				},
				getObjects: function (settings) {
					return {
						meshIds: (function () {
							var stateIncluded = {};
							settings.stateDefs.forEach(function (state) {
								stateIncluded[state.Code] = !!settings.states['state_' + state.Id];
							});

							return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
								var modelValues = settings.results.values[subModelId];

								if (_.isArray(modelValues)) {
									throw new Error('Arrays are not supported (nor expected) at this point.');
								} else if (_.isObject(modelValues)) {
									return modelValues.mapValues(function (v) {
										return stateIncluded[v];
									});
								}
							});
						})()
					};
				},
				createWizardSteps: function (modelPrefix) {
					var result = [];

					var loadedFilterResults = {
						filters: _.filter(_.concat(modelViewerStandardFilterService.getFiltersForCurrentModule(), modelSimulationFilterService.getAllFilters()), function (f) {
							return !f.isDisabledFilter && !f.usesDynamicHighlightingSchemes();
						}),
						byFilterId: {},
						states: null
					};

					var doUpdateWizardForFilter = function filterSelected(info) {
						updateWizardForFilter(result, loadedFilterResults, function () {
							return _.get(info.model, modelPrefix + 'filter');
						}, info.model, modelPrefix, info.scope);
					};

					result.push({
						id: 'filterSelectionStep',
						title: $translate.instant('model.viewer.selectors.filterState.selectFilter'),
						topDescription: $translate.instant('model.viewer.selectors.filterState.selectFilterDesc'),
						disallowNext: true,
						form: {
							fid: 'model.viewer.objectSelector.filter.chooseFilter',
							version: '1.0.0',
							showGrouping: false,
							groups: [{
								gid: 'default'
							}],
							rows: [{
								gid: 'default',
								rid: 'viewer',
								type: 'radio',
								options: {
									valueMember: 'value',
									labelMember: 'label',
									groupName: 'viewerGroup',
									items: _.map(loadedFilterResults.filters, function (f) {
										return {
											label: f.getDisplayName(),
											value: f.id
										};
									})
								},
								model: modelPrefix + 'filter'
							}]
						},
						watches: [{
							expression: modelPrefix + 'filter',
							fn: doUpdateWizardForFilter
						}],
						prepareStep: doUpdateWizardForFilter
					});

					result.push({
						id: 'filterStateSelectionStep',
						title: $translate.instant('model.viewer.selectors.filterState.selectStates'),
						topDescription: $translate.instant('model.viewer.selectors.filterState.selectStatesDesc'),
						form: {
							fid: 'model.viewer.objectSelector.filter.states',
							version: '1.0.0',
							showGrouping: false,
							groups: [{
								gid: 'default'
							}],
							rows: null
						}
					});

					return result;
				},
				createSettings: function () {
					return {
						filter: 'objectSearchSidebar',
						states: {}
					};
				}
			});

			return service;
		}]);
})(angular);
