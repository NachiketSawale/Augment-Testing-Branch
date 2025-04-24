/**
 * Created by janas on 07.07.2016.
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('controllingStructureCreateActivitiesWizardService',
		['globals', '_', '$q', '$http', '$translate', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'basicsLookupdataLookupDescriptorService', 'controllingStructureMainService', 'schedulingMainService', 'platformSidebarWizardConfigService', 'platformModalFormConfigService',
			function (globals, _, $q, $http, $translate, platformTranslateService, platformSidebarWizardCommonTasksService, basicsLookupdataLookupDescriptorService, controllingStructureMainService, schedulingMainService, platformSidebarWizardConfigService, platformModalFormConfigService) {

				var service = {},
					scheduleList = [];

				service.getScheduleList = function getScheduleList(prjId) {
					var deferred = $q.defer();

					$http.get(globals.webApiBaseUrl + 'scheduling/schedule/list?mainItemID=' + prjId).then(function (response) {
						scheduleList = response.data;
						basicsLookupdataLookupDescriptorService.updateData('schedule', scheduleList);
						deferred.resolve(scheduleList);
					}
					);
					return deferred.promise;
				};

				service.createActivities = function createActivities() {
					var controlUnits = controllingStructureMainService.getSelected();
					var title = 'controlling.structure.createActivities';
					var msg = $translate.instant('controlling.structure.noCurrentCUnitSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(controlUnits, title, msg)) {
						var prjId = controlUnits.ProjectFk;
						var schedules = [];
						var dataItem = {
							description: '',
							remark: '',
							cuCode: controlUnits.Code
						};

						var modalCreateBaselineConfig = {
							title: $translate.instant(title),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'controlling.structure.createActivities',
								version: '0.2.4',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['setAlternativeActive']
									}
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'description',
										label$tr$: 'controlling.structure.selectedSchedule',
										type: 'select',
										options: {
											items: schedules,
											valueMember: 'Id',
											displayMember: 'Description',
											inputDomain: 'description',
											modelIsObject: true,
											controlParser: function (viewValue) {
												return viewValue.Description;
											}
										},
										model: 'Id',
										sortOrder: 1
									}
								]
							},
							dialogOptions: {
								disableOkButton: function disableOkButton() {
									return !_.isObject(dataItem.Id);
								}
							},
							handleOK: function handleOK(result) {
								if (_.get(result, 'data.Id.Id') > 0) { // schedule selected?
									var action = {
										Action: 9,
										EffectedItemId: controlUnits.Id,
										ScheduleId: result.data.Id.Id // description because input select needs string domain type
									};

									$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
									).then(function (response) {
										schedulingMainService.baselineCreated.fire(response.data);
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
									});
								}
							}
						};

						platformTranslateService.translateFormConfig(modalCreateBaselineConfig.formConfiguration);

						service.getScheduleList(prjId).then(function (scheduleList) {
							_.forEach(scheduleList, function (schedule) {

								var smallSchedule = {
									Id: schedule.Id,
									Description: schedule.DescriptionInfo.Description
								};

								schedules.push(smallSchedule);
							});
							modalCreateBaselineConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
							platformModalFormConfigService.showDialog(modalCreateBaselineConfig);
						});

					}
				};

				return service;

			}]);
})();
