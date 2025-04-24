/**
 * Created by leo on 23.02.2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name schedulingCalendarWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.calendar').factory('schedulingCalendarSidebarWizardService',
		['_', 'platformSidebarWizardConfigService', 'schedulingCalendarMainService', 'platformSidebarWizardCommonTasksService',
			'schedulingCalendarExceptiondayWizardService', '$http', '$translate', 'platformDialogService','platformLongTextDialogService',
			function (_, platformSidebarWizardConfigService, schedulingCalendarMainService, platformSidebarWizardCommonTasksService, schedulingCalendarExceptiondayWizardService, $http, $translate, platformModalService, platformLongTextDialogService) {

				let service = {};

				let provideDisableCalendar;
				provideDisableCalendar = function provideDisableCalendar() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(schedulingCalendarMainService, 'Disable Calendar', 'scheduling.calendar.disableCalendarTitle', 'Code',
						'scheduling.calendar.disableCalendarDone', 'scheduling.calendar.calendarAlreadyDisabled', 'cal', 11, 1);
				};

				service.disableCalendar = function disableCalendar(){
					let selected = schedulingCalendarMainService.getSelected();
					let selectedEntities = schedulingCalendarMainService.getSelectedEntities();
					let modalOptions = {
						headerText: $translate.instant('scheduling.calendar.disableCalendarTitle'),
						bodyText: '',
						iconClass: 'ico-info'
					};
					let ids = [];
					if (selectedEntities && selectedEntities.length >= 2) {
						ids =_.map(selectedEntities, 'Id');
					} else if (selected && selected.Id) {
						ids = [selected.Id];
					}
					else {
						modalOptions.bodyText = $translate.instant('cloud.common.noCurrentSelection');
						return platformModalService.showDialog(modalOptions);
					}

					$http.post(globals.webApiBaseUrl + 'scheduling/calendar/getcalendarusedincompany', ids).then(function (response) {
						if (response) {
							if(!response.data) {
								provideDisableCalendar().fn();
							} else {
								if(ids.length === 1){
									modalOptions.bodyText = $translate.instant('scheduling.calendar.errorDisableCalendar');
								} else {
									let selection =_.filter(selectedEntities, function(entity){
										return _.some(response.data, function(data){return data === entity.Id;});
									});
									let param ={cal: ''};
									angular.forEach(selection, function(sel){
										param.cal +=  param.cal.length > 0 ? ', ' + sel.Code : sel.Code;
									});
									modalOptions.bodyText = $translate.instant('scheduling.calendar.errorDisableCalendars', param);
								}
								// modalOptions.bodyText = ids.length === 1 ? $translate.instant('scheduling.calendar.errorDisableCalendar') : $translate.instant('scheduling.calendar.errorDisableCalendars');
								platformModalService.showDialog(modalOptions);
							}
						}
					});
				};

				let enableCalendar;
				enableCalendar = function enableCalendar() {
					return platformSidebarWizardCommonTasksService.provideEnableInstance(schedulingCalendarMainService, 'Enable Calendar', 'scheduling.calendar.enableCalendarTitle', 'Code',
						'scheduling.calendar.enableCalendarDone', 'scheduling.calendar.calendarAlreadyEnabled', 'cal', 12, 1);
				};
				service.enableCalendar = enableCalendar().fn;

				function DataSource(text) {
					platformLongTextDialogService.LongTextDataSource.call(this);
					this.current = text;
				}

				function showDialog(text) {
					let ds = new DataSource(text);

					let dlgConfig = {
						headerText$tr$: 'scheduling.calendar.deleteCalendarTitle',
						hidePager: true,
						dataSource: ds
					};

					return platformLongTextDialogService.showDialog(dlgConfig);
				}
				service.deleteCalendar = function deleteCalendar(){
					let selectedEntities = schedulingCalendarMainService.getSelectedEntities();
					let modalOptions = {
						headerText: $translate.instant('scheduling.calendar.deleteCalendarTitle'),
						bodyText: '',
						iconClass: 'ico-info'
					};
					if (!selectedEntities || selectedEntities.length <= 0) {
						modalOptions.bodyText = $translate.instant('cloud.common.noCurrentSelection');
						return platformModalService.showDialog(modalOptions);
					}

					$http.post(globals.webApiBaseUrl + 'scheduling/calendar/deletecalendar', selectedEntities).then(function (response) {
						if (!response) {
							return;
						}
						let bodyText = '';
						_.forEach(response.data, function (item) {
							bodyText += item + '<br/>';
						});
						schedulingCalendarMainService.refresh();
						showDialog(bodyText);
					});
				};
				return service;
			}
		]);
})(angular);
