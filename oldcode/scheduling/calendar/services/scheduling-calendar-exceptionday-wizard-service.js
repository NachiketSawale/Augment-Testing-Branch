/**
 * Created by leo on 23.02.2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name schedulingCalendarExceptiondayWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.calendar').factory('schedulingCalendarExceptiondayWizardService',
		['$rootScope', '$timeout', '$translate', '$http', '_', 'moment', '$injector', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'schedulingCalendarMainService', 'platformRuntimeDataService',
			function ($rootScope, $timeout, $translate, $http, _, moment, $injector, platformTranslateService, platformModalService, platformModalFormConfigService, basicsLookupdataConfigGenerator, schedulingCalendarMainService, platformRuntimeDataService) {

				var serviceContainer = {data: {}, service: {}};
				var workStart = moment().hour(8);
				workStart.minute(0);
				workStart.seconds(0);
				workStart.millisecond(0);
				var workEnd = moment().hour(17);
				workEnd.minute(0);
				workEnd.seconds(0);
				workEnd.millisecond(0);

				function setWorkStartEndReadOnly(entity) {
					var fields = null;
					fields = [
						{
							field: 'ExceptionDay.WorkStart',
							readonly: true
						},
						{
							field: 'ExceptionDay.WorkEnd',
							readonly: true
						}
					];
					entity.ExceptionDay.WorkStart = null;
					entity.ExceptionDay.WorkEnd = null;
					platformRuntimeDataService.readonly(entity, fields);
				}


				function validateEndDate(entity, value) {
					entity.StartDate.hour(0);
					entity.StartDate.minute(0);
					entity.StartDate.seconds(0);
					entity.StartDate.millisecond(0);
					value.hour(0);
					value.minute(0);
					value.seconds(0);
					value.millisecond(0);
					if (entity.StartDate < value) {
						entity.NumberOf = _.round(moment.duration(value.diff(entity.StartDate)).asDays(), 0) + 1;
						$injector.get('$timeout')(function () {
							$injector.get('$rootScope').$digest();
						}, 0);
					} else {
						var oldDate = entity.EndDate;

						$injector.get('$timeout')(function () {
							entity.EndDate = oldDate;
						}, 0);
					}
				}

				function validateNumberOf(entity, value) {
					switch (entity.Action) {
						case 1:
							entity.EndDate = moment(entity.StartDate);
							if (value !== 0) {
								entity.EndDate.add('days', value - 1);
							} else {
								entity.EndDate.add('days', value);
							}
							break;
						case 2:
							entity.EndDate = null;
							break;
					}
				}

				function validateIsWorkday(entity, value) {
					var fields = null;

					if (value === true) {
						fields = [
							{
								field: 'ExceptionDay.WorkStart',
								readonly: false
							},
							{
								field: 'ExceptionDay.WorkEnd',
								readonly: false
							}
						];
						entity.ExceptionDay.WorkStart = workStart;
						entity.ExceptionDay.WorkEnd = workEnd;
						platformRuntimeDataService.readonly(entity, fields);
						// service.markItemAsModified(entity);
					} else {
						fields = [
							{
								field: 'ExceptionDay.WorkStart',
								readonly: true
							},
							{
								field: 'ExceptionDay.WorkEnd',
								readonly: true
							}
						];
						entity.ExceptionDay.WorkStart = null;
						entity.ExceptionDay.WorkEnd = null;
						platformRuntimeDataService.readonly(entity, fields);
						// service.markItemAsModified(entity);
					}
				}

				function getListOfSelection(selection){
					var selectionAsList = '';
					if(selection && angular.isArray(selection)){
						angular.forEach(selection, function(sel){
							selectionAsList += selectionAsList.length>0 ? ', ' + sel.Code : sel.Code;
						});
					}
					else if (selection){
						selectionAsList = selection.Code;
					}
					return selectionAsList;
				}

				serviceContainer.service.createExceptionDays = function createExceptionDays(options) {
					var key;
					if (schedulingCalendarMainService.getSelected() && schedulingCalendarMainService.getSelected().Id) {
						var selection = schedulingCalendarMainService.getSelectedEntities();
						var action = parseInt(options.Typ);
						switch (action) {
							case 1:
								key = 'scheduling.calendar.createVacation';
								break;
							case 2:
								key = 'scheduling.calendar.createBankHoliday';
								break;
							case 3:
								key = 'scheduling.calendar.recurExceptionday';
								break;
						}
						var nowDate = moment.utc();
						var modalCreateCalendarConfig = {
							title: key,
							dataItem: {
								Action: action,
								StartDate: nowDate,
								EndDate: null,
								NumberOf: 1,
								ExceptionDay: {
									Id: -1,
									BackgroundColor: 16777215,
									FontColor: 3355443,
									CommentText: '',
									CalendarFk: schedulingCalendarMainService.getSelected().Id,
									ExceptDate: nowDate,
									WorkStart: null,
									WorkEnd: null,
									IsWorkday: false,
									IsShownInChart: false,
									Calendar: schedulingCalendarMainService.getSelected().Code
								},
								Calendars: getListOfSelection(selection)
							},
							formConfiguration: {
								fid: 'scheduling.calendar.DescriptionInfoModal',
								version: '0.2.4',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['StartDate', 'EndDate', 'NumberOf', 'ExceptionDay.DescriptionInfo', 'ExceptionDay.CommentText', 'Calendars', 'ExceptionDay.BackgroundColorRed', 'ExceptionDay.BackgroundColorGreen', 'ExceptionDay.BackgroundColorBlue', 'ExceptionDay.FontColorRed', 'ExceptionDay.FontColorGreen', 'ExceptionDay.FontColorBlue', 'ExceptionDay.IsWorkday', 'ExceptionDay.BackgroundColor', 'ExceptionDay.FontColor', 'ExceptionDay.WorkStart', 'ExceptionDay.IsShownInChart', 'ExceptionDay.WorkEnd']
									}
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'Calendar',
										model: 'Calendars',
										label$tr$: 'cloud.common.entityCalCalendarFk',
										type: 'code',
										sortOrder: 1,
										readonly: true
									},
									{
										gid: 'baseGroup',
										rid: 'StartDate',
										model: 'StartDate',
										label$tr$: 'cloud.common.entityStartDate',
										type: 'dateutc',
										sortOrder: 2
									},
									{
										gid: 'baseGroup',
										rid: 'EndDate',
										model: 'EndDate',
										label$tr$: 'cloud.common.entityEndDate',
										type: 'dateutc',
										sortOrder: 3,
										validator: validateEndDate
									},
									{
										gid: 'baseGroup',
										rid: 'NumberOf',
										model: 'NumberOf',
										label$tr$: 'scheduling.calendar.entityNumberOf',
										type: 'integer',
										sortOrder: 4,
										validator: validateNumberOf
									},
									{
										gid: 'baseGroup',
										rid: 'DescriptionInfo',
										model: 'ExceptionDay.DescriptionInfo',
										label$tr$: 'cloud.common.entityDescription',
										type: 'translation',
										sortOrder: 5
									},
									{
										gid: 'baseGroup',
										rid: 'CommentText',
										model: 'ExceptionDay.CommentText',
										label$tr$: 'cloud.common.entityCommentText',
										type: 'comment',
										sortOrder: 6
									},
									{
										gid: 'baseGroup',
										rid: 'BackgroundColor',
										model: 'ExceptionDay.BackgroundColor',
										label$tr$: 'scheduling.calendar.entityBackgroundColor',
										type: 'color',
										sortOrder: 7
									},
									{
										gid: 'baseGroup',
										rid: 'FontColor',
										model: 'ExceptionDay.FontColor',
										label$tr$: 'scheduling.calendar.entityFontColor',
										type: 'color',
										sortOrder: 8
									},
									{
										gid: 'baseGroup',
										rid: 'IsShownInChart',
										model: 'ExceptionDay.IsShownInChart',
										label$tr$: 'scheduling.calendar.entityIsShownInChart',
										type: 'boolean',
										sortOrder: 9
									},
									{
										gid: 'baseGroup',
										rid: 'IsWorkday',
										model: 'ExceptionDay.IsWorkday',
										label$tr$: 'scheduling.calendar.translationDescWorkday',
										type: 'boolean',
										sortOrder: 10,
										validator: validateIsWorkday
									},
									{
										gid: 'baseGroup',
										rid: 'WorkStart',
										model: 'ExceptionDay.WorkStart',
										label$tr$: 'scheduling.calendar.entityWorkStart',
										type: 'time',
										sortOrder: 11
									},
									{
										gid: 'baseGroup',
										rid: 'WorkEnd',
										model: 'ExceptionDay.WorkEnd',
										label$tr$: 'scheduling.calendar.entityWorkEnd',
										type: 'time',
										sortOrder: 12
									}
								]
							},

							handleOK: function handleOK(result) {
								var execService = $injector.get('schedulingCalendarExceptionDayService');
								var processors = execService.getUsedExceptionDayDataProcessors();
								var newObject = _.clone(result.data);
								delete newObject.__rt$data;
								_.forEach(processors, function (processor) {
									if (processor.revertProcessItem) {
										processor.revertProcessItem(newObject.ExceptionDay);
									}
								});
								newObject.StartDate = newObject.StartDate.format();
								newObject.Calendars = selection;
								$http.post(globals.webApiBaseUrl + 'scheduling/calendar/execute', newObject)
									.then(function (response) {
										// Load successful
										if (response && response.data.ExceptionDaysToSave) {
											processors = execService.getUsedExceptionDayDataProcessors();
											_.forEach(response.data.ExceptionDaysToSave, function (item) {
												_.forEach(processors, function (processor) {
													processor.processItem(item);
												});
											});
											execService.addItems(response.data.ExceptionDaysToSave);
										}
									},
									function (/* error */) {
									});
							}
						};

						setWorkStartEndReadOnly(modalCreateCalendarConfig.dataItem);

						// Show Dialog
						if (action === 2 || action === 3) {
							modalCreateCalendarConfig.formConfiguration.rows.splice(2, 1);
						}
						platformTranslateService.translateFormConfig(modalCreateCalendarConfig.formConfiguration);
						platformModalFormConfigService.showDialog(modalCreateCalendarConfig);
					} else {
						// Error MessageText
						var modalOptions = {
							headerText: key,
							bodyText: $translate.instant('cloud.common.noCurrentSelection'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				};

				return serviceContainer.service;
			}
		]);
})(angular);
