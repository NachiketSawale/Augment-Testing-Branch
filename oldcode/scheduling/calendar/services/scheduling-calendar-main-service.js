/**
 * Created by leo on 16.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var calendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarMainService
	 * @function
	 *
	 * @description
	 * schedulingCalendarMainService is the data service for all calendar related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	calendarModule.factory('schedulingCalendarMainService',
		['$injector', 'moment', '_', '$q', 'basicsLookupdataConfigGenerator', '$http', 'platformDataServiceFactory',
			'platformModuleNavigationService', 'platformPermissionService', 'basicsCommonMandatoryProcessor',
			'schedulingCalendarConstantValues', 'permissions', 'platformRuntimeDataService',
			function ($injector, moment, _, $q, basicsLookupdataConfigGenerator, $http, platformDataServiceFactory, naviService, platformPermissionService, basicsCommonMandatoryProcessor, schedulingCalendarConstantValues, permissions, platformRuntimeDataService) {

				var readOnlyFlag = false;

				// The instance of the main service - to be filled with functionality below
				function canDelete(item) {
					var result = false;
					if (item.Version === 0) {
						result = true;
					}
					return result;
				}
				var getContext = function (entity) {
					return $http.post(globals.webApiBaseUrl + 'basics/customize/schedulecontext/instance', {Id:entity.SchedulingContextFk}).then(function (result) {
						return result.data;
					});
				};

				var exceptServiceOption = {
					flatRootItem: {
						module: calendarModule,
						serviceName: 'schedulingCalendarMainService',
						entityNameTranslationID: 'scheduling.calendar.translationDescCalendar',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'scheduling/calendar/',
							endRead: 'filtered',
							usePostForRead: true
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									// creationData.mainItemId = creationData.parentId;
									creationData.PKey1 = -1;
								}
							}
						},
						entityRole: {
							root: {
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated',
								itemName: 'Calendars',
								moduleName: 'cloud.desktop.moduleDisplayNameCalendar',
								mainItemName: 'Calendar',
								showCustomHeader : [
									{asyncGetCustomEntity: getContext,getCustomOption:function () {return {codeField: '', descField: 'DescriptionInfo.Translated'};}}
								]
							}
						},
						translation: {
							uid: 'schedulingCalendarMainService',
							title: 'scheduling.calendar.translationDescCalendar',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'CalendarDto',
								moduleSubModule: 'Scheduling.Calendar'
							}
						},
						actions: {
							create: 'flat',
							delete: {},
							canDeleteCallBackFunc: function (item) {
								return canDelete(item);
							}
						},
						dataProcessor: [{processItem: function(item) {
							platformRuntimeDataService.readonly(item, item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.projectType || item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.eDaysType);
						}
						}],
						entitySelection: {supportsMultiSelection: true}
					}

				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'CalendarDto',
					moduleSubModule: 'Scheduling.Calendar',
					validationService: 'schedulingCalendarValidationService'
				});


				var searchByCalId = function searchByCalId(item) {

					function select(item) {
						if (item.CalendarFk !== null && item.CalendarFk !== undefined) {
							serviceContainer.service.setSelected(serviceContainer.service.getItemById(item.CalendarFk));
						}
					}

					if (_.isEmpty(serviceContainer.service.getList())) {
						serviceContainer.service.load().then(function () {
							select(item);
						});
					} else {
						select(item);
					}
				};

				serviceContainer.service.assertIsLoaded = function assertIsLoaded() {
					if (!serviceContainer.data.itemList || serviceContainer.data.itemList.length === 0) {
						if (platformPermissionService.hasRead('AFECDB4A08404395855258B70652D04B')) {
							serviceContainer.service.load();
						}
					}
				};

				naviService.registerNavigationEndpoint(
					{
						moduleName: 'scheduling.calendar',
						navFunc: searchByCalId
					}
				);
				serviceContainer.service.searchByCalId = searchByCalId;

				serviceContainer.service.save = function save(item) {
					var entities = $q.defer();

					$http.post(globals.webApiBaseUrl + 'scheduling/calendar/save', item).then(
						function (response) {
							angular.extend(item, response.data);
							serviceContainer.service.fireItemModified(item);
							entities.resolve();
						}, function () {
							// cont.data.errors[updateData.id] = updateData;
							entities.reject();
						}
					);
				};

				serviceContainer.service.createDeepCopy = function createDeepCopy() {
					var command = {
						Action: 4,
						Calendar: serviceContainer.service.getSelected()
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/calendar/execute', command)
						.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data.Calendar, serviceContainer.data);
						},
						function (/* error */) {
						});
				};

				serviceContainer.service.registerSelectionChanged (function (e, item){
					if(item){
						serviceContainer.service.setReadOnly(item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.projectType || item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.eDaysType);
					}
				});
				serviceContainer.service.setReadOnlyAtStart = function setReadOnlyAtStart () {
					var item = serviceContainer.service.getSelected();
					if(item){
						serviceContainer.service.setReadOnly(item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.projectType || item.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.eDaysType);
					}
				};

				serviceContainer.service.setReadOnly = function setReadOnly (flag) {

					var oldValue = readOnlyFlag;

					if (readOnlyFlag === flag) {
						return; // Nothing has changed -> nothing to be done
					}

					readOnlyFlag = flag;


					if (flag) {
						platformPermissionService.restrict([schedulingCalendarConstantValues.uuid.permission.workhours,
							schedulingCalendarConstantValues.uuid.permission.exceptiondays, schedulingCalendarConstantValues.uuid.permission.workdays,
							schedulingCalendarConstantValues.uuid.permission.weekdays], permissions.read);

					}
					else if (oldValue) { // Only do this if readonly was set before
						platformPermissionService.restrict([schedulingCalendarConstantValues.uuid.permission.workhours,
							schedulingCalendarConstantValues.uuid.permission.exceptiondays, schedulingCalendarConstantValues.uuid.permission.workdays,
							schedulingCalendarConstantValues.uuid.permission.weekdays], false); // Reset restriction
					}
				};


				return serviceContainer.service;

			}]);
})();
