/**
 * Created by Joshi on 25.02.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingStructureUnitLookupDataService
	 * @function
	 *
	 * @description
	 * controllingStructureUnitLookupDataService is the data service for all controlling unit related functionality.
	 */
	angular.module('object.project').factory('objectProjectLevelLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			var readData =  { PKey1: -1 };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('objectProjectLevelLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.code'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'b7bc3f1313f34832bebca303c38df364'
			});



			var objectProjectLevelLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'object/project/level/', endPointRead: 'listbyparent', usePostForRead: true},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					return { PKey1: item.HeaderFk };

				}

			};

			return platformLookupDataServiceFactory.createInstance(objectProjectLevelLookupDataServiceConfig).service;
		}]);
})(angular);
