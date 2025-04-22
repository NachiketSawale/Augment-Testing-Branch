/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('sales.wip').factory('salesWipQtoDetailReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory', 'qtoBoqType',
			function (qtoReadOnlyProcessorFactory, qtoBoqType) {
				var service = qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.WipBoq);

				return service;
			}]);
})(angular);
