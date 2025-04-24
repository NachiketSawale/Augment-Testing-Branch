/**
 * Created by wwa on 1/21/2016.
 */
(function (angular) {
	/* global globals,_ */
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardUpdateSchedulingService',
		['$q', '$http', 'procurementPackageDataService', 'platformModalService', 'procurementPackageEventService', 'basicsLookupdataLookupDescriptorService',
			'procurementModuleName', 'bascisCommonClerkDataServiceFactory',
			function ($q, $http, packageDataService, platformModalService, packageEventService, lookupDescriptorService,
				procurementModuleName, bascisCommonClerkDataServiceFactory) {

				var service = {}, self = this;

				self.handleOk = function (result) {
					if (result) {
						var option = {
							moduleName: procurementModuleName.packageModule,
							leadingService: packageDataService
						};
						var eventService = packageEventService.getProcurementEventService(option);
						eventService.loadSubItemList();
					}
				};

				service.updateScheduleInfo = function (item) {
					lookupDescriptorService.updateData('scheduleInfo', [item]);
					return item.Code;
				};

				service.getScheduleInfo = function () {
					var headerItem = packageDataService.getSelected();
					var scheduleInfo = _.find(lookupDescriptorService.getData('scheduleInfo'), {ProjectFk: headerItem.ProjectFk});
					if (scheduleInfo) {
						return $q.when(scheduleInfo);
					} else {
						var url = globals.webApiBaseUrl + 'procurement/package/wizard/getscheduleinfo';
						var parmas = headerItem ? headerItem.ProjectFk : -1;
						return $http.get(url + '?ProjectFk=' + parmas).then(function (item) {
							if (item.data) {
								lookupDescriptorService.updateData('scheduleInfo', [item.data]);
							}
							return item.data;
						});
					}

				};

				service.updateSchedule = function (executeParams) {
					return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/updatescheduling', executeParams);
				};

				service.updateEventsFormScheduling = function updateEventsFormScheduling(executeParams) {
					return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/updateschedulingevent', executeParams);
				};

				service.getProjectInfo = function (projectId) {
					var projectItem = _.find(lookupDescriptorService.getData('project'), {Id: projectId});
					if (projectItem) {
						return projectItem.ProjectNo + '-' + projectItem.ProjectName;
					}
				};

				service.execute = function () {
					var selected = packageDataService.getSelected();
					if (!selected || !selected.Id) {
						return;
					}

					var modalOptions = {
						PackageFk: selected.Id,
						ProjectFk: selected.ProjectFk,
						ActivityFk: selected.ActivityFk,
						ScheduleFk: selected.ScheduleFk,
						headerTextKey: 'procurement.package.wizard.updateScheduling.caption',
						scheduleInfo: '',
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/update-scheduling-wizard-partial.html',
						iconClass: 'ico-info',
						showCancelButton: true
					};
					service.getScheduleInfo().then(function (item) {
						modalOptions.scheduleInfo = '';
						if (item) {
							modalOptions.scheduleInfo = item.Code;
						}
						platformModalService.showDialog(modalOptions).then(function (result) {
							self.handleOk(result);
						}).then(function () {
							/* if(selected.ScheduleFk){
								//copy clerk to sechedule clerk
								//self.addClerkToSechedule(selected);
							} */
						});
					});
				};
				var clerkService = bascisCommonClerkDataServiceFactory.getService('procurement.package.clerk', 'procurementPackageDataService', null, true);
				self.addClerkToSechedule = function (selected) {
					var items = clerkService.getList();
					if (items.length > 0) {
						var copyData = _.filter(items, function (item) {
							return item.ClerkFk === selected.ClerkPrcFk || item.ClerkFk === selected.ClerkReqFk;
						});
						if (copyData.length > 0) {
							_.forEach(copyData, function (item) {
								item.Remark = item.CommentText;
							});
							if (selected.ActivityFk) {
								$http.post(globals.webApiBaseUrl + 'scheduling/main/clerk/copy?toItem=' + selected.ActivityFk, copyData);
							}/* else{
								//nee add multiterm role
							} */

						}
					}
				};

				return service;
			}]);
})(angular);
