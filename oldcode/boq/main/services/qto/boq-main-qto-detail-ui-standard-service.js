/**
 * Created by lnt on 13.07.2018.
 */

(function (angular) {
	'use strict';

	var modName = 'boq.main';

	angular.module(modName).factory('boqMainQtlDetailUIStandardService', ['qtoMainDetailLayoutServiceFactory', 'qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			var service = qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.PrjBoq);

			return service;
		}
	]);
})(angular);



