/**
 * Created by nitsche on 12.06.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainHammockDataService
	 * @description pprovides methods to access, create and update scheduling main hammock entities
	 */
	myModule.service('schedulingMainHammockDataService', SchedulingMainHammockDataService);

	SchedulingMainHammockDataService.$inject = [
		'_',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceDataPresentExtension',
		'basicsCommonMandatoryProcessor',
		'schedulingMainService',
		'schedulingMainHammockAllService',
		'schedulingMainActivityTypes',
		'schedulingMainHammockStaticDataService',
		'platformDataServiceModificationTrackingExtension',
		'schedulingMainConstantValues'
	];

	function SchedulingMainHammockDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceDataPresentExtension, basicsCommonMandatoryProcessor, schedulingMainService, schedulingMainHammockAllService, schedulingMainActivityTypes, schedulingMainHammockStaticDataService, platformDataServiceModificationTrackingExtension, schedulingMainConstantValues) {
		var self = this;
		var actTypeIdHammock = 5;
		var initCreationData = function initCreationData(creationData) {
			var selected = schedulingMainService.getSelected();
			schedulingMainHammockStaticDataService.setCreationData(selected, creationData);
		};
		var schedulingMainHammockServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'schedulingMainHammockDataService',
				entityNameTranslationID: 'scheduling.main.hammockEntity',
				httpRead: {
					useLocalResource: true, resourceFunction: function () {
						return schedulingMainHammockAllService.getHammockList();
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = schedulingMainService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ScheduleFk;
							creationData.PKey3 = selected.ProjectFk;
						},
						handleCreateSucceeded: function handleCreateSucceeded() {
							var selected = schedulingMainService.getSelected();
							if (!selected.HasHammock) {
								selected.HasHammock = true;
								schedulingMainService.markCurrentItemAsModified();
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

		serviceContainer.data.Initialised = true;
		serviceContainer.service.canCreate = function canCreate() {
			var sel = schedulingMainService.getSelected();

			return (sel && (sel.ActivityTypeFk === actTypeIdHammock) && sel.Id !== schedulingMainConstantValues.activity.transientRootEntityId);
		};

		serviceContainer.data.handleOnDeleteSucceeded = function handleOnDeleteSucceeded(deleteParams /* , data, response */) {
			schedulingMainHammockAllService.removeDeletedEntitiesFromDataItemList(deleteParams.entities);
			if (serviceContainer.service.getList().length === 0) {
				var selectedActivity = schedulingMainService.getSelected();
				selectedActivity.HasHammock = false;
				schedulingMainService.markCurrentItemAsModified();
			}
			// Set flag for IsAssignedToHammock
			const deletedEntities = _.clone(deleteParams.entities);
			_.forEach(deletedEntities, function (entity) {
				if (schedulingMainHammockAllService.checkIfActivityIsStillAssigned(entity)) {
					return true;
				}
				else {
					return schedulingMainHammockAllService.asyncCheckIfActivityIsStillAssigned(entity).then(function () {
						return true;
					});
				}
			});
			schedulingMainService.refreshHammockDateFields(schedulingMainService.getSelected());
		};

		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};

		serviceContainer.service.getCurrentToSave = function getCurrentToSave() {
			var mods = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
			var propName = serviceContainer.data.itemName + 'ToSave';
			if (Object.prototype.hasOwnProperty.call(mods, propName)) {
				return mods[propName];
			}
			else {
				return [];
			}
		};

		serviceContainer.service.getCurrentToDelete = function getCurrentToDelete() {
			var mods = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
			var propName = serviceContainer.data.itemName + 'ToDelete';
			if (Object.prototype.hasOwnProperty.call(mods, propName)) {
				return mods[propName];
			}
			else {
				return [];
			}
		};

		serviceContainer.service.CreateHammockCompleteAndSync2 = function CreateHammockCompleteAndSync2(activies) {
			var creationData = {};
			initCreationData(creationData);
			return schedulingMainHammockAllService.CreateHammockCompleteAndSync(creationData, activies.map(function (act) {
				return act.Id;
			}));
		};

		serviceContainer.service.CreateHammockCompleteAndSync = function CreateHammockCompleteAndSync(activityIds) {
			var creationData = {};
			initCreationData(creationData);
			return schedulingMainHammockAllService.CreateHammockCompleteAndSync(creationData, activityIds);
		};

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

		serviceContainer.service.createItem = function createItem() {
			return schedulingMainHammockAllService.createHammock().then(function (newItem) {
				return platformDataServiceDataPresentExtension.handleOnCreateSucceededInList(newItem, serviceContainer.data, serviceContainer.service);
			});
		};

		serviceContainer.service.missingActivities = function (activities) {
			return schedulingMainHammockStaticDataService.missingActivities(activities, serviceContainer.service.getList());
		};

		serviceContainer.service.hasAllActivitiesALinkeToHammock = function hasAllActivitiesALinkeToHammock(activities) {
			return schedulingMainHammockStaticDataService.hasAllActivitiesALinkeToHammock(activities, serviceContainer.service.getList());
		};

		serviceContainer.service.hasActivityALinkeToHammock = function hasActivityALinkeToHammock(activity) {
			return _.some(serviceContainer.data.itemList, function (hammock) {
				return hammock.ActivityMemberFk === activity.Id;
			});
		};

		serviceContainer.service.isActivityLinkableAndUnlinked = function isActivityLinkableAndUnlinked(activity) {
			return serviceContainer.service.isActivityLinkable(activity) && (!serviceContainer.service.hasActivityALinkeToHammock(activity));
		};

		serviceContainer.service.isActivityLinkable = function isActivityLinkable(activity) {
			return schedulingMainActivityTypes.Activity === activity.ActivityTypeFk || schedulingMainActivityTypes.Milestone === activity.ActivityTypeFk;
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'HammockActivityDto',
			moduleSubModule: 'Scheduling.Main',
			validationService: 'schedulingMainHammockValidationService',
			mustValidateFields: ['ActivityMemberFk']
		});

		serviceContainer.service.initCreationData = initCreationData;

		serviceContainer.service.markItemAsModified = function markItemAsModified(hammock) {
			schedulingMainHammockAllService.markItemAsModified(hammock);
		};

		serviceContainer.service.markItemAsModified = function markItemAsModified(hammock) {
			schedulingMainHammockAllService.markItemAsModified(hammock);
		};
	}
})(angular);
