(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.formwork';
	angular.module(moduleName).factory('ppsFormworkLookupDataService', [
		'platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsFormworkLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'c741a7f4b1d141908e871753cf5f3efd'
			});

			var requisitionLookupDataServiceConfig = {
				filterParam: {},
				prepareFilter: function () {
					return {};
				},
				httpRead: { route: globals.webApiBaseUrl + 'productionplanning/formwork/', endPointRead: 'filtered'},
				dataEnvelope: 'dtos'
			};

			return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;
		}
	]);
})();