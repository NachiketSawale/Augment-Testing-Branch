/**
 * Created by Cakiral on 14.07.2020.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basPackagingTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basPackagingTypeLookupDataService is the data service for all packagingTy basPackagingTypeLookupDataService lookup related functionality.
	 */
	var moduleName = 'resource.equipment';
	angular.module(moduleName).factory('basPackagingTypeLookupDataService', [ 'platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/packagingtypes/', endPointRead: 'list', usePostForRead: true }
			};
			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
