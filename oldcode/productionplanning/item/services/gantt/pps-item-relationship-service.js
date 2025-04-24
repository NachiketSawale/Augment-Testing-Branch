/**
 * Created by mik on 30/07/2019.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name PpsItemEventDataService
	 *
	 * @description
	 * PpsItemEventDataServiceFactory creates a service for the hierarchical list of item and events.
	 */
	var moduleName = 'productionplanning.item';
	var masterModule = angular.module(moduleName);

	masterModule.service('productionplanningItemRelationshipService', PpsItemRelationshipDataService);

	PpsItemRelationshipDataService.$inject = ['$injector',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'productionplanningItemProcessor',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningItemEventService'];

	function PpsItemRelationshipDataService($injector,
									 platformDataServiceFactory,
									 ServiceDataProcessArraysExtension,
									 productionplanningItemProcessor,
									 basicsLookupdataLookupDescriptorService,
											productionplanningItemEventService) {
		var serviceOption = {
			module: masterModule,
			serviceName: 'productionplanningItemRelationshipService',
			entityNameTranslationID: 'productionplanning.item.event', //id not correct
			httpCRUD: {
				route: globals.webApiBaseUrl + 'productionplanning/item/', // create new endpoint
				usePostForRead: true,
				endRead: 'getEventRelationList',
				initReadData: function (readData) {
					readData.itemIdList = productionplanningItemEventService.itemIds;
				}
			},
			actions: {delete: true, create: 'flat'},
			entityRole: {leaf: {itemName: 'Relationships', parentService: productionplanningItemEventService}},
			presenter: {
				list: {
				}
			},
			translation: {
				uid: 'productionplanningItemMainService',
				title: 'productionplanning.item.entityItem',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
			},
			entitySelection: {},
			modification: {multi: true}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		// productionplanningItemEventService.registerListLoaded(serviceContainer.service.load);

		return serviceContainer.service;
	}
})(angular);