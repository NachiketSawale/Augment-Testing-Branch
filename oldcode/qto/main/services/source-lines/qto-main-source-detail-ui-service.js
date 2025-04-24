/**
 * Created by lnt on 23.10.2023.
 */

(function (angular) {

	'use strict';

	let modName = 'qto.main';

	angular.module(modName).factory('qtoMainSourceDetailUIService', ['qtoMainDetailLayoutServiceFactory','qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			return qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.QtoBoq, true);
		}
	]);
})(angular);



