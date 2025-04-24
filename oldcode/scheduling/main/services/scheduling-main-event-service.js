/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainEventService
	 * @function
	 *
	 * @description
	 * schedulingMainEventService is the data service for all event related functionality.
	 */
	schedulingMainModule.factory('schedulingMainEventService',
		['_', 'platformDataServiceFactory', 'schedulingMainEventAllService','schedulingMainService', 'platformDataServiceDataPresentExtension', 'ServiceDataProcessDatesExtension',
			'schedulingMainEventProcessor', 'platformDataServiceDataProcessorExtension', 'schedulingLookupEventDataService',

			function (_, platformDataServiceFactory, schedulingMainEventAllService, schedulingMainService, platformDataServiceDataPresentExtension, ServiceDataProcessDatesExtension,
				schedulingMainEventProcessor, platformDataServiceDataProcessorExtension, schedulingLookupEventDataService) {

				let schedulingMainEventServiceOption = {
					flatLeafItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainEventService',
						entityNameTranslationID: 'scheduling.main.entityEvent',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/event/',
							endRead: 'list'
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'scheduling/main/event/',
							endCreate: 'create'
						},
						actions: {delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								return !schedulingMainService.isCurrentTransientRoot();
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['Date', 'EndDate']), schedulingMainEventProcessor],
						entitySelection: {},
						modification: {multi: true},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									let selected = schedulingMainService.getSelected();
									creationData.PKey1 = selected.Id;
									creationData.PKey2 = selected.ScheduleFk;
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									return data.handleReadSucceeded(readItems, data);
								}
							}
						},
						entityRole: {leaf: {itemName: 'Events', parentService: schedulingMainService}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainEventServiceOption);

				let service = serviceContainer.service;

				service.deleteSelection = function deleteSelection() {
					let toDelete = service.getSelectedEntities();
					schedulingMainEventAllService.deleteEntities(toDelete).then(function(response) {
						return platformDataServiceDataPresentExtension.handleOnDeleteSucceededInList({ entities: toDelete} , serviceContainer.data, response);
					});
				};

				service.createItem = function createItem() {
					return schedulingMainEventAllService.createNewItem().then(function(newItem){
						return platformDataServiceDataPresentExtension.handleOnCreateSucceededInList(newItem , serviceContainer.data, service);
					});
				};

				service.updateEvents = function updateEvents(events) {
					let activity = schedulingMainService.getSelected();
					_.forEach(events, function (eve) {
						let myEve = service.getItemById(eve.Id);
						if (myEve) {
							myEve.Date = eve.Date;
							myEve.DistanceTo = eve.DistanceTo;
							platformDataServiceDataProcessorExtension.doProcessItem(myEve, serviceContainer.data);
							serviceContainer.data.markItemAsModified(myEve, serviceContainer.data);
						}
						else {
							if (activity && activity.Id === eve.ActivityFk) {
								serviceContainer.data.itemList.push(eve);
								serviceContainer.data.markItemAsModified(eve, serviceContainer.data);
								platformDataServiceDataProcessorExtension.doProcessItem(eve, serviceContainer.data);
							}
						}
					});
					if (events && events.length > 0) {
						schedulingLookupEventDataService.setCache({'lookupType': 'schedulingLookupEventDataService'}, serviceContainer.data.itemList);
					}
					serviceContainer.data.listLoaded.fire();
					schedulingMainEventAllService.updateEvents(events);
				};
				service.takeOverEvents = function takeOverEvents(events) {
					let activity = schedulingMainService.getSelected();
					let toDo = _.filter(events, function (rel) {
						return !_.some(serviceContainer.data.itemList, ['Id', rel.Id]);
					});
					let fireListLoaded = false;

					_.forEach(toDo, function (eve) {
						if (activity && activity.Id === eve.ActivityFk) {
							serviceContainer.data.itemList.push(eve);
							platformDataServiceDataProcessorExtension.doProcessItem(eve, serviceContainer.data);

							if (eve.Version === 0) {
								serviceContainer.service.markItemAsModified(eve);
							}
							fireListLoaded = true;
						}
					});

					if (fireListLoaded) {
						serviceContainer.data.listLoaded.fire();
					}
					schedulingMainEventAllService.takeOverEvents(events);
				};

				service.moveItem = function (entities) {
					angular.forEach(entities, function (entity) {
						serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
							return item.Id !== entity.Id;
						});
					});
					serviceContainer.data.listLoaded.fire();
					schedulingMainEventAllService.moveItem(entities);
				};

				service.markItemAsModified = function markItemAsModified(event) {
					schedulingMainEventAllService.markItemAsModified(event);
				};

				return service;
			}
		]);
})(angular);