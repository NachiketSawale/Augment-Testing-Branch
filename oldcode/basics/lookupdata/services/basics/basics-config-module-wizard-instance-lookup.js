(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsConfigModuleWizardInstanceLookupService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var config = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/wizard2group/',
					endPointRead: 'listByModuleWithGroup'
				},
				filterParam: 'moduleId',
				usePostForRead: false
			};

			return platformLookupDataServiceFactory.createInstance(config).service;

		}]);

})(angular);


