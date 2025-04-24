(function (angular) {
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainSuccessorRelationshipDataService
	 * @function
	 *
	 * @description
	 * schedulingMainSuccessorRelationshipDataService provides all relationships for a given set of activities
	 */

	schedulingMainModule.factory('schedulingMainSuccessorRelationshipDataService',

		['platformDataServiceFactory', 'schedulingMainRelationshipAllService','schedulingMainService', 'platformDataServiceDataPresentExtension', 'platformDataServiceProcessDatesBySchemeExtension',

			function ( platformDataServiceFactory, schedulingMainRelationshipAllService, schedulingMainService, platformDataServiceDataPresentExtension, platformDataServiceProcessDatesBySchemeExtension) {

				var schedulingMainSuccessorServiceOption = {
					flatLeafItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainSuccessorRelationshipDataService',
						entityNameTranslationID: 'scheduling.main.entitySuccessor',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/relationship/',
							endRead: 'listparent'
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ActivityRelationshipDto',
							moduleSubModule: 'Scheduling.Main'
						})],
						actions: {delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								var activity = schedulingMainService.getSelected();
								return activity.ActivityTypeFk !== 2 && activity.ActivityTypeFk !== 5 && !schedulingMainService.isCurrentTransientRoot();
							}
						},
						entityRole: {leaf: {itemName: 'Relationships', parentService: schedulingMainService}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainSuccessorServiceOption);

				var service = serviceContainer.service;

				service.createItem = function createItem() {
					return schedulingMainRelationshipAllService.createSuccessor().then(function(newItem){
						return platformDataServiceDataPresentExtension.handleOnCreateSucceededInList(newItem , serviceContainer.data, service);
					});
				};

				/*
				service.canCreate = function canCreate() {
					return !schedulingMainService.isCurrentTransientRoot();
				};
*/

				service.deleteEntitiesAndUpdateUi = function deleteEntitiesAndUpdateUi(entities) {
					angular.forEach(entities, function (entity) {
						var listIdx = serviceContainer.data.itemList.indexOf(entity);
						serviceContainer.data.itemList.splice(listIdx,1);
					});
					serviceContainer.data.listLoaded.fire();
				};

				service.deleteSelection = function deleteSelection() {
					var toDelete = service.getSelectedEntities();
					schedulingMainRelationshipAllService.deleteEntities(toDelete).then(function(response) {
						return platformDataServiceDataPresentExtension.handleOnDeleteSucceededInList({ entities: toDelete} , serviceContainer.data, response);
					});
				};

				service.takeOverRelations = function takeOverRelations(relationships) {
					schedulingMainRelationshipAllService.takeOverRelations(relationships);
					serviceContainer.data.listLoaded.fire();
				};

				service.markItemAsModified = function markItemAsModified(relationship) {
					schedulingMainRelationshipAllService.markItemAsModified(relationship);
				};

				return service;
			}
		]);
})(angular);