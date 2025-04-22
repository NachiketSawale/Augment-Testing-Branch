/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var modName = 'sales.wip';

	angular.module(modName).factory('salesWipQtoListUIStandardService', ['qtoMainDetailLayoutServiceFactory', 'qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			var service = qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.WipBoq);

			return service;
		}
	]);
})(angular);



