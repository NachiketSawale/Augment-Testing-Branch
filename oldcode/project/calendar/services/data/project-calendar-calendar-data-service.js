/*
 * $Id: project-calendar-calendar-data-service.js 535284 2019-02-27 06:26:30Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var projectCalendarModule = angular.module('project.calendar');

	/**
	 * @ngdoc service
	 * @name projectCalendarCalendarDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectCalendarModule.factory('projectCalendarCalendarDataService', ['_', 'platformDataServiceFactory', 'platformModalService',
		'projectMainService', '$translate', '$http', 'platformTranslateService', 'platformModalFormConfigService',
		'projectCalendarConstantValues', 'platformPermissionService', 'permissions', 'basicsLookupdataLookupDescriptorService',
		function (_, platformDataServiceFactory, platformModalService, projectMainService, $translate,
			$http, platformTranslateService, platformModalFormConfigService, projectCalendarConstantValues,
			platformPermissionService, permissions, basicsLookupdataLookupDescriptorService) {

			var readOnlyFlag = false;
			var serviceOptions = {
				flatNodeItem: {
					module: projectCalendarModule,
					serviceName: 'projectCalendarCalendarDataService',
					entityNameTranslationID: 'project.calendar.calendarEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'project/calendar/', // adapt to web API controller
						usePostForRead: true,
						endRead: 'listbyproject',
						initReadData: function (readData) {
							var sel = projectMainService.getSelected();
							if (sel) {
								readData.PKey1 = sel.Id;
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'ProjectCalendar',
							parentService: projectMainService
						}
					},
					actions: {
						create: 'flat',
						delete: true
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = projectMainService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.PKey1 = selectedItem.Id;
								}
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var service = serviceContainer.service;
			var baseCreateItem = service.createItem;
			service.createItem = function createProjectCalendar(creationOptions) {
				var selectedItem = projectMainService.getSelected();
				var headerText = $translate.instant('project.calendar.createProjectCalendar');
				var createProjectCalendarConfig = {
					title: headerText,
					dataItem: {
						calendarFk: null,
						asProject: true,
						projectId: selectedItem.Id
					},
					formConfiguration: {
						fid: 'project.calendar.createProjectCalendar',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['calendarFk']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'calendarFk',
								model: 'calendarFk',
								label$tr$: 'project.calendar.calendarEntityName',
								sortOrder: 1,
								type: 'directive',
								directive: 'scheduling-calendar-filter-lookup',
								options: {
									showClearButton: true,
									defaultFilter: {calendarType: 'enterprise', 'projectId': 'projectId'},
									showFilteredData: true,
									filterOnLoadFn: function(item){
										return item.CalendarTypeFk !== projectCalendarConstantValues.calendar.type.edays;
									},
									version: 3
								}
							},{
								gid: 'baseGroup',
								rid: 'asProject',
								model: 'asProject',
								label$tr$: 'project.calendar.asProject',
								type: 'boolean',
								sortOrder: 2
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result.ok === true) {
							// validate entries
							if (!createProjectCalendarConfig.dataItem.asProject) {
								var modalOptions = {
									headerText: headerText,
									bodyText: $translate.instant('project.calendar.errorMsgPrjCalendarExist'),
									iconClass: 'ico-info'
								};
								var items = _.find(service.getList(), function (item) {
									return item.CalendarFk === createProjectCalendarConfig.dataItem.calendarFk;
								});
								if(items){
									platformModalService.showDialog(modalOptions);
								} else {
									// todo async Validate
									$http.get(globals.webApiBaseUrl + 'project/calendar/isunique?calendarId=' +
													createProjectCalendarConfig.dataItem.calendarFk + '&projectId=' + selectedItem.Id)
										.then(function (response) {
											if (response.data) {
												baseCreateItem(creationOptions).then(function (response) {
													var newItem = _.cloneDeep(response);
													response.CalendarFk = createProjectCalendarConfig.dataItem.calendarFk;
													response.CalendarTypeFk = projectCalendarConstantValues.calendar.type.enterprise;
													serviceContainer.data.mergeItemAfterSuccessfullUpdate(newItem, response, true, serviceContainer.data);
												});
											} else {
												platformModalService.showDialog(modalOptions);
											}
										});
								}
							} else {
								baseCreateItem(creationOptions).then(function (response) {
									if (response) {
										service.createProjectCalendar(createProjectCalendarConfig.dataItem.calendarFk, response, headerText);
									}
								});
							}
						}
					},
					dialogOptions: {
						disableOkButton: function () {
							return createProjectCalendarConfig.dataItem.calendarFk === null;
						}
					}
				};

				// Show Dialog
				platformTranslateService.translateFormConfig(createProjectCalendarConfig.formConfiguration);
				platformModalFormConfigService.showDialog(createProjectCalendarConfig);
			};

			service.registerSelectionChanged (function (e, item){
				if(item){
					service.setReadOnly(item.CalendarTypeFk === projectCalendarConstantValues.calendar.type.enterprise);
				}
			});
			service.setReadOnlyAtStart = function setReadOnlyAtStart () {
				var item = service.getSelected();
				if(item){
					service.setReadOnly(item.CalendarTypeFk === projectCalendarConstantValues.calendar.type.enterprise);
				}
			};

			service.setReadOnly = function setReadOnly (flag) {

				var oldValue = readOnlyFlag;

				if (readOnlyFlag === flag) {
					return; // Nothing has changed -> nothing to be done
				}

				readOnlyFlag = flag;


				if (flag) {
					platformPermissionService.restrict([projectCalendarConstantValues.permissionUuid.calendars, projectCalendarConstantValues.permissionUuid.workhours,
						projectCalendarConstantValues.permissionUuid.exceptions, projectCalendarConstantValues.permissionUuid.workdays,
						projectCalendarConstantValues.permissionUuid.weekdays], permissions.read);

				}
				else if (oldValue) { // Only do this if readonly was set before
					platformPermissionService.restrict([projectCalendarConstantValues.permissionUuid.calendars, projectCalendarConstantValues.permissionUuid.workhours,
						projectCalendarConstantValues.permissionUuid.exceptions, projectCalendarConstantValues.permissionUuid.workdays,
						projectCalendarConstantValues.permissionUuid.weekdays], false); // Reset restriction
				}
			};

			service.createProjectCalendar = function createProjectCalendar (id, entity, headerText){
				var oldEntity = _.cloneDeep(entity);
				var command = {
					Action: 5,
					Calendar: {Id: id}
				};

				return $http.post(globals.webApiBaseUrl + 'scheduling/calendar/execute', command).then(function (response) {
					if (response && response.data && response.data.Calendar && response.data.Calendar.Id) {
						basicsLookupdataLookupDescriptorService.addData('schedulingCalendar', [response.data.Calendar]);
						entity.CalendarSourceFk = id;
						entity.CalendarFk = response.data.Calendar.Id;
						entity.CalendarTypeFk = projectCalendarConstantValues.calendar.type.project;
						serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldEntity, entity, true, serviceContainer.data);
						service.markItemAsModified(entity);
						var childServices = service.getChildServices();
						_.forEach(childServices, function(childService){
							if (childService.unloadSubEntities) {
								childService.unloadSubEntities();
								childService.clearCache();
							}
						});
						serviceContainer.data.startSubEntityLoad(entity);
						service.setReadOnly(false);
					}
				},
				function (/* error */) {
					// Error MessageText
					var modalOptions = {
						headerText: headerText,
						bodyText: $translate.instant('project.calendar.errorMsgCreateProjectCalendar'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				});
			};

			service.startSubEntityLoad = function startSubEntityLoad(entity){
				serviceContainer.data.startSubEntityLoad(entity);
			};

			return service;
		}]);
})();
