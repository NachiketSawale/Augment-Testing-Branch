

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesQtoDetailValidationService', ['procurementPesQtoDetailService', 'qtoDetailValidationServiceFactory','qtoBoqType',
		function (dataService, qtoDetailValidationServiceFactory,qtoBoqType) {

			var service = {};

			service = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService, qtoBoqType.PesBoq);

			return service;
		}
	]);
})(angular);
