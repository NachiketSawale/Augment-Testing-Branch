(function (angular) {
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');
	/* global globals */
	/**
	 * @ngdoc service
	 * @name schedulingMainBaselinePredecessorRelationshipDataService
	 * @function
	 *
	 * @description
	 * schedulingMainBaselinePredecessorRelationshipDataService provides all relationships for a given set of activities
	 */
	schedulingMainModule.factory('schedulingMainBaselinePredecessorRelationshipDataService',


		['platformDataServiceFactory', 'schedulingMainActivityBaseLineComparisonService',
			function ( platformDataServiceFactory, schedulingMainActivityBaseLineComparisonService) {

				let schedulingMainPredecessorServiceOption = {
					flatLeafItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainBaselinePredecessorRelationshipDataService',
						entityNameTranslationID: 'scheduling.main.entityBaselinePredecessor',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/relationship/',
							endRead: 'listchild'
						},
						actions: { delete: false, create: false },
						presenter: {list: {}},
						// httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/relationship/', endRead: 'listchild'},
						entityRole: {leaf: {itemName: 'Relationships', parentService: schedulingMainActivityBaseLineComparisonService}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainPredecessorServiceOption);

				return serviceContainer.service;
			}
		]);
})(angular);