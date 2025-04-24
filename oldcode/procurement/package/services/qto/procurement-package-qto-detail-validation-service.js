/**
 * Created by lnt on 21.05.2020.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('procurementPackageQtoDetailValidationService', ['procurementPackageQtoDetailService', 'qtoDetailValidationServiceFactory','qtoBoqType',
		function (dataService, qtoDetailValidationServiceFactory,qtoBoqType) {

			var service = {};

			service = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService,qtoBoqType.PrcBoq);

			return service;
		}
	]);
})(angular);
