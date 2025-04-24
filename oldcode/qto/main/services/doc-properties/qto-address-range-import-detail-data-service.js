
(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	
	angular.module(moduleName).factory('qtoAddressRangeImportDetailDataService', ['qtoAddressRangeDetailServiceFactory',
		function (qtoAddressRangeDetailServiceFactory) {
			let service = qtoAddressRangeDetailServiceFactory.CreateQtoAddressRangeDetailService('qtoAddressRangeImportDetailDataService');
			return service;
		}]);
})(angular);

