(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonRootBoqItemLookupService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/common/wizard/',
					endPointRead: 'getrootboqitemsbyfilter',
					usePostForRead: true
				},
				filterParam: {},
				prepareFilter: function prepareFilter(param) {

					return param;
				}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);
})(angular);
