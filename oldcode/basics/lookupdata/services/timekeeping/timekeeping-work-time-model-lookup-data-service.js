/**
 * Created by shen on 6/17/2021
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelLookupDataService
	 * @description timekeepingWorkTimeModelLookupDataService is the data service for all work time models
	 */
	angular.module('basics.lookupdata').factory('timekeepingWorkTimeModelLookupDataService', ['$injector','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingWorkTimeModelLookupDataService', {
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
				uuid: '5700b79cdc7c46d4842d54f080436abd'
			});

			let workTimeModelLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/', endPointRead: 'lookup'},
				showFilteredData: true,
				filterOnLoadFn: function (item) {
					return item.IsLive;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(workTimeModelLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
