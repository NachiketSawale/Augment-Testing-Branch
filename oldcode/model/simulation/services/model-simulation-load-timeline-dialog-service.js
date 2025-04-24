/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationLoadTimelineDialogService
	 * @function
	 *
	 * @description Displays a dialog box for selecting input data to simulate.
	 */
	angular.module('model.simulation').factory('modelSimulationLoadTimelineDialogService',
		modelSimulationLoadTimelineDialogService);

	modelSimulationLoadTimelineDialogService.$inject = ['_', '$q',
		'modelViewerModelSelectionService', 'schedulingScheduleProjectScheduleLookupDataService',
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService',
		'$http', 'projectMainProjectSelectionService', 'PlatformMessenger', '$translate',
		'modelSimulationTimelineRequestService'];

	function modelSimulationLoadTimelineDialogService(_, $q, modelViewerModelSelectionService, schedulingScheduleProjectScheduleLookupDataService,
		basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService, $http,
		projectMainProjectSelectionService, PlatformMessenger, $translate,
		modelSimulationTimelineRequestService) {

		const service = {};

		const state = {
			selectedScheduleIds: [],
			selectedEstimateIds: []
		};

		function ModelLinkageCache(targetScheduleIds, targetEstimateIds, modelId) {
			this.targetScheduleIds = targetScheduleIds;
			this.targetEstimateIds = targetEstimateIds;
			this.modelId = modelId;
			this._cached = {};
			this.linkedText = $translate.instant('model.simulation.hasEventsForModel');
			this.notLinkedText = $translate.instant('model.simulation.hasNoEventsForModel');
		}

		function formatScheduleIds(ids) {
			if (!ids) {
				return null;
			}

			return _.map(ids, function (id) {
				const parts = id.split('_');
				const result = {
					ScheduleId: parseInt(parts[0])
				};
				if (parts[1].length > 0) {
					result.BaselineId = parseInt(parts[1]);
				}
				return result;
			});
		}

		ModelLinkageCache.prototype.get = function (scheduleIds, estimateIds) {
			const that = this;

			let combinedId = '';
			if (scheduleIds) {
				combinedId += _.sortBy(scheduleIds).join(':');
			}
			combinedId += ';';
			if (estimateIds) {
				combinedId += _.sortBy(estimateIds).join(':');
			}

			const result = this._cached[combinedId];
			if (result) {
				return $q.when(result);
			} else {
				const retrievalPromise = $http.post(globals.webApiBaseUrl + 'model/simulation/retrieval/eventsourcehints', {
					Schedules: (scheduleIds && (scheduleIds.length <= 0)) ? null : formatScheduleIds(scheduleIds),
					Estimates: (estimateIds && (estimateIds.length <= 0)) ? null : estimateIds,
					TargetSchedules: formatScheduleIds(this.targetScheduleIds),
					TargetEstimates: this.targetEstimateIds,
					ModelId: this.modelId
				}).then(function (response) {
					if (response.data) {
						that._cached[combinedId] = response.data;
						return response.data;
					}
				});
				this._cached[combinedId] = retrievalPromise;
				return retrievalPromise;
			}
		};

		ModelLinkageCache.prototype.storeModelLinkage = function (items, linkageData, schedules) {
			const that = this;
			linkageData.forEach(function (data) {
				const id = schedules ? generateScheduleBaselineId({
					ScheduleId: data.Id,
					BaselineId: data.Id2
				}) : data.Id;
				const item = items.byId[id];
				item.hasEventsForModel = data.IsLinkedToModel ? that.linkedText : that.notLinkedText;
			});
		};

		function processItemList(itemList, selIds) {
			itemList.byId = {};
			itemList.forEach(function (item) {
				item.Id = item.Id.Id;
				itemList.byId[item.Id] = item;
			});

			selIds.forEach(function (id) {
				const listItem = itemList.byId[id];
				if (listItem) {
					listItem.IsMarked = true;
				}
			});
		}

		function registerMapping(mappingMap, fromId, toId, toIdsName) {
			let srcInfo = mappingMap[fromId];
			if (!srcInfo) {
				srcInfo = mappingMap[fromId] = {};
				srcInfo[toIdsName] = {};
			}
			srcInfo[toIdsName][toId] = true;
		}

		function convertMappingToArrays(mappingMap, toIdsName) {
			Object.keys(mappingMap).forEach(function (fromId) {
				mappingMap[fromId][toIdsName] = _.map(Object.keys(mappingMap[fromId][toIdsName]), function (toId) {
					return toId;
				});
			});
		}

		function projectToId(item) {
			return item.Id;
		}

		function generateScheduleBaselineId(item) {
			return item.ScheduleId + '_' + (_.isNumber(item.BaselineId) ? item.BaselineId : '');
		}

		function normalizeEligibleData(rawData) {
			const result = rawData;

			result.Schedules.forEach(function (s) {
				s.ScheduleId = s.Id.Id;
				s.Id = {
					Id: generateScheduleBaselineId(s)
				};
				s.image = 'control-icons ico-schedule';
			});

			processItemList(result.Schedules, state.selectedScheduleIds);
			processItemList(result.Estimates, state.selectedEstimateIds);

			(function groupSchedulesWithBaselines() {
				const schedulesWithoutBaseline = _.filter(result.Schedules, function (s) {
					return !_.isNumber(s.BaselineId);
				});

				const schedulesWithoutBaselineById = {};
				schedulesWithoutBaseline.forEach(function (s) {
					schedulesWithoutBaselineById[s.ScheduleId] = s;
					s.children = [];
				});

				result.Schedules.forEach(function (s) {
					if (_.isNumber(s.BaselineId)) {
						const parentS = schedulesWithoutBaselineById[s.ScheduleId];
						parentS.children.push(s);
						s.parent = parentS;
					}
				});

				schedulesWithoutBaseline.byId = result.Schedules.byId;
				result.AllSchedules = result.Schedules;
				result.Schedules = schedulesWithoutBaseline;
			})();

			result.reqBySchedule = {};
			result.reqByEstimate = {};
			result.EstSchedulePairs.forEach(function (pair) {
				registerMapping(result.reqBySchedule, generateScheduleBaselineId(pair), pair.EstHeaderId, 'Estimates');
				registerMapping(result.reqByEstimate, pair.EstHeaderId, generateScheduleBaselineId(pair), 'Schedules');
			});

			convertMappingToArrays(result.reqBySchedule, 'Estimates');
			convertMappingToArrays(result.reqByEstimate, 'Schedules');

			const selModel = modelViewerModelSelectionService.getSelectedModel();
			if (selModel) {
				result.modelLinkage = new ModelLinkageCache(_.map(result.AllSchedules, projectToId), _.map(result.Estimates, projectToId), selModel.info.modelId);
			}

			result.updateFilter = function () {
				if (_.some(result.AllSchedules, function (item) {
					return item.IsMarked;
				})) {
					result.Estimates.forEach(function (item) {
						const estRequirements = result.reqByEstimate[item.Id] || {};
						item.IsHidden = !_.some(estRequirements.Schedules || [], function (scheduleId) {
							return result.AllSchedules.byId[scheduleId].IsMarked;
						});
					});
				} else {
					result.Estimates.forEach(function (item) {
						item.IsHidden = false;
					});
				}

				if (_.some(result.Estimates, function (item) {
					return item.IsMarked;
				})) {
					result.AllSchedules.forEach(function (item) {
						const schedRequirements = result.reqBySchedule[item.Id] || {};
						item.IsHidden = !_.some(schedRequirements.Estimates || [], function (estimateId) {
							return result.Estimates.byId[estimateId].IsMarked;
						});
					});
				} else {
					result.AllSchedules.forEach(function (item) {
						item.IsHidden = false;
					});
				}

				result.AllSchedules.forEach(function (item) {
					item.hasEventsForModel = '';
				});
				result.Estimates.forEach(function (item) {
					item.hasEventsForModel = '';
				});

				result.onFilterUpdated.fire();

				if (result.modelLinkage) {
					result.modelLinkage.get(_.map(_.filter(result.AllSchedules, function (item) {
						return !!item.IsMarked;
					}), projectToId), _.map(_.filter(result.Estimates, function (item) {
						return !!item.IsMarked;
					}), projectToId)).then(function (linkage) {
						result.modelLinkage.storeModelLinkage(result.AllSchedules, linkage.ScheduleHints, true);
						result.modelLinkage.storeModelLinkage(result.Estimates, linkage.EstimateHints);
						result.onFilterUpdated.fire();
					});
				}
			};

			result.onFilterUpdated = new PlatformMessenger();

			return result;
		}

		/**
		 * @ngdoc function
		 * @name modelSimulationLoadTimelineDialogService
		 * @function
		 * @methodOf modelSimulationLoadTimelineDialogService
		 * @description Displays the dialog box.
		 * @returns {Object} An object that contains a `success` field for indicating whether loading of a
		 *                   simulation should proceed, as well as a `scheduleIds` property that contains an array
		 *                   of selected schedule IDs.
		 */
		service.showDialog = function () {
			const selModel = modelViewerModelSelectionService.getSelectedModel();
			const loadSettings = {
				model: selModel ? selModel.info.getNiceName() : '',
				selectedScheduleIds: state.selectedScheduleIds.slice(0),
				selectedEstimateIds: state.selectedEstimateIds.slice(0),
				dateKind: 'c'
			};

			return $http.get(globals.webApiBaseUrl + 'model/simulation/retrieval/containers?projectId=' + projectMainProjectSelectionService.getSelectedProjectId()).then(function (response) {
				loadSettings.eligible = normalizeEligibleData(response.data);
				loadSettings.eligible.updateFilter();

				const dateKindOptions = [
					{
						text$tr$: 'model.simulation.dateKindCurrent',
						value: 'c'
					}, {
						text$tr$: 'model.simulation.dateKindPlanned',
						value: 'p'
					}
				];
				platformTranslateService.translateObject(dateKindOptions, 'text');

				const loadDialogConfig = {
					title: $translate.instant('model.simulation.loadTimelineTitle'),
					width: '80%',
					dataItem: loadSettings,
					formConfiguration: {
						fid: 'model.simulation.loadTimeline',
						showGrouping: false,
						groups: [
							{
								gid: 'dataSource',
								isOpen: true,
								sortOrder: 100
							}
						],
						rows: [
							{
								gid: 'dataSource',
								rid: 'name',
								label$tr$: 'model.simulation.timelineName',
								type: 'description',
								model: 'name',
								placeholder: $translate.instant('model.simulation.autoValueHint'),
								sortOrder: 50
							}, {
								gid: 'dataSource',
								rid: 'scheduleSel',
								label$tr$: 'model.simulation.schedules',
								type: 'directive',
								directive: 'model-simulation-event-source-selector',
								options: {
									gridId: 'c38647f5d2ae4129a89164077f8dbbbf',
									entity: 'Schedule'
								},
								sortOrder: 100
							}, {
								gid: 'dataSource',
								rid: 'estimateSel',
								label$tr$: 'model.simulation.estimates',
								type: 'directive',
								directive: 'model-simulation-event-source-selector',
								options: {
									gridId: '9b3cb0c28011428ea0d1067edefe7511',
									entity: 'Estimate'
								},
								sortOrder: 102
							}, {
								gid: 'dataSource',
								rid: 'dateKind',
								label$tr$: 'model.simulation.dateKind',
								type: 'select',
								options: {
									items: dateKindOptions,
									valueMember: 'value',
									displayMember: 'text',
									modelIsObject: false
								},
								model: 'dateKind',
								visible: true,
								sortOrder: 110
							}, {
								gid: 'dataSource',
								rid: 'model',
								label$tr$: 'model.simulation.model',
								type: 'description',
								readonly: true,
								model: 'model',
								visible: true,
								sortOrder: 200
							}
						]
					},
					dialogOptions: {
						disableOkButton: function () {
							return (loadSettings.selectedScheduleIds.length <= 0) && (loadSettings.selectedEstimateIds.length <= 0);
						}
					}
				};

				platformTranslateService.translateFormConfig(loadDialogConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(loadDialogConfig).then(function (result) {
					if (result.ok) {
						state.selectedScheduleIds = loadSettings.selectedScheduleIds.slice(0);
						state.selectedEstimateIds = loadSettings.selectedEstimateIds.slice(0);

						return {
							success: true,
							request: _.assign(new modelSimulationTimelineRequestService.TimelineRequest(), {
								Schedules: formatScheduleIds(loadSettings.selectedScheduleIds),
								Estimates: loadSettings.selectedEstimateIds,
								DateKind: loadSettings.dateKind,
								Name: loadSettings.name
							})
						};
					} else {
						return {
							success: false
						};
					}
				});
			});
		};

		return service;
	}
})(angular);
