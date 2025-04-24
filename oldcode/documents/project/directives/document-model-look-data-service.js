/**
 * Created by alm on 26.8.2026.
 */
(function (angular) {
	'use strict';
	/* global  _ */
	/**
     * @ngdoc service
     * @name modelLookupDataService
     * @function
     *
     * @description
     * modelLookupDataService is the data service for activity look ups
     */
	angular.module('documents.project').factory('documentModelProjectModelLookupDataService', ['globals','$q','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','basicsLookupdataLookupDescriptorService',

		function (globals,$q,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,basicsLookupdataLookupDescriptorService) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('documentModelProjectModelLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '7dc75d8975f94b92b1ad3f9c69036310'
			});

			var modelProjectModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/project/model/', endPointRead: 'listonlymodel' },
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					if (Id === null || Id === undefined)
					{
						Id = 1;
					}
					return '?mainItemId=' + Id;
				}
			};

			var container= platformLookupDataServiceFactory.createInstance(modelProjectModelLookupDataServiceConfig);
			var service=container.service;
			var copyGetItemByIdAsyncFn=angular.copy(service.getItemByIdAsync);

			service.getItemByIdAsync=function(ID, options){
				var models=basicsLookupdataLookupDescriptorService.getData('Model');
				var defer = $q.defer();
				copyGetItemByIdAsyncFn(ID, options).then(function(res){
					if(res){
						defer.resolve(res);
					}
					else{
						var filterResult=_.get(models,ID);
						defer.resolve(filterResult);
					}
				});
				return defer.promise;
			};
			return service;
		}]);
})(angular);
