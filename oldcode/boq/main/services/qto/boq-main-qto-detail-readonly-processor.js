/**
 * Created by lnt on 05/06/2020.
 */

(function (angular) {
	'use strict';
	angular.module('boq.main').factory('boqMainQtoDetailReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory', 'qtoBoqType',
			function (qtoReadOnlyProcessorFactory, qtoBoqType) {
				var service = qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.PrjBoq);

				return service;
			}]);
})(angular);