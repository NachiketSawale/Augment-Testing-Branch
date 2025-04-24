/**
 * Created by nitsche on 02.07.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainHammockDataService
	 * @description pprovides methods to access, create and update scheduling main hammock entities
	 */
	myModule.service('schedulingMainHammockAllService', SchedulingMainHammockAllService);

	SchedulingMainHammockAllService.$inject = ['$http', '$injector', 'platformDataServiceFactory', '_', 'platformDataServiceDataProcessorExtension', 'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceDataPresentExtension', 'schedulingMainService', 'schedulingMainHammockStaticDataService'];

	function SchedulingMainHammockAllService($http, $injector, platformDataServiceFactory, _, platformDataServiceDataProcessorExtension, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceDataPresentExtension, schedulingMainService, schedulingMainHammockStaticDataService) {
		var self = this;
		var callbacksOnCreation = [];
		var doCallbackOnCreation = function doCallbackOnCreation() {
			if (callbacksOnCreation.length > 0) {
				angular.forEach(callbacksOnCreation, function (method) {
					method();
				});
			}
		};
		var initCreationData = function initCreationData(creationData) {
			var selected = schedulingMainService.getSelected();
			schedulingMainHammockStaticDataService.setCreationData(selected, creationData);
		};

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

		var schedulingMainHammockServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'schedulingMainHammockAllService',
				entityNameTranslationID: 'scheduling.main.hammockEntity',
				httpCreate: {
					route: globals.webApiBaseUrl + 'scheduling/main/hammock/',
					endRead: 'create'
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: initCreationData,
						handleCreateSucceeded: function handleCreateSucceeded() {
							var selected = schedulingMainService.getSelected();
							if (!selected.HasHammock) {
								selected.HasHammock = true;
								schedulingMainService.markCurrentItemAsModified();
								doCallbackOnCreation();
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'HammockActivity', parentService: schedulingMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(schedulingMainHammockServiceOption, self);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		serviceContainer.data.Initialised = true;

		serviceContainer.service.createHammock = function createHammock() {
			return serviceContainer.service.createItem();
		};

		serviceContainer.service.CreateHammockCompleteAndSync2 = function CreateHammockCompleteAndSync2(hammockActivity, activities) {
			var creationData = schedulingMainHammockStaticDataService.getCreationData(hammockActivity);
			var activityIds = activities.map(function (act) {
				return act.Id;
			});
			return serviceContainer.service.CreateHammockCompleteAndSync(creationData, activityIds);
		};

		serviceContainer.service.missingActivityIds = function missingActivityIds(hammockActivityId, activityIds) {
			var hammockActivitiesLinks = _.filter(serviceContainer.data.itemList, function (item) {
				return item.ActivityFk === hammockActivityId;
			});
			return schedulingMainHammockStaticDataService.missingActivities(activityIds, hammockActivitiesLinks.map(function (hammockAct) {
				return hammockAct.ActivityMemberFk;
			}));
		};

		serviceContainer.service.CreateHammockCompleteAndSync = function CreateHammockCompleteAndSync(creationData, activityIds) {
			var missingActivityIds = serviceContainer.service.missingActivityIds(creationData.PKey1, activityIds);// creationData.PKey1: Id of the hammock activity

			return schedulingMainHammockStaticDataService.CreateHammocks(creationData, missingActivityIds).then(function (response) {
				serviceContainer.service.takeOverHammocks(response.data);
				var sMHDS = $injector.get('schedulingMainHammockDataService');
				var selectedRoot = schedulingMainService.getSelected();
				if (selectedRoot && selectedRoot.Id && selectedRoot.Id === creationData.PKey1) {
					sMHDS.takeOverHammocks(response.data);
				}
				return response;
			});
		};

		serviceContainer.data.clearContent = function clearListContent() {
		};

		serviceContainer.service.getHammockList = function getHammockList() {
			var result = [];
			var selectedItem = schedulingMainService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {ActivityFk: selectedItem.Id});
			}
			return result;
		};

		serviceContainer.data.handleReadSucceeded = function handleReadSucceeded(result, data) {
			data.itemList.length = 0;
			_.forEach(result, function (entity) {
				data.itemList.push(entity);
			});

			platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

			data.listLoaded.fire(result);
		};

		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};

		serviceContainer.data.loadAllHammocks = function loadAllHammocks() {
			var data = serviceContainer.data;
			var httpReadRoute = globals.webApiBaseUrl + 'scheduling/main/hammock/listall';

			var readData = {};
			readData.filter = '';
			getActivityIds(readData);

			return $http.post(httpReadRoute, readData
			).then(function (response) {
				return data.handleReadSucceeded(response.data, data);
			});
		};

		// schedulingMainService.registerListLoaded(serviceContainer.data.loadAllHammocks);
		schedulingMainService.registerSelectionChanged(serviceContainer.data.onDataFilterChanged);

		serviceContainer.service.takeOverHammocks = function takeOverHammocks(hammocks) {
			var toDo = _.filter(hammocks, function (ham) {
				return !_.some(serviceContainer.data.itemList, ['Id', ham.Id]);
			});
			var fireListLoaded = false;

			_.forEach(toDo, function (ham) {
				serviceContainer.data.itemList.push(ham);
				if (ham.Version === 0) {
					serviceContainer.service.markItemAsModified(ham);
				}
				fireListLoaded = true;
			});

			if (fireListLoaded) {
				serviceContainer.data.onDataFilterChanged();
			}
		};
		serviceContainer.service.removeLinksToNewHammock = function removeLinksToNewHammock(hamId) {
			var oldLength = serviceContainer.data.itemList.length;
			serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (ham) {
				return ham.ActivityMemberFk !== hamId;
			});

			if (oldLength !== serviceContainer.data.itemList.length) {
				serviceContainer.data.onDataFilterChanged();
			}
		};

		serviceContainer.service.hasHammockAssignments = function hasHammockAssignments(actId) {
			return _.some(serviceContainer.data.itemList, function (item) {
				return actId === item.ActivityFk;
			});
		};

		serviceContainer.service.hasHammockActivityAssignments = function hasHammockActivityAssignments(activity) {
			return serviceContainer.service.hasHammockAssignments(activity.Id);
		};

		serviceContainer.service.isActivityIdAnywhereAssigned = function isActivityIdAnywhereAssigned(actId) {
			return _.some(serviceContainer.data.itemList, function (item) {
				return actId === item.ActivityMemberFk;
			});
		};

		serviceContainer.service.isActivityAnywhereAssigned = function isActivityAnywhereAssigned(activity) {
			return serviceContainer.service.isActivityIdAnywhereAssigned(activity.Id);
		};

		serviceContainer.service.doCallBackOnCreation = function doCallBackOnCreation() {
			if (callbacksOnCreation.length > 0) {
				angular.forEach(callbacksOnCreation, function (method) {
					method();
				});
			}
		};

		serviceContainer.service.registerCallBackOnCreation = function registerCallBackOnCreation(method) {
			callbacksOnCreation.push(method);
		};

		serviceContainer.service.unRegisterCallBackOnCreation = function unRegisterCallBackOnCreation(method) {
			callbacksOnCreation = callbacksOnCreation.filter(function (item) {
				return item !== method;
			});
		};

		serviceContainer.data.onDeleteDone = function () {
			var schedulingMainHammockDataService = $injector.get('schedulingMainHammockDataService');
			var toDelete = schedulingMainHammockDataService.getSelectedEntities();
			platformDataServiceDataPresentExtension.handleOnDeleteSucceededInList({entities: toDelete}, serviceContainer.data, serviceContainer.service);
			var selcetedActivity = schedulingMainService.getSelected();
			var selectedActivityHammocksRelations = serviceContainer.service.getList().filter(function (item) {
				return item.ActivityFk === selcetedActivity.Id;
			});
			if (selectedActivityHammocksRelations.length === 0) {
				selcetedActivity.HasHammock = false;
				schedulingMainService.markCurrentItemAsModified();
				serviceContainer.service.doCallBackOnCreation();
			}
			schedulingMainService.refreshHammockDateFields(schedulingMainService.getSelected());
		};

		serviceContainer.service.checkIfActivityIsStillAssigned = function checkIfActivityIsStillAssigned(assigned2Hammock) {
			if (serviceContainer.data.itemList.length === 0) {
				return false;
			}
			var stillAssignedTo = _.filter(serviceContainer.data.itemList, function (item) {
				return item.ActivityMemberFk === assigned2Hammock.ActivityMemberFk && item.ActivityFk !== assigned2Hammock.ActivityFk;
			});
			if (_.size(stillAssignedTo) >= 1) {
				return true;
			}
		};

		serviceContainer.service.asyncCheckIfActivityIsStillAssigned = function asyncCheckIfActivityIsStillAssigned(assigned2Hammock) {
			var httpReadRoute = globals.webApiBaseUrl + 'scheduling/main/hammock/isAssignedToHammock';

			return $http.post(httpReadRoute, assigned2Hammock
			).then(function (response) {
				var activity;
				var activities;
				if (response.data) {
					activity = schedulingMainService.getItemById(assigned2Hammock.ActivityMemberFk);
					if(activity !== undefined) {
						activities = [activity];
						if (Object.prototype.hasOwnProperty.call(activity, 'IsAssignedToHammock')) {
							activity.IsAssignedToHammock = true;
						}
						schedulingMainService.takeOverActivities(activities);
					}
				}
				else {
					if (assigned2Hammock.ActivityMemberFk !== 0 && assigned2Hammock.ActivityMemberFk !== undefined) {
						activity = schedulingMainService.getItemById(assigned2Hammock.ActivityMemberFk);
						if (activity !== undefined) {
							activities = [activity];
							if (Object.prototype.hasOwnProperty.call(activity, 'IsAssignedToHammock')) {
								activity.IsAssignedToHammock = false;
							}
							schedulingMainService.takeOverActivities(activities);
						}
					}
				}
				return true;
			});
		};

		serviceContainer.service.removeDeletedEntitiesFromDataItemList = function removeDeletedEntitiesFromDataItemList(deletedEntities) {
			serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (candidate) {
				return !_.find(deletedEntities, function (deletedEntity) {
					return deletedEntity.Id === candidate.Id;
				});
			});
		};
		serviceContainer.service.initService = _.noop;// Just one method doing nothing
	}
})(angular);
