/**
 * Created by leo on 17.08.2015.
 */
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'scheduling.main';
	let mainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name schedulingCalendarExceptionDayService
	 * @function
	 *
	 * @description
	 * schedulingCalendar is the data service for all exception day related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	mainModule.factory('schedulingMainBaselineService', ['schedulingMainService', 'platformDataServiceFactory',
		function (schedulingMainService, platformDataServiceFactory) {

			var selectedSchedule = null;

			var exceptServiceOption = {
				module: mainModule,
				serviceName: 'schedulingMainBaselineService',
				entityNameTranslationID: 'scheduling.main.baseline',
				httpRead: {
					route: globals.webApiBaseUrl + 'scheduling/main/baseline/',
					endRead: 'listbyschedule',
					usePostForRead: true,
					initReadData: function (readdata) {
						readdata.filter = [];
						if (selectedSchedule && selectedSchedule.Id) {
							readdata.filter.push(selectedSchedule.Id);
						}
						return readdata;
					}
				},
				presenter: {
					list: {}
				},
				entitySelection: {}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);
			var service = serviceContainer.service;

			function clearList() {
				serviceContainer.data.itemList.length = 0;
			}

			// schedule service calls
			service.setSelectedSchedule = function setSelectedSchedule(schedule) {
				selectedSchedule = schedule;

				if (selectedSchedule && selectedSchedule.Id) {
					serviceContainer.service.load();
				} else {
					clearList();
				}
			};

			service.getSelectedSchedule = function getSelectedSchedule() {
				return selectedSchedule;
			};

			function updateBaselineList() {
				service.setSelectedSchedule(schedulingMainService.getSelectedSchedule());
			}

			service.register = function register() {
				schedulingMainService.selectedScheduleChanged.register(updateBaselineList);
			};

			service.unRegister = function unRegister() {
				schedulingMainService.selectedScheduleChanged.unregister(updateBaselineList);
			};

			service.assertIsLoaded = function assertIsLoaded() {
				if (selectedSchedule && selectedSchedule.Id) {
					serviceContainer.service.load();
				}
			};

			return serviceContainer.service;
		}
	]);
})
();
