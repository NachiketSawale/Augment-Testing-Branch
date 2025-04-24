/*
 * Created by las on 26/08/2020.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsEngineeringGanttRelationshipService
	 */
	var moduleName = 'productionplanning.engineering';
	var masterModule = angular.module(moduleName);

	masterModule.service('ppsEngineeringGanttRelationshipService', PpsEngineeringGanttRelationshipDataService);

	PpsEngineeringGanttRelationshipDataService.$inject = ['$injector',
		'platformDataServiceFactory',
		'ppsEngineeringGanttEventService'];

	function PpsEngineeringGanttRelationshipDataService($injector,
									 platformDataServiceFactory,
		ppsEngineeringGanttEventService) {
		var serviceOption = {
			module: masterModule,
			serviceName: 'ppsEngineeringGanttRelationshipService',
			entityNameTranslationID: 'productionplanning.item.event', //id not correct
			httpCRUD: {
				route: globals.webApiBaseUrl + 'productionplanning/item/', // create new endpoint
				usePostForRead: true,
				endRead: 'getEventRelationList',
				initReadData: function (readData) {
					readData.itemIdList = ppsEngineeringGanttEventService.itemIds;
				}
			},
			actions: {delete: true, create: 'flat'},
			entityRole: {leaf: {itemName: 'Relationships', parentService: ppsEngineeringGanttEventService}},
			presenter: {
				list: {
				}
			},
			translation: {
				uid: 'productionplanningEngineeringMainService',
				title: 'productionplanning.engineering.entityEngTask',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
			},
			entitySelection: {},
			modification: {multi: true}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		return serviceContainer.service;
	}
})(angular);