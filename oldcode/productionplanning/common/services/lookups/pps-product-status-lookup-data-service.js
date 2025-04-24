(angular => {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsProductStatusLookupDataService', service);

	service.$inject = ['platformLookupDataServiceFactory'];

	function service(platformLookupDataServiceFactory) {
		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'basics/customize/ppsproductstatus/',
				endPointRead: 'list',
				usePostForRead: true,
			},
			dataIsAlreadySorted: true,
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);