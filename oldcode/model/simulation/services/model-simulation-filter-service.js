/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationFilterService
	 * @function
	 *
	 * @description Provides model filters based on the simulation.
	 */
	angular.module('model.simulation').factory('modelSimulationFilterService',
		modelSimulationFilterService);

	modelSimulationFilterService.$inject = ['_', '$translate',
		'modelSimulationMasterService', 'modelViewerFilterDefinitionService', 'modelViewerModelIdSetService'];

	function modelSimulationFilterService(_, $translate, modelSimulationMasterService, modelViewerFilterDefinitionService,
		modelViewerModelIdSetService) {

		const simulationFilterIdPrefix = 'simulation:';

		// SimulationFilter ----------------------------------------------------------------

		function SimulationFilter(timeline) {
			modelViewerFilterDefinitionService.EagerFilter.call(this);
			this.id = simulationFilterIdPrefix + timeline.id;
			this.highlightingSettings.specialEmptyResultSetTreatment = false;
			this.timeline = timeline;
			this.translationKeyRoot = 'model.simulation.filter';
			this.isDisposed = false;
		}

		SimulationFilter.prototype = Object.create(modelViewerFilterDefinitionService.EagerFilter.prototype);
		SimulationFilter.prototype.constructor = SimulationFilter;

		SimulationFilter.prototype.getStateDescArguments = function () {
			return _.assign({
				timeline: this.timeline.getDisplayName()
			}, this.countByMeshState(true, true));
		};

		SimulationFilter.prototype.getDisplayName = function () {
			return $translate.instant('model.simulation.simFilterTitle', {
				name: this.timeline.getDisplayName()
			}) + (this.isDisposed ? $translate.instant('model.simulation.simFilterDisposedSuffix') : '');
		};

		const getEmptyMeshStates = function () {
			return new modelViewerModelIdSetService.MultiModelIdSet();
		};

		function disposeSimFilter() {
			const that = this; // jshint ignore:line
			that.isDisposed = true;
			that.getMeshStates = getEmptyMeshStates;
		}

		SimulationFilter.prototype.getIconClass = function () {
			return 'tlb-icons ico-timeline';
		};

		// service ----------------------------------------------------------------

		const service = {};

		const privateState = {
			simFiltersById: {},
			menus: []
		};

		function createFilters(timelines) {
			timelines.forEach(function createTimelineFilter(tl) {
				privateState.simFiltersById[tl.id] = new SimulationFilter(tl);
			});
		}

		modelSimulationMasterService.registerTimelineListChanged(function updateTimelineList(info) {
			const addedTimelines = _.filter(modelSimulationMasterService.getLoadedTimelines(), function (tl) {
				return info.added.byId[tl.id];
			});
			if (addedTimelines.length > 0) {
				createFilters(addedTimelines);
			}

			info.deleted.forEach(function (timelineId) {
				const f = privateState.simFiltersById[timelineId];
				if (f) {
					disposeSimFilter.call(f);
				}
				delete privateState.simFiltersById[timelineId];
			});

			privateState.menus.forEach(function (menu) {
				menu.updateMenu();
			});
		});

		service.integrateMenuItems = function (config) {
			function isSimulationFilterItem(fi) {
				return fi.isSimulationFilterItem;
			}

			function updateMenu() {
				let firstIdx = _.findIndex(config.menuItems, isSimulationFilterItem);
				if (firstIdx >= 0) {
					_.remove(config.menuItems, isSimulationFilterItem);
				} else {
					firstIdx = _.findIndex(config.menuItems, function (mi) {
						return mi.isCombinedFilterItem;
					});
					if (firstIdx < 0) {
						firstIdx = config.menuItems.length;
					}
				}

				const newSimFilterItems = _.map(Object.keys(privateState.simFiltersById), function (timelineId) {
					const filter = privateState.simFiltersById[timelineId];
					return {
						id: 'selectFilter:' + filter.id,
						caption: filter.getDisplayName(),
						value: filter.id,
						type: 'radio',
						fn: function () {
							config.activateFilter(filter);
						},
						isSimulationFilterItem: true
					};
				});

				config.menuItems.splice.apply(config.menuItems, _.concat([firstIdx, 0], newSimFilterItems));

				config.menuUpdated();
			}

			updateMenu();

			const result = {
				updateMenu: updateMenu
			};

			result.destroy = function () {
				_.remove(privateState.menus, function (m) {
					return m === result;
				});
			};

			privateState.menus.push(result);

			return result;
		};

		service.getFilterByTimelineId = function (timelineId) {
			if (!_.isString(timelineId)) {
				throw new Error('The supplied timeline ID is not a string.');
			}

			return privateState.simFiltersById[timelineId];
		};

		service.getAllFilters = function () {
			return _.map(modelSimulationMasterService.getLoadedTimelines(), function (tl) {
				return privateState.simFiltersById[tl.id];
			});
		};

		service.suspendAllUpdates = function () {
			Object.keys(privateState.simFiltersById).forEach(function (timelineId) {
				privateState.simFiltersById[timelineId].suspendUpdates();
			});
		};

		service.resumeAllUpdates = function () {
			Object.keys(privateState.simFiltersById).forEach(function (timelineId) {
				privateState.simFiltersById[timelineId].resumeUpdates();
			});
		};

		service.isValidFilterId = function (filterId) {
			return !!_.find(privateState.simFiltersById, function (f) {
				return f.id === filterId;
			});
		};

		createFilters(modelSimulationMasterService.getLoadedTimelines());

		return service;
	}
})(angular);
