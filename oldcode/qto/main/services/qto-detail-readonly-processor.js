/**
 * Created by lnt on 05/06/2020.
 */

(function (angular) {
	'use strict';
	angular.module('qto.main').factory('qtoQtoReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory','qtoBoqType',
			function (qtoReadOnlyProcessorFactory,qtoBoqType) {
				return qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.QtoBoq);
			}]);
})(angular);