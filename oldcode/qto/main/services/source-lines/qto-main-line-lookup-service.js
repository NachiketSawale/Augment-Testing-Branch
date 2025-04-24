(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	let qtoMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection

	qtoMainModule.factory('qtoMainLineLookupService', ['qtoMainHeaderDataService', 'qtoMainDetailServiceFactory', 'qtoQtoReadOnlyProcessor','qtoBoqType',
		function ( parentService, qtoMainDetailServiceFactory, qtoQtoReadOnlyProcessor, qtoBoqType) {
			let service = {};

			let serviceContainer = qtoMainDetailServiceFactory.createNewQtoMainDetailService(parentService, qtoQtoReadOnlyProcessor, moduleName, 'qtoMainLineLookupService',qtoBoqType.QtoBoq);
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);