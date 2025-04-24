/*
 * $Id: scheduling-main-simulated-gantt-vis-controller.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name scheduling.main.controller:schedulingMainSimulatedGanttVisController
	 * @requires $scope, $translate, _, platformDatavisService, schedulingMainSimulatedGanttVisService,
	 *           schedulingMainSimulatedGanttDataService, schedulingMainSimulatedGanttConfigDialogService,
	 *           mainViewService, moment, modelSimulationTimelineRequestService
	 * @description The controller for the simulated Gantt chart container.
	 */
	angular.module('scheduling.main').controller('schedulingMainSimulatedGanttVisController', ['$scope', '$translate',
		'_', 'platformDatavisService', 'schedulingMainSimulatedGanttVisService',
		'schedulingMainSimulatedGanttDataService', 'schedulingMainSimulatedGanttConfigDialogService',
		'mainViewService', 'moment', 'modelSimulationTimelineRequestService', 'modelSimulationMasterService',
		function ($scope, $translate, _, platformDatavisService, schedulingMainSimulatedGanttVisService,
			schedulingMainSimulatedGanttDataService, schedulingMainSimulatedGanttConfigDialogService,
			mainViewService, moment, modelSimulationTimelineRequestService, modelSimulationMasterService) { // jshint ignore:line

			var viewUUID = $scope.getContentValue('uuid');

			var visLink = platformDatavisService.initDatavisContainerController($scope, schedulingMainSimulatedGanttVisService, null);

			function updateData(data) {
				if (data.isReady) {
					$scope.overlayInfo = null;
					visLink.setData(data);
				} else {
					$scope.overlayInfo = $translate.instant('scheduling.main.simulatedGantt.notLoaded');
				}
			}

			schedulingMainSimulatedGanttDataService.registerInfoChanged(updateData);

			var activeSettings = tidyUpSettings(mainViewService.customData(viewUUID, 'simGanttConfig'));
			applySettings();

			function configureChart() {
				schedulingMainSimulatedGanttConfigDialogService.showDialog(activeSettings).then(function (result) {
					if (result.ok) {
						activeSettings = tidyUpSettings(result.data);
						mainViewService.customData(viewUUID, 'simGanttConfig', activeSettings);
						applySettings();
					}
				});
			}

			function showDetails() {
				schedulingMainSimulatedGanttDataService.showActivityDetails(schedulingMainSimulatedGanttDataService.getSelectedItemId());
			}

			function isNoItemSelected() {
				return !schedulingMainSimulatedGanttDataService.getSelectedItemId();
			}

			function goToBeginning() {
				const object = schedulingMainSimulatedGanttDataService.getSelectedItemInfo();
				modelSimulationMasterService.moveToTime(object.from);
			}

			function goToEnd() {
				const object = schedulingMainSimulatedGanttDataService.getSelectedItemInfo();
				modelSimulationMasterService.moveToTime(object.to);
			}

			function tidyUpSettings(settings) {
				var actualSettings = _.isObject(settings) ? settings : {};

				if (!_.isNumber(actualSettings.displayedTimeSpanSize) || (actualSettings.displayedTimeSpanSize <= 0)) {
					actualSettings.displayedTimeSpanSize = 4;
				}

				switch (actualSettings.displayedTimeSpanUnit) {
					case 'd':
					case 'w':
					case 'm':
					case 'y':
						break;
					default:
						actualSettings.displayedTimeSpanUnit = 'w';
						break;
				}

				actualSettings.onlyWithModelObjects = !!actualSettings.onlyWithModelObjects;

				return actualSettings;
			}

			function applySettings() {
				schedulingMainSimulatedGanttDataService.suspendUpdates();

				schedulingMainSimulatedGanttDataService.setDisplayedTimeSpan(moment.duration(activeSettings.displayedTimeSpanSize, (function () {
					switch (activeSettings.displayedTimeSpanUnit) {
						case 'd':
							return 'days';
						case 'm':
							return 'months';
						case 'y':
							return 'years';
						default:
							return 'weeks';
					}
				})()));

				schedulingMainSimulatedGanttDataService.setOnlyWithModelObjects(activeSettings.onlyWithModelObjects);

				schedulingMainSimulatedGanttDataService.resumeUpdates();
			}

			var timelineSelector = modelSimulationTimelineRequestService.createSelectionMenu({
				dropdown: true,
				updateMenu: function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				}
			});
			timelineSelector.registerSelectionChanged(function onRequestSelected() {
				var request = timelineSelector.getSelection();
				schedulingMainSimulatedGanttDataService.setTimelineRequest(request);
			});

			(function buildToolBar() {
				var toolItems = [{
					id: 'Dtl',
					caption: 'scheduling.main.simulatedGantt.details',
					type: 'item',
					iconClass: 'tlb-icons ico-info-dialogue',
					disabled: isNoItemSelected,
					fn: showDetails
				}, {
					id: 'additionalCommandsGroup',
					type: 'sublist',
					list: {
						items: [{
							id: 'Bgn',
							caption: 'scheduling.main.simulatedGantt.goToBeginning',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-first',
							disabled: isNoItemSelected,
							fn: goToBeginning
						}, {
							id: 'End',
							caption: 'scheduling.main.simulatedGantt.goToEnd',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-last',
							disabled: isNoItemSelected,
							fn: goToEnd
						}]
					}
				}, {
					id: 'Cfg',
					caption: 'scheduling.main.simulatedGantt.configure',
					type: 'item',
					iconClass: 'tlb-icons ico-settings',
					fn: configureChart
				}, timelineSelector.menuItem];

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools'
				});
				$scope.tools.items = toolItems;
				$scope.tools.update();
			})();

			function updateTools() {
				if ($scope.tools) {
					$scope.tools.update();
				}
			}

			schedulingMainSimulatedGanttDataService.registerSelectedChanged(updateTools);

			$scope.$on('$destroy', function () {
				schedulingMainSimulatedGanttDataService.unregisterSelectedChanged(updateTools);
			});

			$scope.$on('$destroy', function () {
				timelineSelector.destroy();
				schedulingMainSimulatedGanttDataService.unregisterInfoChanged(updateData);
			});
		}]);
})();
