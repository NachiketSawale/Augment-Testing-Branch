/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipQtoLocationLookupService', ['qtoProjectLocationLookupDataServiceFactory', 'qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory, qtoBoqType) {

			var service = qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.WipBoq);

			return service;

		}]);
})(angular);
