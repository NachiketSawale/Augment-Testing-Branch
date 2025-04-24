/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainEventAllService
	 * @function
	 *
	 * @description
	 * schedulingMainEventAllService is the data service for all event related functionality.
	 */
	schedulingMainModule.factory('schedulingMainEventAllService',
		['$http', '_', 'schedulingMainService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'schedulingMainEventProcessor', 'schedulingMainEventTypeService',
			'platformDataServiceDataProcessorExtension', 'platformDataServiceEntityRoleExtension',

			/* jshint -W072 */ // many parameters because of dependency injection
			function ($http, _, schedulingMainService, platformDataServiceFactory, ServiceDataProcessDatesExtension, schedulingMainEventProcessor, schedulingMainEventTypeService,
				platformDataServiceDataProcessorExtension, platformDataServiceEntityRoleExtension) {

				function getActivityIds(readData) {
					var immediateresult = schedulingMainService.getList();
					var result;

					if (!immediateresult || immediateresult.length === 0) {
						readData.filter = [-1]; // Workaround for empty request
						return;
					}
					result = immediateresult.map(function getId(item) {
						return item.Id;
					});
					result = _.compact(result); // throw out null values
					readData.filter = result;
				}

				let deleteItems = [];
				let newItems = [];
				var schedulingMainEventServiceOption = {
					module: schedulingMainModule,
					serviceName: 'schedulingMainEventAllService',
					entityNameTranslationID: 'scheduling.main.entityEvent',
					httpCreate: {
						route: globals.webApiBaseUrl + 'scheduling/main/event/',
						endCreate: 'create'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = schedulingMainService.getSelected();
								creationData.PKey1 = selected.Id;
								creationData.PKey2 = selected.ScheduleFk;
							}
						}
					},
					actions: {delete: true, create: 'flat'},
					dataProcessor: [new ServiceDataProcessDatesExtension(['Date', 'EndDate']), schedulingMainEventProcessor],
					entitySelection: {},
					modification: {multi: true},
					entityRole: {leaf: {itemName: 'Events', parentService: schedulingMainService}}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainEventServiceOption);
				var service = serviceContainer.service;
				serviceContainer.data.doNotLoadOnSelectionChange = true;
				serviceContainer.data.clearContent = function clearListContent() {
				};

				serviceContainer.service.getTypeDescriptionOf = function getTypeDescriptionOf(event) {
					return schedulingMainEventTypeService.getDescriptionById(event.EventTypeFk);
				};

				serviceContainer.service.canCreate = function canCreate() {
					return !schedulingMainService.isCurrentTransientRoot();
				};

				service.updateEvents = function updateEvents(events, setModified) {
					var hasToFire = false;
					_.forEach(events, function (eve) {
						var myEve = service.getItemById(eve.Id);
						if (myEve) {
							myEve.Date = eve.Date;
							myEve.DistanceTo = eve.DistanceTo;
							platformDataServiceDataProcessorExtension.doProcessItem(myEve, serviceContainer.data);
							setModified ?  serviceContainer.data.markItemAsModified(myEve, serviceContainer.data) : service.fireItemModified(myEve);
							// serviceContainer.data.markItemAsModified(myEve, serviceContainer.data);
							// platformDataServiceDataProcessorExtension.doProcessItem(myEve, serviceContainer.data);
							if (myEve.Version === 0){
								hasToFire = true;
							}
						}
						else {
							if (serviceContainer.data.itemList.length === 0) {
								newItems.push(eve);
							}
							serviceContainer.data.itemList.push(eve);
							serviceContainer.data.markItemAsModified(eve, serviceContainer.data);
							platformDataServiceDataProcessorExtension.doProcessItem(eve, serviceContainer.data);
							hasToFire = true;
						}
					});
					if(hasToFire){
						serviceContainer.data.listLoaded.fire();
					}

				};

				service.loadAllEvents = function loadAllEvents() {
					var data = serviceContainer.data;
					schedulingMainEventTypeService.assertEventTypes();

					var httpReadRoute = globals.webApiBaseUrl + 'scheduling/main/event/listall';

					var readData = {};
					readData.filter = '';
					getActivityIds(readData);

					return $http.post(httpReadRoute, readData
					).then(function (response) {
						if (newItems.length > 0){
							_.forEach(newItems, function (eve) {
								var myEve = _.find(response.data, function (item) {
									return item.Id === eve.Id;
								});
								if (myEve) {
									myEve.Date = eve.Date;
									myEve.DistanceTo = eve.DistanceTo;
								}
								else {
									response.data.push(eve);
								}
							});
							newItems = [];
						}
						if (deleteItems.length > 0){
							response.data = _.filter(response.data, function (item) {
								return !_.find(deleteItems, function (entity) {
									return entity.Id === item.Id;
								});
							});
							deleteItems = [];
						}
						return data.handleReadSucceeded(response.data, data);
					});
				};

				serviceContainer.data.onDataFilterChanged = onEventDataFilterChanged;
				service.onDataFilterChanged = onEventDataFilterChanged;

				function onEventDataFilterChanged() {
					serviceContainer.data.listLoaded.fire();
				}

				schedulingMainService.registerListLoaded(function () {
					deleteItems = [];
					newItems = [];
					serviceContainer.service.loadAllEvents();
				});
				// schedulingMainService.registerSelectionChanged(serviceContainer.data.onDataFilterChanged);

				serviceContainer.service.getFilteredList = function getFilteredList() {
					var result = [];
					var selectedItem = schedulingMainService.getSelected();
					if (selectedItem && selectedItem.Id) {
						result = _.filter(serviceContainer.data.itemList, {ActivityFk: selectedItem.Id});
					}
					return result;
				};

				service.initService = _.noop;// Just one method doing nothing


				service.moveItem = function (entities) {
					angular.forEach(entities, function (entity) {
						serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
							return item.Id !== entity.Id;
						});
					});
					serviceContainer.data.listLoaded.fire();
				};

				service.takeOverEvents = function takeOverEvents(events) {
					var toDo = _.filter(events, function (rel) {
						return !_.some(serviceContainer.data.itemList, ['Id', rel.Id]);
					});
					var fireListLoaded = false;

					_.forEach(toDo, function (eve) {
						newItems.push(eve);
						serviceContainer.data.itemList.push(eve);
						if (eve.Version === 0) {
							serviceContainer.service.markItemAsModified(eve);
						}
						fireListLoaded = true;
					});

					if (fireListLoaded) {
						serviceContainer.data.onDataFilterChanged();
					}
				};
				serviceContainer.data.deleteEntities = function deleteEvents(entities, data) {
					if (serviceContainer.data.itemList.length === 0) {
						_.forEach(entities, function (eve) {
							deleteItems.push(eve);
						});
					}
					if (newItems.length > 0) {
						newItems = _.filter(newItems, function (item) {
							return !_.some(entities, ['Id', item.Id]);
						});
					}

					return platformDataServiceEntityRoleExtension.deleteSubEntities(entities, service, data);
				};

				service.createNewItem = function createNewItem(){
					return service.createItem().then(function(newItem){
						newItems.push(newItem);
						return newItem;
					});
				};
				return service;
			}
		]);
})(angular);