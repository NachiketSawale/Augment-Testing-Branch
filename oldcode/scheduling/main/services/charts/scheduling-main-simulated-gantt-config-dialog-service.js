/*
 * $Id: scheduling-main-simulated-gantt-config-dialog-service.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.main.schedulingMainSimulatedGanttConfigDialogService
	 * @function
	 * @requires _, $translate, platformTranslateService, platformModalFormConfigService,
	 *           modelViewerModelSelectionService
	 *
	 * @description Provides a dialog box for configuring the simulated Gantt chart.
	 */
	angular.module('scheduling.main').factory('schedulingMainSimulatedGanttConfigDialogService', ['_', '$translate',
		'platformTranslateService', 'platformModalFormConfigService', 'modelViewerModelSelectionService',
		function (_, $translate, platformTranslateService, platformModalFormConfigService,
			modelViewerModelSelectionService) {
			var service = {};

			service.showDialog = function (config) {
				var selectedModelId = modelViewerModelSelectionService.getSelectedModelId();

				var tempData = _.cloneDeep(config);
				if (!selectedModelId) {
					tempData.onlyWithModelObjects = false;
				}

				var timeSpanUnitOptions = [
					{
						text$tr$: 'scheduling.main.simulatedGantt.unitDays',
						value: 'd'
					}, {
						text$tr$: 'scheduling.main.simulatedGantt.unitWeeks',
						value: 'w'
					}, {
						text$tr$: 'scheduling.main.simulatedGantt.unitMonths',
						value: 'm'
					}, {
						text$tr$: 'scheduling.main.simulatedGantt.unitYears',
						value: 'y'
					}
				];
				platformTranslateService.translateObject(timeSpanUnitOptions, 'text');

				var dialogConfig = {
					title: 'scheduling.main.simulatedGantt.configTitle',
					dataItem: tempData,
					formConfiguration: {
						fid: 'scheduling.main.simulatedGanttConfig',
						showGrouping: false,
						groups: [
							{
								gid: 'default',
								sortOrder: 100
							}
						],
						rows: [
							{
								gid: 'default',
								label$tr$: 'scheduling.main.simulatedGantt.displayedTimeSpan',
								type: 'composite',
								visible: true,
								sortOrder: 100,
								composite: [{
									model: 'displayedTimeSpanSize',
									type: 'integer',
									fill: true,
									tooltip: $translate.instant('scheduling.main.simulatedGantt.length')
								}, {
									model: 'displayedTimeSpanUnit',
									type: 'select',
									fill: true,
									options: {
										items: timeSpanUnitOptions,
										valueMember: 'value',
										displayMember: 'text',
										modelIsObject: false
									},
									tooltip: $translate.instant('scheduling.main.simulatedGantt.unit')
								}]
							}, {
								gid: 'default',
								label$tr$: 'scheduling.main.simulatedGantt.onlyWithModel',
								type: 'boolean',
								visible: true,
								sortOrder: 200,
								model: 'onlyWithModelObjects',
								readonly: !selectedModelId
							}
						]
					}
				};

				platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dialogConfig).then(function(result) {
					if (result.ok) {
						delete result.data.__rt$data;

						if (!selectedModelId) {
							result.data.onlyWithModelObjects = !!config.onlyWithModelObjects;
						}

						return result;
					} else {
						return {
							ok: false
						};
					}
				});
			};

			return service;
		}]);
})();