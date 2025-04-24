(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoMainDetailGridValidationService', ['qtoMainDetailService', 'qtoDetailValidationServiceFactory','qtoBoqType',
		function (dataService, qtoDetailValidationServiceFactory,qtoBoqType) {
			var service = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService,qtoBoqType.QtoBoq);
			return service;
		}
	]);
})(angular);
