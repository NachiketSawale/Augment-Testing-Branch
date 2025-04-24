/**
 * Created by jpfriedel on 11/08/2022
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelFbLookupDataService
	 * @description timekeepingWorkTimeModelFbLookupDataService is the data service for all work time models
	 */
	angular.module('basics.lookupdata').factory('timekeepingWorkTimeModelFbLookupDataService', ['$injector','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingWorkTimeModelFbLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '5766b79cdc7c46d5846d54f0814786abx'
			});

			let workTimeModelFbLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/', endPointRead: 'fblookup'},

			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(workTimeModelFbLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
