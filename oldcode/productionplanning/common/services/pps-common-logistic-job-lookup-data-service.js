/**
 * Created by zwz on 9/26/2018.
 */
(function (angular) {
	'use strict';
	/* global globals, angular*/
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonLogisticJobLookupDataService
	 * @function
	 * @description
	 *
	 * data service for logistic job lookup filter by project and display address.
	 */
	angular.module(moduleName).factory('productionplanningCommonLogisticJobLookupDataService', lookupDataService);

	lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
		var readData = {projectFk: null};

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningCommonLogisticJobLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 80,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'address',
					field: 'Address.Address',
					name: 'Address',
					name$tr$: 'basics.common.entityAddress',
					width: 150
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					width: 150,
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'zipcode',
					field: 'Address.ZipCode',
					name: '*ZipCode',
					name$tr$: 'cloud.common.entityZipCode',
					formatter: 'description',
					width: 80
				},
				{
					id: 'city',
					field: 'Address.City',
					name: '*City',
					name$tr$: 'cloud.common.entityCity',
					formatter: 'description',
					width: 80
				},
				{
					id: 'addressline',
					field: 'Address.AddressLine',
					name: '*Address',
					name$tr$: 'cloud.common.entityAddress',
					formatter: 'description',
					width: 150
				}
			]
		});

		var lookupDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'logistic/job/', endPointRead: 'lookuplistbyfilter'},
			filterParam: readData,
			prepareFilter: function prepareFilter(item) {
				readData.projectFk = item;
				return readData;
			},
			disableDataCaching: true
		};

		return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
	}

})(angular);
