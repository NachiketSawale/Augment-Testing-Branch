(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesQtoLocationLookupService', ['qtoProjectLocationLookupDataServiceFactory', 'qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory, qtoBoqType) {

			return qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.PesBoq);

		}]);
})(angular);