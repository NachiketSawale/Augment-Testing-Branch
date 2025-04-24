
(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estLineItemSubPackageLookupDataService',
		['$q','$http','estimateMainPrcPackage2HeaderLookupDataService',
			function ($q,$http,estimateMainPrcPackage2HeaderLookupDataService) {

				let service = angular.extend({}, estimateMainPrcPackage2HeaderLookupDataService);

				return service;
			}]);
})();
