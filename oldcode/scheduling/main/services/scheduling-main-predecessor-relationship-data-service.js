(function (angular) {
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainPredecessorRelationshipDataService
	 * @function
	 *
	 * @description
	 * schedulingMainSuccessorRelationshipDataService provides all relationships for a given set of activities
	 */
	schedulingMainModule.factory('schedulingMainPredecessorRelationshipDataService',


		['platformDataServiceFactory', 'schedulingMainRelationshipAllService','schedulingMainService', 'platformDataServiceDataPresentExtension',

			function ( platformDataServiceFactory, schedulingMainRelationshipAllService, schedulingMainService, platformDataServiceDataPresentExtension) {

				var schedulingMainPredecessorServiceOption = {
					flatLeafItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainPredecessorRelationshipDataService',
						entityNameTranslationID: 'scheduling.main.entityPredecessor',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/relationship/',
							endRead: 'listchild'
						},
						actions: {delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var activity = schedulingMainService.getSelected();
								return activity.ActivityTypeFk !== 2 && activity.ActivityTypeFk !== 5 && !schedulingMainService.isCurrentTransientRoot();
							}
						},
						entityRole: {leaf: {itemName: 'Relationships', parentService: schedulingMainService}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainPredecessorServiceOption);

				var service = serviceContainer.service;

				service.deleteSelection = function deleteSelection() {
					var toDelete = service.getSelectedEntities();
					schedulingMainRelationshipAllService.deleteEntities(toDelete).then(function(response) {
						return platformDataServiceDataPresentExtension.handleOnDeleteSucceededInList({ entities: toDelete} , serviceContainer.data, response);
					});
				};

				service.createItem = function createItem() {
					return schedulingMainRelationshipAllService.createPredecessor().then(function(newItem){
						return platformDataServiceDataPresentExtension.handleOnCreateSucceededInList(newItem , serviceContainer.data, service);
					});
				};

				/*
				service.canCreate = function canCreate() {
					return !schedulingMainService.isCurrentTransientRoot();
				};
*/

				service.takeOverRelations = function takeOverRelations(relationships) {
					schedulingMainRelationshipAllService.takeOverRelations(relationships);
				};

				service.markItemAsModified = function markItemAsModified(relationship) {
					schedulingMainRelationshipAllService.markItemAsModified(relationship);
				};

				return service;
			}
		]);
})(angular);