/* global angular, globals */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningCommonResourceRequisitionLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningCommonResourceRequisitionLookupDataService is the data service for requisition look up for a given pps eventId
	 */
	var module = 'productionplanning.common';
	var serviceName = 'productionplanningCommonResourceRequisitionLookupDataService';
	angular.module(module).factory(serviceName, LookupDataService);

	LookupDataService.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];
	function LookupDataService(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id',
			dispMember: 'Description',
			columns: [
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'Resource',
					field: 'ResourceFk',
					name: 'ResourceFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceResourceLookupDataService',
						cacheEnable: true,
						additionalColumns: false
					}).grid.formatterOptions,
					name$tr$: 'resource.reservation.entityResource'
				}
			],
			uuid: '843423c8826741a99be5552a1e48d617'
		});

		var requisitionLookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'resource/requisition/',
				endPointRead: 'listForMntActivity'
			},
			filterParam: 'PpsEventId'
		};

		return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;

	}
})(angular);
