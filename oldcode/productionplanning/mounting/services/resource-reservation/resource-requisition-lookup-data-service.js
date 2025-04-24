
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningMountingActivityResourceRequisitionLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningMountingActivityResourceRequisitionLookupDataService is the data service for requisition look up for a given transport-requisition
	 */
	angular.module('productionplanning.mounting').factory('productionplanningMountingActivityResourceRequisitionLookupDataService',
		['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningMountingActivityResourceRequisitionLookupDataService', {
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
				uuid: '7a1b5728e08f4c2da04c795507abd76a'
			});

			var requisitionLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/requisition/', endPointRead: 'listForMntActivity' },
				filterParam: 'PpsEventId'
			};

			return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;
		}]);
})(angular);
