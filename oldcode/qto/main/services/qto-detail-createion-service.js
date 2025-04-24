/**
 * Created by alm on 11.30.2017.
 */
(function () {
	'use strict';

	var moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainCreationService', ['qtoCreationServiceProvider',
		function (qtoCreationServiceProvider) {
			return qtoCreationServiceProvider.getInstance();
		}]);
})();
