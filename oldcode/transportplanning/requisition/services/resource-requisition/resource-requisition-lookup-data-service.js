
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionResourceRequisitionLookupDataService
	 * @function
	 *
	 * @description
	 * transportplanningRequisitionResourceRequisitionLookupDataService is the data service for requisition look up for a given transport-requisition
	 */
	angular.module('transportplanning.requisition').factory('transportplanningRequisitionResourceRequisitionLookupDataService',
		['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningRequisitionResourceRequisitionLookupDataService', {
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
				httpRead: { route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/', endPointRead: 'listResRequisition'},
				filterParam: 'trsRequisitionId'
			};

			return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;
		}]);
})(angular);
