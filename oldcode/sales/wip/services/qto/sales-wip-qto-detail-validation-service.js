/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';
	angular.module(moduleName).factory('salesWipQtoDetailValidationService', ['salesWipQtoDetailService', 'qtoDetailValidationServiceFactory', 'qtoBoqType',
		function (dataService, qtoDetailValidationServiceFactory, qtoBoqType) {

			var service = {};

			service = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService, qtoBoqType.WipBoq);

			return service;
		}
	]);
})(angular);
