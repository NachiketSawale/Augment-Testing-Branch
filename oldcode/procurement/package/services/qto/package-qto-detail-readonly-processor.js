/**
 * Created by lnt on 05/06/2020.
 */

(function (angular) {
	'use strict';
	angular.module('procurement.package').factory('procurementPackageQtoDetailReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory', 'qtoBoqType',
			function (qtoReadOnlyProcessorFactory, qtoBoqType) {
				return qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.PrcBoq);
			}]);
})(angular);