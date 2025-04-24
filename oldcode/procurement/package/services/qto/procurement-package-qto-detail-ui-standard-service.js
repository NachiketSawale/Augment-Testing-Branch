/**
 * Created by lnt on 13.07.2018.
 */

(function (angular) {
	'use strict';

	var modName = 'procurement.package';

	angular.module(modName).factory('procurementPackageQtlDetailUIStandardService', ['qtoMainDetailLayoutServiceFactory', 'qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			return qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.PrcBoq);
		}
	]);
})(angular);



