(angular => {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsItemStatusLookupDataService', service);

	service.$inject = ['platformLookupDataServiceFactory'];

	function service(platformLookupDataServiceFactory) {
		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'basics/customize/ppsitemstatus/',
				endPointRead: 'list',
				usePostForRead: true,
			},
			dataIsAlreadySorted: true,
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);