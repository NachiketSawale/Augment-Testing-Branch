/**
 * Created by Chisom on 17.08.2019.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name controllingActualsValueTypeLookupDataService
     * @function
     *
     * @description
     * controllingActualsValueTypeLookupDataService is the data service for all company year related functionality.
     */
	angular.module('basics.lookupdata')
		.factory('controllingActualsValueTypeLookupDataService',
			['platformLookupDataServiceFactory',  'basicsLookupdataConfigGenerator',

				function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {
					//var readData =  { PKey1: null };
					basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingActualsValueTypeLookupDataService', {
						valMember: 'Id',
						dispMember: 'Description',
						columns:[
							{
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								width: 80,
								formatter: 'translation',
								name$tr$: 'cloud.common.entityDescription'
							}
						],
						uuid: '8c30c0a1f5a845e5b5f64a1fbdc1df92'
					});

					var companyValueTypeLookupDataServiceConfig = {
						httpRead: {route: globals.webApiBaseUrl + 'basics/customize/valuetype/',
							endPointRead: 'list',
							usePostForRead: true
						},
					};

					var valueTypeService = platformLookupDataServiceFactory.createInstance(companyValueTypeLookupDataServiceConfig).service;

					valueTypeService.getValueTypes = function getValueTypes() {
						return valueTypeService.getList({ lookupType: 'basics/customize/valuetype/', usePostForRead: true });
					};

					return valueTypeService;
				}]);
})(angular);
