(function (angular) {
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');
	/* global globals */
	/**
	 * @ngdoc service
	 * @name schedulingMainBaselineSuccessorRelationshipDataService
	 * @function
	 *
	 * @description
	 * schedulingMainBaselineSuccessorRelationshipDataService provides all relationships for a given set of activities
	 */

	schedulingMainModule.factory('schedulingMainBaselineSuccessorRelationshipDataService',

		['platformDataServiceFactory', 'schedulingMainActivityBaseLineComparisonService',
			function ( platformDataServiceFactory, schedulingMainActivityBaseLineComparisonService) {

				let schedulingMainSuccessorServiceOption = {
					flatLeafItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainBaselineSuccessorRelationshipDataService',
						entityNameTranslationID: 'scheduling.main.entityBaselineSuccessor',
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/main/relationship/',
							endRead: 'listparent'
						},
						actions: { delete: false, create: false },
						presenter: {
							list: {}},
						// httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/relationship/', endRead: 'listparent'},
						entityRole: {leaf: {itemName: 'Relationships', parentService: schedulingMainActivityBaseLineComparisonService}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainSuccessorServiceOption);

				return serviceContainer.service;
			}
		]);
})(angular);