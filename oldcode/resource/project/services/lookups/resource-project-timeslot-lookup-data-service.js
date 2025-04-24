
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceProjectTimeslotLookupDataService
	 * @function
	 *
	 * @description
	 * resourceProjectTimeslotLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('resource.project').factory('resourceProjectTimeslotLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			let readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceProjectTimeslotLookupDataService', {
				valMember: 'Id',
				dispMember: 'TimeslotNumber',
				descMember: 'Description',
				columns: [
					{
						id: 'TimeslotNumber',
						field: 'TimeslotNumber',
						name: 'Timeslot Number',
						formatter: 'integer',
						name$tr$: 'resource.project.timeslotNumber'
					}, {
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'c18e27b10de649959cb7454547ed8fef'
			});

			var timeslotLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/project/timeslot/',
					endPointRead: 'listbyparent',
					usePostForRead: true,
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item || -1;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(timeslotLookupDataServiceConfig).service;
		}]);
})(angular);
