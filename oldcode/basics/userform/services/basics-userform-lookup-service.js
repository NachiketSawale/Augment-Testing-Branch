/**
 * Created by Peter on 16.12.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserFormLookupService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsUserFormLookupService', [
		'globals',
		'platformLookupDataServiceFactory',
		function (
			globals,
			platformLookupDataServiceFactory) {

			var config = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/userform/', endPointRead: 'list'},
				filterParam: 'rubricId'
			};

			var container = platformLookupDataServiceFactory.createInstance(config);

			container.service.getlookupType = function () {
				return 'basicsUserFormLookupService';
			};

			return container.service;

		}]);
})(angular);
