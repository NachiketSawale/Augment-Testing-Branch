(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var itemModule = angular.module(moduleName);

	itemModule.factory('ppsEngineeringItemClerkDataService', ClerkDataService);

	ClerkDataService.$inject = ['$injector', 'productionplanningEngineeringMainService',
		'platformDataServiceFactory', 'productionplanningCommonClerkProcessor'];

	function ClerkDataService($injector, engMainService,
							  platformDataServiceFactory, clerkProcessor) {

		var serviceInfo = {
			flatLeafItem: {
				module: itemModule,
				serviceName: 'ppsEngineeringItemClerkDataService',
				entityNameTranslationID: 'productionplanning.engineering.entityItemClerk',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
					endRead: 'getClerksByTaskId'
				},
				dataProcessor: [clerkProcessor],
				entityRole: {
					leaf: {
						itemName: 'PPSItemClerk',
						parentService: engMainService,
						parentFilter: 'taskId'
					}
				},
				actions: {
					delete: false,
					create: {}
				}
			}
		};

		/* jshint -W003 */
		return platformDataServiceFactory.createNewComplete(serviceInfo).service;
	}
})(angular);