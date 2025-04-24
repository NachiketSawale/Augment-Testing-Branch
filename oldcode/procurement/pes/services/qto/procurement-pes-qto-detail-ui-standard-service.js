(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.pes';

	angular.module(modName).factory('procurementPesQtoDetailUIStandardService', ['qtoMainDetailLayoutServiceFactory', 'qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			return qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.PesBoq);
		}
	]);
})(angular);



