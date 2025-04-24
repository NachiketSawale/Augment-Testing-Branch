/**
 * Created by leo on 18.03.2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name projectCalendarWizardService
	 * @description
	 *
	 *
	 */
	angular.module('project.calendar').service('projectCalendarWizardService', ProjectCalendarWizardService);
	ProjectCalendarWizardService.$inject = ['_', 'projectCalendarCalendarDataService', '$translate', 'platformModalService',
		'projectCalendarConstantValues', '$http', 'platformSidebarWizardCommonTasksService',
		'platformTranslateService', 'platformModalFormConfigService', 'moment', 'platformRuntimeDataService', '$injector'];
	function ProjectCalendarWizardService(_, projectCalendarCalendarDataService, $translate, platformModalService,
		projectCalendarConstantValues, $http, platformSidebarWizardCommonTasksService,
		platformTranslateService, platformModalFormConfigService, moment, platformRuntimeDataService, $injector) {

		this.calendarUpdate = function calendarUpdate() {
			var selectedItem = projectCalendarCalendarDataService.getSelected();
			var headerText = $translate.instant('project.calendar.wizardUpdateProjectCalendar');
			if (!selectedItem) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection(headerText);
			} else if (selectedItem.CalendarSourceFk) {

				var updateProjectCalendarConfig = {
					title: headerText,
					dataItem: {
						updateKindBase: 'notavailable',
						updateKindSubdata: 'notavailable'
					},
					formConfiguration: {
						fid: 'project.calendar.updateProjectCalendar',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							},
							{
								gid: 'other'
							}
						],
						rows: [{
							gid: 'baseGroup',
							rid: 'baseGroup',
							label: 'Update base data',
							label$tr$: 'project.calendar.updateBase',
							type: 'radio',
							model: 'updateKindBase',
							options: {
								valueMember: 'value',
								labelMember: 'label',
								groupName: 'base',
								items: [{
									value: 'overwrite',
									label$tr$: 'project.calendar.wizardUpdateOverwrite'
								}, {
									value: 'notavailable',
									label$tr$: 'project.calendar.wizardUpdateNotAvailable'
								}]
							},
							sortOrder: 1
						},
						{
							gid: 'other',
							rid: 'other',
							label: 'Update base data',
							label$tr$: 'project.calendar.wizardUpdateSubdata',
							type: 'radio',
							model: 'updateKindSubdata',
							options: {
								valueMember: 'value',
								labelMember: 'label',
								groupName: 'other',
								items: [{
									value: 'overwrite',
									label$tr$: 'project.calendar.wizardUpdateOverwrite'
								}, {
									value: 'notavailable',
									label$tr$: 'project.calendar.wizardUpdateNotAvailable'
								}]
							},
							sortOrder: 2
						}]
					},
					handleOK: function handleOK(result) {
						var command = {
							Action: 6,
							Calendar: {Id: selectedItem.CalendarFk},
							CalendarSourceId: selectedItem.CalendarSourceFk,
							OverwriteBaseData: updateProjectCalendarConfig.dataItem.updateKindBase === 'overwrite',
							OverwriteSubData: updateProjectCalendarConfig.dataItem.updateKindSubdata === 'overwrite'
						};
						if (result.ok === true) {
							$http.post(globals.webApiBaseUrl + 'scheduling/calendar/execute', command).then(function () {
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(headerText);
								projectCalendarCalendarDataService.startSubEntityLoad(selectedItem);
							},
							function (/* error */) {
								// Error MessageText
								var modalOptions = {
									headerText: headerText,
									bodyText: $translate.instant('project.calendar.errorMsgUpdateProjectCalendar'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
							});
						}
					}
				};

				// Show Dialog
				platformTranslateService.translateFormConfig(updateProjectCalendarConfig.formConfiguration);
				platformModalFormConfigService.showDialog(updateProjectCalendarConfig);
			} else {
				var modalOptions = {
					headerText: headerText,
					bodyText: $translate.instant('project.calendar.errorMsgProjectCalendarIsEnterprise'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		this.changeCalendarType = function changeCalendarType() {
			var selectedItem = projectCalendarCalendarDataService.getSelected();
			var headerText = $translate.instant('project.calendar.wizardChangeCalendarType');
			if (selectedItem && selectedItem.CalendarTypeFk && selectedItem.CalendarTypeFk === projectCalendarConstantValues.calendar.type.enterprise) {
				projectCalendarCalendarDataService.createProjectCalendar(selectedItem.CalendarFk, selectedItem, headerText);
			}
			else {
				var text = selectedItem ? $translate.instant('project.calendar.wizardErrMsgNoEnterpriseCal') : $translate.instant('cloud.common.noCurrentSelection');
				var modalOptions = {
					headerText: headerText,
					bodyText: text,
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		function getDataServiceForCalendar(){
			var infoService = $injector.get('projectCalendarContainerInformationService');
			var config = infoService.getContainerInfoByGuid('f3d6a5449d10497d9a09fbb7807260fb');
			var dataservice = null;
			if (config && config.dataServiceName){
				dataservice = config.dataServiceName;
			}
			return dataservice;
		}

		function getDataServiceForExceptions(){
			var containerUid = 'b2c819756aac47e5ab1df2ac1c60cf99';
			var infoService = $injector.get('projectCalendarContainerInformationService');
			var dataservice = null;
			if (!infoService.hasDynamic(containerUid)) {
				var projectCalendarForProjectSubContainerService = $injector.get('projectCalendarForProjectSubContainerService');
				dataservice = projectCalendarForProjectSubContainerService.getDataServiceByUid(containerUid, true);
			} else {
				var config = infoService.getContainerInfoByGuid('b2c819756aac47e5ab1df2ac1c60cf99');
				if (config && config.dataServiceName) {
					dataservice = config.dataServiceName;
				}
			}
			return dataservice;
		}

		function getSelectedCalendar(){
			var selected = null;
			var dataService = getDataServiceForCalendar();
			if (dataService) {
				selected = dataService.getSelected();
			}
			return selected;
		}

		function getSelectedCalendars(){
			var selectedEntities = null;
			var dataService = getDataServiceForCalendar();
			if (dataService) {
				selectedEntities = dataService.getSelectedEntities();
			}
			return selectedEntities;
		}

		function isCalendarTypeProjectCalendar(selected){
			var result = false;
			if (selected && selected.Id && selected.CalendarTypeFk !== projectCalendarConstantValues.calendar.type.enterprise) {
				result = true;
			}
			return result;
		}

		var provideDisableCalendar;
		provideDisableCalendar = function provideDisableCalendar() {
			var dataService = getDataServiceForCalendar();
			return platformSidebarWizardCommonTasksService.provideDisableInstance(dataService, 'Disable Project Calendar', 'project.calendar.disableProjectCalendarTitle', 'Code',
				'scheduling.calendar.disableCalendarDone', 'scheduling.calendar.calendarAlreadyDisabled', 'cal', 11, 1);
		};

		this.disableCalendar = function disableCalendar(){
			var selected = getSelectedCalendar();
			var modalOptions = {
				headerText: $translate.instant('project.main.disableProjectCalendarTitle'),
				bodyText: '',
				iconClass: 'ico-info'
			};
			var ids = [];
			if (isCalendarTypeProjectCalendar(selected)) {
				ids = [selected.Id];
			}
			if (ids.length <= 0) {
				modalOptions.bodyText = selected && selected.Id ? $translate.instant('project.calendar.errorMsgGeneralProjectCalendarIsEnterprise') : $translate.instant('cloud.common.noCurrentSelection');
				return platformModalService.showDialog(modalOptions);
			}

			$http.post(globals.webApiBaseUrl + 'scheduling/calendar/getcalendarusedincompany', ids).then(function (response) {
				if (response) {
					if(!response.data) {
						provideDisableCalendar().fn();
					} else {
						modalOptions.bodyText = $translate.instant('scheduling.calendar.errorDisableCalendar');
						// modalOptions.bodyText = ids.length === 1 ? $translate.instant('scheduling.calendar.errorDisableCalendar') : $translate.instant('scheduling.calendar.errorDisableCalendars');
						platformModalService.showDialog(modalOptions);
					}
				}
			});
		};

		var provideEnableCalendar;
		provideEnableCalendar = function provideEnableCalendar() {
			var dataService = getDataServiceForCalendar();
			return platformSidebarWizardCommonTasksService.provideEnableInstance(dataService, 'Enable Project Calendar', 'project.calendar.enableProjectCalendarTitle', 'Code',
				'scheduling.calendar.enableCalendarDone', 'scheduling.calendar.calendarAlreadyEnabled', 'cal', 12, 1);
		};

		this.enableCalendar = function enableCalendar() {
			var selected = getSelectedCalendar();
			var modalOptions = {
				headerText: $translate.instant('project.main.disableProjectCalendarTitle'),
				bodyText: '',
				iconClass: 'ico-info'
			};
			if (isCalendarTypeProjectCalendar(selected)) {
				provideEnableCalendar().fn();
			} else {
				modalOptions.bodyText = selected && selected.Id ? $translate.instant('project.calendar.errorMsgGeneralProjectCalendarIsEnterprise') : $translate.instant('cloud.common.noCurrentSelection');
				return platformModalService.showDialog(modalOptions);
			}
		};

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

		this.createExceptionDays = function createExceptionDays(options) {
			var key;
			// var dataService = getDataServiceForCalendar();
			var selected = getSelectedCalendar();
			if (isCalendarTypeProjectCalendar(selected)) {
				var selection = getSelectedCalendars();
				var action = parseInt(options.Type);
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
					title: $translate.instant(key),
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
							CalendarFk: selected.Id,
							ExceptDate: nowDate,
							WorkStart: null,
							WorkEnd: null,
							IsWorkday: false,
							IsShownInChart: false,
							Calendar: selected.Code
						},
						Calendars: getListOfSelection(selection)
					},
					formConfiguration: {
						fid: 'project.calendar.DescriptionInfoModal',
						version: '0.0.1',
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
						var execService = getDataServiceForExceptions();
						var processors = execService.getDataProcessor();
						var newObject = _.clone(result.data);
						delete newObject.__rt$data;
						_.forEach(processors, function (processor) {
							if (processor.revertProcessItem) {
								processor.revertProcessItem(newObject.ExceptionDay);
							}
						});
						newObject.StartDate = newObject.StartDate.format();
						newObject.Calendars = selection;
						$http.post(globals.webApiBaseUrl + 'scheduling/calendar/execute', newObject).then(function (response) {
							// Load successful
							if (response && response.data.ExceptionDaysToSave) {
								processors = execService.getDataProcessor();
								_.forEach(response.data.ExceptionDaysToSave, function (item) {
									_.forEach(processors, function (processor) {
										processor.processItem(item);
									});
								});
								var list = execService.getList();
								var selectedId = selected.Id;
								angular.forEach(response.data.ExceptionDaysToSave, function (item) {
									if(item.CalendarFk === selectedId) {
										list.push(item);
									}
									execService.markItemAsModified(item);
								});
								execService.fireListLoaded();
								// serviceContainer.data.listLoaded.fire();
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
					bodyText: selected && selected.Id ? $translate.instant('project.calendar.errorMsgGeneralProjectCalendarIsEnterprise') : $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};
	}
})(angular);
