/**
 * Created by Joshi on 27.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsMdcWorkCategoryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsMdcWorkCategoryLookupDataService is the data service for Mdc Work category related functionality.
	 */
	angular.module('basics.masterdata').factory('basicsMdcWorkCategoryLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var workCategoryLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'cloud/masterdatacontext/', endPointRead: 'lookuptree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
				tree: { parentProp: 'WorkCategoryParentFk', childProp: 'ChildItems' }
			};

			return platformLookupDataServiceFactory.createInstance(workCategoryLookupDataServiceConfig).service;
		}]);
})(angular);
