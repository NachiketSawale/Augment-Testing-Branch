/**
 * Created by xsi on 2016-06-17.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName='constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainGroupLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var lookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'constructionsystem/master/header/', endPointRead: 'getgrouplookuplist' }
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);
})(angular);