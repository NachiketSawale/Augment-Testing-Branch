(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.pes').factory('procurementPesQtoDetailReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory', 'qtoBoqType',
			function (qtoReadOnlyProcessorFactory, qtoBoqType) {
				return qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.PesBoq);
			}]);
})(angular);