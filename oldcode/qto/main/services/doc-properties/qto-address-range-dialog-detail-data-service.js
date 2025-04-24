
(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	
	angular.module(moduleName).factory('qtoAddressRangeDialogDetailDataService', ['qtoAddressRangeDetailServiceFactory',
		function (qtoAddressRangeDetailServiceFactory) {
			let service = qtoAddressRangeDetailServiceFactory.CreateQtoAddressRangeDetailService('qtoAddressRangeDialogDetailDataService');
			return service;
		}]);
})(angular);
